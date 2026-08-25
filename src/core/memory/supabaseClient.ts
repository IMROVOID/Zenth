import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

export function createSupabaseClient(): { client: SupabaseClient | null; isConfigured: boolean } {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (url && key && url.startsWith('http')) {
    try {
      const client = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      return { client, isConfigured: true };
    } catch (err) {
      console.warn(`[WARN] Failed to initialize Supabase client: ${(err as Error).message}`);
    }
  }

  return { client: null, isConfigured: false };
}
