/* open-histories · reader.js — lector de un cuento (read.html?s=<id>) */
(function () {
  'use strict';
  const K = OH.kit;
  const $ = s => document.querySelector(s);
  const id = (new URLSearchParams(location.search).get('s') || location.hash.slice(1) || '').toLowerCase();
  const stage = $('#stage');

  if (!/^[a-z0-9-]+$/.test(id)) return fail('Falta el cuento. Vuelve a la repisa y elige uno.');
  const s = document.createElement('script');
  s.src = `stories/${id}.js`;
  s.onerror = () => fail('No encontré ese cuento en la repisa.');
  s.onload = () => { const st = OH.registry[id]; st ? start(st) : fail('Ese cuento no se pudo abrir.'); };
  document.head.appendChild(s);

  function fail(msg) { stage.innerHTML = `<div class="page on" style="display:block;padding:40px"><h2>Ups…</h2><p>${msg}</p><p><a class="back" href="index.html">← Volver a la repisa</a></p></div>`; }

  const clean = t => t.replace(/\*/g, '');
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const titleHTML = t => t.split(' ').map((w, i) => `<span class="w" style="--i:${i}">${w.replace(/\*(.+?)\*/, '<span class="acc">$1</span>')}</span>`).join('');
  /* {{palabra|definición}} → palabra subrayada con su significado */
  const vocab = t => t.replace(/\{\{(.+?)\|(.+?)\}\}/g, (_, w, d) => `<span class="v" tabindex="0" data-d="${d.replace(/"/g, '&quot;')}">${w}</span>`);
  const para = t => `<p>${vocab(t)}</p>`;
  const wordCard = w => `<div class="card word"><h4>📖 Palabra del cuento</h4><b>${w[0]}:</b> ${w[1]}</div>`;
  const thinkCard = t => `<div class="card think"><h4>💭 Piensa un momento</h4>${t[0]}<div><button class="chip" data-idea style="margin-top:8px">Ver una idea</button></div><div class="idea">${t[1]}</div></div>`;

  function start(st) {
    document.title = `${clean(st.title)} · open-histories`;
    document.body.insertAdjacentHTML('afterbegin', K.defs);
    $('#bookTitle').textContent = `${clean(st.title)} · ${st.author}`;

    let muted = false; try { muted = localStorage.getItem('oh-muted') === '1'; } catch (_) {}
    const SFX = { turn: 'audio/page-turn.mp3', slide: 'audio/slide.mp3', move: 'audio/move.mp3' };
    const play = (k, v = .35, delay = 0) => { if (muted) return; try { const a = new Audio(SFX[k]); a.volume = v; setTimeout(() => a.play().catch(() => {}), delay); } catch (_) {} };

    const pages = [{ kind: 'cover' }, ...st.pages.map(p => ({ kind: 'text', ...p })), { kind: 'quiz' }];
    const draw = (name) => { K.reseed(K.hash(st.id + ':' + name)); const f = st.scenes[name]; return f ? f() : ''; };
    const dots = $('#dots'), bar = $('#bar'), numEl = $('#pageNum');
    const prevB = $('#prev'), nextB = $('#next'), sndB = $('#snd');
    let cur = -1, speaking = false;

    pages.forEach((p, i) => {
      const sec = document.createElement('section');
      sec.className = 'page' + (p.kind === 'cover' ? ' cover' : '');
      if (p.kind === 'cover') {
        sec.innerHTML = `<div class="art">${draw('cover')}</div>
        <div class="copy"><div class="chap">Un cuento de ${st.author}</div><h1 class="cover-title">${titleHTML(st.title)}</h1>
        <p class="byline">${st.tagline || ''}</p>
        <p>${st.intro || ''}</p>
        <button class="btn big" data-go="1">Comenzar a leer ✨</button>
        <p class="credit">${st.year ? `Publicado en ${st.year}. ` : ''}Obra en dominio público${st.orig ? ` (<i>${st.orig}</i>)` : ''}. ${st.trans || ''}</p></div>`;
      } else if (p.kind === 'quiz') {
        sec.innerHTML = `<div class="art">${draw('fin')}</div>
        <div class="copy"><div class="chap">Para terminar</div><h2>${titleHTML('¿Qué *aprendiste*?')}</h2>
        <div class="card word"><h4>🌟 La enseñanza</h4>${vocab(st.moral)}</div>
        <p style="font-size:.95rem">Tres preguntas para ver cuánto recuerdas:</p></div>
        <div class="quiz"><div id="qz"></div></div>`;
      } else {
        const n = i;
        sec.innerHTML = `<div class="art">${draw(p.scene)}</div>
        <div class="copy"><div class="chap">${p.h ? esc(p.h) : (st.chapterLabel || 'Capítulo') + ' ' + n}</div>
        <h2>${titleHTML(p.title || st.title)}</h2>
        <div class="txt" tabindex="0">${p.text.map(para).join('')}</div>
        <div class="tools"><button class="chip" data-listen>🔊 Escuchar</button><span class="pgno">${n} / ${pages.length - 2}</span></div>
        ${(p.word || p.think) ? `<div class="cards">${p.word ? wordCard(p.word) : ''}${p.think ? thinkCard(p.think) : ''}</div>` : ''}</div>`;
      }
      stage.appendChild(sec);
      const d = document.createElement('button');
      d.setAttribute('aria-label', p.kind === 'cover' ? 'Portada' : p.kind === 'quiz' ? 'Preguntas' : 'Página ' + i);
      d.onclick = () => go(i); dots.appendChild(d);
    });

    /* quiz */
    (() => {
      const box = $('#qz'); let score = 0, done = 0;
      box.innerHTML = st.quiz.map((q, qi) => `<div class="qb"><h4>${qi + 1}. ${q.q}</h4>${q.o.map((o, oi) => `<button class="opt" data-q="${qi}" data-o="${oi}">${o}</button>`).join('')}<div class="fb" id="fb${qi}"></div></div>`).join('') + `<div class="result" id="res"></div>`;
      box.addEventListener('click', e => {
        const b = e.target.closest('.opt'); if (!b || b.parentElement.dataset.done) return;
        const qi = +b.dataset.q, oi = +b.dataset.o, q = st.quiz[qi]; b.parentElement.dataset.done = 1; done++;
        const good = oi === q.a; if (good) score++;
        b.classList.add(good ? 'ok' : 'no');
        if (!good) b.parentElement.querySelector(`[data-o="${q.a}"]`).classList.add('ok');
        $('#fb' + qi).textContent = (good ? '✅ ' : '💡 ') + (good ? q.ok : q.no);
        play('move', .3);
        if (done === st.quiz.length) $('#res').textContent = score === st.quiz.length ? '⭐⭐⭐ ¡Lectura perfecta! Eres un gran lector.' : score >= st.quiz.length - 1 ? '⭐⭐ ¡Muy bien! Casi perfecto.' : '⭐ ¡Buen intento! Vuelve a leer y lo lograrás.';
      });
    })();

    /* interacción */
    stage.addEventListener('click', e => {
      const g = e.target.closest('[data-go]'); if (g) go(+g.dataset.go);
      const idea = e.target.closest('[data-idea]');
      if (idea) { const el = idea.closest('.card').querySelector('.idea'); el.classList.toggle('show'); idea.textContent = el.classList.contains('show') ? 'Ocultar idea' : 'Ver una idea'; }
      const l = e.target.closest('[data-listen]'); if (l) listen(l);
    });
    function listen(btn) {
      try {
        const sy = window.speechSynthesis; if (!sy) return;
        const all = () => document.querySelectorAll('[data-listen]').forEach(b => b.textContent = '🔊 Escuchar');
        if (speaking) { sy.cancel(); speaking = false; all(); return; }
        const tmp = document.createElement('div'); tmp.innerHTML = pages[cur].text.map(vocab).join(' ');
        tmp.querySelectorAll('.v').forEach(v => v.removeAttribute('data-d'));
        const u = new SpeechSynthesisUtterance(tmp.textContent); u.lang = 'es-ES'; u.rate = .92;
        u.onend = u.onerror = () => { speaking = false; btn.textContent = '🔊 Escuchar'; };
        speaking = true; btn.textContent = '⏹ Detener'; sy.speak(u);
      } catch (_) {}
    }
    function go(n, dir) {
      n = Math.max(0, Math.min(pages.length - 1, n));
      const first = cur < 0; dir = dir || (n >= cur ? 'next' : 'prev');
      try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (_) {}
      speaking = false; document.querySelectorAll('[data-listen]').forEach(b => b.textContent = '🔊 Escuchar');
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
      [...dots.children].forEach((d, i) => d.classList.toggle('on', i === n));
      bar.style.width = ((n + 1) / pages.length * 100) + '%';
      numEl.textContent = n === 0 ? 'Portada' : n === pages.length - 1 ? 'Final' : `Página ${n} de ${pages.length - 2}`;
      prevB.disabled = n === 0; nextB.disabled = n === pages.length - 1;
      try { localStorage.setItem('oh-page-' + st.id, n); } catch (_) {}
      const t = sc.querySelector('.txt'); if (t) t.scrollTop = 0;
    }
    prevB.onclick = () => go(cur - 1, 'prev'); nextB.onclick = () => go(cur + 1, 'next');
    addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(cur + 1, 'next'); if (e.key === 'ArrowLeft') go(cur - 1, 'prev'); });
    let x0 = 0;
    stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 70) go(cur + (dx < 0 ? 1 : -1), dx < 0 ? 'next' : 'prev'); });

    const paintSnd = () => { sndB.textContent = muted ? '🔇 Sonido' : '🔊 Sonido'; sndB.setAttribute('aria-pressed', String(!muted)); };
    sndB.onclick = () => { muted = !muted; try { localStorage.setItem('oh-muted', muted ? '1' : '0'); } catch (_) {} paintSnd(); }; paintSnd();

    /* el cartón "hierve": los bordes se re-trazan ~7 veces por segundo (stop-motion) */
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ts = [...document.querySelectorAll('feTurbulence.boil')]; let k = 0;
      setInterval(() => { if (document.hidden) return; k = (k + 1) % 6; ts.forEach((t, i) => t.setAttribute('seed', 3 + k * 7 + i * 5)); }, 140);
    }
    /* parallax suave con el cursor */
    (() => {
      let tx = 0, ty = 0, cx = 0, cy = 0, svg = null, raf = 0;
      const loop = () => { cx += (tx - cx) * .08; cy += (ty - cy) * .08; if (svg) { svg.style.setProperty('--mx', cx.toFixed(3)); svg.style.setProperty('--my', cy.toFixed(3)); } raf = (Math.abs(tx - cx) + Math.abs(ty - cy) > .002) ? requestAnimationFrame(loop) : 0; };
      stage.addEventListener('pointermove', e => { const a = e.target.closest && e.target.closest('.art'); if (!a) return; svg = a.querySelector('svg'); const r = a.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - .5) * -2; ty = ((e.clientY - r.top) / r.height - .5) * -2; if (!raf) raf = requestAnimationFrame(loop); });
      stage.addEventListener('pointerleave', () => { tx = ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    })();

    let saved = 0; try { saved = +localStorage.getItem('oh-page-' + st.id) || 0; } catch (_) {}
    go(saved >= pages.length ? 0 : saved, 'next');
  }
})();
