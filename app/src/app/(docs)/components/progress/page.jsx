import Progress, { Spinner } from '@/components/Progress';
import Button from '@/components/Button';
import { DocPage, Section, Panel, Token, Meta, Table, Info, SpecTable, specOf } from '@/docs/ui';
import { meta } from '@/docs/nav';
import c from '@/tokens/components.json';
import ProgressPlayground from './ProgressPlayground';
import './page.css';

export const metadata = meta('/components/progress');

const SPEC = c.progress, GRID = c.iconGrid;
// A spec value in px: a set number, or the token it points at (components/progress.json).
const { px } = specOf(SPEC);
const BARS = [['sm', 'size 2'], ['md', 'size 4'], ['lg', 'size 8']];
const RINGS = ['xs', 'sm', 'md', 'lg', 'xl'];
const TONES = ['neutral', 'brand', 'success', 'critical'];
const grid = (n) => +(n * 24).toFixed(2); // a ratio of the 24 frame, as the icon grid page shows it

export default function ProgressPage() {
  return (
    <DocPage href="/components/progress">
      <Section title="Playground" desc="A bar and a ring on the same value. Drag the value, or switch to indeterminate for work with no known end. Change the height, ring size and tone.">
        <ProgressPlayground />
      </Section>

      <Section title="Bar" desc={<>Three heights, 2, 4 and 8, determinate and indeterminate. A change in value animates (duration/base); an indeterminate bar slides a segment 40% wide. <Info info={SPEC.rules.sizes}>Why these heights</Info></>}>
        <Panel lit pad={24}>
          <div className="pgp-rows">
            <div className="pgp-row pgp-head type-label-lg-medium"><span>Height</span><span>Determinate</span><span>Indeterminate</span></div>
            {BARS.map(([s, m]) => (
              <div className="pgp-row" key={s}>
                <span className="d-stack" style={{ gap: 0 }}><span className="type-label-lg-medium">{s} · {px(`bar-height-${s}`)}px</span><Meta>{m}</Meta></span>
                <Progress label="Uploading" value={65} size={s} />
                <Progress label="Preparing" size={s} />
              </div>
            ))}
          </div>
        </Panel>
      </Section>

      <Section title="Tones" desc={<>Neutral (fill/inverse) is the default: progress is status, not the one main action. Brand only when the progress is the main event of the screen. Success and critical for the end states. <Info info={SPEC.rules.tones}>The track</Info></>}>
        <Panel lit pad={24}>
          <div className="pgp-tones">
            {TONES.map((tn) => (
              <div className="d-stack" key={tn}>
                <Progress label={tn} value={tn === 'success' ? 100 : tn === 'critical' ? 30 : 60} tone={tn} size="lg" valueText={tn === 'critical' ? 'Failed at 30%' : undefined} />
                <div className="d-row"><Spinner tone={tn} decorative /><Spinner tone={tn} size="lg" value={tn === 'success' ? 100 : 60} decorative /><Meta>fill/{tn === 'neutral' ? 'inverse' : tn} · content/{tn === 'neutral' ? 'primary' : tn}</Meta></div>
              </div>
            ))}
          </div>
        </Panel>
      </Section>

      <Section title="Spinner" desc={<>The spinner is an icon (D-028): the same frame as every icon, the ring fills the key square ({GRID.square * 100}% of the frame) and the line is frame × {GRID.stroke} (1.5 at 24). It comes in the five icon sizes, turning (indeterminate) or filling clockwise from 12 o&apos;clock (determinate).</>}>
        <Panel lit pad={24}>
          <div className="pgp-rows">
            <div className="pgp-ring-row pgp-head type-label-lg-medium"><span>Size</span>{RINGS.map((s) => <span key={s}>{s} · {px(`ring-size-${s}`)}</span>)}</div>
            <div className="pgp-ring-row"><span className="type-label-lg-medium">Indeterminate</span>{RINGS.map((s) => <Spinner key={s} size={s} />)}</div>
            <div className="pgp-ring-row"><span className="type-label-lg-medium">Determinate 65%</span>{RINGS.map((s) => <Spinner key={s} size={s} value={65} />)}</div>
          </div>
        </Panel>
        <Panel lit pad={24} style={{ marginTop: 'var(--space-12)' }}>
          <div className="pgp-spec">
            <div className="pgp-frame" aria-hidden><Spinner size="xl" value={65} decorative /></div>
            <div className="d-stack" style={{ flex: 1, minWidth: 240 }}>
              <span className="type-label-lg-medium">xl, drawn 4 times larger</span>
              <Meta>Dashed: the icon frame (32). Solid: the key square, {GRID.square * 100}% ({grid(GRID.square)} at 24). Line: {grid(GRID.stroke)} at 24, {+(32 * GRID.stroke).toFixed(2)} at 32.</Meta>
              <Meta>{SPEC.rules.ring}</Meta>
            </div>
          </div>
        </Panel>
      </Section>

      <Section title="In a button" desc="A loading Button swaps its trailing icon for the same ring (button.css .btn-spinner follows the same grid rule) and disables itself. The button is aria-busy; the ring there is decoration.">
        <Panel lit pad={24}>
          <div className="pgp-btns">
            <Button type="brand" size="xs" loading>Generate</Button>
            <Button type="primary" size="xs" loading>Saving</Button>
            <Button type="secondary" size="xs" loading>Loading</Button>
            <Button type="secondary" size="xs" shape="pill" loading>Uploading</Button>
          </div>
        </Panel>
      </Section>

      <Section title="Bar, spinner or skeleton" desc={SPEC.rules.use}>
        <Table first={180} cols={['Use', 'When', 'Example']} rows={[
          [<Token key="a">Bar</Token>, 'The end is known, the wait is over 2 seconds, and it has a place of its own.', 'Upload, render, a step in a flow.'],
          [<Token key="b">Spinner</Token>, 'The end is unknown, or the place is too small for a bar.', 'Inside a button, next to a label, a block waiting for data.'],
          [<Token key="c">Skeleton</Token>, 'The shape of the content is known and it will fill in. Not built yet: use a spinner for a short wait and a bar for a long one.', 'A list of cards that is loading.'],
          [<Token key="d">Nothing</Token>, 'The wait is under about 400 ms. A flash of progress reads as slower than none.', 'A cached page, a fast save.'],
        ]} />
      </Section>

      <Section title="Accessibility" desc={SPEC.rules.aria}>
        <Table first={220} cols={['Part', 'Attribute']} rows={[
          ['Bar and ring', <Token key="a">role=progressbar</Token>],
          ['Determinate', <Token key="b">aria-valuemin=0 · aria-valuemax=100 · aria-valuenow</Token>],
          ['Indeterminate', 'No aria-valuenow: a screen reader hears "busy", no value.'],
          ['Name', <Token key="c">aria-labelledby (the label) · aria-label · Spinner: &quot;Loading&quot;</Token>],
          ['Busy', <Token key="d">aria-busy until the value reaches 100</Token>],
          ['Percentage text', 'Hidden from screen readers; the bar says it already.'],
          ['Reduced motion', 'The ring still turns, at 2.4s. The bar stops sliding and pulses. The value change jumps.'],
        ]} />
      </Section>

      <Section title="The details" desc={<>Every value progress is made of. <Info info="Source: components/progress.json, checked by npm run tokens\nEach value is a --pg-* variable; plain numbers are set values, not tokens">How to read this</Info></>}>
        <SpecTable spec={SPEC} prefix="pg" />
        <p className="d-desc type-body-md-regular" style={{ marginTop: 'var(--space-12)' }}>{SPEC.rules.indeterminate} {SPEC.rules.shade}</p>
      </Section>
    </DocPage>
  );
}
