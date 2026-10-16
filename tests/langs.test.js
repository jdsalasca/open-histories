const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const lingo = require('../assets/langs.js');

/* carga un módulo de assets/ en un contexto aislado (sin require ni OH preexistentes salvo lo indicado) */
const runModule = (file, sandbox) => {
  const ctx = vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'assets', file), 'utf8'), ctx, { filename: file });
  return ctx;
};

test('lingo_codes_base_and_annotated', () => {
  assert.deepEqual(lingo.codes(), ['es', 'zh', 'en']);
  assert.equal(lingo.base(), 'es');
  assert.deepEqual(lingo.annotated(), ['zh']);
  assert.equal(lingo.get('zh').tts, 'zh-CN');
  assert.equal(lingo.get('zh').annotate, 'pinyin');
  assert.deepEqual(lingo.get('xx'), {});
});

test('lingo_no_pisa_OH_langs (datos de cuentos)', () => {
  const OH = { langs: { sentinel: 1 } };
  const ctx = runModule('langs.js', { window: { OH }, module: { exports: {} }, console });
  assert.deepEqual(ctx.window.OH.langs, { sentinel: 1 });           // los datos de cuentos quedan intactos
  assert.equal(typeof ctx.window.OH.lingo.codes, 'function');       // y el registro se registra aparte
});

test('sin_registro_el_motor_cae_al_default_estatico', () => {
  const sctx = runModule('settings.js', { module: { exports: {} }, console });
  assert.deepEqual([...sctx.module.exports.ENUMS.lang], ['es', 'zh', 'en']);
  assert.equal(sctx.module.exports.DEFAULTS.lang, 'es');
  const tctx = runModule('text.js', { module: { exports: {} }, console });
  const r = tctx.module.exports.resolveLangs({ lang: 'zh', sub: 'none' }, { es: true, zh: true });
  assert.equal(r.main, 'zh');
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
