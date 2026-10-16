#!/usr/bin/env node
/* Validador de contenido de open-histories.
 * Uso: node tools/validate.js   (sale con código ≠ 0 si hay errores)
 */
'use strict';
const fs = require('fs');
const path = require('path');

/** Revisa el catálogo: ids únicos y archivos presentes (salvo `soon`). */
function validateCatalog(catalog, fileExists) {
  const errors = [];
  const seen = new Set();
  for (const b of catalog) {
    if (seen.has(b.id)) errors.push(`id duplicado en el catálogo: ${b.id}`);
    seen.add(b.id);
    if (b.soon) continue;
    for (const f of b.files || []) {
      const p = `stories/${f}`;
      if (!fileExists(p)) errors.push(`${b.id}: falta ${p}`);
    }
  }
  return errors;
}

const { rubyCheck } = require('../assets/text.js');
const { annotated, base: BASE_LANG } = require('../assets/langs.js');
const CJK = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;

/** Valida un cuento en varios idiomas: texto base + los idiomas presentes ({zh?, en?, fr?, …}).
 *  La anotación (pinyin) y el glosario se validan solo para los idiomas del registro con `annotate`. */
function validateStory(id, langs) {
  const errors = [];
  const BASE = BASE_LANG();
  const est = langs[BASE];
  if (!est || !Array.isArray(est.pages)) return [`${id}: falta el texto base (${BASE})`];
  const anotados = annotated();
  for (const L of Object.keys(langs)) {
    if (L === BASE) continue;
    const d = langs[L];
    if (!d) continue;
    if (typeof d.title !== 'string' || !d.title) errors.push(`${id}: ${L} sin title`);
    if (!Array.isArray(d.pages)) { errors.push(`${id}: ${L} sin pages`); continue; }
    if (d.pages.length !== est.pages.length) errors.push(`${id}: ${L} tiene ${d.pages.length} páginas y ${BASE} tiene ${est.pages.length}`);
    const n = Math.min(d.pages.length, est.pages.length);
    for (let i = 0; i < n; i++) {
      const a = est.pages[i].text || [], b = d.pages[i].text || [];
      if (a.length !== b.length) errors.push(`${id}: ${L} página ${i + 1} tiene ${b.length} párrafos y ${BASE} tiene ${a.length}`);
      if (anotados.includes(L)) {
        const py = d.pages[i].py;
        if (!Array.isArray(py) || py.length !== b.length) { errors.push(`${id}: ${L} página ${i + 1} sin pinyin (py) alineado con text`); continue; }
        b.forEach((text, j) => {
          const c = rubyCheck(text, py[j]);
          if (c.missing || c.leftover) errors.push(`${id}: pinyin desalineado en ${L} página ${i + 1} párrafo ${j + 1} (faltan ${c.missing}, sobra "${c.leftover}")`);
        });
      }
    }
    const qa = (est.quiz || []).length, qb = (d.quiz || []).length;
    if (qa !== qb) errors.push(`${id}: ${L} tiene ${qb} preguntas de quiz y ${BASE} tiene ${qa}`);
  }
  for (const L of anotados) {
    const d = langs[L];
    if (!d || !Array.isArray(d.glossary)) continue;
    const all = (d.pages || []).flatMap(p => p.text || []).join('\n');
    d.glossary.forEach((g, k) => {
      if (!g.h || !g.es) errors.push(`${id}: glosario ${L} #${k + 1} incompleto`);
      else if (!all.includes(g.h)) errors.push(`${id}: la palabra del glosario "${g.h}" no aparece en el texto ${L}`);
      else if (!g.py || !CJK.test(g.h)) errors.push(`${id}: glosario "${g.h}" sin pinyin`);
    });
  }
  return errors;
}

module.exports = { validateCatalog, validateStory };

/** Carga un cuento (es + idiomas existentes) ejecutando los .js en un contexto aislado. */
function loadStory(root, entry) {
  const vm = require('vm');
  const ctx = vm.createContext({ console });
  vm.runInContext('var window = globalThis; var document = undefined;', ctx);
  const run = f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
  run('assets/kit.js');
  const out = {};
  for (const f of entry.files) {
    const code = f === `${entry.id}.js` ? BASE_LANG() : (f.match(/\.([a-z][a-z0-9-]*)\.js$/) || [])[1];
    if (!code) continue;
    run(`stories/${f}`);
    if (code === BASE_LANG()) { const st = vm.runInContext(`OH.registry['${entry.id}']`, ctx); out[code] = st; }
    else out[code] = vm.runInContext(`OH.langs['${entry.id}']['${code}']`, ctx);
  }
  return out;
}

if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const catalog = require(path.join(root, 'stories', 'catalog.js'));
  let errors = validateCatalog(catalog, p => fs.existsSync(path.join(root, p)));
  for (const entry of catalog.filter(b => !b.soon)) {
    try { errors = errors.concat(validateStory(entry.id, loadStory(root, entry))); }
    catch (e) { errors.push(`${entry.id}: no se pudo cargar (${e.message})`); }
  }
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log(`OK: ${catalog.length} libros en el catálogo, ${catalog.filter(b => !b.soon).length} validados`);
}
