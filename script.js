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

const STORAGE_KEYS = { SCORE: "rps_score", MODE: "rps_mode" };

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
const playAgainButton = screens.reveal.querySelector("#play-again");

const modeButton = document.getElementById("mode");
const openRulesDialogBtn = document.getElementById("open-rules");

const rulesDialog = document.querySelector("dialog");
const closeRulesDialogBtn = document.getElementById("close-rules");
const rulesImg = document.getElementById("rules-img");

// -------- State --------
let score, mode, rules, result;

// -------- Functions --------
function initializeScore() {
  score = parseInt(localStorage.getItem(STORAGE_KEYS.SCORE)) || 0;
  scoreElement.textContent = score;
}

function initializeMode() {
  mode = localStorage.getItem(STORAGE_KEYS.MODE) || GAME_MODES.ORIGINAL;
  setMode(mode);
}

function attachEventListeners() {
  modeButton.addEventListener("click", toggleMode);
  openRulesDialogBtn.addEventListener("click", () => rulesDialog.showModal());
  closeRulesDialogBtn.addEventListener("click", () => rulesDialog.close());
  playAgainButton.addEventListener("click", resetGame);

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
  SOUNDS[soundKey].play();
}

function setModeButtonVisibility(visible = true) {
  modeButton.style.visibility = visible ? "visible" : "hidden";
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

  if (result === GAME_RESULTS.DRAW) return;
  const winnerBtn = result === GAME_RESULTS.WIN ? userBtn : houseBtn;
  winnerBtn.classList.add("winner");
}

function updateScore(result) {
  if (result === GAME_RESULTS.WIN) score++;
  if (result === GAME_RESULTS.LOSE) score--;
  score = Math.max(score, 0);

  localStorage.setItem(STORAGE_KEYS.SCORE, score);
  scoreElement.textContent = score;
}

function toggleMode() {
  const newMode =
    mode === GAME_MODES.ORIGINAL ? GAME_MODES.BONUS : GAME_MODES.ORIGINAL;
  setMode(newMode);
}

function setMode(newMode) {
  mode = newMode;
  localStorage.setItem(STORAGE_KEYS.MODE, mode);

  const isBonus = mode === GAME_MODES.BONUS;
  logoDiv.classList.toggle("bonus", isBonus);
  screens.choose.classList.toggle("bonus", isBonus);
  choiceButtons.forEach((btn) => btn.classList.toggle("bonus", isBonus));

  rulesImg.src = RULES_IMG_PATH_BY_MODE[mode];
  rules = RULES_BY_MODE[mode];
  resetGame();
}

function resetGame() {
  result = "";
  switchScreen("choose");
  document.querySelector(".winner")?.classList.remove("winner");
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
  attachEventListeners();
  initializeAudio();
}

initializeGame();
