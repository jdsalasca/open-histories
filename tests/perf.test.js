const test = require('node:test');
const assert = require('node:assert/strict');
const { nextTier, median, tierFor } = require('../assets/perf.js');

const slow = Array(30).fill(40);   // 40 ms por cuadro
const fast = Array(30).fill(12);   // 12 ms por cuadro

test('median_above_28_goes_down_one_tier', () => {
  assert.deepEqual(nextTier('alta', slow, 0, 5000), { tier: 'media', reason: 'down' });
  assert.deepEqual(nextTier('media', slow, 0, 5000), { tier: 'baja', reason: 'down' });
  assert.equal(median([10, 50, 20]), 20);
});

test('never_below_baja', () => {
  assert.deepEqual(nextTier('baja', slow, 0, 99999), { tier: 'baja', reason: 'hold' });
});

test('no_up_before_10s_hysteresis', () => {
  assert.equal(nextTier('media', fast, 1000, 5000).reason, 'hold');
  assert.deepEqual(nextTier('media', fast, 1000, 12000), { tier: 'media', reason: 'up-suggest' });
  assert.equal(nextTier('alta', fast, 0, 99999).reason, 'hold'); // ya está en lo más alto
});

test('stable_samples_hold', () => {
  const mid = Array(30).fill(20);
  assert.deepEqual(nextTier('alta', mid, 0, 50000), { tier: 'alta', reason: 'hold' });
  assert.deepEqual(nextTier('alta', [], 0, 50000), { tier: 'alta', reason: 'hold' });
});

test('tierFor_respects_manual_choice_and_auto', () => {
  assert.equal(tierFor({ quality: 'baja' }, 'alta'), 'baja');
  assert.equal(tierFor({ quality: 'auto' }, 'media'), 'media');
  assert.equal(tierFor({ quality: 'auto' }, undefined), 'alta');
});
