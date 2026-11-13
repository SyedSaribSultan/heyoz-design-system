import Link from 'next/link';
import { DocPage, Section, Panel, Token, Meta, Table, Info, SpecTable } from '@/docs/ui';
import { meta } from '@/docs/nav';
import c from '@/tokens/components.json';
import t from '@/tokens/tokens.resolved.json';
import { BUTTON } from '@/components/Button';
import { lucide } from '@/lib/Lucide';
import { Live, Playground } from './SegmentedDemos';
import './page.css';

export const metadata = meta('/components/segmented');

const SPEC = c.segmented, R = SPEC.rules;
// A spec value in px: a set number, or the token it points at (components/segmented.json).
const val = (key) => { const x = SPEC.vars.find((v) => v.key === key); return x.px ?? t.numbers.find((n) => n.name === x.ref).px; };
const PAD = val('frame-padding'), GAP = val('frame-gap'), RING = val('frame-focus-ring');

const DWM = [['day', 'Day'], ['week', 'Week'], ['month', 'Month']];
const withExtra = (extra) => DWM.map(([v, l], i) => (extra[i] ? [v, l, extra[i]] : [v, l]));
const ICONS = [{ icon: lucide('list') }, { icon: lucide('layout-grid') }, { icon: lucide('rows-3') }];
const BOTH = [['list', 'List', ICONS[0]], ['grid', 'Grid', ICONS[1]], ['rows', 'Rows', ICONS[2]]];
const ONLY = [['list', null, { ...ICONS[0], label: 'List' }], ['grid', null, { ...ICONS[1], label: 'Grid' }], ['rows', null, { ...ICONS[2], label: 'Rows' }]];

const Row = ({ name, meta: m, children, wide }) => (
  <div className="sg-row">
    <span className="d-stack" style={{ gap: 0 }}><span className="type-label-lg-medium">{name}</span>{m && <Meta>{m}</Meta>}</span>
    <div className="sg-cell" data-wide={wide || undefined}>{children}</div>
  </div>
);

