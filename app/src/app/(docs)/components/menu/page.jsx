import { DocPage, Section, Panel, Token, Table, Meta, Info, SpecTable, RuleTable, specOf } from '@/docs/ui';
import { meta } from '@/docs/nav';
import c from '@/tokens/components.json';
import { MenuPanel } from '@/components/Menu';
import { MenuPlayground, LongMenu, EdgeMenu, SubmenuDemo } from './MenuDemos';

export const metadata = meta('/components/menu');
const SPEC = c.menu; // the spec, read here: a client module's exports are not values on the server
// A spec value in px: a set number, or the token it points at.
const { px: val, ref } = specOf(SPEC);
const rule = (k) => SPEC.rules[k];

const SHARE = [{ label: 'Copy link', icon: 'link' }, { label: 'Email…', icon: 'mail' }, { label: 'Invite people', disabled: true, description: 'Needs the Team plan' }];
const KINDS = [
  { group: 'Actions', items: [
    { label: 'Rename', icon: 'pencil', shortcut: 'F2' },
    { label: 'Duplicate', icon: 'copy', description: 'Makes a copy in this folder' },
    { label: 'Archive', icon: 'archive', disabled: true },
  ] },
  { group: 'Check marks', items: [
    { label: 'Show grid', kind: 'checkbox', checked: true },
    { label: 'Show rulers', kind: 'checkbox' },
    { label: 'Comfortable', kind: 'radio', checked: true },
    { label: 'Compact', kind: 'radio' },
  ] },
  { type: 'separator' },
  { label: 'Share', icon: 'share-2', items: SHARE },
  { label: 'Delete', icon: 'trash', danger: true },
];
const PAIR = [{ label: 'Rename', icon: 'pencil' }, { label: 'Duplicate', icon: 'copy' }];
const STATES = [
  ['Rest', 'No item is reached, so no indicator shows.', PAIR, undefined, undefined],
  ['Hover', `Indicator: ${ref('item-hover-fill')}, border ${ref('item-hover-border')}.`, PAIR, 'Rename', 'hover'],
  ['Pressed', `One step stronger: ${ref('item-pressed-fill')}, border ${ref('item-pressed-border')}.`, PAIR, 'Rename', 'pressed'],
  ['Keyboard', `The same look with an inset ${ref('item-focus-ring')} ring, stroke/${val('item-focus-width')}.`, PAIR, 'Rename', 'focus'],
  ['Disabled', 'Dimmed, never highlighted, never runs.', [{ label: 'Archive', icon: 'archive', disabled: true }, ...PAIR.slice(1)], 'Duplicate', 'hover'],
  ['Danger', 'Critical text and icon, the same highlight.', [{ label: 'Delete', icon: 'trash', danger: true }, ...PAIR.slice(1)], 'Delete', 'hover'],
];
const KEYS = [
  ['Enter, Space, ArrowDown', 'On the trigger: open and focus the first item.'],
  ['ArrowUp', 'On the trigger: open and focus the last item.'],
  ['ArrowDown, ArrowUp', 'Move to the next or previous item. Wraps. Skips disabled items.'],
  ['Home, End', 'First or last item.'],
  ['A letter', 'Next item whose label starts with what you typed. The typed text resets after 500 ms.'],
  ['Enter, Space', 'Run the item. On a submenu item: open it.'],
  ['ArrowRight', 'Open the submenu of the focused item and focus its first item.'],
  ['ArrowLeft', 'In a submenu: close it and return to its parent item.'],
  ['Esc', 'Close the submenu, or the menu. Focus returns to the trigger.'],
  ['Tab', 'Close the menu and move on from the trigger.'],
];

