let chosenProbability = null;
let correctAnswer = null;
let feedbackOnAnswer = null;
let imageNumber = null;

let answerSubmitted = false;
let contentSummaryLoaded;
let currentLevel = 1; // Initialize current level to 1

let answered = 0;
let correctAnswers = 0;
let correctAndAnswered;


const computerGenerated = 0;
const trainingPicture = 1;
const levelOne = 1;
const levelTwo = 2;
const levelThree = 3;

// VARIABLES TO CHANGE //  
const imagesLevelOne = 4; // TODO: Tilpas til ønsket antal billede i level 1
const imagesLevelTwo = 8; // TODO: Tilpas til ønsket antal billede i level 2
const imagesLevelThree = 12; // TODO: Tilpas til ønsket antal billede i level 3
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
    // answerSubmitted = true;

    // Update submittedAnswer value for the current image in imageMap
    imageMap["image" + imageNumber].submittedAnswer = chosenProbability;
    setImageMap();
    updateNumbersOfCorrect();
    answerSubmitted = true;
  }
}

function updateNumbersOfCorrect() {

  // Problemet er at correctAnswers og answered bliver sat til 0 når siden genindlæses
  // Tilføj variable alt efter hvor man kalder det fra
  // Eller gem correctAnswers og answered i localStorage og hent det her


  let documentNumberOfCorrect = document.querySelector(".number-of-correct");
  if (chosenProbability === correctAnswer && !answerSubmitted) {
    correctAnswers++;
  }
  if (!answerSubmitted && chosenProbability !== null) {
    console.log(chosenProbability);
    answered++;
  }

  correctAndAnswered = `Antal rigtige: ${correctAnswers} / ${answered}`;
  documentNumberOfCorrect.innerHTML = correctAndAnswered;
  localStorage.setItem("correctAndAnswered", correctAndAnswered);
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

  if (imageNumber > imagesLevelOne && currentLevel === levelOne) {
    increaseLevel();
    handleSummary();
    return;
  } else if (imageNumber > imagesLevelTwo && currentLevel === levelTwo) {
    increaseLevel();
    handleSummary();
    return;
  }

  if (imageNumber > imagesLevelThree && currentLevel === levelThree) {
    handleSummary();
    handleFinish();
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

function handleSummary() {
  answered = 0;
  correctAnswers = 0;
  chosenProbability = null;
  loadSummaryContent();
  handleLevelSummary();
}

function increaseLevel() {
  if (currentLevel === levelOne) {
    currentLevel = levelTwo;
  } else if (currentLevel === levelTwo) {
    currentLevel = levelThree;
  }
  localStorage.setItem("currentLevel", currentLevel);
}

function showCurrentLevel() {
  let documentCurrentLevel = document.querySelector(".current-level");
  if (documentCurrentLevel !== null) {
    documentCurrentLevel.innerHTML = `Niveau: ${currentLevel}`;
  }
}

function handleFinish() {
  let documentContinueButton = document.querySelector(".continue-button").innerHTML = "Prøv igen";
  document.querySelector(".continue-button").addEventListener("click", resetLocalStorage);
}

function loadSummaryContent() {
  document.querySelector(".discriminator-lower-container").innerHTML = summaryContent;
  answerSubmitted = false;
  setContentSummaryLoaded(true);
}

function setContentSummaryLoaded(isLoaded) {
  contentSummaryLoaded = isLoaded;
  localStorage.setItem("contentSummaryLoaded", contentSummaryLoaded);
}

function loadMainContent() {
  document.querySelector(".discriminator-lower-container").innerHTML = mainContent;
  loadImage();
  setContentSummaryLoaded(false);
  showCurrentLevel();
  // correctAndAnswered = localStorage.getItem("correctAndAnswered");
  updateNumbersOfCorrect();
}

function loadTrainingContent() {
  document.querySelector(".discriminator-lower-container").innerHTML = trainingContent;
  setContentSummaryLoaded(false);
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

function updateCurrentLevel() {
  let storedCurrentLevel = localStorage.getItem("currentLevel") || 1;
  if (storedCurrentLevel !== null) {
    currentLevel = parseInt(storedCurrentLevel);
  }
}

function handleBackToOverview() {
  window.location.href = "/overview";
}

window.onload = function () {
  updateImageNumber();
  updateImageMap();
  updateContentSummaryLoaded();
  updateCurrentLevel();
  showCurrentLevel();


  let tableBody = document.querySelector("#tableBody");
  let headerRow = document.querySelector("#headerRow");


  if ((currentLevel - 1) === levelOne && imageNumber > imagesLevelOne && contentSummaryLoaded === true) {
    handleSummary();
    return;
  } else if ((currentLevel - 1) === levelTwo && imageNumber > imagesLevelTwo && contentSummaryLoaded === true) {
    handleSummary();
    return;
  } else if ((currentLevel - 1) === levelThree && imageNumber > imagesLevelThree && contentSummaryLoaded === true) {
    handleSummary();
  }

  loadMainContent();
}






