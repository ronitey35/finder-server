import { defineConfig } from 'drizzle-kit';
import { env } from './src/config/env.config';

export default defineConfig({
  schema: './src/schemas/*.schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL!,
    authToken: env.TURSO_AUTH_TOKEN!
  }
});
