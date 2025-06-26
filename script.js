const GAME_MODES = { ORIGINAL: "ORIGINAL", BONUS: "BONUS" };

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
const STORAGE_KEYS = {
  SCORE: "rps_score",
  MODE: "rps_mode",
};

const screens = {
  choose: document.querySelector(".choose"),
  waiting: document.querySelector(".waiting"),
  reveal: document.querySelector(".reveal"),
};

const choiceButtons = screens.choose.querySelectorAll("button");
const modeButton = document.getElementById("mode");
const logoDiv = document.querySelector(".logo");
const scoreElement = document.querySelector("header .score .number");
const rulesImg = document.getElementById("rules-img");
const openRulesBtn = document.getElementById("open-rules");
const closeRulesBtn = document.getElementById("close-rules");
const dialog = document.querySelector("dialog");
const playAgainButton = document.getElementById("play-again");

let score;
let mode;
let rules;

function initializeGame() {
  score = parseInt(localStorage.getItem(STORAGE_KEYS.SCORE)) || 0;
  mode = localStorage.getItem(STORAGE_KEYS.MODE) || GAME_MODES.ORIGINAL;
  scoreElement.textContent = score;

  attachEventListeners();
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

  logoDiv.classList.toggle("bonus", newMode === GAME_MODES.BONUS);
  screens.choose.classList.toggle("bonus", newMode === GAME_MODES.BONUS);
  choiceButtons.forEach((btn) =>
    btn.classList.toggle("bonus", newMode === GAME_MODES.BONUS)
  );

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

function determineWinner(player, computer) {
  if (player === computer) return "tie";
  return rules[player]?.includes(computer) ? "win" : "lose";
}

function selectUserChoice(userChoice) {
  screens.waiting
    .querySelector(".choice-btn")
    .setAttribute("data-choice", userChoice);
  switchScreen("waiting");

  const houseChoice = getHouseChoice();

  setTimeout(() => {
    const [userBtn, houseBtn] = screens.reveal.querySelectorAll(".choice-btn");
    userBtn.setAttribute("data-choice", userChoice);
    houseBtn.setAttribute("data-choice", houseChoice);

    const result = determineWinner(userChoice, houseChoice);
    document.getElementById("result-text").textContent = {
      win: "You Win",
      lose: "You Lose",
      tie: "Draw",
    }[result];

    if (result === "win") {
      score++;
      localStorage.setItem(STORAGE_KEYS.SCORE, score);
      scoreElement.textContent = score;
    }

    switchScreen("reveal");

    if (result !== "tie") {
      (result === "lose" ? houseBtn : userBtn).classList.add("winner");
    }
  }, 3000);
}

initializeGame();
