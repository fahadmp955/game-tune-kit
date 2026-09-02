import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptimeSeconds: number;
  timestamp: string;
  checks: {
    database: { status: 'up' | 'down'; latencyMs: number };
    system: { memoryRssMb: number; memoryHeapUsedMb: number };
  };
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly dataSource: DataSource) {}

  async checkHealth(): Promise<HealthCheckResult> {
    const start = Date.now();
    let dbStatus: 'up' | 'down' = 'down';
    let dbLatencyMs = 0;

    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
        dbStatus = 'up';
      }
      dbLatencyMs = Date.now() - start;
    } catch (err: any) {
      this.logger.error(`Database health probe failed: ${err.message}`);
      dbStatus = 'down';
      dbLatencyMs = Date.now() - start;
    }

    const memory = process.memoryUsage();

    return {
      status: dbStatus === 'up' ? 'healthy' : 'degraded',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
        system: {
          memoryRssMb: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
          memoryHeapUsedMb: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
        },
      },
    };
  }
}
