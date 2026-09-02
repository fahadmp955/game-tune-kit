import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { GamesModule } from './modules/games/games.module';
import { PlayersModule } from './modules/players/players.module';
import { DevicesModule } from './modules/devices/devices.module';
import { SegmentsModule } from './modules/segments/segments.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    HealthModule,
    TelemetryModule,
    GamesModule,
    PlayersModule,
    DevicesModule,
    SegmentsModule,
    CampaignsModule,
  ],
})
export class AppModule {}
