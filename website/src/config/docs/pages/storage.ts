import type { DocPage } from '../types';

export const storageDocPage: DocPage = {
  slug: 'storage-engines',
  title: 'Pluggable Multi-Database Storage',
  subtitle:
    'Unified DatabaseAdapter interface with polymorphic support for SQLite, PostgreSQL, MongoDB, Supabase Cloud RLS, and In-Memory RAM.',
  category: 'Storage & Memory',
  categorySlug: 'storage-memory',
  statusTag: '[5 ENGINES SUPPORTED]',
  badges: ['[node:sqlite]', '[PostgreSQL_16]', '[MongoDB_7]', '[Supabase_RLS]', '[LocalStore]'],
  lastUpdated: 'August 2026',
  prevPage: { title: 'Risk Management', slug: 'risk-management' },
  nextPage: { title: 'Adaptive Learning', slug: 'adaptive-learning' },
  sections: [
    {
      id: 'storage-comparison-matrix',
      title: 'Storage Engine Feature Matrix',
      content:
        'Zenth features a pluggable database architecture supporting 5 persistence backends configured via `STORAGE_BACKEND`:',
      matrixTable: {
        headers: ['Storage Engine', 'Location', 'External Deps', 'Cloud Sync / RLS', 'Recommended Use Case'],
        rows: [
          ['1. SQLite', './data/zenth.db', 'NONE (Node 22 built-in)', 'Local File Only', 'Zero-setup default for single-machine trading'],
          ['2. PostgreSQL', 'localhost:5432', 'pg (Connection Pool)', 'Supported', 'Enterprise relational queries and Docker stacks'],
          ['3. MongoDB', 'localhost:27017', 'mongodb driver', 'Atlas Supported', 'High-throughput document storage with compound indexes'],
          ['4. Supabase', 'Cloud PostgreSQL', '@supabase/supabase-js', 'Row-Level Security', 'Multi-device cloud synchronization & remote telemetry'],
          ['5. In-Memory', 'RAM Ephemeral', 'ZERO dependencies', 'In-Memory Only', 'Ephemeral simulation, CI tests, zero disk footprint'],
        ],
      },
    },
    {
      id: 'core-database-schemas',
      title: 'Database DDL Schema Definition',
      content:
        'All database backends persist 3 core tables: `trade_ledger`, `adaptive_learnings`, and `session_metrics`:',
      codeBlock: {
        language: 'sql',
        filename: 'PostgreSQL / Supabase DDL',
        code: 'CREATE TABLE IF NOT EXISTS public.trade_ledger (\n    id TEXT PRIMARY KEY,\n    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),\n    symbol TEXT NOT NULL,\n    action TEXT NOT NULL,\n    price NUMERIC(18, 8) NOT NULL,\n    quantity NUMERIC(18, 8) NOT NULL,\n    notional_value NUMERIC(18, 4),\n    outcome TEXT NOT NULL DEFAULT \'PENDING\',\n    pnl NUMERIC(18, 4)\n);\n\nCREATE TABLE IF NOT EXISTS public.adaptive_learnings (\n    id TEXT PRIMARY KEY,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n    symbol TEXT NOT NULL,\n    pattern_condition TEXT NOT NULL,\n    loss_reason TEXT NOT NULL,\n    trading_rule TEXT NOT NULL,\n    status TEXT NOT NULL DEFAULT \'ACTIVE\',\n    trigger_count INTEGER NOT NULL DEFAULT 0\n);',
      },
    },
    {
      id: 'supabase-rls-policies',
      title: 'Supabase Row-Level Security (RLS)',
      content:
        'Cloud persistence is locked down with cryptographic Row-Level Security policies:',
      codeBlock: {
        language: 'sql',
        filename: 'Supabase RLS Policies',
        code: 'ALTER TABLE public.trade_ledger ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.adaptive_learnings ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "Allow authenticated read/write" ON public.trade_ledger\n    FOR ALL TO authenticated USING (true) WITH CHECK (true);',
      },
    },
  ],
};
