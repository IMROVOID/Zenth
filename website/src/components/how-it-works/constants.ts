import { ChartMarker } from './types';

export const HOW_IT_WORKS_VIEWBOX = '0 0 760 340';

// 8 evenly spaced horizontal background row guide lines across Y
export const CHART_ROW_LINES = [40, 80, 120, 160, 200, 240, 280, 320];

export interface Candle {
  id: number;
  x: number;
  open: number;
  close: number;
  high: number;
  low: number;
  isBull: boolean;
  signalType?: 'BUY' | 'SELL';
}

// 54-bar financial candlestick dataset with designated glowing signal candles
export const CANDLESTICK_DATA: Candle[] = [
  // 1. Initial Left Accumulation & Markup (Bars 0 - 10)
  { id: 0, x: 26, open: 275, close: 252, high: 246, low: 280, isBull: true },
  { id: 1, x: 39, open: 252, close: 234, high: 228, low: 256, isBull: true },
  { id: 2, x: 52, open: 234, close: 215, high: 206, low: 238, isBull: true },
  { id: 3, x: 65, open: 215, close: 228, high: 210, low: 236, isBull: false },
  { id: 4, x: 78, open: 228, close: 242, high: 222, low: 248, isBull: false },
  { id: 5, x: 91, open: 242, close: 230, high: 224, low: 246, isBull: true },
  { id: 6, x: 104, open: 230, close: 245, high: 225, low: 252, isBull: false },
  { id: 7, x: 117, open: 245, close: 258, high: 238, low: 264, isBull: false },
  { id: 8, x: 130, open: 258, close: 246, high: 240, low: 262, isBull: true },
  { id: 9, x: 143, open: 246, close: 260, high: 242, low: 266, isBull: false },
  { id: 10, x: 156, open: 260, close: 248, high: 242, low: 264, isBull: true },

  // 2. Pre-Breakout Dip & Buy Signal (Bars 11 - 17)
  { id: 11, x: 169, open: 248, close: 232, high: 224, low: 252, isBull: true },
  { id: 12, x: 182, open: 232, close: 220, high: 212, low: 236, isBull: true },
  { id: 13, x: 195, open: 220, close: 235, high: 214, low: 242, isBull: false },
  { id: 14, x: 208, open: 235, close: 250, high: 230, low: 256, isBull: false },
  { id: 15, x: 221, open: 250, close: 268, high: 244, low: 274, isBull: false, signalType: 'BUY' }, // Glowing Buy Signal Candle (x=221, low=274)
  { id: 16, x: 234, open: 268, close: 242, high: 234, low: 270, isBull: true },
  { id: 17, x: 247, open: 242, close: 222, high: 214, low: 246, isBull: true },

  // 3. Tall Momentum Bull Rally (Bars 18 - 29)
  { id: 18, x: 260, open: 222, close: 204, high: 196, low: 226, isBull: true },
  { id: 19, x: 273, open: 204, close: 214, high: 198, low: 220, isBull: false },
  { id: 20, x: 286, open: 214, close: 192, high: 184, low: 218, isBull: true },
  { id: 21, x: 299, open: 192, close: 172, high: 164, low: 196, isBull: true },
  { id: 22, x: 312, open: 172, close: 154, high: 146, low: 176, isBull: true },
  { id: 23, x: 325, open: 154, close: 164, high: 148, low: 170, isBull: false },
  { id: 24, x: 338, open: 164, close: 142, high: 134, low: 168, isBull: true },
  { id: 25, x: 351, open: 142, close: 122, high: 114, low: 146, isBull: true },
  { id: 26, x: 364, open: 122, close: 104, high: 96, low: 126, isBull: true },
  { id: 27, x: 377, open: 104, close: 116, high: 98, low: 122, isBull: false },
  { id: 28, x: 390, open: 116, close: 92, high: 84, low: 120, isBull: true },
  { id: 29, x: 403, open: 92, close: 72, high: 62, low: 96, isBull: true },

  // 4. Apex Peak Spike & Sell Signal Reversal (Bars 30 - 33)
  { id: 30, x: 416, open: 72, close: 52, high: 40, low: 78, isBull: true },
  { id: 31, x: 429, open: 52, close: 74, high: 46, low: 80, isBull: false, signalType: 'SELL' }, // Glowing Sell Signal Candle (x=429, high=46)
  { id: 32, x: 442, open: 74, close: 98, high: 68, low: 104, isBull: false },
  { id: 33, x: 455, open: 98, close: 122, high: 92, low: 128, isBull: false },

  // 5. Tall Bear Pullback Waterfall (Bars 34 - 42)
  { id: 34, x: 468, open: 122, close: 144, high: 116, low: 150, isBull: false },
  { id: 35, x: 481, open: 144, close: 134, high: 128, low: 148, isBull: true },
  { id: 36, x: 494, open: 134, close: 158, high: 130, low: 164, isBull: false },
  { id: 37, x: 507, open: 158, close: 182, high: 152, low: 188, isBull: false },
  { id: 38, x: 520, open: 182, close: 204, high: 176, low: 210, isBull: false },
  { id: 39, x: 533, open: 204, close: 192, high: 186, low: 208, isBull: true },
  { id: 40, x: 546, open: 192, close: 216, high: 186, low: 224, isBull: false },
  { id: 41, x: 559, open: 216, close: 232, high: 208, low: 240, isBull: false },
  { id: 42, x: 572, open: 232, close: 208, high: 200, low: 236, isBull: true },

  // 6. Breakout Impulse Expansion (Bars 43 - 53)
  { id: 43, x: 585, open: 208, close: 184, high: 176, low: 212, isBull: true },
  { id: 44, x: 598, open: 184, close: 162, high: 154, low: 188, isBull: true },
  { id: 45, x: 611, open: 162, close: 172, high: 156, low: 178, isBull: false },
  { id: 46, x: 624, open: 172, close: 148, high: 140, low: 176, isBull: true },
  { id: 47, x: 637, open: 148, close: 126, high: 118, low: 152, isBull: true },
  { id: 48, x: 650, open: 126, close: 104, high: 96, low: 130, isBull: true },
  { id: 49, x: 663, open: 104, close: 114, high: 98, low: 120, isBull: false },
  { id: 50, x: 676, open: 114, close: 88, high: 80, low: 118, isBull: true },
  { id: 51, x: 689, open: 88, close: 64, high: 56, low: 92, isBull: true },
  { id: 52, x: 702, open: 64, close: 44, high: 36, low: 68, isBull: true },
  { id: 53, x: 715, open: 44, close: 26, high: 18, low: 48, isBull: true },
];

// Bottom Marketcap Line Chart Path (Hugs very bottom perimeter, y=322 to 338)
export const BOTTOM_MARKETCAP_PATH =
  'M 20 338 ' +
  'C 60 337, 100 336, 140 336 ' +
  'C 180 337, 220 335, 260 332 ' +
  'C 300 328, 340 324, 380 320 ' +
  'C 420 316, 460 324, 500 330 ' +
  'C 540 334, 580 332, 620 325 ' +
  'C 660 318, 700 312, 730 306';

export const BOTTOM_MARKETCAP_AREA =
  `${BOTTOM_MARKETCAP_PATH} L 730 340 L 20 340 Z`;

// Buy and Sell Signal Markers (Fine-tuned snug coordinates)
export const CHART_MARKERS: ChartMarker[] = [
  {
    type: 'BUY',
    x: 221,
    y: 260, // Snug right below the glowing Buy candle
    label: 'Buy',
    metric: '+18.4%',
    color: '#16a34a', // Emerald Green
  },
  {
    type: 'SELL',
    x: 429,
    y: 64, // Snug right above the glowing Sell candle
    label: 'Sell',
    metric: '-12.2%',
    color: '#dc2626', // Crimson Red
  },
];
