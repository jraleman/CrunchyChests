const grid = document.querySelector('.grid');
const width = 8;
const squares = [];
const displayScore = document.getElementById('score');

const tileColors = [
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
        const square = document.createElement('div');
        const randomColor = Math.floor(Math.random() * tileColors.length);

        square.style.backgroundImage = tileColors[randomColor];
        square.setAttribute('draggable', true);
        square.setAttribute('id', i);
        grid.appendChild(square);

        squares.push(square);
    }
};

// ------------------------------------------------------

const dragStart = (e) => {
    const { target: { id, style: { backgroundImage } }} = e;
    console.log(id, 'dragStart');
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
    console.log(id, 'dragEnd');
};

const dragOver = (e) => {
    const { target: { id, style: { backgroundImage } } } = e;
    e.preventDefault();
    console.log(id, 'dragOver');
};

const dragEnter = (e) => {
    const { target: { id, style: { backgroundImage } } } = e;
    e.preventDefault();
    console.log(id, 'dragEnter');
};

const dragLeave = (e) => {
    const { target: { id, style: { backgroundImage } } } = e;
    console.log(id, 'dragLeave');
};

const dragDrop = (e) => {
    const { target: { id, style: { backgroundImage } } } = e;
    colorBeingReplaced = backgroundImage;
    squareIdBeingReplaced = parseInt(id, 10);
    squares[squareIdBeingReplaced].style.backgroundImage = colorBeingDragged;
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced; 
    console.log(id, 'dragDrop');
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
            displayScore.innerHTML = score;
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
            displayScore.innerHTML = score;
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
            displayScore.innerHTML = score;
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
            displayScore.innerHTML = score;
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
            let randomColor = Math.floor(Math.random() * tileColors.length);
            squares[i].style.backgroundImage = tileColors[randomColor]
        }
    }
};

// ------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    addListeners();
    setInterval(() => {
        moveDownTiles();
        checkRowForThree();
        checkColForThree();
        checkRowForFour();
        checkColForFour();
    }, 100);
});
