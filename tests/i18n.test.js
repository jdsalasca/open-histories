const test = require('node:test');
const assert = require('node:assert/strict');
const { STRINGS, t, makeT } = require('../assets/i18n.js');

test('all_keys_exist_in_all_langs', () => {
  const es = Object.keys(STRINGS.es).sort();
  assert.ok(es.length >= 40, 'debe haber al menos 40 claves');
  assert.deepEqual(Object.keys(STRINGS.zh).sort(), es);
  assert.deepEqual(Object.keys(STRINGS.en).sort(), es);
  for (const lang of ['es', 'zh', 'en'])
    for (const k of es) assert.ok(String(STRINGS[lang][k]).length > 0, `${lang}.${k} vacío`);
});

test('t_falls_back_to_es_then_key', () => {
  assert.equal(t('clave_inexistente', 'zh'), 'clave_inexistente');
  assert.notEqual(t('settings', 'zh'), t('settings', 'es'));
  const only = makeT({ es: { a: 'A' }, zh: {}, en: {} });
  assert.equal(only('a', 'zh'), 'A');
  assert.equal(only('a', 'fr'), 'A');
});
