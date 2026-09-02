import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { PushAdapterResolver } from '../../ports/push-adapter.resolver';
import { MockPushAdapter } from '../../ports/adapters/mock-push.adapter';
import { FcmPushAdapter } from '../../ports/adapters/fcm-push.adapter';
import { ApnsPushAdapter } from '../../ports/adapters/apns-push.adapter';
import { WebPushAdapter } from '../../ports/adapters/web-push.adapter';
import { SegmentsModule } from '../segments/segments.module';
import { DevicesModule } from '../devices/devices.module';
import { WebPushModule } from '../web-push/web-push.module';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign]), SegmentsModule, DevicesModule, WebPushModule],
  controllers: [CampaignsController],
  providers: [
    CampaignsService,
    PushAdapterResolver,
    MockPushAdapter,
    FcmPushAdapter,
    ApnsPushAdapter,
    WebPushAdapter,
  ],
  exports: [CampaignsService],
})
export class CampaignsModule {}
