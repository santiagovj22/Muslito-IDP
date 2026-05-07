import type { FastifyInstance } from 'fastify';
import { healthRoutes } from './health.route.js';

// Import and register new routes here as your service grows:
// import { userRoutes } from './user.route.js';

export const registerRoutes = async (fastify: FastifyInstance): Promise<void> => {
  await fastify.register(healthRoutes, { prefix: '/api/v1' });
  // await fastify.register(userRoutes, { prefix: '/api/v1/users' });
};
