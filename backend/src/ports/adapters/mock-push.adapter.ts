import { Injectable, Logger } from '@nestjs/common';
import { NotificationPushPort, PushMessage, PushResult } from '../notification-push.port';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MockPushAdapter implements NotificationPushPort {
  private readonly logger = new Logger(MockPushAdapter.name);

  async send(message: PushMessage): Promise<PushResult> {
    this.logger.log(`[MOCK PUSH] Sending to ${message.platform} (${message.deviceToken}): "${message.title}" - "${message.body}"`);

    // Simulate invalid token detection for test tokens ending in '_invalid'
    if (message.deviceToken.endsWith('_invalid')) {
      return {
        success: false,
        error: 'Simulated invalid/unregistered token',
        isTokenInvalid: true,
      };
    }

    return {
      success: true,
      messageId: `mock_msg_${uuidv4()}`,
    };
  }
}
