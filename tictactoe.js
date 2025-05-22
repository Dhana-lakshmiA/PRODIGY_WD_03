const board = document.getElementById("board");
const message = document.getElementById("message");
const resetButton = document.getElementById("reset");
const modeSelection = document.getElementById("mode-selection");
const nameInputs = document.getElementById("name-inputs");
const startGameBtn = document.getElementById("start-game");
const twoPlayerBtn = document.getElementById("two-player-btn");
const aiPlayerBtn = document.getElementById("ai-player-btn");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
let currentPlayer = "X";
let gameBoard = Array(9).fill(null);
let isSinglePlayer = false;
let gameOver = false;
let player1Name = "";
let player2Name = "";
twoPlayerBtn.addEventListener("click", () => {
  isSinglePlayer = false;
  player2Input.style.display = "inline-block";
  modeSelection.style.display = "none";
  nameInputs.style.display = "block";
});
aiPlayerBtn.addEventListener("click", () => {
  isSinglePlayer = true;
  player2Input.style.display = "none";
  modeSelection.style.display = "none";
  nameInputs.style.display = "block";
});
startGameBtn.addEventListener("click", () => {
  player1Name = player1Input.value.trim();
  player2Name = isSinglePlayer ? "AI" : player2Input.value.trim();
  if (!player1Name || (!isSinglePlayer && !player2Name)) {
    alert("Please enter both player names.");
    return;
  }
  nameInputs.style.display = "none";
  resetButton.style.display = "inline-block";
  board.style.display = "grid";
  message.textContent = `It's ${player1Name}'s turn.`;
  createBoard();
});
resetButton.addEventListener("click", () => resetGame());
function createBoard() {
  board.innerHTML = "";
  gameBoard = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    cell.addEventListener("click", () => handleClick(i), { once: true });
    board.appendChild(cell);
  }
}
function handleClick(index) {
  if (gameBoard[index] || gameOver) return;
  gameBoard[index] = currentPlayer;
  document.querySelectorAll(".cell")[index].textContent = currentPlayer;
  if (checkWinner()) {
    const winnerName = currentPlayer === "X" ? player1Name : player2Name;
    message.textContent = `${winnerName} wins!`;
    celebrateWinner(winnerName);
    endGame();
  } else if (gameBoard.every((cell) => cell !== null)) {
    message.textContent = "It's a draw!";
    endGame();
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    message.textContent = `It's ${
      currentPlayer === "X" ? player1Name : player2Name
    }'s turn.`;
    if (isSinglePlayer && currentPlayer === "O") {
      setTimeout(aiMove, 500);
    }
  }
}
function aiMove() {
  if (gameOver) return;
  const empty = gameBoard
    .map((v, i) => (v === null ? i : null))
    .filter((i) => i !== null);
  const move = empty[Math.floor(Math.random() * empty.length)];
  gameBoard[move] = "O";
  document.querySelectorAll(".cell")[move].textContent = "O";
  if (checkWinner()) {
    message.textContent = `${player2Name} wins!`;
    celebrateWinner(player2Name);
    endGame();
  } else if (gameBoard.every((c) => c !== null)) {
    message.textContent = "It's a draw!";
    endGame();
  } else {
    currentPlayer = "X";
    message.textContent = `It's ${player1Name}'s turn.`;
  }
}
function checkWinner() {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return wins.some(
    ([a, b, c]) =>
      gameBoard[a] &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
  );
}
function endGame() {
  gameOver = true;
  document
    .querySelectorAll(".cell")
    .forEach((cell) => cell.classList.add("taken"));
  setTimeout(() => {
    board.style.display = "none";
    message.textContent = "";
    resetButton.style.display = "none";
    modeSelection.style.display = "block";
    player1Input.value = "";
    player2Input.value = "";
    nameInputs.style.display = "none";
  }, 2500);
}
function resetGame() {
  message.textContent = `It's ${player1Name}'s turn.`;
  gameOver = false;
  createBoard();
}
function celebrateWinner(winnerName) {
  launchConfetti();
  showPopup(`${winnerName} Wins! 🎉`);
}
function showPopup(text) {
  let popup = document.createElement("div");
  popup.classList.add("win-popup");
  popup.innerText = text;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.remove();
  }, 3000);
}
function launchConfetti() {
  const end = Date.now() + 1000;
  const colors = ["#bb0000", "#ffffff", "#0000bb", "#00bb00"];
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
