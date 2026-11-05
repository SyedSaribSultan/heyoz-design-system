import t from '@/tokens/tokens.resolved.json';
import { DocPage, Section, Panel, Token, Table, v, Info } from '@/docs/ui';
import { meta } from '@/docs/nav';
import Button from '@/components/Button';
import { lucide } from '@/docs/Lucide';

export const metadata = meta('/foundations/light');
const L = t.light[0];
const LADDER = ['background', 'surface/primary', 'surface/secondary', 'surface/tertiary', 'surface/elevated'];

export default function LightPage() {
  return (
    <DocPage href="/foundations/light">
      <Section title="The rule" desc="A soft glow follows your cursor and lights up every surface it passes. The background, pictures and videos stay dark.">
        <Table first={200} cols={['', 'How it works']} rows={[
          ['Where', 'There is one glow on each screen. Cards, panels, buttons, the sidebar and open menus all catch it. The background between them never does.'],
          ['How much', <Info key="h" info={`Blend: ${L.blend}`}>Gentle on dark things, a little brighter on lighter things, so it feels the same everywhere.</Info>],
          ['Pictures', <Info key="m" info={`Media sits above the light; the light dims to ${L.mediaOpacity * 100}% over it`}>Pictures and videos stay just as they are. The glow slips behind them and dims.</Info>],
          ['Off', 'On phones and tablets, and for anyone who asks their device for less motion.'],
          ['For builders', <span key="c">Give every surface above the background the class <Token>lit</Token> (or <Token>data-lit</Token>; on Home <Token>tk()</Token> adds it). Never the page frame. Only the outermost lit surface paints, so a lit button inside a lit card is fine. Popovers and menus: <Token>{'<Light>'}</Token>. Mark media with <Token>data-media</Token>, and never put media inside a box with its own z-index. LightField in the root layout moves the light.</span>],
        ]} />
      </Section>
      <Section title="Try it" desc="Move your cursor across the boxes, the button and the picture. The background box stays dark, lighter boxes glow a little more, and the glow dims over the picture.">
        <div className="l-stage">
          {LADDER.map((s) => (
            <div key={s} className={s === 'background' ? 'l-step' : 'l-step lit'} style={{ background: v(s) }}>
              {s === 'surface/tertiary' && <Button size="xs" icon={lucide('wand-sparkles')}>Enhance</Button>}
              <span className="type-label-lg-medium">{s}</span>
            </div>
          ))}
          <div className="l-step lit" style={{ background: v('surface/primary') }}>
            <div className="l-media" data-media />
            <span className="type-label-lg-medium l-media-label">Media</span>
          </div>
        </div>
      </Section>
      <Section title="The numbers" desc={<>Everything that shapes the glow. <Info info="Source: tokens/light.json">Where these live</Info></>}>
        <Table first={260} cols={['Token', 'Value']} rows={[
          [<Token key="1">light/cursor/fill</Token>, `${L.fill} (${L.fillHex})`],
          [<Token key="2">light/cursor/blend</Token>, L.blend],
          [<Token key="3">light/cursor/opacity</Token>, `${L.opacity * 100}%`],
          [<Token key="4">light/cursor/media-opacity</Token>, `${L.mediaOpacity * 100}%`],
          [<Token key="5">light/cursor/size</Token>, `${L.size}px`],
          [<Token key="6">light/cursor/blur</Token>, `${L.blur} (Figma) · ${L.blur / 2}px in CSS`],
          ['Peak · reach', `${Math.round(L.peak * 100)}% of the fill under the cursor · ends ${L.reach}px out (worked out from size and blur)`],
          [<Token key="7">light/cursor/fade</Token>, `${L.fade}ms · ${L.fadeRef}`],
        ]} />
      </Section>
    </DocPage>
  );
}
