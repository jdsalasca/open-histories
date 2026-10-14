/* open-histories · text.js — utilidades puras de texto (sin DOM):
 * emparejar caracteres chinos con su pinyin (ruby), marcar glosarios y resolver idiomas.
 */
(function (root) {
  'use strict';
  const CJK = /[㐀-䶿一-鿿豈-﫿]/;
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

  /** Decide idioma principal y subtítulo según lo disponible. `available` = {es:true, zh?:true, en?:true}. */
  function resolveLangs(settings, available) {
    const notes = [];
    const av = available || {};
    let main = settings && settings.lang;
    if (!['es', 'zh', 'en'].includes(main)) main = 'es';
    if (!av[main]) { notes.push(`lang_missing:${main}`); main = 'es'; }
    let sub = settings && settings.sub;
    if (!['es', 'en'].includes(sub)) sub = null;
    if (sub === main) sub = ['es', 'en'].find(l => l !== main && av[l]) || null;
    if (sub && !av[sub]) { notes.push(`lang_missing:${sub}`); sub = ['es', 'en'].find(l => l !== main && av[l]) || null; }
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

  const api = { rubyPairs, rubyCheck, markGlossary, resolveLangs, tagMask };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') { window.OH = window.OH || {}; window.OH.text = api; }
})(typeof globalThis !== 'undefined' ? globalThis : this);
