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
        startAnimation();
        displayModal();
    }
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
