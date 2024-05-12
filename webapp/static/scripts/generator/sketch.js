const WIDTH = 500;
const HEIGHT = 330;
const STROKE_WEIGHT = 3;
const CROP_PADDING = (REPOS_PADDING = 2);

let model;
let clicked = false;
let mousePosition = []

let correctlyGuessed;


// ----------------------------------------------------------------
const labelToPredict = "crab"; // Label to predict
const probabilityThreshold = 0.70; // Threshold of when to consider a prediction as true
// ----------------------------------------------------------------

// Coordinates of the current drawn stroke [[x1, x2, ..., xn], [y1, y2, ..., yn]]
let strokePixels = [[], []];

// Coordinates of all canvas strokes [[[x1, x2, ..., xn], [y1, y2, ..., yn]], [[x1, x2, ..., xn], [y1, y2, ..., yn]], ...]
let imageStrokes = [];

function inRange(n, from, to) {
    return n >= from && n < to;
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
    strokeWeight(STROKE_WEIGHT);
    stroke("black");
    background("#FFFFFF");
}

function mouseDown() {
    clicked = true;
    mousePosition = [mouseX, mouseY];

    savedTime = localStorage.getItem('savedTime');
    if (!savedTime) {
        startTimer();
    }
}

function mouseMoved() {
    // Check whether mouse position is within canvas
    if (clicked && inRange(mouseX, 0, WIDTH) && inRange(mouseY, 0, HEIGHT)) {
        strokePixels[0].push(Math.floor(mouseX));
        strokePixels[1].push(Math.floor(mouseY));

        line(mouseX, mouseY, mousePosition[0], mousePosition[1]);
        mousePosition = [mouseX, mouseY]
    }
}

function mouseReleased() {
    if (strokePixels[0].length) {
        imageStrokes.push(strokePixels);
        strokePixels = [[], []];
    }
    clicked = false;
}

const loadModel = async () => {
    console.log("Model loading...");

    model = await tflite.loadTFLiteModel("./models/model.tflite");
    model.predict(tf.zeros([1, 28, 28, 1])); // warmup

    console.log(`Model loaded! (${LABELS.length} classes)`);

    // Log the label prediction to the console
    console.log(`Label to predict: ${labelToPredict}`);
};

const preprocess = async (cb) => {
    const { min, max } = getBoundingBox();

    // Resize to 28x28 pixel & crop
    //når der skal laves image: "/transform"
    const imageBlob = await fetch("http://127.0.0.1:8000/transform", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            strokes: imageStrokes,
            box: [min.x, min.y, max.x, max.y],
        }),
    }).then((response) => response.blob());

    const img = new Image(28, 28);
    img.src = URL.createObjectURL(imageBlob);

    img.onload = () => {
        const tensor = tf.tidy(() =>
            tf.browser.fromPixels(img, 1).toFloat().expandDims(0)
        );
        cb(tensor);
    };
};


const getMinimumCoordinates = () => {
    let min_x = Number.MAX_SAFE_INTEGER;
    let min_y = Number.MAX_SAFE_INTEGER;

    for (const stroke of imageStrokes) {
        for (let i = 0; i < stroke[0].length; i++) {
            min_x = Math.min(min_x, stroke[0][i]);
            min_y = Math.min(min_y, stroke[1][i]);
        }
    }

    return [Math.max(0, min_x), Math.max(0, min_y)];
};

