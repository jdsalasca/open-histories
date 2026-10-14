const test = require('node:test');
const assert = require('node:assert/strict');
const { createWords } = require('../assets/words.js');

const mem = (init = {}) => { const d = { ...init }; return { getItem: k => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v); }, _d: d }; };
const W = { id: 'perico-conejo', h: '兔子', py: 'tù zi', es: 'conejo', en: 'rabbit' };

test('add_has_remove_roundtrip', () => {
  const w = createWords(mem());
  const key = w.key(W.id, W.h);
  assert.equal(w.has(key), false);
  w.add(W);
  assert.equal(w.has(key), true);
  assert.deepEqual(w.list().map(x => x.h), ['兔子']);
  w.remove(key);
  assert.equal(w.has(key), false);
  assert.deepEqual(w.list(), []);
});

test('list_survives_corrupt_storage', () => {
  assert.deepEqual(createWords(mem({ 'oh-words': '{roto' })).list(), []);
  assert.deepEqual(createWords(mem({ 'oh-words': '"no es lista"' })).list(), []);
  assert.deepEqual(createWords(null).list(), []);
  const boom = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); } };
  const w = createWords(boom);
  assert.doesNotThrow(() => w.add(W));
  assert.equal(w.has(w.key(W.id, W.h)), true); // se mantiene en memoria
});

test('duplicate_add_is_idempotent', () => {
  const w = createWords(mem());
  w.add(W); w.add({ ...W, es: 'conejito' });
  assert.equal(w.list().length, 1);
  assert.equal(w.list()[0].es, 'conejito');
});
