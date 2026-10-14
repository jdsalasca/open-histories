const test = require('node:test');
const assert = require('node:assert/strict');
const { filesFor, shellFiles, cacheName } = require('../assets/offline.js');

const catalog = [
  { id: 'demo', files: ['demo.js', 'demo.zh.js', 'demo.en.js'] },
  { id: 'solo-es', files: ['solo-es.js'] },
  { id: 'pronto', files: [], soon: true }
];

test('filesFor_includes_story_and_requested_langs', () => {
  assert.deepEqual(filesFor('demo', ['zh'], catalog), ['stories/demo.js', 'stories/demo.zh.js']);
  assert.deepEqual(filesFor('demo', ['zh', 'en'], catalog), ['stories/demo.js', 'stories/demo.zh.js', 'stories/demo.en.js']);
  assert.deepEqual(filesFor('demo', [], catalog), ['stories/demo.js']);
});

test('filesFor_skips_missing_lang_files', () => {
  assert.deepEqual(filesFor('solo-es', ['zh', 'en'], catalog), ['stories/solo-es.js']);
  assert.deepEqual(filesFor('no-existe', ['zh'], catalog), []);
  assert.deepEqual(filesFor('pronto', ['zh'], catalog), []);
});

test('shellFiles_lists_assets_audio_fonts_catalog', () => {
  const f = shellFiles();
  for (const must of ['index.html', 'read.html', 'manifest.webmanifest', 'stories/catalog.js', 'assets/kit.js',
    'assets/reader.js', 'assets/settings.js', 'assets/fonts.css', 'assets/book.css', 'audio/page-turn.mp3'])
    assert.ok(f.includes(must), `falta ${must}`);
  assert.equal(new Set(f).size, f.length, 'sin duplicados');
});

test('cacheName_is_versioned', () => {
  assert.match(cacheName('abc123'), /^oh-v2-abc123$/);
});
