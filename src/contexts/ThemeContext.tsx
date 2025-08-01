'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'expense-tracker-theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme;
        
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
          setThemeState(savedTheme);
          applyTheme(savedTheme);
        } else {
          // Detect system preference
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          setThemeState(systemTheme);
          applyTheme(systemTheme);
        }
      } catch {
        console.error('Error loading theme preference');
      }
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      if (newTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}