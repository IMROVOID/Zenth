import React from 'react';
import Link from 'next/link';
import { navItems, type NavItem } from '@/config';

export interface NavMenuProps {
  items?: NavItem[];
  className?: string;
}

export function NavMenu({ items = navItems, className = '' }: NavMenuProps) {
  return (
    <nav
      className={`hidden md:flex items-center gap-5 lg:gap-6 xl:gap-7 text-sm font-medium absolute left-1/2 -translate-x-1/2 ${className}`.trim()}
    >
      {items.map((item) => {
        const isExternal = item.href.startsWith('http');
        return (
          <Link
            key={item.label}
            href={item.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-1.5 text-white hover:text-white/75 transition-colors duration-150"
          >
            <span>{item.label}</span>
            {item.hasDropdown && (
              <svg
                className="w-3.5 h-3.5 text-white"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default NavMenu;
