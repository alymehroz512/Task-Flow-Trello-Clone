import React, { useState } from "react";

const Tma = () => {
  // State for user authentication
  const [user, setUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // State for boards and folders management
  const [boards, setBoards] = useState([]);
  
  // Error messages
  const [errorMessage, setErrorMessage] = useState("");
  const [boardError, setBoardError] = useState("");
  const [folderError, setFolderError] = useState("");
  const [boardName, setBoardName] = useState("");
  const [folderName, setFolderName] = useState("");

  // State for task modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskError, setTaskError] = useState("");
  const [newTask, setNewTask] = useState({ name: "", description: "", date: "" });
  const [currentBoardIndex, setCurrentBoardIndex] = useState(null);
  const [currentFolder, setCurrentFolder] = useState("");

  // Valid users list
  const validUsers = ["Ali Mehroz", "Saboor Malik", "Hassan Shaigan", "Ali Rooshan", "Mustehsan Ali"];

  // User authentication functions
  const handleLogin = () => {
    if (!user.trim()) {
      setErrorMessage("Please enter your username.");
      return;
    }
    if (!validUsers.includes(user)) {
      setErrorMessage("Invalid username. Please check your username.");
      return;
    }
    setLoggedIn(true);
    setErrorMessage("");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser("");
    setBoards([]);
  };

  // Board management functions
  const addBoard = () => {
    if (!boardName.trim()) {
      setBoardError("Please enter board name.");
      return;
    }
    setBoardError("");
    setBoards([...boards, { name: boardName, folders: {} }]);
    setBoardName("");
  };

  const deleteBoard = (boardIndex) => {
    setBoards(boards.filter((_, index) => index !== boardIndex));
  };

  // Folder management functions
  const addFolder = (boardIndex) => {
    if (!folderName.trim()) {
      setFolderError("Please enter a folder name.");
      return;
    }
    setFolderError("");
    const updatedBoards = [...boards];
    if (!updatedBoards[boardIndex].folders[folderName]) {
      updatedBoards[boardIndex].folders[folderName] = [];
      setBoards(updatedBoards);
      setFolderName("");
    }
  };

  const deleteFolder = (boardIndex, folderName) => {
    const updatedBoards = [...boards];
    delete updatedBoards[boardIndex].folders[folderName];
    setBoards(updatedBoards);
  };

  // Task management functions
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
      setTaskError("All fields are required. Please fill in all details.");
      return;
    }

    const task = { ...newTask, status: "Pending" };
    const updatedBoards = [...boards];
    updatedBoards[currentBoardIndex].folders[currentFolder].push(task);
    setBoards(updatedBoards);
    closeTaskModal();
  };

  const deleteTask = (boardIndex, folderName, taskIndex) => {
    const updatedBoards = [...boards];
    updatedBoards[boardIndex].folders[folderName].splice(taskIndex, 1);
    setBoards(updatedBoards);
  };

  const updateTaskStatus = (boardIndex, folderName, taskIndex, status) => {
    const updatedBoards = [...boards];
    updatedBoards[boardIndex].folders[folderName][taskIndex].status = status;
    setBoards(updatedBoards);
  };

  return (
    <div className="app-container">
      {!loggedIn ? (
        <div className="login-container">
          <input type="text" placeholder="Enter your username" value={user} onChange={(e) => setUser(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      ) : (
        <div>
          <h2>Welcome, {user}!</h2>
          <button onClick={handleLogout}>Logout</button>
          <div>
            {/* Board Creation */}
            <input type="text" placeholder="Board Name" value={boardName} onChange={(e) => setBoardName(e.target.value)} />
            <button onClick={addBoard}>Add Board</button>
            {boardError && <p className="error-message">{boardError}</p>}
          </div>

          {/* Display Boards */}
          {boards.map((board, boardIndex) => (
            <div key={boardIndex} className="board">
              <h3>{board.name}</h3>
              <button onClick={() => deleteBoard(boardIndex)}>Delete Board</button>

              {/* Folder Creation */}
              <input type="text" placeholder="Folder Name" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
              <button onClick={() => addFolder(boardIndex)}>Add Folder</button>
              {folderError && <p className="error-message">{folderError}</p>}

              {/* Display Folders */}
              {Object.keys(board.folders).map((folder) => (
                <div key={folder} className="folder">
                  <h4>{folder}</h4>
                  <button onClick={() => openTaskModal(boardIndex, folder)}>+ Add Task</button>
                  <button onClick={() => deleteFolder(boardIndex, folder)}>Delete Folder</button>
                  
                  <div>
                    {board.folders[folder].map((task, taskIndex) => (
                      <div key={taskIndex} className={`task ${task.status.toLowerCase()}`}>
                        <p>{task.date}</p>
                        <p><b>{task.name}</b></p>
                        <p>{task.description}</p>
                        <button onClick={() => updateTaskStatus(boardIndex, folder, taskIndex, "Pending")}>Pending</button>
                        <button onClick={() => updateTaskStatus(boardIndex, folder, taskIndex, "Active")}>Active</button>
                        <button onClick={() => updateTaskStatus(boardIndex, folder, taskIndex, "Complete")}>Complete</button>
                        <button onClick={() => deleteTask(boardIndex, folder, taskIndex)}>Delete Task</button>
                      </div>
                    ))}
                  </div>
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
            {taskError && <p>{taskError}</p>}
            <button onClick={addTask}>Create Task</button>
            <button className="close-btn" onClick={closeTaskModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tma;
