"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $favStoriesList = $("#favorited-stories");
const $userStoriesList = $("#my-stories");

const $navSubmit = $("#nav-submit-story");
const $submitForm = $("#submit-form");
const $navSignOut = $("#sign-out");

const $author = $("#create-author");
const $title = $("#create-title");
const $url = $("#create-url");
const $submitStoryBtn = $("#submit-story-btn");

const $editStoryForm = $("#edit-story-form");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $signUpMessage = $("#signup-message");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $userProfile = $("#user-profile");
const $navLogOut = $("#nav-logout");
const $mainNavLinks = $(".main-nav-links");

const $profileName = $("#profile-name");
const $profileUsername = $("#profile-username");
const $profileDate = $("#profile-account-date");
const $profileStories = $("#profile-stories");
const $editProfileBtn = $("#edit-profile-btn");
const $updateProfileBtn = $("#edit-profile-btn");
const $profileEditForm = $("#profile-edit-form");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $favStoriesList,
    $loginForm,
    $signupForm,
    $submitForm,
    $userProfile,
    $editStoryForm,
    $profileEditForm,
  ];
  components.forEach((c) => c.hide());
}

function hideMainNav() {
  const components = [$mainNavLinks];
  components.forEach((c) => c.hide());
}

function hideForms() {
  const components = [
    $loginForm,
    $signupForm,
    $submitForm,
    $allStoriesList,
    $editStoryForm,
    $profileEditForm,
  ];
  components.forEach((c) => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

// console.warn(
//   "HEY STUDENT: This program sends many debug messages to" +
//     " the console. If you don't see the message 'start' below this, you're not" +
//     " seeing those helpful debug messages. In your browser console, click on" +
//     " menu 'Default Levels' and add Verbose"
// );
$(start);
