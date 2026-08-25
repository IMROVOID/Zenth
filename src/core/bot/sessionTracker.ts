import { SessionMetrics } from '../types.js';
import { MemoryService } from '../memory/memoryService.js';
import { ActivePosition } from './types.js';

export class SessionTracker {
  readonly sessionId: string;
  readonly sessionStartedAt: string;
  totalEntries = 0;
  sessionWins = 0;
  sessionLosses = 0;
  totalClosedMoney = 0;
  sessionRealizedPnL = 0;
  peakUnrealizedPnL = 0;
  peakUnrealizedPct = 0;
  consecutiveLosses = 0;

  constructor() {
    this.sessionId = `SESSION-${Date.now()}`;
    this.sessionStartedAt = new Date().toISOString();
  }

  get completedTrades(): number {
    return this.sessionWins + this.sessionLosses;
  }

  get winRate(): number {
    return this.completedTrades > 0 ? (this.sessionWins / this.completedTrades) * 100 : 0;
  }

  getRealizedPct(targetAllocation: number): number {
    return targetAllocation > 0 ? (this.sessionRealizedPnL / targetAllocation) * 100 : 0;
  }

  buildMetrics(
    symbol: string,
    activePosition: ActivePosition | null,
    targetAllocation: number,
    activePosVal?: number,
    activePosPnL?: number,
    activePosPct?: number
  ): SessionMetrics {
    return {
      session_id: this.sessionId,
      symbol: symbol.toLowerCase(),
      started_at: this.sessionStartedAt,
      last_updated_at: new Date().toISOString(),
      total_entries: this.totalEntries,
      total_wins: this.sessionWins,
      total_losses: this.sessionLosses,
      win_rate: this.winRate,
      entered_capital: activePosition ? activePosition.enteredCapital : 0,
      closed_capital: this.totalClosedMoney,
      realized_pnl: this.sessionRealizedPnL,
      realized_pnl_percentage: this.getRealizedPct(targetAllocation),
      peak_unrealized_pnl: this.peakUnrealizedPnL,
      peak_unrealized_pct: this.peakUnrealizedPct,
      active_position: activePosition
        ? {
            ...activePosition,
            currentValue: activePosVal,
            floatingPnL: activePosPnL,
            floatingPct: activePosPct
          }
        : null
    };
  }

  async sync(
    memory: MemoryService,
    symbol: string,
    activePosition: ActivePosition | null,
    targetAllocation: number,
    activePosVal?: number,
    activePosPnL?: number,
    activePosPct?: number
  ): Promise<void> {
    const metrics = this.buildMetrics(
      symbol,
      activePosition,
      targetAllocation,
      activePosVal,
      activePosPnL,
      activePosPct
    );
    await memory.updateSessionMetrics(metrics);
  }
}
