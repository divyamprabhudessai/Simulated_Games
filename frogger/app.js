const width = 9;
const grid = document.querySelector('.grid');
const squares = document.querySelectorAll('.grid div');
const timeLeftDisplay = document.querySelector('#time-left');
const startPauseButton = document.querySelector('#start-pause-button');

let currentIndex = 76; // Starting position
let timerId = null;
let outcomeTimerId = null;
let moveTimerId = null;
let timeLeft = 20;
let isGamePaused = true;

// Game State Management
function toggleGame() {
    if (isGamePaused) {
        startGame();
    } else {
        pauseGame();
    }
}

function startGame() {
    isGamePaused = false;
    startPauseButton.textContent = 'Pause';
    
    // Start all game timers
    timerId = setInterval(countdown, 1000);
    outcomeTimerId = setInterval(checkOutcome, 50);
    moveTimerId = setInterval(moveElements, 1000);
    
    // Initialize starting positions for cars and logs
    initializeMovingElements();
}

function pauseGame() {
    isGamePaused = true;
    startPauseButton.textContent = 'Start';
    clearAllTimers();
}

function clearAllTimers() {
    clearInterval(timerId);
    clearInterval(outcomeTimerId);
    clearInterval(moveTimerId);
}

// Moving Elements Management
function initializeMovingElements() {
    // Initialize cars (keeping car density the same)
    initializeRow('.c1', 'car', [0, 4]);           // Two cars in first lane
    initializeRow('.c2', 'car', [2, 6]);           // Two cars in second lane
    initializeRow('.c3', 'car', [1, 5]);           // Two cars in third lane
    
    // Initialize logs with higher density
    initializeRow('.l1', 'log', [1, 4, 7]);        // Three logs in first river lane
    initializeRow('.l2', 'log', [0, 3, 6]);        // Three logs in second river lane
    initializeRow('.l3', 'log', [2, 5, 8]);        // Three logs in third river lane
}

function initializeRow(selector, className, positions) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => element.classList.remove(className));
    positions.forEach(pos => elements[pos].classList.add(className));
}

function moveElements() {
    if (isGamePaused) return;
    
    moveCars();
    moveLogs();
    
    // Check if frog is on a log and move it
    if (squares[currentIndex].classList.contains('log')) {
        moveWithLog();
    }
}

function moveCars() {
    moveRow('.c1', 'car', 1);  // Move right
    moveRow('.c2', 'car', -1); // Move left
    moveRow('.c3', 'car', 1);  // Move right
}

function moveLogs() {
    // Move logs in each river lane
    moveRow('.l1', 'log', -1); // Move left
    moveRow('.l2', 'log', 1);  // Move right
    moveRow('.l3', 'log', -1); // Move left
}

function moveRow(selector, className, direction) {
    const elements = Array.from(document.querySelectorAll(selector));
    const hasClass = elements.map(element => element.classList.contains(className));
    
    elements.forEach(element => element.classList.remove(className));
    
    hasClass.forEach((shouldHaveClass, i) => {
        if (shouldHaveClass) {
            const newIndex = (i + direction + elements.length) % elements.length;
            elements[newIndex].classList.add(className);
        }
    });
}

function moveWithLog() {
    const currentRow = Math.floor(currentIndex / width);
    let moveDirection = 0;
    
    // Determine movement direction based on row
    if (currentRow === 1) moveDirection = -1;      // L1 moves left
    else if (currentRow === 2) moveDirection = 1;  // L2 moves right
    else if (currentRow === 3) moveDirection = -1; // L3 moves left
    
    const newIndex = currentIndex + moveDirection;
    
    // Check if move is valid (not going off grid)
    if (newIndex >= 0 && newIndex < width * width && 
        Math.floor(newIndex / width) === currentRow) {
        squares[currentIndex].classList.remove('frog');
        currentIndex = newIndex;
        squares[currentIndex].classList.add('frog');
    }
}

// Player Movement
function moveFrog(e) {
    if (isGamePaused) return;
    
    squares[currentIndex].classList.remove('frog');
    
    switch(e.key) {
        case 'ArrowLeft':
            if (currentIndex % width !== 0) currentIndex -= 1;
            break;
        case 'ArrowRight':
            if (currentIndex % width < width - 1) currentIndex += 1;
            break;
        case 'ArrowUp':
            if (currentIndex - width >= 0) currentIndex -= width;
            break;
        case 'ArrowDown':
            if (currentIndex + width < width * width) currentIndex += width;
            break;
    }
    
    squares[currentIndex].classList.add('frog');
}

// Win/Lose Conditions
function checkOutcome() {
    if (isGamePaused) return;
    
    const currentSquare = squares[currentIndex];
    
    // Check win condition
    if (currentSquare.classList.contains('ending-block')) {
        win();
        return;
    }
    
    // Check lose conditions
    if (currentSquare.classList.contains('car')) {
        lose('Splat! Hit by a car!');
        return;
    }
    
    // Check if in river without a log
    if (isInRiver() && !currentSquare.classList.contains('log')) {
        lose('Splash! Fell in the river!');
        return;
    }
    
    // Check if out of bounds (fell off log)
    if (currentIndex < 0 || currentIndex >= width * width) {
        lose('Oops! Fell off the edge!');
        return;
    }
}

function isInRiver() {
    const row = Math.floor(currentIndex / width);
    return row >= 1 && row <= 3;
}

function win() {
    clearAllTimers();
    alert('🎉 YOU WIN! You made it safely across!');
    resetGame();
}

function lose(message) {
    clearAllTimers();
    alert(`🐸 Game Over! ${message}`);
    resetGame();
}



// Timer Management
function countdown() {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;
    
    if (timeLeft <= 0) {
        lose('Time\'s up!');
    }
}

// Game Reset
function resetGame() {
    timeLeft = 45; // Increased from 20 to 25 seconds for better balance
    timeLeftDisplay.textContent = timeLeft;
    currentIndex = 76;
    isGamePaused = true;
    startPauseButton.textContent = 'Start';
    
    // Clear all game elements
    squares.forEach(square => {
        square.classList.remove('frog', 'car', 'log');
    });
    
    // Reset frog position
    squares[currentIndex].classList.add('frog');
    
    // Initialize moving elements
    initializeMovingElements();
}

// Event Listeners
document.addEventListener('keyup', moveFrog);
startPauseButton.addEventListener('click', toggleGame);

// Initial Setup
resetGame();