import { createClient } from '@supabase/supabase-js';
import { SupabaseValidationResult } from './types.js';
import { SUPABASE_SCHEMA_SQL } from './schemaSql.js';

export function normalizeSupabaseUrl(rawUrl: string): string {
  let url = (rawUrl || '').trim();
  if (!url) return '';
  url = url.replace(/\/+$/, '');
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

export class SupabaseValidator {
  static async validate(rawUrl: string, rawKey: string): Promise<SupabaseValidationResult> {
    const cleanUrl = normalizeSupabaseUrl(rawUrl);
    const cleanKey = (rawKey || '').trim();

    if (!cleanUrl || !cleanUrl.startsWith('http') || cleanUrl === 'https://' || cleanUrl.includes('your-project')) {
      return {
        status: 'AUTH_ERROR',
        message: 'Invalid Supabase Project URL. Expected format: https://<project-ref>.supabase.co',
        suggestions: [
          'Copy the Project URL from Supabase Dashboard > Project Settings > API',
          'URL is automatically prepended with https:// if omitted'
        ]
      };
    }

    if (!cleanKey || cleanKey.length < 15 || cleanKey.includes('your-anon')) {
      return {
        status: 'AUTH_ERROR',
        message: 'Invalid or incomplete Supabase API Key.',
        suggestions: [
          'Use the "anon" (public) or "service_role" (secret) key from Supabase Settings > API',
          'Do not use your Supabase account password or DB connection string password.'
        ]
      };
    }

    try {
      const client = createClient(cleanUrl, cleanKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

      const tables = ['trade_ledger', 'adaptive_learnings', 'session_metrics'];
      const missingTables: string[] = [];

      for (const table of tables) {
        const res = await client.from(table).select('count', { count: 'exact', head: true });

        // Network error check
        if (res.error) {
          const errMsg = res.error.message || '';
          const details = (res.error as { details?: string }).details || '';

          if (errMsg.includes('fetch failed') || details.includes('ENOTFOUND') || details.includes('ECONNREFUSED')) {
            return {
              status: 'NETWORK_ERROR',
              message: `Network connection to Supabase failed: Cannot reach host.`,
              suggestions: [
                'Check your Internet connection and DNS settings',
                'Verify firewall or corporate VPN is not blocking outbound HTTPS port 443',
                'Ensure the project is not paused in the Supabase Dashboard'
              ]
            };
          }

          // Authentication error check
          if (res.status === 401 || res.status === 403 || errMsg.includes('JWT') || errMsg.includes('apikey')) {
            return {
              status: 'AUTH_ERROR',
              message: `Authentication failed (HTTP ${res.status || 401} Unauthorized).`,
              suggestions: [
                'Double-check your API Key in Supabase Dashboard > Settings > API',
                'Verify the key has not been revoked or expired',
                'Ensure you copied the entire key without trailing spaces'
              ]
            };
          }

          // Schema / Missing table check
          if (
            res.status === 404 ||
            res.error.code === '42P01' ||
            res.error.code === 'PGRST204' ||
            res.error.code === 'PGRST200' ||
            errMsg.includes('relation') ||
            errMsg.includes('does not exist') ||
            errMsg.includes('Could not find the table')
          ) {
            missingTables.push(table);
          }
        }
      }

      if (missingTables.length > 0) {
        return {
          status: 'SCHEMA_MISMATCH',
          message: `Connected successfully, but missing database table(s): ${missingTables.join(', ')}`,
          missingTables,
          sqlFixScript: SUPABASE_SCHEMA_SQL,
          suggestions: [
            'Open Supabase Dashboard > SQL Editor > New Query',
            'Paste the provided SQL Schema script and click "Run"',
            'Press [C] in the onboarding terminal to copy the SQL schema to clipboard'
          ]
        };
      }

      return {
        status: 'SUCCESS',
        message: 'Supabase connection verified! All 3 tables (trade_ledger, adaptive_learnings, session_metrics) are ready.',
        hasTables: true,
        suggestions: []
      };
    } catch (err: unknown) {
      const msg = (err as Error).message || '';
      if (msg.includes('fetch failed') || msg.includes('ENOTFOUND')) {
        return {
          status: 'NETWORK_ERROR',
          message: `Network connection failed: ${msg}`,
          suggestions: ['Check your Internet connection and DNS settings']
        };
      }
      return {
        status: 'UNKNOWN_ERROR',
        message: `Unexpected error validating Supabase: ${msg}`,
        suggestions: ['Double-check URL and credentials or choose Local Memory Mode']
      };
    }
  }
}
