import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PrimaryButton from './PrimaryButton';

describe('PrimaryButton', () => {
  it('renders title', () => {
    const { getByText } = render(<PrimaryButton title="Save" onPress={() => {}} />);
    expect(getByText('Save')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<PrimaryButton title="Click" onPress={onPress} />);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });
});
