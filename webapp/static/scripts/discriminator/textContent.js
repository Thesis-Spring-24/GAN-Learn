const generated = `<span class="computer-generated-text">genereret</span>`;
const training = `<span class="training-picture-text">træningsbillede</span>`;

const generatorCorrectText = `Rigtigt! Billedet er ${generated}`;
const generatorWrongText = `Forkert! Det rigtige svar er 0, fordi billedet er ${generated}`;
const trainingCorrectText = `Rigtigt! Det er et ${training}`;
const trainingWrongText = `Forkert! Det rigtige svar er 1, fordi det er et ${training}`;

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
  <div class="left-arrow-container">
  <div class="left-line gen-to-picture"></div>
  <div class="left-line training-to-picture"></div>
  </div>
<div class="lower-middle-container">
<div class="correct-and-level-container">
<h2 class="current-level">Runde: 1</h2>
<p class="number-of-correct">Antal rigtige:</p>
</div>
  <div class="image-generator-container">
  <div class="image-container">
    <img src="" width="150px" class="current-discriminator-image">
  </div>
  </div>
  <div>
  <button class="next-picture-button" onclick="handleNextButton()">Næste billede</button>
</div>
</div>
<div class="right-arrow-container">
<div class="right-line picture-to-dis"></div>
</div>
<div class="lower-right-container">
  <div class="discriminator-probability-container">
  <h2>Discriminator</h2>
    <h3>Sandsynlighed</h3>
    <div class="probability-buttons-container">
    <div class="computer-generated">
    <p>Computergenereret</p> 
    <button class="zero-button" onclick="handleProbabilityButton(0)">0</button>
    </div>
    <div class="training-picture"> 
    <p>Træningsbillede</p>
    <button class="one-button" onclick="handleProbabilityButton(1)">1</button>
    </div>
    </div>
    <p class="chosen-probability">Valgt: </p>
    <button class="check-answer-button" onclick="handleAnswerButton()">Tjek svar</button>
    <div class="container-feedback-on-answer">
      <p class="feedback-on-answer"></p>
    </div>
  </div>
</div>
`;

const summaryContent =
  `<div class="summary-content-container">
  <h2 class="level-header"></h2>
  <p> Herunder kan I se hvor mange og hvilke I fik rigtige: </p>
  <p class="total-number-of-correct"></p>
  <div class="summary-table-container">
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
  </div>
  <button class="continue-button" onclick="handleContinueButton('trainingContent')">Videre</button>
  </div>
`;

const trainingContent =
  `<div class="training-content-container">
  <div> 
  <h1> Generatoren er nu blevet trænet, og er dermed blevet bedre! <h1>
  </div>
 <button class="continue-button" onclick="handleContinueButton('mainContent')">Videre til næste runde</button>
 </div>`;


