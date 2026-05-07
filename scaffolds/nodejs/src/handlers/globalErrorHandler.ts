import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../exceptions/index.js';
import { logger } from '../config/logger.js';
import { errorResponse } from '../utils/response.helper.js';

export const globalErrorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): void => {
  const requestId = request.requestId;

  // Fastify schema validation error
  if (error.validation != null) {
    logger.warn({ requestId, validation: error.validation }, 'Request validation failed');
    void reply.status(400).send(
      errorResponse({
        message: 'Validation failed',
        errorCode: 'VALIDATION_ERROR',
        details: error.validation,
        requestId,
      }),
    );
    return;
  }

  // Known operational errors (AppError and subclasses)
  if (error instanceof AppError && error.isOperational) {
    logger.warn(
      { requestId, errorCode: error.errorCode, statusCode: error.statusCode },
      error.message,
    );
    void reply.status(error.statusCode).send(
      errorResponse({
        message: error.message,
        errorCode: error.errorCode,
        details: error.details,
        requestId,
      }),
    );
    return;
  }

  // Unknown / programming errors — log full stack, return generic 500
  logger.error({ requestId, err: error }, 'Unhandled error');
  void reply.status(500).send(
    errorResponse({
      message: 'An unexpected error occurred',
      errorCode: 'INTERNAL_ERROR',
      requestId,
    }),
  );
};
