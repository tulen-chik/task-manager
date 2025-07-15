import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskItem from './TaskItem';
import { Task } from '../../entities/Task';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Desc',
  dateTime: '2024-06-01T10:00:00Z',
  location: 'Loc',
  status: 'in_progress',
  createdAt: '2024-06-01T09:00:00Z',
};

describe('TaskItem', () => {
  it('renders task title, status, and date', () => {
    const { getByText } = render(<TaskItem task={mockTask} onPress={() => {}} />);
    expect(getByText('Test Task')).toBeTruthy();
    expect(getByText('in_progress')).toBeTruthy();
    expect(getByText('2024-06-01T10:00:00Z')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<TaskItem task={mockTask} onPress={onPress} />);
    fireEvent.press(getByText('Test Task'));
    expect(onPress).toHaveBeenCalled();
  });
});
