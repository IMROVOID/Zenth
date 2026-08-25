import { TuiState } from '../state/tuiState.js';
import { MarketService } from '../../core/market/marketService.js';
import { MemoryService } from '../../core/memory/memoryService.js';

export async function loadInitialTuiData(
  state: TuiState,
  market: MarketService,
  memory: MemoryService,
  render: () => void
): Promise<void> {
  try {
    const [coins, stocks, rules, ledger] = await Promise.all([
      market.fetchTopCoins(),
      market.fetchTopStocks(),
      memory.getActiveLearnings(state.activeConfig.symbol),
      memory.getLedger(state.activeConfig.symbol, 30)
    ]);
    state.topCoins = coins;
    state.topStocks = stocks;
    state.activeRules = rules;
    state.ledgerEntries = ledger;
    render();
  } catch {
    // fallback
  }
}
