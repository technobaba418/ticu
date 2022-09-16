// Tic-Tac-Toe
// Code written by Rutuparn Pawar (InputBlackBoxOutput)
// Created on 25 May 2020

///////////////////////////////////////////////////////////////////////////////////////////
// DOM linking to play grid and score area
buttonGrid = document.getElementsByClassName('cell');
for (let i = 0; i < buttonGrid.length; i++) {
	buttonGrid[i].addEventListener('click', function () {
		buttonPressed(i);
	})
}

function reset() {
	clearPlayArea();
	currentPlayer = CROSS;
	gameOver = false;
}

_reset = document.getElementById("reset")
_reset.addEventListener('click', function () {
	reset();
})

_again = document.getElementById("play-again")
_again.addEventListener('click', function () {
	reset();
	_reset.hidden = false;
	_again.hidden = true;
})

_cross_score = document.getElementById('cross-score');
_nut_score = document.getElementById('nut-score');

//////////////////////////////////////////////////////////////////////////////////////////
// DOM linking to game difficulty

difficulty = 2;
_possible = document.getElementById("possible");
_impossible = document.getElementById("impossible");
_impossible.style.cssText = "background-color: #3CA11B; color: white;";

_possible.addEventListener('click', function () {
	difficulty = 1;
	_possible.style.cssText = "";
	_impossible.style.cssText = "";
	_possible.style.cssText = "background-color: #3CA11B; color:white;";
	_cross_score.innerText = "X: 0";
	_nut_score.innerText = "O: 0";
	reset();
})

_impossible.addEventListener('click', function () {
	difficulty = 2;
	_possible.style.cssText = "";
	_impossible.style.cssText = "";
	_impossible.style.cssText = "background-color: #3CA11B; color:white";
	_cross_score.innerText = "X: 0";
	_nut_score.innerText = "O: 0";
	reset();
})

/////////////////////////////////////////////////////////////////////////////////////////
let gridMap = ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '];
let CROSS = 'X';
let EMPTY = '  ';
let NUT = 'O';
let currentPlayer = CROSS;
let gameOver = false;
let botGame = true;

let switchCurrentPlayer = function () { if (currentPlayer == CROSS) currentPlayer = NUT; else currentPlayer = CROSS; };

function placeCrossNut(position, player) {
	if (player == NUT && gridMap[position] == EMPTY) {
		buttonGrid[position].src = "img/nut.png";
		gridMap[position] = NUT;
		return true;
	}
	else if (player == CROSS && gridMap[position] == EMPTY) {
		buttonGrid[position].src = "img/cross.png";
		gridMap[position] = CROSS;
		return true;
	}
	else
		return false;
}

function winnerCheck(player) {
	// Check for 3 cross/nut in a column
	for (let i = 0; i < 3; i++) {
		let win_count = 0;
		for (let x = 0 + i; x < 9; x += 3) {
			if (gridMap[x] == player)
				win_count += 1;
		}
		if (win_count == 3)
			return [true, `C${i}`];
	}

	//Check for 3 cross/nut in a row
	for (let i = 0; i < 3; i++) {
		let win_count = 0;
		for (let x = i * 3; x < (i * 3) + 3; x++) {
			if (gridMap[x] == player)
				win_count += 1;
		}
		if (win_count == 3)
			return [true, `R${i}`];
	}

	//Check for 3 cross/nut across diagonals
	let win_count = 0;
	if (gridMap[0] == player) win_count += 1;
	if (gridMap[4] == player) win_count += 1;
	if (gridMap[8] == player) win_count += 1;
	if (win_count == 3)
		return [true, 'D1'];

	win_count = 0;
	if (gridMap[2] == player) win_count += 1;
	if (gridMap[4] == player) win_count += 1;
	if (gridMap[6] == player) win_count += 1;
	if (win_count == 3)
		return [true, 'D2'];

	return [false, null]
}

function vacantPositions() {
	let vacantPos = []
	for (let i = 0; i < 9; i++)
		if (gridMap[i] == EMPTY) {
			vacantPos.push(i);
		}
	return vacantPos;
}

let gameTied = function () { if ((vacantPositions()).length == 0) return true; else return false; }


// Work on while loop : It may cause the loop to run forever!
function playRandomMove() {
	/// console.log('Playing random move');
	if (!gameTied()) {
		vacantPos = vacantPositions();
		move = vacantPos[Math.floor(Math.random() * vacantPos.length)];
		gridMap[move] = NUT;
		buttonGrid[move].src = "img/nut.png";
	}
}

// Hand written rules based AI
function botMove(level) {
	if (!gameTied()) {
		let chance = Math.floor(Math.random() * level);

		if (chance > 0) {
			let vacantPos = vacantPositions();

			// // Check if winning move possible
			for (let i = 0; i < vacantPos.length; i++) {
				gridMap[vacantPos[i]] = NUT;

				if (!(winnerCheck(NUT)[0]))
					gridMap[vacantPos[i]] = EMPTY;
				else {
					/// console.log(" Winning move");
					buttonGrid[vacantPos[i]].src = "img/nut.png";
					return;
				}
			}

			// Check if blocking move possible
			for (let i = 0; i < vacantPos.length; i++) {
				gridMap[vacantPos[i]] = CROSS;

				if (winnerCheck(CROSS)[0]) {
					/// console.log(" Blocking move");
					gridMap[vacantPos[i]] = NUT;
					buttonGrid[vacantPos[i]].src = "img/nut.png";
					return;
				}
				else
					gridMap[vacantPos[i]] = EMPTY;
			}
			playRandomMove();

		}
		else {
			playRandomMove();
		}
	}

}

