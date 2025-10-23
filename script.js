const hotspots = [
  { id: "hotspot-1", x: 3.5, y: 11, width: 3, height: 3, cupId: 2 },
  { id: "hotspot-2", x: 61, y: 18, width: 3, height: 3, cupId: 5 },
  { id: "hotspot-3", x: 74.7, y: 19, width: 8.3, height: 12, cupId: 1 },
  { id: "hotspot-4", x: 37, y: 85, width: 3, height: 4, cupId: 4 },
  { id: "hotspot-5", x: 32.3, y: 26, width: 3.4, height: 4, cupId: 3 },
];

let foundCups = [];
let timerSeconds = 0;
let timerInterval = null;
let backgroundMusic = null;
let congratsSound = null;

const homeScreen = document.getElementById("home-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-button");
const resetBtn = document.getElementById("resetBtn");
const homeNav = document.getElementById("homeNav");
const timerDisplay = document.getElementById("timer");
const messageDisplay = document.getElementById("message");
const hotspotLayer = document.getElementById("hotspot-layer");
const progressContainer = document.getElementById("progress-container");
const instructionsBtn = document.getElementById("instructionsBtn");
const instructionsPanel = document.getElementById("instructionsPanel");
const instrClose = document.getElementById("instrClose");
console.log(instrClose);
const congratsPanel = document.getElementById("congratsPanel");
const congratsTime = document.getElementById("congratsTime");
const playAgainBtn = document.getElementById("playAgainBtn");
const backHomeBtn = document.getElementById("backHomeBtn");

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
homeNav.addEventListener("click", goToHome);
instructionsBtn.addEventListener("click", showInstructions);
instrClose.addEventListener("click", hideInstructions);
playAgainBtn.addEventListener("click", resetGame);
backHomeBtn.addEventListener("click", goToHome);

function init() {
  createHotspots();
  createProgressCups();
  positionCoffeeCups();
  initAudio();
}

function initAudio() {
  backgroundMusic = new Audio("sounds/background-music.mp3");
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.18;
  congratsSound = new Audio("sounds/congratulations.mp3");
  congratsSound.volume = 1.0;
  console.log(congratsSound);
}

// Position the colored coffee cup images over the hotspots
function positionCoffeeCups() {
  for (let i = 0; i < hotspots.length; i++) {
    const spot = hotspots[i];
    const cupId = spot.cupId;
    const cupImg = document.getElementById(`cup-${cupId}`);

    if (cupImg) {
      cupImg.style.top = "0";
      cupImg.style.left = "0";
      cupImg.style.width = "100%";
      cupImg.style.height = "100%";
    }
  }
}
// Create hotspot elements
function createHotspots() {
  hotspotLayer.innerHTML = "";

  for (let i = 0; i < hotspots.length; i++) {
    const spot = hotspots[i];
    const hotspotDiv = document.createElement("div");
    hotspotDiv.className = "hotspot";
    hotspotDiv.id = spot.id;
    hotspotDiv.style.left = spot.x + "%";
    hotspotDiv.style.top = spot.y + "%";
    hotspotDiv.style.width = spot.width + "%";
    hotspotDiv.style.height = spot.height + "%";
    hotspotDiv.style.transform = "translate(-50%, -50%)";

    hotspotDiv.addEventListener("click", function () {
      clickHotspot(spot.id, spot.cupId);
    });

    hotspotLayer.appendChild(hotspotDiv);
  }
}

// Create progress bar
function createProgressCups() {
  progressContainer.innerHTML = "";
  const title = document.createElement("h3");
  title.textContent = "Progress";
  progressContainer.parentElement.insertBefore(title, progressContainer);
  for (let i = 1; i <= 5; i++) {
    const cupImg = document.createElement("img");
    cupImg.src = `progress/grey-cup.png`;
    cupImg.alt = `Coffee Cup ${i}`;
    cupImg.className = "progress-cup";
    cupImg.id = `progress-cup-${i}`;
    progressContainer.appendChild(cupImg);
  }
}

// Start the game
function startGame() {
  homeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  foundCups = [];
  timerSeconds = 0;
  updateTimer();
  startTimer();
  updateProgress();
  updateMessage();
  resetHotspots();
  if (backgroundMusic) {
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().catch(function (error) {
      console.log("Audio playback failed:", error);
    });
  }
}

// Navigate back to home screen
function goToHome() {
  congratsPanel.classList.add("hidden");
  gameScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  stopTimer();
  hideInstructions();
  removeOverlay();
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }
}

