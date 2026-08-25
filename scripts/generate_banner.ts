import fs from 'node:fs';
import path from 'node:path';

// Pixel grid for "ZENTH" + Pixel Candlestick/Terminal Icon
const pixelSize = 10;
const gap = 2;

// 7 rows x variable cols bit matrices (1 = filled green pixel, 2 = accent/lighter green, 3 = dark shadow)
const Z = [
  [1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1]
];

const E = [
  [1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1]
];

const N = [
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 1, 0, 0, 1, 1],
  [1, 1, 1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1, 1, 1],
  [1, 1, 0, 0, 1, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1]
];

const T = [
  [1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0]
];

const H = [
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1]
];

// Pixel Icon: Pixel Candlesticks with glowing ascending arrow & diamond node (10 cols x 7 rows)
const ICON = [
  [0, 0, 1, 0, 0, 0, 0, 2, 0, 0],
  [0, 0, 1, 0, 0, 0, 2, 2, 2, 0],
  [0, 1, 1, 1, 0, 0, 0, 2, 0, 0],
  [0, 1, 1, 1, 0, 2, 2, 2, 2, 2],
  [0, 1, 1, 1, 0, 2, 2, 2, 2, 2],
  [0, 0, 1, 0, 0, 0, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 0, 0]
];

function generateSvg() {
  const letters = [
    { grid: ICON, spaceAfter: 4 },
    { grid: Z, spaceAfter: 2 },
    { grid: E, spaceAfter: 2 },
    { grid: N, spaceAfter: 2 },
    { grid: T, spaceAfter: 2 },
    { grid: H, spaceAfter: 0 }
  ];

  let totalCols = 0;
  for (const l of letters) {
    totalCols += l.grid[0].length + l.spaceAfter;
  }

  const svgWidth = 850;
  const svgHeight = 170;
  const startY = 32;

  const totalGridWidth = totalCols * (pixelSize + gap);
  const startX = Math.floor((svgWidth - totalGridWidth) / 2);

  let rects = '';
  let currCol = 0;

  for (const letter of letters) {
    const grid = letter.grid;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const val = grid[r][c];
        if (val > 0) {
          const x = startX + (currCol + c) * (pixelSize + gap);
          const y = startY + r * (pixelSize + gap);
          const fill = val === 2 ? '#38EF7D' : '#00FF66';
          const filter = val === 2 ? 'url(#glow-bright)' : 'url(#glow)';
          rects += `    <rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" rx="1.5" fill="${fill}" filter="${filter}" />\n`;
          // Add specular pixel core
          rects += `    <rect x="${x + 2}" y="${y + 2}" width="${pixelSize - 4}" height="${pixelSize - 4}" fill="#E8FFF0" opacity="0.65" />\n`;
        }
      }
    }
    currCol += grid[0].length + letter.spaceAfter;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080D0A" />
      <stop offset="50%" stop-color="#0B140E" />
      <stop offset="100%" stop-color="#050806" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="glow-bright" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <pattern id="matrix-grid" width="16" height="16" patternUnits="userSpaceOnUse">
      <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#00FF66" stroke-width="0.5" stroke-opacity="0.07" />
    </pattern>
  </defs>

  <!-- Background Canvas -->
  <rect width="${svgWidth}" height="${svgHeight}" rx="12" fill="url(#bg-grad)" stroke="#1C3D22" stroke-width="1.5" />
  <rect width="${svgWidth}" height="${svgHeight}" rx="12" fill="url(#matrix-grid)" />

  <!-- Corner Brackets -->
  <path d="M 14 26 L 14 14 L 26 14" fill="none" stroke="#00FF66" stroke-width="2" opacity="0.8" />
  <path d="M ${svgWidth - 14} 26 L ${svgWidth - 14} 14 L ${svgWidth - 26} 14" fill="none" stroke="#00FF66" stroke-width="2" opacity="0.8" />
  <path d="M 14 ${svgHeight - 26} L 14 ${svgHeight - 14} L 26 ${svgHeight - 14}" fill="none" stroke="#00FF66" stroke-width="2" opacity="0.8" />
  <path d="M ${svgWidth - 14} ${svgHeight - 26} L ${svgWidth - 14} ${svgHeight - 14} L ${svgWidth - 26} ${svgHeight - 14}" fill="none" stroke="#00FF66" stroke-width="2" opacity="0.8" />

  <!-- Pixel Glitch Art & Characters -->
  <g id="pixel-title">
${rects}  </g>

  <!-- Monospace Subtitle -->
  <text x="${svgWidth / 2}" y="${startY + 7 * (pixelSize + gap) + 26}" 
        text-anchor="middle" 
        font-family="'Fira Code', 'JetBrains Mono', 'Courier New', monospace" 
        font-size="13.5" 
        font-weight="600" 
        letter-spacing="3.5" 
        fill="#A3FFAE">
    AUTONOMOUS SELF-LEARNING CRYPTO PAPER TRADING TERMINAL
  </text>
</svg>`;

  fs.mkdirSync(path.resolve('docs/assets'), { recursive: true });
  fs.writeFileSync(path.resolve('docs/assets/zenth-banner.svg'), svg, 'utf-8');

  fs.mkdirSync(path.resolve('assets'), { recursive: true });
  fs.writeFileSync(path.resolve('assets/zenth-banner.svg'), svg, 'utf-8');

  console.log('✓ Generated docs/assets/zenth-banner.svg and assets/zenth-banner.svg');
}

generateSvg();
