import { SupabaseClient } from '@supabase/supabase-js';
import { ResetDatabaseResult } from './types.js';

export async function resetSupabaseTables(
  supabase: SupabaseClient,
  symbol?: string
): Promise<ResetDatabaseResult> {
  try {
    let ledgerQuery = supabase.from('trade_ledger').delete();
    let learningsQuery = supabase.from('adaptive_learnings').delete();
    let metricsQuery = supabase.from('session_metrics').delete();

    if (symbol && symbol.toLowerCase() !== 'all') {
      const sym = symbol.toLowerCase();
      ledgerQuery = ledgerQuery.eq('symbol', sym);
      learningsQuery = learningsQuery.eq('symbol', sym);
      metricsQuery = metricsQuery.eq('symbol', sym);
    } else {
      // Supabase requires a WHERE clause for delete(); neq with impossible id deletes all rows
      ledgerQuery = ledgerQuery.neq('id', '00000000-0000-0000-0000-000000000000');
      learningsQuery = learningsQuery.neq('id', '00000000-0000-0000-0000-000000000000');
      metricsQuery = metricsQuery.neq('id', '00000000-0000-0000-0000-000000000000');
    }

    const [resLedger, resLearnings, resMetrics] = await Promise.all([
      ledgerQuery.select('id'),
      learningsQuery.select('id'),
      metricsQuery.select('id')
    ]);

    const countLedger = resLedger.data?.length || 0;
    const countLearnings = resLearnings.data?.length || 0;
    const countMetrics = resMetrics.data?.length || 0;

    return {
      success: true,
      deletedLedger: countLedger,
      deletedLearnings: countLearnings,
      deletedMetrics: countMetrics,
      message: `Deleted ${countLedger} trades, ${countLearnings} rules, and ${countMetrics} session metrics.`
    };
  } catch (err: unknown) {
    return {
      success: false,
      deletedLedger: 0,
      deletedLearnings: 0,
      deletedMetrics: 0,
      message: `Failed to reset Supabase tables: ${(err as Error).message}`
    };
  }
}
