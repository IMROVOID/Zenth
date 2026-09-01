import type { DocPage } from '../types';

export const onboardingDocPage: DocPage = {
  slug: 'onboarding-wizard',
  title: 'Interactive Onboarding Wizard',
  subtitle:
    'Guided 4-step first-launch configuration, multi-database auto-provisioning, live asset search with sparklines, and parameter pickers.',
  category: 'Getting Started',
  categorySlug: 'getting-started',
  statusTag: '[ZERO CONFIG FIRST RUN]',
  badges: ['[AUTO_PROVISIONING]', '[ASSET_SEARCH]', '[PASS_GEN]', '[/onboard]'],
  lastUpdated: 'August 2026',
  prevPage: { title: 'Installation & Setup', slug: 'installation' },
  nextPage: { title: 'System Architecture', slug: 'architecture' },
  sections: [
    {
      id: 'onboarding-steps-flow',
      title: 'The 4-Step Interactive Flow',
      content:
        'When launching Zenth for the first time without a configured `.env` file (or by typing `/onboard`), the guided wizard walks you through 4 steps:',
      matrixTable: {
        headers: ['Step', 'Configuration Phase', 'Operations Performed'],
        rows: [
          ['Step 1', 'Storage Engine Selection', 'Choose between SQLite, PostgreSQL, MongoDB, Supabase, or In-Memory.'],
          ['Step 2', 'Database Provisioning', '1-Click auto-creation of database zenth, DDL tables, and indexes.'],
          ['Step 3', 'Market & Risk Parameters', 'Exchange picker, live asset search with sparklines, [SPACE] parameter pickers.'],
          ['Step 4', 'Review & Terminal Launch', 'Generates sanitized .env file and boots directly into live HUD.'],
        ],
      },
    },
    {
      id: 'smart-features',
      title: 'Built-In Wizard Accelerators',
      content:
        'The onboarding wizard includes high-productivity shortcuts designed for speed and security.',
      statGrid: [
        { label: 'PASSWORD GENERATOR', value: 'Press [G]', badge: '16-char crypto-secure' },
        { label: 'PARAMETER PICKERS', value: 'Press [SPACE]', badge: 'Curated modal dialogs' },
        { label: 'ASSET SEARCH', value: 'Live OHLCV', badge: 'Braille price sparklines' },
        { label: 'AUTO DDL', value: '1-Click SQL', badge: 'Zero manual schema setup' },
      ],
    },
    {
      id: 'wizard-relaunch-commands',
      title: 'Re-Launching the Wizard',
      content:
        'You can reconfigure your database or default trading parameters anytime directly inside the running TUI terminal.',
      codeBlock: {
        language: 'bash',
        filename: 'TUI Slash Commands',
        code: '# Relaunch full 4-step onboarding wizard\n/onboard\n\n# Or reconfigure specific settings\n/setup\n/config',
      },
    },
  ],
};
