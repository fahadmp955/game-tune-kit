import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBody } from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { GameAuthGuard } from '../games/guards/game-auth.guard';
import { Device } from './entities/device.entity';

@ApiTags('Devices & Push Tokens')
@ApiHeader({ name: 'X-Game-Key', description: 'Game API Key for tenant isolation' })
@UseGuards(GameAuthGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register or Refresh Client Device Push Token',
    description: 'Idempotent registration of APNs or FCM push token. Also synchronizes player attributes if provided.',
  })
  @ApiBody({
    type: RegisterDeviceDto,
    examples: {
      androidRegistration: {
        summary: 'Android FCM Registration with Attributes',
        value: {
          playerId: 'usr_10482',
          deviceToken: 'fcm_sample_token_84920482',
          platform: 'android',
          timezone: 'America/New_York',
          appVersion: '1.2.0',
          attributes: { level: 25, lifetimeSpend: 49.99, isSpender: true },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Device successfully registered', type: Device })
  async register(@Req() req: any, @Body() dto: RegisterDeviceDto): Promise<Device> {
    return this.devicesService.registerDevice(req.gameId, dto);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get Active vs Total Registered Device Counts',
    description: 'Returns total registered devices and active deliverable device counts for the current game.',
  })
  @ApiResponse({ status: 200, description: 'Device counts' })
  async getStats(@Req() req: any): Promise<{ total: number; active: number }> {
    return this.devicesService.countDevices(req.gameId);
  }
}
