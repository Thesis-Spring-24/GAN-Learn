let chosenProbability = null;
let correctAnswer = null;
let feedbackOnAnswer = null;
let imageNumber = null;

let answerSubmitted = false;
let contentSummaryLoaded;
let currentLevel = 1; // Initialize current level to 1

let answered = 0;
let correctAnswers = 0;

const computerGenerated = 0;
const trainingPicture = 1;
const levelOne = 1;
const levelTwo = 2;
const levelThree = 3;

// VARIABLES TO CHANGE //  
const imagesLevelOne = 10; // 10
const imagesLevelTwo = 25; // 25
const imagesLevelThree = 40; // 40
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

    // Update submittedAnswer value for the current image in imageMap
    imageMap["image" + imageNumber].submittedAnswer = chosenProbability;
    setImageMap();
    updateNumbersOfCorrect();
    updateArrow("answerSubmitted");
    answerSubmitted = true;
  }
}

function updateArrow(action) {
  if (correctAnswer === null) return;

  let generatorArrow = document.querySelector(".left-line.gen-to-picture");
  let trainingArrow = document.querySelector(".left-line.training-to-picture");
  let imageBorder = document.querySelector(".image-generator-container");
  let discriminatorArrow = document.querySelector(".right-line.picture-to-dis");

  let arrowFullLength = "9.75em";
  let arrowDefaultLength = "";

  // Todo: Refactor this code
  if (action === "answerSubmitted") {
    if (correctAnswer === computerGenerated) {
      generatorArrow.style.width = arrowFullLength;
      generatorArrow.style.backgroundImage = "linear-gradient(to right, var(--genBorderColor) 100%, transparent 50%)";
      generatorArrow.classList.add("active");
      imageBorder.style.borderColor = "var(--genBorderColor)";
      discriminatorArrow.style.backgroundImage = "linear-gradient(to left, var(--genBorderColor) 100%, transparent 50%)";
      discriminatorArrow.classList.add("generator");
    } else if (correctAnswer === trainingPicture) {
      trainingArrow.style.width = arrowFullLength;
      trainingArrow.style.backgroundImage = "linear-gradient(to right, var(--imgBorderColor) 100%, transparent 50%)";
      trainingArrow.classList.add("active");
      imageBorder.style.borderColor = "var(--imgBorderColor)";
      discriminatorArrow.style.backgroundImage = "linear-gradient(to left, var(--imgBorderColor) 100%, transparent 50%)";
      discriminatorArrow.classList.add("training");
    }
  } else if (action === "nextImage") {
    generatorArrow.style.width = arrowDefaultLength;
    generatorArrow.classList.remove("active");
    trainingArrow.style.width = arrowDefaultLength;
    trainingArrow.classList.remove("active");
    imageBorder.style.borderColor = "";
    generatorArrow.style.backgroundImage = "";
    trainingArrow.style.backgroundImage = "";
    discriminatorArrow.style.backgroundImage = "";
    discriminatorArrow.classList.remove("generator");
    discriminatorArrow.classList.remove("training");
  }
}

function updateNumbersOfCorrect() {
  correctAnswers = localStorage.getItem("correctAnswers") || 0;
  answered = localStorage.getItem("answered") || 0;

  let documentNumberOfCorrect = document.querySelector(".number-of-correct");
  if (chosenProbability === correctAnswer && !answerSubmitted) {
    setCorrectAnswers(1);
  }
  if (!answerSubmitted && chosenProbability !== null) {
    setAnswered(1);
  }

  let correctAndAnswered = `Antal rigtige: ${correctAnswers} / ${answered}`;
  documentNumberOfCorrect.innerHTML = correctAndAnswered;

  saveScore(correctAndAnswered);
}

function saveScore(score) {
  if (currentLevel === levelOne) {
    localStorage.setItem("levelOneScore", score);
  } else if (currentLevel === levelTwo) {
    localStorage.setItem("levelTwoScore", score);
  } else if (currentLevel === levelThree) {
    localStorage.setItem("levelThreeScore", score);
  }

}

