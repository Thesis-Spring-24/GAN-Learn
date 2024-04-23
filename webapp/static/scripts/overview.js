var currentDataset;

document.getElementById("gen-btn").addEventListener("click", navigateToGenerator);
document.getElementById("dis-btn").addEventListener("click", navigateToDiscriminator);
document.getElementById("train-btn").addEventListener("click", trainModel);

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

function trainModel() {
    if (currentDataset == null) {
        alert("Træk et træningsbilleder over for at træne modellen");
    }
    else {

    }

}
