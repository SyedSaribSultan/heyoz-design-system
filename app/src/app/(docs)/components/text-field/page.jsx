import { TextField, TextArea } from '@/components/TextField';
import { DocPage, Section, Panel, Token, Meta, Table, Info, specOf } from '@/docs/ui';
import { meta } from '@/docs/nav';
import c from '@/tokens/components.json';
import TextFieldDemo from './TextFieldDemo';
import './page.css';

export const metadata = meta('/components/text-field');

// Spec values (components/textfield.json): px resolves a set number or the token it points at.
const { px, ref } = specOf(c.textfield);
const cell = (val, tok) => <div className="d-stack" style={{ gap: 0 }}><span>{val}</span><Meta>{tok}</Meta></div>;
const Cell = ({ name, meta: m, children }) => (
  <div className="tfd-cell"><div className="tfd-cap"><span className="type-label-lg-medium">{name}</span>{m && <Meta>{m}</Meta>}</div>{children}</div>
);
const B = ({ children }) => <Panel tone="surface/secondary" pad={24}>{children}</Panel>;
const R = c.textfield.rules;
// Not imported from the component: that file is a client module, so its non-component exports are not values here.
const SIZE_NAMES = ['xs', 'sm', 'md'];
const NAME = 'Summer launch';
const room = (s) => (px(`${s}-height`) - px(`${s}-action`)) / 2;

