let chosenProbability = null;
let correctAnswer = null;
let feedbackOnAnswer = null;
let imageNumber = null;
let answerSubmitted = false;

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
  if (imageNumber >= Object.keys(imageMap).length || !answerSubmitted) return;

  imageNumber++;
  feedbackOnAnswer = "";

  let imageElement = document.querySelector(".current-discriminator-image");
  imageElement.src = imageMap["image" + imageNumber].path;
  correctAnswer = imageMap["image" + imageNumber].correctAnswer;
  updateFeedbackOnAnswer();
  answerSubmitted = false;
  chosenProbability = null;
  updateProbability();

  // Update LocalStorage with the new imageNumber
  localStorage.setItem("imageNumber", imageNumber);

  if (imageNumber === thresholdLevelTwo) {
    document.querySelector(".discriminator-lower-container").innerHTML = levelTwoContent;
  }
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

  if (imageNumber === thresholdLevelTwo) {
    document.querySelector(".discriminator-lower-container").innerHTML = levelTwoContent;
  } else {
    document.querySelector(".discriminator-lower-container").innerHTML = levelOneContent;
  }


  let imageElement = document.querySelector(".current-discriminator-image");
  if (imageElement !== null) {
    imageElement.src = imageMap["image" + imageNumber].path; // Set image path
    correctAnswer = imageMap["image" + imageNumber].correctAnswer; // Set correct answer
  }

}
