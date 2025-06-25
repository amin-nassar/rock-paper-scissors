const GAME_MODES = {
  ORIGINAL: "ORIGINAL",
  BONUS: "BONUS",
};

let mode = GAME_MODES.ORIGINAL;

const modeButton = document.getElementById("mode");
const logoDiv = document.querySelector(".logo");

const chooseScreen = document.querySelector(".choose");
const choiceButtons = chooseScreen.querySelectorAll("button");

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
}
