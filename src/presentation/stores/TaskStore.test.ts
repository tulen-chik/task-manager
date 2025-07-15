import { TaskStore } from './TaskStore';
import { Task, TaskStatus } from '../../entities/Task';
import { act } from 'react-test-renderer';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Desc 1',
    dateTime: '2024-06-01T10:00:00Z',
    location: 'Loc 1',
    status: 'in_progress',
    createdAt: '2024-06-01T09:00:00Z',
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Desc 2',
    dateTime: '2024-06-02T10:00:00Z',
    location: 'Loc 2',
    status: 'completed',
    createdAt: '2024-06-02T09:00:00Z',
  },
];

describe('TaskStore', () => {
  let store: TaskStore;
  let dataSource: any;

  beforeEach(() => {
    dataSource = {
      getAll: jest.fn().mockResolvedValue(mockTasks),
      add: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      updateStatus: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    store = new TaskStore(dataSource);
  });

  it('loads tasks', async () => {
    await act(async () => {
      await store.loadTasks();
    });
    expect(store.tasks).toEqual(mockTasks);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(dataSource.getAll).toHaveBeenCalled();
  });

  it('adds a task and reloads', async () => {
    const newTask: Task = { ...mockTasks[0], id: '3', title: 'Task 3' };
    dataSource.add.mockResolvedValue(undefined);
    dataSource.getAll.mockResolvedValue([...mockTasks, newTask]);
    await act(async () => {
      await store.addTask(newTask);
    });
    expect(dataSource.add).toHaveBeenCalledWith(newTask);
    expect(store.tasks).toContainEqual(newTask);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('updates a task and reloads', async () => {
    const updatedTask = { ...mockTasks[0], title: 'Updated' };
    dataSource.update.mockResolvedValue(undefined);
    dataSource.getAll.mockResolvedValue([updatedTask, mockTasks[1]]);
    await act(async () => {
      await store.updateTask(updatedTask);
    });
    expect(dataSource.update).toHaveBeenCalledWith(updatedTask);
    expect(store.tasks[0].title).toBe('Updated');
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('updates task status and reloads', async () => {
    dataSource.updateStatus.mockResolvedValue(undefined);
    dataSource.getAll.mockResolvedValue([
      { ...mockTasks[0], status: 'completed' as TaskStatus },
      mockTasks[1],
    ]);
    await act(async () => {
      await store.updateTaskStatus('1', 'completed');
    });
    expect(dataSource.updateStatus).toHaveBeenCalledWith('1', 'completed');
    expect(store.tasks[0].status).toBe('completed');
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('deletes a task and reloads', async () => {
    dataSource.delete.mockResolvedValue(undefined);
    dataSource.getAll.mockResolvedValue([mockTasks[1]]);
    await act(async () => {
      await store.deleteTask('1');
    });
    expect(dataSource.delete).toHaveBeenCalledWith('1');
    expect(store.tasks).toEqual([mockTasks[1]]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('sets status filter and reloads', async () => {
    dataSource.getAll.mockResolvedValue([mockTasks[1]]);
    await act(async () => {
      store.setFilterStatus('completed');
    });
    expect(store.filterStatus).toBe('completed');
    expect(store.filterDate).toBeNull();
    expect(store.tasks).toEqual([mockTasks[1]]);
    expect(dataSource.getAll).toHaveBeenCalledWith('status', 'completed');
  });

  it('sets date filter and reloads', async () => {
    dataSource.getAll.mockResolvedValue([mockTasks[0]]);
    await act(async () => {
      store.setFilterDate('2024-06-01T10:00:00Z');
    });
    expect(store.filterDate).toBe('2024-06-01T10:00:00Z');
    expect(store.filterStatus).toBeNull();
    expect(store.tasks).toEqual([mockTasks[0]]);
    expect(dataSource.getAll).toHaveBeenCalledWith('date', '2024-06-01T10:00:00Z');
  });

  it('clears filters and reloads', async () => {
    dataSource.getAll.mockResolvedValue(mockTasks);
    await act(async () => {
      store.clearFilters();
    });
    expect(store.filterStatus).toBeNull();
    expect(store.filterDate).toBeNull();
    expect(store.tasks).toEqual(mockTasks);
    expect(dataSource.getAll).toHaveBeenCalled();
  });

  it('handles errors on load', async () => {
    dataSource.getAll.mockRejectedValue(new Error('fail'));
    await act(async () => {
      await store.loadTasks();
    });
    expect(store.error).toBe('fail');
    expect(store.loading).toBe(false);
  });

  it('handles errors on add', async () => {
    dataSource.add.mockRejectedValue(new Error('fail add'));
    await act(async () => {
      await store.addTask(mockTasks[0]);
    });
    expect(store.error).toBe('fail add');
    expect(store.loading).toBe(false);
  });

  it('handles errors on update', async () => {
    dataSource.update.mockRejectedValue(new Error('fail update'));
    await act(async () => {
      await store.updateTask(mockTasks[0]);
    });
    expect(store.error).toBe('fail update');
    expect(store.loading).toBe(false);
  });

  it('handles errors on updateStatus', async () => {
    dataSource.updateStatus.mockRejectedValue(new Error('fail status'));
    await act(async () => {
      await store.updateTaskStatus('1', 'completed');
    });
    expect(store.error).toBe('fail status');
    expect(store.loading).toBe(false);
  });

  it('handles errors on delete', async () => {
    dataSource.delete.mockRejectedValue(new Error('fail delete'));
    await act(async () => {
      await store.deleteTask('1');
    });
    expect(store.error).toBe('fail delete');
    expect(store.loading).toBe(false);
  });
}); 