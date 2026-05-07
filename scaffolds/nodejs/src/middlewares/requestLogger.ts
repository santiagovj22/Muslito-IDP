import type { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'node:crypto';

/**
 * Fastify lifecycle hooks for request/response logging.
 * - Assigns a unique requestId (or reuses x-request-id header)
 * - Logs incoming request and outgoing response with duration
 */

export const onRequestHook = async (request: FastifyRequest): Promise<void> => {
  request.requestId = (request.headers['x-request-id'] as string | undefined) ?? randomUUID();
  request.startTime = Date.now();

  request.log.info(
    {
      requestId: request.requestId,
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    },
    'Incoming request',
  );
};

export const onSendHook = async (
  request: FastifyRequest,
  reply: FastifyReply,
  payload: unknown,
): Promise<unknown> => {
  const duration = Date.now() - request.startTime;

  void reply.header('x-request-id', request.requestId);
  void reply.header('x-response-time', `${duration}ms`);

  request.log.info(
    {
      requestId: request.requestId,
      statusCode: reply.statusCode,
      duration,
    },
    'Request completed',
  );

  return payload;
};
