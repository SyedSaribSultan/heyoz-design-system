import { DocPage, Section, Panel, Token, Meta, Table, Info } from '@/docs/ui';
import { meta } from '@/docs/nav';
import c from '@/tokens/components.json';
import t from '@/tokens/tokens.resolved.json';
import Button from '@/components/Button';
import { TooltipBubble } from '@/components/Tooltip';
import { DELAY, WARM, GRACE } from '@/components/tooltip-timing';
import { Playground, Toolbar, Sides, Disabled } from './TooltipDemo';
import './page.css';

export const metadata = meta('/components/tooltip');

const SPEC = c.tooltip;
// A spec value in px: a set number, or the token it points at (components/tooltip.json).
const val = (key) => { const x = SPEC.vars.find((v) => v.key === key); return x.px ?? t.numbers.find((n) => n.name === x.ref).px; };
const OFFSET = val('bubble-offset'), MAX = val('bubble-max-width'), WIDE = val('bubble-max-width-wide'), MARGIN = val('bubble-margin');

const LONG = 'Shows every frame of the clip at full size, so you can cut it exactly where you want';
const Spec = ({ name, meta: m, children }) => (
  <div className="ttp-spec"><div className="ttp-spec-in">{children}</div><span className="d-stack" style={{ gap: 0 }}><span className="type-label-lg-medium">{name}</span>{m && <Meta>{m}</Meta>}</span></div>
);
// A control with its bubble the way it sits on the page: OFFSET apart, never touching.
const Scene = ({ side }) => (
  <div className="ttp-scene" data-side={side} style={{ gap: OFFSET }}>
    <TooltipBubble content={`Placed ${side}`} />
    <Button type="secondary" size="xs" tabIndex={-1}>{side}</Button>
  </div>
);

