'use client';
// Popovers: ratio, export, account, more, shortcuts, context menu, AI, ⌘K.
// Placed against their anchor inside the editor, clamped to it; a bottom sheet when narrow.
// They sit on the popover layer (above the light and media) and carry their own light.
import { useLayoutEffect, useRef } from 'react';
import Light from '@/lib/Light';
import Button from '@/components/Button';
import Segmented from '@/components/Segmented';
import { S, useEd, bump, closePop, openPop, openAI, aiGo, aiBlocked, selClip, split, dup, del, setRatio, addText, genAudio, toast, track, captions, openTab, M } from './store';
import { Ic, MenuItem, Sep, Kbd, Label, Hint, Callout, Progress, TextArea, iconUrl } from './parts/parts';
import { ModelList, ModelPick } from './Panels';
import { root } from './dom';
import { fitTimeline } from './Timeline';

const { AR, RATIO_USE, RATIO_ICON, ACTIONS, MODELS, support, kindOf, idsOf, costOf, canDo, total, durS, cend, findClip, clamp } = M;

function place(el, r, mode) {
  const A = root.el.getBoundingClientRect(), W = A.width, H = A.height, pw = el.offsetWidth, ph = el.offsetHeight, g = 8; let x, y;
  if (!r || mode === 'center') { x = (W - pw) / 2; y = Math.max(56, H * 0.14); }
  else if (mode === 'below-end') { x = r.right - pw; y = r.bottom + g; } else if (mode === 'below-start') { x = r.left; y = r.bottom + g; }
  else if (mode === 'left') { x = r.left - pw - g; y = r.top - 8; if (x < g) { x = r.left; y = r.bottom + g; } } else { x = r.left; y = r.top; }
  if (y + ph > H - g) y = mode.startsWith('below') ? Math.max(g, r.top - ph - g) : H - ph - g;
  el.style.left = `${clamp(x, g, Math.max(g, W - pw - g))}px`; el.style.top = `${clamp(y, g, Math.max(g, H - ph - g))}px`;
}

function mi(icon, label, onClick, o = {}) { return <MenuItem key={label} icon={icon} onClick={onClick} {...o}>{label}</MenuItem>; }
const DEFERRED = [['Stickers and shapes', 'sparkles'], ['Effects and filters', 'sparkles'], ['Transitions', 'arrow-right-to-line'], ['Keyframes', 'sliders-horizontal'], ['Brand kit', 'user']];
const deferred = (l) => { closePop(); track('deferred_item_clicked', { item: l }); toast(`${l} is deferred`); };

