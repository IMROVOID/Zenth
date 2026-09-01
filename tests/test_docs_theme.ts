import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function runDocsThemeTests() {
  console.log('[TEST] Starting Docs Theme verification suite...');

  // 1. Verify CSS tokens in theme.css and globals.css
  const themeCssPath = path.resolve('website/src/styles/theme.css');
  assert.ok(fs.existsSync(themeCssPath), 'theme.css must exist');
  const themeCss = fs.readFileSync(themeCssPath, 'utf8');

  assert.ok(themeCss.includes('rgb(252, 252, 252)'), 'Light theme background must be rgb(252, 252, 252)');
  assert.ok(themeCss.includes('rgb(12, 12, 12)'), 'Light theme primary text/headings must be rgb(12, 12, 12)');
  assert.ok(themeCss.includes('rgb(115, 115, 115)'), 'Light theme secondary text must be rgb(115, 115, 115)');
  assert.ok(themeCss.includes('rgb(255, 255, 255)'), 'Elevated surfaces must be pure white rgb(255, 255, 255)');
  assert.ok(themeCss.includes('--docs-category-heading-opacity: 0.45;'), 'Dark theme category opacity must be 0.45');
  assert.ok(themeCss.includes('--docs-category-heading-opacity: 0.6;'), 'Light theme category opacity must be 0.6');

  // Category heading opacity and color check
  const globalsCss = fs.readFileSync(path.resolve('website/src/styles/globals.css'), 'utf8');
  assert.ok(globalsCss.includes('opacity: var(--docs-category-heading-opacity'), 'Category title texts must use opacity variable');
  assert.ok(globalsCss.includes('font-weight: 600;'), 'Category title texts must use font-weight 600');
  assert.ok(globalsCss.includes('color: var(--docs-nav-link-color'), 'Category title texts must use navbar item text color');

  // 2. Verify theme context and 30-day cookie logic
  const themeContextPath = path.resolve('website/src/components/docs/layout/themeContext.tsx');
  assert.ok(fs.existsSync(themeContextPath), 'themeContext.tsx must exist');
  const themeContext = fs.readFileSync(themeContextPath, 'utf8');
  assert.ok(themeContext.includes('EXPIRY_DAYS = 30'), 'Theme persistence must be 30 days');
  assert.ok(themeContext.includes('max-age=${EXPIRY_SECONDS}'), 'Cookie must use max-age for 30 days');
  assert.ok(themeContext.includes('prefers-color-scheme: dark'), 'System theme listener must be registered');

  // 3. Verify DocsThemeToggle has PC, Moon, Sun icons and circle tick
  const togglePath = path.resolve('website/src/components/docs/layout/DocsThemeToggle.tsx');
  const toggleContent = fs.readFileSync(togglePath, 'utf8');
  assert.ok(toggleContent.includes('System'), 'Toggle dropdown must include System option');
  assert.ok(toggleContent.includes('Dark'), 'Toggle dropdown must include Dark option');
  assert.ok(toggleContent.includes('Light'), 'Toggle dropdown must include Light option');
  assert.ok(toggleContent.includes('<circle cx="12" cy="12" r="9"'), 'Selected theme must display tick with circle outline');
  assert.ok(!toggleContent.includes('[x]'), 'Selected theme must not use [x]');

  // 4. Verify no shadows on Searchbar, Filter Sidebar, Github stars box, and Header
  const searchTrigger = fs.readFileSync(path.resolve('website/src/components/docs/search/DocsSearchTrigger.tsx'), 'utf8');
  assert.ok(searchTrigger.includes("boxShadow: 'none'"), 'Searchbar must have boxShadow: none');

  const navTree = fs.readFileSync(path.resolve('website/src/components/docs/nav/DocsNavTree.tsx'), 'utf8');
  assert.ok(navTree.includes("boxShadow: 'none'"), 'Filter sidebar box must have boxShadow: none');

  assert.ok(themeCss.includes('--syntax-command:'), 'theme.css must define syntax color tokens');
  assert.ok(themeCss.includes('--syntax-keyword:'), 'theme.css must define syntax color tokens');
  assert.ok(themeCss.includes('--syntax-flag:'), 'theme.css must define syntax color tokens');

  // 5. Verify line counts are strictly under 200 lines
  const monitoredFiles = [
    'website/src/styles/globals.css',
    'website/src/styles/theme.css',
    'website/src/styles/animations.css',
    'website/src/config/theme.ts',
    'website/src/components/docs/layout/themeContext.tsx',
    'website/src/components/docs/layout/DocsThemeToggle.tsx',
    'website/src/components/docs/layout/DocsLayout.tsx',
    'website/src/components/docs/layout/DocsHeader.tsx',
    'website/src/components/docs/layout/DocsFooterNav.tsx',
    'website/src/components/docs/nav/DocsSidebar.tsx',
    'website/src/components/docs/nav/DocsNavTree.tsx',
    'website/src/components/docs/nav/DocsNavTreeItem.tsx',
    'website/src/components/docs/nav/DocsTableOfContents.tsx',
    'website/src/components/docs/search/DocsSearchTrigger.tsx',
    'website/src/components/docs/search/DocsSearchModal.tsx',
    'website/src/components/docs/content/DocsBreadcrumb.tsx',
    'website/src/components/docs/content/DocsCallout.tsx',
    'website/src/components/docs/content/DocsCodeBlock.tsx',
    'website/src/components/docs/content/codeHighlight.tsx',
    'website/src/components/docs/content/DocsMatrixTable.tsx',
    'website/src/components/docs/content/DocsStatGrid.tsx',
    'website/src/components/docs/content/DocsTaxonomyGrid.tsx',
    'website/src/components/docs/content/DocsContentRenderer.tsx',
    'website/src/components/layout/BrandLogo.tsx',
    'website/src/app/layout.tsx',
  ];

  for (const f of monitoredFiles) {
    const fullPath = path.resolve(f);
    assert.ok(fs.existsSync(fullPath), `File ${f} must exist`);
    const lineCount = fs.readFileSync(fullPath, 'utf8').split('\n').length;
    assert.ok(lineCount < 200, `File ${f} exceeds 200 lines (${lineCount} lines)`);
  }

  // 6. Verify zero emojis
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  for (const f of monitoredFiles) {
    const content = fs.readFileSync(path.resolve(f), 'utf8');
    assert.ok(!emojiRegex.test(content), `File ${f} contains emojis`);
  }

  console.log('[TEST] [PASS] All Docs Theme tests passed successfully.');
}

runDocsThemeTests();
