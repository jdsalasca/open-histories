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

module.exports = { validateCatalog };

if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const catalog = require(path.join(root, 'stories', 'catalog.js'));
  const errors = validateCatalog(catalog, p => fs.existsSync(path.join(root, p)));
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log(`OK: ${catalog.length} libros en el catálogo`);
}
