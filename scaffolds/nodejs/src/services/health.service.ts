import { env } from '../config/env.js';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
  // Extend with dependency checks as your service grows:
  // dependencies?: Record<string, 'ok' | 'error'>;
}

export const getHealthStatus = async (): Promise<HealthStatus> => ({
  status: 'healthy',
  version: env.SERVICE_VERSION,
  uptime: Math.floor(process.uptime()),
  timestamp: new Date().toISOString(),
});
