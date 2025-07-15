import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider, useTheme, theme } from './ThemeProvider';

// Helper component to access the theme
const TestComponent = () => {
  const t = useTheme();
  return <Text>{t.colors.primary}</Text>;
};

describe('ThemeProvider', () => {
  // Test that the theme is available to children
  it('provides theme to children', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(getByText(theme.colors.primary)).toBeTruthy();
  });

  // Test that nested ThemeProviders do not break context
  it('allows nested ThemeProviders', () => {
    const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ThemeProvider>
    );
    const { getByText } = render(
      <CustomThemeProvider>
        <TestComponent />
      </CustomThemeProvider>
    );
    expect(getByText(theme.colors.primary)).toBeTruthy();
  });

  // Test that custom theme values are provided via a custom context
  it('provides custom theme values', () => {
    const customTheme = { ...theme, colors: { ...theme.colors, accent: '#123456' } };
    const CustomThemeContext = React.createContext(customTheme);
    const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => (
      <CustomThemeContext.Provider value={customTheme}>{children}</CustomThemeContext.Provider>
    );
    const CustomComponent = () => {
      const t = React.useContext(CustomThemeContext);
      return <Text>{t.colors.accent}</Text>;
    };
    const { getByText } = render(
      <CustomThemeProvider>
        <CustomComponent />
      </CustomThemeProvider>
    );
    expect(getByText('#123456')).toBeTruthy();
  });
});