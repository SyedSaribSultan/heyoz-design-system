'use client';
import { useEffect, useRef, useState } from 'react';
import useIndicator from '@/lib/useIndicator';
import cssTime from '@/lib/cssTime';
import Link from 'next/link';
import Lucide, { lucide } from '@/lib/Lucide';
import Button from './Button';
import Tooltip from './Tooltip';
import c from '@/tokens/components.json';
import '@/styles/components.css';
import './sidenav.css';
import { rec } from '@/lib/rec';

// Type styles come from the spec (components/sidenav.json → components.json), like every other value.
const TY = c.sidenav.types;

// Side nav: expanded and collapsed, menu items, brand picker. Spec: components/sidenav.json (D-030).
// One component for every sidebar: the HeyOz app (/home) and this docs site.
// Surface surface/primary with the inner shade, lit by light/cursor (D-020). Icons are Lucide.
//
// <SideNav groups={[{ title, items: [{ label, icon, href, active }] }]} collapsed onToggle
//          brand={<BrandPicker />} slot={…} footer={…} profile={{ name, plan, avatar }} />
const ITEM = [['height', 'layout · 40px'], ['padding x', 'space/12'], ['padding y', 'space/8'], ['gap', 'space/6'], ['radius', 'radius/lg'], ['icon', 'size/icon/md'], ['type', 'type/body/lg/regular'], ['text colour', 'content/primary']];
const ITEM_STATE = {
  default: [['background', 'fill/primary'], ['background · hover', 'fill/primary-hover'], ['border · hover', 'border/primary-hover'], ['effect · hover', 'effect · inner-shade']],
  hover: [['background', 'fill/primary-hover'], ['border', 'border/primary-hover'], ['effect', 'effect · inner-shade']],
  active: [['background', 'fill/primary-active'], ['border', 'border/primary-active'], ['effect', 'effect · inner-shade']],
};

// Menu item: default · hover · active. state forces a look (docs); otherwise hover is live.
export function SideNavItem({ label, icon, href, active, state, collapsed, onClick, external }) {
  const look = active ? 'active' : state === 'hover' ? 'hover' : 'default';
  const props = {
    className: `sn-item ${TY.item}`, 'data-active': active || undefined, 'data-state': state,
    'aria-current': active ? 'page' : undefined, 'aria-label': collapsed ? label : undefined, onClick,
    ...rec(`side nav item · ${look}`, [...ITEM, ...ITEM_STATE[look]]),
  };
  const body = <><Lucide name={icon} size="md" /><span className="sn-label">{label}</span>{external && <Lucide name="arrow-up-right" className="sn-ext" label="opens in a new tab" />}</>;
  // Collapsed, the label is gone: a Tooltip names the item (it is also the aria-label, so no aria-describedby).
  const item = href
    ? <Link href={href} {...props} target={external ? '_blank' : undefined} prefetch={external ? false : undefined}>{body}</Link>
    : <button type="button" {...props}>{body}</button>;
  return <Tooltip content={label} placement="right" disabled={!collapsed} describe={false}>{item}</Tooltip>;
}

// Brand picker: default · hover. The chevron doubles on hover.
export function BrandTrigger({ name = 'Brilliant', logo = '/home/brand-logo.webp', state, collapsed, ...props }) {
  const button = (
    <button type="button" className="sn-brand" data-state={state} data-collapsed={collapsed || undefined} aria-label={collapsed ? `Brand: ${name}` : undefined}
      {...rec(`brand picker${state === 'hover' ? ' · hover' : ''}`, [['background', state === 'hover' ? 'fill/tertiary-hover' : 'fill/tertiary'], ['border', state === 'hover' ? 'border/tertiary-hover' : 'border/tertiary'], ['radius', collapsed ? 'radius/lg' : 'radius/xl'], ['padding', 'space/4'], ['gap', 'space/8'], ['logo', collapsed ? 'size/control/2xs' : 'size/control/sm'], ['type', 'type/body/lg/medium'], ['effect', 'effect · inner-shade']])}
      {...props}>
      <span className="sn-brand-logo"><img src={logo} alt="" /></span>
      <span className={`sn-label ${TY.brand}`}>{name}</span>
      <span className="sn-chev motion-swap" aria-hidden><Lucide name="chevron-right" size="md" /><Lucide name="chevrons-right" size="md" className="motion-swap-in" /></span>
    </button>
  );
  return <Tooltip content={name} placement="right" disabled={!collapsed} describe={false}>{button}</Tooltip>;
}

