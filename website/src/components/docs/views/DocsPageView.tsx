'use client';

import React from 'react';
import type { DocPage } from '@/config/docs';
import { DocsLayout } from '../layout/DocsLayout';
import { DocsContentRenderer } from '../content/DocsContentRenderer';

export interface DocsPageViewProps {
  page: DocPage;
}

export function DocsPageView({ page }: DocsPageViewProps) {
  return (
    <DocsLayout activeSlug={page.slug} sections={page.sections}>
      <DocsContentRenderer page={page} />
    </DocsLayout>
  );
}

export default DocsPageView;
