import type { SuccessResponse, ErrorResponse } from '../types/index.js';

interface SuccessOptions<T> {
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
  requestId?: string;
}

interface ErrorOptions {
  message: string;
  errorCode?: string;
  details?: unknown;
  requestId?: string;
}

export const successResponse = <T>({
  data,
  message = 'OK',
  meta,
  requestId,
}: SuccessOptions<T>): SuccessResponse<T> => ({
  success: true,
  message,
  data,
  ...(meta != null && { meta }),
  ...(requestId != null && { requestId }),
});

export const errorResponse = ({
  message,
  errorCode = 'ERROR',
  details,
  requestId,
}: ErrorOptions): ErrorResponse => ({
  success: false,
  message,
  errorCode,
  ...(details != null && { details }),
  ...(requestId != null && { requestId }),
});
