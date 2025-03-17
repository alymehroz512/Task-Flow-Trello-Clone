import React, { useState } from "react";

const Tma = () => {
  // State for User Authentication
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  // State for Boards Management
  const [boards, setBoards] = useState([]);
  const [boardName, setBoardName] = useState("");
  const [boardError, setBoardError] = useState("");

  // Folder Input and Errors
  const [folderErrors, setFolderErrors] = useState({});
  const [folderName, setFolderName] = useState({});

  // Task Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskError, setTaskError] = useState("");
  const [newTask, setNewTask] = useState({ name: "", description: "", date: "" });
  const [currentBoardIndex, setCurrentBoardIndex] = useState(null);
  const [currentFolder, setCurrentFolder] = useState("");

  // User-Specific Storage ( Object to Store User-Specific Boards)
  const [userBoards, setUserBoards] = useState({});

  // Valid Users List
  const validUsers = [
    { id: 1, username: "Ali Mehroz" },
    { id: 2, username: "Saboor Malik" },
    { id: 3, username: "Hassan Shaigan" },
    { id: 4, username: "Ali Rooshan" },
    { id: 5, username: "Mustehsan Ali" },
  ];

  // User Authentication Functions
  const handleLogin = () => {
    const foundUser = validUsers.find((u) => u.username === user.trim());

    if (!user.trim()) {
      alert("Please enter your username.");
      return;
    }
    if (!foundUser) {
      alert("Invalid username. Please check your username.");
      return;
    }

    setUserId(foundUser.id);
    setBoards(userBoards[foundUser.id] || []); // Load the stored boards for this user
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // Save user's data before logout
    // Save user's data before logout using userId as the key
    setUserBoards((prev) => ({ ...prev, [userId]: boards }));

    setLoggedIn(false);
    setUser("");
    setUserId(null);
    setBoards([]);
  };

  // Board Management Functions
  const addBoard = () => {
    if (!boardName.trim()) {
      setBoardError("Please enter board name.");
      return;
    }
    setBoardError("");

    const updatedBoards = [...boards, { name: boardName, folders: {} }];
    setUserBoards((prev) => ({ ...prev, [userId]: updatedBoards }));
    setBoards(updatedBoards);
    setBoardName("");
  };

  const deleteBoard = (boardIndex) => {
    const updatedBoards = boards.filter((_, index) => index !== boardIndex);
    setUserBoards((prev) => ({ ...prev, [userId]: updatedBoards }));
    setBoards(updatedBoards);
  };

  // Folder Management Functions
  const addFolder = (boardIndex) => {
    const board = boards[boardIndex];
    const folder = folderName[boardIndex]?.trim();

    if (!folder) {
      setFolderErrors((prev) => ({
        ...prev,
        [boardIndex]: "Please enter a folder name.",
      }));
      return;
    }

    if (board.folders[folder]) {
      setFolderErrors((prev) => ({
        ...prev,
        [boardIndex]: "Folder name already exists.",
      }));
      return;
    }

    setFolderErrors((prev) => ({ ...prev, [boardIndex]: "" }));

    const updatedBoards = [...boards];
    updatedBoards[boardIndex].folders[folder] = [];
    // Save folder structure per user
    setUserBoards((prev) => ({ ...prev, [userId]: updatedBoards }));
    setBoards(updatedBoards);
    setFolderName((prev) => ({ ...prev, [boardIndex]: "" }));
  };

  const deleteFolder = (boardIndex, folderName) => {
    const updatedBoards = [...boards];
    delete updatedBoards[boardIndex].folders[folderName];
    setUserBoards((prev) => ({ ...prev, [userId]: updatedBoards }));
    setBoards(updatedBoards);
  };

  // Task Management Functions
  const openTaskModal = (boardIndex, folderName) => {
    setCurrentBoardIndex(boardIndex);
    setCurrentFolder(folderName);
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setNewTask({ name: "", description: "", date: "" });
    setTaskError("");
  };

  const handleTaskInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (!newTask.name.trim() || !newTask.description.trim() || !newTask.date) {
      setTaskError("All fields are required.");
      return;
    }

    const updatedBoards = [...boards];
    updatedBoards[currentBoardIndex].folders[currentFolder].push({
      ...newTask,
      status: "Pending",
    });

    // Save task data for the user
    setUserBoards((prev) => ({ ...prev, [userId]: updatedBoards }));
    setBoards(updatedBoards);
    closeTaskModal();
  };

  const deleteTask = (boardIndex, folderName, taskIndex) => {
    const updatedBoards = [...boards];
    updatedBoards[boardIndex].folders[folderName].splice(taskIndex, 1);
    setUserBoards((prev) => ({ ...prev, [userId]: updatedBoards }));
    setBoards(updatedBoards);
  };

  const updateTaskStatus = (boardIndex, folderName, taskIndex, status) => {
    const updatedBoards = [...boards];
    updatedBoards[boardIndex].folders[folderName][taskIndex].status = status;
    setUserBoards((prev) => ({ ...prev, [userId]: updatedBoards }));
    setBoards(updatedBoards);
  };

  return (
    <div className="app-container">
      {!loggedIn ? (
        <div className="login-container">
          <input
            type="text"
            placeholder="Enter your username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user}!</h2>
          <button onClick={handleLogout}>Logout</button>

          {/* Board Creation */}
          <div>
            <input
              type="text"
              placeholder="Board Name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
            />
            <button onClick={addBoard}>Add Board</button>
            {boardError && <p className="error-message">{boardError}</p>}
          </div>

          {/* Display Boards */}
          {boards.map((board, boardIndex) => (
            <div key={boardIndex} className="board">
              <h3>{board.name}</h3>
              <button onClick={() => deleteBoard(boardIndex)}>Delete Board</button>

              {/* Folder Creation */}
              <input
                type="text"
                placeholder="Folder Name"
                value={folderName[boardIndex] || ""}
                onChange={(e) => setFolderName({ ...folderName, [boardIndex]: e.target.value })}
              />
              <button onClick={() => addFolder(boardIndex)}>Add Folder</button>
              {folderErrors[boardIndex] && <p className="error-message">{folderErrors[boardIndex]}</p>}

              {/* Display Folders & Tasks */}
              {Object.keys(board.folders).map((folder) => (
                <div key={folder} className="folder">
                  <h4>{folder}</h4>
                  <button onClick={() => openTaskModal(boardIndex, folder)}>+ Add Task</button>
                  <button onClick={() => deleteFolder(boardIndex, folder)}>Delete Folder</button>

                  {board.folders[folder].map((task, taskIndex) => (
                    <div key={taskIndex} className={`task ${task.status.toLowerCase()}`}>
                      <p>{task.date}</p>
                      <p><b>{task.name}</b></p>
                      <p>{task.description}</p>
                      <button onClick={() => updateTaskStatus(boardIndex, folder, taskIndex, "Pending")}>Pending</button>
                      <button onClick={() => updateTaskStatus(boardIndex, folder, taskIndex, "Active")}>Active</button>
                      <button onClick={() => updateTaskStatus(boardIndex, folder, taskIndex, "Complete")}>Complete</button>
                      <button onClick={() => deleteTask(boardIndex, folder, taskIndex)}>Delete Task</button>
                      <button onClick={() => deleteTask(boardIndex, folder, taskIndex)}>Delete Task</button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {/* Task Modal */}
        {showTaskModal && (
        <div className="modal-overlay">
          <div className="task-modal">
            <h3>Add Task</h3>
            <p>You are adding a task in the <b>{currentFolder}</b> folder.</p>
            <input type="text" name="name" placeholder="Task Name" value={newTask.name} onChange={handleTaskInputChange} />
            <textarea name="description" placeholder="Task Description" value={newTask.description} onChange={handleTaskInputChange} />
            <input type="date" name="date" value={newTask.date} onChange={handleTaskInputChange} />
            {taskError && <p className="error-message">{taskError}</p>}
            <button onClick={addTask}>Create Task</button>
            <button className="close-btn" onClick={closeTaskModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tma;
