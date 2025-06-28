// -------- Constants --------

const GAME_MODES = { ORIGINAL: "ORIGINAL", BONUS: "BONUS" };

const GAME_RESULTS = { WIN: "WIN", LOSE: "LOSE", DRAW: "DRAW" };

const GAME_EVENTS = {
  ...GAME_RESULTS,
  USER_CHOICE: "USER_CHOICE",
  HOUSE_CHOICE: "HOUSE_CHOICE",
};

const TEXT_BY_RESULT = {
  [GAME_RESULTS.WIN]: "You Win",
  [GAME_RESULTS.LOSE]: "You Lose",
  [GAME_RESULTS.DRAW]: "Draw",
};

const ORIGINAL_RULES = {
  rock: ["scissors"],
  paper: ["rock"],
  scissors: ["paper"],
};

const BONUS_RULES = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["spock", "paper"],
  spock: ["scissors", "rock"],
};

const RULES_BY_MODE = {
  [GAME_MODES.ORIGINAL]: ORIGINAL_RULES,
  [GAME_MODES.BONUS]: BONUS_RULES,
};

const RULES_IMG_PATH_BY_MODE = {
  [GAME_MODES.ORIGINAL]: "./images/image-rules.svg",
  [GAME_MODES.BONUS]: "./images/image-rules-bonus.svg",
};

const STORAGE_KEYS = { SCORE: "rps_score", MODE: "rps_mode", MUTE: "rps_mute" };

const SOUND_PATHS = {
  [GAME_EVENTS.DRAW]: "./sfx/draw.mp3",
  [GAME_EVENTS.WIN]: "./sfx/win.mp3",
  [GAME_EVENTS.LOSE]: "./sfx/lose.mp3",
  [GAME_EVENTS.USER_CHOICE]: "./sfx/user-choice.mp3",
  [GAME_EVENTS.HOUSE_CHOICE]: "./sfx/house-choice.wav",
};

const SOUNDS = {};

// -------- DOM Refs --------
const screens = {
  choose: document.querySelector(".choose"),
  waiting: document.querySelector(".waiting"),
  reveal: document.querySelector(".reveal"),
};

const logoDiv = document.querySelector(".logo");
const scoreElement = document.querySelector(".score .number");

const choiceButtons = screens.choose.querySelectorAll("button");
const [userBtn, houseBtn] = screens.reveal.querySelectorAll(".choice-btn");
const playAgainButton = document.getElementById("play-again");

const openSettingsBtn = document.getElementById("open-settings");
const openRulesBtn = document.getElementById("open-rules");

const rulesDialog = document.getElementById("rules-dialog");
const closeRulesBtn = document.getElementById("close-rules");
const rulesImg = document.getElementById("rules-img");

const settingsDialog = document.getElementById("settings-dialog");
const closeSettingsBtn = document.getElementById("close-settings");
const modeButton = document.getElementById("switch-modes");
const muteButton = document.getElementById("switch-mute");
const resetScoreButton = document.getElementById("reset-score");

// -------- State --------
let score, mode, rules, result, mute;

// -------- Functions --------
function initializeScore() {
  score = parseInt(localStorage.getItem(STORAGE_KEYS.SCORE)) || 0;
  setScore(score);
}

function initializeMode() {
  mode = localStorage.getItem(STORAGE_KEYS.MODE) || GAME_MODES.ORIGINAL;
  setMode(mode);
}

function initializeMute() {
  mute = localStorage.getItem(STORAGE_KEYS.MUTE) === "true" || false;
  setMute(mute);
}

function attachDialogListeners(dialog, openBtn, closeBtn) {
  openBtn.addEventListener("click", () => dialog.showModal());
  closeBtn.addEventListener("click", () => dialog.close());
}

function attachEventListeners() {
  attachDialogListeners(rulesDialog, openRulesBtn, closeRulesBtn);
  attachDialogListeners(settingsDialog, openSettingsBtn, closeSettingsBtn);

  modeButton.addEventListener("click", toggleMode);
  muteButton.addEventListener("click", () => setMute(!mute));
  resetScoreButton.addEventListener("click", () => setScore(0));

  playAgainButton.addEventListener("click", () => switchScreen("choose"));

  screens.choose.addEventListener("click", (e) => {
    const userChoice = e.target.dataset.choice;
    if (!(userChoice in rules)) return;
    handleUserChoice(userChoice);
  });
}

