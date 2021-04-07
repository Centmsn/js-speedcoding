const tiles = document.querySelectorAll(".game__tile");
const difficultyButtons = document.querySelectorAll("button");
const gameInfo = document.querySelector(".game__info");

const sequence = [];
const userSequence = [];
let currentIndex = 0;

/**
 * Main game functions
 * @param {Object} e - event object
 * @returns {undefined}
 */
const startGame = e => {
  const difficulty = e.target.dataset.value * 1;
  resetGame();

  tiles.forEach(tile => tile.removeEventListener("click", checkTile));

  switch (difficulty) {
    case 1:
      generateRandomSequence(5);
      break;

    case 2:
      generateRandomSequence(7);
      break;

    case 3:
      generateRandomSequence(9);
      tiles.forEach(tile => (tile.textContent = ""));
      break;

    default:
      throw new Error("Invalid difficulty. Please try again.");
  }

  displaySequence();
  difficultyButtons.forEach(btn => btn.setAttribute("disabled", true));
};

/**
 * Checks if clicked tile is the next one in the sequence
 * @returns {undefined}
 */
const checkTile = e => {
  const value = e.target.dataset.value * 1;

  if (value === sequence[currentIndex]) {
    tiles[value].style.background = "green";
  } else {
    resetGame("lost");
  }

  currentIndex++;

  if (currentIndex === sequence.length) {
    resetGame("won");
  }
};

/**
 * Generates random sequence to repeat
 * @param {number} sequenceLength
 * @returns {undefined}
 */
const generateRandomSequence = sequenceLength => {
  const possibleNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  while (sequence.length < sequenceLength) {
    const randomIndex = Math.floor(Math.random() * possibleNumbers.length);

    sequence.push(possibleNumbers[randomIndex]);
    possibleNumbers.splice(randomIndex, 1);
  }
};

/**
 * Displays generated sequence to the user
 * @returns {undefined}
 */
const displaySequence = (index = 0) => {
  if (index >= sequence.length) {
    setTimeout(() => {
      tiles.forEach(tile => {
        tile.style.background = "white";
        tile.addEventListener("click", checkTile);
        difficultyButtons.forEach(btn => btn.removeAttribute("disabled"));
      });
    }, 1000);

    return;
  }
  const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)})`;

  setTimeout(() => {
    tiles[sequence[index]].style.background = randomColor;

    if (index < sequence.length) {
      displaySequence(index + 1);
    }
  }, 500);
};

/**
 * Reset the game to the start
 * @param {Boolean|undefined} status - true | false | undefined
 */
const resetGame = status => {
  //   reset all game stats
  sequence.length = 0;
  userSequence.length = 0;
  currentIndex = 0;

  tiles.forEach((tile, index) => {
    tile.style.background = "white";
    tile.textContent = index + 1;
  });

  if (status === "lost") {
    gameInfo.textContent = "Sorry, You Lost :(";
    gameInfo.classList.remove("game__info--won");
    gameInfo.classList.add("game__info--lost");
  }
  if (status === "won") {
    gameInfo.textContent = "Congrats! You won!";
    gameInfo.classList.remove("game__info--lost");
    gameInfo.classList.add("game__info--won");
  }

  if (typeof status === "undefined") {
    gameInfo.textContent = "";
  }
};

difficultyButtons.forEach(button =>
  button.addEventListener("click", startGame)
);
