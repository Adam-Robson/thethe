'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback,
  ReactNode
} from 'react';
import type { ThemeType, ThemeContextType } from '@/types/theme';

const ThemeContext = createContext<ThemeContextType | null>(null);

// custom hook to encapsulate theme logic
const useThemeLogic = () => {
  const [mounted, setMounted] = useState(false);
  // initialize theme state to light
  const [theme, setTheme] = useState<ThemeType>('light');

  // initialize theme on mount
  useEffect(() => {
    // logic based on localStorage and sys preference not window
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme') as ThemeType | null;
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const initialTheme = savedTheme ?? (
        systemPrefersDark ? 'dark' : 'light'
      );

      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
      setMounted(true);
    };

    // use requestAnimationFrame to defer initialization until after first frame
    const frame = requestAnimationFrame(initializeTheme);

    // listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // handle system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      cancelAnimationFrame(frame);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // update document theme on change after mounting
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  // memoized setter to update theme
  const handleSetTheme = useCallback((newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  return { theme, setTheme: handleSetTheme, mounted };
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme, setTheme, mounted } = useThemeLogic();

  const value = useMemo(() => ({
    theme,
    setTheme,
    mounted
  }), [theme, setTheme, mounted]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
