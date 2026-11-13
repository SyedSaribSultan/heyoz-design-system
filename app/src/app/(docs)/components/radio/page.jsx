import { RadioGroup, Radio } from '@/components/Radio';
import c from '@/tokens/components.json';
import { DocPage, Section, Panel, SpecTable, RuleTable, Matrix, RowName, specOf } from '@/docs/ui';
import { meta } from '@/docs/nav';
import { RadioPlayground, GroupDemo, DisabledDemo } from './RadioDemo';

export const metadata = meta('/components/radio');
const RADIO = c.radio; // the spec, read here: a client module's exports are not values on the server
const { px } = specOf(RADIO);
const TONE = 'surface/secondary'; // a well (fill/primary) reads as a well on a raised surface
const STATES = [['Rest', {}], ['Hover', { state: 'hover' }], ['Pressed', { state: 'pressed' }], ['Focus', { state: 'focus' }], ['Disabled', { disabled: true }]];
const ROWS = [['Unchecked', 'fill/primary', undefined], ['Checked', 'fill/inverse', 'a']];
// A specimen is a one-option group, so every radio sits in a valid radiogroup.
const Spec = ({ size = 'md', label = 'Label', chosen, ...p }) => <RadioGroup aria-label="Specimen" size={size} defaultValue={chosen}><Radio value="a" label={label} {...p} /></RadioGroup>;

export default function RadioPage() {
  return (
    <DocPage href="/components/radio">
      <Section title="Playground" desc="A live group. Tab into it once, then use the arrow keys: they move and choose together. Home and End jump to the ends. Change the group with the knobs.">
        <Panel tone={TONE} pad={24}><RadioPlayground sm={px('circle-sm')} md={px('circle-md')} /></Panel>
      </Section>

      <Section title="States" desc="Two values, five states. Unchecked is a well (fill/primary, border/secondary). Chosen is white (fill/inverse) with a dot that grows in. Hover is the -hover fill and border; pressed is one step stronger. Hover and press work on the label too. Nothing moves.">
        <Matrix tone={TONE} first="" cols={STATES.map(([n]) => n)} rows={ROWS.map(([n, sub, chosen]) => [<RowName key="n" title={n} sub={sub} />, ...STATES.map(([s, sp]) => <Spec key={s} chosen={chosen} {...sp} />)])} />
      </Section>

      <Section title="Groups" desc={`A group label (body/md/medium), then the options: ${px('group-gap')} apart in a column, ${px('group-gap-horizontal')} apart in a row. The label sits ${px('group-label-gap')} above. The group is one Tab stop.`}>
        <Panel tone={TONE} pad={24}>
          <div className="sc-row">
            <div><p className="sc-sub type-label-lg-medium">Vertical</p><GroupDemo /></div>
            <div><p className="sc-sub type-label-lg-medium">Horizontal</p><GroupDemo orientation="horizontal" /></div>
          </div>
        </Panel>
      </Section>

      <Section title="Label and description" desc="The label is body/md/regular, content/primary. The description is body/sm/regular, content/tertiary. The circle lines up with the first line of the label. The whole row is clickable, text included.">
        <Panel tone={TONE} pad={24}>
          <GroupDemo descriptions label="Where will it run?" />
        </Panel>
      </Section>

      <Section title="Disabled" desc="A disabled radio uses the -disabled fill, border and text. The arrow keys skip it and it leaves the Tab order. A disabled group disables every option.">
        <Panel tone={TONE} pad={24}><DisabledDemo /></Panel>
      </Section>

      <Section title="Two sizes" desc={`Small is a ${px('circle-sm')} circle with a ${px('dot-sm')} dot. Medium is a ${px('circle-md')} circle with a ${px('dot-md')} dot, and the default. Both have a ${px('circle-target')} × ${px('circle-target')} invisible hit area (size/target).`}>
        <Matrix tone={TONE} first="" cols={['Unchecked', 'Checked']} rows={[[<RowName key="n" title="Small" sub={`${px('circle-sm')}`} />, ...[undefined, 'a'].map((ch, i) => <Spec key={i} size="sm" chosen={ch} />)],
            [<RowName key="n" title="Medium" sub={`${px('circle-md')}`} />, ...[undefined, 'a'].map((ch, i) => <Spec key={i} size="md" chosen={ch} />)]]} />
      </Section>

      <Section title="When to use" desc="Pick the control by what the choice does.">
        <RuleTable spec={RADIO} keys={[['use', 'Use it when'], ['group', 'Groups'], ['colours', 'Colours'], ['hit', 'Hit area']]} />
      </Section>

      <Section title="Keyboard and screen readers" desc="One Tab stop for the whole group (roving tabindex).">
        <RuleTable spec={RADIO} keys={[['keyboard', 'Keyboard'], ['aria', 'Roles and names'], ['focus', 'Focus ring'], ['dot', 'Motion']]} />
      </Section>

      <Section title="The details" desc="Every value the radio is made of: each is a --rd-* variable built from components/radio.json. Plain numbers are set values, not tokens.">
        <SpecTable spec={RADIO} prefix="rd" />
      </Section>
    </DocPage>
  );
}
