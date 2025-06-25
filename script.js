const GAME_MODES = {
  ORIGINAL: "ORIGINAL",
  BONUS: "BONUS",
};

let mode = GAME_MODES.ORIGINAL;

const modeButton = document.getElementById("mode");
const logoDiv = document.querySelector(".logo");

modeButton.addEventListener("click", () => {
  const isOriginal = mode === GAME_MODES.ORIGINAL;
  setMode(isOriginal ? GAME_MODES.BONUS : GAME_MODES.ORIGINAL);
});

function setMode(newMode) {
  mode = newMode;
  modeButton.textContent = newMode;

  logoDiv.classList.toggle("bonus");
}
