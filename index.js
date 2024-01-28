const size = 5;
let board = Array.from({ length: size }, () => Array(size).fill(0));
let score = 0;
let startTouchX, startTouchY, endTouchX, endTouchY;

function getRandomEmptyCell() {
    const emptyCells = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }
    if (emptyCells.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
}

function addRandomTile() {
    const emptyCell = getRandomEmptyCell();
    if (emptyCell !== null) {
        board[emptyCell.row][emptyCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function initializeGame() {
    addRandomTile();
    addRandomTile();
    updateDisplay();
}

function updateDisplay() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = 'Score: ' + score;

    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const value = board[i][j];
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = value === 0 ? '' : value;
            tile.style.backgroundColor = getTileColor(value);
            gameContainer.appendChild(tile);
        }
    }
}

function getTileColor(value) {
    const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e',
    };

    return colors[value] || '#3c3a32';
}

function slide(row) {
    const newRow = row.filter(value => value !== 0);
    const zerosToAdd = size - newRow.length;
    return Array(zerosToAdd).fill(0).concat(newRow);
}

function merge(row) {
    for (let i = 0; i < size - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    return row;
}

function move(direction) {
    let moved = false;

    switch (direction) {
        case 'up':
            moved = moveUp();
            break;
        case 'down':
            moved = moveDown();
            break;
        case 'left':
            moved = moveLeft();
            break;
        case 'right':
            moved = moveRight();
            break;
    }

    if (moved) {
        addRandomTile();
        updateDisplay();
    }
}

function moveUp() {
    let moved = false;

    for (let j = 0; j < size; j++) {
        const column = [];
        for (let i = 0; i < size; i++) {
            column.push(board[i][j]);
        }

        const originalColumn = [...column];
        const slideColumn = slide(column);
        const mergedColumn = merge(slideColumn);
        const newSlideColumn = slide(mergedColumn);

        if (!originalColumn.every((value, index) => value === newSlideColumn[index])) {
            moved = true;
        }

        for (let i = 0; i < size; i++) {
            board[i][j] = newSlideColumn[i];
        }
    }

    return moved;
}

function moveDown() {
    let moved = false;

    for (let j = 0; j < size; j++) {
        const column = [];
        for (let i = size - 1; i >= 0; i--) {
            column.push(board[i][j]);
        }

        const originalColumn = [...column];
        const slideColumn = slide(column);
        const mergedColumn = merge(slideColumn);
        const newSlideColumn = slide(mergedColumn);

        if (!originalColumn.every((value, index) => value === newSlideColumn[index])) {
            moved = true;
        }

        for (let i = size - 1; i >= 0; i--) {
            board[i][j] = newSlideColumn[size - 1 - i];
        }
    }

    return moved;
}

function moveLeft() {
    let moved = false;

    for (let i = 0; i < size; i++) {
        const row = board[i];
        const originalRow = [...row];

        const slideRow = slide(row);
        const mergedRow = merge(slideRow);
        const newSlideRow = slide(mergedRow);

        if (!originalRow.every((value, index) => value === newSlideRow[index])) {
            moved = true;
        }

        board[i] = newSlideRow;
    }

    return moved;
}

function moveRight() {
    let moved = false;

    for (let i = 0; i < size; i++) {
        const row = board[i];
        const reversedRow = row.slice().reverse();
        const originalRow = [...reversedRow];

        const slideRow = slide(reversedRow);
        const mergedRow = merge(slideRow);
        const newSlideRow = slide(mergedRow);

        if (!originalRow.every((value, index) => value === newSlideRow[index])) {
            moved = true;
        }

        board[i] = newSlideRow.reverse();
    }

    return moved;
}

function handleSwipe() {
    const deltaX = endTouchX - startTouchX;
    const deltaY = endTouchY - startTouchY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            move('left');
        } else {
            move('right');
        }
    } else {
        if (deltaY > 0) {
            move('up');
        } else {
            move('down');
        }
    }
}

document.addEventListener('keydown', event => {
    if (![37, 38, 39, 40].includes(event.keyCode)) return;

    event.preventDefault();

    switch (event.keyCode) {
        case 37:
            move('left');
            break;
        case 38:
            move('up');
            break;
        case 39:
            move('right');
            break;
        case 40:
            move('down');
            break;
    }
});

document.addEventListener('touchstart', event => {
    startTouchX = event.touches[0].clientX;
    startTouchY = event.touches[0].clientY;
});

document.addEventListener('touchmove', event => {
    event.preventDefault();
    endTouchX = event.touches[0].clientX;
    endTouchY = event.touches[0].clientY;
});

document.addEventListener('touchend', event => {
    handleSwipe();
});

initializeGame();
