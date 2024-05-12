var currentDataset;
let trainingCount;
let skullCount;
let generatorCount;
let animationRunning = false;
let dataSetInModel = localStorage.getItem("dataSetInModel");
let generatorActivityDone = false;
let discriminatorActivityDone = false;

document.getElementById("gen-btn").addEventListener("click", navigateToGenerator);
document.getElementById("dis-btn").addEventListener("click", navigateToDiscriminator);
document.getElementById("generate-btn").addEventListener("click", generateImg);
document.getElementById("local-storage").addEventListener("click", clearLocalStorage);

function navigateToGenerator() {
    generatorActivityDone = true;
    localStorage.setItem("generatorActivityDone", generatorActivityDone);
    window.location.href = "/generator";
}

function navigateToDiscriminator() {
    discriminatorActivityDone = true;
    localStorage.setItem("discriminatorActivityDone", discriminatorActivityDone);
    window.location.href = "/discriminator";
}

function navigateToFlowers() {
    window.location.href = "/flowers";
}

function clearTrainingOverview(trainingCount) {
    document.querySelector(".display-training-img-container").innerHTML = "";

}

function clearGeneratedImage() {
    document.getElementById("displayGeneratedImg").innerHTML = "";
}

function allowDrop(event) {
    event.preventDefault();
}

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
    dataSetInModel = localStorage.getItem("dataSetInModel")
    if (dataSetInModel == false || dataSetInModel == undefined || dataSetInModel == "false") {
        document.getElementById("dataset-div").style.border = "0.3em dashed  #C11B7F";
    }

}

function dragDrop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    var datasetDiv = document.getElementById("dataset-div");

    if (datasetDiv.children.length > 0 && !datasetDiv.contains(draggedElement)) {
        return
    }

    event.target.appendChild(draggedElement);
    datasetDiv.style.border = "0.3em solid  #C11B7F";

    if (event.target.id == "dataset-div") {
        var draggedElementId = draggedElement.id;
        currentDataset = draggedElementId;
        localStorage.setItem("currentDataset", currentDataset);

        dataSetInModel = true;
        localStorage.setItem("dataSetInModel", dataSetInModel);
    }
    else {
        //når træningsbillederne bliver trukket tilbage fra modellen, så skal billederne i training-overview fjernes
        clearTrainingOverview(trainingCount);
        clearGeneratedImage();
        currentDataset = null;
        trainingCount = null;
        localStorage.setItem("currentDataset", currentDataset);
        localStorage.setItem("trainingCount", trainingCount);

        dataSetInModel = false;
        localStorage.setItem("dataSetInModel", dataSetInModel);

    }
}

//displays the generated image
function displayImg(level) {
    currentDataset = localStorage.getItem("currentDataset");
    let imageMap;

    if (currentDataset == "flower-dataset") {
        imageMap = generatedFlowersMap;
    }
    if (currentDataset == "skull-dataset") {
        imageMap = generatedSkullsMap;
    }
    if (currentDataset == "bird-dataset") {
        imageMap = generatedBirdsMap;
    }

    var key = level - 1;
    var keyString = key.toString();
    const randomIndex = Math.floor(Math.random() * imageMap.get(keyString).length);
    var listOfImages = imageMap.get(keyString);
    var path = listOfImages[randomIndex];
    var img = document.createElement('img');
    img.src = path;
    img.width = 100;

    document.getElementById("displayGeneratedImg").appendChild(img);
}

function displayGeneratingArrow() {
    document.querySelector(".generating-arrow").style.display = "flex";
    document.getElementById("displayGeneratedImg").style.border = "0.3em solid rgb(240, 159, 54)";
    var numberOfChildNodes = document.getElementById("displayGeneratedImg").childNodes.length;
    if (numberOfChildNodes > 0) {
        document.getElementById("displayGeneratedImg").removeChild(document.getElementById("displayGeneratedImg").childNodes[0]);
    }

    setTimeout(function () {
        document.querySelector(".generating-arrow").style.display = "none";
        document.getElementById("dataset-div").style.border = "0.3em solid  #C11B7F";
        document.getElementById("dis-box").style.border = "0.3em solid rgb(81, 188, 250)";
        displayImg(trainingCount);
    }, 2000);
}

//called when the 'generer' button is pressed, calls the displayImg function
function generateImg() {
    isTraining = localStorage.getItem("isTraining");
    if (isTraining == true || isTraining == "true") {
        alert("Vent til træningen er færdig");
        return;
    }
    if (currentDataset == null) {
        alert("Du skal vælge træningsbilleder og træne modellen før du kan generere nye billelder");
    }
    if (trainingCount == null) {
        alert("Træn modellen først");
    }
    if (trainingCount > 0) {
        displayGeneratingArrow();
    }
}

function clearLocalStorage() {
    localStorage.clear();
    location.reload();
}

window.onload = function () {
    //get the current dataset from local storage

    if (localStorage.getItem("generatorActivityDone") == "true") {

        removeOverlayDiscriminator();
    }
    if (localStorage.getItem("discriminatorActivityDone") == "true") {
        removeOverLayProcess();
    }
    currentDataset = localStorage.getItem("currentDataset");
    trainingCount = localStorage.getItem("trainingCount");
    updateTrainingSet(currentDataset);
    updateTrainingOverview(trainingCount, currentDataset);
    //updateGeneratedImage(trainingCount);
}

function removeOverlayDiscriminator() {
    document.querySelector('.overlay.discriminator').style.display = "none";
}

function removeOverLayProcess() {
    document.querySelector('.overlay.process').style.display = "none";
    const container = document.querySelector('.process-activity-container');
    const divs = container.querySelectorAll('div');
    divs.forEach(div => {
        div.classList.remove('lockedItem');
    });
    document.querySelector('.gen-box').classList.remove('lockedItem');
    document.querySelector('.dis-box').classList.remove('lockedItem');
}


//place the correct image in 'training images' in the model overview
function updateTrainingSet(currentDataSet) {
    if (currentDataSet == "flower-dataset") {
        document.getElementById("dataset-div").appendChild(document.getElementById("flower-dataset"));
    }
    if (currentDataSet == "skull-dataset") {
        document.getElementById("dataset-div").appendChild(document.getElementById("skull-dataset"));
    }
    if (currentDataSet == "bird-dataset") {
        document.getElementById("dataset-div").appendChild(document.getElementById("bird-dataset"));
    }
}

function updateTrainingOverview(trainingCount, currentDataSet) {
    for (let i = 1; i <= trainingCount; i++) {

        var path;
        if (currentDataSet == "flower-dataset") {
            //get the path of the image
            path = flowerLevelList[i - 1];
        }
        if (currentDataSet == "skull-dataset") {
            //get the path of the image
            path = skullLevelList[i - 1];
        }
        if (currentDataSet == "bird-dataset") {
            path = birdLevelList[i - 1];
        }

        var div = document.createElement('div');
        div.className = "container-img";

        var imgDiv = document.createElement('div');
        imgDiv.className = "displayLevelImg";

        var img = document.createElement('img');
        img.src = path;
        img.width = 100;

        imgDiv.appendChild(img);

        var text = document.createElement('p');
        text.textContent = "Træning " + i.toString();

        imgDiv.appendChild(text);

        div.appendChild(imgDiv);

        document.querySelector(".display-training-img-container").appendChild(div);

    }
}

//noget der ikke er håndteret: hvis man opdatere siden bliver der vist et nyt genereret billede og ikke det samme som før
function updateGeneratedImage(trainingCount) {
    if (trainingCount == "null" || trainingCount == null) {
        return;
    }
    else {
        displayImg(trainingCount);
    }

}