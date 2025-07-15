import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskForm from './TaskForm';

describe('TaskForm', () => {
  it('renders all input fields', () => {
    const { getByPlaceholderText } = render(<TaskForm onSubmit={() => {}} />);
    expect(getByPlaceholderText('Title')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByPlaceholderText('Date and Time')).toBeTruthy();
    expect(getByPlaceholderText('Location')).toBeTruthy();
  });

  it('calls onSubmit with entered values', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(<TaskForm onSubmit={onSubmit} />);
    fireEvent.changeText(getByPlaceholderText('Title'), 'T');
    fireEvent.changeText(getByPlaceholderText('Description'), 'D');
    fireEvent.changeText(getByPlaceholderText('Date and Time'), '2024-06-01');
    fireEvent.changeText(getByPlaceholderText('Location'), 'L');
    fireEvent.press(getByText('Save'));
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'T',
      description: 'D',
      dateTime: '2024-06-01',
      location: 'L',
    });
  });
});
