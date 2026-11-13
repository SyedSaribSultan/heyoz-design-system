// npm test: the editor store's state rules (layers, Esc chain, undo coalescing, toast undo, playback,
// jobs, drag, reset), run in node without a DOM.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as St from './store.js';
import * as L from './logic.js';

const { S, M } = St;
beforeEach(() => { St.reset(); S.project = M.sampleProject('multi'); S.t = 4.37; });

test('layers: opening one popover replaces the other, so AI state cannot linger', () => {
  S.sel = 'c2'; St.openAI('extend', null);
  assert.equal(S.pop.type, 'ai'); assert.ok(St.aiOf());
  St.openPop('ratio', { left: 0, right: 0, top: 0, bottom: 0 });
  assert.equal(S.pop.type, 'ratio'); assert.equal(St.aiOf(), null, 'no AI state behind another popover');
  assert.equal('ai' in S, false, 'no separate AI flag exists');
});

test('layers: the same popover toggles shut, a context menu re-anchors', () => {
  St.openPop('ratio', null); St.openPop('ratio', null); assert.equal(S.pop, null);
  St.openPop('ctx', { left: 1 }, 'point', { kind: 'clip' }); St.openPop('ctx', { left: 9 }, 'point', { kind: 'clip' });
  assert.equal(S.pop.rect.left, 9);
});

test('layers: selecting, opening a panel or undo clears any popover', () => {
  St.openPop('keys', null); St.select('c1'); assert.equal(S.pop, null);
  St.openPop('keys', null); St.openTab('media'); assert.equal(S.pop, null); assert.equal(S.sheet, 'panel');
  St.openPop('keys', null); St.checkpoint(); St.undo(); assert.equal(S.pop, null);
});

test('Esc chain: drag, then popover, then sheet, then selection, one per press', () => {
  S.sel = 'c1'; St.openTab('media'); St.openPop('keys', null);
  assert.equal(L.escTarget(S), 'pop');
  St.escape(); assert.equal(S.pop, null); assert.equal(S.sheet, 'panel'); assert.equal(S.sel, 'c1');
  St.escape(); assert.equal(S.sheet, null); assert.equal(S.sel, 'c1');
  St.escape(); assert.equal(S.sel, null);
  assert.equal(St.escape(), false, 'nothing left to close');
  S.sel = 'c1'; St.dragStart('move', { id: 'c1', orig: {} }); St.openPop('keys', null);
  assert.equal(L.escTarget(S), 'drag', 'a running drag is cancelled before any layer');
});

test('key guard: shortcuts are blocked while any layer is open', () => {
  assert.equal(St.layerOpen(), false);
  St.openPop('cmd', null); assert.equal(St.layerOpen(), true); St.closePop();
  St.openPop('export', null); assert.equal(St.layerOpen(), true); St.closePop();
  St.openTab('ai'); assert.equal(St.layerOpen(), true); St.closeSheet();
  S.sel = 'c2'; St.openAI('regenerate', null); assert.equal(St.layerOpen(), true); St.closePop();
  assert.equal(St.layerOpen(), false);
});

test('coalescer: one step per field, a pause or another field starts a new one', () => {
  const n = () => St.histDepth();
  St.editStep('c1:props.volume', 0); St.editStep('c1:props.volume', 100); St.editStep('c1:props.volume', 300);
  assert.equal(n(), 1, 'a gesture is one step');
  St.editStep('c1:props.opacity', 350); assert.equal(n(), 2, 'a different field is a new step');
  St.editStep('c1:props.opacity', 360); assert.equal(n(), 2);
  St.editStep('c1:props.opacity', 1200); assert.equal(n(), 3, 'a pause of more than 600 ms ends the step');
  St.editStep('c1:props.opacity', 1300); assert.equal(n(), 3);
  St.endEdit(); St.editStep('c1:props.opacity', 1310); assert.equal(n(), 4, 'a commit ends the step');
});

test('coalescer: undo and redo re-arm it, and held fields do not split on a pause', () => {
  St.editStep('a', 0); St.undo(); St.editStep('a', 10);
  assert.equal(St.histDepth(), 1, 'the edit after undo is checkpointed again');
  St.endEdit(); St.holdEdit(true);
  const d0 = St.histDepth(); St.editStep('num', 0); St.editStep('num', 5000);
  assert.equal(St.histDepth(), d0 + 1, 'a focused number field stays one step however long it takes');
  St.endEdit(); St.checkpoint(); const d1 = St.histDepth(); St.editStep('num', 5010);
  assert.equal(St.histDepth(), d1 + 1, 'another action in between ends the step');
});

test('toast undo is bound to its own step', () => {
  S.sel = 'c2'; St.del();
  assert.equal(S.toast.label, 'Undo'); const depth = S.toast.step;
  St.editStep('c1:x', 0); // a later, silent edit
  assert.equal(S.toast.label, undefined, 'the action is dropped once the step is not the top one');
  assert.equal(S.toast.msg, 'Deleted');
  S.sel = 'c1'; const before = M.vclips(S.project).length; St.toastAct();
  assert.equal(M.vclips(S.project).length, before, 'no hidden undo ran');
  St.reset(); S.project = M.sampleProject('multi'); S.sel = 'c2'; St.del();
  const n = M.vclips(S.project).length; St.toastAct();
  assert.equal(M.vclips(S.project).length, n + 1, 'while it is the top step, Undo undoes the delete');
  assert.ok(depth >= 1);
});

test('toast undo is dropped when the user undoes another way', () => {
  S.sel = 'c2'; St.del(); St.undo(); assert.equal(S.toast?.label, undefined);
});

