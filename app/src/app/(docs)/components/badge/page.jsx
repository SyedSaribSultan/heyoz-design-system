import Badge, { BadgeAnchor, BADGE, TONES } from '@/components/Badge';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Lucide, { lucide } from '@/lib/Lucide';
import t from '@/tokens/tokens.resolved.json';
import { DocPage, Section, Token, Meta, Table, SpecTable, Matrix, specOf } from '@/docs/ui';
import { meta } from '@/docs/nav';
import BadgeDemo from './BadgeDemo';

export const metadata = meta('/components/badge');

// Heights are worked out from the spec: label line height + padding y twice (never typed).
const lh = (size) => t.type.styles.find((s) => s.role === 'label' && s.size === size).lh;
const { px, ref } = specOf(BADGE);
const py = (size) => px(`${size}-padding-y`);
const H = { sm: lh('sm') + 2 * py('sm'), md: lh('md') + 2 * py('md') };

export default function BadgePage() {
  return (
    <DocPage href="/components/badge">
      <Section title="Playground" desc="Build a badge: pick its tone, style, size and what it shows. It is a label, never a button.">
        <BadgeDemo />
      </Section>

      <Section title="Tones" desc={BADGE.rules.variants}>
        <Matrix first="Tone" cols={[`Soft · md (${H.md})`, `Soft · sm (${H.sm})`, `Solid · md (${H.md})`, `Solid · sm (${H.sm})`]} rows={TONES.map((tone) => [
          <span key="n" className="dx-name"><span className="type-label-lg-medium">{tone}</span><Meta>{ref(`soft-${tone}-fill`)}</Meta></span>,
          <Badge key="a" tone={tone}>{tone}</Badge>, <Badge key="b" tone={tone} size="sm">{tone}</Badge>,
          <Badge key="c" tone={tone} variant="solid">{tone}</Badge>, <Badge key="d" tone={tone} variant="solid" size="sm">{tone}</Badge>,
        ])} />
      </Section>

      <Section title="Dot, icon and count" desc={`${BADGE.rules.dot} ${BADGE.rules.icon} ${BADGE.rules.count}`}>
        <Matrix first="Form" width={180} cols={['Soft', 'Solid']} rows={[
          [<span key="n" className="type-label-lg-medium">Leading dot</span>, <span key="a" className="dx-cell">{['neutral', 'brand', 'success', 'warning', 'critical', 'info'].map((tn) => <Badge key={tn} tone={tn} dot>{tn}</Badge>)}</span>, <span key="b" className="dx-cell">{['brand', 'success', 'critical'].map((tn) => <Badge key={tn} tone={tn} variant="solid" dot>{tn}</Badge>)}</span>],
          [<span key="n" className="type-label-lg-medium">Icon</span>, <span key="a" className="dx-cell"><Badge tone="success" icon="circle-check">Live</Badge><Badge tone="warning" icon="clock">Paused</Badge><Badge tone="critical" icon="triangle-alert">Failed</Badge></span>, <span key="b" className="dx-cell"><Badge tone="success" variant="solid" icon="circle-check">Live</Badge><Badge tone="critical" variant="solid" icon="triangle-alert">Failed</Badge></span>],
          [<span key="n" className="type-label-lg-medium">Count</span>, <span key="a" className="dx-cell"><Badge count={1} label="unread" /><Badge count={12} label="unread" tone="brand" /><Badge count={128} label="unread" tone="info" /></span>, <span key="b" className="dx-cell"><Badge count={1} label="unread" variant="solid" tone="brand" /><Badge count={12} label="unread" variant="solid" tone="brand" /><Badge count={128} label="unread" variant="solid" tone="critical" /><Badge count={7} label="unread" size="sm" variant="solid" tone="brand" /></span>],
          [<span key="n" className="type-label-lg-medium">Dot only</span>, <span key="a" className="dx-cell">{['brand', 'success', 'warning', 'critical', 'info'].map((tn) => <Badge key={tn} tone={tn} dot label={`${tn} signal`} />)}</span>, <span key="b" className="dx-cell">{['neutral', 'brand', 'critical'].map((tn) => <Badge key={tn} tone={tn} variant="solid" dot label={`${tn} signal`} />)}<Badge tone="brand" variant="solid" size="sm" dot label="small signal" /></span>],
        ]} />
      </Section>

      <Section title="On other things" desc={BADGE.rules.anchor}>
        <div className="dx-gallery">
          <div className="dx-item"><div className="dx-view"><BadgeAnchor badge={<Badge tone="brand" variant="solid" size="sm" count={3} label="unread" />}><Button size="sm" icon={lucide('bell')} label="Notifications" /></BadgeAnchor></div><Meta>Count on a button</Meta></div>
          <div className="dx-item"><div className="dx-view"><BadgeAnchor shape="circle" badge={<Badge tone="critical" variant="solid" size="md" dot label="New" />}><Avatar name="Maya Okafor" size="lg" /></BadgeAnchor></div><Meta>Dot on a circle: sits on the edge</Meta></div>
          <div className="dx-item"><div className="dx-view"><BadgeAnchor badge={<Badge tone="brand" variant="solid" dot label="New" />}><span className="dx-tile"><Lucide name="image" size="md" /></span></BadgeAnchor></div><Meta>Dot on a square icon</Meta></div>
          <div className="dx-item" style={{ background: 'var(--surface-secondary)' }}><div className="dx-view"><BadgeAnchor badge={<Badge tone="brand" variant="solid" size="sm" count={9} label="unread" ring="surface/secondary" />}><span className="dx-tile"><Lucide name="mail" size="md" /></span></BadgeAnchor></div><Meta>On surface/secondary: ring follows it</Meta></div>
        </div>
      </Section>

      <Section title="Usage" desc={BADGE.rules.use}>
        <Table first={260} cols={['Use a Badge for', 'Use something else for']} rows={[
          ['A status: Live, Failed, Draft', <span key="a">A message the user must read: Toast or Callout</span>],
          ['A count on a nav item or an icon', <span key="a">An action: <Token>Button</Token></span>],
          ['A quiet "New" next to a name', <span key="a">A removable or selectable tag: <Token>Chip</Token></span>],
          ['One or two words', 'Anything longer: plain text'],
        ]} />
      </Section>

      <Section title="The details" desc={<>Every value a badge is made of. Heights are the label line height plus padding y twice: sm {H.sm}, md {H.md}. Source: <Token>components/badge.json</Token>; plain numbers are set values, not tokens.</>}>
        <SpecTable spec={BADGE} prefix="bdg" />
      </Section>
    </DocPage>
  );
}
