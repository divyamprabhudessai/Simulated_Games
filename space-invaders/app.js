const grid = document.querySelector('.grid');
const resultDisplay = document.querySelector('#result');
const startButton = document.querySelector('#start-button');
const gameOverScreen = document.querySelector('.game-over');
const width = 15;
const squares = [];
let currentShooterIndex = width * width - Math.ceil(width / 2);
let alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];
const originalAlienInvaders = [...alienInvaders];
let aliensRemoved = [];
let results = 0;
let direction = 1;
let invadersId;

function createBoard() {
    for (let i = 0; i < width * width; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        squares.push(cell);
        grid.appendChild(cell);
    }
}

function draw() {
    alienInvaders.forEach((invader, i) => {
        if (!aliensRemoved.includes(i)) squares[invader].classList.add('invader');
    });
}

function remove() {
    alienInvaders.forEach(invader => squares[invader]?.classList.remove('invader'));
}

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter');
    if (e.key === 'ArrowLeft' && currentShooterIndex % width !== 0) currentShooterIndex -= 1;
    if (e.key === 'ArrowRight' && currentShooterIndex % width < width - 1) currentShooterIndex += 1;
    squares[currentShooterIndex].classList.add('shooter');
}

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if (rightEdge && direction === 1) {
        direction = -1;
        alienInvaders = alienInvaders.map(invader => invader + width);
    } else if (leftEdge && direction === -1) {
        direction = 1;
        alienInvaders = alienInvaders.map(invader => invader + width);
    } else {
        alienInvaders = alienInvaders.map(invader => invader + direction);
    }

    draw();

    // Check if shooter collides with an invader
    if (squares[currentShooterIndex].classList.contains('invader')) {
        endGame(false); // Player loses
    }

    // Check if any invader reaches the last row
    if (alienInvaders.some(invader => invader > squares.length - width)) {
        endGame(false); // Player loses
    }

    // Check if all invaders are removed
    if (aliensRemoved.length === alienInvaders.length) {
        endGame(true); // Player wins
    }
}

function shoot(e) {
    if (e.key !== 'ArrowUp') return;
    let laserIndex = currentShooterIndex;

    function moveLaser() {
        squares[laserIndex]?.classList.remove('laser');
        laserIndex -= width;
        if (laserIndex < 0) return clearInterval(laserId);
        squares[laserIndex]?.classList.add('laser');
        if (squares[laserIndex]?.classList.contains('invader')) {
            squares[laserIndex]?.classList.remove('laser', 'invader');
            squares[laserIndex]?.classList.add('boom');
            setTimeout(() => squares[laserIndex]?.classList.remove('boom'), 300);
            aliensRemoved.push(alienInvaders.indexOf(laserIndex));
            results++;
            resultDisplay.textContent = results;
            clearInterval(laserId);
        }
    }
    const laserId = setInterval(moveLaser, 100);
}

function startGame() {
    createBoard();
    squares[currentShooterIndex].classList.add('shooter');
    draw();
    document.addEventListener('keydown', moveShooter);
    document.addEventListener('keydown', shoot);
    startButton.disabled = true;
    invadersId = setInterval(moveInvaders, 500);
}

function endGame(win) {
    clearInterval(invadersId);
    document.removeEventListener('keydown', moveShooter);
    document.removeEventListener('keydown', shoot);

    // Update game over screen based on win/loss
    const finalScoreElement = gameOverScreen.querySelector('.final-score');
    if (win) {
        gameOverScreen.querySelector('h2').textContent = "You Win!";
    } else {
        gameOverScreen.querySelector('h2').textContent = "Game Over!";
    }
    finalScoreElement.textContent = results;

    gameOverScreen.classList.add('active');
}

function resetGame() {
    alienInvaders = [...originalAlienInvaders];
    aliensRemoved = [];
    results = 0;
    resultDisplay.textContent = '0';
    squares.forEach(square => square.className = 'cell');
    squares[currentShooterIndex].classList.add('shooter');
    draw();
    gameOverScreen.classList.remove('active');
    startButton.disabled = false;
}

startButton.addEventListener('click', startGame);