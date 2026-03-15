import { atom } from 'nanostores';

export type ThemeMode = 'deep-space' | 'liquid-teal';

// Theme store
export const $theme = atom<ThemeMode>('deep-space');

// Toggle theme
export function toggleTheme() {
  $theme.set($theme.get() === 'deep-space' ? 'liquid-teal' : 'deep-space');
}

// Set specific theme
export function setTheme(theme: ThemeMode) {
  $theme.set(theme);
}

// Get theme class for body
export function getThemeClass(theme: ThemeMode): string {
  return theme === 'liquid-teal' ? 'bg-liquid-teal' : 'bg-deep-space';
}
