var currentDataset;
let flowerCount;
let generatorCount;

document.getElementById("gen-btn").addEventListener("click", navigateToGenerator);
document.getElementById("dis-btn").addEventListener("click", navigateToDiscriminator);
document.getElementById("train-btn").addEventListener("click", trainModel);
document.getElementById("generate-btn").addEventListener("click", retrieveImg);
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
        let preName = "displayFlowerLevel";
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
}

function dragDrop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    event.target.appendChild(draggedElement);
    if (event.target.id == "dataset-div") {
        var draggedElementId = draggedElement.id;
        currentDataset = draggedElementId;
        //save in local storage
        localStorage.setItem("currentDataset", currentDataset);
    }
    else {
        //når træningsbillederne bliver trukket tilbage fra modellen, så skal billederne i training-overview fjernes
        clearTrainingOverview(flowerCount);
        clearGeneratedImage();
        currentDataset = null;
        flowerCount = null;
        localStorage.setItem("currentDataset", currentDataset);
        localStorage.setItem("flowerCount", flowerCount);

    }
    console.log("current Dataset", currentDataset);
    console.log("flower count", flowerCount);
}

//when pressing train a flower image is displayed in the training overview
function displayFlowerTraining(flowerCount) {
    console.log("in the display flower training method")
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
    if (currentDataset == null || currentDataset == "null") {
        alert("Træk et træningsbilleder over for at træne modellen");
    }
    if (currentDataset == "flower-dataset") {
        flowerCountString = localStorage.getItem("flowerCount");
        if (flowerCount === null || flowerCount === "null") {
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
        localStorage.setItem("flowerCount", flowerCount);
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
        displayFlowerTraining(1);
    }
    if (flowerCount == 2) {
        displayFlowerTraining(1);
        displayFlowerTraining(2);
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