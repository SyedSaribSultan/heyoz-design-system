// Editor data model and pure editing operations. No React, no DOM: model.test.mjs runs these in Node.
// project → tracks (video | text | audio) → clips → props. Duration is derived: (out − in) ÷ speed.
// Ported from the prototype's spec (heyoz-editor-prototype.html); behaviour kept, names kept.

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad = (n) => String(n).padStart(2, '0');
export const fmtTC = (t) => { t = Math.max(0, t); return `${pad(Math.floor(t / 60))}:${pad(Math.floor(t % 60))}:${pad(Math.floor((t % 1) * 30))}`; };
export const fmtS = (t) => `${Math.floor(t / 60)}:${pad(Math.floor(t % 60))}`;
export const durS = (t) => `${t.toFixed(1)}s`;
export const clone = (o) => JSON.parse(JSON.stringify(o));

// ─── Model registry (sample capability data) ─────────────────────────────────
// The UI never branches on a model name. Adding a model = adding an entry here.
// caps.<action> is false, true, or { max } (extend length cap in seconds).
export const MODELS = {
  seedance25: { kind: 'video', name: 'Seedance 2.5', cost: 12, caps: { regenerate: true, extend: { max: 10 }, edit: true } },
  kling25: { kind: 'video', name: 'Kling 2.5', cost: 10, caps: { regenerate: true, extend: { max: 5 }, edit: false } },
  veo3: { kind: 'video', name: 'Veo 3', cost: 20, caps: { regenerate: true, extend: false, edit: false } },
  wan22: { kind: 'video', name: 'Wan 2.2', cost: 6, caps: { regenerate: true, extend: false, edit: true } },
  sonic2: { kind: 'music', name: 'Sonic 2', cost: 3, caps: { regenerate: true, extend: { max: 30 }, edit: true } },
  foley1: { kind: 'sfx', name: 'Foley 1', cost: 1, caps: { regenerate: true, extend: false, edit: true } },
};
export const ACTIONS = [
  { id: 'regenerate', short: 'Regenerate', label: 'Regenerate', icon: 'refresh-cw', hint: 'New take, same idea', verb: 'Regenerat' },
  { id: 'extend', short: 'Extend', label: 'Extend', icon: 'arrow-right-to-line', hint: 'Continue from the last frame', verb: 'Extend' },
  { id: 'edit', short: 'Edit', label: 'Edit with prompt', icon: 'pen', hint: 'Change what’s in the clip', verb: 'Edit' },
];
export const idsOf = (kind, models = MODELS) => Object.keys(models).filter((i) => models[i].kind === kind);
const REASON = { regenerate: 'can’t regenerate clips.', extend: 'can’t extend clips.', edit: 'can’t edit existing clips.' };
export function support(mid, act, models = MODELS) {
  const m = models[mid];
  if (!m) return { ok: true }; // uploaded footage: no model to ask
  const c = m.caps[act];
  return c ? { ok: true, max: c.max } : { ok: false, reason: `${m.name} ${REASON[act]}` };
}
export const kindOf = (c) => (c.kind === 'video' ? 'video' : c.meta.source === 'sfx' ? 'sfx' : 'music');
export const costOf = (mid, act, by) => MODELS[mid].cost * (act === 'extend' ? Math.max(1, Math.round(by / 5)) : 1);
// The capability check for one clip and action, including the states that are not about the model.
export function canDo(c, act) {
  if (c.meta.status === 'generating') return { ok: false, reason: 'Generating…' };
  if (c.meta.source === 'upload') return { ok: true };
  return support(c.meta.model, act);
}
// A model of the same kind that can do it, for "Switch to …".
export const altFor = (c, act, except) => idsOf(kindOf(c)).find((i) => i !== except && support(i, act).ok);

