import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskStoreProvider, useTaskStore } from './TaskStoreContext';
import { TaskStore } from './TaskStore';
import { Text } from 'react-native';

jest.mock('react-native-sqlite-storage');

// Helper component to test access to the store via the context
const TestComponent = () => {
  const store = useTaskStore();
  return <Text>{store ? 'Store is available' : 'No store'}</Text>;
};

describe('TaskStoreContext', () => {
  // Test that using the hook outside the provider throws an error
  it('throws error if used outside provider', () => {
    expect(() => render(<TestComponent />)).toThrow(
      'useTaskStore must be used within a TaskStoreProvider'
    );
  });

  // Test that the provider correctly supplies the store to its children
  it('provides the store to children', () => {
    const store = new TaskStore();
    render(
      <TaskStoreProvider store={store}>
        <TestComponent />
      </TaskStoreProvider>
    );
    expect(screen.getByText('Store is available')).toBeTruthy();
  });

  // Test that the same store instance is provided via context
  it('provides the same store instance', () => {
    const store = new TaskStore();
    let receivedStore: TaskStore | null = null;
    const GrabStore = () => {
      receivedStore = useTaskStore();
      return null;
    };
    render(
      <TaskStoreProvider store={store}>
        <GrabStore />
      </TaskStoreProvider>
    );
    expect(receivedStore).toBe(store);
  });
});