import { describe, it, expect } from 'vitest';
import {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from '../../src/exceptions/index.js';

describe('AppError', () => {
  it('creates an error with correct defaults', () => {
    const err = new AppError('Something failed');
    expect(err.message).toBe('Something failed');
    expect(err.statusCode).toBe(500);
    expect(err.errorCode).toBe('INTERNAL_ERROR');
    expect(err.isOperational).toBe(true);
  });

  it('is an instance of Error', () => {
    expect(new AppError('oops')).toBeInstanceOf(Error);
  });
});

describe('NotFoundError', () => {
  it('has status 404 and correct errorCode', () => {
    const err = new NotFoundError('User');
    expect(err.statusCode).toBe(404);
    expect(err.errorCode).toBe('NOT_FOUND');
    expect(err.message).toBe('User not found');
  });
});

describe('ValidationError', () => {
  it('has status 400', () => {
    expect(new ValidationError()).toMatchObject({ statusCode: 400, errorCode: 'VALIDATION_ERROR' });
  });
});

describe('UnauthorizedError', () => {
  it('has status 401', () => {
    expect(new UnauthorizedError()).toMatchObject({ statusCode: 401, errorCode: 'UNAUTHORIZED' });
  });
});

describe('ForbiddenError', () => {
  it('has status 403', () => {
    expect(new ForbiddenError()).toMatchObject({ statusCode: 403, errorCode: 'FORBIDDEN' });
  });
});

describe('ConflictError', () => {
  it('has status 409', () => {
    expect(new ConflictError()).toMatchObject({ statusCode: 409, errorCode: 'CONFLICT' });
  });
});
