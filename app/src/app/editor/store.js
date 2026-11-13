'use client';
// Editor store: one state object, mutated by actions, read by components through useEd(selector).
// Two change signals so playback does not re-render the whole editor:
//   S.v  bumps on every document or UI change (components select it to re-render)
//   S.t  is the playhead; only the playhead, timecode, preview and "at 0:04" labels read it.
import { useSyncExternalStore } from 'react';
import * as M from './model';

const { clamp, fmtS, MODELS, idsOf, support, kindOf, findClip, allClips, vclips, trk, trackOf, cend, total, relayout } = M;

export const S = {
  v: 0, project: M.sampleProject('multi'), sel: null, t: 4.37, playing: false, rate: 1,
  pps: 60, autofit: true, narrow: false, sheet: null, tab: 'media', pop: null, safe: false, saved: 'saved', exp: null,
  ga: { type: 'music', len: 'end', prompt: 'Slow felt piano, soft rain, melancholic' },
  gc: { prompt: 'A cyclist crosses a wet crosswalk at dusk, neon reflections, slow dolly', model: 'seedance25', len: 5, open: false },
  ai: null, toast: null, drag: null, firstEdit: false,
};
const hist = { u: [], r: [] };
const subs = new Set();
const emit = () => subs.forEach((f) => f());
export const bump = () => { S.v++; emit(); };
export const setTime = (t) => { S.t = clamp(t, 0, Math.max(total(S.project), 0)); emit(); };
const subscribe = (f) => { subs.add(f); return () => subs.delete(f); };
export const useEd = (sel = (s) => s.v) => useSyncExternalStore(subscribe, () => sel(S), () => sel(S));
export const canUndo = () => hist.u.length > 0;
export const canRedo = () => hist.r.length > 0;

// ─── Analytics (brief §7). Events go to window.__heyozEvents; the real product swaps in its tracker. ─
export function track(name, props = {}) {
  if (typeof window === 'undefined') return;
  (window.__heyozEvents ||= []).push({ name, ...props, t: Date.now() });
  if (!S.firstEdit && /^(clip_|tool_used|captions|audio_generated|ai_action_started)/.test(name)) { S.firstEdit = true; track('first_edit'); }
}

// ─── History: one snapshot per edit; every completed AI job is one step ──────
const snap = () => JSON.stringify({ p: S.project, sel: S.sel });
export function checkpoint() { hist.u.push(snap()); if (hist.u.length > 80) hist.u.shift(); hist.r = []; }
function restore(str) {
  const o = JSON.parse(str); S.project = o.p;
  // A job that was running when the snapshot was taken is not resumed: its result belongs to a later step.
  for (const c of allClips(S.project)) if (c.meta.status === 'generating') { delete c.meta.status; delete c.meta.progress; }
  S.sel = o.sel && findClip(S.project, o.sel) ? o.sel : null; S.pop = null; S.ai = null;
}
export function undo() {
  if (!hist.u.length) return toast('Nothing to undo');
  const undidAI = lastAI.at(-1) === hist.u.length; if (undidAI) { lastAI.pop(); track('ai_action_undone'); }
  hist.r.push(snap()); restore(hist.u.pop()); commit();
}
export function redo() { if (!hist.r.length) return toast('Nothing to redo'); hist.u.push(snap()); restore(hist.r.pop()); commit(); }
const lastAI = []; // history depths at which an AI job was checkpointed

let saveTO;
export function markSaved() { S.saved = 'saving'; clearTimeout(saveTO); saveTO = setTimeout(() => { S.saved = 'saved'; bump(); }, 700); }
export function commit() { relayout(S.project); S.t = clamp(S.t, 0, Math.max(total(S.project), 0)); markSaved(); bump(); }

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTO;
export function toast(msg, label, fn) {
  S.toast = { msg, label, fn, id: Math.random() }; bump();
  clearTimeout(toastTO); toastTO = setTimeout(() => { S.toast = null; bump(); }, label ? 4500 : 2400);
}
export const toastAct = () => { const f = S.toast?.fn; S.toast = null; bump(); f && f(); };

// ─── Selection, sheets, popovers ─────────────────────────────────────────────
export const selClip = () => (S.sel ? findClip(S.project, S.sel) : null);
export function select(id) { S.sel = id; S.pop = null; S.ai = null; if (!id && S.sheet === 'insp') S.sheet = null; bump(); }
export function openTab(tab, via = 'bar') {
  if (S.sheet === 'panel' && S.tab === tab && via === 'bar') S.sheet = null; else { S.tab = tab; S.sheet = 'panel'; S.pop = null; }
  track('tool_used', { tool: tab, via }); bump();
}
export const closeSheet = () => { S.sheet = null; bump(); };
// rect: the anchor's box relative to the editor root, or null to centre.
export function openPop(type, rect, mode, data = {}) {
  if (S.pop && S.pop.type === type && !data.keep) return closePop();
  if (type === 'export') S.exp = null;
  if (type === 'cmd') data = { q: '', i: 0, ...data };
  S.pop = { type, rect, mode: mode || 'below-end', data, fresh: true }; bump();
}
export function closePop() { S.pop = null; S.ai = null; bump(); }

