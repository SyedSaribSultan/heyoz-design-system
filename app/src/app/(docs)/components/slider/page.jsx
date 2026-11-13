import Slider from '@/components/Slider';
import { DocPage, Section, Panel, Token, Meta, Table, Info } from '@/docs/ui';
import { meta } from '@/docs/nav';
import c from '@/tokens/components.json';
import t from '@/tokens/tokens.resolved.json';
import SliderPlayground from './SliderPlayground';
import './page.css';

export const metadata = meta('/components/slider');

const SPEC = c.slider;
// A spec value in px: a set number, or the token it points at (components/slider.json).
const px = (key) => { const x = SPEC.vars.find((v) => v.key === key); return x.px ?? t.numbers.find((n) => n.name === x.ref).px; };
const KEYS = [
  ['← → ↑ ↓', 'One step.'],
  ['Shift + arrows', 'Ten steps.'],
  ['Page Up / Page Down', '10% of the range (at least one step).'],
  ['Home / End', 'The lowest and highest allowed value. A minimum thumb stops at the maximum thumb, and the other way round.'],
  ['Tab / Shift + Tab', 'To the next or previous thumb: minimum, then maximum. A disabled slider is skipped.'],
  ['Number field: ↑ ↓, Enter, Tab', 'Arrows step the number; Enter or leaving the field snaps it to the step and clamps it to the range.'],
];
const STATES = [['rest', {}], ['hover', { state: 'hover' }], ['dragging', { state: 'active' }], ['keyboard focus', { state: 'focus' }], ['disabled', { disabled: true }]];

export default function SliderPage() {
  return (
    <DocPage href="/components/slider">
      <Section title="Playground" desc={<>Try it: drag, click the track, or use the keyboard. A tag shows the value while you drag or tab in. <Info info={`Thumb ${px('thumb-size')} · track ${px('track-height')} · row ${px('hit')} tall (size/target)`}>Sizes</Info></>}>
        <SliderPlayground />
      </Section>

      <Section title="Variants" desc="One value, a range with two thumbs, steps with tick marks, and either with a number field for the exact value.">
        <Panel lit pad={24}>
          <div className="sl-pg-variants">
            <Slider label="Opacity" defaultValue={60} unit="%" limits />
            <Slider label="Duration" defaultValue={4} min={0} max={10} step={0.5} unit="s" ticks={20} limits />
            <Slider label="Price range" range defaultValue={[25, 75]} unit="$" limits />
            <Slider label="Quality" defaultValue={3} min={1} max={5} step={1} ticks limits />
            <Slider label="Strength" defaultValue={35} field />
            <Slider label="Clip trim" range defaultValue={[10, 80]} unit="s" field />
          </div>
        </Panel>
      </Section>

      <Section title="States" desc="Rest, pointed at, dragged, keyboard focus and disabled. Pointed at, the thumb turns fill/inverse-hover and gets a 4 halo; dragged, one step stronger (fill/inverse-active, halo 40%). The thumb never changes size.">
        <Panel lit pad={24}>
          <div className="sl-pg-states">
            {STATES.map(([name, p]) => (
              <div className="sl-pg-cell" key={name}>
                <Slider defaultValue={55} ariaLabel={name} {...p} />
                <Meta>{name}</Meta>
              </div>
            ))}
          </div>
        </Panel>
      </Section>

      <Section title="Keyboard" desc="Each thumb is a native range input, so a screen reader announces its name, value and limits with no extra work. The value text includes the unit.">
        <Table first={260} cols={['Key', 'Does']} rows={KEYS.map(([k, d]) => [<Token key="k">{k}</Token>, d])} />
      </Section>

      <Section title="When to use" desc={SPEC.rules.when}>
        <Table first={200} cols={['Need', 'Use']} rows={[
          ['A rough value on a scale', 'Slider.'],
          ['An exact value too', 'Slider with a number field.'],
          ['A start and an end', 'Range slider (two thumbs).'],
          ['2 to 5 named choices', 'Segmented control.'],
          ['An exact number on a wide range', 'A number field alone.'],
          ['On or off', 'A switch.'],
        ]} />
      </Section>

      <Section title="The details" desc={<>Every value the slider is made of. <Info info="Source: components/slider.json, checked by npm run tokens\nEach value is a --sl-* variable; plain numbers are set values, not tokens">How to read this</Info></>}>
        <Table first={260} cols={['Variable', 'Value']} rows={[
          ...SPEC.vars.map((x) => [<Token key="k">--sl-{x.key}</Token>, x.ref ? <Token key="v">{x.ref}</Token> : x.none ? 'none' : `${x.px}px · set`]),
          ...Object.entries(SPEC.types).map(([k, cls]) => [`type · ${k}`, <Token key="v">{cls}</Token>]),
        ]} />
        <p className="d-desc type-body-md-regular" style={{ marginTop: 'var(--space-12)' }}>{SPEC.rules.focus} {SPEC.rules.stacking}</p>
      </Section>
    </DocPage>
  );
}