export default function SegmentedPage() {
  return (
    <DocPage href="/components/segmented">
      <Section title="Playground" desc="Pick a size, what the options show and how wide the control is. Click it, or Tab to it and use the arrow keys.">
        <Playground />
      </Section>

      <Section title="Options" desc={<>{R.options} <Info info="Icons are 16 at 2xs to sm, 20 at md, 24 at lg and xl, 32 at 2xl: Button's icon scale.">Icon sizes</Info></>}>
        <Panel lit pad={8} className="sg-matrix">
          <Row name="Label" meta="Text only"><Live label="View range" items={DWM} initial="week" /></Row>
          <Row name="Icon and label" meta="Icon before the label"><Live label="View layout" items={BOTH} initial="grid" /></Row>
          <Row name="Icon only" meta="Square, named by label"><Live label="View layout, icons" items={ONLY} initial="list" fit /></Row>
        </Panel>
      </Section>

      <Section title="States" desc={<>{R.states} <Info info={R.disabled}>Disabled</Info></>}>
        <Panel lit pad={8} className="sg-matrix">
          <Row name="Rest" meta="Chosen, others ghost"><Live label="Rest" items={DWM} initial="week" /></Row>
          <Row name="Hover" meta="On an option"><Live label="Hover" items={withExtra([null, null, { state: 'hover' }])} initial="day" /></Row>
          <Row name="Pressed" meta="On an option"><Live label="Pressed" items={withExtra([null, null, { state: 'active' }])} initial="day" /></Row>
          <Row name="Hover, chosen" meta="Styles the indicator"><Live label="Hover, chosen" items={withExtra([null, { state: 'hover' }])} initial="week" /></Row>
          <Row name="Pressed, chosen" meta="Styles the indicator"><Live label="Pressed, chosen" items={withExtra([null, { state: 'active' }])} initial="week" /></Row>
          <Row name="Disabled option" meta="Stays in place"><Live label="Disabled option" items={withExtra([null, null, { off: true }])} initial="week" /></Row>
          <Row name="Disabled group" meta="disabled"><Live label="Disabled group" items={DWM} initial="week" disabled /></Row>
        </Panel>
      </Section>

      <Section title="Seven sizes" desc={<>The sizes are Button&apos;s, {BUTTON.sizes[0].height} to {BUTTON.sizes[BUTTON.sizes.length - 1].height}. {R.radius} <Info info={R.sizes}>The details</Info></>}>
        <Panel lit pad={8} className="sg-matrix">
          {BUTTON.sizes.map((s) => (
            <Row key={s.size} name={s.size} meta={`size/control/${s.size} · radius ${s.radius + PAD}`} wide>
              <Live label={`Range, ${s.size}`} items={DWM} initial="week" size={s.size} />
            </Row>
          ))}
        </Panel>
      </Section>

      <Section title="Width" desc={R.width}>
        <Panel lit pad={8} className="sg-matrix">
          <Row name="Fill" meta="The default" wide><Live label="Fill" items={DWM} initial="week" /></Row>
          <Row name="Hug" meta="fit"><Live label="Hug" items={DWM} initial="week" fit /></Row>
          <Row name="Hug, with icons" meta="fit"><Live label="Hug, icons" items={BOTH} initial="grid" fit /></Row>
          <Row name="Grid" meta="cols={2}"><Live label="Aspect" cols={2} items={[['1:1', '1:1'], ['4:5', '4:5'], ['9:16', '9:16'], ['16:9', '16:9']]} initial="9:16" /></Row>
          <Row name="Column" meta="cols={1}"><Live label="Column" cols={1} items={DWM} initial="week" /></Row>
        </Panel>
      </Section>

      <Section title="When to use" desc={R.use}>
        <Table first={140} cols={['', 'Use it for', 'Not for']} rows={[
          [<Token key="a">Segmented</Token>, 'A value or setting: speed, alignment, resolution, framing. 2 to 6 short options, all visible, one always chosen.', 'Switching what the page shows. Long labels. More than 6 options.'],
          [<Link key="b" href="/components/tabs"><Token>Tabs</Token></Link>, 'Views of content: the pages of a settings area, the lists of a project. Each tab owns a panel.', 'A setting that changes how one thing looks or works.'],
          [<Link key="c" href="/components/select"><Token>Select</Token></Link>, 'One value from a long list, or when space is tight.', 'Two or three choices that should always be in sight.'],
        ]} />
      </Section>

      <Section title="Keyboard" desc={R.keyboard}>
        <Table first={200} cols={['Key', 'Does']} rows={[
          ['Tab', 'Enters the group on the chosen option (the first enabled one if none is chosen). The next Tab leaves it.'],
          ['Left, Up', 'Focuses and chooses the previous option. Wraps from the first to the last.'],
          ['Right, Down', 'Focuses and chooses the next option. Wraps from the last to the first.'],
          ['Home, End', 'The first or the last enabled option.'],
          ['Space, Enter', 'Chooses the focused option.'],
        ]} />
        <p className="d-desc type-body-md-regular" style={{ marginTop: 'var(--space-12)' }}>{R.focus}</p>
      </Section>

      <Section title="The details" desc={<>Every value the control is made of. <Info info="Source: components/segmented.json, checked by npm run tokens\nEach value is a --seg-* variable; the options take Button's size variables">How to read this</Info></>}>
        <SpecTable spec={SPEC} prefix="seg" extra={[
          ['Nesting', `outer radius = option radius + ${PAD} (the frame padding); gap ${GAP}; focus ring ${RING}`],
        ]} />
        <p className="d-desc type-body-md-regular" style={{ marginTop: 'var(--space-12)' }}>{R.indicator} {R.motion} {R.light}</p>
      </Section>
    </DocPage>
  );
}
