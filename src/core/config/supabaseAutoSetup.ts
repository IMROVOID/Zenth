import { SUPABASE_SCHEMA_SQL } from './schemaSql.js';

export interface AutoSetupResult {
  success: boolean;
  url?: string;
  key?: string;
  message: string;
  error?: string;
}

export class SupabaseAutoSetup {
  private static API_BASE = 'https://api.supabase.com/v1';

  static async provisionWithToken(patToken: string, selectedProjectRef?: string): Promise<AutoSetupResult> {
    const token = (patToken || '').trim();
    if (!token || token.length < 20) {
      return {
        success: false,
        message: 'Invalid Supabase Personal Access Token. Tokens start with "sbp_".',
        error: 'INVALID_TOKEN'
      };
    }

    try {
      // 1. Fetch Projects for this account
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const projRes = await fetch(`${this.API_BASE}/projects`, { headers });
      if (!projRes.ok) {
        if (projRes.status === 401 || projRes.status === 403) {
          return {
            success: false,
            message: 'Access Token is invalid or expired. Check https://supabase.com/dashboard/account/tokens',
            error: 'AUTH_FAILED'
          };
        }
        return {
          success: false,
          message: `Failed to fetch Supabase projects (HTTP ${projRes.status})`,
          error: 'API_ERROR'
        };
      }

      const projects = (await projRes.json()) as Array<{ id: string; name: string; status: string; region: string }>;
      if (!projects || projects.length === 0) {
        return {
          success: false,
          message: 'No Supabase projects found under this account. Please create one at https://database.new first.',
          error: 'NO_PROJECTS'
        };
      }

      // Pick target project: either specified ref or first active project
      const targetProject = selectedProjectRef
        ? projects.find((p) => p.id === selectedProjectRef) || projects[0]
        : projects.find((p) => p.status === 'ACTIVE_HEALTHY') || projects[0];

      const projectRef = targetProject.id;
      const projectUrl = `https://${projectRef}.supabase.co`;

      // 2. Fetch API Keys for this project
      const keysRes = await fetch(`${this.API_BASE}/projects/${projectRef}/api-keys`, { headers });
      if (!keysRes.ok) {
        return {
          success: false,
          message: `Failed to retrieve API keys for project "${targetProject.name}" (${projectRef})`,
          error: 'KEY_FETCH_FAILED'
        };
      }

      const apiKeys = (await keysRes.json()) as Array<{ name: string; api_key: string }>;
      const anonKeyObj = apiKeys.find((k) => k.name === 'anon') || apiKeys[0];
      if (!anonKeyObj) {
        return {
          success: false,
          message: `No public API keys found for project "${targetProject.name}"`,
          error: 'NO_API_KEY'
        };
      }

      // 3. Execute SQL Schema Migration via Management API
      const queryRes = await fetch(`${this.API_BASE}/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: SUPABASE_SCHEMA_SQL })
      });

      if (!queryRes.ok) {
        // Schema query failed or not supported on this endpoint tier, fallback to returning URL & Key
        return {
          success: true,
          url: projectUrl,
          key: anonKeyObj.api_key,
          message: `Connected to project "${targetProject.name}" (${projectRef}). Please verify schema tables in SQL Editor.`
        };
      }

      return {
        success: true,
        url: projectUrl,
        key: anonKeyObj.api_key,
        message: `Successfully provisioned schema in project "${targetProject.name}" (${projectRef})!`
      };
    } catch (err: unknown) {
      return {
        success: false,
        message: `Automated setup error: ${(err as Error).message}`,
        error: 'NETWORK_ERROR'
      };
    }
  }
}
