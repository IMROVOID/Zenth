import { AdaptiveLearning, BotRuntimeConfig } from '../types.js';
import { LedgerEntry } from '../memory/types.js';

export type ExportFormat = 'txt' | 'csv' | 'docx' | 'md' | 'pdf';

export interface ExportDataPayload {
  sessionId: string;
  sessionStartedAt: string;
  exportedAt: string;
  activeSymbol: string;
  isTradingPaused: boolean;
  currentPrice: number;
  cycleCount: number;
  totalEntries: number;
  sessionWins: number;
  sessionLosses: number;
  winRate: number;
  sessionRealizedPnL: number;
  totalClosedMoney: number;
  config: BotRuntimeConfig;
  activePosition?: {
    id: string;
    symbol: string;
    entryPrice: number;
    quantity: number;
    enteredCapital: number;
    entryTime: string;
    stopLossPrice: number;
    takeProfitPrice: number;
    patternCondition: string;
  } | null;
  ledgerEntries: LedgerEntry[];
  tickLogs: Array<{
    timestamp: string;
    cycle: number;
    symbol: string;
    price: number;
    fastMA: number;
    slowMA: number;
    rsi: number;
    enteredMoney: number;
    closedMoney: number;
    rulesCount: number;
    sessionWin: number;
    sessionLoss: number;
    pnl: number;
    message?: string;
  }>;
  activeRules: AdaptiveLearning[];
}

export interface ExportResult {
  success: boolean;
  filePath?: string;
  tradeCount: number;
  tickCount: number;
  error?: string;
}

export interface ExportModalState {
  active: boolean;
  selectedIndex: number;
  formats: ExportFormat[];
}

export interface ExportPromptState {
  active: boolean;
  format: ExportFormat;
  inputPath: string;
  cursorPosition: number;
}
