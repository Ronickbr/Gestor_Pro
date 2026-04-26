import * as React from 'react';

export type ThemeSetting = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'gestor_pro_theme';

const isThemeSetting = (value: unknown): value is ThemeSetting => {
  return value === 'light' || value === 'dark' || value === 'system';
};

export const resolveTheme = (setting: ThemeSetting, prefersDark: boolean): ResolvedTheme => {
  if (setting === 'system') return prefersDark ? 'dark' : 'light';
  return setting;
};

export const applyResolvedTheme = (resolved: ResolvedTheme) => {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
};

export const getStoredThemeSetting = (): ThemeSetting => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeSetting(saved) ? saved : 'system';
  } catch {
    return 'system';
  }
};

export const setStoredThemeSetting = (setting: ThemeSetting) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, setting);
  } catch {
    return;
  }
};

export const useTheme = () => {
  const [theme, setTheme] = React.useState<ThemeSetting>(() => getStoredThemeSetting());
  const [prefersDark, setPrefersDark] = React.useState<boolean>(() => {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches);

    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
    else mq.addListener(onChange);

    return () => {
      if (typeof mq.removeEventListener === 'function') mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const resolvedTheme = React.useMemo<ResolvedTheme>(() => resolveTheme(theme, prefersDark), [theme, prefersDark]);

  React.useEffect(() => {
    applyResolvedTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setThemeSetting = React.useCallback((next: ThemeSetting) => {
    setTheme(next);
    setStoredThemeSetting(next);
  }, []);

  return { theme, resolvedTheme, setTheme: setThemeSetting };
};