function initializeAudio() {
  for (const soundKey in SOUND_PATHS) {
    const audioElement = new Audio(SOUND_PATHS[soundKey]);
    SOUNDS[soundKey] = audioElement;
  }
}

function playSound(soundKey) {
  if (mute) return;
  SOUNDS[soundKey].play();
}

function setModeButtonVisibility(visible = true) {
  openSettingsBtn.style.visibility = visible ? "visible" : "hidden";
}

function handleUserChoice(userChoice) {
  playSound(GAME_EVENTS.USER_CHOICE);
  setModeButtonVisibility(false);
  showWaitingScreen(userChoice);

  prepareRevealScreen(userChoice);

  setTimeout(showRevealScreen, 3000);
}

function showWaitingScreen(userChoice) {
  const userChoiceBtn = screens.waiting.querySelector(".choice-btn");
  userChoiceBtn.setAttribute("data-choice", userChoice);

  switchScreen("waiting");

  setTimeout(() => playSound(GAME_EVENTS.HOUSE_CHOICE), 500);
}

function prepareRevealScreen(userChoice) {
  const houseChoice = getHouseChoice();

  userBtn.setAttribute("data-choice", userChoice);
  houseBtn.setAttribute("data-choice", houseChoice);

  result = determineWinner(userChoice, houseChoice);

  document.getElementById("result-text").textContent = TEXT_BY_RESULT[result];
}

function showRevealScreen() {
  updateScore(result);
  switchScreen("reveal");
  setModeButtonVisibility(true);
  playSound(result);
  handleWinnerEffect();
}

function handleWinnerEffect() {
  [userBtn, houseBtn].forEach((btn) => btn.classList.remove("winner"));
  if (result === GAME_RESULTS.DRAW) return;
  const winnerBtn = result === GAME_RESULTS.WIN ? userBtn : houseBtn;
  winnerBtn.classList.add("winner");
}

function updateScore(result) {
  if (result === GAME_RESULTS.DRAW) return;
  const scoreChange = result === GAME_RESULTS.WIN ? 1 : -1;
  setScore(Math.max(score + scoreChange, 0));
}

function toggleMode() {
  const newMode =
    mode === GAME_MODES.ORIGINAL ? GAME_MODES.BONUS : GAME_MODES.ORIGINAL;
  setMode(newMode);
}

function setMode(newMode) {
  mode = newMode;
  localStorage.setItem(STORAGE_KEYS.MODE, mode);
  rules = RULES_BY_MODE[mode];

  // Update Mode Related UI
  const isBonus = mode === GAME_MODES.BONUS;
  modeButton.textContent = isBonus ? "use original mode" : "use bonus mode";

  logoDiv.classList.toggle("bonus", isBonus);
  screens.choose.classList.toggle("bonus", isBonus);
  choiceButtons.forEach((btn) => btn.classList.toggle("bonus", isBonus));

  rulesImg.src = RULES_IMG_PATH_BY_MODE[mode];
}

function setMute(newMute) {
  mute = newMute;
  localStorage.setItem(STORAGE_KEYS.MUTE, mute);

  // Update Mute Related UI
  muteButton.textContent = mute ? "unmute" : "mute";
}

function setScore(newScore) {
  score = newScore;
  localStorage.setItem(STORAGE_KEYS.SCORE, score);

  // Update Score Related UI
  scoreElement.textContent = score;
}

function switchScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function getHouseChoice() {
  const options = Object.keys(rules);
  return options[Math.floor(Math.random() * options.length)];
}

function determineWinner(userChoice, houseChoice) {
  if (userChoice === houseChoice) return GAME_RESULTS.DRAW;
  const userBeatsHouse = rules[userChoice].includes(houseChoice);
  return userBeatsHouse ? GAME_RESULTS.WIN : GAME_RESULTS.LOSE;
}

function initializeGame() {
  initializeMode();
  initializeScore();
  initializeMute();
  attachEventListeners();
  initializeAudio();
}

initializeGame();
