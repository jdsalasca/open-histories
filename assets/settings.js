/* open-histories · settings.js — ajustes de la ruedita ⚙
 * Módulo puro: sin DOM. Almacenamiento inyectable para poder probarlo en Node.
 */
(function (root) {
  'use strict';
  const KEY = 'oh-settings';
  const DEFAULTS = Object.freeze({
    v: 1, lang: 'es', sub: 'none', subMode: 'tap', pinyin: 'tap', size: 'M',
    rate: 1, sound: true, quality: 'auto', motion: 'auto', theme: 'auto', terror: true
  });
  const ENUMS = {
    lang: ['es', 'zh', 'en'], sub: ['es', 'en', 'none'], subMode: ['always', 'tap', 'hidden'],
    pinyin: ['always', 'tap', 'off'], size: ['S', 'M', 'L', 'XL'],
    quality: ['auto', 'alta', 'media', 'baja'], motion: ['auto', 'reduce'], theme: ['auto', 'light', 'dark']
  };

  function normalize(raw) {
    const r = raw && typeof raw === 'object' ? raw : {};
    const s = { ...DEFAULTS };
    for (const k of Object.keys(ENUMS)) if (ENUMS[k].includes(r[k])) s[k] = r[k];
    const rate = Number(r.rate);
    s.rate = Number.isFinite(rate) ? Math.min(1.2, Math.max(0.6, rate)) : DEFAULTS.rate;
    s.sound = typeof r.sound === 'boolean' ? r.sound : DEFAULTS.sound;
    s.terror = typeof r.terror === 'boolean' ? r.terror : DEFAULTS.terror;
    if (s.sub !== 'none' && s.sub === s.lang) s.sub = s.lang === 'es' ? 'en' : 'es';
    return s;
  }

  /** Crea un almacén de ajustes sobre un `storage` (getItem/setItem) o sin él. */
  function createStore(storage) {
    let current = null;
    const listeners = new Set();
    const read = () => {
      try { return storage ? JSON.parse(storage.getItem(KEY)) : null; } catch (_) { return null; }
    };
    const write = s => { try { storage && storage.setItem(KEY, JSON.stringify(s)); } catch (_) { /* sin almacenamiento */ } };
    const store = {
      DEFAULTS,
      load() { current = normalize(read()); return current; },
      get() { return current || store.load(); },
      save(s) { current = normalize(s); write(current); },
      set(patch) {
        current = normalize({ ...store.get(), ...patch });
        write(current);
        listeners.forEach(fn => fn(current));
        return current;
      },
      onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
    };
    return store;
  }

  const api = { DEFAULTS, ENUMS, normalize, createStore };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    let ls = null;
    try { ls = window.localStorage; } catch (_) { /* bloqueado */ }
    window.OH = window.OH || {};
    window.OH.settings = createStore(ls);
    window.OH.settings.ENUMS = ENUMS;
    window.OH.settings.normalize = normalize;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
