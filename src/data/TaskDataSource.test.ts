import sqlite3 from 'sqlite3';
import { Task, TaskStatus } from '../entities/Task';
import {
  CREATE_STATUSES_TABLE,
  INSERT_DEFAULT_STATUSES,
  CREATE_TASKS_TABLE,
  SELECT_ALL_TASKS,
  SELECT_TASKS_BY_STATUS,
  SELECT_TASKS_BY_DATE,
  SELECT_TASK_BY_ID,
  INSERT_TASK,
  UPDATE_TASK_STATUS,
  UPDATE_TASK,
  DELETE_TASK
} from './taskSql';

function generateId() {
  return Date.now().toString() + Math.random().toString(36).slice(2);
}

const DEFAULT_STATUS: TaskStatus = 'in_progress';

/**
 * Helper to initialize statuses and tasks tables with default statuses
 */
function setupDb(db: sqlite3.Database, done: () => void) {
  db.serialize(() => {
    db.run(CREATE_STATUSES_TABLE, [], () => {
      let inserted = 0;
      for (const sql of INSERT_DEFAULT_STATUSES) {
        db.run(sql, [], () => {
          inserted++;
          if (inserted === INSERT_DEFAULT_STATUSES.length) {
            db.run(CREATE_TASKS_TABLE, [], done);
          }
        });
      }
    });
  });
}