// ─── Edits ───────────────────────────────────────────────────────────────────
export function split() {
  const c0 = selClip();
  let c = c0 && S.t > c0.start + 0.1 && S.t < cend(c0) - 0.1 ? c0 : null;
  if (!c) c = vclips(S.project).find((x) => S.t > x.start + 0.1 && S.t < cend(x) - 0.1);
  if (!c) return toast('Move the playhead inside a clip to split it');
  if (c.meta.status === 'generating') return toast('Wait for the clip to finish generating');
  checkpoint(); const b = M.splitAt(S.project, c, S.t); S.sel = b.id; track('clip_split', { kind: c.kind }); commit();
}
export function dup() {
  const c = selClip(); if (!c) return toast('Select something to duplicate');
  checkpoint(); const b = M.duplicate(S.project, c); S.sel = b.id; commit(); toast('Duplicated');
}
export function del() {
  const c = selClip(); if (!c) return toast('Select something to delete');
  checkpoint(); M.remove(S.project, c.id); S.sel = null; commit(); toast('Deleted', 'Undo', undo);
}
export function addLib(id) {
  const m = M.LIB.find((x) => x.id === id); if (!m) return; checkpoint();
  const c = M.mkClip({ name: m.name, in: 0, out: m.dur, srcDur: m.dur + (m.source === 'upload' ? 0 : 2), props: M.vprops(), meta: { model: m.model, seed: m.seed, version: 1, source: m.source, prompt: m.prompt } });
  vclips(S.project).push(c); relayout(S.project); S.sel = c.id; S.t = c.start; S.sheet = null; commit(); toast('Added to timeline');
}
export function addText(k, at = S.t) {
  const P = M.TEXT_PRESETS[k]; checkpoint();
  const c = M.mkClip({ kind: 'text', name: P.text, start: at, in: 0, out: 3, srcDur: null, props: { text: P.text, font: 'sans', size: 6, color: '#ffffff', align: 'center', x: 50, y: 50, bg: false, ...P.p }, meta: {} });
  trk(S.project, 'text').clips.push(c); S.sel = c.id; S.sheet = S.narrow ? 'insp' : null; commit();
}
let capTO;
export function captions(via = 'bar') {
  track('tool_used', { tool: 'captions', via });
  if (!vclips(S.project).length) return toast('Add a clip first');
  if (trk(S.project, 'text').clips.some((x) => x.meta.role === 'caption')) return toast('Captions are already on the timeline');
  toast('Transcribing speech…'); clearTimeout(capTO);
  capTO = setTimeout(() => {
    checkpoint(); trk(S.project, 'text').clips.push(...M.captionClips(S.project));
    track('captions_generated', { count: M.CAPTION_LINES.length }); commit(); toast(`Added ${M.CAPTION_LINES.length} captions`, 'Undo', undo);
  }, 1200);
}
// A running job: progress on the clip, then the result. Stops by itself if the clip is deleted or undone.
function runJob(id, ms, apply) {
  const c = findClip(S.project, id); c.meta.status = 'generating'; c.meta.progress = 0; const t0 = performance.now();
  const iv = setInterval(() => {
    const c = findClip(S.project, id); if (!c || c.meta.status !== 'generating') return clearInterval(iv);
    c.meta.progress = Math.min(1, (performance.now() - t0) / ms);
    if (c.meta.progress >= 1) { clearInterval(iv); delete c.meta.status; delete c.meta.progress; apply && apply(c); relayout(S.project); markSaved(); }
    bump();
  }, 120);
}
export function genAudio(at = S.t) {
  const g = S.ga, model = idsOf(g.type)[0];
  const len = g.len === 'end' ? (total(S.project) - at > 2 ? total(S.project) - at : 8) : +g.len;
  checkpoint();
  const c = M.mkClip({ kind: 'audio', name: g.prompt.slice(0, 28) || 'Generated audio', start: at, in: 0, out: len, srcDur: len, props: M.aprops(g.type === 'music' ? 0.6 : 0.9, g.type === 'music' ? 1.5 : 0), meta: { model, seed: Math.floor(Math.random() * 50), version: 1, source: g.type, prompt: g.prompt } });
  trk(S.project, 'audio').clips.push(c); S.sel = c.id; S.sheet = null; runJob(c.id, 1900, null); commit();
  track('audio_generated', { type: g.type }); toast(`Generating ${g.type === 'music' ? 'music' : 'sound effect'} at ${fmtS(at)}…`);
}
export function genClip() {
  const g = S.gc; checkpoint();
  const c = M.mkClip({ name: g.prompt.split(/\s+/).slice(0, 3).join(' ') || 'New clip', in: 0, out: g.len, srcDur: g.len, props: M.vprops(), meta: { model: g.model, seed: Math.floor(Math.random() * 40) + 6, version: 1, source: 'ai', prompt: g.prompt } });
  vclips(S.project).push(c); relayout(S.project); S.sel = c.id; S.t = c.start; S.sheet = null; runJob(c.id, 3000, null); commit();
  track('ai_action_started', { action: 'generate', model: g.model }); toast(`Generating with ${MODELS[g.model].name}…`);
}
export function setRatio(r) { checkpoint(); S.project.ratio = r; S.pop = null; commit(); toast(`Canvas ${r}`); }

