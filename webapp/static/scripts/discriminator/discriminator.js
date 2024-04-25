let chosenProbability = null;
let correctAnswer = null;
let feedbackOnAnswer = null;
let imageNumber = null;

let answerSubmitted = false;
let contentSummaryLoaded;
let currentLevel = 1; // Initialize current level to 1

const computerGenerated = 0;
const trainingPicture = 1;

// VARIABLES TO CHANGE //  
const imagesLevelOne = 3; // TODO: Tilpas til ønsket antal billede i level 1
const imagesLevelTwo = 5; // TODO: Tilpas til ønsket antal billede i level 2
const imagesLevelThree = 9; // TODO: Tilpas til ønsket antal billede i level 3
// ------------------- //

function handleProbabilityButton(probability) {
  if (answerSubmitted) return;
  chosenProbability = probability;
  updateProbability();
}

function handleAnswerButton() {
  if (chosenProbability !== null && correctAnswer !== null) {

    feedbackOnAnswer = chosenProbability === correctAnswer ? getFeedbackText(true) : getFeedbackText(false);
    updateFeedbackOnAnswer();
    // updateProbability();
    answerSubmitted = true;

    // Update submittedAnswer value for the current image in imageMap
    imageMap["image" + imageNumber].submittedAnswer = chosenProbability;
    setImageMap();
  }
}

function setImageMap() {
  localStorage.setItem("imageMap", JSON.stringify(imageMap));
}

/**
 * Returns the feedback text based on the correctness of the answer.
 *
 * @param {boolean} isCorrect - Indicates whether the answer is correct or not.
 * @returns {string} - The feedback text based on the correctness of the answer.
 */
function getFeedbackText(isCorrect) {
  return isCorrect ? (correctAnswer === computerGenerated ? generatorCorrectText : trainingCorrectText) :
    (correctAnswer === computerGenerated ? generatorWrongText : trainingWrongText);
}

function handleNextButton() {
  // if (imageNumber >= Object.keys(imageMap).length || !answerSubmitted) return;
  if (!answerSubmitted) return; // TODO: Måske det andet tjek også skal være her

  increaseImageNumber();

  console.log(`ImageNumber: ${imageNumber}`);

  if (imageNumber > imagesLevelOne) {
    loadSummaryContent();
    contentSummaryLoaded = true;
    localStorage.setItem("contentSummaryLoaded", contentSummaryLoaded);
    handleLevelSummary();
    return;
  }

  let imageElement = document.querySelector(".current-discriminator-image");
  imageElement.src = imageMap["image" + imageNumber].path;
  correctAnswer = imageMap["image" + imageNumber].correctAnswer;
  answerSubmitted = false;
  feedbackOnAnswer = "";
  chosenProbability = null;
  updateFeedbackOnAnswer();
  updateProbability();
}

function loadSummaryContent() {
  document.querySelector(".discriminator-lower-container").innerHTML = summaryContent;
  answerSubmitted = false;
}

function loadMainContent() {
  document.querySelector(".discriminator-lower-container").innerHTML = mainContent;
  loadImage();
}

function loadTrainingContent() {
  document.querySelector(".discriminator-lower-container").innerHTML = trainingContent;
}

function handleContinueButton(nextContent) {
  if (nextContent == "trainingContent") {
    loadTrainingContent();
  }
  if (nextContent == "mainContent") {
    loadMainContent();
  }
}

function increaseImageNumber() {
  imageNumber++;
  localStorage.setItem("imageNumber", imageNumber);
}

function updateFeedbackOnAnswer() {
  let documentFeedback = document.querySelector(".feedback-on-answer");
  documentFeedback.innerHTML = feedbackOnAnswer;
}

function updateProbability() {
  let documentChosenProbabilty = document.querySelector(".chosen-probability");
  documentChosenProbabilty.innerHTML = chosenProbability === null ? "Valgt: " : `Valgt: ${chosenProbability}`;
}

function resetLocalStorage() {
  localStorage.clear();
  location.reload();
  console.log("LocalStorage cleared");
}

function updateContentSummaryLoaded() {
  contentSummaryLoaded = localStorage.getItem("contentSummaryLoaded") === "true" ? true : false;
}

function updateImageMap() {
  let storedImageMap = localStorage.getItem("imageMap");
  if (storedImageMap !== null) {
    imageMap = JSON.parse(storedImageMap);
  }
}

function updateImageNumber() {
  let storedImageNumber = localStorage.getItem("imageNumber") || 1;
  if (storedImageNumber !== null) {
    imageNumber = parseInt(storedImageNumber);
  }
}

function loadImage() {
  let imageElement = document.querySelector(".current-discriminator-image");
  if (imageElement !== null) {
    imageElement.src = imageMap["image" + imageNumber].path; // Set image path
    correctAnswer = imageMap["image" + imageNumber].correctAnswer;
  }
}

window.onload = function () {
  updateImageNumber();
  updateImageMap();
  updateContentSummaryLoaded();

  if (imageNumber > imagesLevelOne && contentSummaryLoaded === true) {
    loadSummaryContent();
    handleLevelSummary();
  } else {
    loadMainContent();
  }

  loadImage();

  let tableBody = document.querySelector("#tableBody");
  let headerRow = document.querySelector("#headerRow");

}






