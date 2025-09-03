"use client";

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700 light:bg-white light:border-gray-300 light:hover:bg-gray-50 text-slate-300 hover:text-white dark:text-slate-300 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 transition-all duration-200 shadow-lg"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}