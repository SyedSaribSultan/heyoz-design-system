'use client';
// Contextual inspector: only the selected object. Right column on desktop, bottom sheet when narrow.
import { useRef } from 'react';
import Button from '@/components/Button';
import Segmented from '@/components/Segmented';
import { S, useEd, bump, checkpoint, markSaved, toast, select, openAI, aiBlocked, openPop, closeSheet, track, M } from './store';
import { Ic, Slider, Switch, NumberField, TextArea, Hint, Label, iconUrl } from './parts/parts';
import { rectOf } from './dom';

const { cdur, durS, MODELS, ACTIONS, COLORS, canDo, applyKey, spd, thumbBg, cend } = M;

// One undo step per continuous change (a slider drag, typing in a field).
let armed = true;
const edit = (c, k, v, done) => { if (armed) { checkpoint(); armed = false; } applyKey(S.project, c, k, v); markSaved(); bump(); if (done) armed = true; };
const commitEdit = () => { armed = true; };
const once = (c, fn) => { checkpoint(); fn(c); M.relayout(S.project); markSaved(); bump(); };

function Sec({ title, children, details, onOpen }) {
  const tokens = JSON.stringify([['border bottom', 'border/primary'], ['padding', 'space/16'], ['heading', 'type/label/md/semibold · content/tertiary']]);
  if (details) return (
    <details className="ed-sec lit" data-name="inspector section" data-tokens={tokens} onToggle={(e) => e.currentTarget.open && track('inspector_section_opened', { section: title })}>
      <summary className="type-label-md-semibold">{title}<Ic n="chevron-down" /></summary>{children}
    </details>);
  return <section className="ed-sec lit" data-name="inspector section" data-tokens={tokens}><h4 className="type-label-md-semibold">{title}</h4>{children}</section>;
}

function Head({ thumb, icon, name, sub }) {
  return (
    <div className="ed-ih lit" data-name="inspector header" data-tokens={JSON.stringify([['title', 'type/body/md/semibold'], ['meta', 'type/body/sm/regular · content/tertiary'], ['thumb radius', 'radius/md']])}>
      <span className="ed-ithumb" style={thumb ? { background: thumb } : undefined}>{icon && <Ic n={icon} size="md" />}</span>
      <div className="ed-it"><b className="type-body-md-semibold">{name}</b><span className="type-body-sm-regular">{sub}</span></div>
      <Button type="ghost" size="xs" icon={iconUrl('ellipsis')} label="More actions" aria-haspopup="menu" onClick={(e) => openPop('ctx', rectOf(e.currentTarget), 'below-end', { kind: 'clip' })} />
      {S.narrow && <Button type="ghost" size="xs" icon={iconUrl('x')} label="Close" onClick={closeSheet} />}
    </div>
  );
}

function Volume({ c }) {
  return (
    <div className="ed-vrow">
      <Button type="ghost" size="xs" icon={iconUrl(c.props.muted ? 'volume-x' : 'volume-2')} label={c.props.muted ? 'Unmute clip' : 'Mute clip'} aria-pressed={c.props.muted}
        onClick={() => once(c, (c) => { c.props.muted = !c.props.muted; })} />
      <Slider label="Volume" min={0} max={2} step={0.05} value={c.props.volume} onChange={(v) => edit(c, 'props.volume', v)} onCommit={commitEdit} disabled={c.props.muted} />
      <output className="type-body-sm-regular">{Math.round(c.props.volume * 100)}%</output>
    </div>
  );
}