describe('TaskDataSource (sqlite3 in-memory, with statuses table)', () => {
  let db: sqlite3.Database;
  let task: Task;

  beforeEach(done => {
    db = new sqlite3.Database(':memory:');
    setupDb(db, () => {
      task = {
        id: generateId(),
        title: 'Test Task',
        description: 'Description',
        dateTime: new Date().toISOString(),
        location: 'Test Location',
        status: DEFAULT_STATUS,
        createdAt: new Date().toISOString(),
      };
      done();
    });
  });

  afterEach(done => {
    db.close(done);
  });

  describe('CRUD operations', () => {
    /**
     * Checks that a task is correctly inserted into the database and can be retrieved via SELECT *.
     */
    it('should add and get a task', done => {
      db.run(INSERT_TASK, [task.id, task.title, task.description, task.dateTime, task.location, task.status, task.createdAt], err => {
        expect(err).toBeNull();
        db.all(SELECT_ALL_TASKS, [], (err2, rows) => {
          expect(err2).toBeNull();
          expect(rows.length).toBe(1);
          expect(rows[0].title).toBe('Test Task');
          expect(rows[0].description).toBe('Description');
          expect(rows[0].status).toBe(DEFAULT_STATUS);
          done();
        });
      });
    });

    /**
     * Checks that a task can be found by id after insertion.
     */
    it('should get a task by id', done => {
      db.run(INSERT_TASK, [task.id, task.title, task.description, task.dateTime, task.location, task.status, task.createdAt], err => {
        expect(err).toBeNull();
        db.get(SELECT_TASK_BY_ID, [task.id], (err2, row) => {
          expect(err2).toBeNull();
          expect(row).not.toBeNull();
          expect(row.id).toBe(task.id);
          expect(row.title).toBe(task.title);
          expect(row.status).toBe(DEFAULT_STATUS);
          done();
        });
      });
    });

    /**
     * Checks that querying a non-existent id returns undefined (null).
     */
    it('should return null for non-existent id', done => {
      db.get(SELECT_TASK_BY_ID, ['nonexistent'], (err, row) => {
        expect(err).toBeNull();
        expect(row).toBeUndefined();
        done();
      });
    });

    /**
     * Checks that a task can be updated (e.g., title changed).
     */
    it('should update a task', done => {
      db.run(INSERT_TASK, [task.id, task.title, task.description, task.dateTime, task.location, task.status, task.createdAt], err => {
        expect(err).toBeNull();
        const updatedTitle = 'Updated Title';
        db.run(UPDATE_TASK, [updatedTitle, task.description, task.dateTime, task.location, task.status, task.id], err2 => {
          expect(err2).toBeNull();
          db.get(SELECT_TASK_BY_ID, [task.id], (err3, row) => {
            expect(row.title).toBe(updatedTitle);
            expect(row.status).toBe(DEFAULT_STATUS);
            done();
          });
        });
      });
    });

    /**
     * Checks that updating a non-existent task does not throw and does not create a new record.
     */
    it('should not update a non-existent task', done => {
      db.run(UPDATE_TASK, ['NoTitle', 'NoDesc', '2024-01-01', 'NoLoc', DEFAULT_STATUS, 'nonexistent'], err => {
        expect(err).toBeNull();
        db.get(SELECT_TASK_BY_ID, ['nonexistent'], (err2, row) => {
          expect(row).toBeUndefined();
          done();
        });
      });
    });

    /**
     * Checks that a task's status can be updated.
     */
    it('should update task status', done => {
      db.run(INSERT_TASK, [task.id, task.title, task.description, task.dateTime, task.location, task.status, task.createdAt], err => {
        expect(err).toBeNull();
        db.run(UPDATE_TASK_STATUS, ['completed', task.id], err2 => {
          expect(err2).toBeNull();
          db.get(SELECT_TASK_BY_ID, [task.id], (err3, row) => {
            expect(row.status).toBe('completed');
            done();
          });
        });
      });
    });

    /**
     * Checks that updating the status of a non-existent task does not throw.
     */
    it('should not update status for non-existent task', done => {
      db.run(UPDATE_TASK_STATUS, ['completed', 'nonexistent'], err => {
        expect(err).toBeNull();
        db.get(SELECT_TASK_BY_ID, ['nonexistent'], (err2, row) => {
          expect(row).toBeUndefined();
          done();
        });
      });
    });

    /**
     * Checks that a task can be deleted from the database.
     */
    it('should delete a task', done => {
      db.run(INSERT_TASK, [task.id, task.title, task.description, task.dateTime, task.location, task.status, task.createdAt], err => {
        expect(err).toBeNull();
        db.run(DELETE_TASK, [task.id], err2 => {
          expect(err2).toBeNull();
          db.all(SELECT_ALL_TASKS, [], (err3, rows) => {
            expect(rows.length).toBe(0);
            done();
          });
        });
      });
    });

    /**
     * Checks that deleting a non-existent task does not throw and does not affect the database.
     */
    it('should not delete a non-existent task', done => {
      db.run(DELETE_TASK, ['nonexistent'], err => {
        expect(err).toBeNull();
        db.all(SELECT_ALL_TASKS, [], (err2, rows) => {
          expect(rows.length).toBe(0);
          done();
        });
      });
    });
  });

  describe('Validation and constraints', () => {
    /**
     * Checks that inserting a task with a duplicate id (PRIMARY KEY violation) is not allowed.
     */
    it('should not allow duplicate id', done => {
      db.run(INSERT_TASK, [task.id, task.title, task.description, task.dateTime, task.location, task.status, task.createdAt], err => {
        expect(err).toBeNull();
        db.run(INSERT_TASK, [task.id, 'Another', '', '', '', DEFAULT_STATUS, task.createdAt], err2 => {
          expect(err2).not.toBeNull();
          done();
        });
      });
    });

    /**
     * Checks that inserting a task with null title (NOT NULL violation) is not allowed.
     */
    it('should not allow null title', done => {
      db.run(INSERT_TASK, [generateId(), null, '', '', '', DEFAULT_STATUS, new Date().toISOString()], err => {
        expect(err).not.toBeNull();
        done();
      });
    });

    /**
     * Checks that a task can be inserted with empty description and location fields.
     */
    it('should allow empty description and location', done => {
      const id = generateId();
      db.run(INSERT_TASK, [id, 'Title', '', new Date().toISOString(), '', DEFAULT_STATUS, new Date().toISOString()], err => {
        expect(err).toBeNull();
        db.get(SELECT_TASK_BY_ID, [id], (err2, row) => {
          expect(row).not.toBeNull();
          expect(row.description).toBe('');
          expect(row.location).toBe('');
          expect(row.status).toBe(DEFAULT_STATUS);
          done();
        });
      });
    });

    /**
     * Checks that inserting a task with null status (NOT NULL violation) is not allowed.
     */
    it('should not allow null status', done => {
      db.run(INSERT_TASK, [generateId(), 'Title', '', new Date().toISOString(), '', null, new Date().toISOString()], err => {
        expect(err).not.toBeNull();
        done();
      });
    });
  });

  describe('Filtering', () => {
    /**
     * Checks filtering tasks by status using a SQL query with WHERE status.
     */
    it('should filter tasks by status using SQL', done => {
      const task2 = { ...task, id: generateId(), status: 'completed' as TaskStatus };
      db.run(INSERT_TASK, [task.id, task.title, task.description, task.dateTime, task.location, task.status, task.createdAt], err => {
        expect(err).toBeNull();
        db.run(INSERT_TASK, [task2.id, task2.title, task2.description, task2.dateTime, task2.location, task2.status, task2.createdAt], err2 => {
          expect(err2).toBeNull();
          db.all(SELECT_TASKS_BY_STATUS, [DEFAULT_STATUS], (err3, rows) => {
            expect(rows.length).toBe(1);
            expect(rows[0].status).toBe(DEFAULT_STATUS);
            db.all(SELECT_TASKS_BY_STATUS, ['completed'], (err4, rows2) => {
              expect(rows2.length).toBe(1);
              expect(rows2[0].status).toBe('completed');
              done();
            });
          });
        });
      });
    });

    /**
     * Checks filtering tasks by date using a SQL query with WHERE dateTime.
     */
    it('should filter tasks by date using SQL', done => {
      const date = new Date().toISOString();
      const task2 = { ...task, id: generateId(), dateTime: date };
      db.run(INSERT_TASK, [task.id, task.title, task.description, task.dateTime, task.location, task.status, task.createdAt], err => {
        expect(err).toBeNull();
        db.run(INSERT_TASK, [task2.id, task2.title, task2.description, date, task2.location, task2.status, task2.createdAt], err2 => {
          expect(err2).toBeNull();
          db.all(SELECT_TASKS_BY_DATE, [date], (err3, rows) => {
            expect(rows.some(t => t.id === task2.id)).toBe(true);
            done();
          });
        });
      });
    });
  });
});
