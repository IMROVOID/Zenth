/**
 * High-Resolution Braille Sub-pixel Line Chart Generator (2x4 micro-dot matrix)
 * Renders smooth, ultra-crisp line charts without chunky block distortion.
 */
export function renderBrailleSparkline(values: number[], targetChars = 8): string {
  if (!values || values.length === 0) return ' '.repeat(targetChars);

  const numCols = targetChars * 2;
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  // 1. Resample input values into numCols points using linear interpolation
  const points: number[] = [];
  for (let c = 0; c < numCols; c++) {
    const rawIdx = (c / (numCols - 1)) * (values.length - 1);
    const lowIdx = Math.floor(rawIdx);
    const highIdx = Math.ceil(rawIdx);
    const frac = rawIdx - lowIdx;
    const interpolated = values[lowIdx] * (1 - frac) + (values[highIdx] || values[lowIdx]) * frac;
    const norm = maxVal === minVal ? 1 : Math.min(3, Math.max(0, Math.round(((interpolated - minVal) / range) * 3)));
    points.push(norm);
  }

  // 2. Braille Dot Bit Mapping (0..3 height)
  const leftBits = [0x40, 0x04, 0x02, 0x01];
  const rightBits = [0x80, 0x20, 0x10, 0x08];

  let result = '';
  for (let i = 0; i < targetChars; i++) {
    const y0 = points[2 * i];
    const y1 = points[2 * i + 1];

    let mask = leftBits[y0] | rightBits[y1];

    // Vertical continuity dots
    const prevY = i > 0 ? points[2 * i - 1] : y0;
    const minL = Math.min(prevY, y0);
    const maxL = Math.max(prevY, y0);
    for (let k = minL; k <= maxL; k++) mask |= leftBits[k];

    const minR = Math.min(y0, y1);
    const maxR = Math.max(y0, y1);
    for (let k = minR; k <= maxR; k++) mask |= rightBits[k];

    result += String.fromCharCode(0x2800 + mask);
  }

  return result;
}
