const width = 8;
const totalTiles = width * width;
const maxTilesScore = 42;
const squares = [];
const title = document.querySelector('h2');
const grid = document.querySelector('.grid');
const displayScore = document.getElementById('score'); // 💰
const displayTiles = document.getElementById('tiles'); // 🗝
const displayMoves = document.getElementById('moves'); // 🧠

const bgColors = [
    '#006cd1',
    '#bc5a00',
    '#007775',
    '#750077',
    '#bc0004',
    '#42b284',
];

const tilesImages = [
    'url(images/red.png)',
    'url(images/dark.png)',
    'url(images/green.png)',
    'url(images/purple.png)',
    'url(images/white.png)',
    'url(images/blue.png)',
];

let score = 0;
let tiles = 0;
let moves = 0;
let tileBeingDragged;
let tileBeingReplaced;
let tileIdBeingDragged;

// ------------------------------------------------------
// js/helpers.js

const createBoard = () => {
    const totalGrids = (totalTiles);
    for (let i = 0; i < totalGrids; i += 1) {
        const square = document.createElement('div');
        const randomColor = Math.floor(Math.random() * tilesImages.length);
        square.style.backgroundImage = tilesImages[randomColor];
        square.setAttribute('draggable', true);
        square.setAttribute('id', i);
        grid.appendChild(square);
        squares.push(square);
    }
};

const highlightTiles = (opacity = 1) => {
    const validMoves = [
        tileIdBeingDragged - 1,
        tileIdBeingDragged - width,
        tileIdBeingDragged + 1,
        tileIdBeingDragged + width,
    ];
    for (let i = 0; i < validMoves.length; i += 1) {
        // somewhere here
        if (!squares[validMoves[i]] || squares[validMoves[i]].style.opacity > opacity) {
            continue;
        }
        squares[validMoves[i]].style.opacity = opacity;
    }
};

// ------------------------------------------------------
// js/dragEvents.js

const dragStart = (e) => {
    const { target: { id, style: { backgroundImage } }} = e;
    console.debug(id, 'dragStart');
    tileBeingDragged = backgroundImage;
    tileIdBeingDragged = parseInt(id, 10);
    highlightTiles(0.25);
};

const dragEnd = (e) => {
    const { target: { id }} = e;
    const validMoves = [
        tileIdBeingDragged - 1,
        tileIdBeingDragged - width,
        tileIdBeingDragged + 1,
        tileIdBeingDragged + width,
    ];
    const isValid = validMoves.includes(squareIdBeingReplaced);

    // see how to implement moves counter here...
    if (squareIdBeingReplaced && isValid) {
        squareIdBeingReplaced = null;
        moves += 1;
        displayMoves.innerHTML = `${moves} - 🧠`;
    } else if (squareIdBeingReplaced && !isValid) {
        squares[squareIdBeingReplaced].style.backgroundImage = tileBeingReplaced;
        squares[tileIdBeingDragged].style.backgroundImage = tileBeingDragged;
    } else {
        squares[tileIdBeingDragged].style.backgroundImage = tileBeingDragged;
    }
    highlightTiles(0.5);
    title.style.opacity = 1;
    displayScore.style.opacity = 0.95;
    displayMoves.style.opacity = 0.95;
    console.debug(id, 'dragEnd');
};

const dragOver = (e) => {
    const { target: { id }} = e;
    const randomColor = Math.floor(Math.random() * tilesImages.length);
    const color = bgColors[randomColor]
    grid.style.border = `${color} solid thick`;
    title.style.opacity = 0.75;
    displayScore.style.opacity = 0.75;
    displayMoves.style.opacity = 0.95;
    e.preventDefault();
    console.debug(id, 'dragOver');
};

const dragEnter = (e) => {
    const { target: { id }} = e;
    const randomColor = Math.floor(Math.random() * bgColors.length);
    const color = bgColors[randomColor]
    document.body.style.backgroundColor = color;
    console.debug(id, 'dragEnter');
};

const dragLeave = (e) => {
    const { target: { id } } = e;

    grid.style.border = 'grey solid thick';
    console.debug(id, 'dragLeave');
};

const dragDrop = (e) => {
    const { target: { id, style: { backgroundImage } } } = e;
    tileBeingReplaced = backgroundImage;
    squareIdBeingReplaced = parseInt(id, 10);
    squares[squareIdBeingReplaced].style.backgroundImage = tileBeingDragged;
    squares[tileIdBeingDragged].style.backgroundImage = tileBeingReplaced; 
    console.debug(id, 'dragDrop');
};

// ------------------------------------------------------
// js/listeners.js

const checkIfListeners = () => {};

const addListeners = () => {
    squares.forEach((s) => s.addEventListener('dragstart', dragStart));
    squares.forEach((s) => s.addEventListener('dragend', dragEnd));
    squares.forEach((s) => s.addEventListener('dragover', dragOver));
    squares.forEach((s) => s.addEventListener('dragenter', dragEnter));
    squares.forEach((s) => s.addEventListener('dragleave', dragLeave));
    squares.forEach((s) => s.addEventListener('drop', dragDrop));
};

// ------------------------------------------------------
// js/verifiers.js

// we can abstract to an object:

// see how to create an array by M = N + 1 expr array;
// do the same for rowOfFour, rowOfTwo, rowOfFive...
// and if function is same for colOff*, refactor into this object too:
const rowOff = [
    {
        arraySize: 3, // i, i + 1, i + 2
        notValid: [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55],
    }
];

