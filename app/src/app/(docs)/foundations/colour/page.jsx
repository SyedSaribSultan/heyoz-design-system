import t from '@/tokens/tokens.resolved.json';
import { DocPage, Section, Panel, Grid, Token, Info, v, rec } from '@/docs/ui';
import { meta } from '@/docs/nav';

export const metadata = meta('/foundations/colour');
const STATES = ['', 'hover', 'active', 'disabled'];
const JOBS = ['Page', 'Soft page', 'Thing', 'Pointing', 'Pressing', 'Soft line', 'Line', 'Strong line', 'Bold', 'Bold pointing', 'Quiet text', 'Text'];
const JOB_INFO = ['App background', 'Subtle background', 'Element background', 'Element hover', 'Element active', 'Subtle border', 'Border', 'Strong border', 'Solid colour', 'Solid hover', 'Low-contrast text', 'High-contrast text'];

function byBase(group) {
  const rows = new Map();
  for (const s of t.semantic.filter((s) => s.group === group)) {
    const leaf = s.name.slice(group.length + 1);
    const m = leaf.match(/^(.*?)-(hover|active|disabled)$/);
    const base = m ? m[1] : leaf, state = m ? m[2] : '';
    if (!rows.has(base)) rows.set(base, {});
    rows.get(base)[state] = s;
  }
  return [...rows.entries()];
}
// The background a content token is meant to sit on
function contentBg(leaf) {
  const disabled = leaf.endsWith('-disabled'), base = leaf.replace(/-disabled$/, '');
  if (base.startsWith('on-inverse')) return 'fill/inverse';
  if (base.startsWith('on-')) return 'fill/' + base.slice(3) + (disabled ? '-disabled' : '');
  if (base.startsWith('fixed-inverse')) return 'surface/primary';
  if (base.startsWith('fixed-primary')) return 'surface/fixed';
  if (base.startsWith('inverse-') || base.endsWith('-inverse')) return 'surface/inverse';
  return 'surface/primary';
}
// Every colour on this page copies its hex on click (data-copy, handled by DocsChrome).
const copyHex = (s) => ({ 'data-copy': s.hex, 'data-info': `${s.name}${s.ref ? `\n→ ${s.ref}` : ''}\n${s.hex}\nClick to copy` });
function Swatch({ group, s }) {
  const leaf = s.name.slice(group.length + 1);
  if (group === 'content') return <div {...copyHex(s)} className="c-sw type-body-md-medium" style={{ background: v(contentBg(leaf)), color: v(s.name) }} {...rec(s.name, [['text colour', s.name], ['background', contentBg(leaf)]])}>Aa</div>;
  if (group === 'border') return <div {...copyHex(s)} className="c-sw" style={{ background: v('surface/primary'), boxShadow: `inset 0 0 0 var(--stroke-1) ${v(s.name)}` }} {...rec(s.name, [['border', s.name]])} />;
  return <div {...copyHex(s)} className="c-sw" style={{ background: v(s.name), boxShadow: `inset 0 0 0 var(--stroke-1) ${v('border/primary')}` }} {...rec(s.name, [['background', s.name]])} />;
}
function StateTable({ group }) {
  return (
    <div className="d-table lit">
      <div className="d-tr d-th type-label-lg-medium c-states"><div>Name</div>{STATES.map((st) => <div key={st}>{{ '': 'Resting', hover: 'Pointing', active: 'Pressing', disabled: 'Off' }[st]}</div>)}</div>
      {byBase(group).map(([base, states]) => (
        <div className="d-tr c-states" key={base}>
          <div><Token>{group}/{base}</Token></div>
          {STATES.map((st) => <div key={st}>{states[st]
            ? <div className="d-stack"><Swatch group={group} s={states[st]} /></div>
            : <span className="d-dim type-label-lg-regular">—</span>}</div>)}
        </div>
      ))}
    </div>
  );
}

