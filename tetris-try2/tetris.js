let rAF;
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

canvas.width = 240;
canvas.height = 400;


const blockSize = 20;
let width = canvas.width / blockSize;
let height = canvas.height / blockSize;

let board = [];
for (let i = 0; i < height; i++) {
    board[i] = [];
    for (let j = 0; j < width; j++) {
        board[i][j] = 0;
    }
}

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

function createPiece(type)
{
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}
const piece = {
    pos: {x: 0, y: 0},
    type: null,
    score: 0,
    lines: 0,
    level: 1,
}

function spawn() {
   const pieces = 'TJLOSZI';
   piece.type = createPiece(pieces[pieces.length * Math.random() | 0]);
   piece.pos.x = (board[0].length / 2 | 0 )- 
                        (piece.type[0].length / 2 | 0);
   piece.pos.y = 0; 
   
}

function addToBoard(piece, x, y) {
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[i].length; j++) {
            if (piece[i][j]) {
                let value = piece[i][j];
                board[y + i][x + j] = value;
            }
        }
    }
}

function drawBoard() {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
           let value = board[i][j];
            if (value) {
                ctx.fillStyle = colors[value];
                ctx.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
            }
        }
    }
}
function drawPiece(piece, x, y) {  
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[i].length; j++) {
            let value = piece[i][j];
            if (value) {
                ctx.fillStyle = colors[value];
                ctx.fillRect((x + j) * blockSize, (y + i) * blockSize, blockSize, blockSize);

            }
        }
    }

}


function canMove(piece, x, y) {
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[i].length; j++) {
            if (piece[i][j]) {
                if (y + i >= height || x + j < 0 || x + j >= width || board[y + i][x + j]) {
                    return false;
                }
            }
        }
    }
    return true;
}


document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        if (canMove(piece.type, piece.pos.x - 1, piece.pos.y)) {
             piece.pos.x--;
        }
       
    } else if (event.keyCode === 39) {
        if (canMove(piece.type, piece.pos.x + 1, piece.pos.y)) {
            piece.pos.x++;
        }
       
    } else if (event.keyCode === 40) {
        drop();        
    } else if (event.keyCode === 38) {
        pieceRotate(1);
    }
})

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece(piece.type, piece.pos.x, piece.pos.y);
    
}

function gameOver () {
    let canvasGameOver = document.getElementById('gameover');
    let ctxGameOver = canvasGameOver.getContext('2d');
    ctxGameOver.font = "32px serif"
    ctxGameOver.textBaseline = "bottom";
    ctxGameOver.strokeText("Game Over", 10, 50);
}

function clearLines() {
    let lines = 0;    
    for (let i = height - 1; i >= 0; i--) {
        let lineFull = true;
        for (let j = 0; j < width; j++) {
            if (!board[i][j]) {
                lineFull = false;
                break;
            }
        }
        if (lineFull) {
            lines++;
            for (let j = 0; j < width; j++) {
                board[i][j] = 0;
            }
            for (let k = i; k > 0; k--) {
                for (let j = 0; j < width; j++) {
                    board[k][j] = board[k-1][j];
                }
            }
            i++;
            piece.score += lines * 10;
            lines *= 2;                
        }
    }
}

function updateScore() {
    document.getElementById('score').innerText = piece.score;
}

function drop() {
    if (canMove(piece.type, piece.pos.x, piece.pos.y + 1)) {
        piece.pos.y++;
        dropCounter = 0;
    } else {
        addToBoard(piece.type, piece.pos.x, piece.pos.y);
        spawn();
        clearLines();
        updateScore();
            if (!canMove(piece.type, piece.pos.x, piece. pos.y+1)) {
            cancelAnimationFrame(rAF);
            gameOver();
        }
    }
    
}

function rotate(piece, dir) {
    
    for (let j = 0; j < piece[0].length; j++) {
        for (let i= 0; i < j; i++) {
           [
                piece[i][j],
                piece[j][i],
           ] = [
                piece[j][i],
                piece[i][j],
                ];                     
        }
    }
    if (dir > 0) {
        piece.forEach(row => row.reverse());
    } else {
        piece.reverse();
    }
}

function pieceRotate(dir) {
    const pos = piece.pos.x; 
    let offset = 1; 
    if (canMove(piece.type, piece.pos.x, piece.pos.y)) {
        rotate(piece.type, dir);
    } else {
        piece.pos.x += offset;
        offset = - (offset + (offset > 0 ? 1 : -1));
        if (offset > piece.type[0].length) {
            rotate(piece.type, -dir);
            piece.pos.x = pos;
            return;
        }
    }
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        drop();
    }
    lastTime = time;
    draw();
   rAF = requestAnimationFrame(update);
}

spawn();
update();