export default function Popovers() {
  useEd(); const P = S.pop, ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current?.closest('.ed-pop'); if (!P || !el) return;
    if (!sheet) place(el, P.rect, P.type === 'cmd' || P.type === 'keys' ? 'center' : P.mode);
    if (P.fresh) { P.fresh = false; (el.querySelector('[data-autofocus]') || el).focus({ preventScroll: true }); }
  });
  if (!P) return null;
  const sheet = S.narrow && !['ratio', 'account', 'more'].includes(P.type);
  let body = null, width = 240, pad = false, scrim = false, label = 'Menu';

  if (P.type === 'ratio') {
    label = 'Canvas ratio'; width = 260;
    body = <><h5 className="ed-h5 type-label-md-semibold">Canvas</h5>{Object.keys(AR).map((r) => mi(RATIO_ICON[r], r, () => setRatio(r), { role: 'menuitemradio', checked: S.project.ratio === r, sub: RATIO_USE[r] }))}</>;
  }
  if (P.type === 'export') {
    label = 'Export'; pad = true; width = 300; const E = (S.exp ||= { res: '1080p', p: 0, run: false, done: false });
    const go = () => {
      E.run = true; E.p = 0; track('export_started', { res: E.res, ratio: S.project.ratio }); bump();
      const iv = setInterval(() => { E.p = Math.min(1, E.p + 0.08); if (E.p >= 1) { clearInterval(iv); E.run = false; E.done = true; track('export_completed', { res: E.res }); } if (S.pop?.type === 'export') bump(); else clearInterval(iv); }, 150);
    };
    body = (<>
      <Title>Export</Title>
      <KV k="Length" v={durS(total(S.project))} /><KV k="Canvas" v={S.project.ratio} /><KV k="Format" v="MP4" />
      <Label>Resolution</Label>
      <Segmented label="Resolution" size="xs" items={[['720p', '720p'], ['1080p', '1080p']]} value={E.res} off={E.run ? ['720p', '1080p'] : []} onChange={(v) => { E.res = v; bump(); }} />
      {E.run ? <><Progress value={E.p} /><Hint>Rendering… {Math.round(E.p * 100)}%</Hint></>
        : E.done ? <><Callout icon="check">Rendered. The design system app does not produce a file.</Callout><div className="ed-foot"><Button type="primary" size="xs" block icon={iconUrl('download')} onClick={closePop}>Download MP4</Button></div></>
          : <div className="ed-foot"><span className="ed-dim type-body-sm-regular">{E.res === '1080p' ? '~14 MB' : '~7 MB'}</span><span className="grow" /><Button type="primary" size="xs" data-autofocus disabled={!total(S.project)} onClick={go}>Export video</Button></div>}
    </>);
  }
  if (P.type === 'more') {
    label = 'More tools'; width = 260;
    body = <><h5 className="ed-h5 type-label-md-semibold">More tools</h5>{DEFERRED.map(([l, i]) => mi(i, l, () => deferred(l), { badge: 'Deferred' }))}<Sep /><Hint>Also in ⌘K when they ship.</Hint></>;
  }
  if (P.type === 'account') {
    label = 'Account';
    body = <>{mi('scan', S.safe ? 'Hide social safe zones' : 'Show social safe zones', () => { S.safe = !S.safe; closePop(); })}
      {mi('search', 'Search actions', () => openPop('cmd', null, 'center'), { kbd: '⌘K' })}
      {mi('keyboard', 'Keyboard shortcuts', () => openPop('keys', null, 'center'), { kbd: '?' })}
      {mi('sliders-horizontal', 'More tools', () => openPop('more', P.rect, 'below-end'))}<Sep />
      {['Guides', 'Help', 'Upgrade plan'].map((l) => mi('info', l, () => deferred(l)))}</>;
  }
  if (P.type === 'keys') {
    label = 'Keyboard shortcuts'; pad = true; width = 360; scrim = true;
    const K = [['Play / pause', 'Space'], ['Back / forward 1 frame', '← →'], ['Back / forward 1 second', '⇧ ← →'], ['Jog reverse / pause / forward', 'J K L'], ['Split at playhead', 'S'], ['Trim end / start of focused clip', '[ ]  ·  Alt [ ]'], ['Duplicate', '⌘D'], ['Delete', '⌫'], ['Undo / redo', '⌘Z / ⇧⌘Z'], ['Zoom timeline / fit', '− = / 0'], ['Go to start / end', 'Home End'], ['Search actions', '⌘K'], ['Deselect / close', 'Esc']];
    body = <><Title>Keyboard shortcuts</Title>{K.map(([a, b]) => <KV key={a} k={a} v={<Kbd>{b}</Kbd>} />)}</>;
  }
  if (P.type === 'ctx') {
    label = 'Actions'; width = 260; const c = P.data.kind === 'tl' ? null : selClip();
    if (P.data.kind === 'tl') {
      const at = S.t; const gen = (type) => { closePop(); S.ga.type = type; S.ga.len = type === 'music' ? 'end' : '2'; S.ga.prompt = type === 'music' ? 'Slow felt piano, soft rain, melancholic' : 'Small brass door chime, close mic'; track('tool_used', { tool: type, via: 'context' }); genAudio(at); };
      body = <>{mi('eighth-note', 'Generate music here', () => gen('music'))}{mi('audio-waveform', 'Generate sound effect here', () => gen('sfx'))}{mi('type', 'Add title here', () => { closePop(); addText('title', at); })}</>;
    } else if (c) {
      const sp = S.t > c.start + 0.1 && S.t < cend(c) - 0.1, via = (tool, fn) => () => { track('tool_used', { tool, via: 'context' }); closePop(); fn(); };
      body = (<>
        {mi('scissors', 'Split at playhead', sp ? via('split', split) : () => toast('Move the playhead inside this clip'), { kbd: 'S', disabled: !sp, why: 'Move the playhead inside this clip' })}
        {mi('copy', 'Duplicate', via('duplicate', dup), { kbd: '⌘D' })}
        {mi('trash', 'Delete', via('delete', del), { kbd: '⌫', danger: true })}
        {c.kind !== 'text' && <><Sep /><h5 className="ed-h5 type-label-md-semibold">AI</h5>
          {ACTIONS.map((a) => { const s = canDo(c, a.id); return mi(a.icon, a.label, () => (s.ok ? (track('tool_used', { tool: a.id, via: 'context' }), openAI(a.id, P.rect)) : aiBlocked(c, a.id)), { disabled: !s.ok, why: s.reason, sub: s.ok ? undefined : s.reason }); })}</>}
      </>);
    } else body = <Hint>Select a clip first.</Hint>;
  }
  if (P.type === 'ai') {
    const A = S.ai, c = A && findClip(S.project, A.clipId); if (!c) { S.pop = null; return null; }
    label = 'AI actions'; pad = true; width = 420; scrim = true;
    const m = MODELS[A.model], s = support(A.model, A.action), kind = kindOf(c), act = ACTIONS.find((a) => a.id === A.action);
    const alt = idsOf(kind).find((i) => support(i, A.action).ok);
    const pick = (id) => { if (id !== A.model) track('model_switched_in_popover', { from: A.model, to: id }); A.model = id; A.modelOpen = false; const s2 = support(id, A.action); if (s2.max) A.by = Math.min(A.by, s2.max); bump(); };
    const tab = (id) => { const sp = support(A.model, id); if (!sp.ok) return aiBlocked({ ...c, meta: { ...c.meta, model: A.model } }, id); A.action = id; A.prompt = id === 'regenerate' ? c.meta.prompt || '' : ''; A.by = Math.min(5, sp.max || 5); bump(); };
    body = (<>
      <Title>{act.label}</Title>
      <div className="ed-atabs" role="tablist" aria-label="AI action">
        {ACTIONS.map((a) => { const sp = support(A.model, a.id); return (
          <Button key={a.id} role="tab" aria-selected={A.action === a.id} type={A.action === a.id ? 'tertiary' : 'ghost'} size="xs" block icon={iconUrl(a.icon)}
            aria-disabled={!sp.ok || undefined} title={sp.ok ? undefined : sp.reason} data-off={!sp.ok || undefined} onClick={() => tab(a.id)}>{a.short}</Button>); })}
      </div>
      <ModelPick model={A.model} open={A.modelOpen} onToggle={() => { A.modelOpen = !A.modelOpen; bump(); }} />
      {A.modelOpen && <ModelList kind={kind} value={A.model} onPick={pick} />}
      {!s.ok ? (<>
        <Callout>{s.reason}{alt ? ` ${MODELS[alt].name} can.` : ''}</Callout>
        {alt && <div className="ed-foot"><Button type="secondary" size="xs" onClick={() => pick(alt)}>Switch to {MODELS[alt].name}</Button></div>}
      </>) : (<>
        {A.action === 'extend' && <>
          <Label>Add</Label>
          <Segmented label="Extend by" size="xs" items={[2, 5, 10, 20].filter((v) => v <= Math.max(s.max || 5, 5) || v === 2).map((v) => [v, `+${v}s`])} value={A.by}
            off={[2, 5, 10, 20].filter((v) => v > (s.max || 5))} onChange={(v) => { A.by = v; bump(); }} />
          <Hint>{m.name} can extend up to {s.max}s at a time.</Hint>
        </>}
        <Label htmlFor="ai-p">{A.action === 'regenerate' ? 'Prompt' : A.action === 'extend' ? 'What happens next? (optional)' : 'What should change?'}</Label>
        <TextArea id="ai-p" label="Prompt" value={A.prompt} placeholder={A.action === 'edit' ? 'Make it night, add neon signs' : 'Describe the shot'} onChange={(v) => { A.prompt = v; bump(); }} />
        <div className="ed-foot">
          <span className="ed-dim type-body-sm-regular">✦ {costOf(A.model, A.action, A.by)} credits</span><span className="grow" />
          <Button type="ghost" size="xs" onClick={closePop}>Cancel</Button>
          <Button type="brand" size="xs" icon={iconUrl('sparkles')} data-autofocus disabled={A.action === 'edit' && !A.prompt.trim()} onClick={aiGo}>{A.action === 'regenerate' ? 'Regenerate' : A.action === 'extend' ? 'Extend' : 'Apply edit'}</Button>
        </div>
      </>)}
    </>);
  }
  if (P.type === 'cmd') { label = 'Search actions'; width = 520; scrim = true; body = <Cmd P={P} />; }

  return (
    <div className="ed-popwrap">
      <div className={scrim || sheet ? 'ed-scrim' : 'ed-catch'} data-dim={scrim || sheet || undefined} onClick={closePop} aria-hidden />
      <Light className="ed-pop motion-pop" data-pad={pad || undefined} data-sheet={sheet || undefined} role="dialog" aria-label={label} tabIndex={-1} style={{ width: sheet ? undefined : width }}
        data-name={`popover · ${P.type} (draft)`} data-tokens={JSON.stringify([['background', 'surface/tertiary'], ['border', 'border/tertiary'], ['radius', 'radius/xl'], ['effect', 'effect · inner-shade'], ['effect', 'effect · drop-md'], ['padding', pad ? 'space/16' : 'space/6']])}>
        <div ref={ref} className="ed-pop-col">{body}</div>
      </Light>
    </div>
  );
}

