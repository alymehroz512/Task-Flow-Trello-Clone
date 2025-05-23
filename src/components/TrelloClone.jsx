import React, { useState, useEffect } from "react";
import LoginImage from "../images/login-image.svg";

const TrelloClone = () => {
  const [user, setUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [boards, setBoards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [boardError, setBoardError] = useState("");
  const [folderError, setFolderError] = useState("");
  const [boardName, setBoardName] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskError, setTaskError] = useState("");
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    date: "",
  });

  const [folderNames, setFolderNames] = useState({});
  const [currentBoardIndex, setCurrentBoardIndex] = useState(null);
  const [currentFolder, setCurrentFolder] = useState("");
  const [boardMessage, setBoardMessage] = useState("");
  const [folderMessage, setFolderMessage] = useState("");
  const [taskMessage, setTaskMessage] = useState("");
  const [deleteBoardMessage, setDeleteBoardMessage] = useState("");
  const [deleteFolderMessage, setDeleteFolderMessage] = useState("");
  const [deleteTaskMessage, setdeleteTaskMessage] = useState("");
  const [userLogin, setUserLogin] = useState("");
  const [userLogout, setUserLogout] = useState("");

  const showMessage = (setter, message) => {
    setter(message);
    setTimeout(() => {
      setter("");
    }, 5000);
  };

  const [boardSearch, setBoardSearch] = useState("");
  const [folderSearch, setFolderSearch] = useState({});

  const handleBoardSearch = (e) => {
    setBoardSearch(e.target.value.toLowerCase());
  };

  const handleFolderSearch = (boardIndex, e) => {
    setFolderSearch((prev) => ({
      ...prev,
      [boardIndex]: e.target.value.toLowerCase(),
    }));
  };

  const validUsers = React.useMemo(
    () => [
      "Ali Mehroz",
      "Saboor Malik",
      "Hassan Shaigan",
      "Ali Rooshan",
      "Mustehsan Ali",
    ],
    []
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && validUsers.includes(storedUser)) {
      setUser(storedUser);
      setLoggedIn(true);
      loadUserBoards(storedUser);
    }
  }, [validUsers]);

  const quotes = React.useMemo(
    () => [
      "Stay focused, stay driven.",
      "Small steps lead to big success.",
      "Productivity is never an accident.",
      "Don't wait for inspiration, create it.",
      "Success is built on daily habits.",
    ],
    []
  );

  const [randomQuote, setRandomQuote] = useState("");

  useEffect(() => {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    setRandomQuote(quote);
  }, [quotes]);

  const handleLogin = () => {
    if (!user.trim()) {
      showMessage(setErrorMessage, "Please enter your username");
      return;
    }
    if (!validUsers.includes(user)) {
      showMessage(
        setErrorMessage,
        "Invalid username please check your username"
      );
      return;
    }

    localStorage.setItem("user", user);
    setLoggedIn(true);
    loadUserBoards(user);
    setErrorMessage("");
    showMessage(setUserLogin, `${user} login successfully`);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser("");
    setBoards([]);
    localStorage.removeItem("user");
    showMessage(setUserLogout, `${user} logout successfully`);
  };

  const loadUserBoards = (username) => {
    const storedBoards =
      JSON.parse(localStorage.getItem(`boards_${username}`)) || [];
    setBoards(storedBoards);
  };

  const addBoard = () => {
    if (!boardName.trim()) {
      showMessage(setBoardError, "Please enter board name");
      return;
    }

    if (
      boards.some(
        (board) => board.name.toLowerCase() === boardName.toLowerCase()
      )
    ) {
      showMessage(setBoardError, `Board ${boardName} already exists`);
      return;
    }
    setBoardError("");

    const newBoard = { name: boardName, folders: {} };
    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    localStorage.setItem(`boards_${user}`, JSON.stringify(updatedBoards));
    setBoardName("");

    showMessage(setBoardMessage, `Board ${boardName} added successfully`);
  };

  const deleteBoard = (boardIndex) => {
    const boardToDelete = boards[boardIndex].name;
    const updatedBoards = boards.filter((_, index) => index !== boardIndex);
    setBoards(updatedBoards);
    localStorage.setItem(`boards_${user}`, JSON.stringify(updatedBoards));
    showMessage(
      setDeleteBoardMessage,
      `Board ${boardToDelete} deleted successfully`
    );
  };

  const handleFolderInputChange = (boardIndex, value) => {
    setFolderNames((prevFolderNames) => ({
      ...prevFolderNames,
      [boardIndex]: value,
    }));
  };

  const addFolder = (boardIndex) => {
    if (!folderNames[boardIndex] || !folderNames[boardIndex].trim()) {
      showMessage(setFolderError, "Please enter folder name");
      return;
    }

    const folderToAdd = folderNames[boardIndex].trim();
    if (
      Object.prototype.hasOwnProperty.call(
        boards[boardIndex].folders,
        folderToAdd
      )
    ) {
      showMessage(
        setFolderError,
        `Folder ${folderToAdd} already exists in ${boards[boardIndex].name} board`
      );
      return;
    }
    setFolderError("");

    const updatedBoards = [...boards];
    if (!updatedBoards[boardIndex].folders[folderNames[boardIndex]]) {
      updatedBoards[boardIndex].folders[folderNames[boardIndex]] = [];
    }

    setBoards(updatedBoards);
    localStorage.setItem(`boards_${user}`, JSON.stringify(updatedBoards));
    setFolderNames((prevFolderNames) => ({
      ...prevFolderNames,
      [boardIndex]: "",
    }));

    showMessage(
      setFolderMessage,
      `Folder ${folderNames[boardIndex]} added to Board ${boards[boardIndex].name} successfully`
    );
  };

  const deleteFolder = (boardIndex, folderName) => {
    const updatedBoards = [...boards];
    delete updatedBoards[boardIndex].folders[folderName];

    setBoards(updatedBoards);
    localStorage.setItem(`boards_${user}`, JSON.stringify(updatedBoards));
    showMessage(
      setDeleteFolderMessage,
      `Folder ${folderName} deleted from Board ${boards[boardIndex].name} successfully`
    );
  };

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
      showMessage(
        setTaskError,
        "All fields are required. Please fill in all details"
      );
      return;
    }

    const task = { ...newTask, status: "Pending" };
    const updatedBoards = [...boards];
    updatedBoards[currentBoardIndex].folders[currentFolder].push(task);
    setBoards(updatedBoards);
    localStorage.setItem(`boards_${user}`, JSON.stringify(updatedBoards));

    closeTaskModal();

    showMessage(
      setTaskMessage,
      `Task ${task.name} added to ${currentFolder} folder in ${boards[currentBoardIndex].name} board successfully`
    );
  };

  const updateTaskStatus = (boardIndex, folderName, taskIndex, status) => {
    const updatedBoards = [...boards];
    updatedBoards[boardIndex].folders[folderName][taskIndex].status = status;
    setBoards(updatedBoards);
    localStorage.setItem(`boards_${user}`, JSON.stringify(updatedBoards));
  };

  const deleteTask = (boardIndex, folderName, taskIndex) => {
    const updatedBoards = [...boards];
    const deletedTaskName =
      updatedBoards[boardIndex].folders[folderName][taskIndex].name;
    updatedBoards[boardIndex].folders[folderName].splice(taskIndex, 1);
    setBoards(updatedBoards);
    localStorage.setItem(`boards_${user}`, JSON.stringify(updatedBoards));

    showMessage(
      setdeleteTaskMessage,
      `Task ${deletedTaskName} deleted from ${folderName} folder in ${boards[boardIndex].name} board successfully`
    );
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <nav className="navbar">
            <div className="navbar-container">
              <h4>TaskFlow</h4>
            </div>
          </nav>
        </div>
      </div>

      <div className="app-container">
        <div className="notifications-container">
          {boardMessage && (
            <div className="notification success">{boardMessage}</div>
          )}
          {folderMessage && (
            <div className="notification success">{folderMessage}</div>
          )}
          {taskMessage && (
            <div className="notification success">{taskMessage}</div>
          )}
          {deleteBoardMessage && (
            <div className="notification success">{deleteBoardMessage}</div>
          )}
          {deleteFolderMessage && (
            <div className="notification success">{deleteFolderMessage}</div>
          )}
          {errorMessage && (
            <div className="notification error">{errorMessage}</div>
          )}
          {boardError && <div className="notification error">{boardError}</div>}
          {folderError && (
            <div className="notification error">{folderError}</div>
          )}
          {taskError && <div className="notification error">{taskError}</div>}
          {deleteTaskMessage && (
            <div className="notification success">{deleteTaskMessage}</div>
          )}
          {userLogin && <div className="notification success">{userLogin}</div>}
          {userLogout && (
            <div className="notification success">{userLogout}</div>
          )}
        </div>

        {!loggedIn ? (
          <div className="login-container d-flex flex-column flex-md-row align-items-center justify-content-center">
            <div
              className="login-image-container d-none d-md-flex"
              style={{ flex: 1, padding: "20px" }}
            >
              <img
                src={LoginImage}
                alt="Login"
                className="login-image img-fluid"
                style={{ maxWidth: "80%", height: "auto" }}
              />
            </div>
            <div
              className="vertical-divider d-none d-md-flex"
              style={{
                width: "2px",
                backgroundColor: "#ccc",
                height: "300px",
                margin: "0 20px",
              }}
            ></div>
            <div
              className="login-form-container d-flex flex-column align-items-center"
              style={{ flex: 1, padding: "20px" }}
            >
              <h4>Welcome to TaskFlow</h4>
              <p className="quote">{randomQuote}</p>
              <input
                type="text"
                placeholder="Enter your username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                style={{ maxWidth: "300px", marginBottom: "10px" }}
              />
              <button onClick={handleLogin}>Login</button>
            </div>
          </div>
        ) : (
          <div>
            <h2>Welcome, {user}!</h2>
            <button onClick={handleLogout}>Logout</button>
            <div>
              <input
                type="text"
                placeholder="Board Name"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
              />
              <button onClick={addBoard}>Add Board</button>
            </div>

            {boards.length > 0 && (
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search Board..."
                  value={boardSearch}
                  onChange={handleBoardSearch}
                />
              </div>
            )}

            {boards
              .filter((board) => board.name.toLowerCase().includes(boardSearch))
              .map((board, boardIndex) => (
                <div key={boardIndex} className="board">
                  <h3>{board.name}</h3>
                  <button onClick={() => deleteBoard(boardIndex)}>
                    Delete Board
                  </button>

                  <div>
                    <input
                      type="text"
                      placeholder="Folder Name"
                      value={folderNames[boardIndex] || ""}
                      onChange={(e) =>
                        handleFolderInputChange(boardIndex, e.target.value)
                      }
                    />
                    <button onClick={() => addFolder(boardIndex)}>
                      Add Folder
                    </button>
                  </div>

                  {Object.keys(board.folders).length > 0 && (
                    <div className="search-container">
                      <input
                        type="text"
                        className="search-input"
                        placeholder="Search Folder..."
                        value={folderSearch[boardIndex] || ""}
                        onChange={(e) => handleFolderSearch(boardIndex, e)}
                      />
                    </div>
                  )}

                  {Object.keys(board.folders)
                    .filter((folderName) =>
                      folderName
                        .toLowerCase()
                        .includes(folderSearch[boardIndex] || "")
                    )
                    .map((folderName) => (
                      <div key={folderName} className="folder">
                        <h4>{folderName}</h4>
                        <button
                          onClick={() => openTaskModal(boardIndex, folderName)}
                        >
                          + Add Task
                        </button>
                        <button
                          onClick={() => deleteFolder(boardIndex, folderName)}
                        >
                          Delete Folder
                        </button>

                        <div>
                          {board.folders[folderName].map((task, taskIndex) => (
                            <div
                              key={taskIndex}
                              className={`task ${task.status.toLowerCase()}`}
                            >
                              <p>{task.date}</p>
                              <p>
                                <b>{task.name}</b>
                              </p>
                              <p>{task.description}</p>
                              <button
                                onClick={() =>
                                  updateTaskStatus(
                                    boardIndex,
                                    folderName,
                                    taskIndex,
                                    "Pending"
                                  )
                                }
                              >
                                Pending
                              </button>
                              <button
                                onClick={() =>
                                  updateTaskStatus(
                                    boardIndex,
                                    folderName,
                                    taskIndex,
                                    "Active"
                                  )
                                }
                              >
                                Active
                              </button>
                              <button
                                onClick={() =>
                                  updateTaskStatus(
                                    boardIndex,
                                    folderName,
                                    taskIndex,
                                    "Complete"
                                  )
                                }
                              >
                                Complete
                              </button>
                              <button
                                onClick={() =>
                                  deleteTask(boardIndex, folderName, taskIndex)
                                }
                              >
                                Delete Task
                              </button>
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
              <h3>Add Task</h3>
              <p>
                You are adding a task in the <b>{currentFolder}</b> folder.
              </p>
              <input
                type="text"
                name="name"
                placeholder="Task Name"
                value={newTask.name}
                onChange={handleTaskInputChange}
              />
              <textarea
                name="description"
                placeholder="Task Description"
                value={newTask.description}
                style={{ resize: "none" }}
                onChange={handleTaskInputChange}
              />
              <input
                type="date"
                name="date"
                value={newTask.date}
                onChange={handleTaskInputChange}
              />
              <button onClick={addTask}>Create Task</button>
              <button className="close-btn" onClick={closeTaskModal}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TrelloClone;