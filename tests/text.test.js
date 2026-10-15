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

test('resolve_usa_codes_pasados', () => {
  const r = resolveLangs({ lang: 'fr', sub: 'es' }, { es: true, fr: true }, ['es', 'fr', 'zh']);
  assert.equal(r.main, 'fr');
  assert.equal(r.sub, 'es');
});

test('resolve_cae_al_base_si_falta_el_principal', () => {
  const r = resolveLangs({ lang: 'fr', sub: 'none' }, { es: true }, ['es', 'fr']);
  assert.equal(r.main, 'es');
  assert.ok(r.notes.some(n => n.startsWith('lang_missing:fr')));
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

const { splitSentences } = require('../assets/text.js');
test('splitSentences_partitions_zh_sentences', () => {
  assert.deepEqual(
    splitSentences('一天晚上，一只小燕子飞过这座城市。他的朋友们走了。'),
    ['一天晚上，一只小燕子飞过这座城市。', '他的朋友们走了。']);
});
test('splitSentences_does_not_split_inside_b_i_tags', () => {
  assert.deepEqual(splitSentences('他<b>哭</b>了。第二句。'), ['他<b>哭</b>了。', '第二句。']);
});
test('splitSentences_does_not_split_inside_open_tags', () => {
  assert.deepEqual(splitSentences('<b>禁止入内。违者必罚。</b>'), ['<b>禁止入内。违者必罚。</b>']);
  assert.deepEqual(splitSentences('……更响了！<i>更响了！</i>'), ['……更响了！', '<i>更响了！</i>']);
  assert.deepEqual(splitSentences('<b>PROHIBIDO ENTRAR. LOS INFRACTORES SERÁN CASTIGADOS.</b>'),
    ['<b>PROHIBIDO ENTRAR. LOS INFRACTORES SERÁN CASTIGADOS.</b>']);
  assert.deepEqual(splitSentences('<b>禁止入内。</b>违者必罚。'), ['<b>禁止入内。</b>', '违者必罚。']);
});
test('splitSentences_keeps_abbreviations_together', () => {
  assert.deepEqual(splitSentences('Mr. McGregor was here.'), ['Mr. McGregor was here.']);
  assert.deepEqual(splitSentences('I saw Mr. McGregor. He ran.'), ['I saw Mr. McGregor.', ' He ran.']);
});
test('splitSentences_does_not_split_inside_markers', () => {
  assert.deepEqual(
    splitSentences('小燕子{{迁徙|鸟儿飞到别的地方，找更暖和的天气。}}走了。第二句。'),
    ['小燕子{{迁徙|鸟儿飞到别的地方，找更暖和的天气。}}走了。', '第二句。']);
});

const { sentencesWithPy } = require('../assets/text.js');
test('sentencesWithPy_splits_py_along_sentences', () => {
  assert.deepEqual(
    sentencesWithPy('他走了。你呢？', 'tā zǒu le。nǐ ne？'),
    [{ t: '他走了。', py: 'tā zǒu le。' }, { t: '你呢？', py: 'nǐ ne？' }]);
});
test('sentencesWithPy_empty_py_for_plain_text', () => {
  const r = sentencesWithPy('Hola. ¿Y vos?', '');
  assert.deepEqual(r.map(x => x.py), ['', '']);
});
test('sentencesWithPy_corpus_concatenation_and_alignment', () => {
  const ids = ['perico-conejo', 'gigante-egoista', 'principe-feliz', 'pastor-tejedora', 'corazon-delator', 'mascara-muerte'];
  const prevOH = globalThis.OH;
  const load = f => { let data = null; globalThis.OH = { lang: (id, l, d) => { data = d; } }; require(f); globalThis.OH = prevOH; return data; };
  const strip = t => String(t).replace(/\{\{(.+?)\|.+?\}\}/g, '$1').replace(/<\/?[bi]>/g, '').trim();
  const balanced = t => {
    const open = { b: 0, i: 0 };
    for (const m of String(t).matchAll(/<\/?([bi])>/g)) open[m[1]] += m[0][1] === '/' ? -1 : 1;
    return open.b === 0 && open.i === 0;
  };
  for (const id of ids) {
    for (const lang of ['zh', 'en']) {
      const d = load(`../stories/${id}.${lang}.js`);
      for (const pg of d.pages) {
        (pg.text || []).forEach((tx, j) => {
          const sents = sentencesWithPy(tx, (pg.py || [])[j] || '');
          assert.equal(sents.map(s => s.t).join(''), tx);
          for (const s of sents) {
            assert.notEqual(strip(s.t), '', `${id}.${lang}: frase vacía`);
            assert.ok(balanced(s.t), `${id}.${lang}: etiquetas desbalanceadas: ${s.t}`);
            if (lang === 'zh') assert.equal(rubyCheck(s.t, s.py).missing, 0);
          }
        });
      }
    }
  }
});
test('splitSentences_attaches_closers_and_terminator_runs', () => {
  assert.deepEqual(splitSentences('「我可以爱你吗？」小燕子说。'), ['「我可以爱你吗？」', '小燕子说。']);
  assert.deepEqual(splitSentences('他走了……后来呢？'), ['他走了……', '后来呢？']);
});
test('splitSentences_splits_es_after_period_space', () => {
  assert.deepEqual(splitSentences('Hola. ¿Y vos?'), ['Hola.', ' ¿Y vos?']);
});
test('splitSentences_concatenation_preserves_original', () => {
  const t = '天黑啦，小燕子说：「我要去埃及……」。第二段。';
  assert.equal(splitSentences(t).join(''), t);
});
