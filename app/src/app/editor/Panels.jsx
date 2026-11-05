'use client';
// Tool panels opened from the action bar: Add (media), Text, Sound, AI.
// Desktop: a card above the bar. Narrow: a bottom sheet.
import Button from '@/components/Button';
import Segmented from '@/components/Segmented';
import { S, useEd, bump, closeSheet, addLib, addText, genAudio, genClip, selClip, toast, M } from './store';
import { Ic, TextArea, Label, Hint, iconUrl } from './parts/parts';
import { AIRows } from './Inspector';

const { LIB, MODELS, idsOf, support, fmtS, thumbBg, FONTS } = M;
const AtT = () => { const t = useEd((s) => s.t); return <>{fmtS(t)}</>; };

export function ModelList({ kind, value, onPick }) {
  return (
    <div className="ed-mlist" role="radiogroup" aria-label="Model">
      {idsOf(kind).map((id) => {
        const m = MODELS[id];
        const cap = (a, l) => { const s = support(id, a); return <span key={a} data-no={!s.ok || undefined}><Ic n={s.ok ? 'check' : 'x'} size="xs" />{l}{a === 'extend' && s.max ? ` ≤${s.max}s` : ''}</span>; };
        return (
          <button key={id} type="button" className="ed-mrow" role="radio" aria-checked={value === id} onClick={() => onPick(id)}
            data-name="model row (draft)" data-tokens={JSON.stringify([['background · selected', 'fill/elevated'], ['border · selected', 'border/elevated'], ['background · hover', 'fill/tertiary-hover'], ['caps', 'type/label/md/regular · content/tertiary'], ['tick', 'content/brand']])}>
            <b className="type-body-md-medium">{m.name}</b>
            <span className="ed-caps type-label-md-regular">{cap('regenerate', 'Regen')}{cap('extend', 'Extend')}{cap('edit', 'Edit')}</span>
            <span className="ed-tick">{value === id && <Ic n="check" />}</span>
          </button>
        );
      })}
    </div>
  );
}
export function ModelPick({ model, open, onToggle }) {
  const m = MODELS[model];
  return (
    <button type="button" className="ed-mpick type-body-md-medium" aria-expanded={open} aria-label={`Model: ${m.name}`} onClick={onToggle}
      data-name="model picker (draft)" data-tokens={JSON.stringify([['background', 'fill/tertiary'], ['background · hover', 'fill/tertiary-hover'], ['border', 'border/tertiary'], ['radius', 'radius/md'], ['height', 'size/control/xs']])}>
      <Ic n="sparkles" /><span>{m.name}</span><span className="ed-dim type-body-sm-regular">✦ {m.cost}</span><Ic n="chevron-down" />
    </button>
  );
}

export default function Panel() {
  useEd(); const T = S.tab;
  const title = { media: 'Media', text: 'Text', audio: 'Sound', ai: 'AI' }[T];
  return (
    <aside className="ed-panel lit motion-pop" data-light-root="" aria-label={`${title} panel`} data-name="tool panel (draft)" data-tokens={JSON.stringify([['background', 'surface/secondary'], ['border', 'border/tertiary'], ['radius', 'radius/xl'], ['effect', 'effect · drop-md']])}>
      <div className="ed-ph"><h3 className="type-heading-xs-semibold">{title}</h3>
        {T === 'media' && <Button type="ghost" size="2xs" icon={iconUrl('plus')} onClick={() => toast('Upload is not wired in the design system app')}>Upload</Button>}
        <Button type="ghost" size="xs" icon={iconUrl('x')} label="Close" onClick={closeSheet} />
      </div>
      <div className="ed-pb">{T === 'media' ? <Media /> : T === 'text' ? <Text /> : T === 'audio' ? <Sound /> : <AI />}</div>
    </aside>
  );
}

function Media() {
  return (<>
    <div className="ed-mgrid">
      {LIB.map((m) => (
        <button key={m.id} type="button" className="ed-mcard" onClick={() => addLib(m.id)} aria-label={`Add ${m.name} to timeline, ${m.dur} seconds`} data-media
          data-name="media card (media)" data-tokens={JSON.stringify([['radius', 'radius/lg'], ['name', 'type/body/sm/medium · content/fixed-primary']])}>
          <span className="ed-mth" style={{ background: thumbBg(m.seed) }} />
          <span className="ed-mdur type-label-md-medium">{m.dur}s</span><span className="ed-madd"><Ic n="plus" /></span>
          <span className="ed-mname type-body-sm-medium">{m.name}</span>
        </button>
      ))}
    </div>
    <Hint>Pick a clip to add it at the end of the timeline. Clips you generate land here too.</Hint>
  </>);
}

