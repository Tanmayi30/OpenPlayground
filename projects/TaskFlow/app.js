// TaskFlow - Smart Task Organizer
const taskNameInput = document.getElementById('taskName');
const taskDeadlineInput = document.getElementById('taskDeadline');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasks');
const analyticsContent = document.getElementById('analyticsContent');
const taskPriorityInput = document.getElementById('taskPriority');
const suggestionBox = document.getElementById('suggestionBox');
const suggestTaskBtn = document.getElementById('suggestTaskBtn');

let tasks = [];

function renderTasks() {
  tasksList.innerHTML = '';
  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = `${task.completed ? 'completed' : ''} ${task.priority}`;
    li.innerHTML = `
      <span>${task.name} <small>(${task.deadline})</small> <span class="priority-tag">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span></span>
      <div>
        <button onclick="toggleComplete(${idx})">${task.completed ? 'Undo' : 'Done'}</button>
        <button onclick="deleteTask(${idx})">Delete</button>
      </div>
    `;
    tasksList.appendChild(li);
  });
  renderAnalytics();
}

function addTask() {
  const name = taskNameInput.value.trim();
  const deadline = taskDeadlineInput.value;
  const priority = taskPriorityInput.value;
  if (!name || !deadline) return;
  tasks.push({ name, deadline, completed: false, priority });
  taskNameInput.value = '';
  taskDeadlineInput.value = '';
  taskPriorityInput.value = 'normal';
  renderTasks();
}

function deleteTask(idx) {
  tasks.splice(idx, 1);
  renderTasks();
}

function toggleComplete(idx) {
  tasks[idx].completed = !tasks[idx].completed;
  renderTasks();
}

function renderAnalytics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const high = tasks.filter(t => t.priority === 'high').length;
  const low = tasks.filter(t => t.priority === 'low').length;
  analyticsContent.innerHTML = `
    <p>Total Tasks: <strong>${total}</strong></p>
    <p>Completed Tasks: <strong>${completed}</strong></p>
    <p>High Priority Tasks: <strong>${high}</strong></p>
    <p>Low Priority Tasks: <strong>${low}</strong></p>
    <p>Completion Rate: <strong>${total ? Math.round((completed/total)*100) : 0}%</strong></p>
  `;
}

// Smart suggestion: suggest a task based on incomplete high priority or deadline
function suggestTask() {
  if (tasks.length === 0) {
    suggestionBox.textContent = 'No tasks found. Add a task to get suggestions!';
    return;
  }
  // Find high priority incomplete tasks
  const highPriority = tasks.filter(t => !t.completed && t.priority === 'high');
  if (highPriority.length > 0) {
    suggestionBox.textContent = `Focus on: "${highPriority[0].name}" (High Priority)`;
    return;
  }
  // Find task with nearest deadline
  const incomplete = tasks.filter(t => !t.completed);
  if (incomplete.length > 0) {
    incomplete.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    suggestionBox.textContent = `Next up: "${incomplete[0].name}" (Due: ${incomplete[0].deadline})`;
    return;
  }
  suggestionBox.textContent = 'All tasks completed! Great job!';
}

suggestTaskBtn.addEventListener('click', suggestTask);
addTaskBtn.addEventListener('click', addTask);
renderTasks();