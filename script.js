const hotspots = [
  { id: "hotspot-1", y: 11, width: 8, height: 8 },
  { id: "hotspot-2", y: 90, width: 4, height: 4 },
  { id: "hotspot-3", y: 73, width: 3, height: 3 },
  { id: "hotspot-4", y: 62, width: 3, height: 8 },
  { id: "hotspot-5", y: 11, width: 3, height: 15 },
];

let foundCups = [];
let timerSeconds = 0;
let timerInterval = null;

const homescreen = document.getElementById("homescreen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-button");
const resetBtn = document.getElementById("reset-button");
const homeNavBtn = document.getElementById("homeNav");
const timerDisplay = document.getElementById("timer");
const messageDisplay = document.getElementById("message");
const hotspotLayer = document.querySelectorAll(".hotspot-layer");
const progressContainer = document.getElementById("progress-container");
const instructionsBtn = document.getElementById("instructions-button");
const instructionsPanel = document.getElementById("instructions-panel");
const instrClose = document.querySelector("#instrClose");
const congratsPanel = document.getElementById("congratsPanel");
const congratsTime = document.getElementById("congratsTime");
const playAgainBtn = document.getElementById("playAgainBtn");
const backHomeBtn = document.getElementById("backHome");

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
homeNavBtn.addEventListener("click", navigateHome);
instructionsBtn.addEventListener("click", showInstructions);
instrClose.addEventListener("click", closeInstructions);
playAgainBtn.addEventListener("click", resetGame);
backHomeBtn.addEventListener("click", navigateHome);

function init() {
  createHotspots();
  createProgressCups();
  positionCoffeeCups();
}

// Position the colored coffee cup images over the hotspots
function positionCoffeeCups() {
  for (let i = 1; i <= 5; i++) {
    const spot = hotspots[i];
    const cup = document.getElementById(`cup-${i}`);
    cup.style.top = `${spot.y}%`;
    cup.style.left = `${spot.x}%`;
  }
}

// Create hotspot elements
function createHotspots() {
  const hotspotLayer = document.getElementById("hotspot-layer");
  hotspots.forEach((spot) => {
    const div = document.createElement("div");
    div.id = spot.id;
    div.className = "hotspot";
    div.style.top = `${spot.y}%`;
    div.style.left = `${spot.x}%`;
    div.style.width = `${spot.width}%`;
    div.style.height = `${spot.height}%`;
    div.addEventListener("click", () => handleHotspotClick(spot.id));
    hotspotLayer.appendChild(div);
  });
}

// Create progress cups
function createProgressCups() {
  for (let i = 1; i <= 5; i++) {
    const cup = document.createElement("img");
    cup.src = `progress/cup-${i}.png`;
    cup.alt = `Coffee Cup ${i}`;
    cup.className = "progress-cup hidden";
    cup.id = `progress-cup-${i}`;
    progressContainer.appendChild(cup);
  }
}

// Start the game
function startGame() {
  homescreen.classList.add("hidden");
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
function navigateHome() {
  congratsPanel.classList.add("hidden");
  gameScreen.classList.add("hidden");
  homescreen.classList.remove("hidden");
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
    hotspotDiv.classList.remove("found");
    const coffeeCups = document.querySelectorAll(".coffee-cup");
    coffeeCups.forEach((cup) => cup.classList.add("hidden"));
  }
}

// create function to handle hotspot click
function clickHotspot(id) {
  let alreadyFound = false;
  for (let i = 0; i < foundCups.length; i++) {
    if (foundCups[i] === id) {
      alreadyFound = true;
      break;
    }
  }
  if (alreadyFound) {
    foundCups.push(id);
    markHotspotFound(id);
    updateProgress();
    updateMessage();
    checkWin();
  }
}

// Mark hotspot as found
function markHotspotFound(id) {
  const hotspotDiv = document.getElementById(id);
  hotspotDiv.classList.add("found");
  const cupImg = document.getElementById(`cup-${id.split("-")[1]}`);
  cupImg.classList.remove("hidden");
  cupImg.classList.add("found");
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

// Update progress display
function updateProgress() {
  for (let i = 1; i <= 5; i++) {
    const cup = document.getElementById(`progress-cup-${i}`);
    if (foundCups.includes(`hotspot-${i}`)) {
      cup.classList.remove("hidden");
    } else {
      cup.classList.add("hidden");
    }
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

// Show instructions panel
function showInstructions() {
  instructionsPanel.classList.remove("hidden");
}

// Close instructions panel
function closeInstructions() {
  instructionsPanel.classList.add("hidden");
}

// Timer functions
function startTimer() {
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
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

window.onload = init;
