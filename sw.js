import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { Queue } from 'workbox-background-sync';
// self.__WB_MANIFEST is injected by VitePWA
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

const queue = new Queue('sync-movements');

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST' && event.request.url.endsWith('/api/movements')) {
    event.respondWith(
      fetch(event.request.clone()).catch(() => {
        return queue.pushRequest({ request: event.request });
      })
    );
  }
});
