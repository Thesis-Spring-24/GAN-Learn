let timerInterval;
let timerDisplay = document.getElementById("timer-display");
let timerSeconds = 10 * 60; // 10 minutes in seconds
let savedTime;

function startTimer() {
  clearInterval(timerInterval); // Clear any existing timer

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();

    if (timerSeconds == 210) { // 3:30 minutes
      document.querySelector('.hint-timer-text').style.display = 'inline';
    }
    if (timerSeconds == 90) { // 1:30 minutes
      document.querySelector('.hint-timer-text-2').style.display = 'inline';
    }

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      showDataset();
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
  savedTime = timerSeconds;
  localStorage.setItem('savedTime', savedTime);
  clearInterval(timerInterval);
}