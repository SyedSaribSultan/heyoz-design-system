import { DocPage, Section, Panel, Token, Table, Info, Meta } from '@/docs/ui';
import { meta } from '@/docs/nav';
import { ToastCard } from '@/components/Toast';
import { TOAST } from '@/components/toast-config';
import c from '@/tokens/components.json';
import t from '@/tokens/tokens.resolved.json';
import { ToastPlayground } from './ToastDemo';
import './page.css';

export const metadata = meta('/components/toast');

// Every number on this page is read from the spec (components/toast.json), the tokens or components/toast-config.js.
const SPEC = c.toast;
const val = (key) => { const x = SPEC.vars.find((v) => v.key === key); return x.px ?? t.numbers.find((n) => n.name === x.ref).px; };
const sec = (ms) => `${ms / 1000} s`;
const MSG = { neutral: 'Link copied', success: 'Clip added to the timeline', warning: 'You are low on credits', critical: 'Export failed', info: 'A new version is ready' };
const NOTE = { neutral: 'Plain confirmation. No icon.', success: 'Something finished.', warning: 'Something needs attention soon.', critical: 'Something failed. Stays until closed.', info: 'Something to know.' };
const ICONS = { neutral: 'none', success: 'circle-check', warning: 'triangle-alert', critical: 'octagon-alert', info: 'info' };
const Spec = ({ label, note, children }) => <div className="tg-spec"><div className="d-stack" style={{ gap: 0 }}><span className="type-label-lg-medium">{label}</span><Meta>{note}</Meta></div>{children}</div>;
const Card = (p) => <ToastCard static {...p} />;

