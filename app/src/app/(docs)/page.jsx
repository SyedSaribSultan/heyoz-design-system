import Link from 'next/link';
import t from '@/tokens/tokens.resolved.json';
import { NAV } from '@/docs/nav';
import Button from '@/components/Button';
import { TypeSummary } from '@/lib/TypeCopy';
import { rec } from '@/docs/ui';
import Lucide, { lucide } from '@/lib/Lucide';
import Badge from '@/components/Badge';
import Chip from '@/components/Chip';
import { AvatarGroup } from '@/components/Avatar';
import { TooltipBubble } from '@/components/Tooltip';
import { PopoverPanel } from '@/components/Popover';
import Progress, { Spinner } from '@/components/Progress';
import Slider from '@/components/Slider';
import { ToastCard } from '@/components/Toast';
import { MenuPanel } from '@/components/Menu';
import Tabs from '@/components/Tabs';
import Checkbox from '@/components/Checkbox';
import { RadioGroup, Radio } from '@/components/Radio';
import Switch from '@/components/Switch';
import TextField from '@/components/TextField';
import Select from '@/components/Select';
import Segmented from '@/components/Segmented';
// Tiles record their tokens for the inspector; each tile is a lit surface, the page frame is not (D-020).
const TILE = rec('page tile · lit', [['background', 'surface/primary'], ['background · hover', 'surface/secondary'], ['border', 'border/primary'], ['border · hover', 'border/primary-hover'], ['radius', 'radius/xl'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']]);

export const metadata = { title: { absolute: 'HeyOz Design System' } };
const v = (n) => `var(--${n.replaceAll('/', '-')})`;



// A tiny preview of each page, drawn with the tokens it documents.
const ART = {
  '/foundations/colour': () => t.ramps.map((r) => <span key={r.name} className="o-ramp">{[3, 6, 9, 11].map((i) => <i key={i} style={{ background: v(r.steps[i - 1].name) }} />)}</span>),
  '/foundations/typography': () => <span className="type-display-lg-semibold">Aa</span>,
  '/foundations/spacing': () => <span className="o-bars">{[4, 8, 12, 16, 24, 32].map((s) => <i key={s} style={{ width: `var(--space-${s})` }} />)}</span>,
  '/foundations/radius': () => ['sm', 'lg', '2xl', 'full'].map((r) => <i key={r} className="o-rad" style={{ borderRadius: `var(--radius-${r})` }} />),
  '/foundations/size': () => ['xs', 'md', 'lg', 'xl'].map((s) => <i key={s} className="o-size" style={{ height: `var(--size-control-${s})` }} />),
  '/foundations/icons': () => ['sparkles', 'image', 'wand-sparkles', 'layers'].map((n) => <span key={n} className="o-icon" style={{ '--icon': `url(/icons/lucide/${n}.svg)` }} />),
  '/foundations/motion': () => <span className="o-motion"><i /></span>,
  '/foundations/light': () => <span className="o-light"><i /></span>,
  '/components/button': () => <><Button size="xs" icon={lucide('wand-sparkles')} tabIndex={-1}>Enhance</Button><Button size="xs" shape="pill" icon={lucide('plus')} label="Add" tabIndex={-1} /></>,
  '/components/sidebar': () => <span className="sn o-sn">{[['house', 'Home', 1], ['image', 'Image'], ['square-play', 'Video']].map(([i, l, on]) => <span key={l} className="sn-item type-body-lg-regular" data-active={on ? '' : undefined}><Lucide name={i} size="md" /><span className="sn-label">{l}</span></span>)}</span>,
  // Component tiles: a still specimen, out of the Tab order and the pointer (inert), so the tile stays one link.
  '/components/text-field': () => <span inert className="o-spec" style={{ width: 180 }}><TextField size="xs" aria-label="Search" icon="search" placeholder="Search projects" /></span>,
  '/components/checkbox': () => <span inert className="o-spec"><Checkbox defaultChecked aria-label="On" /><Checkbox aria-label="Off" /></span>,
  '/components/radio': () => <span inert className="o-spec"><RadioGroup aria-label="Plan" defaultValue="a" orientation="horizontal"><Radio value="a" aria-label="On" /><Radio value="b" aria-label="Off" /></RadioGroup></span>,
  '/components/switch': () => <span inert className="o-spec"><Switch defaultChecked aria-label="On" /><Switch aria-label="Off" /></span>,
  '/components/segmented': () => <span inert className="o-spec"><Segmented label="Range" size="2xs" items={[['d', 'Day'], ['w', 'Week'], ['m', 'Month']]} value="w" /></span>,
  '/components/tabs': () => <span inert className="o-spec"><Tabs label="Specimen" size="sm" defaultValue="a" items={[{ value: 'a', label: 'Assets' }, { value: 'b', label: 'Brand' }, { value: 'c', label: 'Members' }]} /></span>,
  '/components/menu': () => <span inert className="o-spec"><MenuPanel items={[{ label: 'Rename', shortcut: 'F2' }, { label: 'Duplicate' }, { label: 'Delete', danger: true }]} active="Duplicate" force="hover" width={180} /></span>,
  '/components/select': () => <span inert className="o-spec" style={{ width: 180 }}><Select aria-label="Model" size="xs" options={[{ value: 'a', label: 'Sunburst', icon: 'sparkles' }]} defaultValue="a" /></span>,
  '/components/tooltip': () => <span inert className="o-spec"><TooltipBubble content="Close sidebar" shortcut="Ctrl B" /></span>,
  '/components/popover': () => <span inert className="o-spec"><PopoverPanel size="sm" title="Export"><span className="d-dim type-body-sm-regular">Resolution 1080p</span></PopoverPanel></span>,
  '/components/dialog': () => <span inert className="o-spec"><span className="o-dialog"><span className="type-label-lg-semibold">Rename project</span><span className="type-label-md-regular d-dim">Shown in exports.</span><span className="o-dialog-acts"><Button type="ghost" size="2xs">Cancel</Button><Button type="brand" size="2xs">Save</Button></span></span></span>,
  '/components/toast': () => <span inert className="o-spec"><ToastCard static type="success" message="Clip added" action={{ label: 'Undo' }} /></span>,
  '/components/badge': () => <span inert className="o-spec"><Badge tone="success">Live</Badge><Badge tone="brand" variant="solid" count={3} label="unread" /></span>,
  '/components/chip': () => <span inert className="o-spec"><Chip size="2xs" selected>Video</Chip><Chip size="2xs" icon="wand-sparkles">Enhance</Chip></span>,
  '/components/avatar': () => <span inert className="o-spec"><AvatarGroup size="sm" max={3} avatars={[{ name: 'Maya Okafor' }, { name: 'Priya Nair' }, { name: 'Sam Rivera' }, { name: 'Chen Wei' }]} /></span>,
  '/components/slider': () => <span inert className="o-spec" style={{ width: 160 }}><Slider ariaLabel="Opacity" defaultValue={60} /></span>,
  '/components/progress': () => <span inert className="o-spec o-col" style={{ width: 160 }}><Progress value={60} size="md" ariaLabel="Upload" /><Spinner size="lg" value={60} decorative /></span>,
  '/home': () => <img src="/home/logomark.svg" alt="" width={40} height={40} />,
  // Each screen's sidebar icon (Lucide), at the same 40 as the Home logomark.
  '/editor': () => <span className="o-icon" style={{ '--icon': 'url(/icons/lucide/clapperboard.svg)', width: 'var(--size-control-sm)', height: 'var(--size-control-sm)' }} />,
  '/dashboard': () => <span className="o-icon" style={{ '--icon': 'url(/icons/lucide/layout-dashboard.svg)', width: 'var(--size-control-sm)', height: 'var(--size-control-sm)' }} />,
};

export default function Overview() {
  return (
    <>
      <article className="d-page">
        <header className="o-hero lit" {...rec('hero · lit', [['background', 'surface/primary'], ['border', 'border/primary'], ['radius', 'radius/3xl'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']])}>
          <div className="o-hero-text">
            <h1 className="type-display-lg-semibold">Design System<br />HeyOz</h1>
            <p className="d-lede type-body-lg-regular">The building blocks of HeyOz: tokens, components and the rules behind them. Every specimen is drawn with the real token or component. Press <kbd className="d-kbd type-label-lg-medium">/</kbd> to find anything, or hold <kbd className="d-kbd type-label-lg-medium">Ctrl</kbd> + <kbd className="d-kbd type-label-lg-medium">Alt</kbd> and point at something to see what it is made of.</p>
          </div>
          <div className="o-swatches" aria-hidden>
            {t.ramps.flatMap((r) => r.steps.map((p) => <i key={p.name} style={{ background: v(p.name) }} title={`${p.name} · ${p.hex}`} />))}
          </div>
        </header>



        {NAV.map((g) => (
          <section key={g.group} className="d-section">
            <div className="d-section-head"><h2 className="type-heading-md-semibold">{g.group}</h2></div>
            <div className="d-tiles">
              {g.items.map((p) => (
                <Link key={p.href} href={p.href} className="d-tile lit" {...TILE} target={p.external ? '_blank' : undefined} prefetch={p.external ? false : undefined}>
                  <div className="d-tile-art" aria-hidden>{ART[p.href]?.()}</div>
                  <div className="d-tile-text">
                    <span className="d-tile-head">
                      <span className="type-heading-sm-semibold">{p.title}{p.external && <> <Lucide name="arrow-up-right" className="d-dim" label="opens in a new tab" /></>}</span>
                    </span>
                    <p className="type-body-md-regular">{p.href === '/foundations/typography' ? <TypeSummary /> : p.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </article>
    </>
  );
}
