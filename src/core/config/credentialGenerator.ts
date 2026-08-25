import crypto from 'crypto';

export interface GeneratedDbCredentials {
  database: string;
  user: string;
  password: string;
  host: string;
  port: number;
}

export class CredentialGenerator {
  static generatePostgres(dbName = 'zenth'): GeneratedDbCredentials {
    const password = crypto.randomBytes(12).toString('base64url');
    return {
      database: dbName,
      user: 'zenth_bot',
      password,
      host: 'localhost',
      port: 5432
    };
  }

  static generateMongo(dbName = 'zenth'): GeneratedDbCredentials {
    const password = crypto.randomBytes(12).toString('base64url');
    return {
      database: dbName,
      user: 'zenth_user',
      password,
      host: 'localhost',
      port: 27017
    };
  }

  static generatePassword(length = 16): string {
    return crypto.randomBytes(length).toString('base64url').slice(0, length);
  }
}
