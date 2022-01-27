//Display game section
$("#play-button").click(function () {
    $("#main-game-section").show();
});

//Display settings section
$("#settings-button").click(function () {
    $("#settings-section").show();
});

//Back to home
$(".back-button").click(function () {
    $("#main-game-section").hide();
    $("#settings-section").hide();
    $("#home-menu").show();
});

//Back to home after saving changes in settings
$(".save-button").click(function () {
    $("#settings-section").hide();
    $("#home-menu").show();
});

const statusDisplay = document.querySelector('.gameplay-status');

let gameActive = true;
let currentPlayer = "X";
let gameMode = "multiplayer";
let boardSize = 3;
let gameState = new Array(boardSize*boardSize).fill("");



const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

//Put X or O in a clicked cell and validate current game state
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

//Function that updates the gameState array, by writing the current player's symbol in the index position recieved.
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}


// winning combinations for 3 by 3 grid
const winCombinationsFor3by3 = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// winning combinations for 4 by 4 grid
const winCombinationsFor4by4 = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15],
      [0, 4, 8, 12],
      [1, 5, 9, 13],
      [2, 6, 10, 14],
      [3, 7, 11, 15],
      [0, 5, 10, 15],
      [3, 6, 9, 12]

];

// winning combinations for 5 by 5 grid
const winCombinationsFor5by5 = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20]

];

function handleResultValidation() {
    let roundWon = false;
    //Result validation for 3by3 game board
    if (boardSize == 3) {
        for (let i = 0; i < 8; i++) {
            const winConditionFor3by3 = winCombinationsFor3by3[i];
            let a = gameState[winConditionFor3by3[0]];
            let b = gameState[winConditionFor3by3[1]];
            let c = gameState[winConditionFor3by3[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break
            }
        }
    }
    //Result validation for 4by4 game board
    else if (boardSize == 4) {
        for (let i = 0; i < 10; i++) {
            const winConditionFor4by4 = winCombinationsFor4by4[i];
            let a = gameState[winConditionFor4by4[0]];
            let b = gameState[winConditionFor4by4[1]];
            let c = gameState[winConditionFor4by4[2]];
            let d = gameState[winConditionFor4by4[3]];
            if (a === '' || b === '' || c === '' || d === '') {
                continue;
            }
            if (a === b && b === c && c === d) {
                roundWon = true;
                break
            }
        }
    }
    //Result validation for 5by5 game board
    else if (boardSize == 5) {
        for (let i = 0; i < 12; i++) {
            const winConditionFor5by5 = winCombinationsFor5by5[i];
            let a = gameState[winConditionFor5by5[0]];
            let b = gameState[winConditionFor5by5[1]];
            let c = gameState[winConditionFor5by5[2]];
            let d = gameState[winConditionFor5by5[3]];
            let e = gameState[winConditionFor5by5[4]];
            if (a === '' || b === '' || c === '' || d === '' || e === '') {
                continue;
            }
            if (a === b && b === c && c === d && d === e) {
                roundWon = true;
                break
            }
        }
    }
    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        //updating score card
        updateScore(currentPlayer);
        gameActive = false;
        return;
    } else {
        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            statusDisplay.innerHTML = drawMessage();
            gameActive = false;
            return;
        }
    }
    handlePlayerChange();
}

//Function to change player from X to O or vice versa
function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
    //if game mode is single player let AI play as 2nd player
    if (gameMode === "computer") {
        aiMove();
    }
}

//Reset game parameters
function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = new Array(boardSize * boardSize).fill("");
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

//Declare array to keep track of scores
let scores = [];
scores["X"] = 0;
scores["O"] = 0;

//Score counter function
function updateScore(currentPlayer) {
    scores[currentPlayer]++;
    document.getElementById(currentPlayer + "-score").innerHTML = scores[currentPlayer];
}

//Function to generate game boards of different sizes
function generateGameBoard() {
    handleRestartGame();
    //getting values of gameboard size
    boardSize = Number(document.getElementById("board-type").value);
    //clear all html content from game area div
    document.getElementById("game-area").innerHTML = "";
    //creating gameboard div element and append to game area
    let gameBoard = document.createElement("div");
    gameBoard.setAttribute("class", 'game-board');
    document.getElementById("game-area").appendChild(gameBoard);
    //generating cell divs and adding attributes
    let dataCellIndexCounter = 0
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            let dataCellIndex = dataCellIndexCounter++;
            let cells = document.createElement("div");
            //adding attributes to the created cell divs
            cells.setAttribute("class", 'cell');
            cells.setAttribute("data-cell-index", dataCellIndex);
            document.getElementsByClassName("game-board")[0].appendChild(cells);
        }
    }
    //adding click event to cells
    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
    //adding styles to the generated gameboard and cells
    $(".game-board").addClass(`game-board-${boardSize}by${boardSize}`);
    $(".cell").addClass(`cell-${boardSize}by${boardSize}`);
}

//Function to change game mode 
function chooseGameMode() {
    gameMode = document.getElementById("game-mode").value;
}

//Simple AI that plays in a random cell or the next empty cell depending on gameboard size
function aiMove() {
    //add empty strings from gameState array to emptyCells array as objects
    let emptyCells = [];
    for (let cellIndex = 0; cellIndex < gameState.length; cellIndex++) {
        if (gameState[cellIndex] === "") {
            emptyCells.push({cellIndex}); 
        }
    }
    if (currentPlayer === "O") {
        //if gameboard is 3by3 or 4by4: pick a random empty cell from all the empty cells
        let freeCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        //if gameboard is 5by5: pick next empty cell
        if (boardSize == 5) {
            freeCell = emptyCells[0];
        }
        //add AI move to game state array and make the move visible
        setTimeout(() => {
            gameState[freeCell.cellIndex] = currentPlayer;
            document.querySelector(`[data-cell-index="${freeCell.cellIndex}"]`).innerHTML = currentPlayer;
            handleResultValidation();
        }, 350);
    } 
}

// adding event listeners to each cell
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));

// adding event listeners to restart button
document.querySelector('.restart-button').addEventListener('click', handleRestartGame);
