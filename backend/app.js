const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Grid representation
let grid = [];
const history = [];

// Initialize grid with circles (for example, a 5x5 grid with some colored circles)
function initializeGrid() {
    grid = [
        ['R', null, 'G', null, 'B'],
        [null, 'B', null, 'R', null],
        ['G', null, 'R', null, 'G'],
        [null, 'G', null, 'B', null],
        ['B', null, 'G', null, 'R']
    ];
}

initializeGrid();

// Movement logic
function isValidMove(fromX, fromY, toX, toY) {
    if (toX < 0 || toX >= grid.length || toY < 0 || toY >= grid[0].length) return false;
    if (grid[toX][toY] !== null) return false;
    return true;
}

app.post('/move', (req, res) => {
    const { fromX, fromY, toX, toY } = req.body;
    if (!isValidMove(fromX, fromY, toX, toY)) {
        return res.status(400).json({ error: 'Invalid move' });
    }
    
    grid[toX][toY] = grid[fromX][fromY];
    grid[fromX][fromY] = null;
    history.push({ fromX, fromY, toX, toY, moved: grid[toX][toY] });
    res.json({ grid });
});

app.get('/state', (req, res) => {
    res.json({ grid });
});

app.get('/history', (req, res) => {
    const csvData = history.map(entry => `${entry.fromX},${entry.fromY},${entry.toX},${entry.toY},${entry.moved}`).join('\n');
    fs.writeFileSync('history.csv', 'fromX,fromY,toX,toY,moved\n' + csvData);
    res.download('history.csv');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
