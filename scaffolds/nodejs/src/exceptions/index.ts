// ─── Base error ───────────────────────────────────────────────────────────────

export class AppError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;
  readonly details: unknown;
  readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    errorCode = 'INTERNAL_ERROR',
    details: unknown = null,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Typed subclasses ─────────────────────────────────────────────────────────

export class NotFoundError extends AppError {
  constructor(resource = 'Resource', details: unknown = null) {
    super(`${resource} not found`, 404, 'NOT_FOUND', details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details: unknown = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details: unknown = null) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details: unknown = null) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', details: unknown = null) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class BadGatewayError extends AppError {
  constructor(message = 'Bad gateway', details: unknown = null) {
    super(message, 502, 'BAD_GATEWAY', details);
  }
}
