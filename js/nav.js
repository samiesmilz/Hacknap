"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

async function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  hideForms();
  if (currentUser === undefined) {
    putStoriesOnPageForSignedOutUser();
  } else {
    await getAndShowAllStories();
  }
}

$body.on("click", "#nav-all", navAllStories);

/** Show fav list of all stories when click favorites */

async function navFavStories(evt) {
  console.debug("navFavStories", evt);
  hidePageComponents();
  await getAndShowFavStories();
  //putStoriesOnPage(userFavoriteStories);
}
$body.on("click", "#nav-favorites", navFavStories);

// Show user-created stories
async function navUserStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  await getAndShowUserStories();
  //putStoriesOnPage(userStories);
}
$body.on("click", "#nav-my-stories", navUserStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show submit-form on click on "submit" */
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  // hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navSubmit.on("click", navSubmitClick);

function signOut() {
  console.log("You have successfully logged out...");
  hideMainNav();
  putStoriesOnPageForSignedOutUser();
}
$navLogOut.on("click", signOut);

function userProfile() {
  console.debug("User profile.");
  hidePageComponents();
  getUserInfo();
  $userProfile.show();
}
$navUserProfile.on("click", userProfile);
