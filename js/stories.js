"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let userFavoriteStories;
let userStories;
/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPageForSignedOutUser();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="star">
      <i class="far fa-star"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <hr class="hr-line">
      </li>
    `);
}

//  Put all stories on page for guest
function putStoriesOnPageForSignedOutUser() {
  console.debug("putGuestStoriesOnPage");
  hideMainNav();
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    const starIcon = $story.find(".star i"); // Find the <i> element within the .star element
    starIcon.addClass("hidden");
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
async function putStoriesOnPage(lst) {
  console.debug("putStoriesOnPage");

  const favIds = await getFavStoryIds();
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of lst.stories) {
    const $story = generateStoryMarkup(story);

    if (favIds.includes(story.storyId)) {
      const starIcon = $story.find(".star i"); // Find the <i> element within the .star element
      starIcon.toggleClass("far fas");
    }

    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/*

Mark Fav stories on Page

*/
async function getFavStoryIds() {
  console.debug("getFavStoryIds");
  const favStories = await StoryList.getUserFavStories();
  const storiesData = await favStories.stories;
  let favIds = [];
  for (let story of storiesData) {
    favIds.push(story.storyId);
  }
  return favIds;
}

/** Get input values from the story form and return an object*/
async function submitNewStory(e) {
  console.debug("submitNewStory");
  // Prevent default form behaviour
  e.preventDefault();

  // Capture form data
  const title = $title.val();
  const author = $author.val();
  const url = $url.val();
  const username = currentUser.username;
  const storyData = { title, author, url, username };

  const story = await storyList.addStory(currentUser, storyData);
  const $newStory = generateStoryMarkup(story);
  $allStoriesList.prepend($newStory);
  $allStoriesList.show();
  clearInputs();
}

$submitForm.on("submit", submitNewStory);

/** Clear input values */
function clearInputs() {
  $title.val("");
  $author.val("");
  $url.val("");
  $submitForm.hide();
}

// Get fav stories.
async function getAndShowFavStories() {
  console.debug("getAndShowFavStories");
  userFavoriteStories = await StoryList.getUserFavStories();
  $storiesLoadingMsg.remove();
  if (userFavoriteStories.stories.length === 0) {
    $allStoriesList.empty();
    $allStoriesList.append("<h5>You have not favorated any stories yet!</h5>");
    $allStoriesList.show();
  } else {
    putStoriesOnPage(userFavoriteStories);
  }
}

// Get User Stories.
async function getAndShowUserStories() {
  console.debug("getAndShowUserStories");
  userStories = await StoryList.getUserStories();
  $storiesLoadingMsg.remove();
  if (userStories.stories.length === 0) {
    $allStoriesList.empty();
    $allStoriesList.append("<h5>You have not added any stories yet!</h5>");
    $allStoriesList.show();
  } else {
    putStoriesOnPage(userStories);
  }
}

async function getAndShowAllStories() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage(storyList);
}