const getBoundingBox = () => {
    repositionImage();

    const coords_x = [];
    const coords_y = [];

    for (const stroke of imageStrokes) {
        for (let i = 0; i < stroke[0].length; i++) {
            coords_x.push(stroke[0][i]);
            coords_y.push(stroke[1][i]);
        }
    }

    const x_min = Math.min(...coords_x);
    const x_max = Math.max(...coords_x);
    const y_min = Math.min(...coords_y);
    const y_max = Math.max(...coords_y);

    // New width & height of cropped image
    const width = Math.max(...coords_x) - Math.min(...coords_x);
    const height = Math.max(...coords_y) - Math.min(...coords_y);

    const coords_min = {
        x: Math.max(0, x_min - CROP_PADDING), // Link Kante anlegen
        y: Math.max(0, y_min - CROP_PADDING), // Obere Kante anlegen
    };
    let coords_max;

    if (width > height)
        // Left + right edge as boundary
        coords_max = {
            x: Math.min(WIDTH, x_max + CROP_PADDING), // Right edge
            y: Math.max(0, y_min + CROP_PADDING) + width, // Lower edge
        };
    // Upper + lower edge as boundary
    else
        coords_max = {
            x: Math.max(0, x_min + CROP_PADDING) + height, // Right edge
            y: Math.min(HEIGHT, y_max + CROP_PADDING), // Lower edge
        };

    return {
        min: coords_min,
        max: coords_max,
    };
};

// Reposition image to top left corner
const repositionImage = () => {
    const [min_x, min_y] = getMinimumCoordinates();
    for (const stroke of imageStrokes) {
        for (let i = 0; i < stroke[0].length; i++) {
            stroke[0][i] = stroke[0][i] - min_x + REPOS_PADDING;
            stroke[1][i] = stroke[1][i] - min_y + REPOS_PADDING;
        }
    }
};

const predict = async () => {
    if (!imageStrokes.length) return;

    // Find the index of the label in the LABELS array
    const labelIndex = LABELS.indexOf(labelToPredict);

    // Throw an error if the label is not found
    if (labelIndex === -1) throw new Error(`Label '${labelToPredict}' not found!`);

    preprocess((tensor) => {
        const predictions = model.predict(tensor).dataSync();

        // Retrieve the probability of the label
        let labelProbability = predictions[labelIndex] || 0;

        // Round the probability to 5 decimal places
        labelProbability = parseFloat(labelProbability.toFixed(5));

        // Create an object with the label and its probability
        const labelPrediction = {
            probability: labelProbability,
            className: labelToPredict,
            index: labelIndex,
        };

        //start moving the line
        document.querySelector('.moving-line.gen-to-dis').classList.add('moveLineRight');
        //do not display feedback
        document.querySelector('.inner-feedback-container').style.display = "none";
        //remove old attempt from discriminator
        document.querySelector(".discriminator-image").innerHTML = "";

        setTimeout(() => {
            document.querySelector('.moving-line.gen-to-dis').classList.remove('moveLineRight');
            // Display the prediction for the label on the user interface
            displayPrediction(labelPrediction);

            attemptsHistory(labelPrediction);

            showDataset();

            document.querySelector('.moving-line.dis-to-gen').classList.add('moveLineLeft');

            document.querySelector('.inner-feedback-container').style.display = "flex";

            // Clear the canvas
            clearCanvas();

            correctlyGuessed = localStorage.getItem("correctlyGuessed");
            // Stop the timer if the probability is greater than the threshold
            if (labelPrediction.probability > probabilityThreshold && correctlyGuessed >= 3) {
                stopTimer();
                // showModal();
                document.querySelector('.moving-line.dis-to-gen').classList.remove('moveLineLeft');

            }
            setTimeout(() => {
                document.querySelector('.moving-line.dis-to-gen').classList.remove('moveLineLeft');
            }, 1000);
        }, 1000);




    });
};

function showDataset() {
    correctlyGuessed = localStorage.getItem("correctlyGuessed");

    if (timerSeconds <= 0 || correctlyGuessed >= 3) {
        document.querySelector('.gen-training-data').style.display = "flex";
        document.querySelector('.gen-training-data').classList.add('rotate-img');
        document.querySelector('.help-icon').style.display = "none";
    }
}

function showModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Close the modal when the close button is clicked
    const closeBtn = document.getElementsByClassName("close")[0];
    closeBtn.onclick = function () {
        modal.style.display = "none";
    }
}

// Store the drawing attempts
let drawingAttempts = [];

