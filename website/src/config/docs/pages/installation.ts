import type { DocPage } from '../types';

export const installationDocPage: DocPage = {
  slug: 'installation',
  title: 'Installation & Setup',
  subtitle:
    'Setup guide for deploying Zenth globally via NPM/PNPM or building from source across Windows, macOS, and Linux.',
  category: 'Getting Started',
  categorySlug: 'getting-started',
  statusTag: '[READY TO RUN]',
  badges: ['[Node 22+ LTS]', '[TypeScript 7.0+]', '[pnpm 9+]', '[Docker Ready]'],
  lastUpdated: 'August 2026',
  prevPage: { title: 'Platform Overview', slug: 'overview' },
  nextPage: { title: 'Onboarding Wizard', slug: 'onboarding-wizard' },
  sections: [
    {
      id: 'prerequisites',
      title: 'Prerequisites & Environment Requirements',
      content:
        'Before running Zenth, ensure you have Node.js (v20+ LTS, v22+ recommended) and a modern package manager installed.',
      matrixTable: {
        headers: ['Platform', 'Package Manager', 'Installation Command'],
        rows: [
          ['Windows 10/11', 'winget / fnm', 'winget install OpenJS.NodeJS.LTS'],
          ['macOS (Apple Silicon / Intel)', 'Homebrew', 'brew install node'],
          ['Linux (Ubuntu / Debian)', 'apt / curl', 'curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -'],
        ],
      },
    },
    {
      id: 'npm-global-install',
      title: 'Method 1: Global Package Installation (Fastest)',
      content:
        'Installing Zenth globally provides instant access to the standalone `zenth` command across your terminal.',
      codeBlock: {
        language: 'bash',
        filename: 'Terminal',
        code: '# Using PNPM (Recommended)\npnpm add -g zenth\n\n# Or using NPM\nnpm install -g zenth\n\n# Launch interactive TUI terminal\nzenth',
      },
    },
    {
      id: 'source-code-build',
      title: 'Method 2: Clone & Build from Source',
      content:
        'Ideal for developers wanting to customize strategy parameters, indicator periods, or TUI components.',
      codeBlock: {
        language: 'bash',
        filename: 'Terminal',
        code: '# 1. Clone the repository\ngit clone https://github.com/IMROVOID/Zenth.git\ncd Zenth\n\n# 2. Install dependencies\nnpm install\n\n# 3. Build TypeScript to dist/\nnpm run build\n\n# 4. Launch interactive terminal\nnpm start',
      },
    },
    {
      id: 'docker-compose-stack',
      title: 'Instant Database Docker Stack',
      content:
        'Launch PostgreSQL 16 and MongoDB 7.0 locally with a single command for full relational and document storage support.',
      codeBlock: {
        language: 'bash',
        filename: 'Terminal',
        code: '# Launch local PostgreSQL & MongoDB containers in background\ndocker compose up -d\n\n# Stop containers\ndocker compose down',
      },
    },
  ],
};
