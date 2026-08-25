import { OnboardingStep, OnboardingStateData } from './onboardingTypes.js';
import { MarketService } from '../../core/market/marketService.js';
import { StorageBackendType } from '../../core/config/types.js';

export class OnboardingState {
  marketService = new MarketService((process.env.EXCHANGE as any) || 'binance');

  data: OnboardingStateData = {
    currentStep: 'STORAGE_CHOICE',
    selectedOptionIndex: 0,
    storageBackend: (process.env.STORAGE_BACKEND as StorageBackendType) || 'sqlite',
    sqlitePath: process.env.SQLITE_DB_PATH || './data/zenth.db',
    postgresSetupMode: 'auto',
    postgresHost: process.env.POSTGRES_HOST || 'localhost',
    postgresPort: process.env.POSTGRES_PORT || '5432',
    postgresUser: process.env.POSTGRES_USER || 'postgres',
    postgresPassword: process.env.POSTGRES_PASSWORD || 'postgres',
    postgresDatabase: process.env.POSTGRES_DATABASE || 'zenth',
    postgresUrl: process.env.POSTGRES_URL || '',
    activePostgresField: 'host',
    mongoSetupMode: 'auto',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    mongoHost: 'localhost',
    mongoPort: '27017',
    mongoDatabase: process.env.MONGODB_DATABASE || 'zenth',
    activeMongoField: 'uri',
    supabaseSetupMode: 'manual',
    supabasePatToken: '',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_KEY || '',
    activeCredentialField: 'url',
    tradingParams: {
      exchange: (process.env.EXCHANGE as any) || 'binance',
      symbol: process.env.DEFAULT_SYMBOL || 'btc_usdt',
      interval: process.env.DEFAULT_INTERVAL || '5m',
      quantity: 0.01,
      maxPositionNotionalCap: 1000.0,
      stopLossPct: 1.5,
      takeProfitPct: 3.0,
      candleLookback: 300
    },
    activeTradingParamIndex: 0,
    activeParamPickerKey: null,
    paramPickerSelectedIndex: 0,
    symbolSearchQuery: '',
    symbolCategoryFilter: 'ALL',
    symbolSelectedIndex: 0,
    availableSymbols: [],
    isLoadingSymbols: false,
    validationResult: null,
    isValidating: false,
    isAutoProvisioning: false,
    statusMessage: '',
    copiedNotice: ''
  };

  stepHistory: OnboardingStep[] = [];
  private noticeTimer: NodeJS.Timeout | null = null;
  private statusTimer: NodeJS.Timeout | null = null;

  async loadSymbols(render?: () => void): Promise<void> {
    if (this.data.availableSymbols.length > 0 || this.data.isLoadingSymbols) return;
    this.data.isLoadingSymbols = true;
    if (render) render();

    try {
      const [coins, stocks] = await Promise.all([
        this.marketService.fetchTopCoins(),
        this.marketService.fetchTopStocks()
      ]);

      const items = [
        ...coins.map(c => ({
          symbol: c.symbol,
          ticker: c.baseCoin,
          name: c.fullName,
          price: c.price,
          change24hPct: c.change24hPct,
          type: 'crypto' as const,
          sparkline: c.sparkline
        })),
        ...stocks.map(s => ({
          symbol: s.symbol,
          ticker: s.ticker,
          name: s.companyName,
          price: s.price,
          change24hPct: s.change24hPct,
          type: 'stock' as const,
          sparkline: s.sparkline
        }))
      ];

      this.data.availableSymbols = items;
    } catch {
      this.setStatusMessage('Could not load live asset list. Using standard pairs.', render);
    } finally {
      this.data.isLoadingSymbols = false;
      if (render) render();
    }
  }

  setNotice(msg: string, render?: () => void): void {
    this.data.copiedNotice = msg;
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
    if (msg) {
      this.noticeTimer = setTimeout(() => {
        this.data.copiedNotice = '';
        if (render) render();
      }, 2500);
    }
  }

  setStatusMessage(msg: string, render?: () => void): void {
    this.data.statusMessage = msg;
    if (this.statusTimer) clearTimeout(this.statusTimer);
    if (msg) {
      this.statusTimer = setTimeout(() => {
        this.data.statusMessage = '';
        if (render) render();
      }, 3500);
    }
  }

  goToStep(next: OnboardingStep): void {
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
    if (this.statusTimer) clearTimeout(this.statusTimer);
    this.stepHistory.push(this.data.currentStep);
    this.data.currentStep = next;
    this.data.selectedOptionIndex = 0;
    this.data.statusMessage = '';
    this.data.copiedNotice = '';
  }

  goBack(): boolean {
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
    if (this.statusTimer) clearTimeout(this.statusTimer);
    if (this.stepHistory.length > 0) {
      const prev = this.stepHistory.pop()!;
      this.data.currentStep = prev;
      this.data.statusMessage = '';
      this.data.copiedNotice = '';
      return true;
    }
    return false;
  }
}
