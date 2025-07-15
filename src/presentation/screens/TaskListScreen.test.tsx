import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskListScreen from '../screens/TaskListScreen';
import { TaskStoreProvider } from '../stores/TaskStoreContext';
import { TaskStore } from '../stores/TaskStore';

jest.mock('react-native-sqlite-storage');

jest.mock('../components/AppHeader', () => 'AppHeader');
jest.mock('../components/TaskList', () => (props: any) => {
  const { Text } = require('react-native');
  return <>{props.tasks.map((t: any) => <Text key={t.id}>{t.title}</Text>)}</>;
});
jest.mock('../components/PrimaryButton', () => (props: any) => {
  const { Text } = require('react-native');
  return <Text onPress={props.onPress}>{props.title}</Text>;
});
jest.mock('../components/TaskForm', () => (props: any) => {
  const { Text } = require('react-native');
  return (
    <Text testID="save-btn" onPress={() => props.onSubmit({ title: 'T', description: 'D', dateTime: '2024-06-01', location: 'L' })}>
      Save
    </Text>
  );
});

describe('TaskListScreen', () => {
  it('renders and navigates to TaskForm', () => {
    const navigation = { navigate: jest.fn() };
    const store = new TaskStore();
    store.tasks = [{ id: '1', title: 'Test', description: '', dateTime: '', location: '', status: 'in_progress', createdAt: '' }];
    const { getByText } = render(
      <TaskStoreProvider store={store}>
        <TaskListScreen navigation={navigation} />
      </TaskStoreProvider>
    );
    expect(getByText('Test')).toBeTruthy();
    fireEvent.press(getByText('Add Task'));
    expect(navigation.navigate).toHaveBeenCalledWith('TaskForm');
  });
});
