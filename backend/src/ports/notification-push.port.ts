export interface PushMessage {
  deviceToken: string;
  platform: 'android' | 'ios' | 'web';
  title: string;
  body: string;
  badge?: number;
  sound?: string;
  data?: Record<string, any>;
  gameBundleId?: string;
  credentials?: {
    fcmJson?: string;
    apnsP8?: string;
    apnsKeyId?: string;
    apnsTeamId?: string;
  };
}

export interface PushResult {
  success: boolean;
  messageId?: string;
  error?: string;
  isTokenInvalid?: boolean; // True if token should be marked inactive (410 / UNREGISTERED)
}

export const NOTIFICATION_PUSH_PORT = 'NOTIFICATION_PUSH_PORT';

export interface NotificationPushPort {
  send(message: PushMessage): Promise<PushResult>;
}
