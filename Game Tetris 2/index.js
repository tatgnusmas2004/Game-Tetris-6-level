/*** CONSTANT ***/
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLOR_MAPPING = [
    'red',
    'orange',
    'green',
    'purple',
    'blue',
    'cyan',
    'yellow',
    'white',
];

const BRICK_LAYOUT = [
    [
        [
            [1, 7, 7],
            [1, 1, 1]
        ],
        [
            [1, 1],
            [1, 7],
            [1, 7],
        ],
        [
            [1, 1, 1],
            [7, 7, 1],
        ],
        [
            [7, 1],
            [7, 1],
            [1, 1],
        ],
    ],
    [
        [
            [1, 7],
            [1, 7],
            [1, 1],
        ],
        [
            [1, 1, 1],
            [1, 7, 7],
        ],
        [
            [1, 1],
            [7, 1],
            [7, 1],
        ],
        [
            [7, 7, 1],
            [1, 1, 1],
        ],
    ],
    [
        [
            [1, 7],
            [1, 1],
            [7, 1],
        ],
        [
            [7, 1, 1],
            [1, 1, 7],
        ],
        [
            [1, 7],
            [1, 1],
            [7, 1],
        ],
        [
            [7, 1, 1],
            [1, 1, 7],
        ],
    ],
    [
        [
            [7, 1],
            [1, 1],
            [1, 7],
        ],
        [
            [1, 1, 7],
            [7, 1, 1],
        ],
        [
            [7, 1],
            [1, 1],
            [1, 7],
        ],
        [
            [1, 1, 7],
            [7, 1, 1],
        ],
    ],
    [
        [
            [1, 1, 1, 1],
        ],
        [
            [1],
            [1],
            [1],
            [1],
        ],
        [
            [1, 1, 1, 1],
        ],
        [
            [1],
            [1],
            [1],
            [1],
        ],
    ],
    [
        [
            [1, 1],
            [1, 1],
        ],
        [
            [1, 1],
            [1, 1],
        ],
        [
            [1, 1],
            [1, 1],
        ],
        [
            [1, 1],
            [1, 1],
        ],
    ],
    [
        [
            [7, 1, 7],
            [1, 1, 1],
        ],
        [
            [1, 7],
            [1, 1],
            [1, 7],
        ],
        [
            [1, 1, 1],
            [7, 1, 7],
        ],
        [
            [7, 1],
            [1, 1],
            [7, 1],
        ],
    ],
];

const WHITE_COLOR_ID = 7;

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.generateWhiteBoard();
    }

    generateWhiteBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(WHITE_COLOR_ID));
    }

    drawCell(xAxis, yAxis, colorId) {
        this.ctx.fillStyle = COLOR_MAPPING[colorId] || COLOR_MAPPING[WHITE_COLOR_ID];
        this.ctx.fillRect(xAxis * BLOCK_SIZE, yAxis * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        this.ctx.fillStyle = 'black';
        this.ctx.strokeRect(xAxis * BLOCK_SIZE, yAxis * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }

    drawBoard() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                this.drawCell(col, row, this.grid[row][col]);
            }
        }
    }
}
board = new Board(ctx);
board.drawBoard();
console.table(board.grid);

class Brick {
    constructor(id) {
        this.id = id;
        this.layout = BRICK_LAYOUT[id];
        this.activeIndex = 0;
        this.rowPos = 0; // Pos x
        this.colPos = 3; // Pos y
    }

    draw() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
                    board.drawCell(col + this.colPos, row + this.rowPos, this.id);
                }
            }
        }
    }

    clear() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
                    board.drawCell(col + this.colPos, row + this.rowPos, WHITE_COLOR_ID);
                }
            }
        }
    }

    moveLeft() {
        if (!this.checkCollide(this.colPos - 1)) {
            this.clear();
            this.colPos--;
            this.draw();
        }
    }

    moveRight() {
        if (!this.checkCollide(this.colPos + 1)) {
            this.clear();
            this.colPos++;
            this.draw();
        }
    }

    moveDown() {
        this.clear();
        this.rowPos += 1;
        this.draw();
    }

    rotate() {
        this.clear();
        this.activeIndex = (this.activeIndex + 1) % 4;
        this.draw();
    }

    checkCollide(nextMove) {
        // xét đường biên trái
        if (nextMove < 0) {
            return true;
        // xét đường biên phải
        } else if (nextMove + this.layout[this.activeIndex][0].length > COLS) {
            return true;
        }
    }

    randomBrick() {
        return Math.floor(Math.random() * BRICK_LAYOUT.length);
    }
}

document.addEventListener("keydown", (event) => {
    if (event.keyCode === 37) {
        brick.moveLeft();
    } else if (event.keyCode === 39) {
        brick.moveRight();
    } else if (event.keyCode === 40) {
        brick.moveDown();
    } else if (event.keyCode === 81) {
        brick.rotate();
    } else if (event.keyCode === 69) {
        brick.rotate();
    }
});

brick = new Brick(0);
brick = new Brick(brick.randomBrick());
console.log(brick.layout[0][0].length);

function play() {
    brick.draw();
    // setInterval(() => {
    //     brick.moveDown();
    // }, 1000);
}
