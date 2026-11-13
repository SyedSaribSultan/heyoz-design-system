import Switch from '@/components/Switch';
import c from '@/tokens/components.json';
import { DocPage, Section, Panel, SpecTable, RuleTable, Matrix, RowName, specOf } from '@/docs/ui';
import { meta } from '@/docs/nav';
import { SwitchPlayground, SettingsDemo } from './SwitchDemo';

export const metadata = meta('/components/switch');
const SWITCH = c.switch; // the spec, read here: a client module's exports are not values on the server
const { px } = specOf(SWITCH);
const TONE = 'surface/secondary'; // a well (fill/primary) reads as a well on a raised surface
const STATES = [['Rest', {}], ['Hover', { state: 'hover' }], ['Pressed', { state: 'pressed' }], ['Focus', { state: 'focus' }], ['Disabled', { disabled: true }]];
const ROWS = [['Off', 'fill/primary', {}], ['On', 'fill/inverse', { defaultChecked: true }]];

export default function SwitchPage() {
  return (
    <DocPage href="/components/switch">
      <Section title="Playground" desc="A live switch. Click it or press Space on it: the thumb slides across (duration/base, easing/standard). Change it with the knobs.">
        <Panel tone={TONE} pad={24}><SwitchPlayground sm={px('track-width-sm')} md={px('track-width-md')} /></Panel>
      </Section>

      <Section title="States" desc="Two values, five states. Off is a well (fill/primary, border/secondary) with a grey thumb. On is white (fill/inverse) with a dark thumb. Hover is the -hover fill and border; pressed is one step stronger. Hover and press work on the label too. Nothing moves.">
        <Matrix tone={TONE} first="" cols={STATES.map(([n]) => n)} rows={ROWS.map(([n, sub, p]) => [<RowName key="n" title={n} sub={sub} />, ...STATES.map(([s, sp]) => <Switch key={s} size="md" label="Label" aria-label={`${n} ${s}`} {...p} {...sp} />)])} />
      </Section>

      <Section title="Label side" desc={SWITCH.rules.label}>
        <Panel tone={TONE} pad={24}>
          <div className="sc-row">
            <div><p className="sc-sub type-label-lg-medium">Right (default)</p><Switch label="Auto-save" description="Saves every 30 seconds." defaultChecked /></div>
            <div><p className="sc-sub type-label-lg-medium">Left</p><Switch labelPosition="start" label="Auto-save" description="Saves every 30 seconds." defaultChecked /></div>
            <div><p className="sc-sub type-label-lg-medium">No text</p><Switch aria-label="Auto-save" defaultChecked /></div>
          </div>
        </Panel>
      </Section>

      <Section title="In a settings list" desc="Label on the left, switch at the far edge, the whole row clickable. Each change takes effect at once.">
        <Panel tone={TONE} pad={24}><SettingsDemo /></Panel>
      </Section>

      <Section title="Two sizes" desc={`Small is a ${px('track-width-sm')} × ${px('track-height-sm')} track with a ${px('thumb-sm')} thumb. Medium is ${px('track-width-md')} × ${px('track-height-md')} with a ${px('thumb-md')} thumb, and the default. The thumb sits ${px('track-padding')} from the edge. Both have a ${px('track-target')} × ${px('track-target')} invisible hit area (size/target).`}>
        <Matrix tone={TONE} first="" cols={['Off', 'On']} rows={[[<RowName key="n" title="Small" sub={`${px('track-width-sm')} × ${px('track-height-sm')}`} />, ...[{}, { defaultChecked: true }].map((p, i) => <Switch key={i} size="sm" label="Label" {...p} />)],
            [<RowName key="n" title="Medium" sub={`${px('track-width-md')} × ${px('track-height-md')}`} />, ...[{}, { defaultChecked: true }].map((p, i) => <Switch key={i} size="md" label="Label" {...p} />)]]} />
      </Section>

      <Section title="When to use" desc="Pick the control by what the choice does.">
        <RuleTable spec={SWITCH} keys={[['use', 'Use it when'], ['colours', 'Colours'], ['hit', 'Hit area']]} />
      </Section>

      <Section title="Keyboard and screen readers" desc="A native checkbox with role=switch sits under the drawn track, so the browser does the work.">
        <RuleTable spec={SWITCH} keys={[['keyboard', 'Keyboard'], ['aria', 'Roles and names'], ['focus', 'Focus ring'], ['motion', 'Motion']]} />
      </Section>

      <Section title="The details" desc="Every value the switch is made of: each is a --sw-* variable built from components/switch.json. Plain numbers are set values, not tokens.">
        <SpecTable spec={SWITCH} prefix="sw" />
      </Section>
    </DocPage>
  );
}