// The AI rows: one per action, disabled with the reason when the clip's model can't do it.
export function AIRows({ c }) {
  let bad = null;
  const rows = ACTIONS.map((a) => {
    const s = canDo(c, a.id); if (!s.ok && c.meta.status !== 'generating' && !bad) bad = a.id;
    return (
      <button key={a.id} type="button" className="ed-arow" aria-disabled={!s.ok || undefined} title={s.ok ? undefined : s.reason}
        onClick={(e) => (s.ok ? (track('tool_used', { tool: a.id, via: 'inspector' }), openAI(a.id, rectOf(e.currentTarget))) : aiBlocked(c, a.id))}
        data-name="AI action row (draft)" data-tokens={JSON.stringify([['background · hover', 'fill/tertiary-hover'], ['icon tile', 'fill/secondary'], ['title', 'type/body/md/medium'], ['hint', 'type/body/sm/regular · content/tertiary'], ['radius', 'radius/md']])}>
        <span className="ed-aic"><Ic n={a.icon} /></span>
        <span className="ed-atx"><b className="type-body-md-medium">{a.label}</b><em className="type-body-sm-regular">{s.ok ? a.hint + (a.id === 'extend' && s.max ? ` · up to ${s.max}s` : '') : s.reason}</em></span>
      </button>
    );
  });
  return (<>
    <div className="ed-aicard" data-name="AI card" data-tokens={JSON.stringify([['background', 'surface/tertiary'], ['border', 'border/tertiary'], ['radius', 'radius/xl'], ['padding', 'space/4']])}>{rows}</div>
    {bad && <Button type="brand-ghost" size="2xs" onClick={(e) => openAI(bad, rectOf(e.currentTarget), true)}>Try {bad === 'extend' ? 'extending' : 'editing'} with another model</Button>}
  </>);
}

function Made({ c }) {
  const m = MODELS[c.meta.model];
  return <div className="ed-made type-body-sm-regular"><Ic n="sparkles" /><span>{m ? `Made with ${m.name}` : 'Uploaded footage'}{c.meta.prompt ? ` · “${c.meta.prompt.slice(0, 34)}…”` : ''}</span></div>;
}

function TrimTo({ c }) {
  const go = (k) => {
    const t = S.t, s = spd(c);
    if (c.kind === 'video') { if (t <= c.start || t >= cend(c)) return toast('Move the playhead inside this clip'); once(c, (c) => { const src = c.in + (t - c.start) * s; if (k === 'in') c.in = src; else c.out = src; }); }
    else once(c, (c) => { c.start = t; });
    track('clip_trimmed', { kind: c.kind, via: 'inspector' });
  };
  return c.kind === 'video'
    ? <div className="ed-row2"><Button type="secondary" size="2xs" block icon={iconUrl('scissors')} onClick={() => go('in')}>Start here</Button><Button type="secondary" size="2xs" block iconAfter={iconUrl('scissors')} onClick={() => go('out')}>End here</Button></div>
    : <div className="ed-row2"><Button type="secondary" size="2xs" block onClick={() => go('start')}>Start at playhead</Button></div>;
}