// Display the history of drawing attempts
function attemptsHistory(labelPrediction) {
    // Get the canvas element
    const canvas = document.getElementById("defaultCanvas0");

    // Store the current drawing attempt
    drawingAttempts.push({
        image: canvas.toDataURL(),
        probability: labelPrediction.probability
    });

    localStorage.setItem("drawingAttempts", JSON.stringify(drawingAttempts));

    appendDrawingAttempts();

    discriminatorImageDiv = document.querySelector(".discriminator-image")

    // Append the latest image attempt to the discriminator image container
    const latestImage = new Image();
    latestImage.src = drawingAttempts[drawingAttempts.length - 1].image;
    latestImage.width = 450;
    latestImage.height = 315;
    discriminatorImageDiv.appendChild(latestImage);
}

function appendDrawingAttempts() {
    // Get the drawing history container element
    const historyDisplay = document.getElementById("drawing-history");

    // Clear the drawing history container
    historyDisplay.innerHTML = "";

    // Iterate through each drawing attempt and display it
    drawingAttempts.forEach((attempt, index) => {
        const image = new Image();
        image.src = attempt.image;
        image.width = 120; // Set the width of the image
        image.height = 120; // Set the height of the image

        // Create a div to display probability
        const attemptDiv = document.createElement("div");
        attemptDiv.className = "attempt";

        attemptDiv.appendChild(image);

        const textDiv = document.createElement("div");
        textDiv.innerHTML = `<pre>Sandsynlighed: \n${attempt.probability}\nVurdering: ${attempt.probability > probabilityThreshold ? "\nTræningsbillede" : "\nGenereret billede"}</pre>`;
        attemptDiv.appendChild(textDiv);


        // Append the image and div to the drawing history container
        historyDisplay.appendChild(attemptDiv);
    });
}


function displayPrediction(labelPrediction) {
    const predictionDisplay = document.getElementById("prediction-display");
    predictionDisplay.innerHTML = `${labelPrediction.probability}`;
    const trueOrFalse = document.getElementById("true-or-false");

    if (labelPrediction.probability > probabilityThreshold) {
        trueOrFalse.innerHTML = `Træningsbillede`;

        correctlyGuessed = localStorage.getItem("correctlyGuessed");
        if (correctlyGuessed == undefined || correctlyGuessed == null) {
            correctlyGuessed = 1;
            localStorage.setItem("correctlyGuessed", correctlyGuessed);
        } else {
            correctlyGuessed++;
            localStorage.setItem("correctlyGuessed", correctlyGuessed);
        }

    } else {
        trueOrFalse.innerHTML = `Genereret billede`;
    }
}


const clearCanvas = () => {
    clear();
    background("#FFFFFF");
    imageStrokes = [];
    strokePixels = [[], []];
};

window.onload = () => {
    const $submit = document.getElementById("predict");
    const $clear = document.getElementById("clear");
    const $canvas = document.getElementById("defaultCanvas0");

    loadModel();
    if ($canvas != null) {
        $canvas.addEventListener("mousedown", (e) => mouseDown(e));
        $canvas.addEventListener("mousemove", (e) => mouseMoved(e));
    }

    $submit.addEventListener("click", () => predict($canvas));
    $clear.addEventListener("click", clearCanvas);

    // Get the drawing attempts from the local storage
    drawingAttempts = JSON.parse(localStorage.getItem("drawingAttempts")) || [];
    appendDrawingAttempts();

    correctlyGuessed = localStorage.getItem("correctlyGuessed")
    if (correctlyGuessed >= 3) {
        document.querySelector('.gen-training-data').style.display = "flex";
    };

    if (localStorage.getItem('sawTrainingData') == "true") {
        showModal();
        document.querySelector('.help-icon').style.display = "none";
    }

    checkTimer();

}

function checkTimer() {
    savedTime = localStorage.getItem('savedTime');
    if (savedTime) {
        timerSeconds = savedTime;
        updateTimerDisplay();
        // startTimer();
    }
}

document.querySelector('.clear-btn-generator-storage').addEventListener("click", clearLocalStorage);

function clearLocalStorage() {
    localStorage.clear();
    location.reload();
}
