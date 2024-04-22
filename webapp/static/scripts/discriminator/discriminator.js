let chosenProbability = null;
let correctAnswer = 0; // Todo: Når et billede loades, sæt korrekt svar her
// Måske billederne skal gemmes med i en ID i en liste sammen med det korrekte svar
let feedbackOnAnswer = null;

const computerGenerated = 0;
const trainingPicture = 1;
let imageNumber = 1;

function handleZeroButton() {
  chosenProbability = computerGenerated;
  handleProbabilityChange();
}

function handleOneButton() {
  chosenProbability = trainingPicture;
  handleProbabilityChange();
}

function handleProbabilityChange() {
  if (chosenProbability === null) return;

  let documentChosenProbabilty = document.querySelector(".chosen-probability");
  documentChosenProbabilty.innerHTML = "Valgt: " + chosenProbability;
  console.log("Valgt sandsynlighed: " + chosenProbability);
}

function handleAnswerButton() {
  if (chosenProbability === null || correctAnswer === null) return;

  if (chosenProbability === correctAnswer) {
    setCorrectAnswer();
  } else {
    setWrongAnswer();
  }

  let documentFeedback = document.querySelector(".feedback-on-answer");
  documentFeedback.innerHTML = feedbackOnAnswer;
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
  imageNumber++;

  let imageElement = document.querySelector(".current-discriminator-image");
  imageElement.src = imageMap["image" + imageNumber].path;
  console.log(imageMap["image" + imageNumber]);
}

window.onload = function () {
  let imageElement = document.querySelector(".current-discriminator-image");
  imageElement.src = imageMap["image" + imageNumber].path;
}
