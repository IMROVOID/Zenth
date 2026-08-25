import { Decision, PaperOrder, BotMode } from '../types.js';

export class ExecutionEngine {
  private orderCounter = 1;

  /**
   * Simulates a paper order execution.
   * Pure paper trading: strictly no live exchange order endpoints.
   */
  executePaperOrder(
    symbol: string,
    action: Decision,
    price: number,
    quantity: number,
    reason: string,
    mode: BotMode = 'PAPER'
  ): PaperOrder {
    const notionalValue = price * quantity;
    const orderId = `PAPER-${Date.now()}-${this.orderCounter++}`;

    const order: PaperOrder = {
      id: orderId,
      symbol: symbol.toLowerCase(),
      action,
      price,
      quantity,
      notionalValue,
      reason,
      timestamp: new Date().toISOString(),
      mode
    };

    return order;
  }
}
