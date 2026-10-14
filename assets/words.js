/* open-histories · words.js — "Mis palabras": vocabulario guardado con ⭐ (localStorage['oh-words']). */
(function (root) {
  'use strict';
  const KEY = 'oh-words';

  function createWords(storage) {
    let cache = null; // si el almacenamiento falla, la lista vive en memoria
    const read = () => {
      try {
        const v = storage ? JSON.parse(storage.getItem(KEY)) : null;
        return Array.isArray(v) ? v.filter(x => x && typeof x === 'object' && x.id && x.h) : [];
      } catch (_) { return []; }
    };
    const all = () => { if (!cache) cache = read(); return cache; };
    const write = () => { try { storage && storage.setItem(KEY, JSON.stringify(cache)); } catch (_) { /* sin almacenamiento */ } };
    const key = (id, h) => `${id}:${h}`;
    return {
      key,
      list: () => [...all()],
      has: k => all().some(w => key(w.id, w.h) === k),
      add(w) {
        const k = key(w.id, w.h);
        const rest = all().filter(x => key(x.id, x.h) !== k);
        cache = [...rest, { id: w.id, h: w.h, py: w.py || '', es: w.es || '', en: w.en || '' }];
        write();
      },
      remove(k) { cache = all().filter(x => key(x.id, x.h) !== k); write(); }
    };
  }

  const api = { createWords };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    let ls = null; try { ls = window.localStorage; } catch (_) { /* bloqueado */ }
    window.OH = window.OH || {};
    window.OH.words = createWords(ls);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
