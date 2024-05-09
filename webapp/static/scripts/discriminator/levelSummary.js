let documentLevelHeader = document.querySelector(".level-header");
let startRange = null;
let endRange = null;

// Håndtere når man trykker på continue-button

function handleLevelSummary() {
  findRangeMap();
  handleHeaderSummary();
  createTableContent();
  calculateNumberOfCorrect();

  if (finished) {
    let documentTable = document.querySelector(".summary-table-container");
    let documentContent = document.querySelector(".summary-content-container");
    documentTable.remove();
    let finalSummaryText = document.createElement('p');
    finalSummaryText.textContent = "I har nu gennemført discriminator aktiviteten! I kan nu gå tilbage til oversigten eller prøve igen";
    documentContent.append(finalSummaryText);
  }
}

function createTableContent() {
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

    let table = document.querySelector(".summary-table-container");
    table.style.maxHeight = "50em";
    table.style.overflowY = "scroll";
  });
}

// function handleFinalSummary() {
//   let table = document.querySelector(".summary-table-container");
//   table.style.maxHeight = "50em";
//   table.style.overflowY = "scroll";
// }

function handleHeaderSummary() {
  let documentLevelHeader = document.querySelector(".level-header");
  documentLevelHeader.textContent = `Runde ${currentLevel} resultat`;

  finished = localStorage.getItem("isFinished") === "true" ? true : false;
  if (finished) {
    documentLevelHeader.textContent = "Samlet resultat";

    let documentContinueButton = document.querySelector(".continue-button");
    documentContinueButton.remove();
  }
}

function findRangeMap() {
  finished = localStorage.getItem("isFinished") === "true" ? true : false;
  if (finished) {
    startRange = 0;
    endRange = imagesLevelThree;
    // handleFinalSummary();
    return;
  }
  if (currentLevel === levelOne) {
    startRange = 0;
    endRange = imagesLevelOne;
  } else if (currentLevel === levelTwo) {
    startRange = imagesLevelOne;
    endRange = imagesLevelTwo;
  }
  else if (currentLevel === levelThree) {
    startRange = imagesLevelTwo;
    endRange = imagesLevelThree;
  }
}

function calculateNumberOfCorrect() {
  let correctCount = 0;
  let totalCount = endRange - startRange;

  Object.keys(imageMap).slice(startRange, endRange).forEach((key) => {
    if (imageMap[key].correctAnswer === imageMap[key].submittedAnswer) {
      correctCount++;
    }
  });

  let documentTotalNumberOfCorrect = document.querySelector(".total-number-of-correct");
  documentTotalNumberOfCorrect.textContent = `Antal rigtige: ${correctCount} / ${totalCount}`;
}

function getAnswerType(answer) {
  if (answer === computerGenerated) {
    return "Computergenereret";
  } else if (answer === trainingPicture) {
    return "Træningsbillede";
  }
}



