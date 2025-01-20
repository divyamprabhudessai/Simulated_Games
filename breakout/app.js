class Breakout {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        this.canvas.width = 480;
        this.canvas.height = 640;

        // Game constants
        this.PADDLE_HEIGHT = 10;
        this.INITIAL_PADDLE_WIDTH = 115;
        this.PADDLE_WIDTH = this.INITIAL_PADDLE_WIDTH;
        this.BALL_SIZE = 8;
        this.BLOCK_HEIGHT = 20;
        this.BLOCK_WIDTH = 82;
        this.BLOCK_PADDING = 10;

        // Game state
        this.score = 0;
        this.gameOver = false;
        this.gameWon = false;
        this.animationId = null;

        // Initialize game objects
        this.paddle = {
            x: this.canvas.width / 2 - this.PADDLE_WIDTH / 2,
            y: this.canvas.height - this.PADDLE_HEIGHT - 10,
            dx: 7,
        };

        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height - this.PADDLE_HEIGHT - 20,
            dx: 4,
            dy: -4,
        };

        this.blocks = this.createBlocks();

        // Controls
        this.rightPressed = false;
        this.leftPressed = false;

        // Bind event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        // Start button
        this.startButton = document.getElementById('startButton');
        this.startButton.addEventListener('click', () => this.startGame());

        // Message element
        this.messageEl = document.getElementById('message');
        this.scoreEl = document.getElementById('score');
    }

    createBlocks() {
        const blocks = [];
        const rows = 5;
        const blocksPerRow = Math.floor(
            (this.canvas.width - this.BLOCK_PADDING) / (this.BLOCK_WIDTH + this.BLOCK_PADDING)
        );
        const colors = ['#d6c2f2', '#c3a3f0', '#a877ed', '#9857f2', '#8030f0'];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < blocksPerRow; j++) {
                blocks.push({
                    x: j * (this.BLOCK_WIDTH + this.BLOCK_PADDING) + this.BLOCK_PADDING,
                    y: i * (this.BLOCK_HEIGHT + this.BLOCK_PADDING) + this.BLOCK_PADDING + 40,
                    width: this.BLOCK_WIDTH,
                    height: this.BLOCK_HEIGHT,
                    color: colors[i],
                });
            }
        }
        return blocks;
    }

    handleKeyDown(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            this.rightPressed = true;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            this.leftPressed = true;
        }
    }

    handleKeyUp(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            this.rightPressed = false;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            this.leftPressed = false;
        }
    }

    movePaddle() {
        if (this.rightPressed && this.paddle.x < this.canvas.width - this.PADDLE_WIDTH) {
            this.paddle.x += this.paddle.dx;
        } else if (this.leftPressed && this.paddle.x > 0) {
            this.paddle.x -= this.paddle.dx;
        }
    }

    moveBall() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Wall collisions
        if (this.ball.x + this.BALL_SIZE > this.canvas.width || this.ball.x - this.BALL_SIZE < 0) {
            this.ball.dx = -this.ball.dx;
        }
        if (this.ball.y - this.BALL_SIZE < 0) {
            this.ball.dy = -this.ball.dy;
        }

        // Paddle collision
        if (
            this.ball.y + this.BALL_SIZE > this.paddle.y &&
            this.ball.x > this.paddle.x &&
            this.ball.x < this.paddle.x + this.PADDLE_WIDTH
        ) {
            this.ball.dy = -Math.abs(this.ball.dy);

            this.ball.dx = this.ball.dx + (Math.random() - 0.5) * 2;
        }

        // Game over
        if (this.ball.y + this.BALL_SIZE > this.canvas.height) {
            this.gameOver = true;
        }
    }

    checkBlockCollision() {
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            const block = this.blocks[i];
            if (
                this.ball.x > block.x &&
                this.ball.x < block.x + block.width &&
                this.ball.y > block.y &&
                this.ball.y < block.y + block.height
            ) {
                this.ball.dy = -this.ball.dy;
                this.blocks.splice(i, 1);
                this.score += 10;
                this.scoreEl.textContent = this.score;

                if (this.blocks.length === 0) {
                    this.gameWon = true;
                }
            }
        }
    }

    adjustDifficulty() {
        // Increase ball speed based on score
        const speedIncrement = Math.floor(this.score / 50); 
        const baseSpeed = 4;
        const maxSpeed = 10;
        const speedMultiplier = Math.min(baseSpeed + speedIncrement, maxSpeed);

        const directionX = this.ball.dx / Math.abs(this.ball.dx || 1);
        const directionY = this.ball.dy / Math.abs(this.ball.dy || 1);

        this.ball.dx = speedMultiplier * directionX;
        this.ball.dy = speedMultiplier * directionY;

        
        const minPaddleWidth = 60;
        this.PADDLE_WIDTH = Math.max(
            this.INITIAL_PADDLE_WIDTH - speedIncrement * 10,
            minPaddleWidth
        );
    }

    draw() {
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.blocks.forEach((block) => {
            this.ctx.fillStyle = block.color;
            this.ctx.fillRect(block.x, block.y, block.width, block.height);
        });

       
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.PADDLE_WIDTH, this.PADDLE_HEIGHT);

        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.BALL_SIZE, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.closePath();
    }

    update() {
        if (!this.gameOver && !this.gameWon) {
            this.movePaddle();
            this.moveBall();
            this.checkBlockCollision();
            this.adjustDifficulty();
            this.draw();
            this.animationId = requestAnimationFrame(() => this.update());
        } else {
            if (this.gameOver) {
                this.messageEl.textContent = 'Game Over! Click Start to play again';
            } else if (this.gameWon) {
                this.messageEl.textContent = 'Congratulations! You won!';
            }
            this.startButton.textContent = 'Play Again';
            this.startButton.style.display = 'block';
        }
    }

    reset() {
        this.score = 0;
        this.scoreEl.textContent = '0';
        this.gameOver = false;
        this.gameWon = false;
        this.messageEl.textContent = '';
        this.blocks = this.createBlocks();

        this.paddle.x = this.canvas.width / 2 - this.PADDLE_WIDTH / 2;
        this.PADDLE_WIDTH = this.INITIAL_PADDLE_WIDTH;

        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - this.PADDLE_HEIGHT - 20;
        this.ball.dx = 4;
        this.ball.dy = -4;
    }

    startGame() {
        this.reset();
        this.startButton.style.display = 'none';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.update();
    }
}


const game = new Breakout();