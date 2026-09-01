import React from 'react';
import Link from 'next/link';
import { FooterNavGridProps, FooterLinkItem } from './types';

function renderLinkItem(link: FooterLinkItem, onOpenLegalModal: (doc: 'privacy' | 'terms') => void) {
  if (link.isModalTrigger && link.modalType) {
    return (
      <button
        type="button"
        onClick={() => onOpenLegalModal(link.modalType!)}
        className="text-left text-zinc-400 hover:text-white transition-colors text-xs font-mono group flex items-start gap-1.5 focus:outline-none cursor-pointer"
      >
        <span className="text-zinc-600 group-hover:text-zinc-300 transition-colors mt-[1px] flex-shrink-0">›</span>
        <span className="break-words leading-snug">{link.label}</span>
      </button>
    );
  }

  const isNewTab = link.isExternal || link.href.startsWith('http') || link.href.startsWith('/doc');

  return (
    <Link
      href={link.href}
      target={isNewTab ? '_blank' : undefined}
      rel={isNewTab ? 'noopener noreferrer' : undefined}
      className="text-zinc-400 hover:text-white transition-colors text-xs font-mono group flex items-start gap-1.5"
    >
      <span className="text-zinc-600 group-hover:text-zinc-300 transition-colors mt-[1px] flex-shrink-0">›</span>
      <span className="break-words leading-snug">{link.label}</span>
    </Link>
  );
}

export function FooterNavGrid({
  columns,
  onOpenLegalModal,
  className = '',
}: FooterNavGridProps) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-6 ${className}`.trim()}
    >
      {columns.map((column, colIdx) => (
        <div key={`footer-col-${colIdx}`} className="flex flex-col gap-3 min-w-0">
          {/* Column Header matching the typography of the site */}
          <h4 className="text-xs font-semibold font-mono uppercase tracking-wider text-white/90 truncate">
            {column.title}
          </h4>

          {/* Links List */}
          <ul className="flex flex-col gap-2">
            {column.links.map((link, linkIdx) => (
              <li key={`col-${colIdx}-link-${linkIdx}`}>
                {renderLinkItem(link, onOpenLegalModal)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default FooterNavGrid;
