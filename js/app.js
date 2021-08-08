const grid = document.querySelector('.grid');
const width = 8;
const squares = [];

const tileColors = [
    'red',
    'yellow',
    'orange',
    'purple',
    'green',
    'blue',
];

const createBoard = () => {
    for (let i = 0; i < (width * width); i += 1) {
        const square = document.createElement('div');
        const randomColor = Math.floor(Math.random() * tileColors.length);

        square.style.backgroundColor = tileColors[randomColor];
        square.setAttribute('draggable', true);
        square.setAttribute('id', i);
        grid.appendChild(square);

        squares.push(square);
    }
};

const dragStart = () => {
    console.log(this.id, 'dragStart');
};

const dragEnd = () => {
    console.log(this.id, 'dragEnd');
};

const dragOver = () => {
    console.log(this.id, 'dragOver');
};

const dragEnter = () => {
    console.log(this.id, 'dragEnter');
};

const dragLeave = () => {
    console.log(this.id, 'dragLeave');
};

const dragDrop = () => {
    console.log(this.id, 'dragDrop');
};

const addListeners = () => {
    squares.forEach((s) => s.addEventListener('dragstart', dragStart));
    squares.forEach((s) => s.addEventListener('dragend', dragEnd));
    squares.forEach((s) => s.addEventListener('dragover', dragOver));
    squares.forEach((s) => s.addEventListener('dragenter', dragEnter));
    squares.forEach((s) => s.addEventListener('dragleave', dragLeave));
    squares.forEach((s) => s.addEventListener('drop', dragDrop));
};

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    addListeners();
});