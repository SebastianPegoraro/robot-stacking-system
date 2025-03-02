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

const INITIAL_GRID = [
    ["R", "B", "G"],
    ["G", "R", "B"],
    ["G", "B", "R"],
];

function initializeGrid() {
    grid = INITIAL_GRID.map(row => [...row]); // Create deep copy
}

initializeGrid();

app.post('/swap', (req, res) => {
    const { fromX, fromY, toX, toY } = req.body;
    const rightColumn = grid[0].length - 1;
    
    // Validate input coordinates
    if (fromX < 0 || fromX >= grid.length || 
        fromY < 0 || fromY >= grid[0].length ||
        toX < 0 || toX >= grid.length ||
        toY < 0 || toY >= grid[0].length) {
        return res.status(400).send('Invalid coordinates: Out of bounds');
    }

    // Check if source position has a piece
    if (!grid[fromX][fromY]) {
        return res.status(400).send('Invalid move: No piece at source position');
    }

    // Perform the swap
    const temp = grid[fromX][fromY];
    grid[fromX][fromY] = grid[toX][toY];
    grid[toX][toY] = temp;

    // Only validate if this is a new move to or from the right column
    // and not part of the initial state
    if (toY === rightColumn || fromY === rightColumn) {
        const movingPiece = toY === rightColumn ? temp : grid[toX][toY];
        const above = toX > 0 ? grid[toX - 1][rightColumn] : null;
        const below = toX < grid.length - 1 ? grid[toX + 1][rightColumn] : null;

        // Check stacking rules for the moved piece
        if (movingPiece === 'R' && above) {
            // Undo swap if invalid
            grid[toX][toY] = grid[fromX][fromY];
            grid[fromX][fromY] = temp;
            return res.status(400).send('Invalid move: Red cannot have pieces above it');
        }
        if (movingPiece === 'B' && above && above !== 'R') {
            // Undo swap if invalid
            grid[toX][toY] = grid[fromX][fromY];
            grid[fromX][fromY] = temp;
            return res.status(400).send('Invalid move: Blue can only have Red above it');
        }
        if (below === 'R') {
            // Undo swap if invalid
            grid[toX][toY] = grid[fromX][fromY];
            grid[fromX][fromY] = temp;
            return res.status(400).send('Invalid move: Cannot place piece above Red');
        }
        if (below === 'B' && movingPiece !== 'R') {
            // Undo swap if invalid
            grid[toX][toY] = grid[fromX][fromY];
            grid[fromX][fromY] = temp;
            return res.status(400).send('Invalid move: Only Red can be above Blue');
        }
    }

    // Log the successful swap in the history
    history.push({
        from: [fromX, fromY],
        to: [toX, toY],
        time: new Date().toISOString(),
    });

    res.json({ 
        grid,
        message: 'Move successful'
    });
});

function validateGrid(grid) {
    const rightColumn = grid[0].length - 1;
    
    // Check each position in the right column from bottom to top
    for (let x = grid.length - 1; x >= 0; x--) {
        const current = grid[x][rightColumn];
        const above = x > 0 ? grid[x - 1][rightColumn] : null;

        // Skip if there's no piece in this position
        if (!current) continue;

        // Apply stacking rules only for the right column
        if (current === 'R' && above) {
            console.log(`Invalid: Red piece at [${x},${rightColumn}] has piece above it`);
            return false; // Red can't have anything above
        }
        if (current === 'B' && above && above !== 'R') {
            console.log(`Invalid: Blue piece at [${x},${rightColumn}] has non-red piece above it`);
            return false; // Blue can only have red above
        }
        // Green can have anything above it
    }
    return true;
}

app.get('/state', (req, res) => {
    res.json({ grid });
});

app.get('/history', (req, res) => {
    const csvData = history.map(entry => 
        `${entry.from[0]},${entry.from[1]},${entry.to[0]},${entry.to[1]},${entry.time}`
    ).join('\n');
    fs.writeFileSync('history.csv', 'fromX,fromY,toX,toY,timestamp\n' + csvData);
    res.download('history.csv');
});

// Add reset endpoint
app.post('/reset', (req, res) => {
    initializeGrid();
    history.length = 0; // Clear history
    res.json({ grid });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
