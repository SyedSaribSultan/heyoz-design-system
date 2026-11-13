'use client';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { tk } from '@/lib/tk';
import Light from '@/lib/Light';
import Button from '@/components/Button';
import { lucide } from '@/lib/Lucide';
import { BrandTrigger } from '@/components/SideNav';
import usePresence from '@/lib/usePresence';

// Menus and pickers: brand picker (trigger, menu, row actions) and model picker.
// Menu surface: surface/tertiary + border/tertiary + inner shade, with the
// design's soft sheen. Rows: fill/tertiary → hover/selected fill/tertiary-hover.
const A = (f) => `/home/${f}`;
const Img = ({ src, name = 'icon' }) => <span {...tk(name)} data-icon><img src={A(src)} alt="" /></span>;

// A popover belongs to its trigger: clicks on the trigger or inside any of its menus keep it open.
function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const id = useId();
  useEffect(() => {
    const off = (e) => { if (!ref.current?.contains(e.target) && !e.target.closest?.(`[data-owner="${id}"]`)) setOpen(false); };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, [id]);
  return { open, setOpen, ref, id };
}

// ─── Menu surface ────────────────────────────────────────────────────────────
function Sheen() {
  // Four large, very soft blobs of content/primary (10%, Figma blur 75), positioned as in the design.
  return <span aria-hidden className="sheen">{[0, 1, 2, 3].map((i) => <i key={i} {...tk('menu sheen (Figma effect, not a token)', { bg: 'content/primary' })} />)}</span>;
}
// Menus are placed relative to their trigger and drawn on the popover layer, above everything on
// the screen (media included). Being above the screen's light, a menu carries its own light.
//   anchor: ref to the trigger · rect: optional () => DOMRect to place against instead
//   place: right (beside, tops aligned) · down (below, left edges aligned) · up (above).
//   A menu flips to the other side when it does not fit, and always stays on screen.
//   Motion (D-031): it enters with motion-pop from the side it opens on and leaves with a fade
//   (leaving: from usePresence in the owner, which keeps it mounted while it fades out).
const GAP = 8; // space/8
export function Menu({ name, place = 'up', width, pad = 6, gap = 4, anchor, rect, owner, leaving, children }) {
  const [pos, setPos] = useState(null);
  const [root, setRoot] = useState(null);
  useLayoutEffect(() => {
    const el = anchor?.current; if (!el) return;
    const host = el.closest('.home') || document.body; // the screen frame: menus are placed inside it
    if (root !== host) { setRoot(host); return; } // render into the host first, then measure and place
    const update = () => {
      const r = rect ? rect() : el.getBoundingClientRect(), R = host.getBoundingClientRect();
      const me = host.querySelector(`[data-owner="${owner}"][data-name="${name}"]`);
      const w = me?.offsetWidth || width || 0, h = me?.offsetHeight || 0, vw = window.innerWidth, vh = window.innerHeight, M = 8;
      // preferred side first; flip when it does not fit; then keep the whole menu on screen
      let side = place;
      if (side === 'up' && r.top - GAP - h < M && r.bottom + GAP + h <= vh - M) side = 'down';
      if (side === 'down' && r.bottom + GAP + h > vh - M && r.top - GAP - h >= M) side = 'up';
      let x, y;
      if (side === 'right') { x = r.right + GAP + w > vw - M ? r.left - GAP - w : r.right + GAP; y = r.top; }
      else { x = r.left; y = side === 'down' ? r.bottom + GAP : r.top - GAP - h; }
      x = Math.max(M, Math.min(x, vw - M - w)); y = Math.max(M, Math.min(y, vh - M - h));
      setPos({ top: y - R.top, left: x - R.left, side });
    };
    update();
    window.addEventListener('resize', update); window.addEventListener('scroll', update, true);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [anchor, rect, place, owner, name, width, root]);
  if (!root) return null;
  const t = tk(name, { bg: 'surface/tertiary', border: 'border/tertiary', radius: 'xl', fx: 'inner-shade', light: 'cursor' }, { width });
  const side = pos?.side || place;
  const motion = { '--motion-pop-from': side === 'up' ? '4px' : side === 'down' ? '-4px' : '0px', '--motion-pop-origin': side === 'up' ? 'bottom left' : side === 'down' ? 'top left' : 'top left' };
  const { side: _s, ...at } = pos || {};
  return createPortal(
    <Light {...t} className={`menu motion-pop ${t.className || ''}`} style={{ ...t.style, ...motion, ...(pos ? at : { visibility: 'hidden' }) }} data-owner={owner} data-leaving={leaving || undefined} role="menu">
      <Sheen />
      <div {...tk('menu column', { p: pad, gap })} className="col menu-col">{children}</div>
    </Light>, root);
}

function Tile({ icon, img, iconName }) {
  return (
    <span {...tk('logo tile', img ? { radius: 'lg', size: 'control/sm' } : { bg: 'surface/elevated', radius: 'lg', size: 'control/sm' })} className="tile">
      {img ? <img src={A(img)} alt="" /> : <img src={A(icon)} alt="" data-name={iconName} />}
      <span {...tk('tile shade', { radius: 'lg', fx: 'inner-shade' })} className="tile-shade" />
    </span>
  );
}

function Row({ tile, label, desc, selected, after, onClick, pr, name = 'menu row', ...rest }) {
  return (
    <div
      {...tk(selected ? `${name} (selected)` : name, { bg: selected ? 'fill/tertiary-hover' : 'fill/tertiary', hover: 'fill/tertiary-hover', radius: 'xl', pt: 4, pb: 4, pl: 4, pr: pr ?? (selected || after ? 12 : 4), gap: 8 })}
      className="hrow menurow" role="menuitem" tabIndex={0} onClick={onClick} data-btn
      onKeyDown={(e) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick?.(e); } }} {...rest}
    >
      {tile}
      <span className="col grow left">
        <span {...tk('row label', { type: 'body/sm/regular', color: 'content/primary' })}>{label}</span>
        {desc && <span {...tk('row description', { type: 'label/xs/regular', color: 'content/secondary' })}>{desc}</span>}
      </span>
      {after}
    </div>
  );
}

