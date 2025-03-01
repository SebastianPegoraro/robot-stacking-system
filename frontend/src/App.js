import React, { useState, useEffect } from "react";
import axios from "axios";

const GRID_SIZE = 5;

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

  const handleMove = async (toX, toY) => {
    if (!selected) return;
    const { x, y } = selected;
    try {
      await axios.post("http://localhost:5000/move", { fromX: x, fromY: y, toX, toY });
      setSelected(null);
      fetchGrid();
    } catch (error) {
      console.error("Invalid move:", error);
    }
  };

  const handleDownloadCSV = () => {
    window.location.href = "http://localhost:5000/history";
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Robot Stacking Grid</h1>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_SIZE}, 50px)`, gap: "5px", justifyContent: "center" }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => (cell ? setSelected({ x: rowIndex, y: colIndex }) : handleMove(rowIndex, colIndex))}
              style={{
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: cell ? (selected?.x === rowIndex && selected?.y === colIndex ? "yellow" : "lightgray") : "white",
                border: "1px solid black",
                cursor: "pointer",
              }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      <button onClick={handleDownloadCSV} style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}>Download History CSV</button>
    </div>
  );
};

export default App;
