import { ColorPalette } from './types.js';
import { THEMES } from './presets/index.js';

export class ThemeManager {
  private static savedThemeName = process.env.ZENTH_THEME || 'matrix-terminal';
  private static previewThemeName: string | null = null;

  static get theme(): ColorPalette {
    const active = this.previewThemeName || this.savedThemeName;
    return THEMES[active] || THEMES['matrix-terminal'];
  }

  static get currentName(): string {
    return this.savedThemeName;
  }

  static get activePreviewName(): string | null {
    return this.previewThemeName;
  }

  static preview(name: string): boolean {
    if (THEMES[name]) {
      this.previewThemeName = name;
      return true;
    }
    return false;
  }

  static apply(name?: string): boolean {
    const target = name || this.previewThemeName || this.savedThemeName;
    if (THEMES[target]) {
      this.savedThemeName = target;
      this.previewThemeName = null;
      return true;
    }
    return false;
  }

  static revert(): void {
    this.previewThemeName = null;
  }

  static setTheme(name: string): boolean {
    return this.apply(name);
  }

  static listThemes(): ColorPalette[] {
    return Object.values(THEMES);
  }
}
