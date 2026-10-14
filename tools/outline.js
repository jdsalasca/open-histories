#!/usr/bin/env node
/* Muestra la estructura de un cuento (páginas y párrafos) para alinear otros idiomas.
 * Uso: node tools/outline.js <id> [--text]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const id = process.argv[2];
const full = process.argv.includes('--text');
if (!id) { console.error('Uso: node tools/outline.js <id> [--text]'); process.exit(2); }
const ctx = vm.createContext({ console });
vm.runInContext('var window = globalThis; var document = undefined;', ctx);
for (const f of ['assets/kit.js', `stories/${id}.js`]) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx);
const st = vm.runInContext(`OH.registry['${id}']`, ctx);
const strip = t => String(t).replace(/\{\{(.+?)\|.+?\}\}/g, '$1').replace(/<[^>]+>/g, '');
console.log(`# ${st.title} — ${st.pages.length} páginas, quiz ${st.quiz.length}`);
st.pages.forEach((p, i) => {
  console.log(`\n[${i + 1}] ${p.title}  (${p.text.length} párrafos${p.word ? ', word' : ''}${p.think ? ', think' : ''})`);
  if (full) p.text.forEach((t, j) => console.log(`  ${j + 1}. ${strip(t)}`));
});
