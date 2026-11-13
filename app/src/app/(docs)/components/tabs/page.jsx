import Link from 'next/link';
import Tabs from '@/components/Tabs';
import { DocPage, Section, Panel, Token, Meta, Table, Info } from '@/docs/ui';
import { meta } from '@/docs/nav';
import c from '@/tokens/components.json';
import t from '@/tokens/tokens.resolved.json';
import { lucide } from '@/lib/Lucide';
import { Playground, Overflow, Panel1 } from './TabsDemos';
import './page.css';

export const metadata = meta('/components/tabs');

const SPEC = c.tabs, R = SPEC.rules;
// A spec value in px: a set number, or the token it points at (components/tabs.json).
const val = (key) => { const x = SPEC.vars.find((v) => v.key === key); return x.px ?? t.numbers.find((n) => n.name === x.ref).px; };
const H = { md: val('tab-md-height'), sm: val('tab-sm-height') }, PX = { md: val('tab-md-padding-x'), sm: val('tab-sm-padding-x') };

const tab = (value, label, extra = {}) => ({ value, label, ...extra, panel: <Panel1>{label}: the panel for this tab.</Panel1> });
const PLAIN = [tab('assets', 'Assets'), tab('brand', 'Brand'), tab('members', 'Members'), tab('billing', 'Billing')];
const FULL = [tab('assets', 'Assets', { icon: lucide('image'), count: 12 }), tab('brand', 'Brand', { icon: lucide('palette') }), tab('members', 'Members', { icon: lucide('users'), count: 4 }), tab('billing', 'Billing', { icon: lucide('credit-card'), off: true })];
const forced = (state, at = 1) => PLAIN.map((p, i) => (i === at ? { ...p, state } : p));

const Row = ({ name, meta: m, children }) => (
  <div className="tb-row">
    <span className="d-stack" style={{ gap: 0 }}><span className="type-label-lg-medium">{name}</span>{m && <Meta>{m}</Meta>}</span>
    <div className="tb-cell">{children}</div>
  </div>
);

