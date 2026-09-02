/**
 * GameTuneKit Web Push Service Worker (sw.js)
 * Listens for background push events and shows native OS notifications.
 */

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push event received:', event);

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: '🎮 GameTuneKit Alert', body: event.data.text() };
    }
  }

  const title = data.title || '🎮 GameTuneKit Alert';
  const options = {
    body: data.body || 'You have a new in-game update!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'gametune-alert-' + Date.now(),
    renotify: true,
    data: data.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(title, options).catch((err) => {
      console.error('[Service Worker] showNotification error:', err);
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/?view=pns';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    }),
  );
});
