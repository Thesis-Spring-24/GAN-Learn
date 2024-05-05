let documentLevelHeader = document.querySelector(".level-header");
let startRange = null;
let endRange = null;

// Håndtere når man trykker på continue-button

function handleLevelSummary() {
  findRange();
  handleHeaderSummary();

  Object.keys(imageMap).slice(startRange, endRange).forEach((key, index) => {
    let row = document.createElement('tr');

    // Column 1: Number
    let cell1 = document.createElement('td');
    cell1.textContent = index + 1;
    row.appendChild(cell1);

    // Column 2: Image
    let cell2 = document.createElement('td');
    let image = document.createElement('img');
    image.src = imageMap[key].path;
    image.style.width = '50px';
    cell2.appendChild(image);
    row.appendChild(cell2);

    // Column 3: Correct Answer
    let cell3 = document.createElement('td');
    cell3.textContent = getAnswerType(imageMap[key].correctAnswer);
    row.appendChild(cell3);

    // Column 4: Submitted Answer
    let cell4 = document.createElement('td');
    cell4.textContent = getAnswerType(imageMap[key].submittedAnswer);
    row.appendChild(cell4);

    tableBody.appendChild(row);
  });

  calculatePercentageCorrect();
}

function handleHeaderSummary() {
  let documentLevelHeader = document.querySelector(".level-header");
  documentLevelHeader.textContent = `Niveau ${currentLevel} resultat`;
  if (currentLevel === levelThree) {
    documentLevelHeader.textContent = "Samlet resultat";
  }
}

function findRange() {
  if (currentLevel === levelOne) {
    startRange = 0;
    endRange = imagesLevelOne;
  } else if (currentLevel === levelTwo) {
    startRange = imagesLevelOne;
    endRange = imagesLevelTwo;
  }
  else if (currentLevel === levelThree) {
    startRange = 0;
    endRange = imagesLevelThree;
  }
}

function calculatePercentageCorrect() {
  let correctCount = 0; // Todo: Undersøg om correctAnswers kan bruges i stedet (fra localStorage)
  let totalCount = endRange - startRange;

  Object.keys(imageMap).slice(startRange, endRange).forEach((key) => {
    if (imageMap[key].correctAnswer === imageMap[key].submittedAnswer) {
      correctCount++;
    }
  });

  let percentageCorrect = (correctCount / totalCount) * 100;
  percentageCorrect = percentageCorrect.toFixed(2); // Round to 2 decimal places

  let documentPercentageCorrect = document.querySelector(".percentage-correct");
  documentPercentageCorrect.textContent = `Procent rigtige: ${percentageCorrect}%`;
}

function getAnswerType(answer) {
  if (answer === computerGenerated) {
    return "Computergenereret";
  } else if (answer === trainingPicture) {
    return "Træningsbillede";
  }
}



