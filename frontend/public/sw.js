/**
 * GameTuneKit Web Push Service Worker (sw.js)
 * Listens for background push events and shows native OS notifications.
 */

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: 'GameTuneKit Notification', body: event.data.text() };
    }
  }

  const title = data.title || '🎮 GameTuneKit Alert';
  const options = {
    body: data.body || 'You have a new in-game update!',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      { action: 'open', title: 'Open Game' },
      { action: 'close', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/?view=pns';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    }),
  );
});
