import { OnboardingStateData } from './onboardingTypes.js';
import { ThemeManager, ansi } from '../theme/index.js';
import { Box } from '../utils/index.js';

const BLACK_TEXT = '\x1b[22m\x1b[38;2;0;0;0m';

export function renderAutoTokenStep(data: OnboardingStateData, boxWidth: number): string[] {
  const t = ThemeManager.theme;
  const lines: string[] = [];

  lines.push(Box.row(` ${t.boldText}AUTOMATED PROVISIONING — PERSONAL ACCESS TOKEN${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}1. Generate a token at: ${t.accent}https://supabase.com/dashboard/account/tokens${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}2. Paste your Personal Access Token (starts with "sbp_") below:${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  const maskedToken = data.supabasePatToken ? '*'.repeat(data.supabasePatToken.length) : '';
  const tokenDisplay = maskedToken || '(Paste or type token...)';

  lines.push(Box.row(` ${t.boldText}Access Token:${ansi.reset} ${tokenDisplay}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  if (data.isAutoProvisioning) {
    lines.push(Box.row(` ${t.warning}[PROVISIONING] Querying Supabase Management API & migrating tables...${ansi.reset}`, boxWidth, t.border));
  } else if (data.statusMessage) {
    lines.push(Box.row(` ${t.danger}[ERROR] ${data.statusMessage}${ansi.reset}`, boxWidth, t.border));
  } else {
    lines.push(Box.row(` ${t.dimText}[Ctrl+V] Paste · [ENTER] Connect & Auto-Provision · [ESC] Back${ansi.reset}`, boxWidth, t.border));
  }

  return lines;
}

export function renderCredentialsStep(data: OnboardingStateData, boxWidth: number): string[] {
  const t = ThemeManager.theme;
  const lines: string[] = [];

  lines.push(Box.row(` ${t.boldText}SUPABASE DATABASE CREDENTIALS & SCHEMA VALIDATION${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Found in Supabase Dashboard > Project Settings > API${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  const isUrlActive = data.activeCredentialField === 'url';
  const isKeyActive = data.activeCredentialField === 'key';

  if (isUrlActive) {
    const rawUrlVal = data.supabaseUrl || 'https://your-project.supabase.co';
    lines.push(Box.row(`${t.selectedBg}${BLACK_TEXT} ▶ SUPABASE_URL : ${rawUrlVal} ${ansi.reset}`, boxWidth, t.border));
  } else {
    const urlDisplay = data.supabaseUrl || `${t.dimText}https://your-project.supabase.co${ansi.reset}`;
    lines.push(Box.row(`   ${t.boldText}SUPABASE_URL :${ansi.reset} ${urlDisplay}`, boxWidth, t.border));
  }

  if (isKeyActive) {
    let keyDisplay = data.supabaseKey;
    if (!keyDisplay) {
      keyDisplay = 'your-anon-or-service-role-key';
    } else if (keyDisplay.length > 28) {
      keyDisplay = `${keyDisplay.substring(0, 12)}...${keyDisplay.substring(keyDisplay.length - 8)}`;
    }
    lines.push(Box.row(`${t.selectedBg}${BLACK_TEXT} ▶ SUPABASE_KEY : ${keyDisplay} ${ansi.reset}`, boxWidth, t.border));
  } else {
    let keyDisplay = data.supabaseKey;
    if (!keyDisplay) {
      keyDisplay = `${t.dimText}your-anon-or-service-role-key${ansi.reset}`;
    } else if (keyDisplay.length > 28) {
      keyDisplay = `${keyDisplay.substring(0, 12)}...${keyDisplay.substring(keyDisplay.length - 8)}`;
    }
    lines.push(Box.row(`   ${t.boldText}SUPABASE_KEY :${ansi.reset} ${keyDisplay}`, boxWidth, t.border));
  }

  lines.push(Box.divider(boxWidth, t.border));

  if (data.isValidating) {
    lines.push(Box.row(` ${t.warning}[TESTING] Testing network reachability, auth, and database tables...${ansi.reset}`, boxWidth, t.border));
  } else if (data.validationResult) {
    const res = data.validationResult;
    if (res.status === 'SUCCESS') {
      lines.push(Box.row(` ${t.success}[OK] ${res.message}${ansi.reset}`, boxWidth, t.border));
    } else if (res.status === 'NETWORK_ERROR') {
      lines.push(Box.row(` ${t.danger}[NETWORK ERROR] ${res.message}${ansi.reset}`, boxWidth, t.border));
      res.suggestions.slice(0, 2).forEach(s => lines.push(Box.row(`   ${t.dimText}• ${s}${ansi.reset}`, boxWidth, t.border)));
    } else if (res.status === 'AUTH_ERROR') {
      lines.push(Box.row(` ${t.danger}[AUTH ERROR] ${res.message}${ansi.reset}`, boxWidth, t.border));
      res.suggestions.slice(0, 2).forEach(s => lines.push(Box.row(`   ${t.dimText}• ${s}${ansi.reset}`, boxWidth, t.border)));
    } else if (res.status === 'SCHEMA_MISMATCH') {
      lines.push(Box.row(` ${t.warning}[SCHEMA MISMATCH] ${res.message}${ansi.reset}`, boxWidth, t.border));
      res.suggestions.slice(0, 1).forEach(s => lines.push(Box.row(`   ${t.dimText}• ${s}${ansi.reset}`, boxWidth, t.border)));
    }
  }

  if (data.copiedNotice) {
    lines.push(Box.row(` ${t.badgeSuccess} COPIED ${ansi.reset} ${t.text}${data.copiedNotice}${ansi.reset}`, boxWidth, t.border));
  }

  lines.push(Box.divider(boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}[TAB/↑/↓] Switch Field · [Ctrl+V] Paste · [ENTER] Test & Next · [ESC] Back${ansi.reset}`, boxWidth, t.border));

  return lines;
}
