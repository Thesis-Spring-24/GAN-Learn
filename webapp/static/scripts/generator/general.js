let sawTrainingData = false;

document.querySelector('.back-btn').addEventListener('click', navigateToHome);

function navigateToHome() {
    window.location.href = '/overview';
}

function navigateToTrainingData() {
    sawTrainingData = true;
    localStorage.setItem('sawTrainingData', sawTrainingData);
    window.location.href = '/genTrainingImg';
}