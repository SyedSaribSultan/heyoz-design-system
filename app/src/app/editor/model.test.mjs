// npm test (node --test src/app/editor/model.test.mjs): the editor model's rules, tested without the UI.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as M from './model.js';

const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≈ ${b}`);

test('duration follows speed: (out − in) ÷ speed', () => {
  const c = M.mkClip({ in: 1, out: 5, props: { speed: 2 } });
  near(M.cdur(c), 2); c.props.speed = 0.5; near(M.cdur(c), 8);
});

test('ripple: trim, delete and reorder keep the video track end to end from 0', () => {
  const P = M.sampleProject('multi'), [a, b, c] = M.vclips(P);
  M.applyKey(P, a, 'out', a.out - 2); near(b.start, M.cdur(a)); near(c.start, M.cdur(a) + M.cdur(b));
  M.remove(P, b.id); near(M.vclips(P)[1].start, M.cdur(a));
  M.reorder(P, c, -1); assert.equal(M.vclips(P)[0].id, c.id); near(M.vclips(P)[1].start, M.cdur(c));
  M.applyKey(P, a, 'props.speed', 2); near(M.total(P), M.cdur(c) + M.cdur(a));
});

test('trim is clamped to the source and to a minimum length', () => {
  const P = M.sampleProject('multi'), a = M.vclips(P)[0];
  M.applyKey(P, a, 'out', 999); assert.equal(a.out, a.srcDur);
  M.applyKey(P, a, 'in', 999); near(a.out - a.in, 0.3);
  M.applyKey(P, a, 'in', -5); assert.equal(a.in, 0);
});

test('split: inside a clip only, and the halves add up', () => {
  const P = M.sampleProject('multi'), a = M.vclips(P)[0], d = M.cdur(a);
  assert.equal(M.splitAt(P, a, a.start), null, 'not at the start edge');
  assert.equal(M.splitAt(P, a, M.cend(a)), null, 'not at the end edge');
  const b = M.splitAt(P, a, 2); near(M.cdur(a) + M.cdur(b), d); near(b.start, 2); assert.equal(M.vclips(P).length, 4);
});

test('lane stacking: overlapping clips go to the next free row', () => {
  const mk = (start, out) => M.mkClip({ kind: 'audio', start, in: 0, out, props: { speed: 1 } });
  const a = mk(0, 10), b = mk(2, 3), c = mk(5, 2), d = mk(10, 1);
  const R = M.packRows([a, b, c, d]);
  assert.equal(R.n, 2); assert.equal(R.map[a.id], 0); assert.equal(R.map[b.id], 1); assert.equal(R.map[c.id], 1); assert.equal(R.map[d.id], 0);
});

test('capability gating comes from the registry, never from a model name', () => {
  assert.equal(M.support('kling25', 'edit').ok, false);
  assert.match(M.support('kling25', 'edit').reason, /Kling 2\.5/);
  assert.equal(M.support('seedance25', 'extend').max, 10);
  assert.equal(M.support('veo3', 'extend').ok, false);
  const clip = { kind: 'video', meta: { model: 'veo3', source: 'ai' } };
  assert.equal(M.altFor(clip, 'extend', 'veo3'), 'seedance25');
  assert.equal(M.canDo({ kind: 'video', meta: { model: 'veo3', source: 'upload' } }, 'edit').ok, true, 'uploads have no model to ask');
  assert.equal(M.canDo({ kind: 'video', meta: { model: 'seedance25', status: 'generating' } }, 'edit').ok, false);
  // A new model needs no UI change: register it and it is gated by its caps.
  const models = { ...M.MODELS, newvid: { kind: 'video', name: 'New', cost: 1, caps: { regenerate: true, extend: false, edit: true } } };
  assert.deepEqual(M.idsOf('video', models).at(-1), 'newvid'); assert.equal(M.support('newvid', 'extend', models).ok, false);
});

test('undo of an AI job: the snapshot before the job restores the clip exactly', () => {
  const P = M.sampleProject('multi'), c = M.vclips(P)[0], before = JSON.stringify(P);
  M.applyAI(c, { action: 'extend', model: 'seedance25', by: 5, prompt: '' });
  assert.equal(c.meta.version, 2); near(c.out, 11.5);
  const restored = JSON.parse(before); assert.equal(M.vclips(restored)[0].meta.version, 1); near(M.vclips(restored)[0].out, 6.5);
});

test('old projects open: migrate fills defaults without changing what is there', () => {
  const old = { name: 'Old', tracks: [{ id: 'v', kind: 'video', clips: [{ id: 'x', kind: 'video', name: 'x', start: 9, in: 0, out: 4, srcDur: 4, props: { volume: 0.5 } }] }] };
  const P = M.migrate(old);
  assert.equal(P.ratio, '9:16'); assert.equal(P.tracks.length, 3); const c = M.vclips(P)[0];
  assert.equal(c.props.volume, 0.5); assert.equal(c.props.speed, 1); assert.equal(c.start, 0); assert.deepEqual(c.meta, {});
});

test('edge cases: 0 clips, 1 clip, 30 clips', () => {
  const E = M.sampleProject('empty'); assert.equal(M.total(E), 0); assert.equal(M.activeVideo(E, 3), null);
  const one = M.sampleProject('multi'); one.tracks[0].clips.splice(1); M.relayout(one); near(M.total(one), 6);
  const many = M.sampleProject('empty'); for (let i = 0; i < 30; i++) M.vclips(many).push(M.mkClip({ in: 0, out: 2, props: M.vprops() })); M.relayout(many);
  near(M.total(many), 60); near(M.vclips(many)[29].start, 58);
});
