'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'system' | 'dark' | 'light';
export type ResolvedTheme = 'dark' | 'light';

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  resolvedTheme: 'dark',
  setTheme: () => {},
});

const COOKIE_NAME = 'zenth_docs_theme';
const EXPIRY_DAYS = 30;
const EXPIRY_SECONDS = EXPIRY_DAYS * 24 * 60 * 60; // 2,592,000s

function getStoredPreference(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    if (match && (match[1] === 'dark' || match[1] === 'light' || match[1] === 'system')) {
      return match[1] as ThemeMode;
    }
    const local = localStorage.getItem(COOKIE_NAME);
    const exp = localStorage.getItem(`${COOKIE_NAME}_exp`);
    if (local && exp && Date.now() < parseInt(exp, 10)) {
      if (local === 'dark' || local === 'light' || local === 'system') {
        return local as ThemeMode;
      }
    }
  } catch {
    // Fallback to default
  }
  return 'system';
}

function savePreference(mode: ThemeMode) {
  if (typeof window === 'undefined') return;
  try {
    document.cookie = `${COOKIE_NAME}=${mode}; max-age=${EXPIRY_SECONDS}; path=/; SameSite=Lax`;
    localStorage.setItem(COOKIE_NAME, mode);
    localStorage.setItem(`${COOKIE_NAME}_exp`, String(Date.now() + EXPIRY_SECONDS * 1000));
  } catch {
    // Ignore storage write errors
  }
}

function resolveSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyDomTheme(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', resolved);
  if (resolved === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}

export function DocsThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  const calculateResolvedTheme = useCallback((mode: ThemeMode): ResolvedTheme => {
    if (mode === 'system') return resolveSystemTheme();
    return mode;
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    savePreference(mode);
    const resolved = calculateResolvedTheme(mode);
    setResolvedTheme(resolved);
    applyDomTheme(resolved);
  }, [calculateResolvedTheme]);

  useEffect(() => {
    const initialMode = getStoredPreference();
    const initialResolved = calculateResolvedTheme(initialMode);
    setThemeModeState(initialMode);
    setResolvedTheme(initialResolved);
    applyDomTheme(initialResolved);
    setMounted(true);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      setThemeModeState((curr) => {
        if (curr === 'system') {
          const updatedResolved = resolveSystemTheme();
          setResolvedTheme(updatedResolved);
          applyDomTheme(updatedResolved);
        }
        return curr;
      });
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [calculateResolvedTheme]);

  return (
    <ThemeContext.Provider value={{ themeMode, resolvedTheme: mounted ? resolvedTheme : 'dark', setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useDocsTheme() {
  return useContext(ThemeContext);
}
