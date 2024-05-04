var currentDataset;
let flowerCount;
let skullCount;
let trainingCount;
let generatorCount;
let animationRunning = false;
let dataSetInModel = localStorage.getItem("dataSetInModel");

document.getElementById("gen-btn").addEventListener("click", navigateToGenerator);
document.getElementById("dis-btn").addEventListener("click", navigateToDiscriminator);
document.getElementById("generate-btn").addEventListener("click", generateImg);
document.getElementById("local-storage").addEventListener("click", clearLocalStorage);

function navigateToGenerator() {
    window.location.href = "/generator";
}

function navigateToDiscriminator() {
    window.location.href = "/discriminator";
}

function navigateToFlowers() {
    window.location.href = "/flowers";
}

function clearTrainingOverview(flowerCount) {
    for (let i = flowerCount; i > 0; i--) {
        let preName = "displayImageLevel";
        let number = i.toString();
        var id = preName.concat(number);
        document.getElementById(id).innerHTML = "";
    }
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
    console.log("in drag start, dataSetInModel", dataSetInModel)
    console.log(typeof dataSetInModel)
    if (dataSetInModel == false || dataSetInModel == undefined || dataSetInModel == "false") {
        document.getElementById("dataset-div").style.border = "0.3em dashed  #C11B7F";
    }

}

function dragDrop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    event.target.appendChild(draggedElement);
    document.getElementById("dataset-div").style.border = "0.3em solid  #C11B7F";
    if (event.target.id == "dataset-div") {
        var draggedElementId = draggedElement.id;
        currentDataset = draggedElementId;
        localStorage.setItem("currentDataset", currentDataset);

        dataSetInModel = true;
        localStorage.setItem("dataSetInModel", dataSetInModel);


    }
    else {
        //når træningsbillederne bliver trukket tilbage fra modellen, så skal billederne i training-overview fjernes
        clearTrainingOverview(flowerCount);
        clearGeneratedImage();
        currentDataset = null;
        flowerCount = null;
        localStorage.setItem("currentDataset", currentDataset);
        localStorage.setItem("flowerCount", flowerCount);

        dataSetInModel = false;
        localStorage.setItem("dataSetInModel", dataSetInModel);

    }
    console.log("current Dataset", currentDataset);
    console.log("flower count", flowerCount);
}

//displays the generated image
function displayImg(level) {
    var key = level - 1;
    var keyString = key.toString();
    const randomIndex = Math.floor(Math.random() * generatedFlowersMap.get(keyString).length);
    var listOfFlowers = generatedFlowersMap.get(keyString);
    var path = listOfFlowers[randomIndex];
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
        displayImg(flowerCount);
    }, 2000);
}

//called when the 'generer' button is pressed, calls the displayImg function
function generateImg() {
    if (currentDataset == null) {
        alert("Du skal vælge træningsbilleder og træne modellen før du kan generere nye billelder");
    }
    if (currentDataset == "flower-dataset") {
        if (flowerCount == null) {
            alert("Træn modellen først");
        }
        if (flowerCount > 0) {
            displayGeneratingArrow();
        }
    }
}

function clearLocalStorage() {
    localStorage.clear();
    location.reload();
}

window.onload = function () {
    //get the current dataset from local storage
    currentDataset = localStorage.getItem("currentDataset");
    flowerCount = localStorage.getItem("flowerCount");
    console.log("data to be shown", currentDataset);
    console.log("flower count from on load", flowerCount);
    updateTrainingSet(currentDataset);
    updateTrainingOverview(flowerCount, currentDataset);
    updateGeneratedImage(flowerCount);
}

//place the correct image in 'training images' in the model overview
function updateTrainingSet(currentDataSet) {
    if (currentDataSet == "flower-dataset") {
        document.getElementById("dataset-div").appendChild(document.getElementById("flower-dataset"));
    }
}

function updateTrainingOverview(flowerCount, currentDataSet) {
    if (flowerCount == 1) {
        console.log("knows that flower count is 1")
        displayImageTraining(1);
    }
    if (flowerCount == 2) {
        displayImageTraining(1);
        displayImageTraining(2);
    }
}

//noget der ikke er håndteret: hvis man opdatere siden bliver der vist et nyt genereret billede og ikke det samme som før
function updateGeneratedImage(flowerCount) {
    console.log("type of flowercount", typeof flowerCount)
    console.log("flower count", flowerCount)
    if (flowerCount == "null" || flowerCount == null) {
        return;
    }
    else {
        displayImg(flowerCount);
    }

}