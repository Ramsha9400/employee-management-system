# Employee Management System

A full-stack employee directory: **React + Vite** frontend and an **Express** REST API.

## Features

- Full CRUD for employees, with server-side validation
- Search, department and status filters, sortable columns, pagination
- Live dashboard stats and department headcount chart
- Duplicate email protection
- Light and dark theme (remembered in the browser)
- Data persisted to `server/data/employees.json`. The app starts empty, with no hardcoded or sample records, and data survives page refreshes and server restarts.
- Employee IDs come from a server-side counter, so they are never reused or duplicated after a delete.

## Getting started

```bash
# 1. Install dependencies for frontend and backend
npm run setup

# 2. Start everything (API on http://localhost:5001 + frontend on http://localhost:5173)
npm run dev
```

## Troubleshooting

- **502 / "Backend chal nahi rahi":** the API is not running. `npm run dev` starts both the API and the frontend, so check the `[API]` lines in the terminal for errors. Run `npm run setup` first if you have not installed dependencies.
- **Port already in use:** another program is using port 5001. Run the API on another port and set the same value for the frontend:
  - Windows (PowerShell): `$env:API_PORT=5050; npm run dev`
  - macOS/Linux: `API_PORT=5050 npm run dev`

## API

| Method | Endpoint                 | Description                                   |
| ------ | ------------------------ | --------------------------------------------- |
| GET    | `/api/employees`         | List. Query: `search, department, status, sort, order, page, limit` |
| GET    | `/api/employees/:id`     | Get one employee                              |
| POST   | `/api/employees`         | Create                                        |
| PUT    | `/api/employees/:id`     | Update                                        |
| DELETE | `/api/employees/:id`     | Delete                                        |
| GET    | `/api/stats`             | Totals, status and department breakdown       |
| GET    | `/api/health`            | Health check                                  |

Validation errors return `422` with an `errors` object keyed by field name.
