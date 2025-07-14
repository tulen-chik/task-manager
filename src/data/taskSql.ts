// SQL to create the statuses table
export const CREATE_STATUSES_TABLE = `
  CREATE TABLE IF NOT EXISTS statuses (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE
  )
`;

// SQL to insert default statuses
export const INSERT_DEFAULT_STATUSES = [
  `INSERT OR IGNORE INTO statuses (id, name) VALUES ('in_progress', 'in_progress')`,
  `INSERT OR IGNORE INTO statuses (id, name) VALUES ('completed', 'completed')`,
  `INSERT OR IGNORE INTO statuses (id, name) VALUES ('cancelled', 'cancelled')`
];

// SQL to create the tasks table with a foreign key to statuses
export const CREATE_TASKS_TABLE = `
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    dateTime TEXT NOT NULL,
    location TEXT,
    status_id TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (status_id) REFERENCES statuses(id)
  )
`;

export const SELECT_ALL_TASKS = `
  SELECT tasks.*, statuses.name as status
  FROM tasks
  JOIN statuses ON tasks.status_id = statuses.id
  ORDER BY createdAt ASC
`;

export const SELECT_TASKS_BY_STATUS = `
  SELECT tasks.*, statuses.name as status
  FROM tasks
  JOIN statuses ON tasks.status_id = statuses.id
  WHERE statuses.name = ?
  ORDER BY createdAt ASC
`;

export const SELECT_TASKS_BY_DATE = `
  SELECT tasks.*, statuses.name as status
  FROM tasks
  JOIN statuses ON tasks.status_id = statuses.id
  WHERE dateTime = ?
  ORDER BY createdAt ASC
`;

export const SELECT_TASK_BY_ID = `
  SELECT tasks.*, statuses.name as status
  FROM tasks
  JOIN statuses ON tasks.status_id = statuses.id
  WHERE tasks.id = ?
`;

export const INSERT_TASK = `
  INSERT INTO tasks (id, title, description, dateTime, location, status_id, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

export const UPDATE_TASK_STATUS = `
  UPDATE tasks SET status_id = ? WHERE id = ?
`;

export const UPDATE_TASK = `
  UPDATE tasks SET title = ?, description = ?, dateTime = ?, location = ?, status_id = ? WHERE id = ?
`;

export const DELETE_TASK = 'DELETE FROM tasks WHERE id = ?'; 