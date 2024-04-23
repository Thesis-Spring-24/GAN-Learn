let chosenProbability = null;
let correctAnswer = null;
let feedbackOnAnswer = null;

const computerGenerated = 0;
const trainingPicture = 1;
let imageNumber = 1;
let answerSubmitted = false;

function handleZeroButton() {
  if (answerSubmitted) return;
  chosenProbability = computerGenerated;
  handleProbabilityChange();
}

function handleOneButton() {
  if (answerSubmitted) return;
  chosenProbability = trainingPicture;
  handleProbabilityChange();
}

function handleProbabilityChange() {
  if (chosenProbability === null) return;
  updateProbability();
}

function handleAnswerButton() {
  if (chosenProbability === null || correctAnswer === null) return;

  if (chosenProbability === correctAnswer) {
    setCorrectAnswer();
  } else {
    setWrongAnswer();
  }
  updateFeedbackOnAnswer();
  answerSubmitted = true;
}

function setCorrectAnswer() {
  if (correctAnswer === computerGenerated) {
    feedbackOnAnswer = generatorCorrectText;
  } else {
    feedbackOnAnswer = trainingCorrectText;
  }
}

function setWrongAnswer() {
  if (correctAnswer === computerGenerated) {
    feedbackOnAnswer = generatorWrongText;
  } else {
    feedbackOnAnswer = trainingWrongText;
  }
}

function handleNextButton() {
  if (imageNumber >= Object.keys(imageMap).length) return;
  if (!answerSubmitted) return;

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
  if (chosenProbability === null) {
    documentChosenProbabilty.innerHTML = "Valgt: ";
    return;
  }
  documentChosenProbabilty.innerHTML = `Valgt: ${chosenProbability}`;
}

window.onload = function () {
  let imageElement = document.querySelector(".current-discriminator-image");
  imageElement.src = imageMap["image" + imageNumber].path; // Set image path
  correctAnswer = imageMap["image" + imageNumber].correctAnswer; // Set correct answer
}
