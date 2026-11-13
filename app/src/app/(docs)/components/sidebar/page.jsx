import { DocPage, Section, Panel, Token, Table, Info } from '@/docs/ui';
import { meta } from '@/docs/nav';
import c from '@/tokens/components.json';
import t from '@/tokens/tokens.resolved.json';
import { SideNavLive, ItemStates, BrandStates } from '@/docs/SideNavDemo';

const SPEC = c.sidenav;
// A spec value in px: a set number, or the token it points at (components/sidenav.json).
const val = (key) => { const x = SPEC.vars.find((v) => v.key === key); return x.px ?? t.numbers.find((n) => n.name === x.ref).px; };
const OPEN = val('nav-width'), FOLDED = val('nav-width-collapsed');

export const metadata = meta('/components/sidebar');

export default function SidebarPage() {
  return (
    <DocPage href="/components/sidebar">
      <Section title="Open and folded" desc={<>Open ({OPEN}) and folded ({FOLDED}), both live: click a page to go there; the button by the logo folds it, the logo opens it. <Info info={`Expanded ${OPEN}px · collapsed ${FOLDED}px`}>Sizes</Info></>}>
        <div className="sd-stage">
          <div className="sd-states">
            <SideNavLive />
            <SideNavLive startCollapsed />
          </div>
        </div>
      </Section>

      <Section title="Menu items" desc={<>Each menu item: default, hover, and active (the page you are on). <Info info={`${val('item-height')} tall · padding ${val('item-padding-y')} / ${val('item-padding-x')} · gap ${val('item-gap')} · ${val('item-icon')} icon · body/lg\nPointing and current add an inset border and the inner shade`}>The details</Info></>}>
        <Panel tone="surface/primary" pad={24}>
          <div className="sd-row"><ItemStates /></div>
          <div className="sd-row" style={{ marginTop: 'var(--space-24)' }}><ItemStates collapsed /></div>
        </Panel>
      </Section>

      <Section title="Brand picker" desc={<>Where you switch brands. On hover its chevron turns into a double chevron. <Info info={`Tertiary fill and border, inner shade\nFolded: the logo alone, ${val('brand-logo-collapsed')} in a ${val('brand-size-collapsed')} box`}>The details</Info></>}>
        <Panel tone="surface/primary" pad={24}>
          <div className="sd-row"><BrandStates /></div>
          <div className="sd-row" style={{ marginTop: 'var(--space-24)' }}><BrandStates collapsed /></div>
        </Panel>
      </Section>

      <Section title="On this site" desc="The menu on the left of this site is the very same piece, with search added on top. Fold it with the button by the logo, or press Ctrl+B (⌘B on a Mac). Folded, every icon stays on the same line and the names fade, so nothing jumps; opening plays the same move backwards. If the list is taller than the screen it scrolls on its own and never moves the page. On a phone it slides in from the side." />

      <Section title="The details" desc={<>Every value the sidebar is made of. <Info info="Source: components/sidenav.json, checked by npm run tokens\nEach value is a --sn-* variable; plain numbers are set values, not tokens">How to read this</Info></>}>
        <Table first={260} cols={['Variable', 'Value']} rows={[
          ...SPEC.vars.map((x) => [<Token key="k">--sn-{x.key}</Token>, x.ref ? <Token key="v">{x.ref}</Token> : x.none ? 'none' : `${x.px}px · set`]),
          ...Object.entries(SPEC.types).map(([k, cls]) => [`type · ${k}`, <Token key="v">{cls}</Token>]),
        ]} />
      </Section>
    </DocPage>
  );
}
