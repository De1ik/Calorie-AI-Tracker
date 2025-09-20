import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    card: string;
    success: string;
    warning: string;
    error: string;
    icon: string;
    iconSecondary: string;
  };
}

const lightColors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1A1D29',
  textSecondary: '#6C757D',
  primary: '#4CAF50',
  secondary: '#2196F3',
  accent: '#FF9800',
  border: '#E9ECEF',
  card: '#FFFFFF',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  icon: '#4CAF50',
  iconSecondary: '#6C757D',
};

const darkColors = {
  background: '#1A1D29',
  surface: '#2C2F3A',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  primary: '#4CAF50',
  secondary: '#2196F3',
  accent: '#FF9800',
  border: '#3A3A3A',
  card: '#2C2F3A',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  icon: '#4CAF50',
  iconSecondary: '#8E8E93',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await SecureStore.getItemAsync('themeMode');
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await SecureStore.setItemAsync('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Determine if dark mode should be used
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemTheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ themeMode, isDark, setThemeMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
