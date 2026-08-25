import { CoinInfo, StockInfo, XtTickerResponse } from './types.js';
import { COIN_FULL_NAMES, STOCK_COMPANY_NAMES } from './dictionaries.js';
import { getFallbackCoins, getFallbackStocks } from './fallbackData.js';
import { generateSparkline } from './synthetic.js';

export async function fetchMarketTicker(
  symbol: string,
  baseUrl: string,
  futuresBaseUrl: string
): Promise<{ price: number; high: number; low: number; volume: number; changePct: number }> {
  const formattedSymbol = symbol.toLowerCase().replace('/', '_');

  try {
    const url = `${baseUrl}/ticker/24h?symbol=${formattedSymbol}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (response.ok) {
      const data = (await response.json()) as XtTickerResponse;
      if (data.rc === 0 && data.result && data.result.length > 0) {
        const item = data.result[0];
        return {
          price: parseFloat(item.c) || 0,
          high: parseFloat(item.h) || 0,
          low: parseFloat(item.l) || 0,
          volume: parseFloat(item.v) || 0,
          changePct: (parseFloat(item.cr) || 0) * 100
        };
      }
    }
  } catch {
    // try futures
  }

  try {
    const futUrl = `${futuresBaseUrl}/q/tickers`;
    const futResponse = await fetch(futUrl, { signal: AbortSignal.timeout(3000) });
    if (futResponse.ok) {
      const futData = (await futResponse.json()) as any;
      if (futData?.returnCode === 0 && Array.isArray(futData.result)) {
        const item = futData.result.find((t: any) => t.s?.toLowerCase() === formattedSymbol);
        if (item) {
          return {
            price: parseFloat(item.c) || 0,
            high: parseFloat(item.h) || 0,
            low: parseFloat(item.l) || 0,
            volume: parseFloat(item.v) || 0,
            changePct: (parseFloat(item.r) || 0) * 100
          };
        }
      }
    }
  } catch {
    // fallback
  }

  return { price: 100, high: 105, low: 95, volume: 100000, changePct: 0 };
}

export async function fetchTopCoinsData(baseUrl: string): Promise<CoinInfo[]> {
  try {
    const url = `${baseUrl}/ticker/24h`;
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (response.ok) {
      const data = (await response.json()) as XtTickerResponse;
      if (data.rc === 0 && Array.isArray(data.result)) {
        const usdtPairs = data.result.filter(r => r.s.endsWith('_usdt'));
        usdtPairs.sort((a, b) => (parseFloat(b.v) || 0) - (parseFloat(a.v) || 0));

        return usdtPairs.slice(0, 40).map(item => {
          const sym = item.s.toLowerCase();
          const base = sym.replace('_usdt', '').toUpperCase();
          const baseKey = base.toLowerCase();
          const price = parseFloat(item.c) || 0;
          const change24hPct = (parseFloat(item.cr) || 0) * 100;
          const high = parseFloat(item.h) || price;
          const low = parseFloat(item.l) || price;

          return {
            symbol: sym,
            baseCoin: base,
            fullName: COIN_FULL_NAMES[baseKey] || `${base} Token`,
            price,
            change24hPct,
            volume24h: parseFloat(item.v) || 0,
            sparkline: generateSparkline(price, change24hPct, high, low, 16)
          };
        });
      }
    }
  } catch {
    // fallback
  }

  return getFallbackCoins();
}

export async function fetchTopStocksData(futuresBaseUrl: string): Promise<StockInfo[]> {
  try {
    const [symbolsRes, tickersRes] = await Promise.all([
      fetch(`${futuresBaseUrl}/symbol/list`, { signal: AbortSignal.timeout(4000) }),
      fetch(`${futuresBaseUrl}/q/tickers`, { signal: AbortSignal.timeout(4000) })
    ]);

    if (symbolsRes.ok && tickersRes.ok) {
      const symbolsData = (await symbolsRes.json()) as any;
      const tickersData = (await tickersRes.json()) as any;
      const tickersMap = new Map<string, any>();
      if (Array.isArray(tickersData?.result)) {
        for (const t of tickersData.result) {
          tickersMap.set(t.s?.toLowerCase(), t);
        }
      }

      const allSymbols = (symbolsData?.result || []) as any[];
      const tradfiSymbols = allSymbols.filter(s =>
        (s.plates && (s.plates.includes(31) || s.plates.includes(35))) ||
        STOCK_COMPANY_NAMES[s.baseCoin?.toLowerCase()] ||
        STOCK_COMPANY_NAMES[s.symbol?.toLowerCase().replace('_usdt', '')]
      );

      if (tradfiSymbols.length > 0) {
        const list: StockInfo[] = tradfiSymbols.map(item => {
          const sym = item.symbol.toLowerCase();
          const base = (item.baseCoin || sym.replace('_usdt', '')).toUpperCase();
          const baseKey = base.toLowerCase();
          const cleanBase = baseKey.endsWith('x') && baseKey.length > 4 ? baseKey.slice(0, -1) : baseKey;
          const companyName = STOCK_COMPANY_NAMES[baseKey] || STOCK_COMPANY_NAMES[cleanBase] || item.enName?.replace('USDT', '').trim() || `${base} Stock`;

          const ticker = tickersMap.get(sym);
          const price = ticker ? parseFloat(ticker.c) || 0 : 0;
          const change24hPct = ticker ? (parseFloat(ticker.r) || 0) * 100 : 0;
          const high = ticker ? parseFloat(ticker.h) || price : price;
          const low = ticker ? parseFloat(ticker.l) || price : price;

          return {
            symbol: sym,
            ticker: base,
            companyName,
            price,
            change24hPct,
            volume24h: ticker ? parseFloat(ticker.v) || 0 : 0,
            sparkline: generateSparkline(price, change24hPct, high, low, 16)
          };
        });

        list.sort((a, b) => (b.volume24h !== a.volume24h ? b.volume24h - a.volume24h : a.ticker.localeCompare(b.ticker)));
        return list;
      }
    }
  } catch {
    // fallback
  }

  return getFallbackStocks();
}
