/* =============================================
   TaskFlow - Modern To-Do List JavaScript
   ============================================= */

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCount = document.querySelector('.task-count');
const completedCount = document.querySelector('.completed-count');
const progressBar = document.getElementById('progressBar');

// Initialize tasks from localStorage or start fresh
let tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || [];

// Render all tasks from the tasks array
function renderTasks() {
  // Clear existing tasks
  taskList.innerHTML = '';

  // If no tasks, show empty state
  if (tasks.length === 0) {
    emptyState.style.display = 'flex';
    taskList.style.display = 'none';
    updateStats();
    return;
  }

  emptyState.style.display = 'none';
  taskList.style.display = 'block';

  tasks.forEach((task, index) => {
    const taskElement = createTaskElement(task.text, task.completed, index);
    taskList.appendChild(taskElement);
  });

  updateStats();
}

// Create single task list item
function createTaskElement(text, isCompleted = false, index) {
  const li = document.createElement('li');
  li.className = `task-item${isCompleted ? ' completed' : ''}`;
  li.setAttribute('data-index', index);

  const checkbox = document.createElement('div');
  checkbox.className = 'checkbox' + (isCompleted ? ' checked' : '');
  checkbox.addEventListener('click', () => toggleTask(index));

  const taskText = document.createElement('span');
  taskText.className = 'task-text';
  taskText.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteTask(index);
  });

  li.appendChild(checkbox);
  li.appendChild(taskText);
  li.appendChild(deleteBtn);

  return li;
}

// Toggle task completion status
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
  saveTasks();
}

// Delete task from list
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
  saveTasks();
}

// Add new task
function addTask() {
  const text = taskInput.value.trim();

  if (text === '') {
    // Indicate error by briefly changing input border
    taskInput.style.borderColor = '#f87171';
    taskInput.style.transform = 'translateX(-4px)';
    setTimeout(() => {
      taskInput.style.borderColor = '';
      taskInput.style.transform = '';
    }, 150);
    return;
  }

  tasks.push({ text, completed: false });
  taskInput.value = '';
  renderTasks();
  saveTasks();
}

// Update task counters and progress bar
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;

  taskCount.textContent = `${total} tasks`;
  completedCount.textContent = `${completed} completed`;

  // Update progress bar
  const progress = total > 0 ? (completed / total) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute('aria-valuenow', Math.round(progress));
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}

// Event Listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Initial render
renderTasks();