// ─── Placeholder content ─────────────────────────────────────────────────────
// Clip art is generated (no real footage in the design system app). Colours are scene paint, not UI tokens.
export const PAL = [['#0e2428', '#38666b', '#b7d3cf'], ['#1a0f2e', '#6b2a74', '#ff7ab6'], ['#2a1409', '#b5562a', '#ffcf8a'], ['#0c1a2b', '#2f5a86', '#9ac3e8'], ['#14210f', '#4a7a3a', '#d4e8a8'], ['#25121a', '#8a3550', '#f2b9a8']];
export const thumbBg = (s) => { const p = PAL[s % PAL.length]; return `linear-gradient(160deg,${p[0]},${p[1]} 58%,${p[2]})`; };
export const stripBg = (s) => { const p = PAL[s % PAL.length]; return `linear-gradient(90deg,${p[0]},${p[1]} 40%,${p[2]} 70%,${p[1]})`; };
export const LIB = [
  { id: 'm1', name: 'Laundromat, rain', dur: 6, seed: 0, model: 'seedance25', source: 'ai', prompt: 'A man in a long coat stands in a laundromat at night, rain streaking the window, handheld, shallow focus' },
  { id: 'm2', name: 'Neon alley', dur: 5, seed: 1, model: 'kling25', source: 'ai', prompt: 'Empty alley after rain, magenta neon signs reflected in puddles, slow push-in' },
  { id: 'm3', name: 'Rooftop dusk', dur: 4, seed: 2, model: 'veo3', source: 'ai', prompt: 'City rooftop at dusk, warm light, a figure leans on the railing, wind in the coat' },
  { id: 'm4', name: 'Bus stop, night', dur: 6, seed: 3, model: 'seedance25', source: 'ai', prompt: 'A bus stop shelter at night, headlights sweep past, breath visible in the cold' },
  { id: 'm5', name: 'Market steam', dur: 5, seed: 4, model: 'wan22', source: 'ai', prompt: 'Morning market stall, steam rising from a pot, shallow depth of field' },
  { id: 'm6', name: 'product_pour.mp4', dur: 7, seed: 5, model: null, source: 'upload', prompt: '' },
];
export const TEXT_PRESETS = {
  title: { text: 'Your title', p: { font: 'display', size: 8.5, y: 50, bg: false } },
  sub: { text: 'A subtitle', p: { font: 'sans', size: 5, y: 60, bg: false } },
  caption: { text: 'Caption goes here', p: { font: 'sans', size: 4.4, y: 80, bg: true } },
};
// Text on the video: these are the fonts and colours the viewer's video gets, not UI colours.
export const FONTS = { display: 'var(--font-display)', sans: 'var(--font-body)', serif: 'Georgia, "Times New Roman", serif' };
export const COLORS = [['#ffffff', 'White'], ['#ffd23f', 'Yellow'], ['#ff3d01', 'Orange'], ['#7de3c0', 'Mint'], ['#9ac3e8', 'Sky'], ['#111111', 'Black']];
export const AR = { '9:16': 9 / 16, '1:1': 1, '16:9': 16 / 9 };
export const RATIO_USE = { '9:16': 'Reels, TikTok, Shorts', '1:1': 'Feed posts', '16:9': 'YouTube, web, desktop' };
export const RATIO_ICON = { '9:16': 'rectangle-vertical', '1:1': 'square', '16:9': 'rectangle-horizontal' };
export const CAPTION_LINES = ['It’s been raining since Tuesday.', 'Nothing here dries on time.', 'So you wait.', 'And you watch the machines turn.', 'Then it’s over.'];

// ─── Project ─────────────────────────────────────────────────────────────────
let _id = 100;
export const uid = (p) => p + ++_id;
export const mkClip = (o) => ({ id: uid('c'), kind: 'video', name: '', start: 0, in: 0, out: 5, srcDur: 5, props: {}, meta: {}, ...o });
export const vprops = () => ({ speed: 1, volume: 1, muted: false, fit: 'fill', opacity: 1, flip: false });
export const aprops = (v, fo) => ({ speed: 1, volume: v, muted: false, fadeIn: 0, fadeOut: fo });

