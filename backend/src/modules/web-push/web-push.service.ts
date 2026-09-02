import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';

@Injectable()
export class WebPushService implements OnModuleInit {
  private readonly logger = new Logger(WebPushService.name);
  private publicKey: string;
  private privateKey: string;
  private subject: string;

  constructor(private readonly configService: ConfigService) {
    this.publicKey = this.configService.get<string>(
      'VAPID_PUBLIC_KEY',
      'BMP47yhOvCtTsM2PDhjzS24qzmqQnl10vqy7nIkUAPQ3QvmWutaMnyUflJuu7qXynjnWk_YdklzX1rN7loyBUvw',
    );
    this.privateKey = this.configService.get<string>(
      'VAPID_PRIVATE_KEY',
      'DO2MK4W9HRzCJpUraN8KXXcnxz2NZvd2jDEHVYfwLbY',
    );
    this.subject = this.configService.get<string>(
      'VAPID_SUBJECT',
      'mailto:admin@gametunekit.com',
    );
  }

  onModuleInit() {
    try {
      webpush.setVapidDetails(this.subject, this.publicKey, this.privateKey);
      this.logger.log('🔑 Web Push VAPID credentials successfully initialized');
    } catch (err: any) {
      this.logger.error(`Failed to initialize VAPID details: ${err.message}`);
    }
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  async sendNotification(
    subscription: webpush.PushSubscription,
    payload: string,
  ): Promise<webpush.SendResult> {
    return webpush.sendNotification(subscription, payload);
  }
}
