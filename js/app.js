const width = 8;
const squares = [];
const title = document.querySelector('h2');
const grid = document.querySelector('.grid');
const displayScore = document.getElementById('score');

const bgColors = [
    '#006cd1',
    '#bc5a00',
    '#007775',
    '#750077',
    '#bc0004',
    '#42b284',
];

// get from path instead
// dont rely on using background-image in divs
const tilesImages = [
    'url(images/red.png)',
    'url(images/dark.png)',
    'url(images/green.png)',
    'url(images/purple.png)',
    'url(images/white.png)',
    'url(images/blue.png)',
];

// see if we can remove some global variables?
let score = 0;
let colorBeingDragged;
let colorBeingReplaced;
let squareIdBeingDragged;

const createBoard = () => {
    const totalGrids = (width * width);
    for (let i = 0; i < totalGrids; i += 1) {
        // make this a function - const createTile = () > {}
        const square = document.createElement('div');
        // see how to do children;
        // const img = document.createElement('div > img');
        // support for > .img
        const randomColor = Math.floor(Math.random() * tilesImages.length);
        square.style.backgroundImage = tilesImages[randomColor];
        
        // abstract this
        square.setAttribute('draggable', true);
        square.setAttribute('id', i);
        grid.appendChild(square);

        squares.push(square);
    }
};

// ------------------------------------------------------

const dragStart = (e) => {
    const { target: { id, style: { backgroundImage } }} = e;
    console.debug(id, 'dragStart');
    colorBeingDragged = backgroundImage;
    squareIdBeingDragged = parseInt(id, 10);
};

const dragEnd = (e) => {
    const { target: { id, style: { backgroundImage } } } = e;
    const validMoves = [
        squareIdBeingDragged - 1,
        squareIdBeingDragged - width,
        squareIdBeingDragged + 1,
        squareIdBeingDragged + width,
    ];
    const isValid = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && isValid) {
        squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !isValid) {
        squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    } else {
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    }
    title.style.opacity = 0.85;
    document.body.style.opacity = 1.0;
    console.debug(id, 'dragEnd');
};

const dragOver = (e) => {
    const { target: { id }} = e;
    const randomColor = Math.floor(Math.random() * tilesImages.length);
    const color = bgColors[randomColor]
    grid.style.border = `${color} solid thick`;
    // border: grey solid thick;
    title.style.opacity = 0.5;
    document.body.style.opacity = 0.5;
    e.preventDefault();
    console.debug(id, 'dragOver');
};

const dragEnter = (e) => {
    // e.preventDefault();
    const { target: { id }} = e;
    const randomColor = Math.floor(Math.random() * bgColors.length);
    const color = bgColors[randomColor]
    document.body.style.backgroundColor = color;
    console.debug(id, 'dragEnter');
};

// we can change background color?
const dragLeave = (e) => {
    // e.preventDefault();
    const { target: { id } } = e;

    // document.body.style.backgroundColor
    // const color = rgbaCalculator(bgColors[squareIdBeingDragged]);
    document.body.style.backgroundColor = 'rgba(0,0,0,0)';
    grid.style.border = 'grey solid thick';
    console.debug(id, 'dragLeave');
};

const dragDrop = (e) => {
    const { target: { id, style: { backgroundImage } } } = e;
    colorBeingReplaced = backgroundImage;
    squareIdBeingReplaced = parseInt(id, 10);
    squares[squareIdBeingReplaced].style.backgroundImage = colorBeingDragged;
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced; 
    console.debug(id, 'dragDrop');
};

const addListeners = () => {
    squares.forEach((s) => s.addEventListener('dragstart', dragStart));
    squares.forEach((s) => s.addEventListener('dragend', dragEnd));
    squares.forEach((s) => s.addEventListener('dragover', dragOver));
    squares.forEach((s) => s.addEventListener('dragenter', dragEnter));
    squares.forEach((s) => s.addEventListener('dragleave', dragLeave));
    squares.forEach((s) => s.addEventListener('drop', dragDrop));
};

// ------------------------------------------------------

const checkRowForThree = () => {
    const checkRow = (width * width) - 3;
    for (let i = 0; i < checkRow; i += 1) {
        const rowOfThree = [i, i + 1, i + 2];
        const decidedColor = squares[i].style.backgroundImage;
        const isBlank = decidedColor === '';
        const colorMatch = rowOfThree.every((idx) => 
            (squares[idx].style.backgroundImage === decidedColor && !isBlank));

        const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
        if (notValid.includes(i)) {
            continue;
        }

        if (colorMatch) {
            score += 3;
            displayScore.innerHTML = `${score} 🗝`;
            rowOfThree.forEach((idx) => {
                squares[idx].style.backgroundImage = '';
            });
        }
    }
};

const checkRowForFour = () => {
    const checkRow = (width * width) - 4;
    for (let i = 0; i < checkRow; i += 1) {
        const rowOfFour = [i, i + 1, i + 2, i + 3];
        const decidedColor = squares[i].style.backgroundImage;
        const isBlank = decidedColor === '';
        const colorMatch = rowOfFour.every((idx) => 
            (squares[idx].style.backgroundImage === decidedColor && !isBlank));

        const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
        if (notValid.includes(i)) {
            continue;
        }

        if (colorMatch) {
            score += 4;
            displayScore.innerHTML = `${score} 🗝`;
            rowOfFour.forEach(idx => {
                squares[idx].style.backgroundImage = '';
            });
        }
    }
};

const checkColForThree = () => {
    const checkCol = (width * width) - (width * 2) - 1;
    for (let i = 0; i < checkCol; i += 1) {
        const colOfThree = [i, i + width, i + (width * 2)];
        const decidedColor = squares[i].style.backgroundImage;
        const isBlank = decidedColor === '';
        const colorMatch = colOfThree.every(idx => squares[idx].style.backgroundImage === decidedColor && !isBlank);

        if (colorMatch) {
            score += 3;
            displayScore.innerHTML = `${score} 🗝`;
            colOfThree.forEach(idx => {
                squares[idx].style.backgroundImage = '';
            });
        }
    }
};

const checkColForFour = () => {
    const checkCol = (width * width) - (width * 2) - 1;
    for (let i = 0; i < checkCol; i += 1) {
        const colOfFour = [i, i + width, i + (width * 2), i + (width * 3)];
        const decidedColor = squares[i].style.backgroundImage;
        const isBlank = decidedColor === '';
        const colorMatch = colOfFour.every(idx => squares[idx].style.backgroundImage === decidedColor && !isBlank);

        if (colorMatch) {
            score += 4;
            displayScore.innerHTML = `${score} 🗝`;
            colOfFour.forEach(idx => {
                squares[idx].style.backgroundImage = '';
            });
        }
    }
};

const moveDownTiles = () => {
    // why 55?
    for (let i = 0; i < 55; i += 1) {
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
        moveDownTiles();
        // go from bigger to smaller, we can refactor this into a single function
        // and go from 2 to max-width/height - 1
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

const getFrameRate = () => {
    // implement for LOW, HIGH, MID, options...
    return 100;
};

const runGame = () => {
    const run = () => runFrame();

    if (!run) {
        console.debug('Failed to run game!');
        return ;
    }
    const frameRate = getFrameRate();

    setInterval(() => {
        run();
    }, frameRate);
    return true;
};

document.addEventListener('DOMContentLoaded', () => {
    const isSetup = setup();

    if (!isSetup) {
        console.debug('Failed to initialize game!');
        // delete stuffs here!
        // make deletion funcs, deleteBoard, removeListeners, unconfig
        return ;
    }
    runGame();
});
