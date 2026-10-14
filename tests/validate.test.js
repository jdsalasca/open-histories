const test = require('node:test');
const assert = require('node:assert/strict');
const { validateCatalog } = require('../tools/validate.js');

const entry = (over = {}) => ({
  id: 'demo', shelf: 'dia', kind: 'cuento', level: {},
  title: { es: 'Demo', zh: 'Demo', en: 'Demo' }, author: 'A', year: 1900,
  cover: { color: '#000', emblem: 'rabbit' }, langs: ['es'], age: 0,
  files: ['demo.js'], ...over
});

test('catalog_ok_when_all_files_exist', () => {
  const errs = validateCatalog([entry()], () => true);
  assert.deepEqual(errs, []);
});

test('catalog_error_when_story_file_missing', () => {
  const errs = validateCatalog([entry()], p => p !== 'stories/demo.js');
  assert.equal(errs.length, 1);
  assert.match(errs[0], /demo.*stories\/demo\.js/);
});

test('catalog_error_on_duplicate_id', () => {
  const errs = validateCatalog([entry(), entry()], () => true);
  assert.ok(errs.some(e => /duplicado/i.test(e)));
});

test('soon_entries_do_not_require_files', () => {
  const errs = validateCatalog([entry({ soon: true, files: [] })], () => false);
  assert.deepEqual(errs, []);
});
