function handleLevelSummary() {

  if (contentSummaryLoaded === true) {

    Object.keys(imageMap).forEach((key, index) => {
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

}

function calculatePercentageCorrect() {
  let correctCount = 0;
  let totalCount = Object.keys(imageMap).length; // Todo: Skal ændres til antal billeder i level 1

  Object.keys(imageMap).forEach((key) => {
    if (imageMap[key].correctAnswer === imageMap[key].submittedAnswer) {
      correctCount++;
    }
  });

  let percentageCorrect = (correctCount / totalCount) * 100;

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



