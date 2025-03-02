import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const GRID_SIZE = 3;

const App = () => {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState(null);
  const [initialRightColumn, setInitialRightColumn] = useState([]); // Store initial right column state

  useEffect(() => {
    fetchGrid();
  }, []);

  // Check the win condition whenever the grid changes
  useEffect(() => {
    if (grid.length > 0) {
      checkWinCondition();
    }
  }, [grid]); // Run when the grid state changes

  const fetchGrid = async () => {
    try {
      const response = await axios.get("http://localhost:5000/state");
      setGrid(response.data.grid);
      setInitialRightColumn(
        response.data.grid.map((row) => row[GRID_SIZE - 1])
      ); // Store initial state
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

    // Check if the move is valid (only horizontal or vertical)
    const isValidMove = fromX === toX || fromY === toY;
    if (!isValidMove) {
      toast.error(
        "Invalid move: You can only move horizontally or vertically."
      );
      return;
    }

    try {
      // Perform the swap
      await axios.post("http://localhost:5000/swap", {
        fromX: fromY,
        fromY: fromX,
        toX: toY,
        toY: toX,
      });

      // Reset selected after the swap
      setSelected(null);

      // Fetch the updated grid after the swap
      await fetchGrid();

      // Check if the game is won after the grid has been updated
      checkWinCondition();
    } catch (error) {
      const message = error.response?.data || "Invalid move";
      toast.error(message, {
        autoClose: 3000,
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

  const checkWinCondition = () => {
    const rightColumn = grid.map((row) => row[GRID_SIZE - 1]); // Get the right column
    const winningOrder = ["R", "B", "G"]; // Define the winning order

    console.log("Current right column:", rightColumn);
    console.log("Initial right column:", initialRightColumn);
    console.log("Winning order:", winningOrder);

    // Check if the right column matches the winning order
    if (JSON.stringify(rightColumn) === JSON.stringify(winningOrder)) {
      toast.success("Congratulations! You've completed the game!", {
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="app-container">
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 50px)`,
          gap: "5px",
          justifyContent: "center",
        }}
      >
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
                border:
                  selected && selected.x === x && selected.y === y
                    ? "3px solid yellow"
                    : "1px solid black",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out", // Smooth hover effect
                opacity: selected
                  ? selected.x === x && selected.y === y
                    ? 1
                    : 0.7
                  : 1,
                transform:
                  selected && selected.x === x && selected.y === y
                    ? "scale(1.1)"
                    : "scale(1)",
              }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      <div className="button-container">
        <button className="action-button" onClick={handleReset}>
          Reset Grid
        </button>
        <button className="action-button" onClick={handleDownloadCSV}>
          Download History CSV
        </button>
      </div>
    </div>
  );
};

export default App;