export function sampleProject(mode) {
  const P = { name: 'Laundromat — rain', ratio: '9:16', tracks: [{ id: 'v1', kind: 'video', clips: [] }, { id: 't1', kind: 'text', clips: [] }, { id: 'a1', kind: 'audio', clips: [] }] };
  if (mode === 'empty') { P.name = 'Untitled project'; return P; }
  const v = P.tracks[0].clips;
  v.push(mkClip({ id: 'c1', name: 'Laundromat, rain', in: 0.5, out: 6.5, srcDur: 8, props: vprops(), meta: { model: 'seedance25', seed: 0, version: 1, source: 'ai', prompt: LIB[0].prompt } }));
  v.push(mkClip({ id: 'c2', name: 'Neon alley', in: 0, out: 5, srcDur: 7, props: vprops(), meta: { model: 'kling25', seed: 1, version: 1, source: 'ai', prompt: LIB[1].prompt } }));
  v.push(mkClip({ id: 'c3', name: 'Rooftop dusk', in: 1, out: 5, srcDur: 6, props: vprops(), meta: { model: 'veo3', seed: 2, version: 1, source: 'ai', prompt: LIB[2].prompt } }));
  if (mode !== 'full') return relayout(P);
  P.tracks[1].clips.push(mkClip({ id: 't1c', kind: 'text', name: 'Wash. Wait. Begin.', start: 0.6, in: 0, out: 3.4, srcDur: null, props: { text: 'Wash. Wait. Begin.', font: 'display', size: 7.5, color: '#ffffff', align: 'center', x: 50, y: 74, bg: false }, meta: {} }));
  P.tracks[2].clips.push(mkClip({ id: 'a1c', kind: 'audio', name: 'Slow felt piano, rain', start: 0, in: 0, out: 15, srcDur: 15, props: aprops(0.6, 2), meta: { model: 'sonic2', seed: 3, version: 1, source: 'music', prompt: 'Slow felt piano, soft rain, melancholic' } }));
  P.tracks[2].clips.push(mkClip({ id: 'a2c', kind: 'audio', name: 'Door chime', start: 6.1, in: 0, out: 1.4, srcDur: 1.4, props: aprops(0.9, 0), meta: { model: 'foley1', seed: 4, version: 1, source: 'sfx', prompt: 'Small brass door chime, close mic' } }));
  return relayout(P);
}

// Saved projects from the old editor may lack fields; fill the defaults so they open unchanged.
export function migrate(P) {
  P.ratio = P.ratio in AR ? P.ratio : '9:16';
  for (const kind of ['video', 'text', 'audio']) if (!P.tracks.some((t) => t.kind === kind)) P.tracks.push({ id: kind[0] + '1', kind, clips: [] });
  for (const t of P.tracks) for (const c of t.clips) {
    c.props = { ...(c.kind === 'video' ? vprops() : c.kind === 'audio' ? aprops(1, 0) : {}), ...c.props };
    c.meta = c.meta || {};
    if (c.out <= c.in) c.out = c.in + 0.3;
  }
  return relayout(P);
}

export const trk = (P, k) => P.tracks.find((t) => t.kind === k);
export const vclips = (P) => trk(P, 'video').clips;
export const allClips = (P) => P.tracks.flatMap((t) => t.clips);
export const findClip = (P, id) => { for (const t of P.tracks) { const c = t.clips.find((c) => c.id === id); if (c) return c; } return null; };
export const trackOf = (P, id) => P.tracks.find((t) => t.clips.some((c) => c.id === id));
export const spd = (c) => c.props.speed || 1;
export const cdur = (c) => (c.out - c.in) / spd(c);
export const cend = (c) => c.start + cdur(c);
export const total = (P) => allClips(P).reduce((m, c) => Math.max(m, cend(c)), 0);
// The video track is magnetic: clips sit end to end, in order, from 0.
export function relayout(P) { let t = 0; for (const c of vclips(P)) { c.start = t; t += cdur(c); } return P; }
export function activeVideo(P, t) {
  const vs = vclips(P); if (!vs.length) return null;
  return vs.find((c) => t >= c.start && t < cend(c)) || (t >= cend(vs[vs.length - 1]) ? vs[vs.length - 1] : vs[0]);
}
// Overlapping clips stack into sub-rows: first row whose last clip has ended.
export function packRows(clips) {
  const s = [...clips].sort((a, b) => a.start - b.start), ends = [], map = {};
  for (const c of s) { let r = ends.findIndex((e) => e <= c.start + 0.001); if (r < 0) { r = ends.length; ends.push(0); } ends[r] = cend(c); map[c.id] = r; }
  return { map, n: Math.max(1, ends.length) };
}

