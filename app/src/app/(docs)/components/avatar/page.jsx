import Avatar, { AvatarGroup } from '@/components/Avatar';
import { AVATAR, SIZES, STATUSES, toneFor } from '@/components/avatar-data';
import t from '@/tokens/tokens.resolved.json';
import { DocPage, Section, Token, Meta, Table } from '@/docs/ui';
import { SpecTable, Matrix } from '@/docs/display-docs';
import { meta } from '@/docs/nav';
import AvatarDemo from './AvatarDemo';

export const metadata = meta('/components/avatar');

const PIC = '/home/avatar.webp';
const BRANDS = [['Nike', '/home/nike.webp'], ['Duolingo', '/home/duolingo.webp'], ['Tesla', '/home/tesla.webp'], ['Apple', '/home/apple.webp']];
// Five names that land on the five tones, so every tone is shown.
const PEOPLE = ['Maya Okafor', 'Priya Nair', 'Sam Rivera', 'Chen Wei', 'Jonas Weber'];
const TEAM = ['Maya Okafor', 'Priya Nair', 'Sam Rivera', 'Chen Wei', 'Jonas Weber', 'Leo Martins'].map((name) => ({ name }));
const val = (key) => AVATAR.vars.find((v) => v.key === key);
const px = (s) => AVATAR.vars.find((v) => v.key === `${s}-size`).ref;
// Pixel sizes come from the size tokens the spec points at.
const SIZE_PX = Object.fromEntries(SIZES.map((s) => [s, t.numbers.find((n) => n.name === px(s)).px]));

export default function AvatarPage() {
  return (
    <DocPage href="/components/avatar">
      <Section title="Playground" desc="Build an avatar: pick its size, shape, face and status. It is a picture of who or what owns something; it is not a button.">
        <AvatarDemo />
      </Section>

      <Section title="Fallbacks" desc={AVATAR.rules.fallback}>
        <div className="dx-gallery">
          <div className="dx-item"><div className="dx-view"><Avatar name="Maya Okafor" src={PIC} size="xl" /></div><Meta>1 · The picture</Meta></div>
          <div className="dx-item"><div className="dx-view"><Avatar name="Maya Okafor" src="/missing-picture.webp" size="xl" /></div><Meta>2 · Initials, when the picture fails</Meta></div>
          <div className="dx-item"><div className="dx-view"><Avatar size="xl" label="Guest" /></div><Meta>3 · An icon, when there is no name</Meta></div>
        </div>
      </Section>

      <Section title="Tone from the name" desc={AVATAR.rules.tone}>
        <Matrix first="Name" width={140} cols={['Tone', 'Circle', 'Squircle']} rows={PEOPLE.map((n) => [
          <span key="n" className="type-label-lg-medium">{n}</span>, <Token key="t">{toneFor(n)}</Token>, <Avatar key="b" name={n} size="lg" />, <Avatar key="c" name={n} size="lg" shape="squircle" />,
        ])} />
      </Section>

      <Section title="Sizes" desc={AVATAR.rules.sizes}>
        <Matrix first="Size" width={160} cols={['Circle', 'Squircle', 'Icon fallback']} rows={SIZES.map((s) => [
          <span key="n" className="dx-name"><span className="type-label-lg-medium">{s} · {SIZE_PX[s]}</span><Meta>{px(s)}</Meta></span>,
          <Avatar key="a" size={s} name="Priya Nair" />, <Avatar key="b" size={s} name="Acme" shape="squircle" />, <Avatar key="c" size={s} label="Guest" />,
        ])} />
      </Section>

      <Section title="Shapes" desc={AVATAR.rules.shape}>
        <Matrix first="Shape" width={160} cols={['Picture', 'Initials']} rows={[
          ['Circle · people', <span key="a" className="dx-cell"><Avatar name="Maya Okafor" src={PIC} size="lg" /><Avatar name="Maya Okafor" src={PIC} size="xl" /></span>, <span key="b" className="dx-cell"><Avatar name="Chen Wei" size="lg" /><Avatar name="Chen Wei" size="xl" /></span>],
          ['Squircle · brands', <span key="a" className="dx-cell">{BRANDS.map(([n, src]) => <Avatar key={n} name={n} src={src} shape="squircle" size="lg" />)}</span>, <span key="b" className="dx-cell"><Avatar name="Acme" shape="squircle" size="lg" /><Avatar name="Northwind" shape="squircle" size="xl" /></span>],
        ]} />
      </Section>

      <Section title="Status" desc={AVATAR.rules.status}>
        <Matrix first="Size" width={120} cols={STATUSES} rows={['sm', 'md', 'xl'].map((s) => [
          <span key="n" className="type-label-lg-medium">{s} · {SIZE_PX[s]}</span>,
          ...STATUSES.map((st) => <span key={st} className="dx-cell"><Avatar name="Maya Okafor" src={PIC} size={s} status={st} /><Avatar name="Acme" shape="squircle" size={s} status={st} /></span>),
        ])} />
      </Section>

      <Section title="Groups" desc={AVATAR.rules.group}>
        <Matrix first="Size" width={120} cols={['All shown', 'max 3, then +N']} rows={['xs', 'sm', 'md', 'lg'].map((s) => [
          <span key="n" className="dx-name"><span className="type-label-lg-medium">{s}</span><Meta>{val(`${s}-overlap`).px}px overlap</Meta></span>,
          <AvatarGroup key="a" label="Team" size={s} avatars={TEAM.slice(0, 4)} max={4} />,
          <AvatarGroup key="b" label="Team, six people" size={s} avatars={TEAM} max={3} />,
        ])} />
      </Section>

      <Section title="Usage" desc={AVATAR.rules.usage}>
        <Table first={260} cols={['Use an Avatar for', 'Use something else for']} rows={[
          ['A person: circle, picture then initials', 'A person you only name in text: no avatar'],
          ['A brand, product or workspace: squircle', <span key="a">A status or count on its own: <Token>Badge</Token></span>],
          ['A set of people: a group with +N', <span key="a">A clickable profile: wrap it in a <Token>Button</Token> or a link</span>],
          ['A face next to its name (pass decorative)', 'A face on its own (give it the name, it is the label)'],
        ]} />
        <p className="d-desc type-body-md-regular" style={{ marginTop: 'var(--space-12)' }}>{AVATAR.rules.a11y} {AVATAR.rules.interactive}</p>
      </Section>

      <Section title="The details" desc={<>Every value an avatar is made of. The edge, light, motion and group rules are in <Token>components/avatar.json</Token>; plain numbers are set values, not tokens.</>}>
        <SpecTable spec={AVATAR} prefix="av" />
      </Section>
    </DocPage>
  );
}
