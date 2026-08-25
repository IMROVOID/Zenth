import { ColorPalette } from '../types.js';
import { darkThemesPart1 } from './darkThemesPart1.js';
import { darkThemesPart2 } from './darkThemesPart2.js';

export const darkThemes: Record<string, ColorPalette> = {
  ...darkThemesPart1,
  ...darkThemesPart2
};
