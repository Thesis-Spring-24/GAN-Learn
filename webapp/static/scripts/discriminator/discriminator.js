let chosenProbability = null;
let correctAnswer = null;
let feedbackOnAnswer = null;
let imageNumber = 1;
let answerSubmitted = false;

const computerGenerated = 0;
const trainingPicture = 1;

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
  }
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
}

function updateFeedbackOnAnswer() {
  let documentFeedback = document.querySelector(".feedback-on-answer");
  documentFeedback.innerHTML = feedbackOnAnswer;
}

function updateProbability() {
  let documentChosenProbabilty = document.querySelector(".chosen-probability");
  documentChosenProbabilty.innerHTML = chosenProbability === null ? "Valgt: " : `Valgt: ${chosenProbability}`;
}

window.onload = function () {
  let imageElement = document.querySelector(".current-discriminator-image");
  imageElement.src = imageMap["image" + imageNumber].path; // Set image path
  correctAnswer = imageMap["image" + imageNumber].correctAnswer; // Set correct answer
}
