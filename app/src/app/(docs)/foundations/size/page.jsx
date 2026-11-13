import t from '@/tokens/tokens.resolved.json';
import { DocPage, Section, Panel, Token } from '@/docs/ui';
import { meta } from '@/docs/nav';

export const metadata = meta('/foundations/size');
const pick = (p) => t.numbers.filter((n) => n.name.startsWith(p) && !n.ratio);

export default function Size() {
  const target = t.numbers.find((n) => n.name === 'size/target');
  return (
    <DocPage href="/foundations/size">
      <Section title="Buttons and inputs" desc="Seven control heights for anything you press or type in, 28 to 72. xs (32) is the everyday size.">
        <Panel pad={32}><div className="s-row">
          {pick('size/control/').map((n) => (
            <div className="s-cell" key={n.name}><div className="s-control" style={{ height: `var(${n.css})` }} /><Token info={`${n.name} · ${n.px}px`}>{n.name.split('/').pop()}</Token></div>
          ))}
        </div></Panel>
      </Section>
      <Section title="Icon boxes" desc="Every icon sits in a square frame, in five sizes from 12 to 32. The Icons page shows how the drawing fits inside.">
        <Panel pad={32}><div className="s-row">
          {pick('size/icon/').map((n) => (
            <div className="s-cell" key={n.name}><div className="s-icon" style={{ width: `var(${n.css})`, height: `var(${n.css})` }}><span /></div><Token info={`${n.name} · ${n.px}px`}>{n.name.split('/').pop()}</Token></div>
          ))}
        </div></Panel>
      </Section>
      <Section title="Finger space" desc="Anything you can tap gets at least a 44px target, even when it looks smaller.">
        <Panel pad={32}><div className="s-row">
          <div className="s-cell"><div className="s-target" style={{ width: `var(${target.css})`, height: `var(${target.css})` }}><span /></div><Token info={`${target.px}px around a ${t.numbers.find((n) => n.name === 'size/control/2xs').px}px control`}>size/target</Token></div>
        </div></Panel>
      </Section>
      <Section title="Lines" desc="Two strokes: stroke/1 for edges and dividers, stroke/2 for selection and keyboard focus.">
        <Panel pad={32}><div className="s-row">
          {pick('stroke/').map((n) => (
            <div className="s-cell" key={n.name}><div className="s-stroke" style={{ boxShadow: `inset 0 0 0 var(${n.css}) var(--border-elevated)` }} /><Token info={`${n.px}px`}>{n.name}</Token></div>
          ))}
        </div></Panel>
      </Section>
    </DocPage>
  );
}