const checkRowForThree = () => {
    const checkRow = (totalTiles) - 3;
    for (let i = 0; i < checkRow; i += 1) {
        const rowOfThree = [i, i + 1, i + 2];
        const decidedTile = squares[i].style.backgroundImage;
        const isBlank = decidedTile === '';
        const tileMatch = rowOfThree.every((idx) => 
            (squares[idx].style.backgroundImage === decidedTile && !isBlank));

        const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
        if (notValid.includes(i)) {
            continue;
        }

        if (tileMatch) {
            score += 3;
            displayScore.innerHTML = `${score} - 💰`;
            rowOfThree.forEach((idx) => {
                squares[idx].style.backgroundImage = '';
                squares[idx].style.opacity = 1;
                if (squares[idx].style.filter !== 'saturate(1)') {
                    tiles += 1;
                    displayTiles.innerHTML = `${tiles} / ${maxTilesScore} - 🗝`;
                    // displayTiles.innerHTML = `${tiles} / ${totalTiles} - 🗝`;
                }
                squares[idx].style.filter = 'saturate(1)';
            });
        }
    }
};

const checkRowForFour = () => {
    const checkRow = (totalTiles) - 4;
    for (let i = 0; i < checkRow; i += 1) {
        const rowOfFour = [i, i + 1, i + 2, i + 3];
        const decidedTile = squares[i].style.backgroundImage;
        const isBlank = decidedTile === '';
        const tileMatch = rowOfFour.every((idx) => 
            (squares[idx].style.backgroundImage === decidedTile && !isBlank));

        const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
        if (notValid.includes(i)) {
            continue;
        }

        if (tileMatch) {
            score += 4;
            displayScore.innerHTML = `${score} - 💰`;
            rowOfFour.forEach((idx) => {
                squares[idx].style.backgroundImage = '';
                squares[idx].style.opacity = 1;
                if (squares[idx].style.filter !== 'saturate(1)') {
                    tiles += 1;
                    displayTiles.innerHTML = `${tiles} - 🗝`;
                }
                squares[idx].style.filter = 'saturate(1)';
            });
        }
    }
};

const checkColForThree = () => {
    const checkCol = (totalTiles) - (width * 2) - 1;
    for (let i = 0; i < checkCol; i += 1) {
        const colOfThree = [i, i + width, i + (width * 2)];
        const decidedTile = squares[i].style.backgroundImage;
        const isBlank = decidedTile === '';
        const tileMatch = colOfThree.every((idx) => squares[idx].style.backgroundImage === decidedTile && !isBlank);

        if (tileMatch) {
            score += 3;
            displayScore.innerHTML = `${score} - 💰`;
            colOfThree.forEach((idx) => {
                squares[idx].style.backgroundImage = '';
                squares[idx].style.opacity = 1;
                if (squares[idx].style.filter !== 'saturate(1)') {
                    tiles += 1;
                    displayTiles.innerHTML = `${tiles} - 🗝`;
                }
                squares[idx].style.filter = 'saturate(1)';
            });
        }
    }
};

const checkColForFour = () => {
    const checkCol = (totalTiles) - (width * 2) - 1;
    for (let i = 0; i < checkCol; i += 1) {
        const colOfFour = [i, i + width, i + (width * 2), i + (width * 3)];
        const decidedTile = squares[i].style.backgroundImage;
        const isBlank = decidedTile === '';
        const tileMatch = colOfFour.every((idx) => squares[idx].style.backgroundImage === decidedTile && !isBlank);

        if (tileMatch) {
            score += 4;
            displayScore.innerHTML = `${score} - 💰`;
            colOfFour.forEach((idx) => {
                squares[idx].style.backgroundImage = '';
                squares[idx].style.opacity = 1;
                if (squares[idx].style.filter !== 'saturate(1)') {
                    tiles += 1;
                    displayTiles.innerHTML = `${tiles} - 🗝`;
                }
                squares[idx].style.filter = 'saturate(1)';
            });
        }
    }
};

// ------------------------------------------------------
// js/helpers.js

const moveDownTiles = () => {
    const moveDown = (totalTiles) - 9; // 55
    for (let i = 0; i < moveDown; i += 1) {
        if (squares[i + width].style.backgroundImage === '') {
            squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
            squares[i].style.backgroundImage = '';
        }

        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);
        if (isFirstRow && squares[i].style.backgroundImage === '') {
            let randomImage = Math.floor(Math.random() * tilesImages.length);
            squares[i].style.backgroundImage = tilesImages[randomImage]
        }
    }
};

// ------------------------------------------------------
// app.js

const config = () => {
    let scaleAmount = 0.80;
    document.body.style.transform = `scale(${scaleAmount})`
};

const setup = () => {
    try {
        createBoard();
        addListeners();
        config();
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
};

const runFrame = () => {
    try {
        // TODO: fix issue of last tile (bottom-right) corner not working
        // this means that (tiles < totalTiles) will always be true
        moveDownTiles();
        checkRowForThree();
        checkColForThree();
        checkRowForFour();
        checkColForFour();
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
};

const runGame = () => {
    const run = () => runFrame();

    if (!run) {
        console.debug('Failed to run game!');
        return ;
    }

    const cycleTime = 100;
    const runId = setInterval(() => {
        run();
        // if (tiles >= totalTiles) {
        if (tiles >= maxTilesScore) {
            clearInterval(runId);
            window.alert('You are winner!! 🎉 🏆');
            window.location.href = 'https://github.com/jraleman/CrunchyChests'
        }
    }, cycleTime);
    return true;
};

document.addEventListener('DOMContentLoaded', () => {
    const isSetup = setup();

    if (!isSetup) {
        console.debug('Failed to initialize game!');
        return ;
    }
    runGame();
});
