import type { FastifyRequest, FastifyReply } from 'fastify';
import { getHealthStatus } from '../services/health.service.js';
import { successResponse } from '../utils/response.helper.js';

export const getHealth = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const data = await getHealthStatus();
  await reply
    .status(200)
    .send(successResponse({ data, message: 'Service is healthy', requestId: request.requestId }));
};
