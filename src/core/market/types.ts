export interface XtKlineRaw {
  t: number;
  o: string;
  c: string;
  h: string;
  l: string;
  q: string;
  v: string;
}

export interface XtKlineResponse {
  rc: number;
  mc: string;
  result: XtKlineRaw[];
}

export interface XtTickerRaw {
  s: string;
  c: string;
  h: string;
  l: string;
  a: string;
  v: string;
  cr: string;
}

export interface XtTickerResponse {
  rc: number;
  mc: string;
  result: XtTickerRaw[];
}

export interface CoinInfo {
  symbol: string;        // e.g. btc_usdt
  baseCoin: string;      // e.g. BTC
  fullName: string;      // e.g. Bitcoin
  price: number;
  change24hPct: number;
  volume24h: number;
  sparkline?: number[];
}

export interface StockInfo {
  symbol: string;        // e.g. aaplx_usdt, tslax_usdt, spy_usdt
  ticker: string;        // e.g. AAPL, TSLA, NVDA, SPY
  companyName: string;   // e.g. Apple Inc., Tesla, NVIDIA Corporation
  price: number;
  change24hPct: number;
  volume24h: number;
  sparkline?: number[];
}
