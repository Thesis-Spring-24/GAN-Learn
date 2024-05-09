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
            }, 5000);
        }
        else if (trainingCount < 5) {
            trainingCount++;
            localStorage.setItem("trainingCount", trainingCount);
            startAnimation();
            clearGeneratedImage();
            setTimeout(() => {
                stopAnimation();
                displayImageTraining(trainingCount, currentDataset);
                isTraining = false;
                localStorage.setItem("isTraining", isTraining);
                console.log("isTraining", isTraining);
            }, 5000);
        }
        else if (trainingCount == 5) {
            alert("Modellen er færdigtrænet")
        }
    }

}

//when pressing train a flower image is displayed in the training overview
function displayImageTraining(trainingCount, currentdataset) {
    var path;
    console.log("current dataset", currentdataset)
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

    var img = document.createElement('img');
    img.src = path;
    img.width = 100;

    let preName = "displayImageLevel";
    let number = trainingCount.toString();
    var id = preName.concat(number);

    //append the image
    document.getElementById(id).appendChild(img);
}

function startAnimation() {
    document.querySelector('.moving-line.gen-to-dis').classList.add('moveLineRight');
    document.querySelector('.moving-line.img-to-dis').classList.add('moveLineRight');
    document.querySelector('.moving-line.dis-to-gen').classList.add('moveLineLeft');
    setTimeout(() => {
        stopAnimation();
    }, 15000);
}

function stopAnimation() {
    document.querySelector('.moving-line.gen-to-dis').classList.remove('moveLineRight');
    document.querySelector('.moving-line.img-to-dis').classList.remove('moveLineRight');
    document.querySelector('.moving-line.dis-to-gen').classList.remove('moveLineLeft');

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
