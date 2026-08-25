import { ColorPalette } from '../types.js';
import { cyberThemes } from './cyberThemes.js';
import { darkThemes } from './darkThemes.js';
import { nordicThemes } from './nordicThemes.js';

export const THEMES: Record<string, ColorPalette> = {
  ...cyberThemes,
  ...darkThemes,
  ...nordicThemes
};
