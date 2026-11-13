'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SideNav from '@/components/SideNav';
import Tooltip from '@/components/Tooltip';
import Lucide from '@/lib/Lucide';
import { openSearch, SearchKey } from './DocsChrome';

// The docs sidebar is the HeyOz SideNav: expanded 300, collapsed 54 (remembered for this session, D-033).
// Narrow screens: a top bar, and the same SideNav, always expanded, as a drawer.
export default function Sidebar({ nav }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false); // animate only after the saved state is restored
  useEffect(() => { try { setCollapsed(sessionStorage.getItem('heyoz:sidenav') === 'collapsed'); } catch {} requestAnimationFrame(() => requestAnimationFrame(() => setReady(true))); }, []);
  const toggle = () => { const next = !collapsed; setCollapsed(next); try { sessionStorage.setItem('heyoz:sidenav', next ? 'collapsed' : 'expanded'); } catch {} };
  // The drawer is always expanded, so opening or closing it flips `rail` without anyone toggling the nav: that flip must not animate.
  const [still, setStill] = useState(false), [seen, setSeen] = useState(open);
  if (seen !== open) { setSeen(open); setStill(true); } // adjusted during render, so the very first output already has animation off
  useEffect(() => {
    if (!still) return;
    let b; const a = requestAnimationFrame(() => { b = requestAnimationFrame(() => setStill(false)); });
    return () => { cancelAnimationFrame(a); cancelAnimationFrame(b); };
  }, [still]);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    document.documentElement.dataset.drawer = '';
    return () => { window.removeEventListener('keydown', esc); delete document.documentElement.dataset.drawer; };
  }, [open]);

  const groups = [
    { items: [{ label: 'Overview', icon: 'layout-dashboard', href: '/', active: path === '/' }] },
    ...nav.map((g) => ({ title: g.group.toUpperCase(), items: g.items.map((i) => ({ label: i.title, icon: i.icon, href: i.href, active: path === i.href, external: i.external })) })),
  ];
  const rail = collapsed && !open;
  const search = (
    <Tooltip content="Search" shortcut="Ctrl K" placement="right" disabled={!rail} describe={false}>
      <button type="button" className="d-search lit type-body-md-regular" onClick={openSearch} aria-label={rail ? 'Search' : undefined} aria-keyshortcuts="Control+K Meta+K"><Lucide name="search" /><span className="d-grow sn-label">Search</span><span className="sn-label"><SearchKey /></span></button>
    </Tooltip>
  );

  return (
    <>
      <header className="d-topbar">
        <Link href="/" className="d-brand"><img src="/home/logomark.svg" alt="" width={28} height={28} /><span className="type-heading-xs-semibold">HeyOz</span></Link>
        <span className="d-row" style={{ gap: 'var(--space-4)' }}>
          <button type="button" className="d-iconbtn lit" onClick={openSearch} aria-label="Search"><Lucide name="search" /></button>
          <button type="button" className="d-iconbtn lit" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="d-side">
            <Lucide name={open ? 'x' : 'menu'} size="md" />
          </button>
        </span>
      </header>
      <div className="d-scrim" data-open={open || undefined} onClick={() => setOpen(false)} aria-hidden />
      <div id="d-side" className="d-side" data-open={open || undefined}>
        <SideNav groups={groups} collapsed={rail} onToggle={open ? undefined : toggle} slot={search} animate={ready && !still} shortcut />
      </div>
    </>
  );
}
