const container = document.querySelector(".container");
const scorexEl = document.querySelector(".xscore");
const scoreoEl = document.querySelector(".oscore");
const scoreTieEl = document.querySelector(".tiescore");
const playerXEl = document.querySelector(".x");
const playerOEl = document.querySelector(".o");
const tieEl = document.querySelector(".tie");
let firstPlayer = document.getElementById("first");
let size = document.getElementById("size");

let gameActive = true;
let scores = {X : 0, O : 0, tie : 0};
let currentPlayer = firstPlayer.value || "X";
let gridSize = Number(size.value);
let noOfCells = gridSize * gridSize;
let board = Array(noOfCells).fill("");
let colors = {X:"blue", O: "red", tie: "green"};
let cells = [];
let winConditions = [];

document.documentElement.style.setProperty('--colAndRowsNumber', gridSize);

window.onload = function (){
  for(let i = 0; i < noOfCells; i++){
    let cell = document.createElement("div");
    cell.classList.add("cell");
    container.appendChild(cell);
  }
  createWins();
  cells = Array.from(document.querySelectorAll(".cell"));
  cells.forEach(cell => cell.addEventListener("click", handleClick));
}

function createWins(){
  //creating the horizontal win conditions:
  for(let i = 0; i < noOfCells; i += gridSize){
  let horizontalWin = [];
  for(let j = 0; j < gridSize; j++){
    let pushed = i + j;
     horizontalWin.push(pushed);
  }
  winConditions.push(horizontalWin);
  }
  //creating the vertical win conditions:
  for(let i = 0; i < gridSize; i++){
    let verticalWin = [];
    for(let j = 0; j < noOfCells; j += gridSize){
      let pushed = i + j;
      verticalWin.push(pushed);
    }
    winConditions.push(verticalWin);
  }
  //creating the diagonals win conditions:
  let diagonal = gridSize + 1;
  for(let i = 0; i < 1; i++){
    let diagonalWin = [];
    for(let j = 0; j < noOfCells; j += diagonal){
      diagonalWin.push(j);
    }
    winConditions.push(diagonalWin);
  }
  //creating the reverse diagonals win conditions:
  let revDiagonal = gridSize - 1;
  for(let i = 0; i < 1; i++){
    let diagonalWin = [];
    let endOfRevDiagonal = noOfCells - revDiagonal;
    for(let j = revDiagonal; j < endOfRevDiagonal; j += revDiagonal){
      diagonalWin.push(j);
    }
    winConditions.push(diagonalWin);
  }
}

function handleClick(e){
  let index = cells.indexOf(e.target);
  if (e.target.textContent === '' && gameActive){
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
  } else return;
  if (checkWin()){
    gameActive = false;
    scores[currentPlayer]++;
    updateScores();
    setTimeout(clearBoard, 1500);
  } else if (!board.includes("")){
    gameActive = false;
    scores.tie++;
    tieEl.style.color = `${colors.tie}`;
    updateScores();
    setTimeout(clearBoard, 1500);
  }
  if (gameActive){
      currentPlayer = currentPlayer === "X" ? "O" : "X";
}}

function updateScores(){
  scorexEl.textContent = scores.X;
  scoreoEl.textContent = scores.O;
  scoreTieEl.textContent = scores.tie;
}

function checkWin() {
  return winConditions.some(line => {
    let linesIndex = line.map(index => board[index]);
    if (linesIndex[0] != '' && linesIndex.every(cell => cell === linesIndex[0])){
      line.forEach(index => cells[index].style.color = `${colors[linesIndex[0]]}`)
      return true;
    } else return false;
  })
}


function clearBoard(){
    board = Array(noOfCells).fill("");
    cells.forEach(cell => cell.textContent = '');
    gameActive = true;
    cells.forEach(cell => cell.style.color = "white");
    playerOEl.style.color = "#bcbcbc";
    playerXEl.style.color = "#bcbcbc";
    tieEl.style.color = "#bcbcbc";
    currentPlayer = firstPlayer.value || "X";
}

function handleOptionchange(e){
  winConditions = [];
  currentPlayer = e.target.value;
  gridSize = Number(size.value);
  noOfCells = gridSize * gridSize;
  let childrenNumber = container.childElementCount;
  if(childrenNumber < (gridSize * gridSize)){
    for(let i = 0; i < ((gridSize * gridSize) - childrenNumber); i++){
      let cell = document.createElement("div");
      cell.classList.add("cell");
      container.appendChild(cell);
    }
  } else if (childrenNumber > (gridSize * gridSize)){
    for(let i = 0; i < (childrenNumber - (gridSize * gridSize)); i++){
      container.removeChild(container.firstElementChild);
  }}
  cells = Array.from(document.querySelectorAll(".cell"));
  board = Array(noOfCells).fill("");
  cells.forEach(cell => cell.addEventListener("click", handleClick));
  document.documentElement.style.setProperty('--colAndRowsNumber', gridSize);
  clearBoard();
  createWins();
}

 
firstPlayer.addEventListener("change", handleOptionchange);
size.addEventListener("change", handleOptionchange);
