// Thông tin cá nhân 
// Tên: Trần Anh Trí
// Lớp: DH21DTD
// MSSV: 21130577
// SDT: 0369744946
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

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLOR_LIST = [
    'red',
    'orange',
    'green',
    'purple',
    'blue',
    'cyan',
    'yellow',
    'white',
];

const WHITE_COLOR_ID = 7;

const canvas = document.getElementById('board');
const context = canvas.getContext('2d');

context.canvas.width = COLS * BLOCK_SIZE;
context.canvas.height = ROWS * BLOCK_SIZE;

let score = $("#score").val();
let isPlaying = true;

// Điều kiện level 2 là rotate
let maxRotate = $("#max-rotate input").val();
let rotateCount = 0; // Số lần rotate của brick

class Board {
    constructor(context) {
        this.context = context;
        this.grid = this.createWhiteBoard();
    }

    // Tạo ra bảng ô trắng
    createWhiteBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(WHITE_COLOR_ID));
    }

    // Tạo ra table chứa các ô trắng
    createWhiteBoard() {
        const board = [];
        for (let i = 0; i < ROWS; i++) {
            const row = [];
            for (let j = 0; j < COLS; j++) {
                row.push(WHITE_COLOR_ID);
            }
            board.push(row);
        }
        return board;
    }

    // Hàm vẽ từng ô
    drawCell(xAxis, yAxis, colorId) {
        this.context.fillStyle = COLOR_LIST[colorId];
        this.context.fillRect(xAxis * BLOCK_SIZE, yAxis * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

        // this.context.fillStyle = 'black';
        this.context.strokeRect(xAxis * BLOCK_SIZE, yAxis * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }

    // Hảm vẽ bảng 
    drawBoard() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                this.drawCell(col, row, this.grid[row][col]);
            }
        }
    }

    // Kiểm tra hàng đã đầy hay chưa
    checkFullRows() {
        // Tạo mảng 1 chiều rỗng chứa những dòng đã hoàn thành
        const fullRows = [];
        // Duyệt qua từng dòng của grid
        for (let row = 0; row < this.grid.length; row++) {
            let isFull = true;
            for (let col = 0; col < this.grid[row].length; col++) {
                // kiểm tra xem trong dòng đó có ô trăng hay không (chưa hoàn thành)
                if (this.grid[row][col] === WHITE_COLOR_ID) {
                    isFull = false;
                    break;
                }
            }

            // Đã hoàn thành dòng
            if (isFull) {
                // Thêm vào mảng fullRow đã tạo
                fullRows.push(row);
                score++;
                $("#score").val(score);
            }
        }
        return fullRows;
    }

    // Xử lý khi hàng đã đầy 
    clearFullRows() {
        const fullRows = this.checkFullRows();
        for (let i = fullRows.length - 1; i >= 0; i--) {
            const row = fullRows[i];
            this.grid.splice(row, 1);
        }

        // Thêm hàng trắng vào đầu board
        for (let i = 0; i < fullRows.length; i++) {
            this.grid.unshift(new Array(COLS).fill(WHITE_COLOR_ID));
        }


        // score ;
        // $("#score").val(score);
    }
}
board = new Board(context);
board.drawBoard();

class Brick {
    constructor(id) {
        this.id = id; // chỉ số id của brick
        this.layout = BRICK_LAYOUT[id]; // brick tương ứng với id
        this.stateIndex = 0; // Trạng thái của birck (rotate)
        this.rowPos = -2; // vị trí dòng bắt đầu của brick
        this.colPos = 3; // vị trí cột bắt đầu của brick
        this.isGameOver = false;
    }

    // Hàm vẽ các brick
    draw() {
        for (let row = 0; row < this.layout[this.stateIndex].length; row++) {
            for (let col = 0; col < this.layout[this.stateIndex][0].length; col++) {
                if (this.layout[this.stateIndex][row][col] !== WHITE_COLOR_ID) {
                    board.drawCell(col + this.colPos, row + this.rowPos, this.id);
                }
            }
        }
    }

    // Hàm xóa các brick
    clear() {
        for (let row = 0; row < this.layout[this.stateIndex].length; row++) {
            for (let col = 0; col < this.layout[this.stateIndex][0].length; col++) {
                if (this.layout[this.stateIndex][row][col] !== WHITE_COLOR_ID) {
                    board.drawCell(col + this.colPos, row + this.rowPos, WHITE_COLOR_ID);
                }
            }
        }
    }

    // Hàm di chuyển sang trái
    moveLeft() {
        if (!this.checkCollide(this.rowPos, this.colPos - 1, this.layout[this.stateIndex])) {
            this.clear();
            this.colPos--;
            this.draw();
        }
    }

    // Hàm di chuyển sang phải
    moveRight() {
        if (!this.checkCollide(this.rowPos, this.colPos + 1, this.layout[this.stateIndex])) {
            this.clear();
            this.colPos++;
            this.draw();
        }
    }

