
var arr = [[], [], [], [], [], [], [], [], []];

for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
        (function(i, j) {
            arr[i][j].onclick = function () {
                handleCellClick(i, j);
            };
        })(i, j);
    }
}

var board = Array.from({ length: 9 }, () => Array(9).fill(0));

function FillBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                arr[i][j].innerText = board[i][j];
            } else {
                arr[i][j].innerText = '';
            }
        }
    }
}

function handleCellClick(i, j) {
    let userInput = prompt("Enter a number between 1 and 9:");
    let num = parseInt(userInput);

    if (!isNaN(num) && num >= 1 && num <= 9) {
        board[i][j] = num;
        FillBoard(board);
    } else {
        alert("Invalid input. Please enter a number between 1 and 9.");
    }
}

let GetPuzzle = document.getElementById('GetPuzzle');
let SolvePuzzle = document.getElementById('SolvePuzzle');

GetPuzzle.onclick = function () {
    const selectElement = document.getElementById('difficulty');
    const selectedValue = selectElement.value;

    var xhrRequest = new XMLHttpRequest();
    xhrRequest.onload = function () {
        var response = JSON.parse(xhrRequest.response);
        console.log(response);
        board = response.board;
        FillBoard(board);
    };

    xhrRequest.open('get', `https://sugoku.onrender.com/board?difficulty=${selectedValue}`);
    xhrRequest.send();
};

SolvePuzzle.onclick = () => {
    SudokuSolver(board, 0, 0, 9);
};

function SudokuSolver(board, i, j, n) {
    if (i == n) {
        FillBoard(board);
        return true;
    }

    if (j == n) {
        return SudokuSolver(board, i + 1, 0, n);
    }

    if (board[i][j] != 0) {
        return SudokuSolver(board, i, j + 1, n);
    }

    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, i, j, num)) {
            board[i][j] = num;
            if (SudokuSolver(board, i, j + 1, n)) {
                return true;
            }
            board[i][j] = 0;
        }
    }

    return false;
}

function isSafe(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] == num || board[x][col] == num ||
            board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] == num) {
            return false;
        }
    }
    return true;
}
