/* open-histories · panel.js — la ruedita ⚙: ajustes, descargas sin conexión y "Mis palabras".
 * OH.panel.mount(container) añade el botón y el panel de papel.
 */
(function () {
  'use strict';
  const S = OH.settings, I = OH.i18n;
  const t = k => I.t(k, S.get().lang);
  const esc = x => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const seg = (k, opts, val) => `<div class="seg" role="group" data-k="${k}">${opts.map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${String(v) === String(val)}">${l}</button>`).join('')}</div>`;
  const row = (label, body) => `<div class="prow"><span class="plabel">${label}</span>${body}</div>`;

  function wordsHTML() {
    const list = OH.words ? OH.words.list() : [];
    const meaning = S.get().sub === 'en' ? 'en' : 'es';
    if (!list.length) return `<p class="pnote">${t('no_words')}</p>`;
    return `<ul class="wlist">${list.map(w => `<li><span class="whz">${esc(w.h)}</span><span class="wpy">${esc(w.py)}</span><span class="wmean">${esc(w[meaning] || w.es || '')}</span><button type="button" class="wbtn" data-say="${esc(w.h)}" aria-label="🔊">🔊</button><button type="button" class="wbtn" data-del="${esc(OH.words.key(w.id, w.h))}" aria-label="✕">✕</button></li>`).join('')}</ul>`;
  }
  function offlineHTML() {
    if (!OH.offline) return '';
    return `<h4>${t('offline')}</h4><p class="pnote" id="offStatus">${OH.offline.isOnline() ? '' : '⚠ '}${t('offline_ready')}</p>
      <div class="pbtns">${OH.currentStory ? `<button type="button" class="chip" data-dl="story">⬇ ${t('download_story')}</button>` : ''}<button type="button" class="chip" data-dl="all">⬇ ${t('download_all')}</button></div>`;
  }
  function bodyHTML() {
    const s = S.get();
    return `<div class="phead"><h3>⚙ ${t('settings')}</h3><button type="button" class="pclose" data-close aria-label="${t('close')}">✕</button></div>
      ${row(t('lang_main'), seg('lang', [['es', t('lang_es')], ['zh', t('lang_zh')], ['en', t('lang_en')]], s.lang))}
      ${row(t('subtitles'), seg('sub', [['es', t('lang_es')], ['en', t('lang_en')], ['none', t('none')]], s.sub))}
      ${row(t('sub_show'), seg('subMode', [['always', t('sub_always')], ['tap', t('sub_tap')], ['hidden', t('sub_hidden')]], s.subMode))}
      ${row(t('pinyin'), seg('pinyin', [['always', t('pinyin_always')], ['tap', t('pinyin_tap')], ['off', t('pinyin_off')]], s.pinyin))}
      ${row(t('font_size'), seg('size', [['S', 'S'], ['M', 'M'], ['L', 'L'], ['XL', 'XL']], s.size))}
      ${row(t('voice_speed'), `<span class="prange"><input type="range" min="0.6" max="1.2" step="0.1" value="${s.rate}" data-k="rate" aria-label="${t('voice_speed')}"><output>${s.rate}×</output></span>`)}
      ${row(t('quality'), seg('quality', [['auto', t('q_auto')], ['alta', t('q_high')], ['media', t('q_mid')], ['baja', t('q_low')]], s.quality))}
      ${row(t('theme'), seg('theme', [['auto', t('theme_auto')], ['light', t('theme_light')], ['dark', t('theme_dark')]], s.theme))}
      <label class="pchk"><input type="checkbox" data-k="sound" ${s.sound ? 'checked' : ''}> ${t('sound_on')}</label>
      <label class="pchk"><input type="checkbox" data-k="motion" ${s.motion === 'reduce' ? 'checked' : ''}> ${t('reduce_motion')}</label>
      <label class="pchk"><input type="checkbox" data-k="terror" ${s.terror ? 'checked' : ''}> ${t('show_terror')}</label>
      <div id="panelOffline">${offlineHTML()}</div>
      <h4>${t('my_words')}</h4><div id="panelWords">${wordsHTML()}</div>`;
  }

  /** Aplica a <html> los ajustes visuales globales (tema, tamaño, movimiento). */
  function applyGlobal() {
    const s = S.get();
    const dark = s.theme === 'dark' || (s.theme === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    const d = document.documentElement;
    d.dataset.size = s.size;
    d.dataset.theme = dark ? 'dark' : 'light';
    d.dataset.motion = s.motion;
    document.body && document.body.classList.toggle('dark', dark);
  }

  function mount(container) {
    const gear = document.createElement('button');
    gear.type = 'button'; gear.className = 'gear'; gear.id = 'gear';
    gear.setAttribute('aria-haspopup', 'dialog'); gear.setAttribute('aria-expanded', 'false');
    const panel = document.createElement('div');
    panel.className = 'panel'; panel.id = 'panel'; panel.hidden = true;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true');
    const label = () => { gear.textContent = '⚙'; gear.setAttribute('aria-label', t('settings')); gear.title = t('settings'); };
    label();
    container.appendChild(gear);
    document.body.appendChild(panel);

    const render = () => { const top = panel.scrollTop; panel.innerHTML = bodyHTML(); panel.scrollTop = top; label(); };
    const open = () => { render(); panel.hidden = false; gear.setAttribute('aria-expanded', 'true'); const f = panel.querySelector('button'); f && f.focus(); };
    const close = () => { panel.hidden = true; gear.setAttribute('aria-expanded', 'false'); gear.focus(); };
    gear.addEventListener('click', () => (panel.hidden ? open() : close()));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(); });
    document.addEventListener('pointerdown', e => { if (!panel.hidden && !panel.contains(e.target) && e.target !== gear) close(); });

    panel.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) return close();
      const b = e.target.closest('.seg button');
      if (b) { S.set({ [b.parentElement.dataset.k]: b.dataset.v }); return render(); }
      const say = e.target.closest('[data-say]');
      if (say) { try { const u = new SpeechSynthesisUtterance(say.dataset.say); u.lang = 'zh-CN'; u.rate = S.get().rate; speechSynthesis.speak(u); } catch (_) {} return; }
      const del = e.target.closest('[data-del]');
      if (del && OH.words) { OH.words.remove(del.dataset.del); return render(); }
      const dl = e.target.closest('[data-dl]');
      if (dl && OH.offline) {
        const prog = (done, total) => { const el = panel.querySelector('#offStatus'); if (el) el.textContent = `${t('downloading')} ${done}/${total}`; };
        const job = dl.dataset.dl === 'story' ? OH.offline.download([OH.currentStory], prog) : OH.offline.downloadAll(prog);
        return job.then(() => { render(); const el = panel.querySelector('#offStatus'); if (el) el.textContent = '✓ ' + t('downloaded'); });
      }
    });
    panel.addEventListener('input', e => {
      const el = e.target.closest('[data-k]'); if (!el) return;
      if (el.type === 'range') { S.set({ rate: Number(el.value) }); el.nextElementSibling.textContent = S.get().rate + '×'; }
      else if (el.type === 'checkbox') { const k = el.dataset.k; S.set({ [k]: k === 'motion' ? (el.checked ? 'reduce' : 'auto') : el.checked }); }
    });
    S.onChange(() => { applyGlobal(); label(); if (!panel.hidden) render(); });
    applyGlobal();
    return { open, close };
  }

  window.OH = window.OH || {};
  /** Barra fija "hay una versión nueva": al tocarla se aplica la actualización. */
  function updateBar(apply) {
    if (document.getElementById('updateBar')) return;
    const b = document.createElement('button');
    b.id = 'updateBar'; b.type = 'button'; b.className = 'update-bar';
    b.textContent = I.t('update_available', S.get().lang);
    b.addEventListener('click', apply);
    document.body.appendChild(b);
  }
  window.OH.panel = { mount, applyGlobal, updateBar };
})();
