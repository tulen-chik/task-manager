/**
 * TaskStatus
 * Represents the possible statuses for a task.
 * - 'pending': Task is not started yet
 * - 'in_progress': Task is currently being worked on
 * - 'completed': Task is finished
 * - 'cancelled': Task was cancelled and will not be completed
 */
export type TaskStatus = 'in_progress' | 'completed' | 'cancelled';

/**
 * Task
 * Represents a task entity with all its properties.
 * @property id - Unique identifier for the task
 * @property title - Title of the task
 * @property description - Detailed description of the task
 * @property dateTime - Date and time when the task is scheduled (ISO string)
 * @property location - Location/address for the task
 * @property status - Current status of the task (see TaskStatus)
 * @property createdAt - Date and time when the task was created (ISO string)
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  status: TaskStatus;
  createdAt: string;
} 