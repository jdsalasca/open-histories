/* open-histories · offline.js — modo sin conexión: lista de archivos, descargas y estado.
 * Núcleo puro (probado en Node, usable también desde el service worker) + capa de navegador.
 */
(function (root) {
  'use strict';
  const BUILD = (root.OH_BUILD) || 'dev';
  const cacheName = build => `oh-v2-${build}`;

  /** Archivos del cuento `id` en el idioma base y en los idiomas pedidos (solo los que existen en el catálogo). */
  function filesFor(id, langs, catalog) {
    const b = (catalog || []).find(x => x.id === id);
    if (!b || b.soon) return [];
    const want = new Set([`${id}.js`, ...(langs || []).map(l => `${id}.${l}.js`)]);
    return (b.files || []).filter(f => want.has(f)).map(f => `stories/${f}`);
  }

  /** La cáscara de la aplicación: lo mínimo para abrir la repisa y el lector sin conexión. */
  function shellFiles() {
    const assets = ['kit.js', 'settings.js', 'i18n.js', 'text.js', 'words.js', 'perf.js', 'offline.js', 'panel.js', 'reader.js', 'build.js',
      'book.css', 'shelf.css', 'panel.css', 'fonts.css',
      'fonts/Nunito-normal-400.woff2', 'fonts/PlayfairDisplay-normal-600.woff2', 'fonts/PlayfairDisplay-italic-500.woff2',
      'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon.svg'].map(f => `assets/${f}`);
    const audio = ['page-turn.mp3', 'slide.mp3', 'move.mp3'].map(f => `audio/${f}`);
    return ['index.html', 'read.html', 'manifest.webmanifest', 'stories/catalog.js', ...assets, ...audio];
  }

  const api = { BUILD, cacheName, filesFor, shellFiles };

  /* ── capa de navegador ── */
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    const CACHE = cacheName(BUILD);
    const supported = 'caches' in window;
    api.supported = supported;
    api.isOnline = () => navigator.onLine !== false;
    const cat = () => (window.OH && window.OH.catalog) || [];
    const langsWanted = () => { const s = window.OH.settings ? window.OH.settings.get() : {}; return ['zh', 'en'].filter(l => l === s.lang || l === s.sub); };

    async function fetchInto(files, onProgress) {
      if (!supported) return;
      const c = await caches.open(CACHE);
      let done = 0;
      for (const f of files) {
        try { if (!(await c.match(f))) await c.add(new Request(f, { cache: 'reload' })); } catch (_) { /* archivo opcional ausente */ }
        done++; if (onProgress) onProgress(done, files.length);
      }
    }
    /** Descarga los cuentos `ids` (con sus idiomas elegidos) y la cáscara. */
    api.download = (ids, onProgress) => {
      const langs = langsWanted();
      const files = [...new Set([...shellFiles(), ...ids.flatMap(id => filesFor(id, langs, cat()))])];
      return fetchInto(files, onProgress);
    };
    api.downloadAll = onProgress => api.download(cat().filter(b => !b.soon).map(b => b.id), onProgress);
    /** {id: true|false} — un cuento cuenta como descargado si su archivo base está en la caché. */
    api.status = async () => {
      const out = {};
      if (!supported) return out;
      const c = await caches.open(CACHE);
      for (const b of cat()) if (!b.soon) out[b.id] = !!(await c.match(`stories/${b.id}.js`));
      return out;
    };
    /** Registra el service worker (solo en https o localhost). */
    api.register = onUpdate => {
      if (!('serviceWorker' in navigator)) return;
      navigator.serviceWorker.register('sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
          const w = reg.installing;
          w && w.addEventListener('statechange', () => {
            if (w.state === 'installed' && navigator.serviceWorker.controller && onUpdate) onUpdate(() => { w.postMessage('SKIP_WAITING'); });
          });
        });
      }).catch(() => {});
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
    };
    window.OH = window.OH || {};
    window.OH.offline = Object.assign(window.OH.offline || {}, api);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else if (typeof window === 'undefined') root.OHOffline = api; // service worker
})(typeof globalThis !== 'undefined' ? globalThis : this);
