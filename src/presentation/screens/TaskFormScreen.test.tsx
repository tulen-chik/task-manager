import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TaskFormScreen from '../screens/TaskFormScreen';
import { TaskStoreProvider } from '../stores/TaskStoreContext';
import { TaskStore } from '../stores/TaskStore';


jest.mock('../components/AppHeader', () => 'AppHeader');
jest.mock('../components/TaskForm', () => (props: any) => {
  const { Text } = require('react-native');
  return (
    <Text testID="save-btn" onPress={() => props.onSubmit({ title: 'T', description: 'D', dateTime: '2024-06-01', location: 'L' })}>
      Save
    </Text>
  );
});
jest.mock('react-native-sqlite-storage');

describe('TaskFormScreen', () => {
  it('calls addTask and navigates back', async () => {
    const navigation = { goBack: jest.fn() };
    const store = new TaskStore();
    store.addTask = jest.fn().mockResolvedValue(undefined);
    const { getByTestId } = render(
      <TaskStoreProvider store={store}>
        <TaskFormScreen navigation={navigation} />
      </TaskStoreProvider>
    );
    fireEvent.press(getByTestId('save-btn'));
    await waitFor(() => {
      expect(store.addTask).toHaveBeenCalled();
      expect(navigation.goBack).toHaveBeenCalled();
    });
  });
});
