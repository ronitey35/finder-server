import { config } from 'dotenv';
import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'testing']).default('development'),
    PORT: z
      .union([z.string(), z.number()])
      .default(6000)
      .transform((port) => {
        port = Number(port) || 5000;
        let indexOfPort = process.argv.indexOf('-p');
        if (indexOfPort === -1) {
          indexOfPort = process.argv.indexOf('--port');
        }
        if (indexOfPort === -1) return port;
        port = Number(process.argv[indexOfPort + 1]) || 5000;
        return port;
      }),
    TURSO_CONNECTION_URL: z.string().url(),
    TURSO_AUTH_TOKEN: z.string()
  })
  .readonly();

export const validateEnv = () => {
  if (process.env.NODE_ENV !== 'production') {
    config({ path: '.env' });
  }
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    console.log(`Environment variables validation failed\nExitting app`);
    process.exit(1);
  }
};
export const env = validateEnv();
