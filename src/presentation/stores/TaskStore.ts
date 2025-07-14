import { makeAutoObservable, runInAction } from 'mobx';
import { Task, TaskStatus } from '../../entities/Task';
import { TaskDataSource } from '../../data/TaskDataSource';

/**
 * TaskStore
 * MobX store for managing tasks using TaskDataSource.
 * Provides observable state and actions for loading, adding, updating, deleting, and filtering tasks.
 */
export class TaskStore {
  tasks: Task[] = [];
  loading: boolean = false;
  error: string | null = null;
  filterStatus: TaskStatus | null = null;
  filterDate: string | null = null;

  private dataSource: TaskDataSource;

  constructor(dataSource?: TaskDataSource) {
    this.dataSource = dataSource || new TaskDataSource();
    makeAutoObservable(this);
  }

  /**
   * Loads tasks from the data source, applying current filters if set.
   */
  async loadTasks() {
    this.loading = true;
    this.error = null;
    try {
      let tasks: Task[];
      if (this.filterStatus) {
        tasks = await this.dataSource.getAll('status', this.filterStatus);
      } else if (this.filterDate) {
        tasks = await this.dataSource.getAll('date', this.filterDate);
      } else {
        tasks = await this.dataSource.getAll();
      }
      runInAction(() => {
        this.tasks = tasks;
        this.loading = false;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message || 'Failed to load tasks';
        this.loading = false;
      });
    }
  }

  /**
   * Adds a new task and reloads the task list.
   * @param task - The Task object to add.
   */
  async addTask(task: Task) {
    this.loading = true;
    this.error = null;
    try {
      await this.dataSource.add(task);
      await this.loadTasks();
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message || 'Failed to add task';
        this.loading = false;
      });
    }
  }

  /**
   * Updates an existing task and reloads the task list.
   * @param task - The Task object with updated fields.
   */
  async updateTask(task: Task) {
    this.loading = true;
    this.error = null;
    try {
      await this.dataSource.update(task);
      await this.loadTasks();
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message || 'Failed to update task';
        this.loading = false;
      });
    }
  }

  /**
   * Updates the status of a task and reloads the task list.
   * @param id - The id of the task.
   * @param status - The new status to set.
   */
  async updateTaskStatus(id: string, status: TaskStatus) {
    this.loading = true;
    this.error = null;
    try {
      await this.dataSource.updateStatus(id, status);
      await this.loadTasks();
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message || 'Failed to update task status';
        this.loading = false;
      });
    }
  }

  /**
   * Deletes a task and reloads the task list.
   * @param id - The id of the task to delete.
   */
  async deleteTask(id: string) {
    this.loading = true;
    this.error = null;
    try {
      await this.dataSource.delete(id);
      await this.loadTasks();
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message || 'Failed to delete task';
        this.loading = false;
      });
    }
  }

  /**
   * Sets the status filter and reloads the task list.
   * @param status - The status to filter by, or null to clear the filter.
   */
  setFilterStatus(status: TaskStatus | null) {
    this.filterStatus = status;
    this.filterDate = null;
    this.loadTasks();
  }

  /**
   * Sets the date filter and reloads the task list.
   * @param date - The date (ISO string) to filter by, or null to clear the filter.
   */
  setFilterDate(date: string | null) {
    this.filterDate = date;
    this.filterStatus = null;
    this.loadTasks();
  }

  /**
   * Clears all filters and reloads the task list.
   */
  clearFilters() {
    this.filterStatus = null;
    this.filterDate = null;
    this.loadTasks();
  }
} 