// ─── AI on the selection ─────────────────────────────────────────────────────
export function openAI(action, rect, force) {
  const c = selClip(); if (!c || c.kind === 'text') return;
  const kind = kindOf(c); let model = c.meta.model || idsOf(kind)[0];
  if (force || !support(model, action).ok) {
    const alt = idsOf(kind).find((i) => i !== model && support(i, action).ok);
    if (alt && alt !== model) track('model_switched_in_popover', { from: model, to: alt, auto: true });
    model = alt || model;
  }
  S.ai = { clipId: c.id, action, model, modelOpen: false, prompt: action === 'regenerate' ? c.meta.prompt || '' : '', by: Math.min(5, MODELS[model].caps.extend?.max || 5) };
  S.pop = { type: 'ai', rect, mode: 'left', data: {}, fresh: true }; bump();
}
export function aiBlocked(c, action) { const s = M.canDo(c, action); track('ai_action_blocked', { action, model: c.meta.model, reason: s.reason }); toast(s.reason); }
export function aiGo() {
  const A = S.ai, c = A && findClip(S.project, A.clipId); if (!c) return closePop();
  if (!support(A.model, A.action).ok) return;
  if (A.action === 'edit' && !A.prompt.trim()) return toast('Describe the change first');
  const m = MODELS[A.model], act = M.ACTIONS.find((a) => a.id === A.action);
  S.pop = null; S.ai = null; checkpoint(); lastAI.push(hist.u.length);
  track('ai_action_started', { action: A.action, model: A.model }); toast(`${act.verb}ing with ${m.name}…`);
  runJob(c.id, 2600, (c2) => { M.applyAI(c2, A); track('ai_action_completed', { action: A.action, model: A.model }); toast(`${act.verb}ed · v${c2.meta.version}`, 'Undo', undo); });
  bump();
}

// ─── Playback ────────────────────────────────────────────────────────────────
export function play() {
  if (S.playing) return stop(); const tot = total(S.project); if (!tot) return;
  if (S.rate < 0 && S.t <= 0) S.t = tot; if (S.rate > 0 && S.t >= tot - 0.02) S.t = 0; S.playing = true; bump();
}
export function stop() { if (!S.playing) return; S.playing = false; S.rate = 1; bump(); }
export function jog(dir) { if (!S.playing) { S.rate = dir; play(); } else S.rate = Math.sign(S.rate) === dir ? clamp(S.rate * 2, -4, 4) : dir; bump(); }
let last = 0;
export function tick(ts) {
  if (S.playing) {
    const dt = Math.min(0.1, (ts - last) / 1000), tot = total(S.project);
    S.t += dt * S.rate; if (S.t >= tot) { S.t = tot; stop(); } else if (S.t <= 0) { S.t = 0; stop(); }
    emit();
  }
  last = ts;
}

// ─── Scenes (the prototype's a–g states, reachable from ?scene=) ─────────────
export function scene(name) {
  stop(); hist.u = []; hist.r = []; lastAI.length = 0;
  Object.assign(S, { pop: null, ai: null, sheet: null, exp: null, sel: null, tab: 'media', autofit: true, toast: null });
  S.project = M.sampleProject(name === 'empty' ? 'empty' : name === 'grown' || name === 'text' ? 'full' : 'multi');
  S.t = name === 'empty' ? 0 : 4.37;
  if (name === 'clip' || name === 'ai') { S.sel = 'c2'; S.t = 7.4; }
  if (name === 'text') { S.sel = 't1c'; S.t = 1.4; }
  if (name === 'ai') openAI('extend', null), (S.ai.modelOpen = true);
  bump();
}

export { M };