test('playback: jog on an empty project does nothing and leaves rate 1', () => {
  S.project = M.sampleProject('empty'); S.t = 0;
  St.jog(-1); assert.equal(S.rate, 1); assert.equal(S.playing, false);
  St.jog(1); assert.equal(S.rate, 1); assert.equal(S.playing, false);
  S.project = M.sampleProject('multi'); St.play(); assert.equal(S.playing, true); assert.equal(S.rate, 1);
  St.stop();
});

test('playback: stop always resets the rate, and jog doubles then flips', () => {
  St.jog(1); assert.equal(S.rate, 1); St.jog(1); assert.equal(S.rate, 2); St.jog(1); St.jog(1); assert.equal(S.rate, 4);
  St.jog(-1); assert.equal(S.rate, -1);
  St.stop(); assert.equal(S.rate, 1); assert.equal(S.playing, false);
  S.rate = -2; St.stop(); assert.equal(S.rate, 1, 'a stray rate is cleared even when nothing plays');
});

test('playback: deleting the last clip stops playback', () => {
  S.project = M.sampleProject('multi'); St.play();
  for (const c of [...M.allClips(S.project)]) M.remove(S.project, c.id);
  St.commit(); assert.equal(S.playing, false); assert.equal(S.rate, 1);
});

test('export: the store owns one interval; reopening starts clean', () => {
  St.openPop('export', null); assert.equal(S.exp.phase, 'idle');
  St.exportStart(); assert.equal(S.exp.phase, 'running');
  const first = S.exp; St.closePop(); St.openPop('export', null);
  assert.notEqual(S.exp, first); assert.equal(S.exp.phase, 'idle');
  St.exportStart(); St.closePop(); // closing stops the run
  St.reset();
});

test('jobs: one per clip, never duplicated, cancelled by reset', () => {
  S.sel = 'c2'; St.openAI('regenerate', null); St.aiGo();
  assert.equal(St.jobCount(), 1); assert.equal(M.findClip(S.project, 'c2').meta.status, 'generating');
  St.openAI('regenerate', null); St.aiGo();
  assert.equal(St.jobCount(), 1, 'a clip that is generating gets no second job');
  St.reset(); assert.equal(St.jobCount(), 0);
});

test('jobs: undoing the step cancels its job; redo of an unrelated step keeps a running job', () => {
  S.sel = 'c2'; St.openAI('regenerate', null); St.aiGo(); assert.equal(St.jobCount(), 1);
  St.editStep('c1:props.volume', 0); // a later edit while the job runs
  St.undo(); assert.equal(St.jobCount(), 1, 'undoing the later edit leaves the job running');
  assert.equal(M.findClip(S.project, 'c2').meta.status, 'generating');
  St.redo(); assert.equal(St.jobCount(), 1, 'redo does not start a second job');
  assert.equal(M.findClip(S.project, 'c2').meta.status, 'generating');
  St.undo(); St.undo(); assert.equal(St.jobCount(), 0, 'undoing the job step cancels it');
  St.reset();
});

test('drag: cancel reverts the step it took; finish commits; a second drag is refused', () => {
  const c = M.vclips(S.project)[0], start = c.start, depth = St.histDepth();
  assert.equal(St.dragStart('move', { id: c.id, x0: 0, orig: { start: c.start, in: c.in, out: c.out } }), true);
  assert.equal(St.dragStart('scrub'), false);
  assert.equal(St.dragStep(1), 'ignore'); assert.equal(St.dragStep(10), 'first'); assert.equal(St.histDepth(), depth + 1);
  c.start = start + 5;
  St.dragCancel(); assert.equal(S.drag, null); assert.equal(St.histDepth(), depth, 'the cancelled gesture leaves no history');
  assert.equal(M.findClip(S.project, c.id).start, start);
  St.dragStart('move', { id: c.id, x0: 0, orig: {} }); St.dragStep(10); St.dragStep(20);
  assert.equal(St.dragFinish().type, 'move'); assert.equal(St.histDepth(), depth + 1);
});

test('drag: undo during a drag clears the drag', () => {
  St.checkpoint(); St.dragStart('move', { id: 'c1', x0: 0, orig: {} }); St.dragStep(10); St.undo();
  assert.equal(S.drag, null);
});

test('reset clears timers, layers and playback state', () => {
  S.sel = 'c2'; St.openAI('extend', null); St.aiGo(); St.openTab('ai'); S.safe = true; S.rate = -2;
  St.reset();
  assert.equal(St.jobCount(), 0); assert.equal(S.pop, null); assert.equal(S.sheet, null); assert.equal(S.safe, false);
  assert.equal(S.rate, 1); assert.equal(S.toast, null); assert.equal(St.canUndo(), false);
});

test('captions: a second request while pending does not queue another', () => {
  St.captions('bar'); assert.equal(S.capPending, true);
  St.captions('bar'); assert.equal(S.toast.msg, 'Captions are on the way');
  St.reset(); assert.equal(S.capPending, false);
});

test('logic: coalescer and jog rate rules', () => {
  const c = L.makeCoalescer(600);
  assert.equal(c.begin('a', 0), true); assert.equal(c.begin('a', 599), false); assert.equal(c.begin('a', 1300), true);
  assert.equal(L.nextRate(1, true, 1), 2); assert.equal(L.nextRate(4, true, 1), 4); assert.equal(L.nextRate(2, true, -1), -1); assert.equal(L.nextRate(1, false, -1), -1);
});
