/* open-histories · reader.js — lector de un cuento (read.html?s=<id>)
 * Idiomas: principal (es | zh | en) + subtítulo (es | en | ninguno), pinyin con <ruby> y glosario.
 */
(function () {
  'use strict';
  const K = OH.kit, S = OH.settings, TX = OH.text, I = OH.i18n;
  const $ = s => document.querySelector(s);
  const qs = new URLSearchParams(location.search);
  const id = (qs.get('s') || location.hash.slice(1) || '').toLowerCase();
  const base = ['stories/', 'tests/fixtures/'].includes(qs.get('base')) ? qs.get('base') : 'stories/';
  const stage = $('#stage');
  const TTS = { es: 'es-ES', zh: 'zh-CN', en: 'en-US' };

  /* parámetros de depuración: ?lang=zh&sub=es&pinyin=always (se guardan como ajustes) */
  const patch = {};
  ['lang', 'sub', 'subMode', 'pinyin'].forEach(k => { if (qs.get(k)) patch[k] = qs.get(k); });
  if (Object.keys(patch).length) S.set(patch);

  if (!/^[a-z0-9-]+$/.test(id)) return fail('Falta el cuento. Vuelve a la repisa y elige uno.');
  loadScript(`${base}${id}.js`).then(ok => { const st = OH.registry[id]; (ok && st) ? start(st) : fail('No encontré ese cuento en la repisa.'); });

  function loadScript(src) {
    return new Promise(res => { const s = document.createElement('script'); s.src = src; s.onload = () => res(true); s.onerror = () => res(false); document.head.appendChild(s); });
  }
  function fail(msg) { stage.innerHTML = `<div class="page on" style="display:block;padding:40px"><h2>Ups…</h2><p>${msg}</p><p><a class="back" href="index.html">← Volver a la repisa</a></p></div>`; }

  const clean = t => String(t).replace(/\*/g, '');
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const titleHTML = t => String(t).split(' ').map((w, i) => `<span class="w" style="--i:${i}">${w.replace(/\*(.+?)\*/, '<span class="acc">$1</span>')}</span>`).join('');
  /* {{palabra|definición}} → palabra subrayada con su significado */
  const vocab = t => String(t).replace(/\{\{(.+?)\|(.+?)\}\}/g, (_, w, d) => `<span class="v" tabindex="0" data-d="${esc(d)}">${w}</span>`);

  async function start(st) {
    document.body.insertAdjacentHTML('afterbegin', K.defs);
    OH.currentStory = st.id;
    if (st.theme) document.body.classList.add(st.theme);

    const pages = [{ kind: 'cover' }, ...st.pages.map(p => ({ kind: 'text', ...p })), { kind: 'quiz' }];
    const dots = $('#dots'), bar = $('#bar'), numEl = $('#pageNum');
    const prevB = $('#prev'), nextB = $('#next'), sndB = $('#snd');
    let cur = -1, speaking = false, lang = { main: 'es', sub: null, notes: [] };

    /* ── datos por idioma ── */
    const dataOf = code => code === 'es'
      ? { title: st.title, tagline: st.tagline, intro: st.intro, moral: st.moral, pages: st.pages, quiz: st.quiz, glossary: [] }
      : ((OH.langs || {})[st.id] || {})[code];
    const have = () => { const a = { es: true }; Object.keys((OH.langs || {})[st.id] || {}).forEach(c => { a[c] = true; }); return a; };
    async function ensureLangs() {
      const s = S.get();
      const want = [s.lang, s.sub].filter(l => l && l !== 'none' && l !== 'es' && !dataOf(l));
      await Promise.all([...new Set(want)].map(l => loadScript(`${base}${st.id}.${l}.js`)));
      lang = TX.resolveLangs(s, have());
    }
    const t = (k) => I.t(k, lang.main);

    /* ── render de cada párrafo ── */
    function mainHTML(text, py, L, gl) {
      if (L !== 'zh') return vocab(text);
      const chunks = TX.markGlossary(text, gl);
      const pairs = TX.rubyPairs(text, py);
      const tags = TX.tagMask(text);
      let k = 0;
      const meaning = lang.sub === 'en' ? 'en' : 'es';
      return chunks.map(ch => {
        const n = [...ch.t].length;
        const base = k;
        const inner = pairs.slice(k, k + n).map((x, i) => (tags[base + i] ? x.c : x.p ? `<ruby>${esc(x.c)}<rt>${esc(x.p)}</rt></ruby>` : esc(x.c))).join('');
        k += n;
        if (ch.g == null) return inner;
        const g = gl[ch.g];
        const saved = OH.words && OH.words.has(OH.words.key(st.id, g.h)) ? ' saved' : '';
        return `<span class="v zhw${saved}" tabindex="0" data-g="${ch.g}" data-d="${esc((g.py ? g.py + ' · ' : '') + (g[meaning] || g.es || ''))}">${inner}</span>`;
      }).join('');
    }
    function paraHTML(text, py, L, gl, subText, i, j) {
      return `<div class="para" data-i="${i}" data-j="${j}"><p class="main lang-${L}">${mainHTML(text, py, L, gl)}</p>${subText ? `<p class="subt lang-${lang.sub}">${vocab(subText)}</p>` : ''}</div>`;
    }
    const wordCard = w => `<div class="card word"><h4>${t('word_card')}</h4><b>${w[0]}:</b> ${w[1]}</div>`;
    const thinkCard = th => `<div class="card think"><h4>${t('think_card')}</h4>${th[0]}<div><button class="chip" data-idea style="margin-top:8px">${t('see_idea')}</button></div><div class="idea">${th[1]}</div></div>`;
    const draw = name => { K.reseed(K.hash(st.id + ':' + name)); const f = st.scenes[name]; return f ? f() : ''; };

    function renderCopy(i) {
      const p = pages[i], sec = stage.children[i];
      const copy = sec.querySelector('.copy'); if (!copy) return;
      const L = lang.main, ES = dataOf('es'), D = dataOf(L) || ES, SUB = lang.sub ? dataOf(lang.sub) : null;
      const gl = (D.glossary || []);
      if (p.kind === 'cover') {
        copy.innerHTML = `<div class="chap">${L === 'es' ? 'Un cuento de ' : ''}${esc(st.author)}</div><h1 class="cover-title">${titleHTML(D.title || st.title)}</h1>
          <p class="byline">${D.tagline || ''}</p><p>${D.intro || ''}</p>
          ${st.warning ? `<span class="warn">🎃 ${st.warning}</span>` : ''}
          <button class="btn big" data-go="1">${t('start')}</button>
          <p class="credit">${st.year ? `${st.year}. ` : ''}${st.orig ? `<i>${st.orig}</i>. ` : ''}${st.trans || ''}</p>`;
      } else if (p.kind === 'quiz') {
        copy.innerHTML = `<div class="chap">${t('quiz_title')}</div><h2>${titleHTML(t('quiz_title'))}</h2>
          <div class="card word"><h4>${t('moral')}</h4>${vocab(D.moral || ES.moral)}</div><p style="font-size:.95rem">${t('quiz_intro')}</p>`;
        renderQuiz(sec, D.quiz || ES.quiz);
      } else {
        const idx = i - 1, pg = ES.pages[idx], pgL = (D.pages || [])[idx] || pg, pgS = SUB && (SUB.pages || [])[idx];
        const paras = (pgL.text || pg.text).map((tx, j) => paraHTML(tx, pgL.py && pgL.py[j], L, gl, pgS && pgS.text && pgS.text[j], i, j)).join('');
        const word = pgL.word || pg.word, think = pgL.think || pg.think;
        copy.innerHTML = `<div class="chap">${p.h ? esc(p.h) : (L === 'es' ? (st.chapterLabel || 'Capítulo') + ' ' + i : '')}</div>
          <h2>${titleHTML(pgL.title || p.title || st.title)}</h2>
          <div class="txt" tabindex="0">${paras}</div>
          <div class="tools"><button class="chip" data-listen>${t('listen')}</button><span class="pgno">${i} / ${pages.length - 2}</span></div>
          ${(word || think) ? `<div class="cards">${word ? wordCard(word) : ''}${think ? thinkCard(think) : ''}</div>` : ''}`;
      }
    }
    function renderQuiz(sec, quiz) {
      const box = sec.querySelector('.quiz'); if (!box) return;
      let score = 0, done = 0;
      box.innerHTML = quiz.map((q, qi) => `<div class="qb"><h4>${qi + 1}. ${q.q}</h4>${q.o.map((o, oi) => `<button class="opt" data-q="${qi}" data-o="${oi}">${o}</button>`).join('')}<div class="fb" data-fb="${qi}"></div></div>`).join('') + `<div class="result"></div>`;
      box.onclick = e => {
        const b = e.target.closest('.opt'); if (!b || b.parentElement.dataset.done) return;
        const qi = +b.dataset.q, oi = +b.dataset.o, q = quiz[qi]; b.parentElement.dataset.done = 1; done++;
        const good = oi === q.a; if (good) score++;
        b.classList.add(good ? 'ok' : 'no');
        if (!good) b.parentElement.querySelector(`[data-o="${q.a}"]`).classList.add('ok');
        box.querySelector(`[data-fb="${qi}"]`).textContent = (good ? '✅ ' : '💡 ') + (good ? q.ok : q.no);
        play('move', .3);
        if (done === quiz.length) box.querySelector('.result').textContent = score === quiz.length ? '⭐⭐⭐' : score >= quiz.length - 1 ? '⭐⭐' : '⭐';
      };
    }

    /* ── sonido ── */
    const SFX = { turn: 'audio/page-turn.mp3', slide: 'audio/slide.mp3', move: 'audio/move.mp3' };
    const play = (k, v = .35, delay = 0) => { if (!S.get().sound) return; try { const a = new Audio(SFX[k]); a.volume = v; setTimeout(() => a.play().catch(() => {}), delay); } catch (_) {} };

    /* ── render perezoso: solo se dibuja la página actual y sus vecinas ── */
    const mounted = new Set();
    function mountArt(i, force) {
      const art = stage.children[i] && stage.children[i].querySelector('.art'); if (!art) return;
      if (mounted.has(i) && !force) return;
      art.innerHTML = draw(art.dataset.scene); mounted.add(i);
    }
    function ensureArts(n) {
      for (let i = 0; i < pages.length; i++) {
        if (Math.abs(i - n) <= 1) mountArt(i);
        else if (mounted.has(i)) { stage.children[i].querySelector('.art').innerHTML = ''; mounted.delete(i); }
      }
    }
    function applyQuality() {
      const tier = OH.perf.current();
      if (K.quality() === tier && document.documentElement.dataset.q === tier) return;
      OH.perf.apply(tier);
      [...mounted].forEach(i => mountArt(i, true));
    }
    OH.perf.onTier(() => applyQuality());
    OH.perf.apply(OH.perf.current());

    /* ── construcción de secciones ── */
    pages.forEach((p, i) => {
      const sec = document.createElement('section');
      sec.className = 'page' + (p.kind === 'cover' ? ' cover' : '');
      sec.innerHTML = `<div class="art" data-scene="${p.kind === 'cover' ? 'cover' : p.kind === 'quiz' ? 'fin' : p.scene}"></div><div class="copy"></div>${p.kind === 'quiz' ? '<div class="quiz"></div>' : ''}`;
      stage.appendChild(sec);
      const d = document.createElement('button'); d.onclick = () => go(i); dots.appendChild(d);
    });

    function applySettings() {
      const s = S.get();
      if (OH.panel) OH.panel.applyGlobal();
      stage.dataset.submode = lang.sub ? s.subMode : 'hidden';
      stage.dataset.pinyin = lang.main === 'zh' ? s.pinyin : 'off';
      document.documentElement.lang = lang.main;
      $('#bookTitle').textContent = `${clean((dataOf(lang.main) || dataOf('es')).title || st.title)} · ${st.author}`;
      document.title = `${clean((dataOf(lang.main) || dataOf('es')).title || st.title)} · open-histories`;
      $('#backLink').textContent = t('back_shelf');
      prevB.textContent = t('prev'); nextB.textContent = t('next');
      sndB.textContent = (s.sound ? '🔊 ' : '🔇 ') + t('sound');
      [...dots.children].forEach((d, i) => d.setAttribute('aria-label', i === 0 ? t('cover') : i === pages.length - 1 ? t('quiz_title') : String(i)));
      const bar2 = $('#noteBar');
      if (bar2) bar2.textContent = lang.notes.map(n => { const [, l] = n.split(':'); return t('lang_missing').replace('{lang}', t('lang_' + l)); }).join(' ');
      if (bar2) bar2.hidden = !lang.notes.length;
    }
    function updateNum() {
      numEl.textContent = cur === 0 ? t('cover') : cur === pages.length - 1 ? t('final') : t('page_of').replace('{n}', cur).replace('{m}', pages.length - 2);
    }
    async function refresh() {
      await ensureLangs();
      applySettings();
      applyQuality();
      for (let i = 0; i < pages.length; i++) renderCopy(i);
      if (cur >= 0) updateNum();
      if (cur >= 0) stage.children[cur].classList.add('on');
    }

    /* ── interacción ── */
    stage.addEventListener('click', e => {
      const g = e.target.closest('[data-go]'); if (g) return go(+g.dataset.go);
      const idea = e.target.closest('[data-idea]');
      if (idea) { const el = idea.closest('.card').querySelector('.idea'); el.classList.toggle('show'); idea.textContent = el.classList.contains('show') ? t('hide_idea') : t('see_idea'); return; }
      const l = e.target.closest('[data-listen]'); if (l) return listen(l);
      const w = e.target.closest('.v.zhw');
      if (w) { toggleWord(w); e.stopPropagation(); return; }
      const para = e.target.closest('.para'); if (para) para.classList.toggle('open');
    });
    function toggleWord(el) {
      if (!OH.words) return;
      const D = dataOf('zh'); const g = D && D.glossary && D.glossary[+el.dataset.g]; if (!g) return;
      const key = OH.words.key(st.id, g.h);
      if (OH.words.has(key)) { OH.words.remove(key); el.classList.remove('saved'); }
      else { OH.words.add({ id: st.id, h: g.h, py: g.py || '', es: g.es || '', en: g.en || '' }); el.classList.add('saved'); }
    }
    function listen(btn) {
      try {
        const sy = window.speechSynthesis; if (!sy) return;
        const all = () => document.querySelectorAll('[data-listen]').forEach(b => { b.textContent = t('listen'); });
        if (speaking) { sy.cancel(); speaking = false; all(); return; }
        const D = dataOf(lang.main) || dataOf('es'), ES = dataOf('es');
        const pg = (D.pages || [])[cur - 1] || ES.pages[cur - 1];
        const u = new SpeechSynthesisUtterance(pg.text.map(x => String(x).replace(/\{\{(.+?)\|.+?\}\}/g, '$1').replace(/<[^>]+>/g, '')).join(' '));
        u.lang = TTS[lang.main] || 'es-ES'; u.rate = S.get().rate;
        u.onend = u.onerror = () => { speaking = false; btn.textContent = t('listen'); };
        speaking = true; btn.textContent = t('stop'); sy.speak(u);
      } catch (_) {}
    }
    function go(n, dir) {
      n = Math.max(0, Math.min(pages.length - 1, n));
      const first = cur < 0; dir = dir || (n >= cur ? 'next' : 'prev');
      try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (_) {}
      speaking = false; document.querySelectorAll('[data-listen]').forEach(b => { b.textContent = t('listen'); });
      const secs = [...stage.children];
      secs.forEach((sc, i) => {
        if (i === n) return;
        if (sc.classList.contains('on')) {
          sc.classList.remove('on', 'enter'); sc.classList.add('leave'); if (dir === 'prev') sc.classList.add('prev');
          setTimeout(() => sc.classList.remove('leave', 'prev'), 880);
        }
      });
      const sc = secs[n]; sc.classList.remove('leave', 'prev', 'on', 'enter'); void sc.offsetWidth; sc.classList.add('on', 'enter');
      if (!first && n !== cur) { play('turn', .4); play('slide', .22, 550); }
      cur = n;
      ensureArts(n);
      OH.perf.sample(); OH.perf.hud();
      [...dots.children].forEach((d, i) => d.classList.toggle('on', i === n));
      bar.style.width = ((n + 1) / pages.length * 100) + '%';
      updateNum();
      prevB.disabled = n === 0; nextB.disabled = n === pages.length - 1;
      try { localStorage.setItem('oh-page-' + st.id, n); } catch (_) {}
      const tx = sc.querySelector('.txt'); if (tx) tx.scrollTop = 0;
    }
    prevB.onclick = () => go(cur - 1, 'prev'); nextB.onclick = () => go(cur + 1, 'next');
    addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(cur + 1, 'next'); if (e.key === 'ArrowLeft') go(cur - 1, 'prev'); });
    let x0 = 0;
    stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 70) go(cur + (dx < 0 ? 1 : -1), dx < 0 ? 'next' : 'prev'); });
    sndB.onclick = () => S.set({ sound: !S.get().sound });
    S.onChange(() => { refresh(); });

    /* el cartón "hierve": los bordes se re-trazan ~7 veces por segundo (stop-motion) */
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ts = [...document.querySelectorAll('feTurbulence.boil')]; let k = 0;
      setInterval(() => { if (document.hidden || OH.perf.current() !== 'alta') return; k = (k + 1) % 6; ts.forEach((tt, i) => tt.setAttribute('seed', 3 + k * 7 + i * 5)); }, 140);
    }
    /* parallax suave con el cursor */
    (() => {
      let tx = 0, ty = 0, cx = 0, cy = 0, svg = null, raf = 0;
      const loop = () => { cx += (tx - cx) * .08; cy += (ty - cy) * .08; if (svg) { svg.style.setProperty('--mx', cx.toFixed(3)); svg.style.setProperty('--my', cy.toFixed(3)); } raf = (Math.abs(tx - cx) + Math.abs(ty - cy) > .002) ? requestAnimationFrame(loop) : 0; };
      stage.addEventListener('pointermove', e => { const a = e.target.closest && e.target.closest('.art'); if (!a) return; svg = a.querySelector('svg'); const r = a.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - .5) * -2; ty = ((e.clientY - r.top) / r.height - .5) * -2; if (!raf) raf = requestAnimationFrame(loop); });
      stage.addEventListener('pointerleave', () => { tx = ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    })();

    await refresh();
    let saved = 0; try { saved = +localStorage.getItem('oh-page-' + st.id) || 0; } catch (_) {}
    go(saved >= pages.length ? 0 : saved, 'next');
  }
})();
