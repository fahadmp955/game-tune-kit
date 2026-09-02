import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TelemetryService } from './telemetry.service';

@ApiTags('Telemetry')
@Controller('metrics')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4')
  @ApiOperation({
    summary: 'Prometheus Telemetry Metrics',
    description: 'Exposes Prometheus-formatted metrics including RPS, latency histograms, and PNS delivery counters.',
  })
  @ApiResponse({
    status: 200,
    description: 'Prometheus metrics string',
  })
  async getMetrics(): Promise<string> {
    return this.telemetryService.getMetrics();
  }
}
