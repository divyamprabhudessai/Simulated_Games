class ConnectFour {
    constructor() {
        this.ROWS = 6;
        this.COLS = 7;
        this.board = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(null));
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.scores = { red: 0, yellow: 0 };
        this.soundEnabled = true;
        this.currentTheme = 'classic';
        this.isAIEnabled = true; // AI is player 2 (yellow)
        
        this.boardElement = document.getElementById('board');
        this.statusElement = document.getElementById('status');
        this.resetButton = document.getElementById('resetButton');
        this.resetScoresButton = document.getElementById('resetScoresButton');
        this.soundToggle = document.getElementById('soundToggle');
        this.themeSelector = document.getElementById('theme');
        this.player1ScoreElement = document.getElementById('player1Score');
        this.player2ScoreElement = document.getElementById('player2Score');
        
        this.dropSound = document.getElementById('dropSound');
        this.winSound = document.getElementById('winSound');
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.boardElement.innerHTML = '';
        this.board = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(null));
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.updateTheme(this.currentTheme);
        this.createBoard();
        this.updateStatus();
    }

    setupEventListeners() {
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.resetScoresButton.addEventListener('click', () => this.resetScores());
        this.soundToggle.addEventListener('change', (e) => this.soundEnabled = e.target.checked);
        this.themeSelector.addEventListener('change', (e) => this.updateTheme(e.target.value));
    }

    createBoard() {
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => this.handleCellClick(col));
                this.boardElement.appendChild(cell);
            }
        }
    }

    updateTheme(theme) {
        this.currentTheme = theme;
        this.boardElement.className = `board ${theme}`;
    }

    handleCellClick(col) {
        if (this.gameOver) return;
        
        const row = this.findLowestEmptyRow(col);
        if (row === -1) return;

        this.makeMove(row, col);
    }

    makeMove(row, col) {
        this.board[row][col] = this.currentPlayer;
        this.renderPiece(row, col);
        
        if (this.soundEnabled) {
            this.dropSound.currentTime = 0;
            this.dropSound.play();
        }

        if (this.checkWin(row, col)) {
            this.handleWin();
            return;
        }

        if (this.checkDraw()) {
            this.handleDraw();
            return;
        }

        this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
        this.updateStatus();

        // If it's AI's turn
        if (this.isAIEnabled && this.currentPlayer === 'yellow') {
            setTimeout(() => this.makeAIMove(), 1000);
        }
    }

    makeAIMove() {
        if (this.gameOver) return;

        // 1. Check for winning move
        const winningMove = this.findWinningMove('yellow');
        if (winningMove !== -1) {
            const row = this.findLowestEmptyRow(winningMove);
            this.makeMove(row, winningMove);
            return;
        }

        // 2. Block opponent's winning move
        const blockingMove = this.findWinningMove('red');
        if (blockingMove !== -1) {
            const row = this.findLowestEmptyRow(blockingMove);
            this.makeMove(row, blockingMove);
            return;
        }

        // 3. Try to play center column
        if (this.findLowestEmptyRow(3) !== -1) {
            const row = this.findLowestEmptyRow(3);
            this.makeMove(row, 3);
            return;
        }

        // 4. Make a random valid move
        const validMoves = this.getValidMoves();
        if (validMoves.length > 0) {
            const randomCol = validMoves[Math.floor(Math.random() * validMoves.length)];
            const row = this.findLowestEmptyRow(randomCol);
            this.makeMove(row, randomCol);
        }
    }

    findWinningMove(player) {
        for (let col = 0; col < this.COLS; col++) {
            const row = this.findLowestEmptyRow(col);
            if (row !== -1) {
                this.board[row][col] = player;
                if (this.checkWin(row, col)) {
                    this.board[row][col] = null;
                    return col;
                }
                this.board[row][col] = null;
            }
        }
        return -1;
    }

    getValidMoves() {
        const validMoves = [];
        for (let col = 0; col < this.COLS; col++) {
            if (this.findLowestEmptyRow(col) !== -1) {
                validMoves.push(col);
            }
        }
        return validMoves;
    }

    findLowestEmptyRow(col) {
        for (let row = this.ROWS - 1; row >= 0; row--) {
            if (!this.board[row][col]) return row;
        }
        return -1;
    }

    renderPiece(row, col) {
        const cell = this.boardElement.children[row * this.COLS + col];
        const piece = document.createElement('div');
        piece.className = `piece player${this.currentPlayer}`;
        cell.appendChild(piece);
    }

    checkWin(row, col) {
        const directions = [
            [[0, 1], [0, -1]], // Horizontal
            [[1, 0], [-1, 0]], // Vertical
            [[1, 1], [-1, -1]], // Diagonal /
            [[1, -1], [-1, 1]] // Diagonal \
        ];

        for (const [dir1, dir2] of directions) {
            const count = 1 +
                this.countDirection(row, col, dir1[0], dir1[1]) +
                this.countDirection(row, col, dir2[0], dir2[1]);
            
            if (count >= 4) {
                return true;
            }
        }
        return false;
    }

    countDirection(row, col, rowDir, colDir) {
        const player = this.board[row][col];
        let count = 0;
        let currentRow = row + rowDir;
        let currentCol = col + colDir;

        while (
            currentRow >= 0 &&
            currentRow < this.ROWS &&
            currentCol >= 0 &&
            currentCol < this.COLS &&
            this.board[currentRow][currentCol] === player
        ) {
            count++;
            currentRow += rowDir;
            currentCol += colDir;
        }

        return count;
    }

    checkDraw() {
        return this.board[0].every(cell => cell !== null);
    }

    handleWin() {
        this.gameOver = true;
        this.scores[this.currentPlayer]++;
        this.updateScores();
        this.statusElement.textContent = `Player ${this.currentPlayer} wins!`;
        
        if (this.soundEnabled) {
            this.winSound.currentTime = 0;
            this.winSound.play();
        }
    }

    handleDraw() {
        this.gameOver = true;
        this.statusElement.textContent = "It's a draw!";
    }

    updateStatus() {
        this.statusElement.textContent = `Player ${this.currentPlayer}'s turn`;
    }

    updateScores() {
        this.player1ScoreElement.textContent = this.scores['red'];
        this.player2ScoreElement.textContent = this.scores['yellow'];
    }

    resetGame() {
        this.initializeGame();
    }

    resetScores() {
        this.scores = { red: 0, yellow: 0 };
        this.updateScores();
        this.resetGame();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ConnectFour();
});