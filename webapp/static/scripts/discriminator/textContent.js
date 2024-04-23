const generatorCorrectText = "Rigtigt! Billedet er genereret";
const generatorWrongText = "Forkert! Det rigtige svar er 0, fordi billedet er genereret";
const trainingCorrectText = "Rigtigt! Det er et træningsbillede";
const trainingWrongText = "Forkert! Det rigtige svar er 1, fordi det er et træningsbillede"

const levelOneContent = `
<div class="lower-left-container">1</div>
<div class="lower-middle-container">
  2
  <div class="image-container">
    <img src="" width="150px" class="current-discriminator-image">
  </div>
  <div>
    <button class="next-picture-button" onclick="handleNextButton()">Næste billede</button>
  </div>
</div>
<div class="lower-right-container">
  3
  <div class="discriminator-probability-container">
    <h3>Sandsynlighed</h3>
    <button class="zero-button" onclick="handleProbabilityButton(0)">0</button>
    <button class="one-button" onclick="handleProbabilityButton(1)">1</button>
    <p class="chosen-probability">Valgt: </p>
    <button class="check-answer-button" onclick="handleAnswerButton()">Tjek svar</button>
    <div>
      <p class="feedback-on-answer"></p>
    </div>
  </div>
</div>`;

const levelTwoContent = "<p> Level summary </p> ";


