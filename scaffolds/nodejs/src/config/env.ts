import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),

  // CORS
  CORS_ORIGIN: z.string().default('*'),

  // Rate limiting
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),

  // Service metadata
  SERVICE_NAME: z.string().min(1).default('{{SERVICE_NAME}}'),
  SERVICE_VERSION: z.string().default('1.0.0'),

  // Add your environment variables below:
  // DATABASE_URL: z.string().url(),
  // JWT_SECRET: z.string().min(32),
}) satisfies z.ZodType;

type Env = z.infer<typeof envSchema>;

const parseEnv = (): Env => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error('❌  Invalid environment variables:\n', JSON.stringify(errors, null, 2));
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();
export type { Env };
