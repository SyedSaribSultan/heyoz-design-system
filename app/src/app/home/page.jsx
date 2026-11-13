import { tk } from '@/lib/tk';
import RestGlow from './RestGlow';
import { ModelChip, AddMenu, CountChip, Chip as MChip } from './Menus';
import HomeSideNav from './HomeSideNav';
import IconButton from './IconButton';
import './home.css';

// Home · Static Ads.
// Built only from HeyOz tokens through tk(). Hold Ctrl + Alt and point at anything to see its tokens.
// Effects (drop-md, drop-sm, inner-shade) are set values, not tokens (D-021): tk() FX → --fx-* in globals.css.

const A = (f) => `/home/${f}`;

function Icon({ src, size = 'icon/md', name = 'icon' }) {
  return <span {...tk(name, { size })} data-icon><img src={A(src)} alt="" /></span>;
}

function PromptBox() {
  const cross = <span className="swap" data-icon-pair><Icon src="double-chevron.svg" size="icon/sm" name="double chevron" /><span {...tk('clear (on hover)', { size: 'icon/sm', color: 'content/primary' })} className="cross" /></span>;
  return (
    <div {...tk('prompt box', { bg: 'surface/secondary', border: 'border/brand-secondary', fx: 'drop-md', radius: '3xl', p: 12, gap: 8 }, { width: 1024, maxWidth: '100%' })} className="hrow end">
      <div {...tk('prompt + settings')} className="col grow stretch between">
        <div {...tk('prompt', { pt: 6, pl: 6, pr: 12, pb: 12, type: 'body/md/regular', color: 'content/tertiary' })} className="grow">Describe your ad</div>
        <div {...tk('settings', { gap: 4 })} className="hrow bottom wrap">
          <AddMenu IconButton={<IconButton icon="plus.svg" bg="fill/tertiary" radius="lg" name="add" label="Add" />} />
          <MChip label="Static Ads" after={cross} name="tool chip (hover: cross)" />
          <ModelChip />
          <MChip icon="resolution.svg" label="1080p" name="resolution chip" />
          <MChip label="9:16" name="aspect chip" />
          <CountChip />
          <MChip icon="wand.svg" label="Enhance" name="enhance chip" />
        </div>
      </div>
      {['BRAND KIT', 'STYLE'].map((l) => (
        <RestGlow key={l} {...tk(`${l.toLowerCase()} tile`, { bg: 'surface/tertiary', border: 'border/secondary', radius: 'lg', pt: 8, pr: 8, pb: 12, pl: 12, fx: 'inner-shade' }, { width: 100, height: 100 })} className="col between tile-glow">
          <div className="hrow end"><IconButton icon="plus-small.svg" size={28} bg="fill/tertiary" name="add (28, off the control scale)" label="Add" /></div>
          <span {...tk('tile label', { type: 'body/sm/medium', color: 'content/primary' })}>{l}</span>
        </RestGlow>
      ))}
      <button {...tk('generate', { gradient: ['fill/brand-hover', 'fill/brand'], fx: 'inner-shade', radius: 'lg', type: 'body/md/medium', color: 'content/on-brand' }, { width: 125, height: 100 })} className="col center" data-btn>
        <span>Generate</span>
        <span className="hrow center"><Icon src="credit.svg" size="icon/xs" name="credit icon" />4</span>
      </button>
    </div>
  );
}

function Row({ title, src, h, gap, action }) {
  return (
    <section {...tk(`${title} section`, { pt: 16, gap: 16 }, { width: 1024, maxWidth: '100%' })} className="col">
      <div {...tk('section header')} className="hrow between">
        <span {...tk('section title', { type: 'body/lg/medium', color: 'content/secondary' })}>{title}</span>
        {action && (
          <a href="#" {...tk('see all', { gap: 6, type: 'label/xl/medium', color: 'content/tertiary' })} className="hrow" data-btn>
            See all <span {...tk('arrow icon', {}, { width: 22, height: 22 })} data-icon><img src={A('arrow-right.svg')} alt="" /></span>
          </a>
        )}
      </div>
      {[...Array(title === 'Inspirations' ? 2 : 1)].map((_, r) => (
        <div key={r} {...tk('media row', { gap })} className="hrow clip">
          {[...Array(6)].map((_, i) => (
            <img key={i} {...tk('media', { border: 'border/primary', fx: 'drop-sm', radius: 'xl' }, { width: 200, height: h })} src={A(src)} alt="" data-media />
          ))}
        </div>
      ))}
    </section>
  );
}

export const metadata = { title: { absolute: 'HeyOz · Home' }, description: 'The HeyOz Home screen (Static Ads), built only from design-system tokens.', alternates: { canonical: '/home' } };

export default function Home() {
  return (
    <div {...tk('page', { bg: 'background', className: 'home' })}>
      <HomeSideNav />
      <div {...tk('top nav + workspace')} className="col grow main">
        <header {...tk('top nav', { px: 16, py: 8 })} className="hrow between">
          <button {...tk('go back', { hover: 'fill/tertiary-hover', radius: 'lg', px: 12, py: 8, gap: 4 })} className="hrow" data-btn>
            <Icon src="chevron-left.svg" size="icon/sm" />
            <span {...tk('go back label', { type: 'label/md/medium', color: 'content/primary' })}>Go Back</span>
          </button>
          <div {...tk('top actions', { gap: 8 })} className="hrow">
            <IconButton icon="tasks.svg" bg="fill/secondary" radius="lg" name="tasks" label="Tasks" />
            <span {...tk('divider', {}, { width: 12, height: 12 })} className="divider"><img src={A('divider.svg')} alt="" /></span>
            <button {...tk('upgrade', { bg: 'fill/tertiary', hover: 'fill/tertiary-hover', border: 'border/secondary', fx: 'inner-shade', radius: 'lg', px: 12, py: 8, gap: 4 })} className="hrow" data-btn>
              <Icon src="diamond.svg" size="icon/sm" />
              <span {...tk('upgrade label', { type: 'label/md/medium', color: 'content/primary' })}>Upgrade</span>
            </button>
          </div>
        </header>

        <main {...tk('workspace', { pt: 16, pb: 32, px: 16 })} className="col grow center-x">
          <div {...tk('content', { py: 32 })} className="col center-x full">
            <div {...tk('hero text', { gap: 12 })} className="col center-x text-center">
              <h1 {...tk('title', { type: 'display/sm/medium', color: 'content/primary' })}>EVERYTHING YOU NEED FOR<br />STATIC ADVERTISING</h1>
              <p {...tk('subtitle', { type: 'body/lg/regular', color: 'content/tertiary' })}>Ads that stop the scroll</p>
            </div>
            <div {...tk('bento', { gap: 16, py: 32 })} className="col center-x full">
              <PromptBox />
              <Row title="My Creations" src="creation.webp" h={200} gap={12} action />
              <Row title="Inspirations" src="inspiration.webp" h={250} gap={16} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