function setAnswered(value) {
  if (value === 1) {
    answered++;
  } else if (value === 0) {
    answered = 0;
  }
  localStorage.setItem("answered", answered);
}

function setCorrectAnswers(value) {
  if (value === 1) {
    correctAnswers++;
  } else if (value === 0) {
    correctAnswers = 0;
  }

  localStorage.setItem("correctAnswers", correctAnswers);

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

  // TODO: Simplify the following code
  if (imageNumber > imagesLevelOne && currentLevel === levelOne) {
    handleSummary();
    return;
  } else if (imageNumber > imagesLevelTwo && currentLevel === levelTwo) {
    handleSummary();
    return;
  }
  if (imageNumber > imagesLevelThree && currentLevel === levelThree) {
    handleSummary();
    setFinished(true);
    let documentContinueButton = document.querySelector(".continue-button");
    documentContinueButton.textContent = "Samlet resultat";
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
  updateArrow("nextImage");
}

function setFinished(isFinished) {
  localStorage.setItem("isFinished", isFinished);
}

function handleSummary() {
  setAnswered(0);
  setCorrectAnswers(0);
  chosenProbability = null;
  loadSummaryContent();
  handleLevelSummary();
}

function increaseLevel() {
  if (currentLevel === levelOne) {
    currentLevel = levelTwo;
  } else if (currentLevel === levelTwo) {
    currentLevel = levelThree;
  } else if (currentLevel === levelThree) {
    currentLevel = levelThree + 1;
  }
  localStorage.setItem("currentLevel", currentLevel);
}

function showCurrentLevel() {
  let documentCurrentLevel = document.querySelector(".current-level");
  if (documentCurrentLevel !== null) {
    documentCurrentLevel.innerHTML = `Runde: ${currentLevel}`;
  }
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
  updateNumbersOfCorrect();
}

function loadTrainingContent() {
  document.querySelector(".discriminator-lower-container").innerHTML = trainingContent;
  setContentSummaryLoaded(false);
}

function handleContinueButton(nextContent) {
  finished = localStorage.getItem("isFinished") === "true" ? true : false;
  if (finished) {
    handleSummary();
    return;
  }

  if (nextContent == "trainingContent") {
    loadTrainingContent();
  }
  if (nextContent == "mainContent") {
    loadMainContent();
    increaseLevel();
    showCurrentLevel();
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
  let answerType = getAnswerType(chosenProbability);
  let documentChosenProbabilty = document.querySelector(".chosen-probability");
  documentChosenProbabilty.innerHTML = chosenProbability === null ? "Valgt: " : `Valgt: ${answerType} (${chosenProbability})`;
}

function resetLocalStorage() {
  if (confirm("Er du sikker på du vil starte forfra?")) {
    localStorage.removeItem("correctAnswers");
    localStorage.removeItem("answered");
    localStorage.removeItem("imageMap");
    localStorage.removeItem("imageNumber");
    localStorage.removeItem("currentLevel");
    localStorage.removeItem("isFinished");
    localStorage.removeItem("levelOneScore");
    localStorage.removeItem("levelTwoScore");
    localStorage.removeItem("levelThreeScore");
    location.reload();
    setFinished(false);
    console.log("LocalStorage cleared");
  }
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

  let tableBody = document.querySelector("#tableBody");
  let headerRow = document.querySelector("#headerRow");

  finished = localStorage.getItem("isFinished") === "true" ? true : false;

  // TODO: Simplify the following code
  if (finished) {
    handleSummary();
    return;
  } else if (currentLevel === levelOne && imageNumber > imagesLevelOne && contentSummaryLoaded === true) {
    handleSummary();
    return;
  } else if (currentLevel === levelTwo && imageNumber > imagesLevelTwo && contentSummaryLoaded === true) {
    handleSummary();
    return;
  } else if (currentLevel === levelThree && imageNumber > imagesLevelThree && contentSummaryLoaded === true) {
    handleSummary();
    return;
  }

  loadMainContent();
}






