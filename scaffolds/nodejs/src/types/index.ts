import type { FastifyRequest, FastifyReply } from 'fastify';

// ─── API Response envelopes ────────────────────────────────────────────────────

export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  requestId?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errorCode: string;
  details?: unknown;
  requestId?: string;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// ─── Augment Fastify request with our custom properties ───────────────────────

declare module 'fastify' {
  interface FastifyRequest {
    requestId: string;
    startTime: number;
  }
}

// ─── Re-export Fastify types for convenience ──────────────────────────────────

export type { FastifyRequest, FastifyReply };
