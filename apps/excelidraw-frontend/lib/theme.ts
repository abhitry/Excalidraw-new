export type Theme = 'light' | 'dark';

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  
  // Check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setStoredTheme(theme: Theme) {
  localStorage.setItem('theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
  
  // Force canvas redraw when theme changes
  const event = new CustomEvent('themeChanged', { detail: { theme } });
  window.dispatchEvent(event);
}

export function initializeTheme() {
  const theme = getStoredTheme();
  setStoredTheme(theme);
  return theme;
}