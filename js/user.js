"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  try {
    currentUser = await User.signup(username, password, name);
    saveUserCredentialsInLocalStorage();
    $signUpMessage.show();
    updateUIOnUserLogin();
    $signupForm.trigger("reset");
  } catch (error) {
    // Handle signup failure
    if (error.response.status === 409) {
      // Bad Request (username already taken)
      // Show an error message to the user
      $signUpMessage
        .text("Sorry, this username is already taken!")
        .css("color", "red")
        .show();
    } else {
      // Handle other types of errors (e.g., network issues)
      $signUpMessage.text("Signup failed. An error occurred.").show();
    }
  }
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  $(".main-nav-links").hide();
  localStorage.clear();
  location.reload();
}
$navSignOut.on("click", logout);

// Log out
function signOut(evt) {
  console.debug("Signed out...");
  $(".main-nav-links").hide();
  localStorage.clear();
  location.reload();
}
$navLogOut.on("click", hideMainNav);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();
  $mainNavLinks.show();
  updateNavOnLogin();
  getAndShowAllStories();
  $signupForm.hide();
  $loginForm.hide();
  $profileEditForm.hide();
}

/** Favrite or unfavorite a story.. */

$("#all-stories-list").on("click", ".fa-star", async function () {
  // Inside the click handler function, "this" refers to the clicked element
  const star = this;

  // Toggle the "fas" and "far" classes on the clicked element
  star.classList.toggle("fas");
  star.classList.toggle("far");

  // Add it to favorites in database.
  const token = currentUser.loginToken;
  const username = currentUser.username;
  const storyId = star.closest("li").id;

  if (star.classList.contains("fas")) {
    console.debug("Favorite story...");
    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/users/${username}/favorites/${storyId}`,
      data: { token },
    });
  } else {
    console.debug("Un-Favorite story...");
    const response = await axios({
      method: "DELETE",
      url: `${BASE_URL}/users/${username}/favorites/${storyId}`,
      data: { token },
    });
  }
});

// Get User info.
function getUserInfo() {
  const username = currentUser.username;
  const profileName = currentUser.name;
  const signUpDate = currentUser.createdAt;
  const numOfStories = currentUser.ownStories.length;

  // set profile details on page.
  $profileName.text(profileName);
  $profileUsername.text(username);
  $profileDate.text(signUpDate);
  $profileStories.text(numOfStories);
}

// update user profile.
// updateProfile

async function updateProfileInfo(evt) {
  console.debug("updateProfileInfo", evt);
  evt.preventDefault();

  // grab the username and password
  const newName = $("#edit-name").val();
  const newPassword = $("#edit-password").val();

  // User.updateProfile retrieves updated user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  await User.updateProfile(newName, newPassword);
  currentUser = await User.login(currentUser.username, newPassword);

  console.log("Profile updated...");
  $profileEditForm.trigger("reset");
  hidePageComponents();
  saveUserCredentialsInLocalStorage();

  updateUIOnUserLogin();
}

$profileEditForm.on("submit", updateProfileInfo);