export default function ToastPage() {
  return (
    <DocPage href="/components/toast">
      <Section title="Playground" desc={<>Fire real toasts into the corner of this window. Hover or tab into the stack to stop the timers. Press F8 to move focus to the newest toast. <Info info={`toast('Saved') · toast.success(…) · toast.critical(…)\nOptions: description, action, duration, icon, id, dismissible`}>The call</Info></>}>
        <Panel lit pad={24}><ToastPlayground /></Panel>
      </Section>

      <Section title="Types" desc="Five types. The status shows on the icon only; the card, the border and the text are the same for all five, so a stack never turns into a row of colours. Each type has its own icon shape, so it is not told by colour alone.">
        <div className="tg-specs">
          {TOAST.types.map((ty) => (
            <Spec key={ty} label={ty} note={`${NOTE[ty]} Icon: ${ICONS[ty]}.`}>
              <Card type={ty} message={MSG[ty]} />
            </Spec>
          ))}
        </div>
      </Section>

      <Section title="Content" desc={<>A message, plus any of: a description, one action, the close button. The icon, the first line and the buttons share one centre line ({val('card-row')} tall). Long text wraps; the card grows downward.</>}>
        <div className="tg-specs">
          <Spec label="Message and close" note="the default"><Card type="success" message="Project saved" /></Spec>
          <Spec label="With description" note="body/sm, content/secondary"><Card type="info" message="A new version is ready" description="Reload to get it. Your work is saved." /></Spec>
          <Spec label="With action" note="secondary Button, 2xs; runs, then closes the toast"><Card type="neutral" message="Clip deleted" action={{ label: 'Undo' }} /></Spec>
          <Spec label="Everything" note="description, action and close"><Card type="critical" message="Export failed" description="The file was too large. Try 720p." action={{ label: 'Retry' }} /></Spec>
          <Spec label="Without close" note="dismissible: false, for a toast replaced by id"><Card type="info" message="Uploading 3 of 8" dismissible={false} /></Spec>
          <Spec label="Long message" note="wraps, never truncates"><Card type="warning" message="Your plan allows 5 exports a day. You have used all of them, so the next one waits until tomorrow." /></Spec>
        </div>
      </Section>

      <Section title="Time and stack" desc="A toast goes by itself, unless the person might still need it.">
        <Table first={220} cols={['Rule', 'Value']} rows={[
          [<Token key="a">Auto-dismiss</Token>, <>{sec(TOAST.duration)}. With an action {sec(TOAST.actionDuration)}: an Undo that waits for minutes would undo something other than what the person remembers. Critical stays until closed. Set it with <Token>duration</Token>; Infinity keeps it.</>],
          [<Token key="b">Pause</Token>, 'While the pointer is over the toaster, while focus is inside it, and while the tab is hidden. The time that was left carries on after. Every toast pauses together, so the stack never moves under the pointer.'],
          [<Token key="c">Stack</Token>, `At most ${TOAST.max} visible. The newest sits at the bottom, by the corner; older ones rise by the height above them plus ${val('region-gap')}. A fourth removes the oldest non-critical toast.`],
          [<Token key="d">Same id</Token>, 'Calling toast again with the same id updates that toast in place and restarts its timer, so progress ("Uploading 3 of 8") never piles up.'],
          [<Token key="e">Position</Token>, `Bottom-right, ${val('region-width')} wide, ${val('region-inset')} from the edges. Below 640: full width, ${val('region-inset-narrow')} from the sides and bottom, above the bottom safe area.`],
          [<Token key="f">Motion</Token>, `Enter: fade and rise ${val('region-travel')}px at duration/base. Leave: fade at duration/fast, then the stack closes up. Moves in the stack glide at duration/base. Swipe sideways on touch: past ${TOAST.swipe}px it goes. Reduced motion keeps the fades only.`],
          [<Token key="g">Layer</Token>, 'Above dialogs and the search dialog (z-index 1070), so a toast fired from a dialog is still seen.'],
        ]} />
        <div className="tg-specs tg-narrow">
          <Spec label="Below 640" note="a phone frame: full width, along the bottom">
            <div className="tg-phone"><Card type="success" message="Clip added to the timeline" action={{ label: 'Undo' }} /></div>
          </Spec>
        </div>
      </Section>

      <Section title="Keyboard and screen readers" desc="A toast never takes focus on its own, so it never interrupts typing. It can be reached when the person wants it.">
        <Table first={220} cols={['Input', 'Result']} rows={[
          [<Token key="a">F8</Token>, 'Moves focus into the toaster, onto the newest toast. Timers pause while focus is inside.'],
          [<Token key="b">Tab / Shift + Tab</Token>, 'Through the buttons of each toast, then on to the page. The toaster is outside a dialog, so it stays reachable while one is open.'],
          [<Token key="c">Esc</Token>, 'Closes the focused toast and gives focus back to where it was before F8.'],
          [<Token key="d">Enter / Space</Token>, 'Activates the focused Button: the action, or Dismiss notification.'],
          [<Token key="e">Screen reader</Token>, 'The toaster is a region named Notifications with aria-live polite. Each toast is role status; a critical one is role alert and interrupts.'],
        ]} />
      </Section>

      <Section title="When to use" desc="A toast says what already happened. It asks for nothing.">
        <div className="tg-use">
          <Panel lit pad={24}>
            <h3 className="type-heading-xs-semibold">Use a toast for</h3>
            <ul className="type-body-md-regular">
              <li>A result the person caused: Saved, Link copied, Clip deleted (with Undo).</li>
              <li>A result that arrives later: Export ready, Upload failed.</li>
              <li>One line, or a line and a short description.</li>
            </ul>
          </Panel>
          <Panel lit pad={24}>
            <h3 className="type-heading-xs-semibold">Use something else for</h3>
            <ul className="type-body-md-regular">
              <li>A question or a choice: a dialog.</li>
              <li>An error on a field: text at the field.</li>
              <li>A message that must not be missed and is the only record of it: a banner or a dialog.</li>
              <li>Messages in bursts: group them into one toast.</li>
            </ul>
          </Panel>
        </div>
        <p className="d-desc type-body-md-regular" style={{ marginTop: 'var(--space-12)' }}>Render one <Token>Toaster</Token> in the root layout; call <Token>toast()</Token> from anywhere.</p>
      </Section>

      <Section title="The details" desc={<>Every value the toast is made of. <Info info={`Source: components/toast.json, checked by npm run tokens\nEach value is a --tst-* variable; plain numbers are set values, not tokens\nTimes and counts are in components/toast-config.js (written in the spec rules)`}>How to read this</Info></>}>
        <Table first={300} cols={['Variable', 'Value']} rows={[
          ...SPEC.vars.map((x) => [<Token key="k">--tst-{x.key}</Token>, x.ref ? <Token key="v">{x.ref}</Token> : x.none ? 'none' : `${x.px}px · set`]),
          ...Object.entries(SPEC.types).map(([k, cls]) => [`type · ${k}`, <Token key="v">{cls}</Token>]),
          ['max visible', `${TOAST.max} · set`], ['auto-dismiss', `${TOAST.duration} ms · set`], ['auto-dismiss with action', `${TOAST.actionDuration} ms · set`], ['swipe to dismiss', `${TOAST.swipe}px · set`],
        ]} />
      </Section>
    </DocPage>
  );
}
