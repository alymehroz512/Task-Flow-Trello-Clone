import React, { useState, useEffect } from "react";

const Tma = () => {
  // State variables
  const [user, setUser] = useState(""); // Stores the username
  const [loggedIn, setLoggedIn] = useState(false); // Tracks login status
  const [boards, setBoards] = useState([]); // Stores the user's boards
  const [errorMessage, setErrorMessage] = useState(""); // Stores login error messages
  const [boardError, setBoardError] = useState(""); // Stores board-related error messages
  const [boardName, setBoardName] = useState(""); // Stores the input board name

  // List of valid users
  const validUsers = ["Ali Mehroz", "Saboor Malik", "Hassan Shaigan", "Ali Rooshan", "Mustehsan Ali"];

  // Load user and boards from local storage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && validUsers.includes(storedUser)) {
      setUser(storedUser);
      setLoggedIn(true);
      loadUserBoards(storedUser);
    }
  }, []);

  // Handle user login
  const handleLogin = () => {
    if (!user.trim()) {
      setErrorMessage("Please enter your username.");
      return;
    }
    if (!validUsers.includes(user)) {
      setErrorMessage("Invalid username. Please check your username.");
      return;
    }

    localStorage.setItem("user", user);
    setLoggedIn(true);
    loadUserBoards(user);
    setErrorMessage("");
  };

  // Handle user logout
  const handleLogout = () => {
    setLoggedIn(false);
    setUser("");
    setBoards([]);
    localStorage.removeItem("user");
    window.location.reload();
  };

  // Load boards for the logged-in user from local storage
  const loadUserBoards = (username) => {
    const storedBoards = JSON.parse(localStorage.getItem(`boards_${username}`)) || [];
    setBoards(storedBoards);
  };

  // Add a new board
  const addBoard = () => {
    if (!boardName.trim()) {
      setBoardError("Please enter board name.");
      return;
    }
    setBoardError("");

    const newBoard = { name: boardName, folders: { Frontend: [], Backend: [] } };
    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    localStorage.setItem(`boards_${user}`, JSON.stringify(updatedBoards));
    setBoardName("");
  };

  // Delete a board
  const deleteBoard = (boardIndex) => {
    const updatedBoards = boards.filter((_, index) => index !== boardIndex);
    setBoards(updatedBoards);
    localStorage.setItem(`boards_${user}`, JSON.stringify(updatedBoards));
  };

  return (
    <div className="app-container">
      {!loggedIn ? (
        // Login form
        <div className="login-container">
          <input type="text" placeholder="Enter your username" value={user} onChange={(e) => setUser(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      ) : (
        // Main app content after login
        <div>
          <h2>Welcome, {user}!</h2>
          <button onClick={handleLogout}>Logout</button>

          {/* Board creation form */}
          <div>
            <input type="text" placeholder="Board Name" value={boardName} onChange={(e) => setBoardName(e.target.value)} />
            <button onClick={addBoard}>Add Board</button>
            {boardError && <p className="error-message">{boardError}</p>}
          </div>

          {/* Display boards */}
          {boards.length === 0 ? (
            <p>No boards yet. Add a board to get started!</p>
          ) : (
            boards.map((board, boardIndex) => (
              <div key={boardIndex} className="board">
                <h3>{board.name}</h3>
                {/* Delete board button */}
                <button onClick={() => deleteBoard(boardIndex)}>Delete Board</button>
                {/* Display folders inside the board */}
                {Object.keys(board.folders).map((folderName) => (
                  <div key={folderName} className="folder">
                    <h4>{folderName}</h4>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Tma;
