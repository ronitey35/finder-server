import { drizzle } from 'drizzle-orm/libsql';
import { env } from '../config/env.config';

export const db = drizzle({
  connection: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN
  }
});
