#!/usr/bin/env node
import { runCli } from './index.js';

runCli().catch((err) => {
  console.error('\n[ERROR] Fatal error in Zenth CLI:', (err as Error).message);
  process.exit(1);
});

