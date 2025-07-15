import { useEffect } from 'react';
import { useTaskStore } from '../stores/TaskStoreContext';

export const useTasks = () => {
    const taskStore = useTaskStore();
  
    useEffect(() => {
      taskStore.loadTasks();
    }, [taskStore]);
  
    return {
      tasks: taskStore.tasks,
      allTasks: taskStore.tasks,
      loading: taskStore.loading,
      error: taskStore.error,
      addTask: taskStore.addTask,
      updateTask: taskStore.updateTask,
      deleteTask: taskStore.deleteTask,
      setFilterStatus: taskStore.setFilterStatus,
      setFilterDate: taskStore.setFilterDate,
      clearFilters: taskStore.clearFilters,
    };
  };