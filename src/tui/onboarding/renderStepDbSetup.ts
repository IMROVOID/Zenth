import { OnboardingStateData } from './onboardingTypes.js';
import { ThemeManager, ansi } from '../theme/index.js';
import { Box } from '../utils/box.js';

const BLACK_TEXT = '\x1b[22m\x1b[38;2;0;0;0m';

export function renderSqliteSetupStep(data: OnboardingStateData, boxWidth: number): string[] {
  const t = ThemeManager.theme;
  const lines: string[] = [];

  lines.push(Box.row(` ${t.boldText}SQLITE DATABASE SETUP & AUTO-INITIALIZATION${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Embedded zero-configuration file storage. No server required.${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  const pathDisplay = data.sqlitePath || './data/zenth.db';
  lines.push(Box.row(`${t.selectedBg}${BLACK_TEXT} ▶ Database File Path : ${pathDisplay} ${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  if (data.isValidating || data.isAutoProvisioning) {
    lines.push(Box.row(` ${t.warning}[PROVISIONING] Creating directory, database file, and DDL tables...${ansi.reset}`, boxWidth, t.border));
  } else if (data.validationResult) {
    const res = data.validationResult;
    if (res.status === 'SUCCESS') {
      lines.push(Box.row(` ${t.success}[OK] ${res.message}${ansi.reset}`, boxWidth, t.border));
    } else {
      lines.push(Box.row(` ${t.danger}[ERROR] ${res.message}${ansi.reset}`, boxWidth, t.border));
    }
  } else {
    lines.push(Box.row(` ${t.accentSecondary}Press [ENTER] to auto-create and verify database tables now${ansi.reset}`, boxWidth, t.border));
  }

  lines.push(Box.divider(boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}[ENTER] Auto-Create & Continue · [Ctrl+V] Paste Path · [ESC] Back${ansi.reset}`, boxWidth, t.border));
  return lines;
}

export function renderPostgresChoiceStep(data: OnboardingStateData, boxWidth: number): string[] {
  const t = ThemeManager.theme;
  const lines: string[] = [];

  lines.push(Box.row(` ${t.boldText}STEP 2: POSTGRESQL PROVISIONING METHOD${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Choose automated database creation or custom connection settings.${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  const opt1Selected = data.selectedOptionIndex === 0;
  const opt2Selected = data.selectedOptionIndex === 1;

  const r1Text = `[1] Auto-Provision Local DB — Auto-creates "zenth" database & tables (1-Click)`;
  const r2Text = `[2] Manual Connection Settings — Specify custom host, port, user, or full URI`;

  lines.push(Box.row(opt1Selected ? `${t.selectedBg}${BLACK_TEXT} ▶ ${r1Text} ${ansi.reset}` : `   ${t.boldText}${r1Text}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(opt2Selected ? `${t.selectedBg}${BLACK_TEXT} ▶ ${r2Text} ${ansi.reset}` : `   ${t.dimText}${r2Text}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Navigate: [↑/↓] or press [1] / [2] · Confirm: [ENTER] · Back: [ESC]${ansi.reset}`, boxWidth, t.border));
  return lines;
}

export function renderPostgresCredentialsStep(data: OnboardingStateData, boxWidth: number): string[] {
  const t = ThemeManager.theme;
  const lines: string[] = [];

  lines.push(Box.row(` ${t.boldText}POSTGRESQL CONNECTION PARAMETERS${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Configure connection details for your local/remote PostgreSQL instance.${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  const fields: Array<{ key: typeof data.activePostgresField; label: string; val: string }> = [
    { key: 'host', label: 'Host', val: data.postgresHost || 'localhost' },
    { key: 'port', label: 'Port', val: data.postgresPort || '5432' },
    { key: 'user', label: 'User', val: data.postgresUser || 'postgres' },
    { key: 'password', label: 'Password', val: data.postgresPassword ? '*'.repeat(data.postgresPassword.length) : 'postgres' },
    { key: 'database', label: 'Database', val: data.postgresDatabase || 'zenth' }
  ];

  fields.forEach(f => {
    const isAct = data.activePostgresField === f.key;
    if (isAct) {
      lines.push(Box.row(`${t.selectedBg}${BLACK_TEXT} ▶ ${f.label.padEnd(10, ' ')} : ${f.val} ${ansi.reset}`, boxWidth, t.border));
    } else {
      lines.push(Box.row(`   ${t.boldText}${f.label.padEnd(10, ' ')} :${ansi.reset} ${f.val}`, boxWidth, t.border));
    }
  });

  lines.push(Box.divider(boxWidth, t.border));

  if (data.isValidating || data.isAutoProvisioning) {
    lines.push(Box.row(` ${t.warning}[CONNECTING] Connecting to PostgreSQL & running schema migration...${ansi.reset}`, boxWidth, t.border));
  } else if (data.validationResult) {
    const res = data.validationResult;
    if (res.status === 'SUCCESS') {
      lines.push(Box.row(` ${t.success}[OK] ${res.message}${ansi.reset}`, boxWidth, t.border));
    } else {
      lines.push(Box.row(` ${t.danger}[ERROR] ${res.message}${ansi.reset}`, boxWidth, t.border));
    }
  } else {
    lines.push(Box.row(` ${t.accentSecondary}Press [G] to auto-generate secure credentials · [ENTER] Connect & Auto-Create${ansi.reset}`, boxWidth, t.border));
  }

  lines.push(Box.divider(boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}[TAB/↑/↓] Switch Field · [G] Gen Creds · [ENTER] Test & Next · [ESC] Back${ansi.reset}`, boxWidth, t.border));
  return lines;
}

export function renderMongoChoiceStep(data: OnboardingStateData, boxWidth: number): string[] {
  const t = ThemeManager.theme;
  const lines: string[] = [];

  lines.push(Box.row(` ${t.boldText}STEP 2: MONGODB PROVISIONING METHOD${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Choose automated collection initialization or custom connection URI.${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  const opt1Selected = data.selectedOptionIndex === 0;
  const opt2Selected = data.selectedOptionIndex === 1;

  const r1Text = `[1] Auto-Provision Local MongoDB — Initializes "zenth" DB & indexes (1-Click)`;
  const r2Text = `[2] Custom Connection URI      — Specify custom mongodb:// connection string`;

  lines.push(Box.row(opt1Selected ? `${t.selectedBg}${BLACK_TEXT} ▶ ${r1Text} ${ansi.reset}` : `   ${t.boldText}${r1Text}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(opt2Selected ? `${t.selectedBg}${BLACK_TEXT} ▶ ${r2Text} ${ansi.reset}` : `   ${t.dimText}${r2Text}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Navigate: [↑/↓] or press [1] / [2] · Confirm: [ENTER] · Back: [ESC]${ansi.reset}`, boxWidth, t.border));
  return lines;
}

export function renderMongoCredentialsStep(data: OnboardingStateData, boxWidth: number): string[] {
  const t = ThemeManager.theme;
  const lines: string[] = [];

  lines.push(Box.row(` ${t.boldText}MONGODB CONNECTION SETTINGS${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Configure connection string for your local/remote MongoDB instance.${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  const uriDisplay = data.mongoUri || 'mongodb://localhost:27017';
  lines.push(Box.row(`${t.selectedBg}${BLACK_TEXT} ▶ Connection URI : ${uriDisplay} ${ansi.reset}`, boxWidth, t.border));

  const dbDisplay = data.mongoDatabase || 'zenth';
  lines.push(Box.row(`   ${t.boldText}Database Name  :${ansi.reset} ${dbDisplay}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  if (data.isValidating || data.isAutoProvisioning) {
    lines.push(Box.row(` ${t.warning}[CONNECTING] Testing connection & creating MongoDB collections...${ansi.reset}`, boxWidth, t.border));
  } else if (data.validationResult) {
    const res = data.validationResult;
    if (res.status === 'SUCCESS') {
      lines.push(Box.row(` ${t.success}[OK] ${res.message}${ansi.reset}`, boxWidth, t.border));
    } else {
      lines.push(Box.row(` ${t.danger}[ERROR] ${res.message}${ansi.reset}`, boxWidth, t.border));
    }
  }

  lines.push(Box.divider(boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}[Ctrl+V] Paste URI · [ENTER] Test & Initialize · [ESC] Back${ansi.reset}`, boxWidth, t.border));
  return lines;
}
