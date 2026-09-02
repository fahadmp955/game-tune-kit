import { Injectable, Logger } from '@nestjs/common';
import { NotificationPushPort, PushMessage, PushResult } from '../notification-push.port';
import { WebPushService } from '../../modules/web-push/web-push.service';

@Injectable()
export class WebPushAdapter implements NotificationPushPort {
  private readonly logger = new Logger(WebPushAdapter.name);

  constructor(private readonly webPushService: WebPushService) {}

  async send(message: PushMessage): Promise<PushResult> {
    this.logger.log(`[Web Push] Preparing dispatch for token: ${message.deviceToken.substring(0, 32)}...`);

    let subscription: any;
    try {
      subscription = JSON.parse(message.deviceToken);
    } catch {
      // If token is just a URL endpoint without keys object, mock/fallback
      return {
        success: false,
        error: 'Invalid Web Push Subscription JSON format',
        isTokenInvalid: true,
      };
    }

    if (!subscription.endpoint || !subscription.keys?.auth || !subscription.keys?.p256dh) {
      return {
        success: false,
        error: 'Missing required Web Push subscription keys (auth / p256dh)',
        isTokenInvalid: true,
      };
    }

    const payload = JSON.stringify({
      title: message.title,
      body: message.body,
      sound: message.sound || 'default',
      data: message.data || {},
      icon: '/assets/icon-192.png',
      badge: '/assets/badge-72.png',
    });

    try {
      const res = await this.webPushService.sendNotification(subscription, payload);
      this.logger.log(`✓ Web Push delivered successfully (HTTP ${res.statusCode})`);
      return {
        success: true,
        messageId: `web_push_${Date.now()}`,
      };
    } catch (err: any) {
      this.logger.error(`Web Push delivery failed: ${err.message}`);

      // 410 Gone / 404 Not Found indicates the browser revoked permission or subscription expired
      const isGone = err.statusCode === 410 || err.statusCode === 404 || err.message?.includes('expired');

      return {
        success: false,
        error: err.message,
        isTokenInvalid: isGone,
      };
    }
  }
}
