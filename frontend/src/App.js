import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      toast.error("Error loading the grid. Please refresh the page.");
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
        fromX: fromY,
        fromY: fromX,
        toX: toY,
        toY: toX
      });
      setSelected(null);
      await fetchGrid();
    } catch (error) {
      const message = error.response?.data || "Invalid move";
      toast.error(message, {
        autoClose: 3000
      });
      setSelected(null);
    }
  };

  const handleReset = async () => {
    try {
      await axios.post("http://localhost:5000/reset");
      setSelected(null);
      await fetchGrid();
    } catch (error) {
      toast.error("Error resetting the grid");
    }
  };

  const handleDownloadCSV = () => {
    window.location.href = "http://localhost:5000/history";
  };

  return (
    <div style={{ textAlign: "center" }}>
      <ToastContainer 
        position="top-center"
        theme="colored"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
                transition: "all 0.2s ease-in-out", // Smooth hover effect
                opacity: selected ? 
                  (selected.x === x && selected.y === y ? 1 : 0.7) : 1,
                transform: selected && selected.x === x && selected.y === y 
                  ? "scale(1.1)" 
                  : "scale(1)",
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
