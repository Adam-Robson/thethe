'use client';
import { useTheme } from '@/contexts/theme-provider';
import Icon from '@/components/icon';
import type { JSX } from 'react';

export default function ThemeSwitch(): JSX.Element {
  const { theme, setTheme: handleSetTheme } = useTheme();

  return (
    <button
      onClick={() => {
        handleSetTheme(theme === 'light' ? 'dark' : 'light');
      }}
      className="theme-switch h-10 w-10"
      aria-label={`
        Switch to ${theme === 'light' ? 'dark' : 'light'} theme
      `}
    >
      {theme === 'light'
        ? <Icon name="LightningSlashIcon" />
        : <Icon name="LightningIcon" />}
    </button>
  );
}
