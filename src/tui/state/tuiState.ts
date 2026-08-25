import { ActiveView, ActivePositionState } from '../types.js';
import { TickLogItem } from '../views/dashboardView.js';
import { CoinInfo, StockInfo } from '../../core/market/index.js';
import { AdaptiveLearning, BotRuntimeConfig } from '../../core/types.js';
import { LedgerEntry } from '../../core/memory/index.js';
import { ExportModalState, ExportPromptState, ExportDataPayload, ExportFormat } from '../../core/export/types.js';
import { getDefaultDraftConfig, buildConfigParams } from './configSchema.js';
import { ConfigParam } from '../views/configView.js';
import { ThemeManager } from '../theme/index.js';

export interface ConfigModalState {
  active: boolean;
  paramKey: string;
  paramLabel: string;
  paramCategory?: string;
  paramDesc?: string;
  options: string[];
  selectedIndex: number;
}

export class TuiState {
  activeView: ActiveView = 'dashboard';
  inputBuffer: string = '';
  selectedDropdownIndex: number = 0;
  selectedCoinIndex: number = 0;
  selectedStockIndex: number = 0;
  selectedThemeIndex: number = 0;
  selectedConfigIndex: number = 0;
  selectedLedgerIndex: number = -1;
  selectedRuleIndex: number = -1;
  logScrollOffset: number = 0;
  hoverTab: string | undefined = undefined;

  isRunning: boolean = false;
  isTradingPaused: boolean = false;

  exportModalState: ExportModalState = {
    active: false,
    selectedIndex: 0,
    formats: ['txt', 'csv', 'md', 'docx', 'pdf']
  };

  exportPromptState: ExportPromptState = {
    active: false,
    format: 'pdf',
    inputPath: '',
    cursorPosition: 0
  };

  configModalState: ConfigModalState = {
    active: false,
    paramKey: '',
    paramLabel: '',
    paramDesc: '',
    options: [],
    selectedIndex: 0
  };

  activeConfig: BotRuntimeConfig;
  draftConfig: BotRuntimeConfig;

  sessionId: string;
  sessionStartedAt: string;
  cycleCount: number = 0;
  totalEntries: number = 0;
  sessionWins: number = 0;
  sessionLosses: number = 0;
  totalClosedMoney: number = 0;
  sessionRealizedPnL: number = 0;
  peakUnrealizedPnL: number = 0;
  peakUnrealizedPct: number = 0;
  consecutiveLosses: number = 0;

  activePosition: ActivePositionState | null = null;
  currentPrice: number = 0;
  currentFastMA: number = 0;
  currentSlowMA: number = 0;
  currentRSI: number = 50;

  activeRules: AdaptiveLearning[] = [];
  ledgerEntries: LedgerEntry[] = [];
  topCoins: CoinInfo[] = [];
  topStocks: StockInfo[] = [];
  tickLogs: TickLogItem[] = [];

  constructor() {
    this.activeConfig = getDefaultDraftConfig();
    this.draftConfig = getDefaultDraftConfig();
    this.sessionId = `ZENTH-${Date.now()}`;
    this.sessionStartedAt = new Date().toISOString();

    const themes = ThemeManager.listThemes();
    const curIdx = themes.findIndex(th => th.name === ThemeManager.currentName);
    this.selectedThemeIndex = curIdx >= 0 ? curIdx : 0;
  }

  hasUnsavedConfigChanges(): boolean {
    const keys = Object.keys(this.draftConfig) as (keyof BotRuntimeConfig)[];
    return keys.some(k => this.draftConfig[k] !== this.activeConfig[k]);
  }

  getConfigParams(): ConfigParam[] {
    return buildConfigParams(this.draftConfig, this.activeConfig);
  }

  toExportPayload(): ExportDataPayload {
    const totalWLDenom = this.sessionWins + this.sessionLosses;
    const winRate = totalWLDenom > 0 ? (this.sessionWins / totalWLDenom) * 100 : 0;

    return {
      sessionId: this.sessionId,
      sessionStartedAt: this.sessionStartedAt,
      exportedAt: new Date().toISOString(),
      activeSymbol: this.activeConfig.symbol,
      isTradingPaused: this.isTradingPaused,
      currentPrice: this.currentPrice,
      cycleCount: this.cycleCount,
      totalEntries: this.totalEntries,
      sessionWins: this.sessionWins,
      sessionLosses: this.sessionLosses,
      winRate,
      sessionRealizedPnL: this.sessionRealizedPnL,
      totalClosedMoney: this.totalClosedMoney,
      config: { ...this.activeConfig },
      activePosition: this.activePosition
        ? {
            id: this.activePosition.id,
            symbol: this.activePosition.symbol,
            entryPrice: this.activePosition.entryPrice,
            quantity: this.activePosition.quantity,
            enteredCapital: this.activePosition.enteredCapital,
            entryTime: this.activePosition.entryTime,
            stopLossPrice: this.activePosition.stopLossPrice,
            takeProfitPrice: this.activePosition.takeProfitPrice,
            patternCondition: this.activePosition.patternCondition
          }
        : null,
      ledgerEntries: [...this.ledgerEntries],
      tickLogs: [...this.tickLogs],
      activeRules: [...this.activeRules]
    };
  }
}

