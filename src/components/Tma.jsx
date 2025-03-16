import React, { useState } from "react";

const Tma = () => {
  // State for user authentication
  const [user, setUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  
  // State for boards management
  const [boards, setBoards] = useState([]);
  
  // Error messages for user login and board creation
  const [errorMessage, setErrorMessage] = useState("");
  const [boardError, setBoardError] = useState("");
  const [boardName, setBoardName] = useState("");
  
  // State for task modal management
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskError, setTaskError] = useState("");
  
  // State for new task details
  const [newTask, setNewTask] = useState({ name: "", description: "", date: "" });
  const [currentBoardIndex, setCurrentBoardIndex] = useState(null);
  const [currentFolder, setCurrentFolder] = useState("");

  // List of valid users for authentication
  const validUsers = [
    "Ali Mehroz",
    "Saboor Malik",
    "Hassan Shaigan",
    "Ali Rooshan",
    "Mustehsan Ali",
  ];

  // Function to handle user login
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

  // Function to handle user logout
  const handleLogout = () => {
    setLoggedIn(false);
    setUser("");
    setBoards([]);
  };

  // Function to add a new board
  const addBoard = () => {
    if (!boardName.trim()) {
      setBoardError("Please enter board name.");
      return;
    }
    setBoardError("");
    const newBoard = { name: boardName, folders: { Frontend: [], Backend: [] } };
    setBoards([...boards, newBoard]);
    setBoardName("");
  };

  // Function to delete a board
  const deleteBoard = (boardIndex) => {
    setBoards(boards.filter((_, index) => index !== boardIndex));
  };

  // Function to open the task modal for adding a task
  const openTaskModal = (boardIndex, folderName) => {
    setCurrentBoardIndex(boardIndex);
    setCurrentFolder(folderName);
    setShowTaskModal(true);
  };

  // Function to close the task modal
  const closeTaskModal = () => {
    setShowTaskModal(false);
    setNewTask({ name: "", description: "", date: "" });
    setTaskError("");
  };

  // Function to handle task input changes
  const handleTaskInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Function to add a new task
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

  // Function to delete a task
  const deleteTask = (boardIndex, folderName, taskIndex) => {
    const updatedBoards = [...boards];
    updatedBoards[boardIndex].folders[folderName].splice(taskIndex, 1);
    setBoards(updatedBoards);
  };

  // Function to update task status
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
            <input type="text" placeholder="Board Name" value={boardName} onChange={(e) => setBoardName(e.target.value)} />
            <button onClick={addBoard}>Add Board</button>
            {boardError && <p className="error-message">{boardError}</p>}
          </div>
          {boards.map((board, boardIndex) => (
            <div key={boardIndex} className="board">
              <h3>{board.name}</h3>
              <button onClick={() => deleteBoard(boardIndex)}>Delete Board</button>
              {Object.keys(board.folders).map((folderName) => (
                <div key={folderName} className="folder">
                  <h4>{folderName}</h4>
                  <button onClick={() => openTaskModal(boardIndex, folderName)}>+ Add Task</button>
                  <div>
                    {board.folders[folderName].map((task, taskIndex) => (
                      <div key={taskIndex} className={`task ${task.status.toLowerCase()}`}>
                        <p>{task.date}</p>
                        <p><b>{task.name}</b></p>
                        <p>{task.description}</p>
                        <button onClick={() => updateTaskStatus(boardIndex, folderName, taskIndex, "Pending")}>Pending</button>
                        <button onClick={() => updateTaskStatus(boardIndex, folderName, taskIndex, "Active")}>Active</button>
                        <button onClick={() => updateTaskStatus(boardIndex, folderName, taskIndex, "Complete")}>Complete</button>
                        <button onClick={() => deleteTask(boardIndex, folderName, taskIndex)}>Delete Task</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="task-modal">
            <h3>Add Task </h3>
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
