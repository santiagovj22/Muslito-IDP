import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getHealthStatus } from '../../src/services/health.service.js';

describe('getHealthStatus()', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a healthy status object', async () => {
    const result = await getHealthStatus();

    expect(result).toMatchObject({
      status: 'healthy',
      version: expect.any(String) as string,
      uptime: expect.any(Number) as number,
      timestamp: expect.any(String) as string,
    });
  });

  it('returns a valid ISO 8601 timestamp', async () => {
    const result = await getHealthStatus();
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });

  it('returns a non-negative uptime', async () => {
    const result = await getHealthStatus();
    expect(result.uptime).toBeGreaterThanOrEqual(0);
  });

  it('status is one of the allowed literals', async () => {
    const result = await getHealthStatus();
    expect(['healthy', 'degraded', 'unhealthy']).toContain(result.status);
  });
});
