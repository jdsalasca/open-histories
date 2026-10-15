/* open-histories · text.js — utilidades puras de texto (sin DOM):
 * emparejar caracteres chinos con su pinyin (ruby), marcar glosarios y resolver idiomas.
 */
(function (root) {
  'use strict';
  const CJK = /[㐀-䶿一-鿿豈-﫿]/;
  // segmentación de frases: terminadores, cierres que se pegan, y etiquetas que se respetan
  const TERM = new Set([...'。！？…?!.']);
  const CLOSE = new Set([...'」』”"’）)']);
  const TAG_AT = /^<\/?[bi]>/;
  // letras de pinyin con marcas de tono (Latin-1/Extendido) y marcas combinantes
  const PINYIN_LETTER = /[A-Za-zÀ-ɏḀ-ỿ̀-ͯ]/;

  /** Recorre `text` y `py` a la vez. Devuelve los pares y lo que sobra de `py`. Nunca lanza. */
  function walk(text, py) {
    const s = String(text == null ? '' : text);
    const p = String(py == null ? '' : py);
    let i = 0;
    const out = [];
    for (const c of s) {
      if (CJK.test(c)) {
        while (i < p.length && /\s/.test(p[i])) i++;
        let syl = '';
        while (i < p.length && PINYIN_LETTER.test(p[i])) { syl += p[i]; i++; }
        out.push({ c, p: syl || null });
      } else {
        if (!/\s/.test(c)) {
          while (i < p.length && /\s/.test(p[i])) i++;
          if (p[i] === c) i++;
        }
        out.push({ c, p: null });
      }
    }
    return { pairs: out, rest: p.slice(i) };
  }
  const rubyPairs = (text, py) => walk(text, py).pairs;

  /** Revisa el alineamiento: cuántos caracteres chinos se quedaron sin sílaba y qué pinyin sobra. */
  function rubyCheck(text, py) {
    const { pairs, rest } = walk(text, py);
    const missing = pairs.filter(x => CJK.test(x.c) && !x.p).length;
    const tail = rest.trim();
    return { missing, leftover: PINYIN_LETTER.test(tail) ? tail : '' };
  }

  /** Divide `text` en trozos; `g` es el índice del glosario si el trozo es una palabra (más larga primero, sin solapes). */
  function markGlossary(text, glossary) {
    const s = String(text == null ? '' : text);
    if (!s) return [];
    const words = (glossary || []).map((e, idx) => ({ h: e && e.h, idx })).filter(w => w.h);
    words.sort((a, b) => b.h.length - a.h.length);
    const out = [];
    let buf = '';
    let i = 0;
    while (i < s.length) {
      const hit = words.find(w => s.startsWith(w.h, i));
      if (hit) {
        if (buf) { out.push({ t: buf, g: null }); buf = ''; }
        out.push({ t: hit.h, g: hit.idx });
        i += hit.h.length;
      } else {
        buf += s[i]; i++;
      }
    }
    if (buf) out.push({ t: buf, g: null });
    return out;
  }

  /** Decide idioma principal y subtítulo según lo disponible.
   *  `available` = {es:true, zh?:true, …}; `codes` = orden del registro de idiomas (OH.lingo.codes()). */
  function resolveLangs(settings, available, codes) {
    const notes = [];
    const av = available || {};
    const valid = (codes && codes.length) ? codes : ['es', 'zh', 'en'];
    const other = l => valid.find(c => c !== l && av[c]) || null;
    let main = settings && settings.lang;
    if (!valid.includes(main)) main = valid[0];
    if (!av[main]) { notes.push(`lang_missing:${main}`); main = valid.find(c => av[c]) || valid[0]; }
    let sub = settings && settings.sub;
    if (sub === 'none' || !valid.includes(sub)) sub = null;
    if (sub === main) sub = other(main);
    if (sub && !av[sub]) { notes.push(`lang_missing:${sub}`); sub = other(main); }
    return { main, sub, notes };
  }

  /** Máscara por carácter (código de punto): true si el carácter forma parte de una etiqueta <b>, </b>, <i> o </i>. */
  function tagMask(text) {
    const s = [...String(text == null ? '' : text)];
    const mask = s.map(() => false);
    const re = /<\/?(?:b|i)>/g;
    const str = s.join('');
    let m;
    while ((m = re.exec(str))) {
      const start = [...str.slice(0, m.index)].length;
      const len = [...m[0]].length;
      for (let k = 0; k < len; k++) mask[start + k] = true;
    }
    return mask;
  }

  /** Divide `text` en frases: corta tras los terminadores (fuera de etiquetas y marcas),
   *  no corta dentro de <b>/<i> abiertas ni en abreviaturas ("Mr."),
   *  se lleva los cierres pegados, y `join('')` reconstruye el texto original. */
  const ABBREV = new Set(['mr', 'mrs', 'ms', 'dr', 'st', 'prof', 'etc', 'vs', 'jr', 'sr']);
  function isAbbrevEnd(buf) {
    const m = /([\p{L}]+)\.$/u.exec(buf);
    if (!m) return false;
    const w = m[1];
    return ABBREV.has(w.toLowerCase()) || (w.length === 1 && w === w.toUpperCase());
  }
  function splitSentences(text) {
    const s = String(text == null ? '' : text);
    const out = []; let buf = '', i = 0, depth = 0, pending = false;
    while (i < s.length) {
      const tag = TAG_AT.exec(s.slice(i, i + 5));
      if (tag) {
        const closing = tag[0][1] === '/';
        buf += s.slice(i, i + tag[0].length); i += tag[0].length;
        depth = Math.max(0, depth + (closing ? -1 : 1));
        if (closing && depth === 0 && pending) {
          while (i < s.length && CLOSE.has(s[i])) { buf += s[i]; i++; }
          out.push(buf); buf = ''; pending = false;
        }
        continue;
      }
      if (s.startsWith('{{', i)) {
        const end = s.indexOf('}}', i + 2); const stop = end === -1 ? s.length : end + 2;
        buf += s.slice(i, stop); i = stop; continue;
      }
      buf += s[i]; i++;
      if (TERM.has(s[i - 1])) {
        if (s[i - 1] === '.' && isAbbrevEnd(buf)) continue;
        while (i < s.length && TERM.has(s[i])) { buf += s[i]; i++; }
        while (i < s.length && CLOSE.has(s[i])) { buf += s[i]; i++; }
        if (depth > 0) { pending = true; continue; }
        if (buf.replace(/[。！？…?!.]+$/, '').trim() === '') continue; // p. ej. "……" inicial
        out.push(buf); buf = ''; pending = false;
      }
    }
    if (buf) out.push(buf);
    return out;
  }

  /** Reparte `py` por frase: [{t, py}] — el trozo de pinyin que le toca a cada frase. */
  function sentencesWithPy(text, py) {
    let rest = String(py == null ? '' : py);
    return splitSentences(text).map(t => {
      const w = walk(t, rest);
      const slice = rest.slice(0, rest.length - w.rest.length);
      rest = w.rest;
      return { t, py: slice };
    });
  }

  const api = { rubyPairs, rubyCheck, markGlossary, resolveLangs, tagMask, splitSentences, sentencesWithPy };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') { window.OH = window.OH || {}; window.OH.text = api; }
})(typeof globalThis !== 'undefined' ? globalThis : this);
