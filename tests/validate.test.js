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

const { validateStory } = require('../tools/validate.js');
const base = () => ({
  es: { pages: [{ text: ['a', 'b'] }, { text: ['c'] }], quiz: [{ q: '?' }] },
  zh: { title: 't', pages: [{ text: ['小兔子。', '很好。'], py: ['xiǎo tù zi。', 'hěn hǎo。'] }, { text: ['再见。'], py: ['zài jiàn。'] }],
        glossary: [{ h: '兔子', py: 'tù zi', es: 'conejo', en: 'rabbit' }], quiz: [{ q: '?' }] },
  en: { title: 't', pages: [{ text: ['a', 'b'] }, { text: ['c'] }], quiz: [{ q: '?' }] }
});

test('story_ok_when_aligned', () => {
  assert.deepEqual(validateStory('demo', base()), []);
});

test('story_error_when_paragraph_counts_differ', () => {
  const s = base(); s.zh.pages[0].text.pop(); s.zh.pages[0].py.pop();
  const errs = validateStory('demo', s);
  assert.ok(errs.some(e => /demo.*zh.*página 1.*párrafos/i.test(e)), errs.join('|'));
});

test('story_error_when_py_misaligned', () => {
  const s = base(); s.zh.pages[0].py[0] = 'xiǎo tù';
  const errs = validateStory('demo', s);
  assert.ok(errs.some(e => /pinyin/i.test(e)), errs.join('|'));
});

test('story_error_when_glossary_word_absent', () => {
  const s = base(); s.zh.glossary.push({ h: '大象', py: 'dà xiàng', es: 'elefante', en: 'elephant' });
  const errs = validateStory('demo', s);
  assert.ok(errs.some(e => /大象/.test(e)), errs.join('|'));
});

test('story_error_when_page_or_quiz_count_differs', () => {
  const s = base(); s.en.pages.pop(); s.zh.quiz = [];
  const errs = validateStory('demo', s);
  assert.ok(errs.some(e => /en.*páginas/i.test(e)));
  assert.ok(errs.some(e => /zh.*quiz/i.test(e)));
});
