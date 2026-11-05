import t from '@/tokens/tokens.resolved.json';
import { DocPage, Section, Panel, Grid, Token, Meta, Table, Info, rec } from '@/docs/ui';
import { meta } from '@/docs/nav';
import { FamilyName, FamiliesDesc, RoleDesc } from '@/lib/TypeCopy';

export const metadata = meta('/foundations/typography');
const SAMPLE = { display: 'Ads that stop the scroll', heading: 'Brand DNA', body: 'Describe your ad and pick a model.', label: 'Generate' };
const USE = { display: 'Hero titles and big moments', heading: 'Titles of sections, cards and menus', body: 'Running text, prompts, descriptions', label: 'Buttons, chips, tags, small UI text' };

export default function Typography() {
  const fam = t.type.families;
  return (
    <DocPage href="/foundations/typography">
      <Section title="The letters" desc={<FamiliesDesc />}>
        <Grid min={320}>
          {[['For titles', 'display', 'type-display-xl-semibold'], ['For reading', 'body', 'type-display-xl-regular']].map(([use, role, cls], i) => (
            <Panel key={role} pad={24} className="t-family">
              <span className={cls} style={i ? { fontFamily: 'var(--font-body)' } : undefined}>Aa</span>
              <div className="d-stack"><span className="type-heading-sm-semibold"><FamilyName role={role} /></span><Meta>{use}</Meta></div>
            </Panel>
          ))}
        </Grid>
      </Section>

      <Section title="Four jobs" desc={<>Four roles: display for big moments, heading for sections, body for reading, label for controls. Each role has its own sizes. <Info info={`${t.type.roles.length} roles, xs to xl; body adds 2xl and 3xl\n${t.type.styles.length} sizes × ${Object.keys(t.type.weights).length} weights = ${t.type.styles.length * 4} styles\nClass: type-{role}-{size}-{weight}`}>The full set</Info></>}>
        <Table first={140} cols={['Job', 'Typeface', 'Sizes', 'Used for']} rows={t.type.roles.map((r) => [
          <Token key="r">{r}</Token>, <FamilyName key="f" role={r} />,
          t.type.styles.filter((s) => s.role === r).map((s) => s.px).join(' · ') + ' px', <span key="u" className="d-dim">{USE[r]}</span>])} />
      </Section>

      {t.type.roles.map((role) => (
        <Section key={role} title={role[0].toUpperCase() + role.slice(1)} desc={<RoleDesc role={role} />}>
          <div className="d-table lit">
            {t.type.styles.filter((s) => s.role === role).map((s) => (
              <div className="d-tr t-row" key={s.size}>
                <div className="d-stack"><Token info={`${s.px}px text, ${s.lh}px lines\nLetter spacing ${s.em}em`}>{role}/{s.size}</Token></div>
                <div className={`type-${role}-${s.size}-medium t-sample`} {...rec(`${role}/${s.size}/medium`, [['type', `type/${role}/${s.size}/medium`]])}>{SAMPLE[role]}</div>
              </div>
            ))}
          </div>
        </Section>
      ))}

      <Section title="Thickness" desc="Four weights, regular (400) to bold (700). Every role can use all four.">
        <Grid min={200}>
          {Object.entries(t.type.weights).map(([w, n]) => (
            <div className="d-card lit" key={w}><span className={`type-heading-xl-${w}`}>Aa</span><Token info={`Weight ${n}`}>{w}</Token></div>
          ))}
        </Grid>
      </Section>

      <Section title="Letter spacing" desc="Letter spacing follows size: +1% up to 12px, 0 up to 18px, then tighter as text grows, down to −3%.">
        <Table first={160} cols={['Text size', 'Space between letters']} rows={t.tracking.map((r) => [r.maxSize === 999 ? 'Bigger' : `Up to ${r.maxSize}px`, <Info key="e" info={`${r.em}em`}>{r.em > 0 ? 'A little more' : r.em < 0 ? 'A little less' : 'Normal'}</Info>])} />
      </Section>
    </DocPage>
  );
}
