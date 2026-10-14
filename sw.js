/* open-histories · sw.js — service worker: cáscara precacheada + caché al leer. */
importScripts('assets/build.js', 'assets/offline.js');
const O = self.OHOffline;
const CACHE = O.cacheName(O.BUILD);

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(O.shellFiles().map(f => c.add(new Request(f, { cache: 'reload' })).catch(() => {})))));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('oh-v2-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

/* cache primero; si no está, red y se guarda para la próxima vez */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const hit = await c.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok && !req.url.includes('perf=1')) c.put(req, res.clone());
      return res;
    } catch (err) {
      const fallback = req.mode === 'navigate' ? await c.match('index.html') : null;
      if (fallback) return fallback;
      throw err;
    }
  })());
});
