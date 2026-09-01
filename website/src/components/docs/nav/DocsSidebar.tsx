'use client';

import React, { useEffect } from 'react';
import { docCategories } from '@/config/docs';
import { DocsNavTree } from './DocsNavTree';

export interface DocsSidebarProps {
  activeSlug: string;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  className?: string;
}

export function DocsSidebar({
  activeSlug,
  isMobileOpen,
  onMobileClose,
  className = '',
}: DocsSidebarProps) {
  useEffect(() => {
    if (!isMobileOpen) return;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onMobileClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileOpen, onMobileClose]);

  return (
    <>
      {/* Desktop & Laptop Uncollapsable Sticky Sidebar */}
      <aside
        style={{
          position: 'sticky',
          top: '4rem',
          height: 'calc(100vh - 4rem)',
          width: '18.75rem',
          minWidth: '18.75rem',
          alignSelf: 'flex-start',
          backgroundColor: 'var(--docs-bg-primary, rgb(16, 16, 16))',
          borderRight: '1px solid var(--docs-border, rgb(44, 44, 44))',
          paddingTop: '1.25rem',
          paddingBottom: '2rem',
          overflowY: 'auto',
          zIndex: 40,
        }}
        className={`docs-desktop-sidebar flex flex-col flex-shrink-0 px-4 ${className}`.trim()}
      >
        <DocsNavTree
          categories={docCategories}
          activeSlug={activeSlug}
        />
      </aside>

      {/* Mobile & Tablet Slide-Over Drawer (< 1024px) */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-0 z-50 flex"
        >
          {/* Backdrop */}
          <div
            style={{ backgroundColor: 'var(--docs-modal-overlay-bg, rgba(0, 0, 0, 0.75))' }}
            className="fixed inset-0 animate-overlay-in"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Sliding Panel */}
          <div
            style={{
              backgroundColor: 'var(--docs-header-bg, rgba(16, 16, 16, 0.85))',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRight: '1px solid var(--docs-border, rgb(44, 44, 44))',
            }}
            className="relative w-[18.75rem] max-w-[85vw] h-full p-5 flex flex-col overflow-y-auto z-10 animate-menu-in shadow-2xl backdrop-blur-md"
          >
            <div
              style={{ borderBottom: '1px solid var(--docs-border, rgb(44, 44, 44))' }}
              className="flex items-center justify-between pb-3 mb-3"
            >
              <span
                style={{ color: 'var(--docs-nav-link-color, rgb(240, 227, 222))' }}
                className="text-xs font-mono font-semibold uppercase tracking-wider"
              >
                DOCUMENTATION
              </span>
              <button
                type="button"
                onClick={onMobileClose}
                aria-label="Close navigation sidebar"
                style={{ color: 'var(--docs-text-secondary, rgb(196, 193, 187))' }}
                className="w-8 h-8 flex items-center justify-center hover:text-[var(--docs-text-primary,rgb(242,240,236))] rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <DocsNavTree
              categories={docCategories}
              activeSlug={activeSlug}
              onItemClick={onMobileClose}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default DocsSidebar;

