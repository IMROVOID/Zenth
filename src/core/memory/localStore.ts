import { AdaptiveLearning, SessionMetrics } from '../types.js';
import { LedgerEntry } from './types.js';

export class LocalMemoryStore {
  private localLedger: LedgerEntry[] = [];
  private localLearnings: Map<string, AdaptiveLearning> = new Map();
  private localSession: SessionMetrics | null = null;

  addLedgerEntry(entry: LedgerEntry): void {
    this.localLedger.push({ ...entry });
  }

  getLedger(symbol?: string, limit = 50): LedgerEntry[] {
    const sym = symbol ? symbol.toLowerCase() : '';
    const filtered = sym
      ? this.localLedger.filter(l => l.symbol.toLowerCase().includes(sym))
      : this.localLedger;
    return [...filtered].reverse().slice(0, limit);
  }

  getLatestLedgerEntry(symbol?: string): LedgerEntry | null {
    if (this.localLedger.length === 0) return null;
    if (!symbol) return this.localLedger[this.localLedger.length - 1];
    const sym = symbol.toLowerCase();
    for (let i = this.localLedger.length - 1; i >= 0; i--) {
      if (this.localLedger[i].symbol.toLowerCase() === sym) {
        return this.localLedger[i];
      }
    }
    return null;
  }

  setLearning(learning: AdaptiveLearning): void {
    const key = `${learning.symbol.toLowerCase()}_${learning.pattern_condition}`;
    this.localLearnings.set(key, { ...learning });
  }

  getActiveLearnings(symbol?: string): AdaptiveLearning[] {
    const sym = symbol ? symbol.toLowerCase() : '';
    return Array.from(this.localLearnings.values()).filter(
      l => (!sym || l.symbol.toLowerCase() === sym || l.symbol.toLowerCase() === 'all') && l.status === 'ACTIVE'
    );
  }

  getLatestLearning(symbol?: string): AdaptiveLearning | null {
    const arr = this.getActiveLearnings(symbol);
    return arr.length > 0 ? arr[arr.length - 1] : null;
  }

  incrementTrigger(ruleId: string): void {
    for (const rule of this.localLearnings.values()) {
      if (rule.id === ruleId || rule.pattern_condition === ruleId) {
        rule.trigger_count = (rule.trigger_count || 0) + 1;
        rule.last_triggered_at = new Date().toISOString();
      }
    }
  }

  setSessionMetrics(metrics: SessionMetrics): void {
    this.localSession = { ...metrics };
  }

  getSessionMetrics(): SessionMetrics | null {
    return this.localSession ? { ...this.localSession } : null;
  }

  clear(symbol?: string): { deletedLedger: number; deletedLearnings: number } {
    const deletedLedger = this.localLedger.length;
    const deletedLearnings = this.localLearnings.size;

    if (symbol) {
      const sym = symbol.toLowerCase();
      this.localLedger = this.localLedger.filter(l => l.symbol.toLowerCase() !== sym);
      for (const [k, v] of this.localLearnings.entries()) {
        if (v.symbol.toLowerCase() === sym) {
          this.localLearnings.delete(k);
        }
      }
    } else {
      this.localLedger = [];
      this.localLearnings.clear();
      this.localSession = null;
    }

    return { deletedLedger, deletedLearnings };
  }
}
