import { MongoClient } from 'mongodb';
import { MongoConfig } from './types.js';

export interface MongoSetupResult {
  success: boolean;
  message: string;
  config: MongoConfig;
  error?: string;
}

export class MongoAutoSetup {
  static async provision(config: MongoConfig): Promise<MongoSetupResult> {
    const uri = config.uri || (
      config.user && config.password
        ? `mongodb://${encodeURIComponent(config.user)}:${encodeURIComponent(config.password)}@${config.host || 'localhost'}:${config.port || 27017}/${config.database || 'zenth'}`
        : `mongodb://${config.host || 'localhost'}:${config.port || 27017}`
    );
    const dbName = config.database || 'zenth';

    let client: MongoClient | null = null;
    try {
      client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
      const db = client.db(dbName);

      // Create collections & indexes
      const ledgerCol = db.collection('trade_ledger');
      await ledgerCol.createIndex({ symbol: 1 });
      await ledgerCol.createIndex({ timestamp: -1 });

      const rulesCol = db.collection('adaptive_learnings');
      await rulesCol.createIndex({ symbol: 1, status: 1 });

      const sessCol = db.collection('session_metrics');
      await sessCol.createIndex({ session_id: 1 }, { unique: true });

      await client.close();

      return {
        success: true,
        config: { ...config, uri, database: dbName },
        message: `MongoDB database "${dbName}" and collections successfully initialized!`
      };
    } catch (err: any) {
      if (client) {
        try { await client.close(); } catch {}
      }
      return {
        success: false,
        config,
        message: `MongoDB initialization failed: ${err.message}`,
        error: err.code || 'MONGO_ERROR'
      };
    }
  }
}
