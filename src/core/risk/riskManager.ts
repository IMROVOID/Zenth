import { Signal, RiskCheckResult } from '../types.js';

export class RiskManager {
  readonly maxNotionalCap: number;
  readonly maxDailyLoss: number;
  readonly maxConsecutiveLosses: number;

  constructor(maxNotionalCap = 1000.0, maxDailyLoss = 0, maxConsecutiveLosses = 0) {
    this.maxNotionalCap = maxNotionalCap;
    this.maxDailyLoss = maxDailyLoss;
    this.maxConsecutiveLosses = maxConsecutiveLosses;
  }

  /**
   * Evaluates proposed trade signal against strict risk management constraints and circuit breakers.
   */
  evaluate(
    signal: Signal,
    price: number,
    quantity: number,
    sessionRealizedPnL = 0,
    consecutiveLosses = 0
  ): RiskCheckResult {
    if (signal === 'HOLD') {
      return {
        approved: false,
        decision: 'HOLD',
        reason: 'Signal is HOLD; no trade action required.',
        notionalValue: 0,
        quantity
      };
    }

    // Circuit Breaker: Max Daily Drawdown / Loss
    if (this.maxDailyLoss > 0 && sessionRealizedPnL <= -this.maxDailyLoss) {
      return {
        approved: false,
        decision: 'SKIP',
        reason: `Circuit Breaker: Session loss ($${sessionRealizedPnL.toFixed(2)}) reached max daily loss limit ($${this.maxDailyLoss.toFixed(2)}). Trading halted.`,
        notionalValue: 0,
        quantity
      };
    }

    // Circuit Breaker: Max Consecutive Losses
    if (this.maxConsecutiveLosses > 0 && consecutiveLosses >= this.maxConsecutiveLosses) {
      return {
        approved: false,
        decision: 'SKIP',
        reason: `Circuit Breaker: Consecutive loss streak (${consecutiveLosses}) reached limit (${this.maxConsecutiveLosses}). Trading halted.`,
        notionalValue: 0,
        quantity
      };
    }

    if (price <= 0 || quantity <= 0) {
      return {
        approved: false,
        decision: 'SKIP',
        reason: `Invalid price ($${price}) or quantity (${quantity}). Trade rejected by risk engine.`,
        notionalValue: 0,
        quantity
      };
    }

    const notionalValue = price * quantity;

    // Hard Risk Cap check ($1,000 USD/USDT maximum)
    if (notionalValue > this.maxNotionalCap) {
      return {
        approved: false,
        decision: 'SKIP',
        reason: `Order value $${notionalValue.toFixed(2)} exceeds $${this.maxNotionalCap.toFixed(2)} maximum allocation limit.`,
        notionalValue,
        quantity
      };
    }

    return {
      approved: true,
      decision: signal,
      reason: `Risk check passed: Notional allocation $${notionalValue.toFixed(2)} is within safe $${this.maxNotionalCap.toFixed(2)} cap.`,
      notionalValue,
      quantity
    };
  }
}
