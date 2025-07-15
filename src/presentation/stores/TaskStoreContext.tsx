import React, { createContext, useContext } from 'react';
import { TaskStore } from './TaskStore';

const TaskStoreContext = createContext<TaskStore | null>(null);

export const useTaskStore = () => {
  const store = useContext(TaskStoreContext);
  if (!store) {
    throw new Error('useTaskStore must be used within a TaskStoreProvider');
  }
  return store;
};

export const TaskStoreProvider: React.FC<{ store: TaskStore; children: React.ReactNode }> = ({ store, children }) => (
  <TaskStoreContext.Provider value={store}>{children}</TaskStoreContext.Provider>
);