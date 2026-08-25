import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { StorageBackendType } from './types.js';

export interface EnvValidationStatus {
  hasEnvFile: boolean;
  isConfigured: boolean;
  storageBackend: StorageBackendType;
  missingKeys: string[];
}

export class EnvValidator {
  static getEnvPath(): string {
    return path.resolve(process.cwd(), '.env');
  }

  static checkEnv(): EnvValidationStatus {
    const envPath = this.getEnvPath();
    if (!fs.existsSync(envPath)) {
      return {
        hasEnvFile: false,
        isConfigured: false,
        storageBackend: 'sqlite',
        missingKeys: ['STORAGE_BACKEND', 'DEFAULT_SYMBOL']
      };
    }

    try {
      const content = fs.readFileSync(envPath, 'utf-8');
      const parsed = dotenv.parse(content);
      const rawStorage = parsed.STORAGE_BACKEND?.trim()?.toLowerCase();
      const storageMode = (rawStorage || (parsed.SUPABASE_URL !== undefined ? 'supabase' : 'sqlite')) as StorageBackendType;

      if (storageMode === 'sqlite' || storageMode === 'local' || storageMode === 'memory') {
        return {
          hasEnvFile: true,
          isConfigured: true,
          storageBackend: storageMode,
          missingKeys: []
        };
      }

      if (storageMode === 'postgres' || (storageMode as string) === 'postgresql') {
        const hasUrl = Boolean(parsed.POSTGRES_URL && parsed.POSTGRES_URL.startsWith('postgres'));
        const hasHost = Boolean(parsed.POSTGRES_HOST);
        return {
          hasEnvFile: true,
          isConfigured: hasUrl || hasHost,
          storageBackend: 'postgres',
          missingKeys: (hasUrl || hasHost) ? [] : ['POSTGRES_URL', 'POSTGRES_HOST']
        };
      }

      if (storageMode === 'mongodb' || (storageMode as string) === 'mongo') {
        const hasUri = Boolean(parsed.MONGODB_URI && parsed.MONGODB_URI.startsWith('mongodb'));
        const hasHost = Boolean(parsed.MONGODB_HOST);
        return {
          hasEnvFile: true,
          isConfigured: hasUri || hasHost,
          storageBackend: 'mongodb',
          missingKeys: (hasUri || hasHost) ? [] : ['MONGODB_URI', 'MONGODB_HOST']
        };
      }

      // Supabase validation
      const url = parsed.SUPABASE_URL?.trim();
      const key = parsed.SUPABASE_KEY?.trim();
      const isPlaceholderUrl = !url || url.includes('your-project') || !url.startsWith('http');
      const isPlaceholderKey = !key || key.includes('your-key') || key.includes('your-supabase') || key.length < 10;

      if (isPlaceholderUrl || isPlaceholderKey) {
        return {
          hasEnvFile: true,
          isConfigured: false,
          storageBackend: 'supabase',
          missingKeys: [
            ...(isPlaceholderUrl ? ['SUPABASE_URL'] : []),
            ...(isPlaceholderKey ? ['SUPABASE_KEY'] : [])
          ]
        };
      }

      return {
        hasEnvFile: true,
        isConfigured: true,
        storageBackend: 'supabase',
        missingKeys: []
      };
    } catch {
      return {
        hasEnvFile: true,
        isConfigured: false,
        storageBackend: 'sqlite',
        missingKeys: ['STORAGE_BACKEND']
      };
    }
  }

  static isOnboardingRequired(): boolean {
    const status = this.checkEnv();
    return !status.isConfigured;
  }
}
