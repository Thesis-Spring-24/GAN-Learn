let isTraining = false;

document.getElementById("train-btn").addEventListener("click", trainModel);
document.querySelector(".close-btn-modal").addEventListener("click", handleClosingModal);

//Called when the 'træn' button is pressed, starts the animation and calls the displayFlowerTraining function
function trainModel() {
    isTraining = true;
    localStorage.setItem("isTraining", isTraining);
    if (currentDataset == null || currentDataset == "null") {
        alert("Træk et træningsbilleder over for at træne modellen");
    }
    else {
        trainingCountString = localStorage.getItem("trainingCount");

        if (trainingCount === null || trainingCount === "null") {
            trainingCount = 1;
            localStorage.setItem("trainingCount", trainingCount);
            startAnimation();
            setTimeout(() => {
                stopAnimation();
                displayImageTraining(trainingCount, currentDataset);
                isTraining = false;
                localStorage.setItem("isTraining", isTraining);
                console.log("isTraining", isTraining);
                generateButtonColor();                
            }, 8000);
        }
        else if (trainingCount < 5) {
            trainingCount++;
            localStorage.setItem("trainingCount", trainingCount);
            clearGeneratedImage();
            startAnimation();
            setTimeout(() => {
                stopAnimation();
                displayImageTraining(trainingCount, currentDataset);
                isTraining = false;
                localStorage.setItem("isTraining", isTraining);
                console.log("isTraining", isTraining);
            }, 8000);
        }
        else if (trainingCount == 5) {
            alert("Modellen er færdigtrænet")
        }
    }
}

function generateButtonColor() {
    let documentGenerateButton = document.querySelector(".generate-btn");
    documentGenerateButton.style.backgroundColor = "#4CAF50";
}

//when pressing train a flower image is displayed in the training overview
function displayImageTraining(trainingCount, currentdataset) {
    var path;
    if (currentdataset == "flower-dataset") {
        //get the path of the image
        path = flowerLevelList[trainingCount - 1];
    }
    if (currentdataset == "skull-dataset") {
        //get the path of the image
        path = skullLevelList[trainingCount - 1];
    }
    if (currentdataset == "bird-dataset") {
        path = birdLevelList[trainingCount - 1];
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
    text.textContent = "Træning " + trainingCount.toString();

    imgDiv.appendChild(text);

    div.appendChild(imgDiv);

    document.querySelector(".display-training-img-container").appendChild(div);

}

function startAnimation() {
    //do this for 4 seconds
    document.querySelector('.moving-line.gen-to-dis').classList.add('moveLineRight');
    document.querySelector('.moving-line.img-to-dis').classList.add('moveLineRight');
    document.querySelector('.loader.dis').style.display = "flex";

    setTimeout(() => {
        //4 seconds have passed, do this:
        document.querySelector('.loader.dis').style.display = "none";
        document.querySelector('.moving-line.dis-to-gen').classList.add('moveLineLeft');
        document.querySelector('.loader.gen').style.display = "flex";
    }, 4000);
}

function stopAnimation() {
    document.querySelector('.moving-line.gen-to-dis').classList.remove('moveLineRight');
    document.querySelector('.moving-line.img-to-dis').classList.remove('moveLineRight');
    document.querySelector('.moving-line.dis-to-gen').classList.remove('moveLineLeft');
    document.querySelector('.loader.gen').style.display = "none";

}

function displayModal() {
    document.querySelector(".training-information-modal").style.display = "flex";
    document.querySelector(".training-overview").style.display = "none";
    document.querySelector(".generating-overview").style.display = "none";
    trainingCountString = localStorage.getItem("trainingCount");
    trainingCount = parseInt(trainingCountString);
    if (trainingCount == 1) {
        document.querySelector(".modal-text").textContent = flowerCount1;
    }
    if (trainingCount == 2) {
        document.querySelector(".modal-text").textContent = flowerCount2;
    }
    if (trainingCount == 3) {
        document.querySelector(".modal-text").textContent = flowerCount3;
    }
    if (trainingCount == 4) {
        document.querySelector(".modal-text").textContent = flowerCount4;
    }
    if (trainingCount == 5) {
        document.querySelector(".modal-text").textContent = flowerCount5;
    }

}

function handleClosingModal() {
    closeTrainingModal();
    stopAnimation();

}

function closeTrainingModal() {
    document.querySelector(".training-information-modal").style.display = "none";
    document.querySelector(".training-overview").style.display = "flex";
    document.querySelector(".generating-overview").style.display = "flex";
}
