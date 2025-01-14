let playerScore = 0;
let computerScore = 0;

const choices = ['rock', 'paper', 'scissors'];

document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', () => {
        const playerChoice = button.getAttribute('data-choice');
        const computerChoice = getComputerChoice();
        const result = determineWinner(playerChoice, computerChoice);

        updateScores(result);
        displayResult(playerChoice, computerChoice, result);
    });
});

document.getElementById('reset-btn').addEventListener('click', resetGame);

function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function determineWinner(player, computer) {
    if (player === computer) return 'tie';
    if (
        (player === 'rock' && computer === 'scissors') ||
        (player === 'scissors' && computer === 'paper') ||
        (player === 'paper' && computer === 'rock')
    ) {
        return 'player';
    }
    return 'computer';
}

function updateScores(result) {
    if (result === 'player') {
        playerScore++;
    } else if (result === 'computer') {
        computerScore++;
    }
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
}

function displayResult(player, computer, result) {
    const resultDiv = document.getElementById('result');
    let message = `You chose ${player}, Computer chose ${computer}. `;
    if (result === 'player') {
        message += 'You Win!🥳';
    } else if (result === 'computer') {
        message += 'Computer Wins!😔';
    } else {
        message += "It's a Tie!😐";
    }
    resultDiv.innerHTML = `<p>${message}</p>`;
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
    document.getElementById('result').innerHTML = '<p>Make your move!</p>';
}