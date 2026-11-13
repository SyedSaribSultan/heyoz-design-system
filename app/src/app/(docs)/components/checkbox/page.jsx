import Checkbox from '@/components/Checkbox';
import c from '@/tokens/components.json';
import { DocPage, Section, Panel } from '@/docs/ui';
import { meta } from '@/docs/nav';
import { SpecTable, RuleTable, Matrix, num } from '@/docs/SelectionDocs';
import { CheckboxPlayground, SelectAllDemo, GroupDemo } from '@/docs/CheckboxDemo';

export const metadata = meta('/components/checkbox');
const TONE = 'surface/secondary'; // a well (fill/primary) reads as a well on a raised surface
const STATES = [['Rest', {}], ['Hover', { state: 'hover' }], ['Pressed', { state: 'pressed' }], ['Focus', { state: 'focus' }], ['Disabled', { disabled: true }]];
const ROWS = [['Unchecked', 'fill/primary', {}], ['Checked', 'fill/inverse', { defaultChecked: true }], ['Indeterminate', 'fill/inverse', { indeterminate: true }]];

const CHECKBOX = c.checkbox; // the spec, read here: a client module's exports are not values on the server
const VALUES = [{}, { defaultChecked: true }, { indeterminate: true }];

export default function CheckboxPage() {
  return (
    <DocPage href="/components/checkbox">
      <Section title="Playground" desc="A live checkbox. Click it, press Space on it, or change it with the knobs. The mark draws in from the left as it fades.">
        <Panel tone={TONE} pad={24}><CheckboxPlayground sm={num(CHECKBOX, 'box-sm')} md={num(CHECKBOX, 'box-md')} /></Panel>
      </Section>

      <Section title="States" desc="Three values, five states. Unchecked is a well (fill/primary, border/secondary). Checked and indeterminate are white (fill/inverse). Hover is the -hover fill and border; pressed is one step stronger. Hover and press work on the label too. Nothing moves.">
        <Panel tone={TONE} pad={24}>
          <Matrix head={STATES.map(([n]) => n)} rows={ROWS.map(([n, sub, p]) => [n, sub, STATES.map(([s, sp]) => <Checkbox key={s} size="md" label="Label" aria-label={`${n} ${s}`} {...p} {...sp} />)])} />
        </Panel>
      </Section>

      <Section title="Label and description" desc="The label is body/md/regular, content/primary. The description is body/sm/regular, content/tertiary. The box lines up with the first line of the label. The whole row is clickable, text included. A checkbox with no text needs an aria-label.">
        <Panel tone={TONE} pad={24}>
          <div className="sc-row">
            <Checkbox label="Remember me" defaultChecked />
            <Checkbox label="Remember me" description="Keep me signed in on this device for 30 days." defaultChecked />
            <Checkbox aria-label="Select row" />
          </div>
        </Panel>
      </Section>

      <Section title="Groups" desc={`A group label (body/md/medium), then the options: ${num(CHECKBOX, 'group-gap')} apart in a column, ${num(CHECKBOX, 'group-gap-horizontal')} apart in a row. The label sits ${num(CHECKBOX, 'group-label-gap')} above. A parent checkbox shows the mixed state when only some children are checked.`}>
        <Panel tone={TONE} pad={24}>
          <div className="sc-row">
            <div><p className="sc-sub type-label-lg-medium">Vertical</p><GroupDemo /></div>
            <div><p className="sc-sub type-label-lg-medium">Horizontal</p><GroupDemo orientation="horizontal" /></div>
            <div><p className="sc-sub type-label-lg-medium">Parent with mixed children</p><SelectAllDemo /></div>
          </div>
        </Panel>
      </Section>

      <Section title="Two sizes" desc={`Small is a ${num(CHECKBOX, 'box-sm')} box (size/icon/sm, radius xs). Medium is a ${num(CHECKBOX, 'box-md')} box (size/icon/md, radius sm) and the default. The mark is an icon on the icon grid: the box is its frame and the vector fills the middle 75%. Both have a ${num(CHECKBOX, 'box-target')} × ${num(CHECKBOX, 'box-target')} invisible hit area (size/target).`}>
        <Panel tone={TONE} pad={24}>
          <Matrix head={['Unchecked', 'Checked', 'Indeterminate']} rows={[['Small', `${num(CHECKBOX, 'box-sm')}`, VALUES.map((p, i) => <Checkbox key={i} size="sm" label="Label" {...p} />)], ['Medium', `${num(CHECKBOX, 'box-md')}`, VALUES.map((p, i) => <Checkbox key={i} size="md" label="Label" {...p} />)]]} />
        </Panel>
      </Section>

      <Section title="When to use" desc="Pick the control by what the choice does.">
        <RuleTable spec={CHECKBOX} keys={[['use', 'Use it when'], ['indeterminate', 'Indeterminate'], ['colours', 'Colours'], ['hit', 'Hit area']]} />
      </Section>

      <Section title="Keyboard and screen readers" desc="A native checkbox sits under the drawn box, so the browser does the work.">
        <RuleTable spec={CHECKBOX} keys={[['keyboard', 'Keyboard'], ['aria', 'Roles and names'], ['focus', 'Focus ring'], ['mark', 'Motion']]} />
      </Section>

      <Section title="The details" desc="Every value the checkbox is made of: each is a --cb-* variable built from components/checkbox.json. Plain numbers are set values, not tokens.">
        <SpecTable spec={CHECKBOX} prefix="cb" />
      </Section>
    </DocPage>
  );
}
