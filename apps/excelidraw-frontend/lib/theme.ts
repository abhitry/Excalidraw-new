export type Theme = 'light' | 'dark';

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function setStoredTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('theme', theme);
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  
  // Force canvas redraw when theme changes
  const event = new CustomEvent('themeChanged', { detail: { theme } });
  window.dispatchEvent(event);
}

export function initializeTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  
  const theme = getStoredTheme();
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  return theme;
}