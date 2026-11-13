import { DocPage, Section, Panel, Token, Table, Info, Meta, SpecTable } from '@/docs/ui';
import { meta } from '@/docs/nav';
import { DialogPanel } from '@/components/Dialog';
import c from '@/tokens/components.json';
import t from '@/tokens/tokens.resolved.json';
import { DialogPlayground, AlertDemo } from './DialogDemo';
import './page.css';

export const metadata = meta('/components/dialog');

// Every number on this page is read from the spec (components/dialog.json) or the tokens.
const SPEC = c.dialog, SIZES = ['sm', 'md', 'lg'];
const val = (key) => { const x = SPEC.vars.find((v) => v.key === key); return x.px ?? t.numbers.find((n) => n.name === x.ref).px; };
const W = Object.fromEntries(SIZES.map((s) => [s, val(`panel-width-${s}`)]));
const SHEET = val('sheet-below'), INSET = val('panel-inset');
const SAVE = [{ label: 'Cancel', type: 'ghost' }, { label: 'Save' }];
const LONG = Array.from({ length: 6 }, (_, i) => <p key={i}>Paragraph {i + 1}. Only the body scrolls; the title and the actions stay where they are.</p>);
const Spec = ({ label, note, children }) => <div className="dg-spec"><div className="d-stack" style={{ gap: 0 }}><span className="type-label-lg-medium">{label}</span><Meta>{note}</Meta></div>{children}</div>;

