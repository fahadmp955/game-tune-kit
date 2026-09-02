import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { SendTestPushDto } from './dto/send-test-push.dto';
import { PushAdapterResolver } from '../../ports/push-adapter.resolver';
import { PushResult } from '../../ports/notification-push.port';
import { SegmentsService } from '../segments/segments.service';
import { DevicesService } from '../devices/devices.service';
import { GamesService } from '../games/games.service';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    private readonly pushResolver: PushAdapterResolver,
    private readonly segmentsService: SegmentsService,
    private readonly devicesService: DevicesService,
    private readonly gamesService: GamesService,
  ) {}

  async findAll(gameId: string): Promise<Campaign[]> {
    return this.campaignRepository.find({
      where: { gameId },
      order: { createdAt: 'DESC' },
    });
  }

  async sendTestPush(gameId: string, dto: SendTestPushDto): Promise<PushResult> {
    const game = await this.gamesService.findById(gameId);

    const result = await this.pushResolver.send({
      deviceToken: dto.deviceToken,
      platform: dto.platform,
      title: dto.title,
      body: dto.body,
      data: dto.data || {},
      gameBundleId: game.bundleId,
      credentials: {
        fcmJson: game.fcmServiceAccountJson,
        apnsP8: game.apnsKeyP8,
        apnsKeyId: game.apnsKeyId,
        apnsTeamId: game.apnsTeamId,
      },
    });

    if (result.isTokenInvalid) {
      await this.devicesService.markTokenInactive(gameId, dto.deviceToken);
    }

    return result;
  }

  async createAndDispatch(gameId: string, dto: CreateCampaignDto): Promise<Campaign> {
    const game = await this.gamesService.findById(gameId);

    const campaign = this.campaignRepository.create({
      gameId,
      name: dto.name,
      title: dto.title,
      body: dto.body,
      sound: dto.sound || 'default',
      data: dto.data || {},
      targetSegmentId: dto.targetSegmentId || 'all',
      status: dto.dispatchImmediately ? 'sent' : 'draft',
      sentCount: 0,
      successCount: 0,
      failedCount: 0,
    });

    const savedCampaign = await this.campaignRepository.save(campaign);

    if (dto.dispatchImmediately) {
      // 1. Resolve matching player IDs from cohort rules
      const playerIds = await this.segmentsService.resolveMatchingPlayerIds(gameId, dto.targetSegmentId);

      // 2. Fetch active deliverable devices
      const devices = await this.devicesService.findActiveDevices(gameId, playerIds);

      let successCount = 0;
      let failedCount = 0;

      for (const device of devices) {
        // Quiet Hours check (10 PM to 8 AM)
        if (dto.respectQuietHours && device.timezone) {
          try {
            const localHour = new Date(new Date().toLocaleString('en-US', { timeZone: device.timezone })).getHours();
            if (localHour >= 22 || localHour < 8) {
              this.logger.debug(`Suppressing push for device ${device.id} due to Quiet Hours (${localHour}:00 local time)`);
              continue;
            }
          } catch (e) {
            // fallback if timezone string invalid
          }
        }

        const res = await this.pushResolver.send({
          deviceToken: device.deviceToken,
          platform: device.platform,
          title: dto.title,
          body: dto.body,
          sound: dto.sound,
          data: dto.data,
          gameBundleId: game.bundleId,
          credentials: {
            fcmJson: game.fcmServiceAccountJson,
            apnsP8: game.apnsKeyP8,
            apnsKeyId: game.apnsKeyId,
            apnsTeamId: game.apnsTeamId,
          },
        });

        if (res.success) {
          successCount++;
        } else {
          failedCount++;
          if (res.isTokenInvalid) {
            await this.devicesService.markTokenInactive(gameId, device.deviceToken);
          }
        }
      }

      savedCampaign.sentCount = successCount + failedCount;
      savedCampaign.successCount = successCount;
      savedCampaign.failedCount = failedCount;
      savedCampaign.status = 'sent';

      await this.campaignRepository.save(savedCampaign);
    }

    return savedCampaign;
  }
}
