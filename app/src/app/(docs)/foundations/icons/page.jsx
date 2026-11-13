import t from '@/tokens/tokens.resolved.json';
import icons from '@/icons/icons.json';
import { DocPage, Section, Panel, Token, Meta, Table, Info } from '@/docs/ui';
import { meta } from '@/docs/nav';
import { ICON_GRID as g } from '@/components/Button';
import IconGrid from '@/docs/IconGrid';
import IconLibrary from '@/docs/IconLibrary';
import { slimIcons } from '@/docs/icon-index';

export const metadata = meta('/foundations/icons');
const INITIAL = 96; // icons in the page HTML per library; the rest load from /icon-index/{lib}
const px = (f, k) => +(f * g[k]).toFixed(2);
const STEPS = [['Draw a box', 'A square, 24 by 24.'], ['Add tiny squares', 'A grid of 1-dot squares, like graph paper.'], ['Add guide lines', 'Corner to corner, and through the middle.'], ['Add guide shapes', 'A square, a circle and a smaller square to draw inside.']];
const DO = [
  ['Keep it simple, so it is easy to read.', 'Don’t draw every detail.'],
  ['Make every icon look like it belongs to the family.', 'Don’t mix different drawing styles.'],
  ['Put every point on the grid.', 'Don’t put points between grid squares.'],
  ['Use the same line thickness and line ends everywhere.', 'Don’t mix thick and thin lines.'],
];

export default function Icons() {
  return (
    <DocPage href="/foundations/icons">
      <Section title="The grid" desc="Every icon is drawn on one grid: the drawing fills the key square, 75% of the frame (18 of 24). That is why icons match at any size.">
        <Panel pad={32}>
          <div className="ic-hero">
            <IconGrid />
            <Table first={160} cols={['Guide', 'In a 24 box']} rows={[['padding', 'Empty edge'], ['square', 'Drawing square'], ['circle', 'Circle'], ['stroke', 'Line thickness']].map(([k, label]) => [<Token key={k} info={`size/icon/grid/${k}\nRatio ${g[k]} of the box`}>{label}</Token>, `${px(24, k)}px`])} />
          </div>
        </Panel>
        <div style={{ height: 'var(--space-12)' }} />
        <div className="ic-steps">
          {STEPS.map(([n, d], i) => (
            <div className="d-card lit" key={n}><span className="type-label-lg-medium"><span className="fg-n">{i + 1}</span> · {n}</span><Meta>{d}</Meta></div>
          ))}
        </div>
        <p className="d-desc type-body-md-regular" style={{ marginTop: 'var(--space-12)' }}>
          Each picture fills the drawing square in the middle, with a little empty space all around it. <Info info={`Longest side = box × ${g.square} (18 in a 24 box), centred\nRound, tall and wide shapes may reach the circle (20 at 24)\nNever past the empty edge\nExport the whole box, never just the drawing`}>The exact rule</Info>
        </p>
      </Section>

      <Section title="Three sizes" desc="Icons come in three sizes. The line is 1/16 of the frame, so it thickens with the icon and every size looks equally sharp.">
        <Table first={140} cols={['Size', 'Used for', 'Line', 'Corners', 'Drawing square']} rows={[
          [<Token key="s">16 × 16</Token>, 'Small buttons and toolbars', '1px', '1px', `${px(16, 'square')}px`],
          [<Token key="m">24 × 24</Token>, 'Most places', '1.5px', '2px', `${px(24, 'square')}px`],
          [<Token key="l">32 × 32</Token>, 'Big moments and banners', '2px', '4px', `${px(32, 'square')}px`],
        ]} />
      </Section>

      <Section title="Good icons" desc="The rules that keep every icon clear.">
        <div className="ic-do">
          <div className="d-card lit"><span className="type-label-lg-medium" style={{ color: 'var(--content-success)' }}>Do</span>{DO.map(([d]) => <Meta key={d}>{d}</Meta>)}</div>
          <div className="d-card lit"><span className="type-label-lg-medium" style={{ color: 'var(--content-critical)' }}>Don’t</span>{DO.map(([, d]) => <Meta key={d}>{d}</Meta>)}</div>
        </div>
        <div style={{ height: 'var(--space-12)' }} />
        <Table first={200} cols={['When', 'What to do']} rows={[
          ['Guide shapes', 'Follow them. A tiny nudge to fit a guide shape makes an icon look balanced.'],
          ['Breaking the guides', 'Only when following them would make the icon look wrong. Easy to read always wins.'],
          ['Dots', 'Make a dot a little bigger or smaller if the grid makes it look odd.'],
          ['Two icons in one', 'They may use more of the grid, so there is no empty gap.'],
        ]} />
      </Section>

      <Section title="HeyOz icons" desc={<>Our own {icons.heyoz.length} icons. One-colour icons take the colour of the words around them; logos, flags and emoji keep their own colours. Click an icon to download it.</>}>
        <IconLibrary lib="heyoz" initial={slimIcons('heyoz', icons.heyoz.slice(0, INITIAL))} total={icons.heyoz.length} sprite="/icons/heyoz.svg" dir="heyoz" groupBy="set" placeholder="Search HeyOz icons" />
      </Section>

      <Section title="Lucide icons" desc={<>{icons.lucide.length.toLocaleString('en')} more icons from Lucide, a free icon set, redrawn on our grid so they match ours. Click an icon to download it. <Info info={`Lucide v${icons.lucideVersion}\nLongest side ${icons.grid.key} in the 24 box, centred\n${icons.grid.stroke}px line`}>How they were redrawn</Info></>}>
        <IconLibrary lib="lucide" initial={slimIcons('lucide', icons.lucide.slice(0, INITIAL)).map(([n]) => [n, ''])} total={icons.lucide.length} sprite="/icons/lucide.svg" dir="lucide" placeholder="Search 2,000 icons: arrow, user, upload…" />
      </Section>
    </DocPage>
  );
}
