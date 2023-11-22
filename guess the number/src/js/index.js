const mainPage = document.querySelector(".main-page");
const gamePage = document.querySelector(".game-page");
const startGameButton = document.querySelector(".start-game-button");
const attemptsSpan = document.querySelector(".attempts");
const dialogText = document.querySelector(".dialog");
const minNumberInput = document.getElementById("number1");
const maxNumberInput = document.getElementById("number2");
const guessNumberInput = document.getElementById("number3");
const tryButton = document.querySelector(".try-button");
const newGameButton = document.querySelector(".new-game-button");

let secretNumber = 0;
let isEven;
let attempts = 0;
let min = 0;
let max = 0;

function getSecretNumber(min, max) {
  secretNumber = Math.floor(Math.random() * (max - min) + min);
  isEven = secretNumber % 2 === 0 ? true : false;
}

function guessNumber(userGuess) {
  if (userGuess === secretNumber) {
    dialogText.textContent = `Поздравляю! Вы угадали число ${secretNumber}!`;
    dialogText.style.color = "green";
    attempts += 1;
    attemptsSpan.textContent = attempts;
    tryButton.style.display = "none";
    guessNumberInput.style.display = "none";
  } else if (userGuess < min || userGuess > max) {
    dialogText.textContent = `Пожалуйста, введите корректное число от ${min} до ${max}.`;
    dialogText.style.color = "red";
  } else if (userGuess > secretNumber && attempts % 3 === 0 && attempts !== 0) {
    dialogText.style.color = "orange";
    attempts += 1;
    attemptsSpan.textContent = attempts;
    if (isEven) {
      dialogText.textContent =
        "Загаданное число меньше и чётное. Попробуйте снова.";
    } else {
      dialogText.textContent =
        "Загаданное число меньше и нечётное. Попробуйте снова.";
    }
  } else if (userGuess < secretNumber && attempts % 3 === 0 && attempts !== 0) {
    dialogText.style.color = "orange";
    attempts += 1;
    attemptsSpan.textContent = attempts;
    if (isEven) {
      dialogText.textContent =
        "Загаданное число больше и чётное. Попробуйте снова.";
    } else {
      dialogText.textContent =
        "Загаданное число больше и нечётное. Попробуйте снова.";
    }
  } else if (userGuess > secretNumber) {
    dialogText.textContent = "Загаданное число меньше. Попробуйте снова.";
    dialogText.style.color = "orange";
    attempts += 1;
    attemptsSpan.textContent = attempts;
  } else if (userGuess < secretNumber) {
    dialogText.textContent = "Загаданное число больше. Попробуйте снова.";
    dialogText.style.color = "orange";
    attempts += 1;
    attemptsSpan.textContent = attempts;
  }
}

startGameButton.addEventListener("click", () => {
  min = Number(minNumberInput.value);
  max = Number(maxNumberInput.value);
  mainPage.style.display = "none";
  gamePage.style.display = "block";
  getSecretNumber(min, max);
});

tryButton.addEventListener("click", () => {
  let userGuess = Number(guessNumberInput.value);
  guessNumber(userGuess);
  guessNumberInput.value = "";
});

newGameButton.addEventListener("click", () => {
  guessNumberInput.style.display = "inline-block";
  guessNumberInput.value = "";
  attempts = 0;
  attemptsSpan.textContent = attempts;
  dialogText.style.color = "black";
  dialogText.textContent =
    'Тут будут отображаться подсказки. Для проверки числа - нажмите "Проверить число".';
  tryButton.style.display = "inline-block";
  minNumberInput.value = 1;
  maxNumberInput.value = 100;
  gamePage.style.display = "none";
  mainPage.style.display = "block";
});