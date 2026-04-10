const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// In-memory task storage.
const tasks = [];
let nextTaskId = 1;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/tasks', (_req, res) => {
  return res.status(200).json({
    success: true,
    data: tasks
  });
});

app.post('/tasks', (req, res) => {
  const title = String(req.body?.title || '').trim();

  if (!title) {
    return res.status(400).json({
      success: false,
      error: 'Task title is required.'
    });
  }

  const newTask = {
    id: nextTaskId++,
    title,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);

  return res.status(201).json({
    success: true,
    data: newTask
  });
});

app.patch('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({
      success: false,
      error: 'Task id must be a valid integer.'
    });
  }

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found.'
    });
  }

  task.completed = !task.completed;

  return res.status(200).json({
    success: true,
    data: task
  });
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({
      success: false,
      error: 'Task id must be a valid integer.'
    });
  }

  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Task not found.'
    });
  }

  const [removedTask] = tasks.splice(taskIndex, 1);

  return res.status(200).json({
    success: true,
    data: removedTask
  });
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Centralized fallback for unexpected server errors.
app.use((error, _req, res, _next) => {
  console.error('Unhandled server error:', error);
  return res.status(500).json({
    success: false,
    error: 'Internal server error.'
  });
});

app.listen(PORT, () => {
  console.log(`Task Manager API running at http://localhost:${PORT}`);
});
