import fs from 'node:fs';
import path from 'node:path';

const readmePath = path.resolve('README.md');
const backupPath = path.resolve('.README.project.bak');

export function prepareNpmReadme(): void {
  if (!fs.existsSync(readmePath)) return;
  const content = fs.readFileSync(readmePath, 'utf-8');
  fs.writeFileSync(backupPath, content, 'utf-8');

  const cleaned = content.replace(
    /<img\s+src=["']assets\/zenth-banner\.svg["'][^>]*>\s*/gi,
    '# ZENTH — QUANTITATIVE CRYPTO TRADING TERMINAL\n\n'
  );

  fs.writeFileSync(readmePath, cleaned, 'utf-8');
  console.log('[OK] Prepared clean NPM README');
}

export function restoreProjectReadme(): void {
  if (fs.existsSync(backupPath)) {
    const backupContent = fs.readFileSync(backupPath, 'utf-8');
    fs.writeFileSync(readmePath, backupContent, 'utf-8');
    fs.unlinkSync(backupPath);
    console.log('[OK] Restored original project README');
  }
}

const action = process.argv[2];
if (action === 'restore') {
  restoreProjectReadme();
} else if (action === 'prepare') {
  prepareNpmReadme();
}
