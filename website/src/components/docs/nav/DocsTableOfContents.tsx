'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { DocSection } from '@/config/docs';

export interface DocsTableOfContentsProps {
  sections: DocSection[];
  className?: string;
}

export function DocsTableOfContents({
  sections,
  className = '',
}: DocsTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '');

  const updateActiveSection = useCallback(() => {
    if (!sections || sections.length === 0) return;
    const scrollPos = window.scrollY + 140;

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (scrollPos >= top) {
          setActiveId(sections[i].id);
          return;
        }
      }
    }
    if (sections.length > 0) {
      setActiveId(sections[0].id);
    }
  }, [sections]);

  useEffect(() => {
    if (!sections.length) return;
    updateActiveSection();

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [sections, updateActiveSection]);

  if (!sections || sections.length === 0) return null;

  const handleScrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const targetPos = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <aside
      aria-label="Table of contents"
      dir="rtl"
      style={{
        position: 'sticky',
        top: '4rem',
        height: 'calc(100vh - 4rem)',
        width: '17rem',
        minWidth: '17rem',
        alignSelf: 'flex-start',
        paddingTop: '3.5rem',
        paddingBottom: '2rem',
        paddingLeft: '1.25rem',
        paddingRight: '2.5rem',
        overflowY: 'auto',
        zIndex: 30,
        direction: 'rtl',
        textAlign: 'right',
      }}
      className={`docs-desktop-toc flex flex-col flex-shrink-0 select-none ${className}`.trim()}
    >
      {/* RTL Header Title */}
      <div style={{ textAlign: 'right' }} className="w-full flex items-center justify-start gap-2 mb-3.5">
        <span
          style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))', textAlign: 'right' }}
          className="text-[11px] font-mono font-bold tracking-wider uppercase block w-full"
        >
          ON THIS PAGE
        </span>
      </div>

      {/* RTL Navigation with Right Border Indicator */}
      <nav dir="rtl" style={{ direction: 'rtl', textAlign: 'right' }} className="relative border-r border-[var(--docs-border-subtle,rgb(38,38,38))]">
        <ul className="flex flex-col gap-1.5 text-xs font-mono p-0 m-0 list-none">
          {sections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <li key={sec.id} className="relative w-full" style={{ textAlign: 'right' }}>
                <a
                  href={`#${sec.id}`}
                  onClick={(e) => handleScrollTo(e, sec.id)}
                  style={{
                    color: isActive
                      ? 'var(--docs-text-primary, rgb(242, 240, 236))'
                      : 'var(--docs-text-muted, rgb(133, 130, 126))',
                    borderColor: isActive ? 'var(--docs-text-primary, rgb(242, 240, 236))' : 'transparent',
                    textAlign: 'right',
                    direction: 'rtl',
                  }}
                  className={`block w-full py-1.5 pr-3 -mr-[1px] border-r-2 leading-snug transition-all duration-150 ${
                    isActive
                      ? 'font-semibold'
                      : 'hover:text-[var(--docs-text-secondary,rgb(196,193,187))] hover:border-[var(--docs-border-hover,rgb(56,56,56))] font-normal'
                  }`}
                >
                  {sec.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default DocsTableOfContents;

