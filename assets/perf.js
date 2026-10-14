/* open-histories · perf.js — niveles de calidad y gobernador Auto.
 * Núcleo puro (probado en Node) + una capa fina de navegador para muestrear cuadros.
 */
(function (root) {
  'use strict';
  const TIERS = ['alta', 'media', 'baja'];
  const SLOW_MS = 28;      // mediana por encima de esto → bajar un nivel
  const FAST_MS = 16;      // mediana por debajo de esto → sugerir subir
  const HYST_MS = 10000;   // no subir antes de 10 s desde el último cambio

  const median = a => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

  /** Decide el siguiente nivel. Solo baja automáticamente; subir es una sugerencia con histéresis. */
  function nextTier(current, samplesMs, lastChangeMs, nowMs) {
    const idx = Math.max(0, TIERS.indexOf(current));
    if (!samplesMs || !samplesMs.length) return { tier: TIERS[idx], reason: 'hold' };
    const m = median(samplesMs);
    if (m > SLOW_MS && idx < TIERS.length - 1) return { tier: TIERS[idx + 1], reason: 'down' };
    if (m <= FAST_MS && idx > 0 && nowMs - lastChangeMs >= HYST_MS) return { tier: TIERS[idx], reason: 'up-suggest' };
    return { tier: TIERS[idx], reason: 'hold' };
  }

  /** Nivel efectivo: el manual del ajuste, o el que haya decidido el gobernador (por defecto alta). */
  function tierFor(settings, governorTier) {
    const q = settings && settings.quality;
    if (TIERS.includes(q)) return q;
    return TIERS.includes(governorTier) ? governorTier : 'alta';
  }

  const api = { TIERS, SLOW_MS, FAST_MS, HYST_MS, median, nextTier, tierFor };

  /* ── capa de navegador ── */
  if (typeof window !== 'undefined') {
    let governor = 'alta', lastChange = 0, onTier = null;
    try { governor = TIERS.includes(localStorage.getItem('oh-tier')) ? localStorage.getItem('oh-tier') : 'alta'; } catch (_) {}
    api.current = () => tierFor(window.OH.settings ? window.OH.settings.get() : {}, governor);
    api.apply = tier => { document.documentElement.dataset.q = tier; if (window.OH.kit && window.OH.kit.setQuality) window.OH.kit.setQuality(tier); };
    api.onTier = fn => { onTier = fn; };
    /** Muestrea ~3 s de cuadros; si el ajuste es Auto y va lento, baja un nivel. */
    api.sample = () => {
      const settings = window.OH.settings.get();
      if (settings.quality !== 'auto' || document.hidden) return;
      const t0 = performance.now(); const deltas = []; let last = t0;
      const step = now => {
        deltas.push(now - last); last = now;
        if (now - t0 < 3000 && !document.hidden) return requestAnimationFrame(step);
        const r = nextTier(governor, deltas.slice(2), lastChange, now);
        if (r.reason === 'down') {
          governor = r.tier; lastChange = now;
          try { localStorage.setItem('oh-tier', governor); } catch (_) {}
          if (onTier) onTier(api.current());
        }
        if (location.search.includes('perf=1')) api.hud(`${r.reason} → ${r.tier} (mediana ${median(deltas).toFixed(1)} ms)`);
      };
      requestAnimationFrame(step);
    };
    /** ?perf=1: panel con nivel, nodos DOM y fps aproximados. */
    api.hud = msg => {
      if (!location.search.includes('perf=1')) return;
      let el = document.getElementById('perfHud');
      if (!el) { el = document.createElement('div'); el.id = 'perfHud'; el.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99;background:#000c;color:#9f9;font:12px monospace;padding:6px 8px;border-radius:6px;white-space:pre'; document.body.appendChild(el); }
      el.textContent = `calidad: ${api.current()}\nnodos: ${document.getElementsByTagName('*').length}\n${msg || ''}`;
    };
    window.OH = window.OH || {};
    window.OH.perf = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