    // Hàm di chuyển xuống dưới
    moveDown() {
        if (!this.checkCollide(this.rowPos + 1, this.colPos, this.layout[this.stateIndex])) {
            this.clear();
            this.rowPos++;
            this.draw();
        } else {
            this.mergeBoard();
            if ($("#level").val() == '2') {
                maxRotate = 5;
                rotateCount = 0;
                $("#max-rotate input").val(maxRotate);
            }
            createRandomBrick();
        }
    }

    // Hàm xoay brick
    rotate() {
        // Kiểm tra xung đột
        if (!this.checkCollide(this.rowPos, this.colPos, this.layout[(this.stateIndex + 1) % 4])) {
            // Kiểm tra level
            if ($("#level").val() == '2') {
                if (maxRotate > 0 && rotateCount < 5) { // Kiểm tra giới hạn rotate
                    this.clear();
                    this.stateIndex = (this.stateIndex + 1) % 4;
                    this.draw();

                    maxRotate--; // Giảm giá trị maxRotate đi 1
                    rotateCount++; // Tăng số lần rotate
                    $("#max-rotate input").val(maxRotate); // Cập nhật giá trị trên input
                }
            } else {
                this.clear();
                this.stateIndex = (this.stateIndex + 1) % 4;
                this.draw();
            }
        }
    }

    // hàm kiếm tra sự va chạm
    checkCollide(nextRow, nextCol, nextLayout) {
        // xét đường biên trái
        if (nextCol < 0) {
            return true;
            // xét đường biên phải
        } else if ((nextCol + nextLayout[0].length > COLS)
            // Xét đường biên dưới
            || (nextRow + nextLayout.length > ROWS)) {
            return true;
        }

        // Kiểm tra sự va chạm giữa các khối với nhau
        // Nếu ô brick gặp ô trên board mà ko phải màu trắng thì return true
        for (let row = 0; row < nextLayout.length; row++) {
            for (let col = 0; col < nextLayout[0].length; col++) {
                if (nextLayout[row][col] !== WHITE_COLOR_ID && nextRow >= 0) {
                    if (board.grid[row + nextRow][col + nextCol] !== WHITE_COLOR_ID) {
                        return true;
                    }
                }
            }
        }
    }

    // gộp lại thành board và xử lý tính điểm
    mergeBoard() {
        if (this.rowPos <= 0) {
            isPlaying = false;
            this.isGameOver = true;
            updateScore();
            redrawBoard();
            eventGameOver();
        }

        for (let row = 0; row < this.layout[this.stateIndex].length; row++) {
            for (let col = 0; col < this.layout[this.stateIndex][0].length; col++) {
                if (this.layout[this.stateIndex][row][col] !== WHITE_COLOR_ID) {
                    board.grid[row + this.rowPos][col + this.colPos] = this.id;
                }
            }
        }
        board.clearFullRows();
        board.drawBoard();
    }
}

// Tạo ra 1 khối ngẫu nhiên
function createRandomBrick() {
    if (!isPlaying) return;
    brick = new Brick(Math.floor(Math.random() * BRICK_LAYOUT.length));
}

function updateScore() {
    // Cập nhật điểm số
    score = 0;
    $("#score").val(score);
}

function redrawBoard() {
    // Vẽ lại board
    board = new Board(context);
    board.drawBoard();
}

function eventGameOver() {
    $(".cover-bg").addClass('show');
    $(".game-over").addClass('show');
    $(".game-over button").click(function (e) {
        $(".cover-bg").removeClass('show');
        $(".game-over").removeClass('show');
    });
}


// Hàm thực hiện nhấn các nút để di chuyển brick
document.addEventListener("keydown", (event) => {
    if (event.keyCode === 37) {
        if (isPlaying) {
            brick.moveLeft();
        }
    } else if (event.keyCode === 39) {
        if (isPlaying) {
            brick.moveRight();
        }
    } else if (event.keyCode === 40) {
        if (isPlaying) {
            brick.moveDown();
        }
    } else if (event.keyCode === 81) {
        if (isPlaying) {
            brick.rotate();
        }
    } else if (event.keyCode === 69) {
        if (isPlaying) {
            brick.rotate();
        }
    }
});

$(document).ready(function () {
    // sự kiện nhấn nút play 
    $(".play-btn").click(function (e) {
        isPlaying = true;
        createRandomBrick();
        brick.draw();

    });
    // Đặt thời gian rời xuống cho từng khối
    setInterval(() => {
        if (isPlaying && !brick.isGameOver) {
            brick.moveDown();
        }
    }, 1000);

    // Sự kiện nhấn nút restart
    $(".reset-btn").click(function (e) {
        isPlaying = false;
        updateScore();
        redrawBoard();
    });

    // Sự kiện chọn level
    $('#level').change(function () {
        isPlaying = false;
        updateScore();
        redrawBoard();

        if ($("#level").val() == '2') {
            $("#max-rotate").addClass('show');
        } else {
            $("#max-rotate").removeClass('show');
        }
    });
});

// Xử lý credit
$(document).ready(function () {
    new Swiper(".mySwiper", {
        slidesPerView: 1,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },

        autoplay: {
            delay: 1000,
        },
        loop: true,
        speed: 1000,
    });
});
