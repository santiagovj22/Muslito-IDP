import { describe, it, expect } from 'vitest';
import { successResponse, errorResponse } from '../../src/utils/response.helper.js';

describe('successResponse()', () => {
  it('always has success: true', () => {
    const res = successResponse({ data: { id: 1 } });
    expect(res.success).toBe(true);
  });

  it('defaults message to OK', () => {
    const res = successResponse({ data: null });
    expect(res.message).toBe('OK');
  });

  it('includes meta when provided', () => {
    const meta = { total: 10, page: 1 };
    const res = successResponse({ data: [], meta });
    expect(res.meta).toEqual(meta);
  });

  it('omits meta when not provided', () => {
    const res = successResponse({ data: [] });
    expect(res).not.toHaveProperty('meta');
  });

  it('includes requestId when provided', () => {
    const res = successResponse({ data: null, requestId: 'abc-123' });
    expect(res.requestId).toBe('abc-123');
  });
});

describe('errorResponse()', () => {
  it('always has success: false', () => {
    const res = errorResponse({ message: 'Something went wrong' });
    expect(res.success).toBe(false);
  });

  it('defaults errorCode to ERROR', () => {
    const res = errorResponse({ message: 'oops' });
    expect(res.errorCode).toBe('ERROR');
  });

  it('includes details when provided', () => {
    const res = errorResponse({ message: 'bad', details: { field: 'email' } });
    expect(res.details).toEqual({ field: 'email' });
  });

  it('omits details when not provided', () => {
    const res = errorResponse({ message: 'bad' });
    expect(res).not.toHaveProperty('details');
  });
});
