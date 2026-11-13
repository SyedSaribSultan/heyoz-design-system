import Button, { LinkButton, BUTTON, SIZE_NAMES, TYPE_NAMES, LINK_NAMES } from '@/components/Button';
import { DocPage, Section, Panel, Token, Meta, Table, Info } from '@/docs/ui';
import { meta } from '@/docs/nav';
import ButtonAnatomy from '@/docs/ButtonAnatomy';
import FigmaSteps from '@/docs/FigmaSteps';
import { lucide } from '@/lib/Lucide';

export const metadata = meta('/components/button');
// Specimens: the circle icon on both sides and the text "button", so every icon frame and edge can be checked.
const SQ = lucide('circle');
const SHAPES = ['squircle', 'pill'];
const STATES = [['rest', {}], ['hover', { state: 'hover' }], ['pressed', { state: 'active' }], ['disabled', { disabled: true }], ['loading', { loading: true }]];
const cell = (val, tok) => <div className="d-stack" style={{ gap: 0 }}><span>{val}</span><Meta>{tok}</Meta></div>;

export default function ButtonPage() {
  return (
    <DocPage href="/components/button">
      <Section title="Playground" desc="Build a button yourself: pick its kind, size, shape and what it shows. Zoom in to see how it is put together; the numbered marks show every part.">
        <ButtonAnatomy />
      </Section>

      <Section title="Eight kinds" desc="Eight types share every size and shape; only colour changes. Brand (orange) is for the one main action on a screen.">
        <Panel lit pad={8} className="b-matrix">
          <div className="b-mrow b-types b-mhead type-label-lg-medium d-dim"><span>Type</span>{STATES.map(([n]) => <span key={n}>{n}</span>)}</div>
          {TYPE_NAMES.map((ty) => (
            <div className="b-mrow b-types" key={ty}>
              <span className="d-stack" style={{ gap: 0 }}><span className="type-label-lg-medium">{ty}</span><Meta>{BUTTON.types[ty].about}</Meta></span>
              {STATES.map(([n, p]) => <span key={n}><Button type={ty} size="xs" icon={SQ} iconAfter={SQ} {...p}>button</Button></span>)}
            </div>
          ))}
        </Panel>
      </Section>

      <Section title="Icon buttons" desc="The same eight types with an icon and no label: square, or a circle when the shape is pill.">
        <Panel lit pad={8} className="b-matrix">
          <div className="b-mrow b-types b-mhead type-label-lg-medium d-dim"><span>Type</span>{STATES.map(([n]) => <span key={n}>{n}</span>)}</div>
          {TYPE_NAMES.map((ty) => (
            <div className="b-mrow b-types" key={ty}>
              <span className="type-label-lg-medium">{ty}</span>
              {STATES.map(([n, p]) => <span key={n} className="d-row" style={{ gap: 'var(--space-8)' }}><Button type={ty} size="xs" icon={SQ} label="button" {...p} /><Button type={ty} size="xs" shape="pill" icon={SQ} label="button" {...p} /></span>)}
            </div>
          ))}
        </Panel>
      </Section>

      <Section title="Links" desc={BUTTON.linksAbout}>
        <Panel lit pad={8} className="b-matrix">
          <div className="b-mrow b-types b-mhead type-label-lg-medium d-dim"><span>Link</span>{STATES.slice(0, 4).map(([n]) => <span key={n}>{n}</span>)}<span /></div>
          {LINK_NAMES.map((ln) => (
            <div className="b-mrow b-types" key={ln}>
              <span className="d-stack" style={{ gap: 0 }}><span className="type-label-lg-medium">{ln}</span><Meta>{BUTTON.links[ln].about}</Meta></span>
              {STATES.slice(0, 4).map(([n, p]) => <span key={n}><LinkButton type={ln} size="xs" icon={SQ} iconAfter={SQ} {...(n === 'disabled' ? { disabled: true } : p)}>button</LinkButton></span>)}<span />
            </div>
          ))}
        </Panel>
      </Section>

      <Section title="Seven sizes" desc="Seven sizes, 28 to 72. Each is a squircle (radius = height × 0.375, to the nearest 4) or a pill.">
        <Panel lit pad={8} className="b-matrix">
          <div className="b-mrow b-mhead type-label-lg-medium d-dim"><span>Size</span><span>Squircle</span><span>Pill</span><span>Icon only</span></div>
          {SIZE_NAMES.map((s) => (
            <div className="b-mrow" key={s}>
              <span className="d-stack" style={{ gap: 0 }}><span className="type-label-lg-medium">{s}</span><Meta>size/control/{s}</Meta></span>
              <span><Button size={s} icon={SQ} iconAfter={SQ}>button</Button></span>
              <span><Button size={s} shape="pill" icon={SQ} iconAfter={SQ}>button</Button></span>
              <span className="d-row" style={{ gap: 'var(--space-8)' }}><Button size={s} icon={SQ} label="button" /><Button size={s} shape="pill" icon={SQ} label="button" /></span>
            </div>
          ))}
        </Panel>
      </Section>

      <Section title="Build it in Figma" desc="Eight steps to make a button in Figma, shown three times bigger so you can see each part. Every size is built the same way.">
        <FigmaSteps />
      </Section>

      <Section title="Size details" desc={<>The exact values for each size. <Info info={`Source: components/button.json\nEvery value is on the 4px grid\nFigma: auto layout, horizontal, fixed height, centred; padding y is what is left over`}>How to read this</Info></>}>
        <Table first={72} cols={['Size', 'Height', 'Padding x', 'Padding y', 'Gap', 'Label', 'Icon frame', 'Radius']} rows={BUTTON.sizes.map((b) => [
          <Token key="s">{b.size}</Token>, cell(`${b.height}px`, b.heightToken), cell(`${b.paddingX}px`, b.paddingXToken || 'set, not a token'), cell(`${b.paddingY}px`, 'left over'),
          cell(`${b.gap}px`, b.gapToken), cell(`${b.font} / ${b.lineHeight}`, b.label.slice(5)), cell(`${b.icon} × ${b.icon}`, b.iconToken), cell(`${b.radius}px`, b.radiusSet ? 'set' : `height × ${BUTTON.squircle} → 4`)])} />
        <p className="d-desc type-body-md-regular" style={{ marginTop: 'var(--space-12)' }}>Pill: same values, radius/full (1000). {BUTTON.effects}</p>
      </Section>

      <Section title="Colour details" desc={<>The colours of each kind, while resting, pointed at, pressed and turned off. Secondary, tertiary, outline and ghost light their icon in brand orange when pointed at or pressed; the border only gets one step brighter in its own colour. <Info info={`none = transparent\nEvery state with a fill gets the inner shade (0, −4, blur 10, #000 50%)\n${BUTTON.loading}\n${BUTTON.focus}`}>More details</Info></>}>
        <Table first={120} cols={['Type', 'State', 'Fill', 'Border', 'Label', 'Icon', 'Inner shade']} rows={TYPE_NAMES.flatMap((ty) => ['rest', 'hover', 'pressed', 'disabled'].map((st, i) => {
          const c = BUTTON.types[ty][st];
          return [i === 0 ? <span key="t" className="type-label-lg-medium">{ty}</span> : '', st, ...['fill', 'border', 'label', 'icon'].map((p) => c[p] === 'none' ? <Meta key={p}>none</Meta> : <Token key={p}>{c[p]}</Token>), c.shade ? 'yes' : <Meta key="s">no</Meta>];
        }))} />
      </Section>
    </DocPage>
  );
}
