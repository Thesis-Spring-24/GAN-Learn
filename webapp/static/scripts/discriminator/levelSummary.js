function handleLevelSummary() {

  if (contentLevelTwoLoaded === true) {

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
      cell3.textContent = imageMap[key].correctAnswer;
      row.appendChild(cell3);

      // Column 4: Submitted Answer
      let cell4 = document.createElement('td');
      cell4.textContent = imageMap[key].submittedAnswer === null ? '-' : imageMap[key].submittedAnswer;
      row.appendChild(cell4);

      tableBody.appendChild(row);

    });
  }

}



