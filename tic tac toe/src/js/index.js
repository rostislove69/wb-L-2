const choosePlayModeBlock = document.querySelector(".choose-play-mode-block");
const choosAiLevelBlock = document.querySelector(".choose-ai-level-block");
const playTogetherButton = document.querySelector(".button-play-together");
const playVsAiButton = document.querySelector(".button-play-vs-ai");
const easyLevelButton = document.querySelector(".button-ease-level-ai");
const hellLevelButton = document.querySelector(".button-hell-level-ai");
const toMainMenuButton = document.querySelector(".button-to-main-menu");
const cells = document.querySelectorAll(".cell");
const game = document.querySelector(".game");

// переменная для игрового поля
let origBoard;

let gameMode;

let levelAi;

const Player1 = "X";
const Player2 = "O";

let PlayerMove = Player1;

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

// обрабатываем клик на клетке
function turnClick(square) {
  if (gameMode === "PvP") {
    if (typeof origBoard[square.target.id] == "number") {
      turn(square.target.id, PlayerMove);
      if (!checkWin(origBoard, PlayerMove) && !checkTie())
        PlayerMove === Player1 ? PlayerMove = Player2 : PlayerMove = Player1;
    }
  } else if (gameMode === "PvC") {
    // если клетка свободна
    if (typeof origBoard[square.target.id] == "number") {
      // ставим там крестик
      turn(square.target.id, Player1);
      // если после хода игрок не выиграл и нет ничьей, компьютер находит лучшее место для нолика и ставит его туда
      if (!checkWin(origBoard, Player1) && !checkTie())
        turn(levelAi === "easy" ? randomMoves() : bestSpot(), Player2);
    }
  }
}

// обработка хода
function turn(squareId, player) {
  // ставим фигуру на выбранное место
  origBoard[squareId] = player;
  // рисуем её на игровом поле на странице
  document.getElementById(squareId).innerText = player;
  // проверяем, есть ли победа после хода
  let gameWon = checkWin(origBoard, player);
  // если есть — выводим сообщение об этом
  if (gameWon) gameOver(gameWon);
}

// проверяем, выиграл ли кто-то после своего хода
function checkWin(board, player) {
  // проходим по доске и собираем все комбинации, проставленные участником
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  // на старте считаем, что выигрышной ситуации нет
  let gameWon = null;
  // перебираем все выигрышные комбинации и сравниваем их с ситуацией на доске
  for (let [index, win] of winCombos.entries()) {
    // если одна из них совпадает с тем, что на доске — формируем информацию о победителе
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  // возвращаем информацию о победителе
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == Player1 ? "blue" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  if(gameMode === "PvP") {
    declareWinner(gameWon.player == Player1 ? "Выиграли крестики!" : "Выиграли нолики!");
  } else if (gameMode === "PvC") {
    declareWinner(gameWon.player == Player1 ? "Вы выиграли!" : "Вы проиграли.");
  }
  PlayerMove = Player1;
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return origBoard.filter((s) => typeof s == "number");
}

function bestSpot() {
  return minimax(origBoard, Player2).index;
}

// проверка на ничью
function checkTie() {
  if (emptySquares().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Ничья!");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  let availSpots = emptySquares();

  if (checkWin(newBoard, Player1)) {
    return { score: -10 };
  } else if (checkWin(newBoard, Player2)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == Player2) {
      let result = minimax(newBoard, Player1);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, Player2);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }
  let bestMove;
  if (player === Player2) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function randomMoves(){
  const availSpots = emptySquares();
  const randomMove = Math.floor(Math.random() * (availSpots.length + 1));
  if(availSpots[randomMove] === undefined){
    return randomMoves();
  } else {
    return availSpots[randomMove];
  }
}

playTogetherButton.addEventListener("click", () => {
  gameMode = "PvP";
  choosePlayModeBlock.style.display = "none";
  game.style.display = "block";
  startGame();
});

playVsAiButton.addEventListener("click", () => {
  gameMode = "PvC";
  choosePlayModeBlock.style.display = "none";
  choosAiLevelBlock.style.display = "flex";
});

easyLevelButton.addEventListener("click", () => {
  levelAi = "easy";
  choosAiLevelBlock.style.display = "none";
  game.style.display = "block";
  startGame();
});

hellLevelButton.addEventListener("click", () => {
  levelAi = "hell";
  choosAiLevelBlock.style.display = "none";
  game.style.display = "block";
  startGame();
});

toMainMenuButton.addEventListener("click", () => {
  game.style.display = "none";
  choosePlayModeBlock.style.display = "flex";
  gameMode = null;
  levelAi = null;
});
