import { describe, it, expect, vi } from 'vitest';
import { WebPushService } from '../src/modules/web-push/web-push.service';
import { WebPushAdapter } from '../src/ports/adapters/web-push.adapter';
import { PushAdapterResolver } from '../src/ports/push-adapter.resolver';

describe('Web Push Engine & W3C VAPID Delivery', () => {
  it('WebPushService should initialize and return the VAPID public key', () => {
    const mockConfig: any = {
      get: vi.fn((key, def) => def),
    };
    const service = new WebPushService(mockConfig);
    service.onModuleInit();

    const pubKey = service.getPublicKey();
    expect(pubKey).toBeDefined();
    expect(pubKey.length).toBeGreaterThan(20);
  });

  it('WebPushAdapter rejects non-JSON device tokens and marks them invalid', async () => {
    const mockWebPushService: any = {
      sendNotification: vi.fn(),
    };
    const adapter = new WebPushAdapter(mockWebPushService);

    const result = await adapter.send({
      deviceToken: 'not_a_valid_json_string',
      platform: 'web',
      title: 'Web Push Test',
      body: 'Checking invalid token handling',
    });

    expect(result.success).toBe(false);
    expect(result.isTokenInvalid).toBe(true);
  });

  it('PushAdapterResolver dispatches web platform messages to WebPushAdapter', async () => {
    const mockConfig: any = {
      get: vi.fn().mockReturnValue('false'),
    };
    const mockPush: any = { send: vi.fn() };
    const mockFcm: any = { send: vi.fn() };
    const mockApns: any = { send: vi.fn() };
    const mockWebPush: any = {
      send: vi.fn().mockResolvedValue({ success: true, messageId: 'web_msg_123' }),
    };

    const resolver = new PushAdapterResolver(mockConfig, mockPush, mockFcm, mockApns, mockWebPush);

    const result = await resolver.send({
      deviceToken: JSON.stringify({
        endpoint: 'https://fcm.googleapis.com/fcm/send/sample_endpoint',
        keys: { auth: 'sample_auth', p256dh: 'sample_p256dh' },
      }),
      platform: 'web',
      title: 'Web Push Test',
      body: 'Testing web push resolution',
    });

    expect(result.success).toBe(true);
    expect(mockWebPush.send).toHaveBeenCalledTimes(1);
    expect(mockFcm.send).not.toHaveBeenCalled();
    expect(mockApns.send).not.toHaveBeenCalled();
  });
});
