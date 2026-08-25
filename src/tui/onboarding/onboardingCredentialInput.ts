import { OnboardingState } from './onboardingState.js';
import { SupabaseValidator, normalizeSupabaseUrl } from '../../core/config/supabaseValidator.js';
import { ClipboardService } from '../../core/export/clipboardService.js';

export async function handleCredentialInput(key: string, state: OnboardingState, render: () => void): Promise<boolean> {
  const data = state.data;

  if (key === '\u001b') {
    state.goBack();
    render();
    return false;
  }

  if (key === '\t' || key === '\u001b[A' || key === '\u001b[B') {
    data.activeCredentialField = data.activeCredentialField === 'url' ? 'key' : 'url';
    render();
    return false;
  }

  // Handle Ctrl+V (\u0016 / \x16) paste shortcut
  const isCtrlV = key === '\u0016' || key === '\x16';
  if (isCtrlV) {
    const clip = await ClipboardService.read();
    if (clip) {
      if (clip.includes('\n') || clip.includes('\r')) {
        state.setNotice('Refused multi-line clipboard text (single-line only)', render);
        render();
        return false;
      }
      const clean = clip.trim();
      if (clean && clean.length <= 1000) {
        if (data.activeCredentialField === 'url') {
          data.supabaseUrl = normalizeSupabaseUrl(clean);
        } else {
          data.supabaseKey = clean;
        }
        state.setNotice('Pasted from clipboard!', render);
        render();
        return false;
      }
    }
  }

  // Handle direct multi-char pasted chunk (bracketed paste or terminal paste stream)
  if (key.length > 1 && !key.startsWith('\u001b')) {
    if (key.includes('\n') || key.includes('\r')) {
      state.setNotice('Refused multi-line pasted text (single-line only)', render);
      render();
      return false;
    }
    const cleanChunk = key
      .replace(/\x1b\[200~/g, '')
      .replace(/\x1b\[201~/g, '')
      .trim();

    if (cleanChunk && cleanChunk.length <= 1000) {
      if (data.activeCredentialField === 'url') {
        data.supabaseUrl = normalizeSupabaseUrl(cleanChunk);
      } else {
        data.supabaseKey = cleanChunk;
      }
      state.setNotice('Pasted text!', render);
      render();
      return false;
    }
  }

  if (key === '\x7f' || key === '\b') {
    if (data.activeCredentialField === 'url') data.supabaseUrl = data.supabaseUrl.slice(0, -1);
    else data.supabaseKey = data.supabaseKey.slice(0, -1);
    render();
    return false;
  }

  if (key === '\r') {
    data.supabaseUrl = normalizeSupabaseUrl(data.supabaseUrl);
    data.isValidating = true;
    data.validationResult = null;
    render();

    const vResult = await SupabaseValidator.validate(data.supabaseUrl, data.supabaseKey);
    data.isValidating = false;
    data.validationResult = vResult;
    if (vResult.status === 'SUCCESS') {
      state.goToStep('TRADING_PARAMS');
    }
    render();
    return false;
  }

  if (key.length === 1 && key >= ' ' && key <= '~') {
    if (data.activeCredentialField === 'url') {
      data.supabaseUrl += key;
    } else {
      data.supabaseKey += key;
    }
    render();
    return false;
  }

  return false;
}
