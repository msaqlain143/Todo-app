document.addEventListener("DOMContentLoaded", () => {
  const newTaskInput = document.getElementById("new-task");
  const taskStatusSelect = document.getElementById("task-status");
  const addButton = document.getElementById("add-button");
  const taskList = document.getElementById("task-list");
  const allTasksButton = document.getElementById("all-tasks");
  const pendingTasksButton = document.getElementById("pending-tasks");
  const inprogressTasksButton = document.getElementById("inprogress-tasks");
  const completedTasksButton = document.getElementById("completed-tasks");
  const clearCompletedButton = document.getElementById(
    "clear-completed-button"
  );

  let tasks = loadTasks();
  renderTasks(tasks);

  addButton.addEventListener("click", addTask);
  taskList.addEventListener("change", handleTaskChange); // For status updates
  taskList.addEventListener("click", handleTaskClick); // For delete button clicks
  allTasksButton.addEventListener("click", () => filterTasks("all"));
  pendingTasksButton.addEventListener("click", () => filterTasks("pending"));
  inprogressTasksButton.addEventListener("click", () =>
    filterTasks("inprogress")
  );
  completedTasksButton.addEventListener("click", () =>
    filterTasks("completed")
  );
  clearCompletedButton.addEventListener("click", clearCompleted);

  function loadTasks() {
    const storedTasks = localStorage.getItem("todos");
    return storedTasks ? JSON.parse(storedTasks) : [];
  }

  function saveTasks() {
    localStorage.setItem("todos", JSON.stringify(tasks));
  }

  function renderTasks(taskListToRender) {
    taskList.innerHTML = "";
    taskListToRender.forEach((task) => {
      const listItem = createTaskElement(task);
      taskList.appendChild(listItem);
    });
  }

  function createTaskElement(task) {
    const listItem = document.createElement("li");
    listItem.classList.add("task-item");
    listItem.dataset.taskId = task.id;

    const taskText = document.createElement("span");
    taskText.classList.add("task-text");
    taskText.textContent = task.text;
    if (task.status === "completed") {
      taskText.classList.add("completed");
    }

    const statusIndicator = document.createElement("span");
    statusIndicator.classList.add("task-status-indicator", task.status);
    statusIndicator.textContent =
      task.status.charAt(0).toUpperCase() + task.status.slice(1);

    const statusSelect = document.createElement("select");
    statusSelect.classList.add("status-select");
    statusSelect.innerHTML = `
          <option value="pending" ${
            task.status === "pending" ? "selected" : ""
          }>Pending</option>
          <option value="inprogress" ${
            task.status === "inprogress" ? "selected" : ""
          }>In Progress</option>
          <option value="completed" ${
            task.status === "completed" ? "selected" : ""
          }>Completed</option>
      `;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";

    listItem.appendChild(taskText);
    listItem.appendChild(statusIndicator);
    listItem.appendChild(statusSelect);
    listItem.appendChild(deleteButton);

    return listItem;
  }

  function addTask() {
    const taskText = newTaskInput.value.trim();
    const taskStatus = taskStatusSelect.value;
    if (taskText !== "") {
      const newTask = {
        id: Date.now(),
        text: taskText,
        status: taskStatus,
      };
      tasks.push(newTask);
      saveTasks();
      renderTasks(tasks);
      newTaskInput.value = "";
    }
  }

  function handleTaskChange(event) {
    const listItem = event.target.parentNode;
    const taskId = parseInt(listItem.dataset.taskId);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1 && event.target.classList.contains("status-select")) {
      tasks[taskIndex].status = event.target.value;
      const taskTextSpan = listItem.querySelector(".task-text");
      taskTextSpan.classList.remove("pending", "inprogress", "completed");
      if (tasks[taskIndex].status === "completed") {
        taskTextSpan.classList.add("completed");
      }
      const statusIndicator = listItem.querySelector(".task-status-indicator");
      statusIndicator.className =
        "task-status-indicator " + tasks[taskIndex].status;
      statusIndicator.textContent =
        tasks[taskIndex].status.charAt(0).toUpperCase() +
        tasks[taskIndex].status.slice(1);
      saveTasks();
    }
  }

  function handleTaskClick(event) {
    if (event.target.classList.contains("delete-button")) {
      const listItem = event.target.parentNode;
      const taskId = parseInt(listItem.dataset.taskId);
      tasks = tasks.filter((task) => task.id !== taskId);
      saveTasks();
      renderTasks(tasks);
    }
  }

  function filterTasks(filterType) {
    let filteredTasks;
    switch (filterType) {
      case "pending":
        filteredTasks = tasks.filter((task) => task.status === "pending");
        break;
      case "inprogress":
        filteredTasks = tasks.filter((task) => task.status === "inprogress");
        break;
      case "completed":
        filteredTasks = tasks.filter((task) => task.status === "completed");
        break;
      default: // 'all'
        filteredTasks = tasks;
    }
    renderTasks(filteredTasks);
    updateFilterButtonStyles(filterType);
  }

  function updateFilterButtonStyles(activeButtonId) {
    allTasksButton.classList.remove("active");
    pendingTasksButton.classList.remove("active");
    inprogressTasksButton.classList.remove("active");
    completedTasksButton.classList.remove("active");
    document.getElementById(activeButtonId).classList.add("active");
  }

  function clearCompleted() {
    tasks = tasks.filter((task) => task.status !== "completed");
    saveTasks();
    renderTasks(tasks);
  }
});
