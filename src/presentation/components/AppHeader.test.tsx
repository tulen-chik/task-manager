import React from 'react';
import { render } from '@testing-library/react-native';
import AppHeader from './AppHeader';

describe('AppHeader', () => {
  it('renders header title', () => {
    const { getByText } = render(<AppHeader title="My App" />);
    expect(getByText('My App')).toBeTruthy();
  });
});
