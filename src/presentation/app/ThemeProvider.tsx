import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

export const theme = {
  colors: {
    primary: '#4F8EF7',
    accent: '#34C759',
    background: '#F9F9F9',
    card: '#FFFFFF',
    text: '#222B45',
    inProgress: '#FFD600',
    completed: '#34C759',
    cancelled: '#FF3B30',
    border: '#E5E5EA',
    placeholder: '#A0A0A0',
  },
  borderRadius: 12,
  spacing: (factor: number) => 8 * factor,
};

type Theme = typeof theme;

const ThemeContext = createContext<Theme>(theme);

export const useTheme = () => useContext(ThemeContext);

/**
 * Provides the app theme to all child components.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <ThemeContext.Provider value={theme}>
    <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
  </ThemeContext.Provider>
);

export default ThemeProvider;