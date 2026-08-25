export const POSTGRES_SCHEMA_SQL = `-- Zenth Trading Bot PostgreSQL Schema
CREATE TABLE IF NOT EXISTS public.trade_ledger (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    symbol TEXT NOT NULL,
    action TEXT NOT NULL,
    price NUMERIC(18, 8) NOT NULL,
    quantity NUMERIC(18, 8) NOT NULL,
    notional_value NUMERIC(18, 4),
    entry_value NUMERIC(18, 4),
    exit_value NUMERIC(18, 4),
    pnl_percentage NUMERIC(18, 4),
    fee_cost NUMERIC(18, 4),
    session_id TEXT,
    reason TEXT,
    mode TEXT NOT NULL DEFAULT 'PAPER',
    outcome TEXT NOT NULL DEFAULT 'PENDING',
    pnl NUMERIC(18, 4)
);

CREATE INDEX IF NOT EXISTS idx_trade_ledger_symbol ON public.trade_ledger(symbol);
CREATE INDEX IF NOT EXISTS idx_trade_ledger_timestamp ON public.trade_ledger(timestamp DESC);

CREATE TABLE IF NOT EXISTS public.adaptive_learnings (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    symbol TEXT NOT NULL,
    pattern_condition TEXT NOT NULL,
    loss_reason TEXT NOT NULL,
    trading_rule TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    trigger_count INTEGER NOT NULL DEFAULT 0,
    last_triggered_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_adaptive_learnings_symbol ON public.adaptive_learnings(symbol);
CREATE INDEX IF NOT EXISTS idx_adaptive_learnings_status ON public.adaptive_learnings(status);

CREATE TABLE IF NOT EXISTS public.session_metrics (
    id TEXT PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    symbol TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    last_updated_at TIMESTAMPTZ NOT NULL,
    total_entries INTEGER NOT NULL DEFAULT 0,
    total_wins INTEGER NOT NULL DEFAULT 0,
    total_losses INTEGER NOT NULL DEFAULT 0,
    win_rate NUMERIC(8, 4) NOT NULL DEFAULT 0,
    entered_capital NUMERIC(18, 4) NOT NULL DEFAULT 0,
    closed_capital NUMERIC(18, 4) NOT NULL DEFAULT 0,
    realized_pnl NUMERIC(18, 4) NOT NULL DEFAULT 0,
    realized_pnl_percentage NUMERIC(18, 4) NOT NULL DEFAULT 0,
    peak_unrealized_pnl NUMERIC(18, 4) NOT NULL DEFAULT 0,
    peak_unrealized_pct NUMERIC(18, 4) NOT NULL DEFAULT 0,
    active_position JSONB
);

CREATE INDEX IF NOT EXISTS idx_session_metrics_session_id ON public.session_metrics(session_id);
`;

export const SQLITE_SCHEMA_SQL = `-- Zenth Trading Bot SQLite Schema
CREATE TABLE IF NOT EXISTS trade_ledger (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    symbol TEXT NOT NULL,
    action TEXT NOT NULL,
    price REAL NOT NULL,
    quantity REAL NOT NULL,
    notional_value REAL,
    entry_value REAL,
    exit_value REAL,
    pnl_percentage REAL,
    fee_cost REAL,
    session_id TEXT,
    reason TEXT,
    mode TEXT NOT NULL DEFAULT 'PAPER',
    outcome TEXT NOT NULL DEFAULT 'PENDING',
    pnl REAL
);

CREATE INDEX IF NOT EXISTS idx_trade_ledger_symbol ON trade_ledger(symbol);
CREATE INDEX IF NOT EXISTS idx_trade_ledger_timestamp ON trade_ledger(timestamp DESC);

CREATE TABLE IF NOT EXISTS adaptive_learnings (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    symbol TEXT NOT NULL,
    pattern_condition TEXT NOT NULL,
    loss_reason TEXT NOT NULL,
    trading_rule TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    trigger_count INTEGER NOT NULL DEFAULT 0,
    last_triggered_at TEXT,
    metadata TEXT DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_adaptive_learnings_symbol ON adaptive_learnings(symbol);
CREATE INDEX IF NOT EXISTS idx_adaptive_learnings_status ON adaptive_learnings(status);

CREATE TABLE IF NOT EXISTS session_metrics (
    id TEXT PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    symbol TEXT NOT NULL,
    started_at TEXT NOT NULL,
    last_updated_at TEXT NOT NULL,
    total_entries INTEGER NOT NULL DEFAULT 0,
    total_wins INTEGER NOT NULL DEFAULT 0,
    total_losses INTEGER NOT NULL DEFAULT 0,
    win_rate REAL NOT NULL DEFAULT 0,
    entered_capital REAL NOT NULL DEFAULT 0,
    closed_capital REAL NOT NULL DEFAULT 0,
    realized_pnl REAL NOT NULL DEFAULT 0,
    realized_pnl_percentage REAL NOT NULL DEFAULT 0,
    peak_unrealized_pnl REAL NOT NULL DEFAULT 0,
    peak_unrealized_pct REAL NOT NULL DEFAULT 0,
    active_position TEXT
);

CREATE INDEX IF NOT EXISTS idx_session_metrics_session_id ON session_metrics(session_id);
`;

export const SUPABASE_SCHEMA_SQL = POSTGRES_SCHEMA_SQL + `
ALTER TABLE public.trade_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adaptive_learnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_metrics ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'trade_ledger_all') THEN
        CREATE POLICY trade_ledger_all ON public.trade_ledger FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'adaptive_learnings_all') THEN
        CREATE POLICY adaptive_learnings_all ON public.adaptive_learnings FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'session_metrics_all') THEN
        CREATE POLICY session_metrics_all ON public.session_metrics FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;
`;