function Action({ icon, label, danger, name = 'action', onClick }) {
  return (
    <button {...tk(name, { hover: 'fill/tertiary-hover', radius: 'lg', px: 12, py: 8, gap: 4, type: 'label/md/medium', color: danger ? 'content/critical' : 'content/primary' })} className="hrow full" onClick={onClick} data-btn>
      {icon && <Img src={icon} />}
      <span className="grow left">{label}</span>
    </button>
  );
}
const Separator = () => <span {...tk('separator', { bg: 'border/elevated' }, { height: 1, margin: '4px 0' })} className="full" />;

// ─── Brand picker (trigger and menu) ─────────────────────────
const BRANDS = [['Apple', 'apple.webp'], ['Tesla', 'tesla.webp'], ['Duolingo', 'duolingo.webp'], ['Brilliant', 'brand-logo.webp'], ['Nike', 'nike.webp']];
// One brand is active at a time: the trigger shows it, the menu marks it, picking another switches and closes.
// collapsed: the side nav is a rail, so the trigger is the logo alone (SideNav BrandTrigger).
export function BrandPicker({ collapsed }) {
  const { open, setOpen, ref, id } = usePopover();
  const [picked, setPicked] = useState('Brilliant');
  const [ctx, setCtx] = useState(null);
  const logo = BRANDS.find(([b]) => b === picked)[1];
  const menu = usePresence(open), actions = usePresence(!!ctx && open);
  const [lastCtx, setLastCtx] = useState(null); // keeps the actions menu content while it fades out
  useEffect(() => { if (ctx) setLastCtx(ctx); }, [ctx]);
  const shown = ctx || lastCtx;
  return (
    <div ref={ref} className="anchor full">
      <BrandTrigger name={picked} logo={A(logo)} collapsed={collapsed} aria-haspopup="menu" aria-expanded={open} onClick={() => { setOpen(!open); setCtx(null); }} />
      {menu.mounted && (
        <>
          <Menu name="brand menu" place="right" width={225} anchor={ref} owner={id} leaving={menu.leaving}>
            <div {...tk('menu title', { px: 8, py: 4, type: 'label/xs/regular', color: 'content/secondary' })}>Your brands</div>
            <Row label="Add a new brand" tile={<Tile icon="plus-20.svg" />} name="add brand" />
            <Row label="My Brand" tile={<Tile icon="award.svg" />} name="my brand" />
            {BRANDS.map(([b, img]) => {
              const on = picked === b, menuOpen = ctx?.brand === b;
              return (
                <Row key={b} label={b} selected={on} tile={<Tile img={img} />} name="brand row" pr={4} data-row={b} role="menuitemradio" aria-checked={on}
                  onClick={() => { setPicked(b); setCtx(null); setOpen(false); }}
                  after={<>
                    {on && <Img src="check.svg" name="selected check" />}
                    {/* Brand actions: the Button component (ghost · 2xs · icon only), so it has every button state.
                        It stays pressed while its menu is open. */}
                    <span className="dots" data-show={menuOpen ? '' : undefined}>
                      <Button type="ghost" size="2xs" icon={lucide('ellipsis-vertical')} label={`${b} actions`}
                        state={menuOpen ? 'active' : undefined} aria-haspopup="menu" aria-expanded={menuOpen}
                        onClick={(e) => { e.stopPropagation(); const row = e.currentTarget.closest('[data-row]'); setCtx(menuOpen ? null : { brand: b, row }); }} />
                    </span>
                  </>} />
              );
            })}
          </Menu>
          {actions.mounted && shown && (
            <Menu name="brand actions menu" place="right" width={169} pad={4} gap={0} anchor={ref} owner={id} leaving={actions.leaving}
              rect={() => { const r = shown.row.getBoundingClientRect(), m = shown.row.closest('.menu')?.getBoundingClientRect() || r; return { top: r.top, bottom: r.bottom, left: m.left, right: m.right }; }}>
                <Action icon="pencil.svg" label="Rename" />
                <Action icon="dna.svg" label="Brand DNA" />
                <Separator />
                <Action icon="trash.svg" label="Delete brand" danger name="action (destructive)" />
            </Menu>
          )}
        </>
      )}
    </div>
  );
}

