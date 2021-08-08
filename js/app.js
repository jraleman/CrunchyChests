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

let colorBeingDragged;
let colorBeingReplaced;
let squareIdBeingDragged;

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

const dragStart = (e) => {
    const { target: { id, style: { backgroundColor } } } = e;
    console.log(id, 'dragStart');
    colorBeingDragged = backgroundColor;
    squareIdBeingDragged = parseInt(id, 10);
};

const dragEnd = (e) => {
    const { target: { id, style: { backgroundColor } } } = e;
    console.log(id, 'dragEnd');
};

const dragOver = (e) => {
    const { target: { id, style: { backgroundColor } } } = e;
    e.preventDefault();
    console.log(id, 'dragOver');
};

const dragEnter = (e) => {
    const { target: { id, style: { backgroundColor } } } = e;
    e.preventDefault();
    console.log(id, 'dragEnter');
};

const dragLeave = (e) => {
    const { target: { id, style: { backgroundColor } } } = e;
    console.log(id, 'dragLeave');
};

const dragDrop = (e) => {
    const { target: { id, style: { backgroundColor } } } = e;
    colorBeingReplaced = backgroundColor;
    squareIdBeingReplaced = parseInt(id, 10);
    squares[id].style.backgroundColor = colorBeingDragged;
    squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced; 
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

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    addListeners();
});