// Pure rules behind the editor store. No imports, no timers: node tests them directly.

// Undo coalescing, keyed per field. One undo step per continuous gesture or typing burst.
// begin(key, now) is true when this edit must push a new history step: a different field, a pause
// longer than `gap`, or the first edit after end(). hold(true) keeps the step open while a field has
// focus or a slider is pressed (no pause split). end() closes it (commit, blur, undo, redo, select).
export function makeCoalescer(gap = 600) {
  let key = null, last = 0, held = false;
  return {
    begin(k, now) { const fresh = k !== key || (!held && now - last > gap); key = k; last = now; return fresh; },
    hold(on) { held = on; },
    end() { key = null; held = false; },
  };
}

// One Esc closes the top layer only: a running drag, then a popover, then a sheet, then the selection.
export function escTarget(s) { return s.drag ? 'drag' : s.pop ? 'pop' : s.sheet ? 'sheet' : s.sel ? 'sel' : null; }

// While a popover (palette and AI included) or a sheet is open, the timeline shortcuts do nothing.
export const keysBlocked = (s) => !!(s.pop || s.sheet);

// The same popover type toggles shut; a context menu re-anchors instead; `keep` forces open.
export const popToggles = (cur, type, keep) => !!cur && cur.type === type && !keep && type !== 'ctx';

// Jog (J / L): start at ±1, double up to ±4 in the same direction, flip direction otherwise.
export function nextRate(rate, playing, dir) {
  if (!playing) return dir;
  return Math.sign(rate) === dir ? Math.max(-4, Math.min(4, rate * 2)) : dir;
}

// Drag shell shared by the timeline and the preview text. State only; the components do the mutation.
export const dragBegin = (type, extra = {}) => ({ type, moved: false, cp: false, ...extra });
// 'ignore' (under the threshold) | 'first' (first real move: take the history step) | 'move'.
export function dragMove(d, dx, threshold = 3) {
  if (!d) return 'ignore';
  if (d.type === 'scrub') return 'move';
  if (!d.moved && d.type !== 'text' && Math.abs(dx) < threshold) return 'ignore';
  d.moved = true;
  if (!d.cp) { d.cp = true; return 'first'; }
  return 'move';
}
// What to do when the gesture ends: 'commit' if it changed something, 'none' otherwise.
export const dragEnd = (d) => (d && d.moved && d.type !== 'scrub' ? 'commit' : 'none');
// What to do when it is cancelled: 'revert' if a history step was taken for it, 'none' otherwise.
export const dragAbort = (d) => (d && d.cp ? 'revert' : 'none');

// Export run: one explicit phase instead of two booleans.
export const newExport = () => ({ res: '1080p', p: 0, phase: 'idle' });
export function exportTick(E, step = 0.08) {
  E.p = Math.min(1, E.p + step);
  if (E.p >= 1) E.phase = 'done';
  return E.phase;
}
