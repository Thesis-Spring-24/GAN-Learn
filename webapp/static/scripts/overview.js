// import { getFlowerLevelImage } from "./dataMaps.js";

var currentDataset;
let flowerCount;
let generatorCount;

document.getElementById("gen-btn").addEventListener("click", navigateToGenerator);
document.getElementById("dis-btn").addEventListener("click", navigateToDiscriminator);
document.getElementById("train-btn").addEventListener("click", trainModel);
document.getElementById("generate-btn").addEventListener("click", retrieveImg);

function navigateToGenerator() {
    window.location.href = "/generator";
}

function navigateToDiscriminator() {
    window.location.href = "/discriminator";
}

function navigateToFlowers() {
    window.location.href = "/flowers";
}

function allowDrop(event) {
    event.preventDefault();
}

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dragDrop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    event.target.appendChild(draggedElement);
    if (event.target.id == "dataset-div") {
        var draggedElementId = draggedElement.id;
        currentDataset = draggedElementId;
    }
    else {
        currentDataset = null;
    }
    console.log(currentDataset);
}


function displayFlowerTraining(flowerCount) {
    //get the path of the image
    var path = flowerLevelList[flowerCount - 1];
    console.log(path)
    var img = document.createElement('img');
    img.src = path;
    img.width = 100;

    let preName = "displayFlowerLevel";
    let number = flowerCount.toString();
    var id = preName.concat(number);

    //append the image
    document.getElementById(id).appendChild(img);
}


function trainModel() {
    if (currentDataset == null) {
        alert("Træk et træningsbilleder over for at træne modellen");
    }
    if (currentDataset == "flower-dataset") {
        if (flowerCount == null) {
            flowerCount = 1;
        }
        else {
            flowerCount++;
        }
        if (flowerCount == 1) {
            displayFlowerTraining(1);
        }
        if (flowerCount == 2) {
            displayFlowerTraining(2);
        }
        console.log(flowerCount);
    }
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

    var numberOfChildNodes = document.getElementById("displayGeneratedImg").childNodes.length;
    if (numberOfChildNodes > 0) {
        document.getElementById("displayGeneratedImg").removeChild(document.getElementById("displayGeneratedImg").childNodes[0]);
    }

    document.getElementById("displayGeneratedImg").appendChild(img);
}

//called when the 'træn' button is pressed, calls the displayImg function
function retrieveImg() {
    if (currentDataset == null) {
        alert("Træk et træningsbilleder over for at generere et billede");
    }
    if (currentDataset == "flower-dataset") {
        if (flowerCount == null) {
            alert("Træn modellen først");
        }
        if (flowerCount == 1) {
            displayImg(1);
        }
    }
}

