/* open-histories · langs.js — registro de idiomas (OH.lingo).
 * Sumar un idioma = una entrada en META + archivos de contenido (receta en AGENTS.md §5c).
 * Ojo: los DATOS de cada cuento viven en OH.langs (los llena OH.lang(...)); este registro es aparte.
 * Campos de cada idioma: name (endónimo), tts (voz del navegador), base:true (texto fuente), annotate:'pinyin' (anotación por carácter).
 */
(function (root) {
  'use strict';
  const META = {
    es: { name: 'Español', tts: 'es-ES', base: true },
    zh: { name: '中文', tts: 'zh-CN', annotate: 'pinyin' },
    en: { name: 'English', tts: 'en-US' }
  };

  const codes = () => Object.keys(META);
  const base = () => codes().find(c => META[c].base) || codes()[0] || 'es';
  const annotated = () => codes().filter(c => META[c].annotate);
  const get = c => META[c] || {};

  const api = { META, codes, base, annotated, get };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') { window.OH = window.OH || {}; window.OH.lingo = api; }
})(typeof globalThis !== 'undefined' ? globalThis : this);
