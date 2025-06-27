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

const screens = {
  choose: document.querySelector(".choose"),
  waiting: document.querySelector(".waiting"),
  reveal: document.querySelector(".reveal"),
};

const choiceButtons = screens.choose.querySelectorAll("button");
const modeButton = document.getElementById("mode");
const logoDiv = document.querySelector(".logo");
const scoreElement = document.querySelector(".score .number");
const rulesImg = document.getElementById("rules-img");
const openRulesBtn = document.getElementById("open-rules");
const closeRulesBtn = document.getElementById("close-rules");
const dialog = document.querySelector("dialog");
const playAgainButton = document.getElementById("play-again");

let score, mode, rules;

function initializeGame() {
  score = parseInt(localStorage.getItem(STORAGE_KEYS.SCORE)) || 0;
  mode = localStorage.getItem(STORAGE_KEYS.MODE) || GAME_MODES.ORIGINAL;
  scoreElement.textContent = score;

  attachEventListeners();
  initializeAudio();

  setMode(mode);
  resetGame();
}

function attachEventListeners() {
  modeButton.addEventListener("click", toggleMode);
  openRulesBtn.addEventListener("click", () => dialog.showModal());
  closeRulesBtn.addEventListener("click", () => dialog.close());
  playAgainButton.addEventListener("click", resetGame);

  screens.choose.addEventListener("click", (e) => {
    const userChoice = e.target.dataset.choice;
    if (!(userChoice in rules)) return;
    playSound(GAME_EVENTS.USER_CHOICE);
    selectUserChoice(userChoice);
  });
}

function toggleMode() {
  const newMode =
    mode === GAME_MODES.ORIGINAL ? GAME_MODES.BONUS : GAME_MODES.ORIGINAL;
  setMode(newMode);
}

function setMode(newMode) {
  mode = newMode;
  localStorage.setItem(STORAGE_KEYS.MODE, newMode);

  const isBonus = newMode === GAME_MODES.BONUS;
  logoDiv.classList.toggle("bonus", isBonus);
  screens.choose.classList.toggle("bonus", isBonus);
  choiceButtons.forEach((btn) => btn.classList.toggle("bonus", isBonus));

  rules = RULES_BY_MODE[newMode];

  rulesImg.src = RULES_IMG_PATH_BY_MODE[newMode];
  resetGame();
}

function resetGame() {
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

function selectUserChoice(userChoice) {
  modeButton.style.visibility = "hidden";

  const userChoiceBtn = screens.waiting.querySelector(".choice-btn");
  userChoiceBtn.setAttribute("data-choice", userChoice);
  switchScreen("waiting");

  setTimeout(() => playSound(GAME_EVENTS.HOUSE_CHOICE), 500);

  const houseChoice = getHouseChoice();
  const [userBtn, houseBtn] = screens.reveal.querySelectorAll(".choice-btn");
  userBtn.setAttribute("data-choice", userChoice);
  houseBtn.setAttribute("data-choice", houseChoice);
  const result = determineWinner(userChoice, houseChoice);

  document.getElementById("result-text").textContent = TEXT_BY_RESULT[result];

  setTimeout(() => {
    if (result === GAME_RESULTS.WIN) score++;
    if (result === GAME_RESULTS.LOSE) score--;
    score = Math.max(score, 0);

    localStorage.setItem(STORAGE_KEYS.SCORE, score);
    scoreElement.textContent = score;

    switchScreen("reveal");
    modeButton.style.visibility = "visible";

    playSound(result);

    if (result === GAME_RESULTS.DRAW) return;
    const winnerBtn = result === GAME_RESULTS.WIN ? userBtn : houseBtn;
    winnerBtn.classList.add("winner");
  }, 3000);
}

function initializeAudio() {
  for (const soundKey in SOUND_PATHS) {
    const audioElement = new Audio(SOUND_PATHS[soundKey]);
    // audioElement.load();
    SOUNDS[soundKey] = audioElement;
  }
}

function playSound(soundKey) {
  SOUNDS[soundKey].play();
}

initializeGame();
