/**
 * TaskRepository
 * Interface for a repository that manages Task entities.
 * Provides methods for CRUD operations and filtering.
 */
import { Task, TaskStatus } from '../entities/Task';

export interface TaskRepository {
  /**
   * getAll
   * Retrieves all tasks, optionally sorted by date or status.
   * @param sortBy - Optional, 'date' or 'status' to sort/filter tasks.
   * @returns Promise resolving to an array of Task objects.
   */
  getAll(sortBy?: 'date' | 'status'): Promise<Task[]>;

  /**
   * getById
   * Retrieves a task by its id.
   * @param id - The id of the task.
   * @returns Promise resolving to the Task object or null if not found.
   */
  getById(id: string): Promise<Task | null>;

  /**
   * add
   * Adds a new task to the repository.
   * @param task - The Task object to add.
   * @returns Promise resolving when the task is added.
   */
  add(task: Task): Promise<void>;

  /**
   * updateStatus
   * Updates the status of a task by id.
   * @param id - The id of the task.
   * @param status - The new status to set.
   * @returns Promise resolving when the status is updated.
   */
  updateStatus(id: string, status: TaskStatus): Promise<void>;

  /**
   * update
   * Updates all fields of a task by id.
   * @param task - The Task object with updated fields (must include id).
   * @returns Promise resolving when the task is updated.
   */
  update(task: Task): Promise<void>;

  /**
   * delete
   * Deletes a task by id.
   * @param id - The id of the task to delete.
   * @returns Promise resolving when the task is deleted.
   */
  delete(id: string): Promise<void>;
} 