export default function MenuPage() {
  return (
    <DocPage href="/components/menu">
      <Section title="Playground" desc="A live menu. Open it with a click, or press Enter, Space or ArrowDown on the button. Point at items, or use the arrow keys: one highlight slides between them. Check marks stay open; Share opens a submenu.">
        <MenuPlayground />
      </Section>

      <Section title="Item kinds" desc={<>Four kinds of item, plus labels and separators. Every item is {val('item-height')} tall with a {val('item-icon')} icon; the surface is a floating card ({ref('surface-background')}, {ref('surface-border')}, {ref('surface-radius')}) with Home&apos;s sheen. <Info info={`Action, checkbox, radio, submenu\nGroup label: label/sm/medium, content/tertiary\nSeparator: ${ref('separator-background')}, stroke/1\nCheckable items keep a ${val('item-icon')} mark slot, so labels line up`}>The details</Info></>}>
        <Panel tone="surface/primary" pad={24}>
          <div className="mnd-row">
            <MenuPanel items={KINDS} active="Duplicate" width={280} />
            <div className="d-stack" style={{ maxWidth: 420 }}>
              <p className="type-body-md-regular">{rule('items')}</p>
              <p className="type-body-md-regular">{rule('groups')}</p>
              <p className="type-body-md-regular">{rule('danger')}</p>
            </div>
          </div>
        </Panel>
      </Section>

      <Section title="States" desc="Items have one look at rest. The highlight is a single indicator behind the items, so hover, pressed and keyboard are the same shape in three strengths. Nothing moves: its border is inset.">
        <Panel tone="surface/primary" pad={24}>
          <div className="mnd-grid">
            {STATES.map(([name, note, items, active, force]) => (
              <div className="mnd-cell" key={name}>
                <MenuPanel items={items} active={active} force={force} />
                <div className="d-stack" style={{ gap: 0 }}><span className="type-label-lg-medium">{name}</span><Meta>{note}</Meta></div>
              </div>
            ))}
          </div>
        </Panel>
        <RuleTable spec={SPEC} keys={[['highlight', 'The indicator'], ['disabled', 'Disabled'], ['motion', 'Motion'], ['sheen', 'Sheen'], ['light', 'Light']]} />
      </Section>

      <Section title="Submenu" desc="One level. It opens beside its parent item after a short hover, or with a click, Enter, Space or ArrowRight, and closes with ArrowLeft or Esc. Open this one and go to Export as or Share.">
        <Panel tone="surface/primary" pad={24}>
          <SubmenuDemo />
        </Panel>
        <RuleTable spec={SPEC} keys={[['submenu', 'Submenu']]} />
      </Section>

      <Section title="Placement and long lists" desc={<>Below the trigger, {val('surface-offset')}px away, and inside the window ({val('surface-viewport-margin')}px from every edge). It flips above when below is too short, and lines up on the end edge when asked. Past {val('surface-max-height')}px it scrolls inside. <Info info={`Width ${val('surface-min-width')} to ${val('surface-max-width')}\nOne scrollbar (D-037), stroke/${val('surface-scroll-room')} of clip room\nOverscroll stays inside the menu`}>The details</Info></>}>
        <Panel tone="surface/primary" pad={24}>
          <div className="mnd-row">
            <div className="mnd-cell"><LongMenu /><Meta>24 items: the list scrolls inside the menu</Meta></div>
            <div className="mnd-cell" style={{ flex: 1, minWidth: 240 }}><div className="mnd-end"><EdgeMenu items={KINDS.slice(0, 1)} /></div><Meta>Align end: the right edges line up</Meta></div>
          </div>
        </Panel>
        <RuleTable spec={SPEC} keys={[['placement', 'Placement'], ['scroll', 'Scroll']]} />
      </Section>

      <Section title="When to use" desc="A menu is for actions and settings behind one trigger.">
        <RuleTable spec={SPEC} keys={[['use', 'Use it when'], ['trigger', 'Trigger'], ['tier', 'Surface tier']]} />
      </Section>

      <Section title="Keyboard and screen readers" desc="Focus moves onto each item (roving), so screen readers read it. The trigger names the menu.">
        <Table first={220} cols={['Key', 'Does']} rows={KEYS.map(([k, d]) => [<Token key="k">{k}</Token>, d])} />
        <RuleTable spec={SPEC} keys={[['pointer', 'Pointer'], ['aria', 'Roles and names']]} />
      </Section>

      <Section title="The details" desc={<>Every value the menu is made of. <Info info="Source: components/menu.json, checked by npm run tokens\nEach value is a --mn-* variable; plain numbers are set values, not tokens">How to read this</Info></>}>
        <SpecTable spec={SPEC} prefix="mn" />
      </Section>
    </DocPage>
  );
}
