document.getElementById("train-btn").addEventListener("click", trainModel);
document.querySelector(".close-btn-modal").addEventListener("click", handleClosingModal);

//Called when the 'træn' button is pressed, starts the animation and calls the displayFlowerTraining function
function trainModel() {
    if (currentDataset == null || currentDataset == "null") {
        alert("Træk et træningsbilleder over for at træne modellen");
    }
    if (currentDataset == "flower-dataset") {
        flowerCountString = localStorage.getItem("flowerCount");
        if (flowerCount === null || flowerCount === "null") {
            flowerCount = 1;
            displayImageTraining(flowerCount, currentDataset);
            localStorage.setItem("flowerCount", flowerCount);
            startAnimation();
            displayModal();
        }
        else if (flowerCount < 5) {
            flowerCount++;

            displayImageTraining(flowerCount, currentDataset);
            localStorage.setItem("flowerCount", flowerCount);
            startAnimation();
            displayModal();
        }
        else if (flowerCount == 5) {
            alert("Modellen er færdigtrænet")
        }
    }

    if (currentDataset == "skull-dataset") {
        console.log("now that it is skulls")
        skullCountString = localStorage.getItem("skullCount");
        console.log("skull count", skullCount)
        if (skullCountString === null || skullCountString === "null") {
            skullCount = 1;
            displayImageTraining(skullCount, currentDataset);
            localStorage.setItem("skullCount", skullCount);
            startAnimation();
            displayModal();
        }
        else if (skullCount < 5) {
            skullCount++;

            displayImageTraining(skullCount, currentDataset);
            localStorage.setItem("skullCount", skullCount);
            startAnimation();
            displayModal();
        }
        else if (skullCount == 5) {
            alert("Modellen er færdigtrænet")
        }
    }
}

//when pressing train a flower image is displayed in the training overview
function displayImageTraining(trainingCount, currentdataset) {
    if (currentdataset == "flower-dataset") {
        //get the path of the image
        var path = flowerLevelList[trainingCount - 1];
        var img = document.createElement('img');
        img.src = path;
        img.width = 100;

        let preName = "displayImageLevel";
        let number = trainingCount.toString();
        var id = preName.concat(number);

        //append the image
        document.getElementById(id).appendChild(img);
    }

    if (currentdataset == "skull-dataset") {
        //get the path of the image
        var path = skullLevelList[trainingCount - 1];
        var img = document.createElement('img');
        img.src = path;
        img.width = 100;

        let preName = "displayImageLevel";
        let number = trainingCount.toString();
        var id = preName.concat(number);

        //append the image
        document.getElementById(id).appendChild(img);
    }


}

function startAnimation() {
    document.querySelector('.moving-line.gen-to-dis').classList.add('moveLineRight');
    document.querySelector('.moving-line.img-to-dis').classList.add('moveLineRight');
    document.querySelector('.moving-line.dis-to-gen').classList.add('moveLineLeft');
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
    flowerCountString = localStorage.getItem("flowerCount");
    flowerCount = parseInt(flowerCountString);
    if (flowerCount == 1) {
        document.querySelector(".modal-text").textContent = flowerCount1;
    }
    if (flowerCount == 2) {
        document.querySelector(".modal-text").textContent = flowerCount2;
    }
    if (flowerCount == 3) {
        document.querySelector(".modal-text").textContent = flowerCount3;
    }
    if (flowerCount == 4) {
        document.querySelector(".modal-text").textContent = flowerCount4;
    }
    if (flowerCount == 5) {
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