const Title = ({ children }) => <div className="ed-pt"><span className="type-heading-xs-semibold">{children}</span><Button type="ghost" size="2xs" icon={iconUrl('x')} label="Close" onClick={closePop} /></div>;
const KV = ({ k, v }) => <div className="ed-kv type-body-sm-regular"><span>{k}</span><b className="type-body-sm-medium">{v}</b></div>;

// ⌘K: every action by name, deferred ones included and marked.
function Cmd({ P }) {
  const c = selClip(), ai = c && c.kind !== 'text';
  const run = (fn) => () => { closePop(); track('tool_used', { tool: 'palette', via: 'palette' }); fn(); };
  const L = [
    { l: 'Split at playhead', k: 'S', i: 'scissors', run: split },
    { l: 'Add title', i: 'type', run: () => addText('title') },
    { l: 'Generate captions', i: 'captions', run: () => captions('palette') },
    { l: 'Generate music at playhead', i: 'eighth-note', run: () => { S.ga.type = 'music'; openTab('audio', 'palette'); } },
    { l: 'Generate sound effect at playhead', i: 'audio-waveform', run: () => { Object.assign(S.ga, { type: 'sfx', len: '2', prompt: 'Small brass door chime, close mic' }); openTab('audio', 'palette'); } },
    ...ACTIONS.map((a) => ({ l: `${a.label} selected clip`, i: a.icon, dis: !ai, run: () => openAI(a.id, null) })),
    ...Object.keys(AR).map((r) => ({ l: `Canvas: ${r}`, i: RATIO_ICON[r], run: () => setRatio(r) })),
    { l: 'Fit timeline', k: '0', i: 'move-horizontal', run: fitTimeline },
    { l: 'Export video', i: 'download', run: () => openPop('export', null, 'center') },
    { l: S.safe ? 'Hide social safe zones' : 'Show social safe zones', i: 'scan', run: () => { S.safe = !S.safe; bump(); } },
    { l: 'Keyboard shortcuts', k: '?', i: 'keyboard', run: () => openPop('keys', null, 'center') },
    ...DEFERRED.map(([l, i]) => ({ l, i, soon: true })),
  ];
  const q = (P.data.q || '').toLowerCase(), items = L.filter((x) => x.l.toLowerCase().includes(q)), i = clamp(P.data.i || 0, 0, Math.max(0, items.length - 1));
  const go = (x) => (x.dis ? toast('Select a clip first') : x.soon ? deferred(x.l) : run(x.run)());
  const key = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); P.data.i = (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % Math.max(items.length, 1); bump(); }
    if (e.key === 'Enter' && items[i]) { e.preventDefault(); go(items[i]); }
  };
  return (<>
    <div className="ed-cmd"><Ic n="search" />
      <input data-autofocus className="type-body-lg-regular" placeholder="Search actions…" aria-label="Search actions" autoComplete="off" value={P.data.q} role="combobox" aria-expanded aria-controls="ed-cmdlist" aria-activedescendant={`ed-cmd-${i}`}
        onChange={(e) => { P.data.q = e.target.value; P.data.i = 0; bump(); }} onKeyDown={key} />
      <Kbd>Esc</Kbd></div>
    <div id="ed-cmdlist" className="ed-cmdlist" role="listbox">
      {items.length ? items.map((x, n) => <MenuItem key={x.l} id={`ed-cmd-${n}`} role="option" aria-selected={n === i} icon={x.i} kbd={x.k} badge={x.soon ? 'Deferred' : undefined} disabled={x.dis} why="Select a clip first" active={n === i} onClick={() => go(x)}>{x.l}</MenuItem>)
        : <Hint>No matching actions.</Hint>}
    </div>
  </>);
}
