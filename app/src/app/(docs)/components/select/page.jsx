import { DocPage, Section, Panel, Token, Table, Meta, Info } from '@/docs/ui';
import { meta } from '@/docs/nav';
import c from '@/tokens/components.json';
import t from '@/tokens/tokens.resolved.json';
import Select from '@/components/Select';
import { SelectPlayground, FormDemo, MODELS, RATIOS, LANGS } from '@/docs/SelectDemos';
import '@/docs/menu-docs.css';

export const metadata = meta('/components/select');
const SPEC = c.select, MENU = c.menu; // the specs, read here: a client module's exports are not values on the server
const px = (r) => t.numbers.find((n) => n.name === r)?.px;
const val = (spec, key) => { const x = spec.vars.find((v) => v.key === key); return x.px ?? px(x.ref); };
const rule = (k) => SPEC.rules[k];
const RuleTable = ({ keys }) => <Table first={160} cols={['Topic', 'Rule']} rows={keys.map(([k, title]) => [<span key="t" className="type-label-lg-medium">{title}</span>, rule(k)])} />;
const SIZES = ['xs', 'sm', 'md'];

const STATES = [
  ['Rest', 'fill/primary, border/primary.', {}],
  ['Hover', 'fill/primary-hover, border/primary-hover.', { state: 'hover' }],
  ['Open', 'border/primary-active; the chevron turns over.', { state: 'open' }],
  ['Focus', 'The focus ring outside, border/focus, stroke/2.', { state: 'focus' }],
  ['Invalid', 'border/critical, with the message in content/critical.', { invalid: true, error: 'Pick a model your plan includes.' }],
  ['Disabled', '-disabled fill, border and text.', { disabled: true }],
];

export default function SelectPage() {
  return (
    <DocPage href="/components/select">
      <Section title="Playground" desc="A live select. Click it, or Tab to it and press Enter, Space or an arrow key. Point at options or use the arrows: one highlight slides between them. The chosen option shows a check.">
        <SelectPlayground />
      </Section>

      <Section title="States" desc="Six looks on one well. Each is forced here; hover, open and focus also happen live. The border is an inset ring, so no state moves anything. Invalid keeps its own colour family: hover and open step to critical-hover and critical-active.">
        <Panel tone="surface/secondary" pad={24}>
          <div className="mnd-grid">
            {STATES.map(([name, note, props]) => (
              <div className="mnd-cell" key={name}>
                <Select label="Image model" size="xs" options={MODELS} defaultValue="sunburst" {...props} />
                <div className="d-stack" style={{ gap: 0 }}><span className="type-label-lg-medium">{name}</span><Meta>{note}</Meta></div>
              </div>
            ))}
          </div>
        </Panel>
        <RuleTable keys={[['well', 'The well'], ['invalid', 'Invalid'], ['chevron', 'Chevron']]} />
      </Section>

      <Section title="Three sizes" desc={`Heights on size/control: xs ${val(SPEC, 'size-xs-height')} (everyday), sm ${val(SPEC, 'size-sm-height')}, md ${val(SPEC, 'size-md-height')}. Radius follows the height (lg, xl, 2xl) and padding x follows Button (${val(SPEC, 'size-xs-padding-x')}, ${val(SPEC, 'size-sm-padding-x')}, ${val(SPEC, 'size-md-padding-x')}). The text field uses the same numbers, so the two line up in a form. The list is always the same item size.`}>
        <Panel tone="surface/secondary" pad={24}>
          <div className="mnd-grid">
            {SIZES.map((s) => (
              <div className="mnd-cell" key={s}>
                <Select label="Image model" size={s} options={MODELS} placeholder="Choose a model" icon="sparkles" hint="One line of help." />
                <Meta>{s} · size/control/{s} · {s === 'md' ? 'body/lg' : 'body/md'}</Meta>
              </div>
            ))}
          </div>
        </Panel>
        <RuleTable keys={[['fieldConventions', 'Field conventions']]} />
      </Section>

      <Section title="Options" desc={<>Options can carry an icon and a description, sit in groups, and be disabled. The list is the Menu&apos;s surface ({MENU.parts.surface.background}) and item look, as wide as the trigger. <Info info={`Surface: components/menu.json\nItem ${val(MENU, 'item-height')} tall, icon ${val(MENU, 'item-icon')}\nChosen option: a check at the end, size/icon/sm\nOver ${val(MENU, 'surface-max-height')}px tall it scrolls inside (D-037)`}>The details</Info></>}>
        <Panel tone="surface/secondary" pad={24}>
          <div className="mnd-grid">
            <div className="mnd-cell"><Select label="Image model" options={MODELS} defaultValue="flare" /><Meta>Icon and description, one disabled</Meta></div>
            <div className="mnd-cell"><Select label="Aspect ratio" options={RATIOS} placeholder="Choose a ratio" /><Meta>Groups, one disabled, a placeholder</Meta></div>
            <div className="mnd-cell"><Select label="Language" options={LANGS} defaultValue="Italiano" /><Meta>Fourteen options: it scrolls and opens on the chosen one</Meta></div>
          </div>
        </Panel>
        <RuleTable keys={[['surface', 'The list'], ['options', 'Options'], ['highlight', 'Highlight']]} />
      </Section>

      <Section title="In a form" desc="With a name the select posts its value like a native one. The error shows in the hint's place, starts with an icon, and is read out when it appears. Press Continue with no ratio chosen.">
        <Panel tone="surface/secondary" pad={24}><FormDemo /></Panel>
      </Section>

      <Section title="When to use" desc="Pick the control by how many options there are and what the choice does.">
        <RuleTable keys={[['when', 'Use it when']]} />
      </Section>

      <Section title="Keyboard and screen readers" desc="Focus stays on the trigger while the list is open; the highlighted option is named with aria-activedescendant.">
        <RuleTable keys={[['keyboard', 'Keyboard'], ['aria', 'Roles and names'], ['states', 'States'], ['motion', 'Motion']]} />
      </Section>

      <Section title="The details" desc={<>Every value the select is made of. <Info info="Source: components/select.json, checked by npm run tokens\nEach value is a --sel-* variable; the list's values are the Menu's --mn-* variables\nPlain numbers are set values, not tokens">How to read this</Info></>}>
        <Table first={300} cols={['Variable', 'Value']} rows={[
          ...SPEC.vars.map((x) => [<Token key="k">--sel-{x.key}</Token>, x.ref
            ? <span key="v" className="d-row" style={{ gap: 'var(--space-8)' }}><Token>{x.ref}</Token>{px(x.ref) != null && <Meta>{px(x.ref)}px</Meta>}</span>
            : x.none ? 'none' : <span key="v">{x.px}px <Meta>set, not a token</Meta></span>]),
          ...Object.entries(SPEC.types).map(([k, cls]) => [`type · ${k}`, <Token key="v">{cls.replaceAll('-', '/')}</Token>]),
        ]} />
      </Section>
    </DocPage>
  );
}
