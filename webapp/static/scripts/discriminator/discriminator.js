let chosenProbability = null;
let correctAnswer = null;
let feedbackOnAnswer = null;
let imageNumber = null;
let answerSubmitted = false;
let contentLevelTwoLoaded;

const computerGenerated = 0;
const thresholdLevelTwo = 4;

function handleProbabilityButton(probability) {
  if (answerSubmitted) return;
  chosenProbability = probability;
  updateProbability();
}

function handleAnswerButton() {
  if (chosenProbability !== null && correctAnswer !== null) {
    feedbackOnAnswer = chosenProbability === correctAnswer ? getFeedbackText(true) : getFeedbackText(false);
    updateFeedbackOnAnswer();
    answerSubmitted = true;

    // Update submittedAnswer value for the current image in imageMap
    imageMap["image" + imageNumber].submittedAnswer = chosenProbability;
    updateLocalStorage();
  }
}

function updateLocalStorage() {
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

  updateImageNumber();

  console.log(imageNumber);
  if (imageNumber > thresholdLevelTwo) {
    console.log("Level 2 content loaded");
    document.querySelector(".discriminator-lower-container").innerHTML = levelTwoContent;
    contentLevelTwoLoaded = true;
    localStorage.setItem("contentLevelTwoLoaded", contentLevelTwoLoaded);
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

function updateImageNumber() {
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

window.onload = function () {
  // Get the imageNumber from LocalStorage
  let storedImageNumber = localStorage.getItem("imageNumber") || 1;
  if (storedImageNumber !== null) {
    imageNumber = parseInt(storedImageNumber);
  }

  // Get the imageMap from LocalStorage
  let storedImageMap = localStorage.getItem("imageMap");
  if (storedImageMap !== null) {
    imageMap = JSON.parse(storedImageMap);
  }

  // Get the contentLevelTwoLoaded from LocalStorage
  contentLevelTwoLoaded = localStorage.getItem("contentLevelTwoLoaded") === "true" ? true : false;

  if (imageNumber > thresholdLevelTwo && contentLevelTwoLoaded === true) {
    document.querySelector(".discriminator-lower-container").innerHTML = levelTwoContent;
    handleLevelSummary();
    console.log(contentLevelTwoLoaded);
  } else {
    document.querySelector(".discriminator-lower-container").innerHTML = levelOneContent;
  }


  let imageElement = document.querySelector(".current-discriminator-image");
  if (imageElement !== null) {
    imageElement.src = imageMap["image" + imageNumber].path; // Set image path
    correctAnswer = imageMap["image" + imageNumber].correctAnswer; // Set correct answer
  }


  let tableBody = document.querySelector("#tableBody");
  let headerRow = document.querySelector("#headerRow");

}
