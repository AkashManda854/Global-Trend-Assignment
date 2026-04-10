# Task Manager (Full Stack)

A simple Task Manager application built with Node.js + Express on the backend and HTML/CSS/JavaScript on the frontend.

## Features

- In-memory task storage
- Create, list, toggle, and delete tasks
- Validation and JSON error handling
- Minimal frontend with loading and error states
- Fetch API communication between frontend and backend

## Folder Structure

```text
inventory-search-app/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── inventory.json
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── README.md
```

## Setup

1. Open a terminal in `inventory-search-app/backend`.
2. Install dependencies:

```bash
npm install
```

3. Start the backend server:

```bash
npm start
```

4. Open `http://localhost:5000` in your browser.

## API Endpoints

Base URL:

```text
http://localhost:5000
```

### GET /tasks

Returns all tasks.

Success response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "completed": false,
      "createdAt": "2026-04-10T12:30:00.000Z"
    }
  ]
}
```

### POST /tasks

Creates a new task.

Request body:

```json
{
  "title": "Finish assignment"
}
```

Validation:

- `title` is required.

### PATCH /tasks/:id

Toggles task completion (`completed` true/false).

### DELETE /tasks/:id

Deletes a task by id.

## Notes

- Tasks are stored in memory and reset when the server restarts.
- The frontend is served by Express from `frontend/`.