// ─── Edits (mutate P; the store checkpoints before calling) ──────────────────
const MIN = 0.3;
// Split at time t. Returns the new right-hand clip, or null when t is not inside a clip (0.1s guard each side).
export function splitAt(P, c, t) {
  if (!c || !(t > c.start + 0.1 && t < cend(c) - 0.1)) return null;
  const k = trackOf(P, c.id), i = k.clips.indexOf(c), srcT = c.in + (t - c.start) * spd(c);
  const b = clone(c); b.id = uid('c'); b.in = srcT; b.start = t; c.out = srcT; delete b.meta.status;
  k.clips.splice(i + 1, 0, b); relayout(P); return b;
}
export function duplicate(P, c) {
  const k = trackOf(P, c.id), b = clone(c); b.id = uid('c'); delete b.meta.status; delete b.meta.progress;
  if (c.kind === 'video') k.clips.splice(k.clips.indexOf(c) + 1, 0, b); else { b.start = cend(c); k.clips.push(b); }
  relayout(P); return b;
}
export function remove(P, id) { const k = trackOf(P, id); if (k) k.clips = k.clips.filter((x) => x.id !== id); relayout(P); }
// Inspector and drag edits. Trimming is clamped to the source: out ≤ srcDur, length ≥ MIN.
export function applyKey(P, c, k, v) {
  const s = spd(c);
  switch (k) {
    case 'in': c.in = clamp(v, 0, c.out - MIN * s); break;
    case 'out': c.out = clamp(v, c.in + MIN * s, c.srcDur || c.in + 120); break;
    case 'start': c.start = Math.max(0, v); break;
    case 'dur': { let o = c.in + Math.max(MIN, v) * s; if (c.srcDur) o = Math.min(o, c.srcDur); c.out = o; break; }
    default: { const p = k.split('.'); let o = c; for (let i = 0; i < p.length - 1; i++) o = o[p[i]]; o[p[p.length - 1]] = v; }
  }
  relayout(P);
}
// Trim one edge by dT seconds of timeline, from the clip as it was when the drag began (o).
export function trimEdge(c, side, o, t) {
  const s = spd(c), endO = o.start + (o.out - o.in) / s;
  if (side === 'r') { c.out = clamp(o.in + (t - o.start) * s, o.in + MIN * s, c.srcDur || o.in + 120); return; }
  if (c.kind === 'video') c.in = clamp(o.in + (t - o.start) * s, 0, o.out - MIN * s);
  else if (c.kind === 'audio') { c.in = clamp(o.in + (t - o.start) * s, 0, o.out - MIN * s); c.start = o.start + (c.in - o.in) / s; }
  else { const ns = clamp(t, 0, endO - MIN); c.start = ns; c.out = endO - ns; }
}
// Drag-reorder on the magnetic track: the clip goes where its centre is.
export function reorder(P, c, centre) {
  const vc = vclips(P), others = vc.filter((x) => x !== c); let idx = 0;
  for (const x of others) { if (x.start + cdur(x) / 2 < centre) idx++; else break; }
  const cur = vc.indexOf(c); if (idx !== cur) { vc.splice(cur, 1); vc.splice(idx, 0, c); }
  relayout(P);
}
// Snap a time to the playhead, 0 and every other clip's edges, within `th` seconds.
export function snapT(P, t, ign, playhead, th) {
  const c = [playhead, 0]; for (const x of allClips(P)) if (x.id !== ign) c.push(x.start, cend(x));
  let b = t, bd = th; for (const v of c) { const d = Math.abs(v - t); if (d < bd) { bd = d; b = v; } } return b;
}
export function captionClips(P) {
  const tot = Math.max(total(P), CAPTION_LINES.length * 1.5), seg = tot / CAPTION_LINES.length;
  return CAPTION_LINES.map((l, i) => mkClip({ kind: 'text', name: l, start: i * seg + 0.1, in: 0, out: seg - 0.2, srcDur: null, props: { text: l, font: 'sans', size: 4.4, color: '#ffffff', align: 'center', x: 50, y: 82, bg: true }, meta: { role: 'caption' } }));
}
// The result of a finished AI job, applied to the clip.
export function applyAI(c, A) {
  c.meta.version = (c.meta.version || 1) + 1; c.meta.model = A.model;
  if (A.action === 'regenerate') { c.meta.seed = (c.meta.seed || 0) + 1; if (A.prompt) c.meta.prompt = A.prompt; }
  if (A.action === 'extend') { c.srcDur = (c.srcDur || c.out) + A.by; c.out += A.by; }
  if (A.action === 'edit') { c.meta.seed = (c.meta.seed || 0) + 2; c.meta.prompt = A.prompt; }
}
