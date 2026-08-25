import { OnboardingState } from './onboardingState.js';
import { ThemeManager, ansi } from '../theme/index.js';
import { Box } from '../utils/box.js';
import { renderStorageStep, renderSupabaseSetupChoiceStep } from './renderStepStorage.js';
import { renderAutoTokenStep, renderCredentialsStep } from './renderStepCredentials.js';
import { renderManualGuideStep } from './renderStepManualGuide.js';
import {
  renderSqliteSetupStep,
  renderPostgresChoiceStep,
  renderPostgresCredentialsStep,
  renderMongoChoiceStep,
  renderMongoCredentialsStep
} from './renderStepDbSetup.js';
import { RenderStepParams, renderCompleteStep } from './renderStepParams.js';
import { RenderParamPicker } from './renderParamPicker.js';
import { RenderSymbolPicker } from './renderSymbolPicker.js';

export class OnboardingRenderer {
  static render(state: OnboardingState): void {
    const termWidth = process.stdout.columns || 100;
    const boxWidth = Math.min(termWidth, 90);
    const t = ThemeManager.theme;
    const data = state.data;

    const lines: string[] = [];

    // Header Frame
    lines.push('');
    lines.push(Box.header('ZENTH TRADING BOT — INITIAL ONBOARDING WIZARD', boxWidth, t.border, t.accent + ansi.bold));

    // Step Progress Badge
    let stepNumber = '1/4';
    if (
      data.currentStep === 'SQLITE_SETUP' ||
      data.currentStep === 'POSTGRES_SETUP_CHOICE' ||
      data.currentStep === 'POSTGRES_CREDENTIALS' ||
      data.currentStep === 'MONGO_SETUP_CHOICE' ||
      data.currentStep === 'MONGO_CREDENTIALS' ||
      data.currentStep === 'SUPABASE_SETUP_CHOICE' ||
      data.currentStep === 'SUPABASE_AUTO_TOKEN' ||
      data.currentStep === 'SUPABASE_MANUAL_GUIDE' ||
      data.currentStep === 'SUPABASE_CREDENTIALS'
    ) {
      stepNumber = '2/4';
    } else if (
      data.currentStep === 'TRADING_PARAMS' ||
      data.currentStep === 'PARAM_PICKER' ||
      data.currentStep === 'SYMBOL_PICKER'
    ) {
      stepNumber = '3/4';
    } else if (data.currentStep === 'COMPLETE') {
      stepNumber = '4/4';
    }

    lines.push(Box.row(` ${t.badgeInfo} STEP ${stepNumber} ${ansi.reset} ${t.dimText}Configure storage, credentials, and parameters${ansi.reset}`, boxWidth, t.border));
    lines.push(Box.divider(boxWidth, t.border));

    // Render Active Step Subview
    let stepLines: string[] = [];
    switch (data.currentStep) {
      case 'STORAGE_CHOICE':
        stepLines = renderStorageStep(data, boxWidth);
        break;
      case 'SQLITE_SETUP':
        stepLines = renderSqliteSetupStep(data, boxWidth);
        break;
      case 'POSTGRES_SETUP_CHOICE':
        stepLines = renderPostgresChoiceStep(data, boxWidth);
        break;
      case 'POSTGRES_CREDENTIALS':
        stepLines = renderPostgresCredentialsStep(data, boxWidth);
        break;
      case 'MONGO_SETUP_CHOICE':
        stepLines = renderMongoChoiceStep(data, boxWidth);
        break;
      case 'MONGO_CREDENTIALS':
        stepLines = renderMongoCredentialsStep(data, boxWidth);
        break;
      case 'SUPABASE_SETUP_CHOICE':
        stepLines = renderSupabaseSetupChoiceStep(data, boxWidth);
        break;
      case 'SUPABASE_AUTO_TOKEN':
        stepLines = renderAutoTokenStep(data, boxWidth);
        break;
      case 'SUPABASE_MANUAL_GUIDE':
        stepLines = renderManualGuideStep(data, boxWidth);
        break;
      case 'SUPABASE_CREDENTIALS':
        stepLines = renderCredentialsStep(data, boxWidth);
        break;
      case 'TRADING_PARAMS':
        stepLines = RenderStepParams.render(data, boxWidth, 5);
        break;
      case 'PARAM_PICKER':
        stepLines = RenderParamPicker.render(data, boxWidth, 5);
        break;
      case 'SYMBOL_PICKER':
        stepLines = RenderSymbolPicker.render(data, boxWidth, 5);
        break;
      case 'COMPLETE':
        stepLines = renderCompleteStep(data, boxWidth);
        break;
    }

    lines.push(...stepLines);
    lines.push(Box.footer('', boxWidth, t.border));
    lines.push('');

    const frame = '\x1b[H' + lines.map(line => line + '\x1b[K').join('\n') + '\x1b[J';
    process.stdout.write(frame);
  }
}
