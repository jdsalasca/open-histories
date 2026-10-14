const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

/* Ejecuta sw.js en un contexto aislado con una API de caché simulada. */
function loadSW({ networkFails = false, existing = [] } = {}) {
  const listeners = {};
  const stores = new Map(existing.map(n => [n, new Map()]));
  const counters = { network: 0 };
  class Req { constructor(u, o = {}) { this.url = new URL(u, 'https://x.test/').href; this.method = o.method || 'GET'; this.mode = o.mode || 'cors'; } }
  const res = (url) => ({ ok: true, url, clone() { return this; } });
  const cacheApi = name => {
    if (!stores.has(name)) stores.set(name, new Map());
    const m = stores.get(name);
    const key = r => new URL(typeof r === 'string' ? r : r.url, 'https://x.test/').pathname;
    return {
      async match(r) { return m.get(key(r)); },
      async add(r) { m.set(key(r), res(typeof r === 'string' ? r : r.url)); },
      async put(r, rs) { m.set(key(r), rs); },
      async keys() { return [...m.keys()]; }
    };
  };
  const sandbox = {
    URL, Promise, console, Request: Req,
    location: { origin: 'https://x.test' },
    caches: {
      open: async n => cacheApi(n),
      keys: async () => [...stores.keys()],
      delete: async n => stores.delete(n)
    },
    fetch: async r => { counters.network++; if (networkFails) throw new Error('offline'); return res(r.url); },
    addEventListener: (t, fn) => { listeners[t] = fn; },
    clients: { claim: async () => {} },
    skipWaiting() {},
    importScripts: (...files) => files.forEach(f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx))
  };
  const ctx = vm.createContext(sandbox);
  vm.runInContext('globalThis.self = globalThis;', ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'sw.js'), 'utf8'), ctx);
  const dispatch = async (type, ev) => {
    let p = null; ev.waitUntil = x => { p = x; }; ev.respondWith = x => { p = x; };
    listeners[type](ev);
    return p ? p : null;
  };
  return { dispatch, stores, counters, Req, sandbox };
}

test('install_precaches_shell', async () => {
  const sw = loadSW();
  await sw.dispatch('install', {});
  const cache = sw.stores.get('oh-v2-dev');
  const keys = [...cache.keys()];
  assert.ok(keys.includes('/index.html') && keys.includes('/assets/kit.js') && keys.includes('/stories/catalog.js'));
});

test('fetch_prefers_cache_then_network_and_stores', async () => {
  const sw = loadSW();
  const r = new sw.Req('/stories/perico-conejo.js');
  await sw.dispatch('fetch', { request: r });
  assert.equal(sw.counters.network, 1);
  await sw.dispatch('fetch', { request: new sw.Req('/stories/perico-conejo.js') });
  assert.equal(sw.counters.network, 1, 'la segunda vez sale de la caché');
});

test('fetch_offline_navigation_falls_back_to_index', async () => {
  const sw = loadSW({ networkFails: true });
  const cache = await sw.sandbox.caches.open('oh-v2-dev');
  await cache.add('/index.html');
  const out = await sw.dispatch('fetch', { request: new sw.Req('/read.html?s=nuevo', { mode: 'navigate' }) });
  assert.equal(new URL(out.url, 'https://x.test').pathname, '/index.html');
});

test('activate_removes_old_oh_caches_only', async () => {
  const sw = loadSW({ existing: ['oh-v2-viejo', 'oh-v2-dev', 'otra-app'] });
  await sw.dispatch('activate', {});
  assert.deepEqual([...sw.stores.keys()].sort(), ['oh-v2-dev', 'otra-app']);
});

test('fetch_ignores_cross_origin_and_non_get', async () => {
  const sw = loadSW();
  const calls = [];
  const ev1 = { request: new sw.Req('https://otro.dominio/x.js'), respondWith: () => calls.push('x') };
  sw.sandbox.addEventListener; // no-op
  // el listener ignora (no llama a respondWith)
  const out1 = await sw.dispatch('fetch', ev1);
  assert.equal(out1, null);
  const out2 = await sw.dispatch('fetch', { request: new sw.Req('/a.js', { method: 'POST' }) });
  assert.equal(out2, null);
});
