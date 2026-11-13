import { DocPage, Section, Panel, Token, Meta, Table, Info } from '@/docs/ui';
import { meta } from '@/docs/nav';
import c from '@/tokens/components.json';
import t from '@/tokens/tokens.resolved.json';
import Button from '@/components/Button';
import { PopoverPanel } from '@/components/Popover';
import { Playground, Sides, Clipped, Nested } from './PopoverDemo';
import './page.css';

export const metadata = meta('/components/popover');

const SPEC = c.popover;
// A spec value in px: a set number, or the token it points at (components/popover.json).
const val = (key) => { const x = SPEC.vars.find((v) => v.key === key); return x.px ?? t.numbers.find((n) => n.name === x.ref).px; };
const SM = val('panel-width-sm'), MD = val('panel-width-md'), LG = val('panel-width-lg'), PAD = val('panel-padding'), GAP = val('panel-gap'), OFFSET = val('panel-offset'), MARGIN = val('panel-margin');

const BODY = <p className="pp-text">Your video renders in the background. You can close this and keep editing.</p>;
const ACTIONS = <><Button type="ghost" size="xs" tabIndex={-1}>Cancel</Button><Button type="primary" size="xs" tabIndex={-1}>Export video</Button></>;
const Spec = ({ name, meta: m, children }) => (
  <div className="pp-spec"><div className="pp-spec-in">{children}</div><span className="d-stack" style={{ gap: 0 }}><span className="type-label-lg-medium">{name}</span>{m && <Meta>{m}</Meta>}</span></div>
);

