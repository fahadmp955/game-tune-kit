import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebPushService } from './web-push.service';

@ApiTags('Web Push & VAPID')
@Controller('web-push')
export class WebPushController {
  constructor(private readonly webPushService: WebPushService) {}

  @Get('public-key')
  @ApiOperation({
    summary: 'Retrieve Server VAPID Public Key',
    description: 'Returns the W3C VAPID applicationServerKey required by browser PushManager to subscribe.',
  })
  @ApiResponse({
    status: 200,
    description: 'VAPID public key string',
    schema: {
      example: {
        publicKey: 'BMP47yhOvCtTsM2PDhjzS24qzmqQnl10vqy7nIkUAPQ3QvmWutaMnyUflJuu7qXynjnWk_YdklzX1rN7loyBUvw',
      },
    },
  })
  getPublicKey(): { publicKey: string } {
    return {
      publicKey: this.webPushService.getPublicKey(),
    };
  }
}