export default function TextFieldPage() {
  return (
    <DocPage href="/components/text-field">
      <Section title="Playground" desc="Build a field yourself: pick the kind, size and state, then what it shows. Type in it, tab through it, clear it. Everything on this page is the same component.">
        <TextFieldDemo />
      </Section>

      <Section title="Sizes" desc={<>Three sizes on <Token>size/control</Token>: xs {px('xs-height')} (the everyday size), sm {px('sm-height')}, md {px('md-height')}. Radius is the squircle, height × 0.375 to the nearest 4: {px('xs-radius')}, {px('sm-radius')}, {px('md-radius')}. Padding x matches Button: {px('xs-padding-x')}, {px('sm-padding-x')}, {px('md-padding-x')}.</>}>
        <B>
          <div className="tfd-grid">
            {SIZE_NAMES.map((s) => (
              <Cell key={s} name={s} meta={`size/control/${s} · ${px(`${s}-height`)}`}>
                <TextField size={s} aria-label={`Size ${s}`} placeholder="Search projects" icon="search" clearable defaultValue={s === 'sm' ? 'Summer' : ''} />
              </Cell>
            ))}
          </div>
        </B>
      </Section>

      <Section title="States" desc={<>A field is a well: darker than the surface it sits on (<Token>fill/primary</Token>), with the inner shade. Pointing at it lifts fill and border one step. Focus turns the border <Token>border/primary-active</Token> with no ring, so nothing moves. Read-only does not react to the pointer.</>}>
        <B>
          <div className="tfd-grid">
            <Cell name="Rest, empty" meta="placeholder content/tertiary"><TextField aria-label="Rest, empty" placeholder={NAME} /></Cell>
            <Cell name="Rest, filled" meta="content/primary"><TextField aria-label="Rest, filled" defaultValue={NAME} /></Cell>
            <Cell name="Hover" meta="fill/primary-hover · border/primary-hover"><TextField aria-label="Hover" defaultValue={NAME} state="hover" /></Cell>
            <Cell name="Focus" meta="border/primary-active, no ring"><TextField aria-label="Focus" defaultValue={NAME} state="focus" /></Cell>
            <Cell name="Invalid" meta="border/critical"><TextField aria-label="Invalid" defaultValue={NAME} invalid /></Cell>
            <Cell name="Invalid, focus" meta="border/critical-active"><TextField aria-label="Invalid, focus" defaultValue={NAME} invalid state="focus" /></Cell>
            <Cell name="Disabled" meta="fill/primary-disabled · not focusable"><TextField aria-label="Disabled" defaultValue={NAME} disabled /></Cell>
            <Cell name="Read-only" meta="rest look · no hover · focusable"><TextField aria-label="Read-only" defaultValue={NAME} readOnly /></Cell>
          </div>
        </B>
      </Section>

      <Section title="Label, hint and error" desc={<>The label sits {px('label-gap')} above the control, in <Token>label/md/medium</Token>. Hint and error sit {px('message-gap')} below it, in <Token>body/sm/regular</Token>. An error takes the hint's place, with an alert icon, so colour is not the only signal. A count shows on the right when there is a max length. <Info info={`${R.label}\n${R.message}\n${R.count}`}>The rules</Info></>}>
        <B>
          <div className="tfd-grid" data-wide>
            <Cell name="Label"><TextField label="Project name" placeholder={NAME} /></Cell>
            <Cell name="Optional"><TextField label="Project name" optional placeholder={NAME} /></Cell>
            <Cell name="Hint"><TextField label="Project name" hint="Shown on your brand page." placeholder={NAME} /></Cell>
            <Cell name="Error"><TextField label="Project name" error="That name is already taken." defaultValue={NAME} /></Cell>
            <Cell name="Count"><TextField label="Project name" hint="Shown on your brand page." maxLength={20} showCount defaultValue={NAME} /></Cell>
            <Cell name="Count at the limit"><TextField label="Project name" hint="Shown on your brand page." maxLength={13} showCount defaultValue={NAME} /></Cell>
            <Cell name="Disabled"><TextField label="Project name" hint="Locked while a render runs." disabled defaultValue={NAME} /></Cell>
            <Cell name="No visible label" meta="aria-label names it"><TextField aria-label="Search projects" icon="search" placeholder="Search projects" /></Cell>
          </div>
        </B>
      </Section>

      <Section title="Icons, text and buttons" desc={<>Icons are decoration, Lucide at {px('xs-icon')} (xs, sm) or {px('md-icon')} (md). Prefix and suffix are text inside the frame. Clear and show / hide are ghost icon Buttons one step smaller than the field, with equal room on three sides ({room('xs')} / {room('sm')} / {room('md')} on xs / sm / md). <Info info={`${R.action}\n${R.icons}\n${R.affix}`}>The rules</Info></>}>
        <B>
          <div className="tfd-grid">
            <Cell name="Leading icon"><TextField aria-label="Leading icon" icon="search" placeholder="Search" /></Cell>
            <Cell name="Trailing icon"><TextField aria-label="Trailing icon" trailingIcon="lock" placeholder="Private" /></Cell>
            <Cell name="Prefix"><TextField aria-label="Prefix" prefix="https://" placeholder="heyoz.com" /></Cell>
            <Cell name="Suffix"><TextField aria-label="Suffix" suffix=".heyoz.com" placeholder="studio" /></Cell>
            <Cell name="Prefix and suffix"><TextField aria-label="Prefix and suffix" prefix="$" suffix="USD" placeholder="0.00" /></Cell>
            <Cell name="Clear" meta="shows only with a value; Esc clears too"><TextField aria-label="Clear" clearable defaultValue={NAME} /></Cell>
            <Cell name="Password" meta="starts hidden; eye / eye-off"><TextField aria-label="Password" type="password" defaultValue="oz-secret-42" /></Cell>
            <Cell name="Icon and clear"><TextField aria-label="Icon and clear" icon="search" clearable defaultValue={NAME} /></Cell>
            <Cell name="Medium, password" meta={`action button ${ref('md-action')} · ${px('md-action')}`}><TextField aria-label="Medium password" size="md" icon="lock" type="password" defaultValue="oz-secret-42" /></Cell>
          </div>
        </B>
      </Section>

      <Section title="Textarea" desc={<>Same frame, several lines. It starts at 3 rows and grows with the text up to 8 rows, then scrolls inside. Padding y puts the first line where a single line sits ({px('xs-textarea-padding-y')}, {px('sm-textarea-padding-y')}, {px('md-textarea-padding-y')}). <Info info={R.textarea}>The rules</Info></>}>
        <B>
          <div className="tfd-grid" data-wide>
            <Cell name="Default, 3 rows"><TextArea label="Prompt" placeholder="Describe the ad you want" hint="Be specific about the product." /></Cell>
            <Cell name="Count" meta="grows to 6 rows, then scrolls"><TextArea label="Prompt" maxRows={6} maxLength={400} showCount defaultValue={'A slow push-in on a ceramic mug at dawn.\nSteam curls up. Warm window light.\nEnd on the logo.\nNo text on screen.\nNatural sound only.\nKeep it under ten seconds.\nOne cut at most.'} /></Cell>
            <Cell name="Small, with clear"><TextArea label="Notes" size="sm" rows={2} clearable defaultValue="Keep the logo clear of the edges." /></Cell>
            <Cell name="Medium"><TextArea label="Notes" size="md" rows={2} optional placeholder="Anything else Oz should know?" /></Cell>
            <Cell name="Fixed height" meta="autoGrow off: resize from the corner"><TextArea label="Notes" autoGrow={false} rows={3} placeholder="Drag the corner" /></Cell>
            <Cell name="Error"><TextArea label="Prompt" error="Add at least ten words." defaultValue="Mug." /></Cell>
          </div>
        </B>
      </Section>

      <Section title="Usage" desc="One component for free text. Pick it by the answer you expect.">
        <div className="tfd-use">
          <Panel tone="surface/primary" pad={16}>
            <span className="type-heading-sm-medium">Use it for</span>
            <ul className="type-body-md-regular">
              <li>Names, URLs, emails, prompts and notes: anything typed.</li>
              <li>A textarea when the answer can run past one line.</li>
              <li>A hint for the format; an error for what is wrong now and how to fix it.</li>
              <li>The optional marker on optional fields. Required fields get none.</li>
            </ul>
          </Panel>
          <Panel tone="surface/primary" pad={16}>
            <span className="type-heading-sm-medium">Do not use it for</span>
            <ul className="type-body-md-regular">
              <li>A fixed list of choices: use a select.</li>
              <li>A number with a range: use a slider or number field.</li>
              <li>Yes or no: use a switch or checkbox.</li>
              <li>A placeholder as the label. It disappears when you type.</li>
              <li>A textarea only to look big.</li>
            </ul>
          </Panel>
        </div>
      </Section>

      <Section title="Keyboard" desc={<>Native input and textarea, so everything a browser does still works. <Info info={`${R.keyboard}\n${R.aria}\n${R.focus}`}>The rules</Info></>}>
        <Panel tone="surface/primary" pad={16}>
          <div className="tfd-keys type-body-md-regular">
            <Token>Tab</Token><span>Moves in and out. Focus steps the border up. The clear and show buttons come next, and are skipped while hidden.</span>
            <Token>Esc</Token><span>Clears a field that has a clear button and a value. Otherwise nothing.</span>
            <Token>Enter</Token><span>Submits the form. In a textarea it starts a new line.</span>
            <Token>Space, Enter</Token><span>Press the clear and show / hide buttons. Clear gives focus back to the field.</span>
            <Token>Click</Token><span>Anywhere in the frame, prefix and suffix included, puts the caret in the field.</span>
          </div>
        </Panel>
      </Section>

      <Section title="The details" desc={<>Every value below is read from <Token>components/textfield.json</Token>. <Info info={`${R.height}\n${R.well}\n${R.border}`}>How to read this</Info></>}>
        <Table first={72} cols={['Size', 'Height', 'Radius', 'Padding x', 'Gap', 'Text', 'Icon', 'Action button', 'Textarea padding y']} rows={SIZE_NAMES.map((s) => [
          <Token key="s">{s}</Token>, cell(`${px(`${s}-height`)}px`, ref(`${s}-height`)), cell(`${px(`${s}-radius`)}px`, ref(`${s}-radius`)), cell(`${px(`${s}-padding-x`)}px`, ref(`${s}-padding-x`)),
          cell(`${px(`${s}-gap`)}px`, ref(`${s}-gap`)), cell(c.textfield.types[s].replace('type-', '').replaceAll('-', '/'), 'value and placeholder'), cell(`${px(`${s}-icon`)}px`, ref(`${s}-icon`)),
          cell(`${px(`${s}-action`)}px`, ref(`${s}-action`)), cell(`${px(`${s}-textarea-padding-y`)}px`, 'set, not a token')])} />
        <div style={{ height: 'var(--space-12)' }} />
        <Table first={140} cols={['State', 'Fill', 'Border']} rows={['rest', 'hover', 'focus', 'invalid', 'invalid-hover', 'invalid-focus', 'disabled'].map((st) => [
          st, <Token key="f">{ref(`frame-${st}-fill`)}</Token>, <Token key="b">{ref(`frame-${st}-border`)}</Token>])} />
        <div style={{ height: 'var(--space-12)' }} />
        <Table first={140} cols={['Part', 'Type', 'Colour', 'Space']} rows={[
          ['Value', <Token key="a">body/md/regular · lg on md</Token>, <Token key="b">{ref('value-color')}</Token>, <Meta key="c">placeholder {ref('value-placeholder')}</Meta>],
          ['Icon', <Token key="a">{ref('xs-icon')} · {ref('md-icon')} on md</Token>, <Token key="b">{ref('value-icon')}</Token>, <Meta key="c">{px('xs-gap')} from the text</Meta>],
          ['Prefix, suffix', <Token key="a">as the value</Token>, <Token key="b">{ref('value-affix')}</Token>, <Meta key="c">{px('xs-gap')} from the value</Meta>],
          ['Label', <Token key="a">label/md/medium</Token>, <Token key="b">{ref('label-color')}</Token>, <Meta key="c">{px('label-gap')} to the control</Meta>],
          ['Optional marker', <Token key="a">label/md/regular</Token>, <Token key="b">{ref('label-optional-color')}</Token>, <Meta key="c">{px('label-gap-optional')} from the label</Meta>],
          ['Hint', <Token key="a">body/sm/regular</Token>, <Token key="b">{ref('message-color')}</Token>, <Meta key="c">{px('message-gap')} to the control</Meta>],
          ['Error', <Token key="a">body/sm/regular · {px('message-icon')} icon</Token>, <Token key="b">{ref('message-error')}</Token>, <Meta key="c">replaces the hint</Meta>],
          ['Count', <Token key="a">body/sm/regular</Token>, <Token key="b">{ref('count-color')} · {ref('count-limit')} at max</Token>, <Meta key="c">{px('message-gap-inline')} from the message</Meta>],
        ]} />
        <p className="d-desc type-body-md-regular" style={{ marginTop: 'var(--space-12)' }}>Inner shade on every state: inset 0 −4 10 #000 at 50%. An effect, not a token (D-021). Borders are inset shadows, so nothing moves.</p>
      </Section>
    </DocPage>
  );
}
