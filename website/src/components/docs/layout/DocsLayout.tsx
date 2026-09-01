'use client';

import React, { useState, useEffect } from 'react';
import type { DocSection } from '@/config/docs';
import { DocsThemeProvider } from './themeContext';
import { DocsHeader } from './DocsHeader';
import { DocsSidebar } from '../nav/DocsSidebar';
import { DocsTableOfContents } from '../nav/DocsTableOfContents';
import { DocsSearchModal } from '../search/DocsSearchModal';

export interface DocsLayoutProps {
  activeSlug: string;
  sections?: DocSection[];
  children: React.ReactNode;
}

export function DocsLayout({ activeSlug, sections, children }: DocsLayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DocsThemeProvider>
      <div
        style={{ backgroundColor: 'var(--docs-bg-primary, rgb(16, 16, 16))' }}
        className="w-full min-h-screen flex flex-col text-[var(--docs-text-primary,rgb(242,240,236))] antialiased selection:bg-[var(--docs-selection-bg,rgb(51,51,51))] selection:text-[var(--docs-selection-text,rgb(255,255,255))]"
      >
        {/* Sticky Top Header (Pinned to Viewport) */}
        <DocsHeader
          onSearchOpen={() => setIsSearchOpen(true)}
          onMobileMenuToggle={() => setIsMobileNavOpen((prev) => !prev)}
        />

        {/* Unified Side-by-Side Container */}
        <div
          style={{ backgroundColor: 'var(--docs-bg-primary, rgb(16, 16, 16))' }}
          className="w-full flex-1 flex relative justify-between"
        >
          {/* Sticky Sidebar (Visible and Uncollapsable on Laptop/Desktop >= 1024px) */}
          <DocsSidebar
            activeSlug={activeSlug}
            isMobileOpen={isMobileNavOpen}
            onMobileClose={() => setIsMobileNavOpen(false)}
          />

          {/* Responsive Content Canvas */}
          <main
            style={{ backgroundColor: 'var(--docs-bg-primary, rgb(16, 16, 16))' }}
            className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 relative flex justify-center"
          >
            <div className="relative z-10 w-full max-w-[56rem]">{children}</div>
          </main>

          {/* Right Sticky Table of Contents */}
          {sections && sections.length > 0 && (
            <DocsTableOfContents sections={sections} />
          )}
        </div>

        {/* Global Search Overlay Modal */}
        <DocsSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </div>
    </DocsThemeProvider>
  );
}

export default DocsLayout;

