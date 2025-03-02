# 🤖 Robot Circle Stacking System

This project is a full-stack application where a robot moves and stacks colored circles within a grid based on specific stacking rules. It includes:

- 🚀 **Frontend:** React for grid interaction.
- ⚙️ **Backend:** Node.js + Express for move processing and history tracking.
- 📄 **CSV Export:** Download movement history.

---

## 📁 Project Structure
```
robot-circle-stacking-system/
├── backend/   # Node.js + Express backend
├── frontend/  # React frontend
├── package.json  # Runs both frontend and backend
```

---

## 🛠️ Installation & Run

### 1. Clone the repository:
```bash
git clone https://github.com/SebastianPegoraro/robot-stacking-system.git
cd robot-circle-stacking-system
```

### 2. Install dependencies (root + frontend + backend):
```bash
npm install
```

### 3. Start the full application:
```bash
npm start
```

---

## 🌐 Usage
- Open your browser and navigate to:  
  [http://localhost:3000](http://localhost:3000)

- The backend runs on:  
  [http://localhost:5000](http://localhost:5000)

---

## 🎮 How to Play
- Select a circle on the grid by clicking on it.
- Click an empty cell to move the selected circle.
- Moves are validated by the backend based on these rules:
  - **Red (R):** Nothing can stack on top.
  - **Green (G):** Any color can stack above.
  - **Blue (B):** Only red can stack above.
- Download your move history as a CSV using the **Download History CSV** button.

---

## 📄 CSV History
- The backend records every move.
- Download the CSV to review all moves with positions and colors.

---

## 🚀 Technologies
- Frontend: **React**
- Backend: **Node.js + Express**
- Package Runner: **Concurrently**

---

## 💡 Notes
- The root `package.json` handles everything:
  - `postinstall` installs dependencies in both frontend and backend.
  - `start` runs both servers at once.

---

## 🧑‍💻 Author
Sebastian Pegoraro

