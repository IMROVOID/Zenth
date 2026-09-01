import type { DocPage, DocCategory, DocSearchResult } from './types';
import { overviewDocPage } from './pages/overview';
import { installationDocPage } from './pages/installation';
import { onboardingDocPage } from './pages/onboarding';
import { architectureDocPage } from './pages/architecture';
import { exchangesDocPage } from './pages/exchanges';
import { strategyDocPage } from './pages/strategy';
import { riskDocPage } from './pages/risk';
import { storageDocPage } from './pages/storage';
import { adaptiveMemoryDocPage } from './pages/adaptiveMemory';
import { tuiTerminalDocPage } from './pages/tuiTerminal';
import { exportEngineDocPage } from './pages/exportEngine';
import { cliCommandsDocPage } from './pages/cliCommands';
import { testSuitesDocPage } from './pages/testSuites';

export * from './types';

export const allDocPages: DocPage[] = [
  overviewDocPage,
  installationDocPage,
  onboardingDocPage,
  architectureDocPage,
  exchangesDocPage,
  strategyDocPage,
  riskDocPage,
  storageDocPage,
  adaptiveMemoryDocPage,
  tuiTerminalDocPage,
  exportEngineDocPage,
  cliCommandsDocPage,
  testSuitesDocPage,
];

export const docCategories: DocCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    badge: 'START',
    pages: [
      { slug: 'overview', title: 'Platform Overview', summary: 'Core features, mission & architecture' },
      { slug: 'installation', title: 'Installation & Setup', summary: 'Node.js, PNPM, Docker, and build steps' },
      { slug: 'onboarding-wizard', title: 'Onboarding Wizard', summary: '4-step wizard & dynamic credentials' },
    ],
  },
  {
    id: 'core-architecture',
    title: 'Core Architecture',
    badge: 'CORE',
    pages: [
      { slug: 'architecture', title: 'System Architecture', summary: 'Decoupled multi-tier topology & invariants' },
      { slug: 'market-feeds', title: 'Market Feeds', summary: '6 public exchange adapters & normalization' },
    ],
  },
  {
    id: 'strategy-math',
    title: 'Strategy & Math',
    badge: 'ALGO',
    pages: [
      { slug: 'quantitative-strategy', title: 'Quantitative Strategy', summary: 'SMA 9/21, RSI 14 & profit brackets' },
      { slug: 'risk-management', title: 'Risk Management', summary: '$1,000 allocation cap & circuit breakers' },
    ],
  },
  {
    id: 'storage-memory',
    title: 'Storage & Memory',
    badge: 'PERSISTENCE',
    pages: [
      { slug: 'storage-engines', title: 'Storage Engines', summary: 'SQLite, PG, Mongo, Supabase RLS, RAM' },
      { slug: 'adaptive-learning', title: 'Adaptive Learning', summary: 'Failure ingestion & pre-trade filter' },
    ],
  },
  {
    id: 'terminal-interface',
    title: 'Terminal Interface',
    badge: 'TUI',
    pages: [
      { slug: 'tui-terminal', title: 'TUI Terminal', summary: 'Pinned HUD, 14 themes & slash palette' },
      { slug: 'export-engine', title: 'Export Subsystem', summary: 'TXT, CSV, Markdown, Word DOCX, PDF 1.4' },
    ],
  },
  {
    id: 'developer-reference',
    title: 'Developer Reference',
    badge: 'DEV',
    pages: [
      { slug: 'cli-reference', title: 'CLI Reference', summary: 'Operational commands & flags' },
      { slug: 'test-suite', title: 'Test Suites', summary: '14 automated unit & E2E verification suites' },
    ],
  },
];

export function getDocBySlug(slug?: string): DocPage | undefined {
  if (!slug || slug === 'overview' || slug === 'index') {
    return overviewDocPage;
  }
  return allDocPages.find((p) => p.slug === slug);
}

export function getAllDocSlugs(): string[] {
  return allDocPages.map((p) => p.slug);
}

function extractSnippet(text: string, query: string): string {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, 110) + (text.length > 110 ? '...' : '');
  const start = Math.max(0, idx - 30);
  const end = Math.min(text.length, idx + query.length + 80);
  return (start > 0 ? '...' : '') + text.slice(start, end).trim() + (end < text.length ? '...' : '');
}

export function searchDocs(query: string): DocSearchResult[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const results: DocSearchResult[] = [];

  for (const page of allDocPages) {
    if (page.title.toLowerCase().includes(q) || page.subtitle.toLowerCase().includes(q)) {
      results.push({
        slug: page.slug,
        title: page.title,
        category: page.category,
        matchSnippet: extractSnippet(page.subtitle, q),
        type: 'page',
      });
    }

    for (const sec of page.sections) {
      let combinedText = `${sec.title} ${sec.content}`;
      if (sec.statGrid) combinedText += ' ' + sec.statGrid.map((s) => `${s.label} ${s.value} ${s.badge}`).join(' ');
      if (sec.matrixTable) combinedText += ' ' + sec.matrixTable.rows.flat().join(' ');
      if (sec.taxonomyCards) combinedText += ' ' + sec.taxonomyCards.map((t) => `${t.tag} ${t.description}`).join(' ');
      if (sec.codeBlock) combinedText += ' ' + sec.codeBlock.code;

      if (combinedText.toLowerCase().includes(q)) {
        results.push({
          slug: page.slug,
          title: page.title,
          category: page.category,
          sectionId: sec.id,
          sectionTitle: sec.title,
          matchSnippet: extractSnippet(combinedText, q),
          type: 'section',
        });
      }
    }
  }

  return results.slice(0, 8);
}
