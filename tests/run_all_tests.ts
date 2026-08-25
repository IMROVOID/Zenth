import { spawnSync } from 'node:child_process';
import path from 'node:path';

interface TestSuiteResult {
  file: string;
  name: string;
  success: boolean;
  durationMs: number;
  errorOutput?: string;
}

const testSuites = [
  { file: 'test_strategy_indicators.ts', name: 'Strategy & Indicators (SMA, RSI, Crossover)' },
  { file: 'test_risk_manager.ts', name: 'Risk Manager & Circuit Breakers ($1,000 Cap)' },
  { file: 'test_adaptive_filter.ts', name: 'Adaptive Memory Filter & Learning Triggers' },
  { file: 'test_execution_position.ts', name: 'Execution Engine & Position Management' },
  { file: 'test_market_service.ts', name: 'Market Service, Search & Synthetic Data' },
  { file: 'test_replay_engine.ts', name: 'Replay Engine, Metrics & Pattern Classifier' },
  { file: 'test_bot_session_loop.ts', name: 'Session Tracker & Scanner Integration' },
  { file: 'test_tui_utils.ts', name: 'TUI Utils, Box Drawing & Config Cycling' },
  { file: 'test_export_clipboard.ts', name: 'Export Formats (TXT/CSV/MD/DOCX/PDF) & Clipboard' },
  { file: 'test_database_reset.ts', name: 'Database Wipe & Reset Functionality' },
  { file: 'test_env_config.ts', name: 'Environment Validator & Writer Across Backends' },
  { file: 'test_theme_presets.ts', name: 'Theme Presets & Palette Verification' },
  { file: 'test_tui_command_flow.ts', name: 'TUI Command Execution Flow E2E' }
];

console.log('╔══════════════════════════════════════════════════════════════════════════════════╗');
console.log('║               ZENTH TRADING BOT — MASTER TEST SUITE RUNNER                      ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════════╝\n');

const results: TestSuiteResult[] = [];
let allPassed = true;

for (const suite of testSuites) {
  const filePath = path.join(process.cwd(), 'tests', suite.file);
  process.stdout.write(`[RUNNING] ${suite.name.padEnd(52, ' ')} ... `);

  const start = Date.now();
  const res = spawnSync('npx', ['tsx', filePath], {
    cwd: process.cwd(),
    encoding: 'utf-8',
    shell: true
  });
  const durationMs = Date.now() - start;

  if (res.status === 0) {
    console.log(`[PASS] (${durationMs}ms)`);
    results.push({ file: suite.file, name: suite.name, success: true, durationMs });
  } else {
    console.log(`[FAIL] (${durationMs}ms)`);
    allPassed = false;
    results.push({
      file: suite.file,
      name: suite.name,
      success: false,
      durationMs,
      errorOutput: (res.stderr || res.stdout || 'Unknown error').trim()
    });
  }
}

console.log('\n┌──────────────────────────────────────────────────────────────────────────────────────────────────┐');
console.log('│ #  │ Test Suite                                        │ Status  │ Duration  │ Test File         │');
console.log('├────┼───────────────────────────────────────────────────┼─────────┼───────────┼───────────────────┤');

results.forEach((r, idx) => {
  const num = String(idx + 1).padStart(2, ' ');
  const name = r.name.padEnd(49, ' ');
  const status = r.success ? '[PASS] ' : '[FAIL] ';
  const dur = `${r.durationMs}ms`.padStart(9, ' ');
  const file = r.file.padEnd(17, ' ');
  console.log(`│ ${num} │ ${name} │ ${status} │ ${dur} │ ${file} │`);
});

console.log('└────┴───────────────────────────────────────────────────┴─────────┴───────────┴───────────────────┘\n');

if (allPassed) {
  console.log(`[OK] ALL ${results.length} TEST SUITES PASSED CLEANLY! (Total time: ${results.reduce((a, b) => a + b.durationMs, 0)}ms)\n`);
  process.exit(0);
} else {
  console.error('[ERROR] One or more test suites failed.');
  results.filter(r => !r.success).forEach(r => {
    console.error(`\n--- Failure details for ${r.name} (${r.file}) ---`);
    console.error(r.errorOutput);
  });
  process.exit(1);
}
