const GAME_MODES = {
  ORIGINAL: "ORIGINAL",
  BONUS: "BONUS",
};

const RULES_IMG_PATH_BY_MODE = {
  [GAME_MODES.ORIGINAL]: "./images/image-rules.svg",
  [GAME_MODES.BONUS]: "./images/image-rules-bonus.svg",
};

const RULES = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "Spock"],
  scissors: ["paper", "lizard"],
  lizard: ["Spock", "paper"],
  spock: ["scissors", "rock"],
};

let mode = GAME_MODES.ORIGINAL;

const modeButton = document.getElementById("mode");
const logoDiv = document.querySelector(".logo");

const chooseScreen = document.querySelector(".choose");
const waitingScreen = document.querySelector(".waiting");
const revealScreen = document.querySelector(".reveal");

const choiceButtons = chooseScreen.querySelectorAll("button");

const rulesImg = document.getElementById("rules-img");

modeButton.addEventListener("click", () => {
  const isOriginal = mode === GAME_MODES.ORIGINAL;
  setMode(isOriginal ? GAME_MODES.BONUS : GAME_MODES.ORIGINAL);
});

function setMode(newMode) {
  mode = newMode;
  modeButton.textContent = newMode;

  logoDiv.classList.toggle("bonus");
  chooseScreen.classList.toggle("bonus");
  choiceButtons.forEach((btn) => btn.classList.toggle("bonus"));

  rulesImg.src = RULES_IMG_PATH_BY_MODE[newMode];

  resetGame();
}

const openRulesBtn = document.getElementById("open-rules");
const closeRulesBtn = document.getElementById("close-rules");
const dialog = document.querySelector("dialog");

openRulesBtn.addEventListener("click", () => {
  dialog.showModal();
});

closeRulesBtn.addEventListener("click", () => {
  dialog.close();
});

const screens = {
  choose: document.querySelector(".choose"),
  waiting: document.querySelector(".waiting"),
  reveal: document.querySelector(".reveal"),
};

function switchScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function getHouseChoice() {
  const options = Object.keys(RULES);

  const computerChoice = options[Math.floor(Math.random() * options.length)];

  return computerChoice;
}

function determineWinner(player1, player2) {
  if (player1 === player2) return "tie";
  if (RULES[player1]?.includes(player2)) return "win";
  return "lose";
}

function selectUserChoice(userChoice) {
  waitingScreen
    .querySelector(".choice-btn")
    .setAttribute("data-choice", userChoice);
  switchScreen("waiting");

  const houseChoice = getHouseChoice();
  setTimeout(() => {
    const [user, house] = screens.reveal.querySelectorAll(".choice-btn");
    user.setAttribute("data-choice", userChoice);
    house.setAttribute("data-choice", houseChoice);

    const result = determineWinner(userChoice, houseChoice);
    document.getElementById("result-text").textContent = {
      win: "You Win",
      lose: "You Lose",
      tie: "Draw",
    }[result];

    const score = document.querySelector("header .score .number");
    score.textContent = +score.textContent + +(result === "win");

    switchScreen("reveal");
    if (result !== "tie") {
      (result === "lose" ? house : user).classList.toggle("winner");
    }
  }, 3000);
}

screens.choose.addEventListener("click", (e) => {
  const userChoice = e.target.dataset.choice;
  if (!(userChoice in RULES)) return;

  selectUserChoice(userChoice);
});

const playAgainButton = document.getElementById("play-again");

playAgainButton.addEventListener("click", resetGame);
function resetGame() {
  switchScreen("choose");
  document.querySelector(".winner").classList.toggle("winner");
}
