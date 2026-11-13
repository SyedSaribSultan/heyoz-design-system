import Chip from '@/components/Chip';
import { CHIP } from '@/components/chip-data';
import { DocPage, Section, Token, Meta, Table, SpecTable, Matrix, specOf } from '@/docs/ui';
import { meta } from '@/docs/nav';
import { ChipPlayground, ChipKinds, ChipChoices } from './ChipDemos';

export const metadata = meta('/components/chip');

const LOGO = '/home/openai-selected.svg';
const STATES = [['rest', {}], ['hover', { state: 'hover' }], ['pressed', { state: 'active' }], ['selected', { selected: true }], ['disabled', { disabled: true }], ['focus', { state: 'focus' }]];
const { ref } = specOf(CHIP);
const KEYS = [
  ['Tab', 'Moves to the next chip. In a choice group it stops once, on the chosen chip.'],
  ['Space, Enter', 'Presses an action chip. Toggles a filter chip. Chooses the focused chip in a choice group.'],
  ['Arrow keys', 'In a choice group: move to the next or previous chip and choose it. Wraps at the ends.'],
  ['Home, End', 'In a choice group: the first or last chip.'],
  ['Backspace, Delete', 'On an input chip: removes it. Focus moves to the next chip, or the previous one.'],
];

export default function ChipPage() {
  return (
    <DocPage href="/components/chip">
      <Section title="Playground" desc="Build a chip: pick its kind, size, leading and trailing parts. Point at it, press it, Tab to it.">
        <ChipPlayground />
      </Section>

      <Section title="Kinds" desc={CHIP.rules.kinds}>
        <ChipKinds />
      </Section>

      <Section title="States" desc={CHIP.rules.states}>
        <Matrix first="Kind" width={120} cols={STATES.map(([n]) => n)} rows={[
          ['Action', ...STATES.map(([n, p]) => n === 'selected' ? <Meta key={n}>not a toggle</Meta> : <Chip key={n} icon="wand-sparkles" tabIndex={-1} {...p}>Enhance</Chip>)],
          ['Filter', ...STATES.map(([n, p]) => <Chip key={n} tabIndex={-1} {...p} selected={n === 'selected'}>Video</Chip>)],
          ['Input', ...STATES.map(([n, p]) => n === 'selected' ? <Meta key={n}>not a toggle</Meta> : <Chip key={n} kind="input" tabIndex={-1} {...p}>Launch</Chip>)],
          ['Choice', ...STATES.map(([n, p]) => <Chip key={n} kind="choice" tabIndex={-1} {...p} selected={n === 'selected'}>9:16</Chip>)],
        ]} />
      </Section>

      <Section title="Choice group" desc={CHIP.rules.indicator}>
        <ChipChoices />
      </Section>

      <Section title="Sizes" desc={CHIP.rules.sizes}>
        <Matrix first="Size" width={140} cols={['Action', 'Filter · selected', 'Input', 'Logo and swap']} rows={['xs', '2xs'].map((s) => [
          <span key="n" className="dx-name"><span className="type-label-lg-medium">{s}</span><Meta>{ref(`${s}-height`)}</Meta></span>,
          <Chip key="a" size={s} icon="wand-sparkles" tabIndex={-1}>Enhance</Chip>,
          <Chip key="b" size={s} selected tabIndex={-1}>Video</Chip>,
          <Chip key="c" size={s} kind="input" tabIndex={-1}>Launch</Chip>,
          <Chip key="d" size={s} image={LOGO} iconAfter="chevrons-up-down" iconAfterHover="x" tabIndex={-1}>Static Ads</Chip>,
        ])} />
      </Section>

      <Section title="Keyboard" desc={CHIP.rules.keyboard}>
        <Table first={200} cols={['Key', 'What it does']} rows={KEYS.map(([k, v]) => [<Token key="k">{k}</Token>, v])} />
      </Section>

      <Section title="Usage" desc={CHIP.rules.use}>
        <Table first={260} cols={['Use a Chip for', 'Use something else for']} rows={[
          ['A compact setting that opens a menu or does one thing', <span key="a">An action on the page: <Token>Button</Token></span>],
          ['A filter that toggles on and off', <span key="a">A mode switch between two or three tools: <Token>Segmented</Token></span>],
          ['One choice among a few short options', 'More than about six options: Menu or Select'],
          ['A value the user typed or picked and can remove', <span key="a">A status that cannot be clicked: <Token>Badge</Token></span>],
        ]} />
      </Section>

      <Section title="The details" desc={<>Every value a chip is made of. Rules for the border, shade, light, focus, swap, check and aria are in <Token>components/chip.json</Token>; plain numbers are set values, not tokens.</>}>
        <SpecTable spec={CHIP} prefix="chp" />
      </Section>
    </DocPage>
  );
}