export default function Colour() {
  const find = (n) => t.semantic.find((s) => s.name === n);
  const ladder = ['background', 'surface/primary', 'surface/secondary', 'surface/tertiary', 'surface/elevated'].map(find);
  const others = t.semantic.filter((s) => s.group === 'surface' && !ladder.includes(s));
  const n = (g) => t.semantic.filter((s) => s.group === g).length;
  const Nest = ({ i }) => {
    const s = ladder[i], prev = ladder[i - 1];
    return (
      <div {...copyHex(s)} className={i === 0 ? 'c-ladder' : 'c-rung lit'} style={{ background: v(s.name) }} {...rec(s.name, [['background', s.name]])}>
        <div className="c-rung-label"><Token info={`→ ${s.ref} · ${s.hex}\nLightness ${s.lch[0]}${prev ? ` (+${(s.lch[0] - prev.lch[0]).toFixed(3)})` : ''}`}>{s.name}</Token></div>
        {i < ladder.length - 1 && <Nest i={i + 1} />}
      </div>
    );
  };
  return (
    <DocPage href="/foundations/colour">
      <Section title="Colour families" desc={<>Six ramps, each 12 steps from near-black to near-white, and every step has one job: 1–2 backgrounds, 3–5 component fills, 6–8 borders, 9 the solid colour, 10 its hover, 11–12 text. Our orange's shade 9 is <Info info="orange/9 · #FF3D01">the HeyOz orange</Info>. Click any colour to copy it.</>}>
        <Panel pad={20}>
          <div className="c-scale">
            <span />{JOBS.map((j, i) => <span key={i} className="c-job type-label-lg-regular" data-info={`Shade ${i + 1}: ${JOB_INFO[i]}`}><b className="type-label-lg-medium">{i + 1}</b>{j}</span>)}
            {t.ramps.map((r) => [
              <span key={r.name} className="c-rname type-label-lg-medium">{r.name}</span>,
              ...r.steps.map((p) => <div className="c-step" key={p.name}><div {...copyHex(p)} className="c-chip" style={{ background: v(p.name) }} {...rec(p.name, [['background', p.name]])} /></div>),
            ])}
          </div>
        </Panel>
        <p className="d-desc type-body-md-regular" style={{ marginTop: 'var(--space-12)' }}>Shade 5 is just as light in every family, so colours always sit well together. <Info info={`Lightness per shade: ${t.steps.lightness.join(' · ')}\nPlus white: ${t.white.hex}`}>How light is each shade?</Info></p>
      </Section>

      <Section title="Layers" desc="Surfaces stack: the background is the darkest, and each surface above it is one step lighter. Point at a name for its value.">
        <Nest i={0} />
        <h3 className="d-sub type-label-lg-medium">Special sheets</h3>
        <Grid min={180}>{others.map((s) => <div className="d-card lit" key={s.name}><Swatch group="surface" s={s} /><Token info={`→ ${s.ref} · ${s.hex}`}>{s.name}</Token></div>)}</Grid>
      </Section>
      <Section title="Fills" desc={<>The fill of anything you can press. Hover is one step lighter, pressed two. <Info info={`${n('fill')} fill tokens\nGray: pointing +1 shade, pressing +2, off −1\nColour: 9, pointing 10, pressing 8`}>The exact steps</Info></>}><StateTable group="fill" /></Section>
      <Section title="Borders" desc={<>Borders sit two steps above the surface they are on, so the edge always shows. Hover is one step brighter, pressed two. <Info info={`${n('border')} border tokens\nborder/X is 2 shades above surface/X\nPointing +1, pressing +2, off −1\nfocus and selected are states in themselves: one token each`}>The exact steps</Info></>}><StateTable group="border" /></Section>
      <Section title="Words and icons" desc={<>Text and icon colours, each shown on the background it belongs on. <Info info={`${n('content')} content tokens\nColour words: 10, pointing 11, pressing 9, off 7`}>The exact steps</Info></>}><StateTable group="content" /></Section>
    </DocPage>
  );
}
