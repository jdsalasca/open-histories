const test = require('node:test');
const assert = require('node:assert/strict');
const lingo = require('../assets/langs.js');

test('lingo_codes_base_and_annotated', () => {
  assert.deepEqual(lingo.codes(), ['es', 'zh', 'en']);
  assert.equal(lingo.base(), 'es');
  assert.deepEqual(lingo.annotated(), ['zh']);
  assert.equal(lingo.get('zh').tts, 'zh-CN');
  assert.equal(lingo.get('zh').annotate, 'pinyin');
  assert.deepEqual(lingo.get('xx'), {});
});

test('lingo_no_pisa_OH_langs (datos de cuentos)', () => {
  assert.equal(globalThis.OH && globalThis.OH.langs, undefined);
});

test('agregar_solo_META_habilita_el_idioma_en_el_motor', () => {
  lingo.META.fr = { name: 'Français', tts: 'fr-FR' };
  const { ENUMS, normalize } = require('../assets/settings.js');
  assert.ok(ENUMS.lang.includes('fr'));
  assert.equal(normalize({ lang: 'fr' }).lang, 'fr');
  assert.equal(normalize({ lang: 'fr', sub: 'fr' }).sub, 'es');
  const { resolveLangs } = require('../assets/text.js');
  const r = resolveLangs({ lang: 'fr', sub: 'es' }, { es: true, fr: true }, lingo.codes());
  assert.equal(r.main, 'fr');
  assert.equal(r.sub, 'es');
  delete lingo.META.fr;
});
