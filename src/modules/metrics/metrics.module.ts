// metrics.module.ts
import { Module } from '@nestjs/common';
import { PrometheusModule as Prometheus } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    Prometheus.register({
      path: '/nestjs-metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
})
export class MetricsModule {}