function Text() {
  return (<>
    <Button type="secondary" size="xs" block icon={iconUrl('plus')} onClick={() => addText('title')}>Add title at <AtT /></Button>
    <Label>Styles</Label>
    <div className="ed-presets">
      <button type="button" className="ed-pre" onClick={() => addText('title')}><span style={{ fontFamily: FONTS.display, fontWeight: 800 }}>Aa</span><em className="type-label-md-medium">Title</em></button>
      <button type="button" className="ed-pre" onClick={() => addText('sub')}><span style={{ fontFamily: FONTS.sans }}>Aa</span><em className="type-label-md-medium">Subtitle</em></button>
      <button type="button" className="ed-pre" onClick={() => addText('caption')}><span className="ed-pre-cap" style={{ fontFamily: FONTS.sans }}>Aa</span><em className="type-label-md-medium">Caption</em></button>
    </div>
  </>);
}

function Sound() {
  const g = S.ga, music = g.type === 'music', model = idsOf(g.type)[0];
  const lens = music ? [['end', 'To end'], ['10', '10s'], ['20', '20s']] : [['1', '1s'], ['2', '2s'], ['4', '4s']];
  const setType = (v) => { g.type = v; g.len = v === 'music' ? 'end' : '2'; g.prompt = v === 'music' ? 'Slow felt piano, soft rain, melancholic' : 'Small brass door chime, close mic'; bump(); };
  return (<>
    <Segmented label="Sound type" size="xs" items={[['music', 'Music'], ['sfx', 'Sound effect']]} value={g.type} onChange={setType} />
    <Label htmlFor="ga-p">Describe it</Label>
    <TextArea id="ga-p" label="Describe the sound" value={g.prompt} placeholder={music ? 'Warm lo-fi piano, slow, rain in the background' : 'Door chime, close mic'} onChange={(v) => { g.prompt = v; bump(); }} />
    <Label>Length</Label>
    <Segmented label="Length" size="xs" items={lens} value={g.len} onChange={(v) => { g.len = v; bump(); }} />
    <Hint>Generates at the playhead, <b><AtT /></b>. Right-click the timeline for the same action.</Hint>
    <div className="ed-mt16"><Button type="brand" size="xs" block icon={iconUrl('sparkles')} onClick={() => genAudio()}>Generate at <AtT /> · ✦ {MODELS[model].cost}</Button></div>
    <div className="ed-mt8"><Button type="ghost" size="xs" block icon={iconUrl('plus')} onClick={() => toast('Upload is not wired in the design system app')}>Upload audio</Button></div>
  </>);
}

function AI() {
  const g = S.gc, c = selClip();
  return (<>
    <Label>New clip</Label>
    <TextArea label="Describe the clip" value={g.prompt} placeholder="Describe the shot" onChange={(v) => { g.prompt = v; bump(); }} />
    <div className="ed-mt8"><ModelPick model={g.model} open={g.open} onToggle={() => { g.open = !g.open; bump(); }} /></div>
    {g.open && <ModelList kind="video" value={g.model} onPick={(id) => { g.model = id; g.open = false; bump(); }} />}
    <Label>Length</Label>
    <Segmented label="Clip length" size="xs" items={[[5, '5s'], [10, '10s']]} value={g.len} onChange={(v) => { g.len = v; bump(); }} />
    <div className="ed-mt16"><Button type="brand" size="xs" block icon={iconUrl('sparkles')} disabled={!g.prompt.trim()} onClick={genClip}>Generate clip · ✦ {MODELS[g.model].cost}</Button></div>
    <div className="ed-card" data-name="card (draft)" data-tokens={JSON.stringify([['background', 'surface/tertiary'], ['border', 'border/primary'], ['radius', 'radius/xl']])}>
      <b className="type-body-md-semibold">On the selected clip</b>
      {c && c.kind !== 'text' ? <><p className="type-body-sm-regular">{c.name}</p><AIRows c={c} /></> : <p className="type-body-sm-regular">Select a clip in the timeline to regenerate, extend or edit it with a prompt.</p>}
    </div>
  </>);
}
