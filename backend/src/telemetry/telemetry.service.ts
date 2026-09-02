import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class TelemetryService implements OnModuleInit {
  private readonly registry: client.Registry;

  public readonly httpRequestDuration: client.Histogram<string>;
  public readonly httpRequestsTotal: client.Counter<string>;
  public readonly pushDispatchedTotal: client.Counter<string>;

  constructor() {
    this.registry = new client.Registry();

    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
      registers: [this.registry],
    });

    this.httpRequestsTotal = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests processed',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });

    this.pushDispatchedTotal = new client.Counter({
      name: 'pns_push_dispatched_total',
      help: 'Total number of push notifications dispatched',
      labelNames: ['game_id', 'platform', 'status'],
      registers: [this.registry],
    });
  }

  onModuleInit() {
    client.collectDefaultMetrics({ register: this.registry });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
