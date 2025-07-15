import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import { TaskStoreProvider } from '../stores/TaskStoreContext';
import { TaskStore } from '../stores/TaskStore';
import { Task } from '../../entities/Task';
import { Text } from 'react-native';

jest.mock('react-native-sqlite-storage');

jest.mock('../components/AppHeader', () => (props: any) => {
  const { Text } = require('react-native');
  return <Text>{props.title}</Text>;
});
jest.mock('../components/PrimaryButton', () => (props: any) => {
  const { Text } = require('react-native');
  return <Text onPress={props.onPress}>{props.title}</Text>;
});

describe('TaskDetailScreen', () => {
  it('renders task details and deletes task', async () => {
    const navigation = { goBack: jest.fn() };
    const store = new TaskStore();
    const task = { id: '1', title: 'Test', description: 'D', dateTime: '2024-06-01', location: 'L', status: 'in_progress', createdAt: '' };
    store.getTaskById = jest.fn(() => task as Task);
    store.deleteTask = jest.fn().mockResolvedValue(undefined);

    const { getByText } = render(
      <TaskStoreProvider store={store}>
        <TaskDetailScreen route={{ params: { taskId: '1' } }} navigation={navigation} />
      </TaskStoreProvider>
    );
    expect(getByText('Test')).toBeTruthy();
    expect(getByText('D')).toBeTruthy();
    fireEvent.press(getByText('Delete'));
    expect(store.deleteTask).toHaveBeenCalledWith('1');
  });

  it('shows "Task not found" if task is missing', () => {
    const navigation = { goBack: jest.fn() };
    const store = new TaskStore();
    store.getTaskById = jest.fn(() => undefined);

    const { getByText } = render(
      <TaskStoreProvider store={store}>
        <TaskDetailScreen route={{ params: { taskId: '404' } }} navigation={navigation} />
      </TaskStoreProvider>
    );
    expect(getByText('Task not found')).toBeTruthy();
  });
});
