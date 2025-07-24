const container = document.querySelector(".container");
const scorexEl = document.querySelector(".xscore");
const scoreoEl = document.querySelector(".oscore");
const scoreTieEl = document.querySelector(".tiescore");
const playerXEl = document.querySelector(".x");
const playerOEl = document.querySelector(".o");
const tieEl = document.querySelector(".tie");
const undoRedoContainer = document.querySelector('.undoRedo');
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
let everyMove = [];
let undos = [];

document.documentElement.style.setProperty('--colAndRowsNumber', gridSize);

window.onload = function (){
  for(let i = 0; i < noOfCells; i++){
    let cell = document.createElement("div");
    cell.classList.add("cell");
    container.appendChild(cell);
  }
  createWins();
  cells = Array.from(document.querySelectorAll(".cell"));
}

//this function creates an array of arrays each win condition in an array of its own
//the size of the array created changes depending on the grid size that the user selects.
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

//this function handle every click on the board,
//It checks for every cell if its empty or not and calls the checkWin function until there is no empty cell or there is a win.
function handleClick(e){
  let index = cells.indexOf(e.target);
  if (e.target.textContent === '' && gameActive){
    everyMove.push(index);
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
  }
}

//this function updates the scores in the html after every game.
function updateScores(){
  scorexEl.textContent = scores.X;
  scoreoEl.textContent = scores.O;
  scoreTieEl.textContent = scores.tie;
}

//this function checks if there is a win after each move.
function checkWin() {
  return winConditions.some(line => {
    let linesIndex = line.map(index => board[index]);
    if (linesIndex[0] != '' && linesIndex.every(cell => cell === linesIndex[0])){
      line.forEach(index => cells[index].style.color = `${colors[linesIndex[0]]}`)
      return true;
    } else return false;
  })
}

// this function handles the undo & redo buttons the program stores every move index in an array called everyMove.
// and each undo pops the last index in the everyMove array and stores it in the undos array.
//each redo pops the last index in the undos array and stores it in the everyMove array.
function undoRedoHandler(e){
  //the undo part:
  if(e.target.classList.contains("undo") && everyMove.length > 0){
    let lastMove = everyMove.pop();
    currentPlayer = board[lastMove];
    undos.push(lastMove);
    board[lastMove] = '';
    cells[lastMove].textContent = '';
    console.log(undos);
  //the redo part:
  } else if(e.target.classList.contains("redo") && undos.length > 0){
    let lastUndo = undos.pop();
    board[lastUndo] = currentPlayer;
    cells[lastUndo].textContent = currentPlayer;
    if (gameActive){
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
    everyMove.push(lastUndo);
  }
}

//this function resets the game after each game.
function clearBoard(){
    board = Array(noOfCells).fill("");
    cells.forEach(cell => cell.textContent = '');
    gameActive = true;
    cells.forEach(cell => cell.style.color = "white");
    playerOEl.style.color = "#bcbcbc";
    playerXEl.style.color = "#bcbcbc";
    tieEl.style.color = "#bcbcbc";
    currentPlayer = firstPlayer.value || "X";
    everyMove = [];
    undos = [];
}

//this function resets the game if the user change any of the options
//also it updates the game based on those changes.
function handleOptionchange(e){
  undos = [];
  everyMove = [];
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
  container.addEventListener("click", handleClick);
  document.documentElement.style.setProperty('--colAndRowsNumber', gridSize);
  clearBoard();
  createWins();
}

 
firstPlayer.addEventListener("change", handleOptionchange);
size.addEventListener("change", handleOptionchange);
container.addEventListener("click", handleClick);
undoRedoContainer.addEventListener("click", undoRedoHandler);