export default function PopoverPage() {
  return (
    <DocPage href="/components/popover">
      <Section title="Playground" desc="Click the button, or Tab to it and press Enter. Change the size, the side it opens on, how it lines up with the button and which parts it has.">
        <Playground />
      </Section>

      <Section title="Sizes" desc={<>Three fixed widths: sm {SM}, md {MD} (default), lg {LG}. The width never changes with where it opens; the height follows the content. <Info info={`Widths ${SM} / ${MD} / ${LG} are set values\nNever wider than the window minus ${MARGIN} each side\nTaller than the window minus ${2 * MARGIN}: the body scrolls, header and footer stay`}>The details</Info></>}>
        <Panel tone="surface/primary" pad={24} className="pp-specs">
          <Spec name="sm" meta={`${SM}px`}><PopoverPanel size="sm" title="Rename" footer={<Button type="primary" size="xs" tabIndex={-1}>Save</Button>}>{BODY}</PopoverPanel></Spec>
          <Spec name="md" meta={`${MD}px · default`}><PopoverPanel size="md" title="Export" footer={ACTIONS}>{BODY}</PopoverPanel></Spec>
          <Spec name="lg" meta={`${LG}px`}><PopoverPanel size="lg" title="Export" footer={ACTIONS}>{BODY}</PopoverPanel></Spec>
        </Panel>
      </Section>

      <Section title="Parts" desc={<>Header, body and footer, each optional. Padding {PAD}, {GAP} between parts, no dividers: space tells them apart. <Info info={`Surface surface/tertiary, border/tertiary, radius/xl\nInner shade and drop shadow (effects, D-021)\nHeader: heading/xs/semibold + a ghost 2xs close Button\nBody: body/md/regular, content/secondary\nFooter: right-aligned, 8 apart`}>The details</Info></>}>
        <Panel tone="surface/primary" pad={24} className="pp-specs">
          <Spec name="Header, body and footer" meta="The full form"><PopoverPanel size="sm" title="Export" footer={ACTIONS}>{BODY}</PopoverPanel></Spec>
          <Spec name="Header and body" meta="Information, closed by its button"><PopoverPanel size="sm" title="Rendering">{BODY}</PopoverPanel></Spec>
          <Spec name="Body only" meta="Needs a label for screen readers"><PopoverPanel size="sm">{BODY}</PopoverPanel></Spec>
        </Panel>
      </Section>

      <Section title="Placement" desc={<>Bottom (default), top, left or right of the trigger, {OFFSET} away, lined up at its start, centre or end. It flips when there is no room and stays {MARGIN} inside the window. It is fixed to the window, so a box that clips its content cannot cut it. <Info info={`Offset ${OFFSET}px (space/8) · kept ${MARGIN}px inside the window (space/8)\nLayer z-index 1080 (set value), below tooltips at 1090\nIt follows the trigger while the page scrolls`}>The details</Info></>}>
        <Panel tone="surface/primary" pad={24}><Sides /></Panel>
        <p className="d-desc type-body-md-regular pp-note">The box below clips everything that is painted outside it.</p>
        <Panel tone="surface/primary" pad={24}><Clipped /></Panel>
      </Section>

      <Section title="Focus and keyboard" desc="A popover does not block the page, so it never traps focus. It starts where the user is: a keyboard user lands inside, a pointer user stays on the trigger.">
        <Table first={260} cols={['Input', 'Result']} rows={[
          ['Enter or Space on the trigger', 'Opens. Focus moves into the popover: the element marked data-autofocus, else the first control in the body or footer, else the panel.'],
          ['Click on the trigger', 'Opens. Focus stays on the trigger; Tab goes into the popover. Click again to close.'],
          ['Tab at the end', 'Leaves for whatever follows the trigger in the page, and the popover closes.'],
          ['Shift+Tab at the start', 'Goes back to the trigger.'],
          ['Esc', 'Closes the newest popover and returns focus to its trigger. A tooltip open on a control inside closes first.'],
          ['Close button, or an action calling close()', 'Closes and returns focus to the trigger.'],
          ['A press or focus outside', 'Closes. Focus stays where the user put it.'],
        ]} />
        <p className="d-desc type-body-md-regular pp-note">Nested popovers close from the inside out. A press inside the inner one is not outside the outer one.</p>
        <Panel tone="surface/primary" pad={24}><Nested /></Panel>
      </Section>

      <Section title="Use it, or not" desc="A popover holds one small task that belongs to one control.">
        <div className="pp-use">
          <Panel lit pad={24}>
            <h3 className="type-heading-xs-semibold">Use it for</h3>
            <ul className="pp-list type-body-md-regular">
              <li>Settings for one control: export options, a colour, a size.</li>
              <li>A detail that is too long for a Tooltip, or that holds controls.</li>
              <li>A small form with one main action and a way out.</li>
            </ul>
          </Panel>
          <Panel lit pad={24}>
            <h3 className="type-heading-xs-semibold">Do not use it for</h3>
            <ul className="pp-list type-body-md-regular">
              <li>A list of commands: that is a Menu.</li>
              <li>A one-line name or hint: that is a Tooltip.</li>
              <li>A question the user must answer before going on: that is a Dialog.</li>
              <li>Content that needs a lot of scrolling: that is a page or a sheet.</li>
            </ul>
          </Panel>
        </div>
      </Section>

      <Section title="The details" desc={<>Every value the popover is made of. <Info info="Source: components/popover.json, checked by npm run tokens\nEach value is a --pop-* variable; plain numbers are set values, not tokens">How to read this</Info></>}>
        <Table first={280} cols={['Variable', 'Value']} rows={[
          ...SPEC.vars.map((x) => [<Token key="k">--pop-{x.key}</Token>, x.ref ? <Token key="v">{x.ref}</Token> : x.none ? 'none' : `${x.px}px · set`]),
          ...Object.entries(SPEC.types).map(([k, cls]) => [`type · ${k}`, <Token key="v">{cls}</Token>]),
          ['Effects', 'effect · inner-shade, effect · drop-md (D-021)'],
          ['Close button', 'Button ghost, 2xs, icon x, label Close'],
          ['Layer', 'z-index 1080 (set value), below tooltips'],
          ['Enter · leave', 'motion-pop: duration/base, easing/enter · fade: duration/fast, easing/exit'],
        ]} />
      </Section>
    </DocPage>
  );
}
