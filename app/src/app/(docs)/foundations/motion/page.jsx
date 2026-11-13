import t from '@/tokens/tokens.resolved.json';
import { PopupDemo, SwapDemo, SelectionDemo } from './MotionDemos';
import { DocPage, Section, Grid, Token, Table, Panel, Info } from '@/docs/ui';
import { meta } from '@/docs/nav';

export const metadata = meta('/foundations/motion');
const D = t.motion.duration; // ms, from tokens/motion.json
const USE = { fast: 'Quick: pointing at things, pressing, colour changes', base: 'Medium: most changes, popups appearing, the glow fading', slow: 'Slow: bigger moves, like the menu folding up',
  standard: 'For things that move across the screen', enter: 'For things that arrive: they slow down as they land', exit: 'For things that leave: they speed up as they go' };

function Demo({ dur, ease, name, value, use }) {
  return (
    <div className="d-card lit m-card" style={{ '--m-dur': dur, '--m-ease': ease }}>
      <div className="m-track"><i /></div>
      <Token info={value}>{name}</Token><span className="d-dim type-body-md-regular">{use}</span>
    </div>
  );
}

export default function Motion() {
  return (
    <DocPage href="/foundations/motion">
      <Section title="The rule" desc="Nothing snaps. Every change of colour, position or size animates: fast for state changes, base for swaps and popups, slow for large moves.">
        <Table first={200} cols={['When', 'What you see', 'Speed', 'Feel']} rows={[
          ['You point or press', 'Colours, borders and glows fade to their new look', <Token key="d">duration/fast</Token>, <Token key="e">easing/standard</Token>],
          ['An icon changes', 'The old picture fades out as the new one slides in', <Token key="d">duration/base</Token>, <Token key="e">easing/standard</Token>],
          ['A popup opens', 'It fades in and settles into place', <Token key="d">duration/base</Token>, <Token key="e">easing/enter</Token>],
          ['A popup closes', 'It fades away, a little faster than it came', <Token key="d">duration/fast</Token>, <Token key="e">easing/exit</Token>],
          ['You pick an option', 'The highlight slides over to it', <Token key="d">duration/base</Token>, <Token key="e">easing/standard</Token>],
          ['Something big moves', 'Menus and panels glide open or folded', <Token key="d">duration/slow</Token>, <Token key="e">easing/standard</Token>],
          ['The glow', 'Fades in and out, and dims over pictures', <Token key="d">light/cursor/fade</Token>, <Token key="e">easing/standard</Token>],
          ['Less motion, please', 'For people who ask their device for less motion: fades stay, sliding stops', '—', '—'],
          ['For builders', <span key="c">Nothing for state changes. Icon swaps: <Token>motion-swap</Token> + <Token>motion-swap-in</Token>. Popups: <Token>motion-pop</Token> and <Token>usePresence</Token> for the exit. Selection: <Token>motion-indicator</Token> + <Token>useIndicator</Token>.</span>, '', ''],
        ]} />
      </Section>
      <Section title="How fast" desc={`Three durations: fast ${D.fast}ms, base ${D.base}ms, slow ${D.slow}ms. Point at a card to watch.`}>
        <Grid min={220}>{Object.entries(t.motion.duration).map(([k, ms]) => <Demo key={k} dur={`var(--duration-${k})`} ease="var(--easing-standard)" name={`duration/${k}`} value={`${ms}ms`} use={USE[k]} />)}</Grid>
      </Section>
      <Section title="How it moves" desc="Three easings, named by intent: standard for things moving on screen, enter for things arriving, exit for things leaving. Point at a card; shown slowed down.">
        <Grid min={220}>{Object.entries(t.motion.easing).map(([k, e]) => <Demo key={k} dur="var(--duration-slow)" ease={`var(--easing-${k})`} name={`easing/${k}`} value={e} use={USE[k]} />)}</Grid>
      </Section>
      <Section title="Popups" desc={<>Popups enter with a fade and a 4px drop at base ({D.base}ms) and leave with a fade at fast ({D.fast}ms), so closing never feels slow. <Info info="In: fade, 4px drop, scale from 0.98 · duration/base · easing/enter\nOut: fade · duration/fast · easing/exit">The details</Info></>}>
        <Panel pad={32} className="m-pop-stage"><PopupDemo /></Panel>
      </Section>
      <Section title="Picking one" desc={<>Change the option and the selected highlight slides to it, across a row, a column or a grid, at base ({D.base}ms). <Info info="One indicator, position and size together · duration/base · easing/standard
Pointing waits until it lands
No slide on first load; less motion cross-fades">The details</Info></>}>
        <Panel pad={32}><SelectionDemo /></Panel>
      </Section>
      <Section title="Icon swaps" desc={<>Point at each one: the old icon fades while the new one slides 4px into place. <Info info="Crossfade + 4px slide · duration/base · easing/standard">The details</Info></>}>
        <Panel pad={32}><SwapDemo /></Panel>
      </Section>
    </DocPage>
  );
}