function botMoveMinMax() {
	let x, y, move;
	transferGridToBoard();

	if (emptyCells(board).length == 9) {
		x = parseInt(Math.random() * 3);
		y = parseInt(Math.random() * 3);
	}
	else {
		move = minmax(board, emptyCells(board).length, COMP);
		x = move[0];
		y = move[1];
	}

	if (!gameTied()) {
		move = 3 * x + y;
		gridMap[move] = NUT;
		buttonGrid[move].src = "img/nut.png";
	}
	// console.log([x,y]);
}

/////////////////////////////////////////////////////////////////////////////////////////
function updateScoreBoard(winner) {
	if (winner == CROSS)
		_cross_score.innerText = "X: " + (parseInt(_cross_score.innerText[_cross_score.innerText.length - 1]) + 1);
	else
		_nut_score.innerText = "O: " + (parseInt(_nut_score.innerText[_nut_score.innerText.length - 1]) + 1);
}

function clearPlayArea() {
	for (let i = 0; i < buttonGrid.length; i++)
		buttonGrid[i].src = "img/blank.png";
	gridMap = ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '];
}

function showWinner(player, winBy) {
	if (player == 'X') player = 'img/cross_'; else player = 'img/nut_';

	if (winBy[0] == 'C') {
		switch (winBy[1]) {
			case '0': buttonGrid[0].src = `${player}c0.png`; buttonGrid[3].src = `${player}c1.png`; buttonGrid[6].src = `${player}c2.png`; break;
			case '1': buttonGrid[1].src = `${player}c0.png`; buttonGrid[4].src = `${player}c1.png`; buttonGrid[7].src = `${player}c2.png`; break;
			case '2': buttonGrid[2].src = `${player}c0.png`; buttonGrid[5].src = `${player}c1.png`; buttonGrid[8].src = `${player}c2.png`; break;
		}
	}
	else if (winBy[0] == 'R') {
		switch (winBy[1]) {
			case '0': buttonGrid[0].src = `${player}r0.png`; buttonGrid[1].src = `${player}r1.png`; buttonGrid[2].src = `${player}r2.png`; break;
			case '1': buttonGrid[3].src = `${player}r0.png`; buttonGrid[4].src = `${player}r1.png`; buttonGrid[5].src = `${player}r2.png`; break;
			case '2': buttonGrid[6].src = `${player}r0.png`; buttonGrid[7].src = `${player}r1.png`; buttonGrid[8].src = `${player}r2.png`; break;
		}
	}
	else {
		switch (winBy[1]) {
			case '1': buttonGrid[0].src = `${player}d0.png`; buttonGrid[4].src = `${player}d1.png`; buttonGrid[8].src = `${player}d2.png`; break;
			case '2': buttonGrid[2].src = `${player}do0.png`; buttonGrid[4].src = `${player}do1.png`; buttonGrid[6].src = `${player}do2.png`; break;
		}
	}
}

function buttonPressed(position) {
	if (gameOver == false) {
		_again.disabled = false;
		stat = placeCrossNut(position, currentPlayer);
		if (stat == false) return;

		if (botGame) {
			if (difficulty == 1)
				botMove(18);
			else
				botMoveMinMax();
		}

		let winCross = winnerCheck(CROSS);
		let winNut = winnerCheck(NUT);

		if (winCross[0] || winNut[0]) {
			_reset.hidden = true;
			_again.hidden = false;
			if (winCross[0]) {
				// console.log("Player cross won the game!");
				showWinner(CROSS, winCross[1]);
				updateScoreBoard(CROSS);
			}
			else {
				// console.log("Player nut won the game!");
				showWinner(NUT, winNut[1]);
				updateScoreBoard(NUT);
			}

			gameOver = true;
			return;
		}

		if (!botGame)
			switchCurrentPlayer();

		if (gameTied()) {
			// console.log("Looks like there is no winner!");
			_reset.hidden = true;
			_again.hidden = false;
			gameOver = true;
			return;
		}
	}
}


/////////////////////////////////////////////////////////////////////////////////////////
// Preloading Images
var images = new Array()

function preload() {
	for (let i = 0; i < preload.arguments.length; i++) {
		images[i] = new Image();
		images[i].src = "img/" + preload.arguments[i];
	}
	//console.log("Images preloaded");
}

preload("cross.png", "cross_c0.png", "cross_c1.png", "cross_c2.png", "cross_d0.png", "cross_d1.png", "cross_d2.png", "cross_do0.png", "cross_do1.png", "cross_do2.png", "cross_r0.png", "cross_r1.png", "cross_r2.png", "nut.png", "nut_c0.png", "nut_c1.png", "nut_c2.png", "nut_d0.png", "nut_d1.png", "nut_d2.png", "nut_do0.png", "nut_do1.png", "nut_do2.png", "nut_r0.png", "nut_r1.png", "nut_r2.png");
/////////////////////////////////////////////////////////////////////////////////////////
// EOF
