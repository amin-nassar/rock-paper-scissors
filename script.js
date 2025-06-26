const GAME_MODES = {
  ORIGINAL: "ORIGINAL",
  BONUS: "BONUS",
};

const RULES_IMG_PATH_BY_MODE = {
  [GAME_MODES.ORIGINAL]: "./images/image-rules.svg",
  [GAME_MODES.BONUS]: "./images/image-rules-bonus.svg",
};

let mode = GAME_MODES.ORIGINAL;

const modeButton = document.getElementById("mode");
const logoDiv = document.querySelector(".logo");

const chooseScreen = document.querySelector(".choose");
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
}

const openRulesBtn = document.getElementById("open-rules");
const closeRuesBtn = document.getElementById("close-rules");
const dialog = document.querySelector("dialog");

openRulesBtn.addEventListener("click", () => {
  dialog.showModal();
});

closeRuesBtn.addEventListener("click", () => {
  dialog.close();
});
