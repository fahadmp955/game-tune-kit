import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationPushPort, PushMessage, PushResult } from './notification-push.port';
import { MockPushAdapter } from './adapters/mock-push.adapter';
import { FcmPushAdapter } from './adapters/fcm-push.adapter';
import { ApnsPushAdapter } from './adapters/apns-push.adapter';

@Injectable()
export class PushAdapterResolver implements NotificationPushPort {
  private readonly logger = new Logger(PushAdapterResolver.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mockAdapter: MockPushAdapter,
    private readonly fcmAdapter: FcmPushAdapter,
    private readonly apnsAdapter: ApnsPushAdapter,
  ) {}

  async send(message: PushMessage): Promise<PushResult> {
    const isMockMode = this.configService.get<string>('PUSH_MOCK_MODE', 'true') === 'true';

    if (isMockMode) {
      return this.mockAdapter.send(message);
    }

    if (message.platform === 'ios') {
      if (message.credentials?.apnsP8) {
        return this.apnsAdapter.send(message);
      }
      this.logger.warn(`Missing APNs credentials for iOS device ${message.deviceToken}, falling back to MockPushAdapter`);
      return this.mockAdapter.send(message);
    }

    // Android & Web use FCM
    if (message.credentials?.fcmJson) {
      return this.fcmAdapter.send(message);
    }

    this.logger.warn(`Missing FCM credentials for device ${message.deviceToken}, falling back to MockPushAdapter`);
    return this.mockAdapter.send(message);
  }
}
