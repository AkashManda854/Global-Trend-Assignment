const API_BASE_URL = 'http://localhost:5000';

const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitleInput');
const taskList = document.getElementById('taskList');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const emptyState = document.getElementById('emptyState');

function setLoading(isLoading) {
  loadingState.classList.toggle('hidden', !isLoading);
}

function showError(message) {
  errorState.textContent = message;
  errorState.classList.remove('hidden');
}

function clearError() {
  errorState.textContent = '';
  errorState.classList.add('hidden');
}

function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (!tasks.length) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  tasks.forEach((task) => {
    const listItem = document.createElement('li');
    listItem.className = 'task-item';

    const titleButton = document.createElement('button');
    titleButton.className = `task-title ${task.completed ? 'completed' : ''}`;
    titleButton.textContent = task.title;
    titleButton.setAttribute('type', 'button');
    titleButton.title = 'Toggle completion';
    titleButton.addEventListener('click', async () => {
      await toggleTask(task.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('type', 'button');
    deleteButton.addEventListener('click', async () => {
      await deleteTask(task.id);
    });

    listItem.appendChild(titleButton);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
  });
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || 'Request failed.');
  }

  return body;
}

async function loadTasks() {
  setLoading(true);
  clearError();

  try {
    const result = await request('/tasks');
    renderTasks(result.data || []);
  } catch (error) {
    showError(error.message || 'Failed to load tasks.');
  } finally {
    setLoading(false);
  }
}

async function addTask(title) {
  await request('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });
}

async function toggleTask(id) {
  clearError();

  try {
    await request(`/tasks/${id}`, { method: 'PATCH' });
    await loadTasks();
  } catch (error) {
    showError(error.message || 'Failed to update task.');
  }
}

async function deleteTask(id) {
  clearError();

  try {
    await request(`/tasks/${id}`, { method: 'DELETE' });
    await loadTasks();
  } catch (error) {
    showError(error.message || 'Failed to delete task.');
  }
}

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearError();

  const title = taskTitleInput.value.trim();

  if (!title) {
    showError('Task title is required.');
    return;
  }

  try {
    await addTask(title);
    taskForm.reset();
    taskTitleInput.focus();
    await loadTasks();
  } catch (error) {
    showError(error.message || 'Failed to add task.');
  }
});

loadTasks();
