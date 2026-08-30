'use client';

import React, { useState } from 'react';
import { FaqAccordionListProps } from './types';
import { FaqAccordionItem } from './FaqAccordionItem';

export function FaqAccordionList({ items, className = '' }: FaqAccordionListProps) {
  // Default first item open for instant clarity on zero-key paper trading
  const [openItemId, setOpenItemId] = useState<string | null>(items[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenItemId((current) => (current === id ? null : id));
  };

  return (
    <div className={`flex flex-col gap-3.5 sm:gap-4 w-full ${className}`.trim()}>
      {items.map((item) => (
        <FaqAccordionItem
          key={item.id}
          item={item}
          isOpen={openItemId === item.id}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </div>
  );
}

export default FaqAccordionList;
