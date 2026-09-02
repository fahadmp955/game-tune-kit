import { describe, it, expect, vi } from 'vitest';
import { MockPushAdapter } from '../src/ports/adapters/mock-push.adapter';
import { PushAdapterResolver } from '../src/ports/push-adapter.resolver';

describe('PNS Domain & Push Delivery Engines', () => {
  it('MockPushAdapter dispatches simulated notification successfully', async () => {
    const adapter = new MockPushAdapter();
    const result = await adapter.send({
      deviceToken: 'token_sample_12345',
      platform: 'android',
      title: 'Test Alert',
      body: 'Hello World',
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toContain('mock_msg_');
  });

  it('MockPushAdapter flags invalid tokens for unregistration', async () => {
    const adapter = new MockPushAdapter();
    const result = await adapter.send({
      deviceToken: 'bad_token_invalid',
      platform: 'ios',
      title: 'Test Alert',
      body: 'Hello World',
    });

    expect(result.success).toBe(false);
    expect(result.isTokenInvalid).toBe(true);
  });

  it('PushAdapterResolver routes to MockPushAdapter when PUSH_MOCK_MODE is enabled', async () => {
    const mockConfigService: any = {
      get: vi.fn().mockReturnValue('true'),
    };
    const mockPush = new MockPushAdapter();
    const mockFcm: any = { send: vi.fn() };
    const mockApns: any = { send: vi.fn() };

    const resolver = new PushAdapterResolver(mockConfigService, mockPush, mockFcm, mockApns);

    const result = await resolver.send({
      deviceToken: 'fcm_token_test',
      platform: 'android',
      title: 'Resolver Test',
      body: 'Checking mock routing',
    });

    expect(result.success).toBe(true);
    expect(mockFcm.send).not.toHaveBeenCalled();
  });
});
