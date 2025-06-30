import { z } from 'zod';

const configSchema = z.object({
  isProduction: z.boolean().default(false),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  databaseUrl: z.string().url().default('sqlite://:memory:'),
});

export type Config = z.infer<typeof configSchema>;

export function createConfig(overrides: Partial<Config> = {}): Config {
  const defaultConfig: Config = {
    isProduction: process.env.NODE_ENV === 'production',
    logLevel: process.env.LOG_LEVEL as Config['logLevel'] || 'info',
    databaseUrl: process.env.DATABASE_URL || 'sqlite://:memory:',
  };

  return configSchema.parse({ ...defaultConfig, ...overrides });
}

