// constants
const width = 8;
const totalTiles = width * width;
const maxTilesScore = totalTiles;

// themes
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

// counters
let score = 0;
let tiles = 0;
let moves = 0;
// tiles + state
let squares = [];
let tileBeingDragged;
let tileBeingReplaced;
let tileIdBeingDragged;
// objects
const title = document.querySelector('h2');
const grid = document.querySelector('.grid');
const scoreBoard = document.querySelector('.score-board-items');
const displayScore = document.getElementById('score'); // 💰
const displayTiles = document.getElementById('tiles'); // 🗝
const displayMoves = document.getElementById('moves'); // 🧠


// ------------------------------------------------------
// js/helpers.js

const createBoard = () => {
    for (let i = 0; i < totalTiles; i += 1) {
        const square = document.createElement('div');
        const randomColor = Math.floor(Math.random() * tilesImages.length);
        square.style.backgroundImage = tilesImages[randomColor];
        square.setAttribute('draggable', true);
        square.setAttribute('id', i);
        grid.appendChild(square);
        squares.push(square);
    }
    const tiles = squares;
    return [grid, tiles];
};

const highlightTiles = (opacity = 1) => {
    const validMoves = [
        tileIdBeingDragged - 1,
        tileIdBeingDragged - width,
        tileIdBeingDragged + 1,
        tileIdBeingDragged + width,
    ];
    for (let i = 0; i < validMoves.length; i += 1) {
        const tileInRow = (validMoves[i] % 8);
        if (!tileInRow || squares[validMoves[i]]?.style.opacity === 1) {
            continue;
        }
        squares[validMoves[i]]?.classList.add("shake");
    }
};

const moveTilesDown = () => {
    const moveDown = (totalTiles) - 9; // 55
    for (let i = 0; i < moveDown; i += 1) {
        if (squares[i + width]?.style.backgroundImage === '') {
            squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
            squares[i].style.backgroundImage = '';
        }

        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);
        if (isFirstRow && squares[i]?.style.backgroundImage === '') {
            let randomImage = Math.floor(Math.random() * tilesImages.length);
            squares[i].style.backgroundImage = tilesImages[randomImage]
        }
    }
};

const updateTiles = (idx, t = 1) => {
    if (!squares[idx]) {
        return ;
    }
    squares[idx].style.backgroundImage = '';
    squares[idx].style.opacity = 1;
    if (squares[idx]?.style.filter !== 'saturate(1)') {
        tiles += t;
        displayTiles.innerHTML = `${tiles} / ${maxTilesScore} - 🗝`;
    }
    squares[idx].style.filter = 'saturate(1)';
}

const updateScore = (s, arr) => {
    score += s;
    displayScore.innerHTML = `${score} - 💰`;
    arr.forEach((idx) => {
        updateTiles(idx);
    });
}

// ------------------------------------------------------
// js/touchEvents.js

const touchCancel = (e) => {
    console.log('touchCancel: ', e);
};

const touchEnd = (e) => {
    console.log('touchEnd: ', e);
};

const touchMove = (e) => {
    console.log('touchMove: ', e);
};

const touchStart = (e) => {
    console.log('touchStart: ', e);
};

// ------------------------------------------------------
// js/dragEvents.js

const dragStart = (e) => {
    const { target: { id, style: { backgroundImage } }} = e;
    console.debug(id, 'dragStart');
    tileBeingDragged = backgroundImage;
    tileIdBeingDragged = parseInt(id, 10);
    title.classList.add("shake");
    highlightTiles(0.25);
};

const dragEnd = (e) => {
    const { target: { id }} = e;
    console.debug(id, 'dragEnd');
    const validMoves = [
        tileIdBeingDragged - 1,
        tileIdBeingDragged - width,
        tileIdBeingDragged + 1,
        tileIdBeingDragged + width,
    ];
    const isValid = validMoves.includes(squareIdBeingReplaced);
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
    title.classList.remove("shake");
    displayScore.style.opacity = 0.95;
    displayMoves.style.opacity = 0.95;
    displayTiles.style.opacity = 0.95;
    for (let i = 0; i < validMoves.length; i += 1) {
        squares[validMoves[i]]?.classList.remove("shake");
    }
};

const dragOver = (e) => {
    const { target: { id }} = e;
    console.debug(id, 'dragOver');

    const randomColor = Math.floor(Math.random() * tilesImages.length);
    const color = bgColors[randomColor]
    grid.style.border = `${color} solid thick`;
    scoreBoard.style.border = `${color} solid thick`;
    // title.style.opacity = 0.75;
    displayScore.style.opacity = 0.5;
    displayMoves.style.opacity = 0.5;
    displayTiles.style.opacity = 0.5;
    e.preventDefault();
};

const dragEnter = (e) => {
    const { target: { id }} = e;
    console.debug(id, 'dragEnter');
    const randomColor = Math.floor(Math.random() * bgColors.length);
    const color = bgColors[randomColor]
    document.body.style.backgroundColor = color;
};

const dragLeave = (e) => {
    const { target: { id } } = e;
    console.debug(id, 'dragLeave');
    grid.style.border = 'grey solid thick';
    scoreBoard.style.border = 'grey solid thick';
};

const dragDrop = (e) => {
    const { target: { id, style: { backgroundImage } } } = e;
    console.debug(id, 'dragDrop');
    tileBeingReplaced = backgroundImage;
    squareIdBeingReplaced = parseInt(id, 10);
    squares[squareIdBeingReplaced].style.backgroundImage = tileBeingDragged;
    squares[tileIdBeingDragged].style.backgroundImage = tileBeingReplaced;
};

