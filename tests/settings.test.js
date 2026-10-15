const test = require('node:test');
const assert = require('node:assert/strict');
const { DEFAULTS, ENUMS, normalize, createStore } = require('../assets/settings.js');

const memStorage = (init = {}) => {
  const d = { ...init };
  return { getItem: k => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v); }, _d: d };
};

test('normalize_fills_defaults_for_empty', () => {
  assert.deepEqual(normalize(null), DEFAULTS);
  assert.deepEqual(normalize({}), DEFAULTS);
  assert.equal(DEFAULTS.v, 1);
});

test('normalize_clamps_rate_and_rejects_unknown_enums', () => {
  const s = normalize({ rate: 5, lang: 'fr', size: 'XXL', quality: 'ultra' });
  assert.equal(s.rate, 1.2);
  assert.equal(s.lang, DEFAULTS.lang);
  assert.equal(s.size, DEFAULTS.size);
  assert.equal(s.quality, DEFAULTS.quality);
  assert.equal(normalize({ rate: 0.1 }).rate, 0.6);
  assert.equal(normalize({ rate: 'rápido' }).rate, DEFAULTS.rate);
});

test('sub_never_equals_lang', () => {
  assert.notEqual(normalize({ lang: 'zh', sub: 'zh' }).sub, 'zh'); // el subtítulo nunca es igual al principal (spec §3)
  assert.equal(normalize({ lang: 'es', sub: 'es' }).sub, 'zh'); // primer código del registro ≠ es
  assert.equal(normalize({ lang: 'en', sub: 'en' }).sub, 'es');
  assert.equal(normalize({ lang: 'zh', sub: 'none' }).sub, 'none');
});

test('enums_salen_del_registro_de_idiomas', () => {
  const codes = require('../assets/langs.js').codes();
  assert.deepEqual(ENUMS.lang, codes);
  assert.deepEqual(ENUMS.sub, [...codes, 'none']);
});

test('load_survives_corrupt_json_and_missing_storage', () => {
  assert.deepEqual(createStore(memStorage({ 'oh-settings': '{no es json' })).load(), DEFAULTS);
  assert.deepEqual(createStore(null).load(), DEFAULTS);
  const throwing = { getItem() { throw new Error('bloqueado'); }, setItem() { throw new Error('bloqueado'); } };
  const st = createStore(throwing);
  assert.deepEqual(st.load(), DEFAULTS);
  assert.doesNotThrow(() => st.set({ lang: 'zh' }));
  assert.equal(st.get().lang, 'zh');
});

test('set_persists_and_notifies_once', () => {
  const storage = memStorage();
  const st = createStore(storage);
  const seen = [];
  const off = st.onChange(s => seen.push(s.lang));
  st.set({ lang: 'zh' });
  assert.deepEqual(seen, ['zh']);
  assert.equal(JSON.parse(storage._d['oh-settings']).lang, 'zh');
  off();
  st.set({ lang: 'en' });
  assert.deepEqual(seen, ['zh']);
});

test('view_defaults_to_read', () => {
  assert.equal(normalize({}).view, 'read');
  assert.equal(DEFAULTS.view, 'read');
});

test('view_accepts_study_rejects_unknown', () => {
  assert.equal(normalize({ view: 'study' }).view, 'study');
  assert.equal(normalize({ view: 'nope' }).view, 'read');
});
