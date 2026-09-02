import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBody } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { SendTestPushDto } from './dto/send-test-push.dto';
import { GameAuthGuard } from '../games/guards/game-auth.guard';
import { Campaign } from './entities/campaign.entity';

@ApiTags('Campaigns & Push Dispatch')
@ApiHeader({ name: 'X-Game-Key', description: 'Game API Key for tenant isolation' })
@UseGuards(GameAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  @ApiOperation({
    summary: 'List All Campaigns and Delivery History',
    description: 'Returns historical and active push campaigns with delivery stats for this game.',
  })
  @ApiResponse({ status: 200, description: 'List of campaigns', type: [Campaign] })
  async findAll(@Req() req: any): Promise<Campaign[]> {
    return this.campaignsService.findAll(req.gameId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create and Optionally Dispatch Campaign',
    description: 'Creates a push campaign, resolves matching cohort devices, applies quiet hours, and dispatches.',
  })
  @ApiBody({
    type: CreateCampaignDto,
    examples: {
      xpWeekend: {
        summary: 'Halloween Double XP Campaign',
        value: {
          name: 'Halloween Double XP Weekend',
          title: '🎃 Double XP Weekend is LIVE!',
          body: 'Log in now to earn 2x EXP on all dungeons. Ends Sunday midnight!',
          targetSegmentId: 'all',
          respectQuietHours: true,
          dispatchImmediately: true,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Campaign created', type: Campaign })
  async create(@Req() req: any, @Body() dto: CreateCampaignDto): Promise<Campaign> {
    return this.campaignsService.createAndDispatch(req.gameId, dto);
  }

  @Post('test-send')
  @ApiOperation({
    summary: 'Send Instant Test Notification to a Single Device',
    description: 'Directly dispatches a test push notification to a specified device token to verify gateway setup.',
  })
  @ApiBody({
    type: SendTestPushDto,
    examples: {
      directTest: {
        summary: 'Test Push to Single Token',
        value: {
          deviceToken: 'fcm_sample_token_test_123',
          platform: 'android',
          title: '🚀 Test Notification from GameTuneKit',
          body: 'This is a live test notification dispatched directly to your device.',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Push dispatch result' })
  async sendTestPush(@Req() req: any, @Body() dto: SendTestPushDto): Promise<any> {
    return this.campaignsService.sendTestPush(req.gameId, dto);
  }
}
