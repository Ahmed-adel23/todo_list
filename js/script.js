let submitBtn = document.getElementById("add-task-btn");
let taskInput = document.getElementById("task-input");
let tasksContainer = document.querySelector(".divs");
let allTasks = getTasks();
taskInput.focus();

let isInitialLoad = true;
let lastAnimatedTaskId = null;

// --- LocalStorage Functions ---
function getTasks() {
  const tasks = localStorage.getItem("tasks") || "[]";
  return JSON.parse(tasks);
}

function saveTasks() {
  const task = JSON.stringify(allTasks);
  localStorage.setItem("tasks", task);
}

// --- Task Management Functions ---
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (taskInput.value.trim()) {
    addTask(taskInput.value.trim());
    taskInput.value = "";
    taskInput.focus();
  }
});

function addTask(taskText) {
  const newTaskId = Date.now();
  const newTask = {
    id: newTaskId,
    text: taskText,
    checked: false,
  };
  allTasks.push(newTask);
  saveTasks();
  
  lastAnimatedTaskId = newTaskId; 
  isInitialLoad = false; 
  updateTasks();
}

function deleteTask(taskId) {
  allTasks = allTasks.filter((task) => task.id !== taskId);
  saveTasks();
  if (lastAnimatedTaskId === taskId) {
      lastAnimatedTaskId = null;
  }
  updateTasks();
}

function toggleCheck(taskId) {
  const taskIndex = allTasks.findIndex((task) => task.id === taskId);
  if (taskIndex > -1) {
    allTasks[taskIndex].checked = !allTasks[taskIndex].checked;
    saveTasks();
    updateTasks();
  }
}

// --- Create Task Functions ---
function createDivTask(task, addAnimation) {
  const checkedClasses = "bg-green-700/70 opacity-90";
  const uncheckedClasses = "bg-gray-700 hover:bg-gray-600";
  const animationClass = addAnimation ? "animate__fadeInLeft" : ""; 
  
  const divTask = document.createElement("div");
  
  const baseClasses = `flex task items-center justify-between p-3 rounded-xl transition duration-300 shadow-lg border-b border-gray-700 ${animationClass}`;
  
  divTask.className = `w-full animate__animated ${task.checked ? checkedClasses : uncheckedClasses} ${baseClasses}`;
  
  const textDecoration = task.checked ? "line-through" : "none";
  
  divTask.innerHTML = `
    <div class="flex items-center flex-grow min-w-0">
        <input type="checkbox" id="task-${task.id}" class="form-checkbox h-5 w-5 text-green-500 rounded border-gray-500 cursor-pointer focus:ring-green-500 mr-3" ${task.checked ? 'checked' : ''}>
        
        <h4 class="flex-grow text-xl text-white taskName truncate" style="text-decoration: ${textDecoration};">${task.text}</h4>
    </div>
    <button class="rounded-md btn cursor-pointer text-white hover:text-red-500 p-2 ml-2" data-task-id="${task.id}">
        <i class="fa fa-trash-can h-4 w-5"></i>
    </button>
  `;
    const deleteButton = divTask.querySelector(".btn");
  const checkbox = divTask.querySelector(`#task-${task.id}`);

  deleteButton.addEventListener("click", () => {
    divTask.classList.add('animate__fadeOutRight');
    setTimeout(() => {
        deleteTask(task.id);
    }, 500); 
  });

  checkbox.addEventListener("change", () => {
    toggleCheck(task.id);
  });
  
  return divTask;
}

// ---- Update Function --------
function updateTasks() {
  tasksContainer.innerHTML = "";
  const sortedTasks = allTasks.sort((a, b) => (a.checked === b.checked) ? 0 : a.checked ? 1 : -1);

  sortedTasks.forEach((task) => {
    let shouldAnimate = false;
    
    if (isInitialLoad || task.id === lastAnimatedTaskId) {
        shouldAnimate = true;
    }

    const taskElement = createDivTask(task, shouldAnimate);
    tasksContainer.append(taskElement);
  });
  
  isInitialLoad = false;
  lastAnimatedTaskId = null;
}

// Initial load of tasks
updateTasks();