import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskList from './TaskList';
import { Task } from '../../entities/Task';

const tasks: Task[] = [
  { id: '1', title: 'A', description: '', dateTime: '', location: '', status: 'in_progress', createdAt: '' },
  { id: '2', title: 'B', description: '', dateTime: '', location: '', status: 'completed', createdAt: '' },
];

describe('TaskList', () => {
  it('renders all tasks', () => {
    const { getByText } = render(<TaskList tasks={tasks} onTaskPress={() => {}} />);
    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
  });

  it('calls onTaskPress with correct task', () => {
    const onTaskPress = jest.fn();
    const { getByText } = render(<TaskList tasks={tasks} onTaskPress={onTaskPress} />);
    fireEvent.press(getByText('A'));
    expect(onTaskPress).toHaveBeenCalledWith(tasks[0]);
  });
});
