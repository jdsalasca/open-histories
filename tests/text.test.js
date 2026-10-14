const test = require('node:test');
const assert = require('node:assert/strict');
const { rubyPairs, markGlossary, resolveLangs } = require('../assets/text.js');

test('ruby_aligns_chars_and_syllables', () => {
  assert.deepEqual(rubyPairs('小兔子', 'xiǎo tù zi'), [
    { c: '小', p: 'xiǎo' }, { c: '兔', p: 'tù' }, { c: '子', p: 'zi' }
  ]);
});

test('ruby_passes_through_latin_digits_punct', () => {
  const pairs = rubyPairs('HSK1 很好。', 'HSK1 hěn hǎo。');
  const withPy = pairs.filter(x => x.p).map(x => `${x.c}:${x.p}`);
  assert.deepEqual(withPy, ['很:hěn', '好:hǎo']);
  assert.equal(pairs.map(x => x.c).join(''), 'HSK1 很好。');
  for (const x of pairs.filter(x => !/[一-鿿]/.test(x.c))) assert.equal(x.p, null);
});

test('ruby_never_throws_when_py_is_short_or_missing', () => {
  assert.deepEqual(rubyPairs('小兔子', 'xiǎo'), [
    { c: '小', p: 'xiǎo' }, { c: '兔', p: null }, { c: '子', p: null }
  ]);
  assert.doesNotThrow(() => rubyPairs('小兔子', undefined));
  assert.equal(rubyPairs('小', '').length, 1);
});

test('glossary_prefers_longest_match', () => {
  const out = markGlossary('小兔子很可爱', [{ h: '兔子' }, { h: '小兔子' }, { h: '可爱' }]);
  assert.deepEqual(out, [
    { t: '小兔子', g: 1 }, { t: '很', g: null }, { t: '可爱', g: 2 }
  ]);
});

test('glossary_no_overlap_and_no_match_returns_single_chunk', () => {
  assert.deepEqual(markGlossary('你好', [{ h: '再见' }]), [{ t: '你好', g: null }]);
  assert.deepEqual(markGlossary('兔子兔', [{ h: '兔子' }, { h: '子兔' }]), [
    { t: '兔子', g: 0 }, { t: '兔', g: null }
  ]);
  assert.deepEqual(markGlossary('', [{ h: '兔' }]), []);
});

test('resolve_falls_back_when_lang_file_missing', () => {
  const r = resolveLangs({ lang: 'zh', sub: 'es' }, { es: true, en: true });
  assert.equal(r.main, 'es');
  assert.equal(r.sub, 'en');
  assert.ok(r.notes.some(n => n.startsWith('lang_missing:zh')));
});

test('resolve_sub_never_equals_main', () => {
  const r = resolveLangs({ lang: 'es', sub: 'es' }, { es: true, zh: true, en: true });
  assert.equal(r.main, 'es');
  assert.notEqual(r.sub, 'es');
  assert.equal(resolveLangs({ lang: 'zh', sub: 'none' }, { es: true, zh: true }).sub, null);
  const miss = resolveLangs({ lang: 'zh', sub: 'en' }, { es: true, zh: true });
  assert.equal(miss.sub, 'es'); // inglés no existe: cae al idioma base
  assert.ok(miss.notes.some(n => n.startsWith('lang_missing:en')));
});

const { rubyCheck } = require('../assets/text.js');
test('rubyCheck_reports_missing_and_leftover_syllables', () => {
  assert.deepEqual(rubyCheck('小兔子', 'xiǎo tù zi'), { missing: 0, leftover: '' });
  assert.deepEqual(rubyCheck('小兔子', 'xiǎo tù'), { missing: 1, leftover: '' });
  assert.equal(rubyCheck('小兔', 'xiǎo tù zi').leftover, 'zi');
  assert.deepEqual(rubyCheck('HSK1 很好。', 'HSK1 hěn hǎo。'), { missing: 0, leftover: '' });
});

const { tagMask } = require('../assets/text.js');
test('tagMask_marks_only_b_and_i_tags', () => {
  const m = tagMask('<b>禁止</b>入内<i>完</i>');
  const s = [...'<b>禁止</b>入内<i>完</i>'];
  const raw = s.filter((_, i) => m[i]).join('');
  assert.equal(raw, '<b></b><i></i>');
  assert.equal(tagMask('a < b').some(Boolean), false);
});
