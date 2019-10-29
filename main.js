let canvas = [];
let context = [];
let field = [];
let current = [];
let score = 0;
let lose = 0;

const tick = 300;
const widthInPixels = 300;
const heightInPixels = 600;
const widthInBlocks = 10;
const heightInBlocks = 20;
const blockWidth = widthInPixels / widthInBlocks;
const blockHeight = heightInPixels / heightInBlocks;

let initCanvas = () => {
    canvas = document.getElementById("game-canvas");
    if (canvas.getContext) {
        context = canvas.getContext("2d");
        canvas.width = 300;
        canvas.height = 600;
    }
};

//Cria field vazia do campo do jogo.
let createField = () => {
    for (let i = 0; i < heightInBlocks; i++) {
        field[i] = new Array(widthInBlocks).fill(0);
    }
};

//Draws a single block given the column and the row
let drawBlock = (row, col) => {
    context.fillStyle = current.color;
    context.fillRect(blockWidth * col, blockHeight * row, blockWidth - 1, blockHeight - 1);
};

let init = () => {
    initCanvas();
    createField();
};

let pI = new Piece(1, 3, 0,
    [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3]
    ],
    '#27E2F4' //Light blue
);

let pJ = new Piece(2, 3, 0,
    [
        [0, 0],
        [1, 0],
        [1, 1],
        [1, 2]
    ],
    '#1701FE' //Dark Blue
);

let pL = new Piece(3, 3, 0,
    [
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2],
    ],
    '#E46F02' //Orange
);

let pO = new Piece(4, 3, 0,
    [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
    ],
    '#F4D800' //Yellow
);

let pS = new Piece(5, 3, 0,
    [
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1]
    ],
    '#7BF800' //Green
);

let pZ = new Piece(6, 3, 0,
    [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 2]
    ],
    '#D40D3A' //Red
);

let pT = new Piece(7, 3, 0,
    [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, 2]
    ],
    '#9B00FC' //Purple
);

//TODO function that randomize pieces
/*
    Random Generator
The Random Generator (also known as "random bag" or "7 bag") determines the sequence
 of tetrominoes during gameplay. One of each of the 7 tetrominoes are shuffled in a
 "bag", and are dealt out one by one. When the bag is empty, a new one is filled
 and shuffled.
    source: https://tetris.wiki/Tetris_Guideline
*/

let drawTetro = () => {
    for (let i = 0; i < current.coordinates.length; i++) {
        let row = current.coordinates[i][0] + current.startRowPos;
        let col = current.coordinates[i][1] + current.startColPos;
        drawBlock(row, col);
        // field[row][col] = 1/* current.id */;
    }
};

function newPiece() {
    current = new Piece();
    current = Object.assign(current,
        arr[Math.floor(Math.random() * arr.length)]);
}

function isEmpty(obj = current) {
    for (let _id in obj) {
        if (obj.hasOwnProperty(_id)) {
            return false;
        }
    }
    return true;
}

let clearBlock = (row, col) => {
    context.clearRect(blockWidth * col, blockHeight * row, blockWidth - 1, blockHeight - 1);
};

let clearTetro = () => {
    for (let i = 0; i < current.coordinates.length; i++) {
        let row = current.coordinates[i][0] + current.startRowPos;
        let col = current.coordinates[i][1] + current.startColPos;
        clearBlock(row, col);
        field[row][col] = 0;
    }

};

let clearAll = () => {
    context.clearRect(1, 1, canvas.width - 2, canvas.height - 2);
};

let update = () => {
    if (isEmpty()) {
        newPiece();
        drawTetro();
    } else {
        moveDown();
    }
};

init();

document.addEventListener('keydown', event => {
    if (!lose) {
        if (event.keyCode == 38) {
            rotate();
        } else if (event.keyCode == 37) {
            moveLeft();
        } else if (event.keyCode == 39) {
            moveRight();
        } else if (event.keyCode == 40) {
            moveDown();
        }
    }
});

let moveLeft = () => {
    let hasRoom = true;
    for (let coordinate of current.coordinates) {
        let col = coordinate[1] + current.startColPos;
        if (col == 0) {
            hasRoom = false;
            break;
        }
    }

    for (let i = 0; i < current.coordinates.length; i++) {
        let row = current.coordinates[i][0] + current.startRowPos;
        let col = current.coordinates[i][1] + current.startColPos;
        if (field[row][col - 1] == 1) {
            hasRoom = false;
        }
    }

    if (hasRoom) {
        clearTetro();
        current.startColPos--;
        drawTetro();
    }

};

let moveRight = () => {
    let hasRoom = true;
    for (let coordinate of current.coordinates) {
        let col = coordinate[1] + current.startColPos;
        if (col == widthInBlocks - 1) {
            hasRoom = false;
            break;
        }
    }

    //Check for collision to the right
    for (let i = 0; i < current.coordinates.length; i++) {
        let row = current.coordinates[i][0] + current.startRowPos;
        let col = current.coordinates[i][1] + current.startColPos;
        if (field[row][col + 1] == 1) {
            hasRoom = false;
        }
    }


    //Check for collision with another tetros

    if (hasRoom) {
        clearTetro();
        current.startColPos++;
        drawTetro();
    }
};

let moveDown = () => {
    let hasReachedBottom = false;
    for (let coordinate of current.coordinates) {
        let row = coordinate[0] + current.startRowPos;
        if (row == heightInBlocks - 1) {
            hasReachedBottom = true;

        }
    }

    //Check for collision below
    let isCollidedBelow = false;
    if (!hasReachedBottom) {
        for (let i = 0; i < current.coordinates.length; i++) {
            let row = current.coordinates[i][0] + current.startRowPos;
            let col = current.coordinates[i][1] + current.startColPos;
            if (field[row + 1][col] == 1) {
                isCollidedBelow = true;
            }
        }
    }

    if (!hasReachedBottom && !isCollidedBelow) {
        clearTetro();
        current.startRowPos++;
        drawTetro();
    }
    if (isCollidedBelow || hasReachedBottom) {
        settleDown();
        current = [];
    }
};

let settleDown = () => {
    for (let i = 0; i < current.coordinates.length; i++) {
        let row = current.coordinates[i][0] + current.startRowPos;
        let col = current.coordinates[i][1] + current.startColPos;
        field[row][col] = 1;
    }
};

// const movement = {
//     "default": 1,
//     "right": 2,
//     "left": 3,
// };

//Teste com todas as peças
let arr = new Array();
arr.push(pI);
arr.push(pJ);
arr.push(pL);
arr.push(pO);
arr.push(pS);
arr.push(pZ);
arr.push(pT);

clearAll();
let game = setInterval(update, tick);

// function printMatrixBtn() {
//     // clearInterval(game);
//     document.write(`<button id="myBtn">Click me to PRINT A field</button>`);

//     document.getElementById("myBtn").addEventListener("mousedown", function () {
//         printGrid(field);
//     });
// }
// printMatrixBtn();