// animate: false while restoring a saved state on load, so the nav does not replay a collapse nobody made.
export default function SideNav({ groups, collapsed = false, onToggle, brand, slot, footer, profile, logoHref = '/', className = '', animate = true, shortcut = false }) {
  const ref = useRef(null), groupsRef = useRef(null);
  // Ctrl+B / ⌘B opens and closes the nav, like VS Code. Only the page's main nav sets `shortcut`.
  // Skipped while typing, so Ctrl+B still means bold in text fields.
  const toggleRef = useRef(onToggle);
  toggleRef.current = onToggle;
  useEffect(() => {
    if (!shortcut) return;
    const key = (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey || e.key.toLowerCase() !== 'b' || !toggleRef.current) return;
      if (e.target.closest?.('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) return;
      e.preventDefault();
      // Focus on a logo-row toggle hands over to its counterpart, as with a click; anywhere else it stays put.
      if (document.activeElement?.matches?.('.sn-logo-open, .sn-close button') && ref.current?.contains(document.activeElement)) want();
      toggleRef.current();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [shortcut]);
  // The active item is one highlight that slides from item to item, across groups (D-032).
  const activeKey = groups.flatMap((g) => g.items).find((i) => i.active)?.label;
  const { vars, ready } = useIndicator(groupsRef, '.sn-item[data-active]', [activeKey, collapsed]);
  // Toggling from the logo row keeps keyboard focus on the toggle: the control that was used becomes inert or unmounts,
  // so focus moves to its counterpart (open ↔ close) instead of dropping to the page. Ctrl+B does the same when focus is on one of these toggles; anywhere else it leaves focus where it was.
  // The request lives for one move only: if the parent never changes `collapsed` it lapses after the move's length, so a later,
  // unrelated change (a drawer opening, a restore) cannot pull focus to the toggle.
  const refocus = useRef(false), lapse = useRef(0);
  const want = () => { refocus.current = true; clearTimeout(lapse.current); lapse.current = setTimeout(() => { refocus.current = false; }, cssTime('--duration-slow', 320) + 100); };
  const toggleHere = () => { want(); onToggle(); };
  useEffect(() => () => clearTimeout(lapse.current), []);
  useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false; clearTimeout(lapse.current);
    ref.current?.querySelector(collapsed ? '.sn-logo-open' : '.sn-close button')?.focus({ preventScroll: true });
  }, [collapsed]);
  // Motion phase, one value: 'restoring' (animate off: a saved state is being applied, nothing replays) · 'rest' · 'moving'
  // (collapsing or opening: the highlight follows its item frame by frame, for the width's duration/slow). Only a change of
  // `collapsed` starts a move, so it works from the first frame.
  const [moving, setMoving] = useState(false), wasCollapsed = useRef(collapsed);
  useEffect(() => {
    if (wasCollapsed.current === collapsed) return;
    wasCollapsed.current = collapsed;
    setMoving(true);
    const t = setTimeout(() => setMoving(false), cssTime('--duration-slow', 320) + 40);
    return () => clearTimeout(t);
  }, [collapsed]);
  const phase = !animate ? 'restoring' : moving ? 'moving' : 'rest';
  return (
    <aside ref={ref} className={`sn lit ${className}`.trim()} data-collapsed={collapsed || undefined} data-animate={animate || undefined} data-resizing={phase === 'moving' || undefined} data-phase={phase}
      {...rec(`side nav · ${collapsed ? 'collapsed' : 'expanded'}`, [['background', 'surface/primary'], ['width', `layout · ${collapsed ? 54 : 300}px`], ['padding', collapsed ? 'space/8' : 'space/16'], ['gap', 'space/16'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']])}>
      <div className="sn-body">
        <div className="sn-top">
          {/* One logo, always mounted, so it glides with the nav instead of being swapped mid-animation.
              Collapsed, the open button lies over the logomark and the link is inert; the wordmark and close button fade. */}
          <div className="sn-logo-row">
            <Link href={logoHref} className="sn-logo" inert={(collapsed && !!onToggle) || undefined}><img src="/home/logomark.svg" alt="" width={32} height={32} /><span className={`sn-label ${TY.logo}`}>HeyOz</span></Link>
            {onToggle && collapsed && <Tooltip content="Open sidebar" placement="right" describe={false}><button type="button" className="sn-logo-open" onClick={toggleHere} aria-label="Open sidebar"><Lucide name="panel-left-open" className="sn-open-icon" /></button></Tooltip>}
            {onToggle && <span className="sn-close" inert={collapsed || undefined}><Tooltip content="Close sidebar" placement="bottom" disabled={collapsed} describe={false}><Button type="ghost" size="xs" icon={lucide('panel-left-close')} label="Close sidebar" onClick={toggleHere} /></Tooltip></span>}
          </div>
          {brand}
          {slot}
          <div ref={groupsRef} className="sn-groups" data-indicator-ready={ready || undefined}>
            <span className="sn-ind motion-indicator" style={vars} aria-hidden data-name="side nav highlight · active (slides, D-032)" data-tokens={JSON.stringify([['background', 'fill/primary-active'], ['border', 'border/primary-active'], ['effect', 'effect · inner-shade'], ['radius', 'radius/lg']])} />
            {groups.map((g, i) => (
              <nav key={g.title || i} className="sn-group" aria-label={g.title || 'Main'}>
                {g.title && <span className={`sn-title ${TY.title}`}>{g.title}</span>}
                {g.items.map((it) => <SideNavItem key={it.label} {...it} collapsed={collapsed} />)}
              </nav>
            ))}
          </div>
        </div>
        {footer}
      </div>
      {profile && (
        <div className="sn-profile" {...rec('profile', [['border', 'border/primary'], ['padding', 'space/12']])}>
          <div className="sn-profile-row">
            <Tooltip content={profile.name} placement="right" disabled={!collapsed}><img className="sn-avatar" src={profile.avatar || '/home/avatar.webp'} alt="" /></Tooltip>
            <span className="sn-label sn-who">
              <span className={TY['profile-name']}>{profile.name}</span>
              <span className={`${TY['profile-plan']} sn-plan`}>{profile.plan}</span>
            </span>
            <span className="sn-label"><Button type="ghost" size="sm" icon={lucide('settings')} label="Settings" /></span>
          </div>
        </div>
      )}
    </aside>
  );
}

// The community card from the expanded nav (Join the community · Claim 50 Credits). Collapsed: the Discord item.
export function CommunityCard({ collapsed }) {
  if (collapsed) return <Tooltip content="Join the community" placement="right" describe={false}><a href="#" className="sn-item" aria-label="Join the community" onClick={(e) => e.preventDefault()}><img src="/home/discord.svg" alt="" width={20} height={20} /></a></Tooltip>;
  return (
    <div className="sn-community" {...rec('community card', [['background', 'surface/primary'], ['border', 'border/primary-disabled'], ['radius', 'radius/xl'], ['padding', 'space/12'], ['gap', 'space/12'], ['effect', 'effect · inner-highlight']])}>
      <img src="/home/discord.svg" alt="" width={24} height={24} />
      <span className="sn-community-copy">
        <span className={TY['community-title']}>Join the community</span>
        <span className={`${TY['community-copy']} sn-plan`}>Feature requests, feedback, and 50 bonus credits when you join.</span>
      </span>
      <Button type="tertiary" size="xs" block>Claim 50 Credits</Button>
    </div>
  );
}
