import type { FastifyInstance } from 'fastify';
import { getHealth } from '../controllers/health.controller.js';

export const healthRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
                  version: { type: 'string' },
                  uptime: { type: 'number' },
                  timestamp: { type: 'string', format: 'date-time' },
                },
                required: ['status', 'version', 'uptime', 'timestamp'],
              },
            },
            required: ['success', 'message', 'data'],
          },
        },
      },
    },
    getHealth,
  );
};
