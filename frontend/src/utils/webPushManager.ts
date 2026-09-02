/**
 * Helper to convert base64 URL safe VAPID key to Uint8Array for PushManager.subscribe()
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isWebPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'default';
  return Notification.permission;
}

export interface WebPushSubscriptionResult {
  success: boolean;
  token?: string;
  endpoint?: string;
  error?: string;
}

/**
 * Subscribes the current browser to native Web Push and registers the device in PNS backend
 */
export async function subscribeToWebPush(
  apiBaseUrl: string,
  gameKey?: string,
  playerId = 'web_player_demo',
  attributes: Record<string, any> = { level: 12, platform: 'web_browser' },
): Promise<WebPushSubscriptionResult> {
  if (!isWebPushSupported()) {
    return { success: false, error: 'Web Push is not supported in this browser environment.' };
  }

  try {
    // 1. Request Notification Permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, error: `Notification permission was ${permission}.` };
    }

    // 2. Register Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    // 3. Fetch VAPID Public Key from Backend
    const keyRes = await fetch(`${apiBaseUrl}/web-push/public-key`);
    if (!keyRes.ok) {
      throw new Error(`Failed to fetch VAPID key from server (${keyRes.status})`);
    }
    const { publicKey } = await keyRes.json();
    const applicationServerKey = urlBase64ToUint8Array(publicKey);

    // 4. Subscribe with PushManager
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as unknown as BufferSource,
    });

    const serializedToken = JSON.stringify(subscription);

    // 5. Register Device in PNS Backend
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (gameKey) {
      headers['X-Game-Key'] = gameKey;
    }

    const regRes = await fetch(`${apiBaseUrl}/devices/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        playerId,
        deviceToken: serializedToken,
        platform: 'web',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        appVersion: '1.0.0-web',
        attributes,
      }),
    });

    if (!regRes.ok) {
      throw new Error(`Failed to register device in PNS backend (${regRes.status})`);
    }

    return {
      success: true,
      token: serializedToken,
      endpoint: subscription.endpoint,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to complete Web Push subscription.',
    };
  }
}