export default function DialogPage() {
  return (
    <DocPage href="/components/dialog">
      <Section title="Playground" desc={<>Open a real dialog and press things: Esc, Tab, a click on the scrim. Change its size and body. The page behind never moves or scrolls. <Info info={`Focus starts in the first field, else the main action\nEsc and a scrim press close it, unless blocking\nFocus returns to the button that opened it`}>What to try</Info></>}>
        <Panel lit pad={24}><DialogPlayground /></Panel>
      </Section>

      <Section title="Sizes" desc={<>Three widths: sm {W.sm}, md {W.md}, lg {W.lg}. The panel is never wider than the window minus {INSET} on each side. Parts: header (title, description, close), body, footer (actions).</>}>
        <div className="dg-specs">
          {SIZES.map((s) => (
            <Spec key={s} label={s} note={`${W[s]}px · panel-width-${s}`}>
              <DialogPanel fit size={s} title="Rename project" description="Names show in the project list and in every export." actions={SAVE}>
                <p>Pick a name people on your team will recognise.</p>
              </DialogPanel>
            </Spec>
          ))}
          <Spec label="No description" note="title, body, actions">
            <DialogPanel fit size="sm" title="Add a caption" actions={SAVE}><p>Captions follow the speech and can be edited later.</p></DialogPanel>
          </Spec>
          <Spec label="Note on the left" note="footerStart: a note or a checkbox">
            <DialogPanel fit size="md" title="Export video" description="The export uses 12 credits." actions={[{ label: 'Cancel', type: 'ghost' }, { label: 'Export' }]} footerStart="Takes about a minute.">
              <p>1080 × 1920, MP4.</p>
            </DialogPanel>
          </Spec>
        </div>
      </Section>

      <Section title="Alert dialog" desc={<>One question, answered by confirm or cancel. It has no close button and a scrim press does not close it; Esc cancels. When the confirm cannot be undone, focus starts on Cancel and the confirm is a critical Button. <Info info={`role alertdialog, ${W.sm} wide\nThe description is required: it is the question\nCritical: secondary Button, label and icon content/critical`}>The details</Info></>}>
        <div className="dg-specs dg-two">
          <Spec label="Confirm" note="focus starts on the confirm">
            <DialogPanel fit size="sm" role="alertdialog" closable={false} title="Leave without saving?" description="Your changes to this clip are not saved yet."
              actions={[{ label: 'Stay', type: 'ghost' }, { label: 'Leave', primary: true }]} />
          </Spec>
          <Spec label="Destructive" note="focus starts on Cancel">
            <DialogPanel fit size="sm" role="alertdialog" closable={false} title="Delete “Summer launch”?" description="Its 14 clips and 3 exports are deleted too."
              actions={[{ label: 'Cancel', type: 'ghost' }, { label: 'Delete project', tone: 'critical', primary: true }]} />
          </Spec>
        </div>
        <Panel lit pad={24} className="dg-live"><AlertDemo /></Panel>
      </Section>

      <Section title="Bottom sheet" desc={<>Below {SHEET} the panel is a sheet: full width, on the bottom edge, top corners rounded, up to 85% of the window high. The actions share one row, at least 44 tall, and clear the bottom safe area. It rises at duration/slow and leaves with a fade. The frames below are 360 wide, so they behave like a phone. Resize the window to see the real one.</>}>
        <div className="dg-specs dg-two">
          <Spec label="Dialog" note="size is ignored: full width">
            <DialogPanel frame={{ width: 360, height: 420 }} size="md" title="Rename project" description="Names show in the project list and in every export." actions={SAVE}>
              <p>Pick a name people on your team will recognise.</p>
            </DialogPanel>
          </Spec>
          <Spec label="Alert dialog" note="two actions, equal width">
            <DialogPanel frame={{ width: 360, height: 420 }} size="sm" role="alertdialog" closable={false} title="Delete “Summer launch”?" description="Its 14 clips and 3 exports are deleted too."
              actions={[{ label: 'Cancel', type: 'ghost' }, { label: 'Delete', tone: 'critical', primary: true }]} />
          </Spec>
        </div>
      </Section>

      <Section title="Scrolling" desc={<>Only the body scrolls, and it keeps {val('body-padding-x')}px at the sides and {val('body-padding-y')}px above and below so focus rings are never cut. Pop-ups show no scroll bar: a blurred fade ({val('fade-height')}px) shows on the top edge once the body is scrolled and on the bottom edge while more is below. The page behind is locked, without shifting sideways.</>}>
        <div className="dg-specs dg-two">
          <Spec label="More below" note="at the top of the body">
            <DialogPanel fit size="sm" frame={{ height: 380 }} fade="bottom" title="Terms" description="Read to the end to accept." actions={SAVE}>{LONG}</DialogPanel>
          </Spec>
          <Spec label="More above and below" note="scrolled to the middle">
            <DialogPanel fit size="sm" frame={{ height: 380 }} fade="both" title="Terms" description="Read to the end to accept." actions={SAVE}>{LONG}</DialogPanel>
          </Spec>
        </div>
      </Section>

      <Section title="Keyboard and focus" desc="Everything works without a mouse. Focus never leaves the panel while it is open.">
        <Table first={220} cols={['Input', 'Result']} rows={[
          [<Token key="a">Open</Token>, 'Focus moves in: the first field, else the main action (Cancel in a destructive alert), else the panel. Never the close button.'],
          [<Token key="b">Tab / Shift + Tab</Token>, 'Next / previous control inside the panel. It wraps from the last to the first. Focus pulled out by a click or a script comes back.'],
          [<Token key="c">Esc</Token>, 'Closes. Not when the dialog is blocking, or when a layer inside it (select, menu) already used the key.'],
          [<Token key="d">Enter / Space</Token>, 'Activates the focused Button. Nothing else is bound, so a field keeps its Enter.'],
          [<Token key="e">Press on the scrim</Token>, 'Closes, unless blocking, scrimClose is off, or it is an alert dialog. A press inside that ends on the scrim does not.'],
          [<Token key="f">Close</Token>, 'Focus returns to the element that opened it, or to the returnFocus ref. Stacked dialogs: only the top one answers.'],
          [<Token key="g">Screen reader</Token>, 'role dialog or alertdialog, aria-modal, labelled by the title, described by the description. The close button is named Close.'],
        ]} />
      </Section>

      <Section title="When to use" desc="A dialog stops everything, so it must be worth it.">
        <div className="dg-use">
          <Panel lit pad={24}>
            <h3 className="type-heading-xs-semibold">Use a dialog for</h3>
            <ul className="type-body-md-regular">
              <li>A short form that must be finished or cancelled: rename, invite, export settings.</li>
              <li>A confirm before something hard to undo.</li>
              <li>A choice that changes what happens next, with one clear main action.</li>
            </ul>
          </Panel>
          <Panel lit pad={24}>
            <h3 className="type-heading-xs-semibold">Use something else for</h3>
            <ul className="type-body-md-regular">
              <li>Something that happened and needs no answer: a toast.</li>
              <li>Help on one control: a tooltip or popover.</li>
              <li>A pick from a list: a menu or select.</li>
              <li>Work the person may need to see the page for: a panel in the page.</li>
            </ul>
          </Panel>
        </div>
        <p className="d-desc type-body-md-regular" style={{ marginTop: 'var(--space-12)' }}>At most one brand Button per dialog (D-026). Order: the safe action first, the main action last. Cancel is ghost.</p>
      </Section>

      <Section title="The details" desc={<>Every value the dialog is made of. <Info info="Source: components/dialog.json, checked by npm run tokens\nEach value is a --dlg-* variable; plain numbers are set values, not tokens\nThe scrim strength (72%) and the effects are set values in dialog.css (D-021)">How to read this</Info></>}>
        <SpecTable spec={SPEC} prefix="dlg" />
      </Section>
    </DocPage>
  );
}
