document.addEventListener('DOMContentLoaded', () => {
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

    // create board
    const createBoard = () => {
        for (let i = 0; i < (width * width); i += 1) {
            const square = document.createElement('div');
            const randomColor = Math.floor(Math.random() * tileColors.length);
            
            square.style.backgroundColor = tileColors[randomColor];
            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            squares.push(square);
            grid.appendChild(square);
        }
    };

    createBoard();

});