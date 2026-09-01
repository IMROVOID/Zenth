'use client';

import React from 'react';
import Link from 'next/link';

export interface DocsNavTreeItemProps {
  slug: string;
  title: string;
  badge?: string;
  isActive: boolean;
  onItemClick?: () => void;
}

export function DocsNavTreeItem({
  slug,
  title,
  badge,
  isActive,
  onItemClick,
}: DocsNavTreeItemProps) {
  return (
    <li className="py-0.5">
      <Link
        href={`/documentation/${slug}/`}
        onClick={onItemClick}
        className={`docs-nav-link flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-[13px] select-none ${
          isActive ? 'is-active font-semibold' : 'font-medium'
        }`}
      >
        <span className="truncate">
          {title}
        </span>

        {badge && (
          <span
            style={{
              color: 'var(--docs-text-muted, rgb(133, 130, 126))',
              backgroundColor: 'var(--docs-kbd-bg, rgb(37, 37, 37))',
            }}
            className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded"
          >
            {badge}
          </span>
        )}
      </Link>
    </li>
  );
}

export default DocsNavTreeItem;