export default function TooltipPage() {
  return (
    <DocPage href="/components/tooltip">
      <Section title="Playground" desc="Point at the button, or Tab to it. Change where the tooltip goes, what it says, whether it shows a shortcut and how wide it may grow.">
        <Playground />
      </Section>

      <Section title="Placement" desc={<>Top (default), bottom, left or right of the control, {OFFSET} away. It flips when there is no room and stays {MARGIN} inside the window; fixed to the window, so no scroll container clips it. <Info info={`Offset ${OFFSET}px (space/8)\nKept ${MARGIN}px inside the window (space/8)\nLayer z-index 1090 (set value)\nPosition: fixed in a portal on the document`}>The details</Info></>}>
        <Panel lit pad={24} className="ttp-scenes">
          {['top', 'bottom', 'left', 'right'].map((s) => <Scene key={s} side={s} />)}
        </Panel>
        <p className="d-desc type-body-md-regular ttp-note">Live: point at each button, then scroll the page until one sits under the top edge of the window. It flips to the other side and stays inside the window.</p>
        <Panel lit pad={24}><Sides /></Panel>
      </Section>

      <Section title="Timing" desc={<>A pause of {DELAY} ms opens it. Once one has been open, the next opens at once, so you can sweep a toolbar. <Info info={`Hover delay ${DELAY} ms (DELAY)\nWarm ${WARM} ms after one closes (WARM)\nLeave grace ${GRACE} ms (GRACE)\nSet values in tooltip-timing.js; the delay prop overrides DELAY for one tooltip`}>The numbers</Info></>}>
        <Panel lit pad={24}><Toolbar /></Panel>
        <div className="ttp-times">
          <Table first={200} cols={['Moment', 'When', 'Why']} rows={[
            ['Pointer enters', `${DELAY} ms`, 'A pointer crossing a toolbar shows nothing; a pause feels answered.'],
            ['Pointer enters while warm', 'at once', `Another tooltip is open, or one closed in the last ${WARM} ms.`],
            ['Keyboard focus', 'at once', 'Tab means the user is looking for names; do not make them wait.'],
            ['Pointer leaves', `${GRACE} ms, then fades`, 'Time to cross the gap onto the bubble (WCAG 1.4.13).'],
            ['Esc, blur, press', 'at once', 'The user has seen it, or has moved on.'],
          ]} />
        </div>
      </Section>

      <Section title="Content" desc={<>One short sentence, no full stop. As wide as its text up to {MAX}, then it wraps ({WIDE} for the wide kind). <Info info={`Text label/lg/medium · content/primary\nMax width ${MAX}px, wide ${WIDE}px (set values)\nKeys: label/md/medium on fill/tertiary, 16 tall`}>The details</Info></>}>
        <Panel lit pad={24} className="ttp-specs">
          <Spec name="Label" meta="One short sentence"><TooltipBubble content="Close sidebar" /></Spec>
          <Spec name="With a shortcut" meta="One chip per key"><TooltipBubble content="Close sidebar" shortcut="Ctrl B" /></Spec>
          <Spec name="Three keys"><TooltipBubble content="Redo" shortcut="Ctrl Shift Z" /></Spec>
          <Spec name="Wraps at the max width" meta={`${MAX}px`}><TooltipBubble content={LONG} /></Spec>
          <Spec name="Wide" meta={`${WIDE}px, for details`}><TooltipBubble wide content={LONG + '. Hold Alt to cut every clip at once.'} /></Spec>
          <Spec name="New lines are kept"><TooltipBubble content={'Export video\nMP4, 1080p'} /></Spec>
        </Panel>
      </Section>

      <Section title="Keyboard and touch" desc={<>Never on touch. Keyboard focus opens it at once, so keyboard users get the same names the pointer does. <Info info="Focus opens it only for :focus-visible, so a click or tap never does.">Focus</Info></>}>
        <Table first={220} cols={['Input', 'Result']} rows={[
          ['Tab to the control', 'Opens at once. aria-describedby points at it while it is open.'],
          ['Esc', 'Closes the tooltip, and nothing else. A second Esc reaches the page or the popover around it.'],
          ['Tab away, or blur', 'Closes at once.'],
          ['Pointer over the control', `Opens after ${DELAY} ms (at once when warm). The bubble can be hovered: it stays open while the pointer is on it.`],
          ['Press the control', 'Closes. It returns only after the pointer leaves and comes back.'],
          ['Touch: tap or long press', 'Never opens. Nothing a tooltip says may be the only place to find it.'],
          ['Scroll or resize', 'Follows the control; flips or slides to stay inside the window.'],
        ]} />
        <p className="d-desc type-body-md-regular ttp-note">A disabled control gets no pointer or focus events, so put the tooltip on a focusable wrapper. Hover or Tab to it:</p>
        <Panel lit pad={24}><Disabled /></Panel>
      </Section>

      <Section title="Use it, or not" desc="A tooltip is a label, not a place to put content.">
        <div className="ttp-use">
          <Panel lit pad={24}>
            <h3 className="type-heading-xs-semibold">Use it to</h3>
            <ul className="ttp-list type-body-md-regular">
              <li>Name an icon-only button. The button keeps its own aria-label; pass <code>describe={'{false}'}</code> when the text repeats it.</li>
              <li>Show the keyboard shortcut of a control.</li>
              <li>Add one short fact to a control that has a visible label.</li>
              <li>Explain why a control is unavailable (on a focusable wrapper).</li>
            </ul>
          </Panel>
          <Panel lit pad={24}>
            <h3 className="type-heading-xs-semibold">Do not use it for</h3>
            <ul className="ttp-list type-body-md-regular">
              <li>Anything the user must read or act on: touch never shows it. Use text on the page.</li>
              <li>Links, buttons or forms inside it. That is a Popover.</li>
              <li>A name the control already shows.</li>
              <li>More than one sentence, or more than about 60 characters.</li>
            </ul>
          </Panel>
        </div>
      </Section>

      <Section title="The details" desc={<>Every value the tooltip is made of. <Info info="Source: components/tooltip.json, checked by npm run tokens\nEach value is a --tt-* variable; plain numbers are set values, not tokens">How to read this</Info></>}>
        <Table first={280} cols={['Variable', 'Value']} rows={[
          ...SPEC.vars.map((x) => [<Token key="k">--tt-{x.key}</Token>, x.ref ? <Token key="v">{x.ref}</Token> : x.none ? 'none' : `${x.px}px · set`]),
          ...Object.entries(SPEC.types).map(([k, cls]) => [`type · ${k}`, <Token key="v">{cls}</Token>]),
          ['Inner shade', 'effect · inner-shade (D-021)'],
          ['Hover delay · warm · grace', `${DELAY} ms · ${WARM} ms · ${GRACE} ms (set values)`],
          ['Layer', 'z-index 1090 (set value), above popovers'],
          ['Enter · leave', 'motion-pop: duration/base, easing/enter · fade: duration/fast, easing/exit'],
        ]} />
      </Section>
    </DocPage>
  );
}
