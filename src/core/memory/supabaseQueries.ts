import { SupabaseClient } from '@supabase/supabase-js';
import { AdaptiveLearning, SessionMetrics } from '../types.js';
import { LedgerEntry } from './types.js';

export async function insertLedgerSupabase(supabase: SupabaseClient, entry: LedgerEntry): Promise<void> {
  try {
    const payload: Record<string, unknown> = {
      timestamp: entry.timestamp,
      symbol: entry.symbol.toLowerCase(),
      action: entry.action,
      price: entry.price,
      quantity: entry.quantity,
      reason: entry.reason,
      mode: entry.mode,
      outcome: entry.outcome,
      pnl: entry.pnl
    };

    if (entry.entry_value !== undefined) payload.entry_value = entry.entry_value;
    if (entry.exit_value !== undefined) payload.exit_value = entry.exit_value;
    if (entry.pnl_percentage !== undefined) payload.pnl_percentage = entry.pnl_percentage;
    if (entry.fee_cost !== undefined) payload.fee_cost = entry.fee_cost;
    if (entry.session_id !== undefined) payload.session_id = entry.session_id;

    const { error } = await supabase.from('trade_ledger').insert(payload);
    if (error && error.code !== '42501' && !error.message.includes('column')) {
      console.warn(`[WARN] Supabase logTrade: ${error.message}`);
    }
  } catch (err) {
    console.warn(`[WARN] Supabase logTrade error: ${(err as Error).message}`);
  }
}

export async function upsertSessionMetricsSupabase(supabase: SupabaseClient, metrics: SessionMetrics): Promise<void> {
  try {
    const { error } = await supabase.from('session_metrics').upsert(
      {
        session_id: metrics.session_id,
        symbol: metrics.symbol.toLowerCase(),
        started_at: metrics.started_at,
        last_updated_at: metrics.last_updated_at,
        total_entries: metrics.total_entries,
        total_wins: metrics.total_wins,
        total_losses: metrics.total_losses,
        win_rate: metrics.win_rate,
        entered_capital: metrics.entered_capital,
        closed_capital: metrics.closed_capital,
        realized_pnl: metrics.realized_pnl,
        realized_pnl_percentage: metrics.realized_pnl_percentage,
        peak_unrealized_pnl: metrics.peak_unrealized_pnl,
        peak_unrealized_pct: metrics.peak_unrealized_pct,
        active_position: metrics.active_position || null
      },
      { onConflict: 'session_id' }
    );
    if (error && error.code !== '42501' && !error.message.includes('relation')) {
      console.warn(`[WARN] Supabase session metrics: ${error.message}`);
    }
  } catch {
    // resilient
  }
}

export async function upsertLearningSupabase(supabase: SupabaseClient, learning: AdaptiveLearning): Promise<void> {
  try {
    const { data: existing } = await supabase
      .from('adaptive_learnings')
      .select('id, trigger_count')
      .eq('symbol', learning.symbol.toLowerCase())
      .eq('pattern_condition', learning.pattern_condition)
      .eq('status', 'ACTIVE')
      .limit(1);

    if (existing && existing.length > 0) {
      await supabase
        .from('adaptive_learnings')
        .update({
          loss_reason: learning.loss_reason,
          trading_rule: learning.trading_rule,
          metadata: learning.metadata || {}
        })
        .eq('id', existing[0].id);
    } else {
      await supabase.from('adaptive_learnings').insert({
        symbol: learning.symbol.toLowerCase(),
        pattern_condition: learning.pattern_condition,
        loss_reason: learning.loss_reason,
        trading_rule: learning.trading_rule,
        status: 'ACTIVE',
        trigger_count: 0,
        metadata: learning.metadata || {}
      });
    }
  } catch (err) {
    console.warn(`[WARN] Supabase recordLearning error: ${(err as Error).message}`);
  }
}

export async function selectActiveLearningsSupabase(supabase: SupabaseClient, symbol?: string): Promise<AdaptiveLearning[] | null> {
  try {
    const sym = symbol ? symbol.toLowerCase() : '';
    let query = supabase
      .from('adaptive_learnings')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false });

    if (sym) {
      query = query.or(`symbol.ilike.%${sym}%,symbol.ilike.all`);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data as AdaptiveLearning[];
    }
  } catch {
    // fallback
  }
  return null;
}

export async function selectLedgerSupabase(supabase: SupabaseClient, symbol?: string, limit = 50): Promise<LedgerEntry[] | null> {
  try {
    let query = supabase
      .from('trade_ledger')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (symbol) {
      query = query.ilike('symbol', `%${symbol.toLowerCase()}%`);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data as LedgerEntry[];
    }
  } catch {
    // fallback
  }
  return null;
}
