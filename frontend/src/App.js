import React, { useState, useEffect } from "react";
import axios from "axios";

const GRID_SIZE = 3;

const App = () => {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchGrid();
  }, []);

  const fetchGrid = async () => {
    try {
      const response = await axios.get("http://localhost:5000/state");
      setGrid(response.data.grid);
    } catch (error) {
      console.error("Error fetching grid:", error);
    }
  };

  const handleSwap = async (toX, toY) => {
    if (!selected) {
        setSelected({ x: toX, y: toY });
        return;
    }
    
    const { x: fromX, y: fromY } = selected;
    console.log(`Moving from (${fromX},${fromY}) to (${toX},${toY})`);
    
    try {
        await axios.post("http://localhost:5000/swap", { 
            fromX: fromY,  // Swap X and Y for grid coordinates
            fromY: fromX,
            toX: toY,     // Swap X and Y for grid coordinates
            toY: toX
        });
        setSelected(null);
        fetchGrid();
    } catch (error) {
        console.error("Invalid move:", error);
        setSelected(null);  // Clear selection on invalid move
    }
  };

  const handleReset = async () => {
    try {
      await axios.post("http://localhost:5000/reset");
      setSelected(null);
      fetchGrid();
    } catch (error) {
      console.error("Error resetting grid:", error);
    }
  };

  const handleDownloadCSV = () => {
    window.location.href = "http://localhost:5000/history";
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Robot Stacking Grid</h1>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_SIZE}, 50px)`, gap: "5px", justifyContent: "center" }}>
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              onClick={() => handleSwap(x, y)}
              style={{
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: cell
                  ? cell === "R"
                    ? "red"
                    : cell === "G"
                    ? "green"
                    : "blue"
                  : "white",
                borderRadius: cell ? "50%" : "0%",
                border: selected && selected.x === x && selected.y === y 
                  ? "3px solid yellow"
                  : "1px solid black",
                cursor: "pointer",
              }}              
            >
              {cell}
            </div>
          ))
        )}
      </div>
      <div style={{ marginTop: "20px" }}>
        <button 
          onClick={handleReset} 
          style={{ marginRight: "10px", padding: "10px", cursor: "pointer" }}
        >
          Reset Grid
        </button>
        <button 
          onClick={handleDownloadCSV} 
          style={{ padding: "10px", cursor: "pointer" }}
        >
          Download History CSV
        </button>
      </div>
    </div>
  );
};

export default App;
