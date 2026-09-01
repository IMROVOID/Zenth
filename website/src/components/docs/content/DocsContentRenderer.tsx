'use client';

import React from 'react';
import type { DocPage } from '@/config/docs';
import { DocsBreadcrumb } from './DocsBreadcrumb';
import { DocsCodeBlock } from './DocsCodeBlock';
import { DocsCallout } from './DocsCallout';
import { DocsStatGrid } from './DocsStatGrid';
import { DocsMatrixTable } from './DocsMatrixTable';
import { DocsTaxonomyGrid } from './DocsTaxonomyGrid';
import { DocsFooterNav } from '../layout/DocsFooterNav';

export interface DocsContentRendererProps {
  page: DocPage;
  className?: string;
}

export function DocsContentRenderer({ page, className = '' }: DocsContentRendererProps) {
  return (
    <article
      style={{
        maxWidth: '56rem',
      }}
      className={`w-full mx-auto flex flex-col bg-transparent pt-7 sm:pt-14 pb-20 ${className}`.trim()}
    >
      {/* Breadcrumb Navigation */}
      <DocsBreadcrumb category={page.category} pageTitle={page.title} />

      {/* Article Header (Explicit 4rem margin bottom) */}
      <header style={{ marginBottom: '4rem' }} className="w-full flex flex-col">
        {page.badges.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {page.badges.map((b) => (
              <span
                key={b}
                style={{
                  color: 'var(--docs-text-secondary, rgb(196, 193, 187))',
                  backgroundColor: 'var(--docs-bg-elevated, rgb(15, 15, 15))',
                  borderColor: 'var(--docs-border, rgb(44, 44, 44))',
                  borderRadius: 'var(--radius-xl, 0.5rem)',
                }}
                className="text-[0.6875rem] font-mono font-medium px-2.5 py-1 border shadow-sm select-none hover:text-[var(--docs-text-primary,rgb(242,240,236))] hover:border-[var(--docs-border-hover,rgb(56,56,56))] transition-all"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <h1
          style={{ color: 'var(--docs-text-primary, rgb(242, 240, 236))' }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight pt-2 mb-4"
        >
          {page.title}
        </h1>

        <p
          style={{ color: 'var(--docs-text-secondary, rgb(196, 193, 187))' }}
          className="text-base sm:text-lg leading-relaxed font-normal"
        >
          {page.subtitle}
        </p>
      </header>

      {/* Main Sections with Guaranteed 4.5rem rowGap */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '4.5rem',
        }}
        className="w-full"
      >
        {page.sections.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: '1.25rem',
            }}
            className="w-full scroll-mt-24"
          >
            <h2
              style={{ color: 'var(--docs-text-primary, rgb(242, 240, 236))' }}
              className="text-xl sm:text-2xl font-semibold tracking-tight m-0"
            >
              {sec.title}
            </h2>

            {sec.content && (
              <p
                style={{ color: 'var(--docs-text-secondary, rgb(196, 193, 187))' }}
                className="text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line m-0"
              >
                {sec.content}
              </p>
            )}

            {sec.statGrid && <DocsStatGrid stats={sec.statGrid} />}
            {sec.callout && (
              <DocsCallout type={sec.callout.type} title={sec.callout.title} body={sec.callout.body} />
            )}
            {sec.codeBlock && (
              <DocsCodeBlock code={sec.codeBlock.code} language={sec.codeBlock.language} filename={sec.codeBlock.filename} />
            )}
            {sec.matrixTable && (
              <DocsMatrixTable headers={sec.matrixTable.headers} rows={sec.matrixTable.rows} />
            )}
            {sec.taxonomyCards && (
              <DocsTaxonomyGrid cards={sec.taxonomyCards} />
            )}
          </section>
        ))}
      </div>

      {/* Article Metadata Bar at Bottom */}
      <div
        style={{
          marginTop: '4.5rem',
          marginBottom: '1.5rem',
          color: 'var(--docs-text-muted, rgb(133, 130, 126))',
        }}
        className="flex items-center gap-2 text-xs font-mono font-medium select-none"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--docs-text-muted,rgb(133,130,126))] inline-block" />
        <span>Last verified: {page.lastUpdated}</span>
        <span className="text-[var(--docs-border,rgb(44,44,44))]">•</span>
        <span>Maintained by Zenth Core</span>
      </div>

      {/* Footer Navigation */}
      <DocsFooterNav prevPage={page.prevPage} nextPage={page.nextPage} />
    </article>
  );
}

export default DocsContentRenderer;

