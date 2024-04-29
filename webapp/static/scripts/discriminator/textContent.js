const generatorCorrectText = "Rigtigt! Billedet er genereret";
const generatorWrongText = "Forkert! Det rigtige svar er 0, fordi billedet er genereret";
const trainingCorrectText = "Rigtigt! Det er et træningsbillede";
const trainingWrongText = "Forkert! Det rigtige svar er 1, fordi det er et træningsbillede"

const mainContent =
  `<div class="lower-left-container">
  <div class="generator-container"> 
  <h2>Generator</h2>
  </div>
  <div class="training-pictures-container"> 
  <div class="training-pictures-box"> 
  <h2>Træningsbilleder</h2>

  </div>
  </div>
  </div>
<div class="lower-middle-container">
  <div class="image-generator-container">
  <div class="image-container">
    <img src="" width="150px" class="current-discriminator-image">
  </div>
  </div>
  <div>
  <button class="next-picture-button" onclick="handleNextButton()">Næste billede</button>
</div>
</div>
<div class="lower-right-container">
  <div class="discriminator-probability-container">
  <h2>Discriminator</h2>

    <h3>Sandsynlighed</h3>
    <div class="probability-buttons-container">
    <button class="zero-button" onclick="handleProbabilityButton(0)">0</button>
    <button class="one-button" onclick="handleProbabilityButton(1)">1</button>
    </div>
    <p class="chosen-probability">Valgt: </p>
    <button class="check-answer-button" onclick="handleAnswerButton()">Tjek svar</button>
    <div>
      <p class="feedback-on-answer"></p>
    </div>
  </div>
</div>`;

const summaryContent =
  `<div class="summary-content-container">
  <h2 class="level-header">Niveau 1 resultat</h2>
  <p class="percentage-correct"></p>
  <table id="imageTable">
    <tr id="headerRow">
      <th>Nr.</th>
      <th>Billede</th>
      <th>Det korrekte svar</th>
      <th>Jeres svar</th>
    </tr>
    <tbody id="tableBody">
    </tbody>
  </table>
  <button class="continue-button" onclick="handleContinueButton('trainingContent')">Videre</button>
</div>`;

const trainingContent =
  `<div class="training-content-container">
 HER KAN DU TRÆNE GENERATOREN
 <button class="continue-button" onclick="handleContinueButton('mainContent')">Videre</button>
 </div>`;