// ─── Prompt bar chips ────────────────────────────────────────────────────────
export function Chip({ icon, iconScale, label, after, name = 'chip', onClick }) {
  return (
    <button {...tk(name, { bg: 'fill/tertiary', hover: 'fill/tertiary-hover', border: 'border/tertiary', fx: 'inner-shade', color: 'content/primary', radius: 'lg', px: 12, py: 8, gap: 4 })} className="hrow" data-btn onClick={onClick}>
      {icon && <span {...tk('chip icon', { size: 'icon/sm' })} data-icon><img src={A(icon)} alt="" style={iconScale ? { transform: `scale(${iconScale})` } : undefined} /></span>}
      <span {...tk('chip label', { type: 'label/md/medium' })}>{label}</span>
      {after}
    </button>
  );
}

// Model picker
const MODELS = [
  ['GPT Image 2.5 Flare', 'Lightning-fast ads that still look stunning', 'openai.svg'],
  ['GPT Image 2.5 Sunburst', 'Studio-grade detail for your best final ad', 'openai.svg'],
  ['GPT Image 2.0', 'Razor-sharp detail and flawless text', 'openai.svg'],
  ['Nano Banana Pro', 'Razor-sharp detail and flawless text', 'gemini.svg'],
  ['Nano Banana 2', 'Blazing fast, budget-friendly, zero compromise', 'gemini.svg'],
  ['Muse Image', 'Unbeatable value with crisp, readable text', 'gemini.svg'],
  ['Seedream 5.0 Pro', 'Photo-real detail, fluent in every language', 'seedream.svg'],
];
export function ModelChip() {
  const { open, setOpen, ref, id } = usePopover();
  const [model, setModel] = useState('Seedream 5.0 Pro');
  const icon = MODELS.find((m) => m[0] === model)[2];
  const menu = usePresence(open);
  return (
    <div ref={ref} className="anchor">
      <Chip icon={icon === 'openai.svg' ? 'openai-selected.svg' : icon} iconScale={16 / 24} label={model} name="model chip" onClick={() => setOpen(!open)} />
      {menu.mounted && (
        <Menu name="model menu" width={360} anchor={ref} owner={id} leaving={menu.leaving}>
          {MODELS.map(([m, d, ic]) => {
            const on = m === model;
            return <Row key={m} label={m} desc={d} selected={on} onClick={() => { setModel(m); setOpen(false); }} name="model row"
              tile={<Tile icon={on && ic === 'openai.svg' ? 'openai-selected.svg' : ic} />} after={on && <Img src="check.svg" name="selected check" />} />;
          })}
        </Menu>
      )}
    </div>
  );
}

// + menu and output settings: not in the shared designs; same menu surface and rows.
export function AddMenu({ IconButton }) {
  const { open, setOpen, ref, id } = usePopover();
  const menu = usePresence(open);
  return (
    <div ref={ref} className="anchor">
      <span onClick={() => setOpen(!open)}>{IconButton}</span>
      {menu.mounted && (
        <Menu name="add menu" width={200} pad={4} gap={0} anchor={ref} owner={id} leaving={menu.leaving}>
          <Action label="Upload files" />
          <Separator />
          <Action icon="nav-image.svg" label="Static ads" />
          <Action icon="nav-characters.svg" label="UGC studio" />
          <Action icon="nav-products.svg" label="Product shoot" />
          <Action icon="nav-all-tools.svg" label="More tools" />
        </Menu>
      )}
    </div>
  );
}
export function CountChip() {
  const { open, setOpen, ref, id } = usePopover();
  const [count, setCount] = useState(4);
  const menu = usePresence(open);
  return (
    <div ref={ref} className="anchor">
      <Chip icon="layers.svg" label={String(count)} name="count chip" onClick={() => setOpen(!open)} />
      {menu.mounted && (
        <Menu name="count menu" width={96} pad={4} gap={0} anchor={ref} owner={id} leaving={menu.leaving}>
          {[1, 2, 3, 4].map((n) => <Action key={n} icon="layers.svg" label={String(n)} onClick={() => { setCount(n); setOpen(false); }} name={n === count ? 'count option (selected)' : 'count option'} />)}
        </Menu>
      )}
    </div>
  );
}
