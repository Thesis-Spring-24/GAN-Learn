const WIDTH = 500;
const HEIGHT = 500;
const STROKE_WEIGHT = 3;
const CROP_PADDING = (REPOS_PADDING = 2);

let model;
let clicked = false;
let mousePosition = []

// ----------------------------------------------------------------
const labelToPredict = "helicopter"; // Label to predict
const probabilityThreshold = 0.5; // Threshold of when to consider a prediction as true
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
    const imageBlob = await fetch("/transform", {
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

        // Display the prediction for the label on the user interface
        displayPrediction(labelPrediction);

        // Display the history of drawing attempts
        attemptsHistory(labelPrediction);

    });
};


function attemptsHistory(labelPrediction) {

    // Array to store history of drawing attempts
    let drawingHistory = [];

    // Save the drawing strokes and prediction details to the history
    drawingHistory.push({ image: imageStrokes, prediction: labelPrediction });

    // Display the drawing history
    const historyDisplay = document.getElementById("drawing-history");
    historyDisplay.innerHTML = "";
    drawingHistory.forEach((attempt, index) => {
        const image = createImageFromStrokes(attempt.image);
        const probability = attempt.prediction.probability;
        const status = probability > probabilityThreshold ? "Sandt" : "Falsk";

        historyDisplay.innerHTML += `<div>Attempt ${index + 1}: <img src="${image}" /><br>Probability: ${probability}<br>Status: ${status}</div>`;
    });
}

function displayPrediction(labelPrediction) {
    const predictionDisplay = document.getElementById("prediction-display");
    predictionDisplay.innerHTML = `Probability: ${labelPrediction.probability}`;
    const trueOrFalse = document.getElementById("true-or-false");

    if (labelPrediction.probability > probabilityThreshold) {
        trueOrFalse.innerHTML = `Sandt! Transportmidlet er: ${labelToPredict}`;
    } else {
        trueOrFalse.innerHTML = "Falsk";
    }
}

// Function to create image from strokes
function createImageFromStrokes(strokes) {
    // Create a new canvas element
    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const ctx = canvas.getContext('2d');

    // Draw each stroke on the canvas
    strokes.forEach(stroke => {
        for (let i = 0; i < stroke[0].length; i++) {
            ctx.beginPath();
            ctx.moveTo(stroke[0][i], stroke[1][i]);
            ctx.lineTo(stroke[0][i + 1], stroke[1][i + 1]);
            ctx.stroke();
        }
    });

    // Convert the canvas content to a data URL representing the image
    const imageDataURL = canvas.toDataURL();

    return imageDataURL;
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
    $canvas.addEventListener("mousedown", (e) => mouseDown(e));
    $canvas.addEventListener("mousemove", (e) => mouseMoved(e));

    $submit.addEventListener("click", () => predict($canvas));
    $clear.addEventListener("click", clearCanvas);
};
