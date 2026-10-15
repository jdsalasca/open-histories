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