// Reset the game state
function resetGame() {
  foundCups = [];
  timerSeconds = 0;
  updateTimer();
  startTimer();
  updateProgress();
  updateMessage();
  resetHotspots();
  congratsPanel.classList.add("hidden");
  removeOverlay();
  if (backgroundMusic) {
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().catch(function (error) {
      console.log("Audio playback failed:", error);
    });
  }
}

// Reset hotspots and coffee cups
function resetHotspots() {
  for (let i = 0; i < hotspots.length; i++) {
    const spot = hotspots[i];
    const hotspotDiv = document.getElementById(spot.id);
    if (hotspotDiv) {
      hotspotDiv.classList.remove("found");
    }
    const cupId = spot.cupId;
    const cupImg = document.getElementById(`cup-${cupId}`);
    if (cupImg) {
      cupImg.classList.add("hidden");
      cupImg.classList.remove("found");
    }
    for (let i = 1; i <= 5; i++) {
      const progressCup = document.getElementById(`progress-cup-${i}`);
      if (progressCup) {
        progressCup.src = `progress/grey-cup.png`;
      }
    }
  }
}

// create function to handle hotspot click
function clickHotspot(hotspotId, cupId) {
  if (foundCups.includes(hotspotId)) {
    return;
  }

  foundCups.push(hotspotId);
  markHotspotFound(hotspotId, cupId);
  updateProgress();
  updateMessage();
  checkWin();
}

// Mark hotspot as found
function markHotspotFound(hotspotId, cupId) {
  const hotspotDiv = document.getElementById(hotspotId);
  if (hotspotDiv) {
    hotspotDiv.classList.add("found");
  }
  const cupImg = document.getElementById(`cup-${cupId}`);
  if (cupImg) {
    cupImg.classList.remove("hidden");
    cupImg.classList.add("found");
  }
}

// Update progress display
function updateProgress() {
  const cupsFound = foundCups.length;
  for (let i = 1; i <= 5; i++) {
    const progressCup = document.getElementById(`progress-cup-${i}`);
    if (!progressCup) continue;
    if (i <= cupsFound) {
      progressCup.src = `progress/white-cup.png`;
      progressCup.classList.add("active");
    } else {
      progressCup.src = `progress/grey-cup.png`;
      progressCup.classList.remove("active");
    }
  }
}

// Update message based on cups found
function updateMessage() {
  const cupsFound = foundCups.length;
  if (cupsFound === 0) {
    messageDisplay.textContent =
      "Find all the coffee cups hidden in the scene.";
  } else if (cupsFound < 5) {
    messageDisplay.textContent = `You have found ${cupsFound} out of 5 coffee cups. Keep going!`;
  } else {
    messageDisplay.textContent = "You found all the coffee cups! Well done!";
  }
}

// Check for win condition
function checkWin() {
  if (foundCups.length === 5) {
    stopTimer();
    setTimeout(showCongrats, 500);
  }
}

// Show congratulations panel
function showCongrats() {
  congratsPanel.classList.remove("hidden");
  congratsTime.textContent = `Time: ${formatTime(timerSeconds)}`;
  createOverlay();
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
  if (congratsSound) {
    congratsSound.currentTime = 0;
    congratsSound.play().catch(function (error) {
      console.log("Congrats sound playback failed:", error);
    });
  }
}

// Hide congratulations panel
function hideCongrats() {
  congratsPanel.classList.add("hidden");
  removeOverlay();
}

function createOverlay() {
  removeOverlay();
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "modal-overlay";
  document.body.appendChild(overlay);
}

function removeOverlay() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.remove();
  }
}

// Show instructions panel
function showInstructions() {
  instructionsPanel.classList.remove("hidden");
  instructionsBtn.setAttribute("aria-expanded", "true");
  createOverlay();
}

// Close instructions panel
function hideInstructions() {
  instructionsPanel.classList.add("hidden");
  instructionsBtn.setAttribute("aria-expanded", "false");
  removeOverlay();
}

// Timer functions
function startTimer() {
  stopTimer();
  timerInterval = setInterval(function () {
    timerSeconds = timerSeconds + 1;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimer() {
  timerDisplay.textContent = formatTime(timerSeconds);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const minsStr = mins < 10 ? `0${mins}` : mins;
  const secsStr = secs < 10 ? `0${secs}` : secs;
  return `${minsStr}:${secsStr}`;
}

init();
