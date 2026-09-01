'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDocsTheme, type ThemeMode } from './themeContext';

export function DocsThemeToggle() {
  const { themeMode, resolvedTheme, setTheme } = useDocsTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    if (isOpen && !isClosing) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 160);
    }
  }, [isOpen, isClosing]);

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      setIsOpen(true);
      setIsClosing(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  const renderIcon = (mode: ThemeMode | 'current', size = 18) => {
    const target = mode === 'current' ? (themeMode === 'system' ? 'system' : resolvedTheme) : mode;

    if (target === 'system') {
      return (
        <span className="inline-flex items-center justify-center">
          {/* Mobile: Phone Icon (< 640px) */}
          <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="block sm:hidden flex-shrink-0">
            <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
            <line x1="11.95" y1="18" x2="12.05" y2="18" strokeLinecap="round" strokeWidth="2.2" />
          </svg>

          {/* Tablet: Tablet Icon (640px - 1024px) */}
          <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="hidden sm:block lg:hidden flex-shrink-0">
            <rect x="4.5" y="2.5" width="15" height="19" rx="2.5" />
            <line x1="11.95" y1="18.5" x2="12.05" y2="18.5" strokeLinecap="round" strokeWidth="2.2" />
          </svg>

          {/* Desktop: PC Monitor Icon (>= 1024px) */}
          <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="hidden lg:block flex-shrink-0">
            <rect x="3" y="3.5" width="18" height="12.5" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 16v1.5a1.5 1.5 0 01-.45 1.05L7.5 20h9l-1.55-1.45A1.5 1.5 0 0114.5 17.5V16" />
          </svg>
        </span>
      );
    }
    if (target === 'dark') {
      return (
        <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="flex-shrink-0 block">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    }
    return (
      <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="flex-shrink-0 block">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    );
  };

  const themeOptions: { key: ThemeMode; label: string }[] = [
    { key: 'system', label: 'System' },
    { key: 'dark', label: 'Dark' },
    { key: 'light', label: 'Light' },
  ];

  return (
    <div ref={menuRef} className="relative flex items-center justify-center">
      <button
        type="button"
        onClick={toggleMenu}
        aria-label={`Toggle theme menu (Current: ${themeMode}, active: ${resolvedTheme})`}
        style={{
          width: '36px',
          height: '36px',
          minWidth: '36px',
          minHeight: '36px',
          boxSizing: 'border-box',
          borderRadius: 'var(--radius-xl, 0.5rem)',
          color: 'var(--docs-text-secondary, rgb(196, 193, 187))',
        }}
        className="flex items-center justify-center hover:text-[var(--docs-text-primary,rgb(242,240,236))] hover:bg-white/[0.05] transition-colors cursor-pointer"
      >
        {renderIcon('current', 18)}
      </button>

      {/* Dropdown Menu Centered Directly Below the Theme Icon */}
      {isOpen && (
        <div
          style={{
            backgroundColor: 'var(--docs-bg-surface, rgb(20, 20, 20))',
            border: '1px solid var(--docs-border, rgb(44, 44, 44))',
            borderRadius: 'var(--radius-xl, 0.5rem)',
            boxShadow: 'var(--docs-shadow-popover, 0 10px 30px rgba(0,0,0,0.85))',
          }}
          className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-34 py-1 z-50 ${
            isClosing ? 'animate-modal-card-out pointer-events-none' : 'animate-modal-card-in'
          }`}
        >
          {themeOptions.map((t) => {
            const isSelected = themeMode === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setTheme(t.key);
                  closeMenu();
                }}
                style={{
                  color: isSelected
                    ? 'var(--docs-text-primary, rgb(242, 240, 236))'
                    : 'var(--docs-text-secondary, rgb(196, 193, 187))',
                }}
                className={`w-full px-3 py-1.5 text-xs text-left font-mono font-medium transition-colors hover:bg-white/[0.06] flex items-center justify-between gap-2 cursor-pointer ${
                  isSelected ? 'bg-white/[0.04] font-semibold' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="opacity-80 inline-flex items-center justify-center w-3.5 h-3.5 flex-shrink-0 leading-none">
                    {renderIcon(t.key, 14)}
                  </span>
                  <span className="leading-none flex items-center">{t.label}</span>
                </div>
                {isSelected && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    className="shrink-0 text-[var(--docs-text-primary,rgb(242,240,236))]"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2.5 2.5 5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DocsThemeToggle;


