import t from '@/tokens/tokens.resolved.json';
import { DocPage, Section, Panel, Grid, Token, Info } from '@/docs/ui';
import { meta } from '@/docs/nav';

export const metadata = meta('/foundations/radius');
const radius = t.numbers.filter((n) => n.group === 'radius');

export default function Radius() {
  return (
    <DocPage href="/foundations/radius">
      <Section title="Corners" desc="Nine radii, from none to full (a pill). Point at a name for its size.">
        <Grid min={160}>
          {radius.map((n) => (
            <div className="d-card lit" key={n.name}>
              <div className="r-box" style={{ borderRadius: `var(${n.css})` }} />
              <Token info={n.name === 'radius/full' ? `${n.px}px · in Figma use 1000` : `${n.px}px`}>{n.name}</Token>
            </div>
          ))}
        </Grid>
      </Section>
      <Section title="Corners inside corners" desc={<>A box inside a box takes the outer radius minus the padding, so the gap between them stays even all the way round. <Info info="Inner radius = outer radius − gap\nHere: radius/3xl (24) outside, 12 gap, radius/lg (12) inside">The rule</Info></>}>
        <Panel pad={32}>
          <div className="r-nest"><div /></div>
        </Panel>
      </Section>
    </DocPage>
  );
}
