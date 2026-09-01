'use strict';

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

console.log('=================================================================================');
console.log('               ZENTH REPOSITORY COMPREHENSIVE VERIFICATION SUITE                ');
console.log('=================================================================================');

let failed = false;

function runStep(name: string, command: string, cwd: string = process.cwd()) {
  const start = Date.now();
  process.stdout.write(`[RUNNING] ${name.padEnd(55)} ... `);
  try {
    execSync(command, { cwd, stdio: 'pipe' });
    const duration = Date.now() - start;
    console.log(`[PASS] (${duration}ms)`);
  } catch (error: any) {
    const duration = Date.now() - start;
    console.log(`[FAIL] (${duration}ms)`);
    if (error.stdout) console.log(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
    failed = true;
  }
}

function checkLineCeilings(dir: string, excludes: string[] = ['node_modules', '.next', 'dist', 'out']) {
  const start = Date.now();
  process.stdout.write(`[RUNNING] ${'Source File Ceiling Audit (< 200 lines/file)'.padEnd(55)} ... `);
  
  let violations: { file: string; lines: number }[] = [];

  function scan(current: string) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (excludes.includes(entry.name) || entry.name.startsWith('.')) continue;
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (/\.(ts|tsx|css|js|mjs)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n').length;
        if (lines >= 200) {
          violations.push({ file: path.relative(process.cwd(), fullPath), lines });
        }
      }
    }
  }

  scan(dir);

  const duration = Date.now() - start;
  if (violations.length === 0) {
    console.log(`[PASS] (${duration}ms)`);
  } else {
    console.log(`[FAIL] (${duration}ms)`);
    console.error(`\n[ERROR] Found ${violations.length} files exceeding 200 lines:`);
    violations.forEach((v) => console.error(` - ${v.file}: ${v.lines} lines`));
    failed = true;
  }
}

  // 1. TypeScript Root Compiler Check
  runStep('Root TypeScript Typecheck', 'npx tsc --noEmit');

  // 2. Docs Theme & Token Verification Suite
  runStep('Docs Theme & RGB Token Suite', 'npx tsx tests/test_docs_theme.ts');

  // 3. Source File Line Ceilings
  checkLineCeilings(path.join(process.cwd(), 'website/src'));

  // 4. Next.js Website Static Production Build
  runStep('Next.js Static Export Build', 'npm run build', path.join(process.cwd(), 'website'));

  // 5. Master Trading Bot Test Suite
  runStep('Master Trading Bot Test Suite (14 Suites)', 'npx tsx tests/run_all_tests.ts');

  console.log('\n' + '-'.repeat(82));
  if (failed) {
    console.error('[FAIL] VERIFICATION FAILED. Fix errors before merging.');
    process.exit(1);
  } else {
    console.log('[OK] ALL REPOSITORY CHECKS & TEST SUITES PASSED CLEANLY! READY FOR MERGE.');
  }
