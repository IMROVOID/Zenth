import { StorageBackendType } from './types.js';
import {
  DatabaseAdapter,
  SQLiteAdapter,
  PostgresAdapter,
  MongoAdapter,
  SupabaseAdapter,
  InMemoryAdapter
} from './adapters/index.js';

export function createDatabaseAdapter(backend?: StorageBackendType): DatabaseAdapter {
  const selected = (backend || process.env.STORAGE_BACKEND || 'sqlite').toLowerCase();

  switch (selected) {
    case 'sqlite':
      return new SQLiteAdapter();
    case 'postgres':
    case 'postgresql':
      return new PostgresAdapter();
    case 'mongodb':
    case 'mongo':
      return new MongoAdapter();
    case 'supabase':
      return new SupabaseAdapter();
    case 'local':
    case 'memory':
    case 'none':
      return new InMemoryAdapter();
    default:
      return new SQLiteAdapter();
  }
}
