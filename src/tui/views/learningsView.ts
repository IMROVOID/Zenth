import { ThemeManager, ansi } from '../theme/index.js';
import { AdaptiveLearning } from '../../core/types.js';
import { Box } from '../utils/index.js';

export interface RuleRowHitbox {
  index: number;
  rowStart: number;
  rowEnd: number;
}

export class LearningsView {
  static rowHitboxes: RuleRowHitbox[] = [];

  static render(rules: AdaptiveLearning[], width = 84, startTerminalRow = 7, selectedIndex = -1): string[] {
    const t = ThemeManager.theme;
    const lines: string[] = [];
    const boxWidth = Math.min(width, 88);
    this.rowHitboxes = [];

    lines.push(Box.header('SUPABASE ADAPTIVE LEARNINGS (public.adaptive_learnings)', boxWidth, t.border, t.accent + ansi.bold));

    if (rules.length === 0) {
      lines.push(Box.row(` ${t.dimText}No active failure rules in database. Running baseline replay will seed lessons.`, boxWidth, t.border));
      lines.push(Box.footer('Press ESC or /status to return to Live HUD', boxWidth, t.border));
      return lines;
    }

    let currentRowOffset = startTerminalRow + lines.length;

    rules.forEach((r, idx) => {
      const isSelected = idx === selectedIndex;
      const rStart = currentRowOffset;
      const tag = `${t.badgeMemory} ${r.pattern_condition} ${ansi.reset}`;
      const status = r.status === 'ACTIVE' ? `${t.success}[ACTIVE]${ansi.reset}` : `${t.dimText}[ARCHIVED]${ansi.reset}`;
      const count = `Triggered: ${t.accentSecondary}${r.trigger_count || 0}${ansi.reset} times`;

      const header = isSelected
        ? `${t.selectedBg} Rule #${idx + 1}: ${tag} ${status} │ ${count} ${ansi.reset}`
        : ` ${t.boldText}Rule #${idx + 1}:${ansi.reset} ${tag} ${status} │ ${count}`;
      lines.push(Box.row(header, boxWidth, t.border));
      currentRowOffset++;

      const ruleText = ` ${t.accent}↳ Rule:${ansi.reset} "${t.text}${r.trading_rule}${ansi.reset}"`;
      lines.push(Box.row(ruleText, boxWidth, t.border));
      currentRowOffset++;

      const cause = ` ${t.dimText}↳ Loss Reason: ${r.loss_reason}${ansi.reset}`;
      lines.push(Box.row(cause, boxWidth, t.border));
      currentRowOffset++;

      this.rowHitboxes.push({
        index: idx,
        rowStart: rStart,
        rowEnd: currentRowOffset - 1
      });

      if (idx < rules.length - 1) {
        lines.push(Box.divider(boxWidth, t.border));
        currentRowOffset++;
      }
    });

    lines.push(Box.footer(`${rules.length} Active Rules Protecting Capital · Press ESC or /status to return`, boxWidth, t.border));
    return lines;
  }
}
