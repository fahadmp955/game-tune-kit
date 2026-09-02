import { describe, it, expect, vi } from 'vitest';
import { HealthService } from '../src/health/health.service';
import { TelemetryService } from '../src/telemetry/telemetry.service';

describe('Backend Foundation Services', () => {
  it('should return healthy status when database is initialized', async () => {
    const mockDataSource: any = {
      isInitialized: true,
      query: vi.fn().mockResolvedValue([{ 1: 1 }]),
    };

    const healthService = new HealthService(mockDataSource);
    const result = await healthService.checkHealth();

    expect(result.status).toBe('healthy');
    expect(result.checks.database.status).toBe('up');
    expect(result.checks.system.memoryRssMb).toBeGreaterThan(0);
  });

  it('should expose prometheus metrics string', async () => {
    const telemetryService = new TelemetryService();
    telemetryService.onModuleInit();

    const metrics = await telemetryService.getMetrics();
    expect(metrics).toContain('http_request_duration_seconds');
    expect(metrics).toContain('pns_push_dispatched_total');
  });
});
