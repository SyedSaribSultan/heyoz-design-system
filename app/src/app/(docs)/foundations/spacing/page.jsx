import t from '@/tokens/tokens.resolved.json';
import { DocPage, Section, Panel, Token, Meta, Table, Info } from '@/docs/ui';
import { meta } from '@/docs/nav';

export const metadata = meta('/foundations/spacing');
const space = t.numbers.filter((n) => n.group === 'space');

export default function Spacing() {
  return (
    <DocPage href="/foundations/spacing">
      <Section title="Steps" desc={<>Space steps on a 4px grid: 4, 8, 12, 16 and up, with 2 and 6 as half-steps. The name is the value: space/16 is 16px. <Info info="A 4px grid. 2 and 6 are half-steps for tight spots.">Tiny half-steps</Info></>}>
        <div className="d-table lit">
          {space.map((n) => (
            <div className="d-tr n-row" key={n.name}>
              <Token info={`${n.px}px`}>{n.name}</Token><span />
              <div className="n-bar" style={{ width: `var(${n.css})` }} />
            </div>
          ))}
        </div>
      </Section>
      <Section title="Room inside and between" desc="Padding is the room inside a box; gap is the room between things. Larger things take larger steps.">
        <Panel pad={32}>
          <div className="d-row" style={{ gap: 'var(--space-32)', alignItems: 'flex-start' }}>
            {[4, 8, 12, 16].map((g) => (
              <div className="d-stack" key={g}>
                <div className="n-demo" style={{ padding: `var(--space-${g})`, gap: `var(--space-${g})` }}><i /><i /><i /></div>
                <Info info={`Padding and gap: space/${g} (${g}px)`}><Meta>Room {g}</Meta></Info>
              </div>
            ))}
          </div>
        </Panel>
      </Section>
      <Section title="Which one to pick" desc="A simple guide: the closer things belong together, the less room between them.">
        <Table first={240} cols={['When you are spacing…', 'Leave']} rows={[
          ['An icon and its words', <Info key="a" info="space/4 – space/8">a tiny bit</Info>], ['Things inside a button or input', <Info key="b" info="space/6 – space/16">a little</Info>], ['Things in one group', <Info key="c" info="space/4 – space/12">a little</Info>],
          ['The inside of a card', <Info key="d" info="space/12 – space/24">some</Info>], ['One section and the next', <Info key="e" info="space/32 and up">a lot</Info>],
        ]} />
      </Section>
    </DocPage>
  );
}
