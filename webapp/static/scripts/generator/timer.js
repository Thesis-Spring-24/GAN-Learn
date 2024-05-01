let timerInterval;
let timerDisplay = document.getElementById("timer-display");
let timerSeconds = 10 * 60; // 10 minutes in seconds

function startTimer() {
  clearInterval(timerInterval); // Clear any existing timer

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      alert("Timer finished!");
    }
  }, 1000); // Update timer every second
}

function updateTimerDisplay() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  timerDisplay.textContent = `Timer: ${formatTime(minutes)}:${formatTime(seconds)}`;
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

function stopTimer() {
  clearInterval(timerInterval);
}