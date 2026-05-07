import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { globalErrorHandler } from './handlers/globalErrorHandler.js';
import { onRequestHook, onSendHook } from './middlewares/requestLogger.js';
import { sanitizeHook } from './middlewares/sanitize.js';
import { registerRoutes } from './routes/index.js';

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    logger,
    disableRequestLogging: true, // Handled manually in requestLogger hooks
    trustProxy: true,
  });

  // ─── Security plugins ──────────────────────────────────────────────────────
  await app.register(helmet, { global: true });

  await app.register(cors, {
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    credentials: true,
  });

  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
    errorResponseBuilder: () => ({
      success: false,
      message: 'Too many requests, please slow down.',
      errorCode: 'RATE_LIMIT_EXCEEDED',
    }),
  });

  // ─── Lifecycle hooks ───────────────────────────────────────────────────────
  app.addHook('onRequest', onRequestHook);
  app.addHook('onSend', onSendHook);
  app.addHook('preHandler', sanitizeHook);

  // ─── Error handler ─────────────────────────────────────────────────────────
  app.setErrorHandler(globalErrorHandler);

  // ─── 404 handler ──────────────────────────────────────────────────────────
  app.setNotFoundHandler((_request, reply) => {
    void reply.status(404).send({
      success: false,
      message: 'Route not found',
      errorCode: 'NOT_FOUND',
    });
  });

  // ─── Routes ────────────────────────────────────────────────────────────────
  await registerRoutes(app);

  return app;
};

// ─── Bootstrap (only when run directly) ───────────────────────────────────────

const start = async (): Promise<void> => {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    logger.info(`🚀  Server running at http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    logger.error(err, 'Server failed to start');
    process.exit(1);
  }

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    logger.info(`Received ${signal}, shutting down gracefully…`);
    await app.close();
    logger.info('Server closed');
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

// Only start when this file is run directly (not imported in tests)
const isMain = process.argv[1]?.endsWith('app.ts') || process.argv[1]?.endsWith('app.js');
if (isMain) {
  await start();
}