export default function TabsPage() {
  return (
    <DocPage href="/components/tabs">
      <Section title="Playground" desc="Pick a size, how tabs activate, icons, counts and how many tabs there are. Click a tab, or Tab to the list and use the arrow keys.">
        <Playground />
      </Section>

      <Section title="The look" desc={<>{R.look} <Info info={R.panel}>The panel</Info></>}>
        <Panel lit pad={24}>
          <Tabs label="Project" items={FULL.map((f) => ({ ...f, off: false }))} />
        </Panel>
      </Section>

      <Section title="States" desc={<>{R.tab} {R.hover}</>}>
        <Panel lit pad={8} className="tb-matrix">
          <Row name="Rest" meta="Selected, others quiet"><Tabs label="Rest" items={PLAIN.map(({ panel, ...p }) => p)} defaultValue="assets" /></Row>
          <Row name="Hover" meta="Rule under the tab"><Tabs label="Hover" items={forced('hover').map(({ panel, ...p }) => p)} defaultValue="assets" /></Row>
          <Row name="Pressed" meta="One step stronger"><Tabs label="Pressed" items={forced('active').map(({ panel, ...p }) => p)} defaultValue="assets" /></Row>
          <Row name="Hover, selected" meta="Underline unchanged"><Tabs label="Hover, selected" items={forced('hover', 0).map(({ panel, ...p }) => p)} defaultValue="assets" /></Row>
          <Row name="Disabled" meta="Dimmed, out of the keys"><Tabs label="Disabled" items={PLAIN.map(({ panel, ...p }, i) => (i === 2 ? { ...p, off: true } : p))} defaultValue="assets" /></Row>
        </Panel>
      </Section>

      <Section title="Sizes" desc={<>{R.sizes} <Info info={`md ${H.md} tall, padding x ${PX.md}\nsm ${H.sm} tall, padding x ${PX.sm}`}>The details</Info></>}>
        <Panel lit pad={8} className="tb-matrix">
          <Row name="md" meta={`${H.md} tall`}><Tabs label="Size md" items={PLAIN.map(({ panel, ...p }) => p)} defaultValue="brand" /></Row>
          <Row name="sm" meta={`${H.sm} tall`}><Tabs label="Size sm" size="sm" items={PLAIN.map(({ panel, ...p }) => p)} defaultValue="brand" /></Row>
        </Panel>
      </Section>

      <Section title="Icons and counts" desc={<>{R.count} Icons are 16 and come from Lucide.</>}>
        <Panel lit pad={8} className="tb-matrix">
          <Row name="Icons"><Tabs label="Icons" items={FULL.map(({ panel, count, off, ...p }) => p)} defaultValue="brand" /></Row>
          <Row name="Counts"><Tabs label="Counts" items={PLAIN.map(({ panel, ...p }, i) => ({ ...p, count: [12, null, 4, '99+'][i] }))} defaultValue="assets" /></Row>
          <Row name="Both, one disabled"><Tabs label="Icons and counts" items={FULL.map(({ panel, ...p }) => p)} defaultValue="assets" /></Row>
        </Panel>
      </Section>

      <Section title="Activation" desc={R.activation}>
        <Panel lit pad={24} className="tb-two">
          <div className="d-stack">
            <Meta>Automatic · arrows move and select</Meta>
            <Tabs label="Automatic" items={PLAIN} defaultValue="assets" />
          </div>
          <div className="d-stack">
            <Meta>Manual · arrows move focus, Enter or Space select</Meta>
            <Tabs label="Manual" activation="manual" items={PLAIN} defaultValue="assets" />
          </div>
        </Panel>
      </Section>

      <Section title="Overflow" desc={R.overflow}>
        <Panel lit pad={24}><Overflow /></Panel>
      </Section>

      <Section title="Tabs or Segmented" desc={R.use}>
        <Table first={140} cols={['', 'Use it for', 'Not for']} rows={[
          [<Token key="a">Tabs</Token>, 'Views of content, each with its own panel: settings pages, the lists of a project. The choice changes what the page shows.', 'A setting. A choice with no panel behind it. More than 7 tabs.'],
          [<Link key="b" href="/components/segmented"><Token>Segmented</Token></Link>, 'A value: speed, alignment, resolution. The choice changes how one thing looks or works.', 'Switching between pages or lists of content.'],
          [<Link key="c" href="/components/menu"><Token>Menu</Token></Link>, 'Actions and many destinations.', 'Showing which view is open.'],
        ]} />
      </Section>

      <Section title="Keyboard and roles" desc={R.keyboard}>
        <Table first={200} cols={['Key', 'Does']} rows={[
          ['Tab', 'Enters the list on the selected tab. The next Tab goes to the panel.'],
          ['Left', 'Focuses the previous tab. Wraps from the first to the last. Automatic activation also selects it.'],
          ['Right', 'Focuses the next tab. Wraps from the last to the first. Automatic activation also selects it.'],
          ['Home, End', 'The first or the last enabled tab.'],
          ['Space, Enter', 'Selects the focused tab (manual activation).'],
        ]} />
        <p className="d-desc type-body-md-regular" style={{ marginTop: 'var(--space-12)' }}>{R.focus} {R.disabled}</p>
      </Section>

      <Section title="The details" desc={<>Every value the tabs are made of. <Info info="Source: components/tabs.json, checked by npm run tokens\nEach value is a --tab-* variable; plain numbers are set values, not tokens">How to read this</Info></>}>
        <Table first={300} cols={['Variable', 'Value']} rows={[
          ...SPEC.vars.map((x) => [<Token key="k">--tab-{x.key}</Token>, x.ref ? <Token key="v">{x.ref}</Token> : x.none ? 'none' : `${x.px}px · set`]),
          ...Object.entries(SPEC.types).map(([k, cls]) => [`type · ${k}`, <Token key="v">{cls}</Token>]),
        ]} />
        <p className="d-desc type-body-md-regular" style={{ marginTop: 'var(--space-12)' }}>{R.motion}</p>
      </Section>
    </DocPage>
  );
}