export default function Inspector() {
  useEd(); const c = S.sel && M.findClip(S.project, S.sel); if (!c) return null;
  const setk = (k, v) => once(c, (c) => applyKey(S.project, c, k, v));
  if (c.kind === 'video') {
    const m = MODELS[c.meta.model];
    return (<>
      <Head thumb={thumbBg(c.meta.seed)} name={c.name} sub={`${durS(cdur(c))} · ${m ? m.name : 'Uploaded'}${c.meta.version > 1 ? ' · v' + c.meta.version : ''}`} />
      <Sec title="Trim"><TrimTo c={c} /><Hint>Or drag the clip edges in the timeline. With a clip focused, [ and ] trim the end, Alt + [ ] the start.</Hint></Sec>
      <Sec title="Speed"><Segmented label="Speed" size="2xs" items={[[0.5, '0.5×'], [1, '1×'], [1.5, '1.5×'], [2, '2×']]} value={c.props.speed} onChange={(v) => setk('props.speed', v)} />
        <Hint>Plays for <b>{durS(cdur(c))}</b></Hint></Sec>
      <Sec title="Volume"><Volume c={c} /></Sec>
      <Sec title="AI"><AIRows c={c} /><Made c={c} /></Sec>
      <Sec title="Advanced" details>
        <div className="ed-fr"><NumberField label="In" value={c.in} onChange={(v) => edit(c, 'in', v, true)} /><NumberField label="Out" value={c.out} onChange={(v) => edit(c, 'out', v, true)} /></div>
        <Label>Framing</Label><Segmented label="Framing" size="2xs" items={[['fill', 'Fill'], ['fit', 'Fit']]} value={c.props.fit} onChange={(v) => setk('props.fit', v)} />
        <div className="ed-fld"><span className="type-body-sm-regular">Opacity</span><Slider label="Opacity" min={0} max={1} step={0.05} value={c.props.opacity} onChange={(v) => edit(c, 'props.opacity', v)} onCommit={commitEdit} /></div>
        <Switch checked={c.props.flip} onChange={(v) => setk('props.flip', v)}>Flip horizontally</Switch>
      </Sec>
    </>);
  }
  if (c.kind === 'text') {
    const p = c.props;
    return (<>
      <Head icon="type" name={c.name} sub={`Text · ${durS(cdur(c))}`} />
      <Sec title="Text"><TextArea label="Text content" rows={2} value={p.text} onChange={(v) => { edit(c, 'props.text', v); c.name = v || 'Text'; }} /></Sec>
      <Sec title="Style">
        <Segmented label="Font" size="2xs" items={[['display', 'Display'], ['sans', 'Sans'], ['serif', 'Serif']]} value={p.font} onChange={(v) => setk('props.font', v)} />
        <div className="ed-fld"><span className="type-body-sm-regular">Size</span><Slider label="Size" min={3} max={14} step={0.5} value={p.size} onChange={(v) => edit(c, 'props.size', v)} onCommit={commitEdit} /></div>
        <div className="ed-fld"><span className="type-body-sm-regular">Colour</span>
          <div className="ed-sw" role="radiogroup" aria-label="Colour">{COLORS.map(([v, n]) => (
            <button key={v} type="button" role="radio" aria-checked={p.color === v} aria-label={n} onClick={() => setk('props.color', v)} style={{ background: v, color: v === '#111111' || v === '#ff3d01' ? '#fff' : '#111' }}>{p.color === v && <Ic n="check" size="xs" />}</button>))}
          </div></div>
        <div className="ed-gap8" />
        <Segmented label="Alignment" size="2xs" items={[['left', 'Left'], ['center', 'Centre'], ['right', 'Right']]} value={p.align} onChange={(v) => setk('props.align', v)} />
        <Switch checked={p.bg} onChange={(v) => setk('props.bg', v)}>Background pill</Switch>
      </Sec>
      <Sec title="Position">
        <Segmented label="Position" size="2xs" items={[['top', 'Top'], ['mid', 'Middle'], ['bot', 'Bottom']]} value={p.y < 30 ? 'top' : p.y < 65 ? 'mid' : 'bot'} onChange={(v) => setk('props.y', { top: 14, mid: 50, bot: 78 }[v])} />
        <Hint>Drag the text in the preview for fine placement.</Hint>
      </Sec>
      <Sec title="Timing" details>
        <div className="ed-fr"><NumberField label="Start" value={c.start} onChange={(v) => edit(c, 'start', v, true)} /><NumberField label="Length" value={cdur(c)} onChange={(v) => edit(c, 'dur', v, true)} /></div>
        <TrimTo c={c} />
      </Sec>
    </>);
  }
  const isM = c.meta.source === 'music';
  return (<>
    <Head icon={isM ? 'eighth-note' : 'audio-waveform'} name={c.name} sub={`${isM ? 'Music' : 'Sound effect'} · ${durS(cdur(c))}`} />
    <Sec title="Volume"><Volume c={c} /></Sec>
    <Sec title="AI"><AIRows c={c} /><Made c={c} /></Sec>
    <Sec title="Fades and timing" details>
      <div className="ed-fld"><span className="type-body-sm-regular">Fade in</span><Slider label="Fade in" min={0} max={3} step={0.1} value={c.props.fadeIn} onChange={(v) => edit(c, 'props.fadeIn', v)} onCommit={commitEdit} /><output className="type-body-sm-regular">{c.props.fadeIn.toFixed(1)}s</output></div>
      <div className="ed-fld"><span className="type-body-sm-regular">Fade out</span><Slider label="Fade out" min={0} max={3} step={0.1} value={c.props.fadeOut} onChange={(v) => edit(c, 'props.fadeOut', v)} onCommit={commitEdit} /><output className="type-body-sm-regular">{c.props.fadeOut.toFixed(1)}s</output></div>
      <div className="ed-fr ed-mt12"><NumberField label="Start" value={c.start} onChange={(v) => edit(c, 'start', v, true)} /><NumberField label="Length" value={cdur(c)} onChange={(v) => edit(c, 'dur', v, true)} /></div>
      <TrimTo c={c} />
    </Sec>
  </>);
}