// ------------------------------------------------------
// js/listeners.js

const checkIfListeners = () => {};

const addListeners = () => {
    // dragEvents
    squares.forEach((s) => s.addEventListener('dragstart', dragStart));
    squares.forEach((s) => s.addEventListener('dragend', dragEnd));
    squares.forEach((s) => s.addEventListener('dragover', dragOver));
    squares.forEach((s) => s.addEventListener('dragenter', dragEnter));
    squares.forEach((s) => s.addEventListener('dragleave', dragLeave));
    squares.forEach((s) => s.addEventListener('drop', dragDrop));

    // touchEvents
    squares.forEach((s) => s.addEventListener('touchcancel', touchCancel));
    squares.forEach((s) => s.addEventListener('touchend', touchEnd));
    squares.forEach((s) => s.addEventListener('touchmove', touchMove));
    squares.forEach((s) => s.addEventListener('touchstart', touchStart));
};

const removeListeners = () => {
    // dragEvents
    squares.forEach((s) => s.removeEventListener('dragstart', dragStart));
    squares.forEach((s) => s.removeEventListener('dragend', dragEnd));
    squares.forEach((s) => s.removeEventListener('dragover', dragOver));
    squares.forEach((s) => s.removeEventListener('dragenter', dragEnter));
    squares.forEach((s) => s.removeEventListener('dragleave', dragLeave));
    squares.forEach((s) => s.removeEventListener('drop', dragDrop));

    // touchEvents
    squares.forEach((s) => s.removeEventListener('touchcancel', touchCancel));
    squares.forEach((s) => s.removeEventListener('touchend', touchEnd));
    squares.forEach((s) => s.removeEventListener('touchmove', touchMove));
    squares.forEach((s) => s.removeEventListener('touchstart', touchStart));
};

// ------------------------------------------------------
// js/possibleScores.js

const possibleScores = [
    {
        key: 'rowOfFour',
        score: 4,
        arraySize: 4,
        getArrayByScore: (i, s) => ([i, (i + 1), (i + 2), (i + 3)]),
        // getNumTiles: () => 60,
        getNumTiles: (size, total, width) => total - size,
        // last three of each row
        notValid: [
            ...[5, 6, 7], 
            ...[13, 14, 15],
            ...[21, 22, 23],
            ...[29, 30, 31],
            ...[37, 38, 39],
            ...[45, 46, 47],
            ...[53, 54, 55],
            ...[61, 62, 63],
        ],
    },
    {
        key: 'rowOfThree',
        score: 3,
        arraySize: 3,
        getArrayByScore: (i, s) => ([i, (i + 1), (i + 2)]),
        // getNumTiles: () => 61,
        getNumTiles: (size, total, width) => total - size,
        // last two of each row:
        notValid: [
            ...[6, 7],
            ...[14, 15],
            ...[22, 23],
            ...[30, 31],
            ...[38, 39],
            ...[46, 47],
            ...[54, 55],
            ...[62, 63],
        ],
    },
    {
        key: 'colOfFour',
        score: 4,
        arraySize: 4,
        getArrayByScore: (i, s) => ([i, (i + width), (i + (width * 2)), (i + (width * 3))]),
        // getNumTiles: () => 39,
        getNumTiles: (size, total, width) => total - (width * 2) - 1,
    },
    {
        key: 'colOfThree',
        score: 3,
        arraySize: 3,
        getArrayByScore: (i, s) => ([i, (i + width), (i + (width * 2))]),
        // getNumTiles: () => 47,
        getNumTiles: (size, total, width) => total - (width * 2),
    },
];

// ------------------------------------------------------
// js/helpers.js

const checkScore = ({
    key,
    score: s,
    arraySize,
    getNumTiles,
    getArrayByScore,
    notValid,
}) => {
    const numTiles = getNumTiles(arraySize, totalTiles, width);
    for (let i = 0; i < numTiles; i += 1) {
        if (notValid && notValid.includes(i)) {
            continue;
        }
        const arrayByScore = getArrayByScore(i, s);
        const decidedTile = squares[i]?.style.backgroundImage;
        const isBlank = decidedTile === '';
        const tileMatch = arrayByScore.every((idx) => 
            (squares[idx]?.style.backgroundImage === decidedTile && !isBlank));
        if (tileMatch) {
           updateScore(s, arrayByScore);
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
        // config();
        createBoard();
        addListeners();
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
};

// TODO: use async/await && drag events to run possibleScores
// run moveTilesDown to update tiles only

// TODO: fix issue of last tile (bottom-right) corner not working
// this means that (tiles < totalTiles) will always be true

const runFrame = () => {
    try {
        possibleScores.map((score) => checkScore(score));
        moveTilesDown();
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
};

const runGame = () => {
    // we have to run this once, before running game
    // but global vars are causing issues
    // possibleScores.map((score) => checkScore(score));
    const run = () => runFrame();

    if (!run) {
        console.debug('Failed to run game!');
        return ;
    }

    const cycleTime = 150;
    const runId = setInterval(() => {
        run();
        if (tiles >= maxTilesScore) {
            window.clearInterval(runId);
            window.alert('You are winner!! 🎉 🏆');
            window.location.href = 'https://github.com/jraleman/CrunchyChests'
        }
    }, cycleTime);
    return true;
};

document.addEventListener('DOMContentLoaded', () => {
    const isSetup = setup();

    if (!isSetup) {
        console.log('Failed to initialize game!');
        return ;
    }
    runGame();
});
