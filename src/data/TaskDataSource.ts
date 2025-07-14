/**
 * TaskDataSource
 * Implements TaskRepository for working with tasks in a SQLite database.
 * Provides CRUD operations and filtering for tasks.
 * Now uses a separate statuses table and links tasks.status_id to statuses.id.
 */
import SQLite from 'react-native-sqlite-storage';
import { Task, TaskStatus } from '../entities/Task';
import { TaskRepository } from '../repositories/TaskRepository';
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

/**
 * Opens a SQLite database with the given name.
 * @param name - The name of the database file (e.g., 'tasks.db' or ':memory:').
 * @returns The opened database instance.
 */
function openDb(name: string) {
  return SQLite.openDatabase({ name, location: 'default' }, () => {}, (err) => { if (err) console.error(err); });
}

/**
 * Executes a SQL query on the provided database.
 * @param db - The SQLite database instance.
 * @param sql - The SQL query string.
 * @param params - The parameters for the SQL query.
 * @returns A Promise resolving to the query result.
 */
function runQuery<T = any>(db: any, sql: string, params: any[] = []): Promise<T> {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        sql,
        params,
        (_: any, result: any) => resolve(result as any),
        (_: any, error: any) => { reject(error); return false; }
      );
    });
  });
}

/**
 * Generates a unique string id based on the current timestamp and random value.
 * @returns A unique string id.
 */
function generateId() {
  return Date.now().toString() + Math.random().toString(36).slice(2);
}

/**
 * TaskDataSource
 * Implements TaskRepository for working with tasks in a SQLite database.
 * Provides CRUD operations and filtering for tasks.
 */
export class TaskDataSource implements TaskRepository {
  private db: any;

  /**
   * Creates a new TaskDataSource instance, initializes the statuses and tasks tables, and inserts default statuses.
   * @param dbName - The name of the database file (default: 'tasks.db').
   */
  constructor(dbName: string = 'tasks.db') {
    this.db = openDb(dbName);
    this.db.transaction((tx: any) => {
      tx.executeSql(CREATE_STATUSES_TABLE);
      for (const sql of INSERT_DEFAULT_STATUSES) {
        tx.executeSql(sql);
      }
      tx.executeSql(CREATE_TASKS_TABLE);
    });
  }

  /**
   * getAll
   * Retrieves all tasks, optionally filtered by status or date.
   * @param sortBy - 'date' or 'status' to filter by.
   * @param filterValue - The value to filter by (status or dateTime).
   * @returns Promise resolving to an array of Task objects.
   */
  async getAll(sortBy?: 'date' | 'status', filterValue?: string): Promise<Task[]> {
    let sql = SELECT_ALL_TASKS;
    let params: any[] = [];
    if (sortBy === 'status' && filterValue) {
      sql = SELECT_TASKS_BY_STATUS;
      params = [filterValue];
    } else if (sortBy === 'date' && filterValue) {
      sql = SELECT_TASKS_BY_DATE;
      params = [filterValue];
    }
    const result: any = await runQuery(this.db, sql, params);
    const tasks: Task[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      tasks.push({
        id: row.id,
        title: row.title,
        description: row.description,
        dateTime: row.dateTime,
        location: row.location,
        status: row.status as TaskStatus,
        createdAt: row.createdAt,
      });
    }
    return tasks;
  }

  /**
   * getById
   * Retrieves a task by its id.
   * @param id - The id of the task.
   * @returns Promise resolving to the Task object or null if not found.
   */
  async getById(id: string): Promise<Task | null> {
    const result: any = await runQuery(this.db, SELECT_TASK_BY_ID, [id]);
    if (result.rows.length > 0) {
      const row = result.rows.item(0);
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        dateTime: row.dateTime,
        location: row.location,
        status: row.status as TaskStatus,
        createdAt: row.createdAt,
      };
    }
    return null;
  }

  /**
   * add
   * Adds a new task to the database.
   * @param task - The Task object to add. If id or createdAt are missing, they will be generated.
   * @returns Promise resolving when the task is added.
   */
  async add(task: Task): Promise<void> {
    const id = task.id || generateId();
    const createdAt = task.createdAt || new Date().toISOString();
    await runQuery(this.db, INSERT_TASK, [id, task.title, task.description, task.dateTime, task.location, task.status, createdAt]);
  }

  /**
   * updateStatus
   * Updates the status of a task by id.
   * @param id - The id of the task.
   * @param status - The new status to set.
   * @returns Promise resolving when the status is updated.
   */
  async updateStatus(id: string, status: TaskStatus): Promise<void> {
    await runQuery(this.db, UPDATE_TASK_STATUS, [status, id]);
  }

  /**
   * update
   * Updates all fields of a task by id.
   * @param task - The Task object with updated fields (must include id).
   * @returns Promise resolving when the task is updated.
   */
  async update(task: Task): Promise<void> {
    await runQuery(this.db, UPDATE_TASK, [task.title, task.description, task.dateTime, task.location, task.status, task.id]);
  }

  /**
   * delete
   * Deletes a task by id.
   * @param id - The id of the task to delete.
   * @returns Promise resolving when the task is deleted.
   */
  async delete(id: string): Promise<void> {
    await runQuery(this.db, DELETE_TASK, [id]);
  }

  /**
   * clearAll
   * Deletes all tasks from the database. Used for testing.
   * @returns Promise resolving when all tasks are deleted.
   */
  async clearAll(): Promise<void> {
    await runQuery(this.db, 'DELETE FROM tasks');
  }
} 