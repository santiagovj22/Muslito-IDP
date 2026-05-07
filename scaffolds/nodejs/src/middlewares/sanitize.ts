import type { FastifyRequest } from 'fastify';

const XSS_PATTERN = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;

const NOSQL_INJECTION_KEYS = new Set([
  '$where', '$gt', '$lt', '$gte', '$lte', '$ne', '$in', '$nin', '$or', '$and', '$not', '$nor',
]);

const stripXss = (value: unknown): unknown => {
  if (typeof value === 'string') return value.replace(XSS_PATTERN, '');
  if (Array.isArray(value)) return value.map(stripXss);
  if (value !== null && typeof value === 'object') return sanitizeObject(value as Record<string, unknown>);
  return value;
};

const sanitizeObject = (obj: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => !NOSQL_INJECTION_KEYS.has(key))
      .map(([key, value]) => [key, stripXss(value)]),
  );

export const sanitizeHook = async (request: FastifyRequest): Promise<void> => {
  if (request.body != null && typeof request.body === 'object') {
    request.body = sanitizeObject(request.body as Record<string, unknown>);
  }

  if (request.query != null && typeof request.query === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (request as any).query = sanitizeObject(request.query as Record<string, unknown>);
  }

  if (request.params != null && typeof request.params === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (request as any).params = sanitizeObject(request.params as Record<string, unknown>);
  }
};
