const hotspots = [
  { id: "hotspot-1", x: 8, y: 18, width: 5, height: 5 },
  { id: "hotspot-2", x: 30, y: 22, width: 5, height: 5 },
  { id: "hotspot-3", x: 71, y: 15, width: 6, height: 6 },
  { id: "hotspot-4", x: 49, y: 87, width: 5, height: 5 },
  { id: "hotspot-5", x: 35, y: 28, width: 5, height: 5 },
];

let foundCups = [];
let timerSeconds = 0;
let timerInterval = null;

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
const instrClose = document.querySelector("#instrClose");
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
}

// Position the colored coffee cup images over the hotspots
function positionCoffeeCups() {
  for (let i = 0; i < hotspots.length; i++) {
    const spot = hotspots[i];

    const cupNum = i + 1;
    const cupImg = document.getElementById(`cup-${cupNum}`);

    if (cupImg) {
      cupImg.style.top = `${spot.y}%`;
      cupImg.style.left = `${spot.x}%`;
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
      clickHotspot(spot.id);
    });

    hotspotLayer.appendChild(hotspotDiv);
  }
}

// Create progress cups
function createProgressCups() {
  progressContainer.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const cupImg = document.createElement("img");
    cupImg.src = `progress/progress${i}.png`;
    cupImg.alt = `Coffee Cup ${i}`;
    cupImg.className = "progress-cup hidden";
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
}

// Navigate back to home screen
function goToHome() {
  congratsPanel.classList.add("hidden");
  gameScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  stopTimer();
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
}

// Reset hotspots and coffee cups
function resetHotspots() {
  for (let i = 0; i < hotspots.length; i++) {
    const spot = hotspots[i];
    const hotspotDiv = document.getElementById(spot.id);
    if (hotspotDiv) {
      hotspotDiv.classList.remove("found");
    }
    const cupNum = i + 1;
    const cupImg = document.getElementById(`cup-${cupNum}`);
    if (cupImg) {
      cupImg.classList.add("hidden");
      cupImg.classList.remove("found");
    }
    const progressCup = document.getElementById(`progress-cup-${cupNum}`);
    if (progressCup) {
      progressCup.classList.add("hidden");
    }
  }
}

// create function to handle hotspot click
function clickHotspot(id) {
  if (foundCups.includes(id)) {
    flashMessage("Already found!");
    return;
  }

  foundCups.push(id);
  markHotspotFound(id);
  updateProgress();
  updateMessage();
  checkWin();
}

// Mark hotspot as found
function markHotspotFound(id) {
  const hotspotDiv = document.getElementById(id);
  if (hotspotDiv) {
    hotspotDiv.classList.add("found");
  }

  const parts = id.split("-");
  const cupNum = parts[1];
  const cupImg = document.getElementById(`cup-${cupNum}`);
  if (cupImg) {
    cupImg.classList.remove("hidden");
    cupImg.classList.add("found");
  }
  const progressCup = document.getElementById(`progress-cup-${cupNum}`);
  if (progressCup) {
    progressCup.classList.remove("hidden");
  }
}

// Update progress display
function updateProgress() {
  for (let i = 1; i <= 5; i++) {
    const cupDiv = document.getElementById(`progress-cup-${i}`);
    const hotspotId = `hotspot-${i}`;
    let isFound = false;
    for (let j = 0; j < foundCups.length; j++) {
      if (foundCups[j] === hotspotId) {
        isFound = true;
        break;
      }
    }
    if (isFound) {
      cupDiv.classList.remove("hidden");
    } else {
      cupDiv.classList.add("hidden");
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
    showCongrats();
  }
}

// Show congratulations panel
function showCongrats() {
  congratsPanel.classList.remove("hidden");
  congratsTime.textContent = `Time: ${formatTime(timerSeconds)}`;
}

// Hide congratulations panel
function hideCongrats() {
  congratsPanel.classList.add("hidden");
}

// Show instructions panel
function showInstructions() {
  instructionsPanel.classList.remove("hidden");
}

// Close instructions panel
function hideInstructions() {
  instructionsPanel.classList.add("hidden");
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
