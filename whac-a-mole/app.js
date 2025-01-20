const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('startButton');

let score = 0;
let timeLeft = 30;
let isPlaying = false;
let moleTimeouts = [];
let gameInterval;
let difficultyFactor = 1000;

function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    return moles[index];
}

function showMole() {
    const mole = randomHole();
    const isBonus = Math.random() < 0.1;

    mole.classList.add('active');
    if (isBonus) {
        mole.classList.add('bonus');
    }

    const duration = Math.random() * 800 + 300 - (score * 5); 
    const timeout = setTimeout(() => {
        mole.classList.remove('active', 'bonus');
        if (isPlaying) showMole();
    }, duration);

    moleTimeouts.push(timeout);
}


function bonk(e) {
    if (!e.target.classList.contains('active')) return;

    if (e.target.classList.contains('bonus')) {
        score += 5;
    } else {
        score++;
    }

    scoreDisplay.textContent = score;
    e.target.classList.remove('active', 'bonus');
    e.target.parentNode.classList.add('bonk');

    setTimeout(() => {
        e.target.parentNode.classList.remove('bonk');
    }, 500);

    
    if (score % 10 === 0) {
        difficultyFactor = Math.max(difficultyFactor - 100, 400); 
    }
}

// Start the game
function startGame() {
    if (isPlaying) return;

    isPlaying = true;
    score = 0;
    timeLeft = 30;
    difficultyFactor = 1000;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    startButton.disabled = true;

    showMole();

    // Countdown timer
    gameInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// End the game
function endGame() {
    clearInterval(gameInterval);
    moleTimeouts.forEach(timeout => clearTimeout(timeout));
    moleTimeouts = [];
    moles.forEach(mole => mole.classList.remove('active', 'bonus'));

    isPlaying = false;
    startButton.disabled = false;

    alert(`Game Over! Your score: ${score}`);
}

moles.forEach(mole => mole.addEventListener('click', bonk));
startButton.addEventListener('click', startGame);