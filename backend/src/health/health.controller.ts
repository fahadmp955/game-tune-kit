import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService, HealthCheckResult } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'System Health & Diagnostics Probe',
    description: 'Returns real-time status of database connectivity, uptime, and system memory metrics.',
  })
  @ApiResponse({
    status: 200,
    description: 'System is operational',
    schema: {
      example: {
        status: 'healthy',
        uptimeSeconds: 124,
        timestamp: '2026-09-02T12:00:00.000Z',
        checks: {
          database: { status: 'up', latencyMs: 3 },
          system: { memoryRssMb: 45.2, memoryHeapUsedMb: 24.8 },
        },
      },
    },
  })
  async getHealth(): Promise<HealthCheckResult> {
    return this.healthService.checkHealth();
  }
}
