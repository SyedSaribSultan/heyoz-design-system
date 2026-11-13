'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { slug } from './slug';
import Lucide, { lucide } from '@/lib/Lucide';
import usePresence from '@/lib/usePresence';
import { toast } from '@/components/Toast';
import { rec } from '@/lib/rec';

// Search surface: the primary tier, like the docs nav. Lit by light/cursor
// (D-020: open menus catch the light). Inner shade is an effect, not a token (D-021).
const PANEL = rec('search panel · lit', [['background', 'surface/primary'], ['border', 'border/primary'], ['border width', 'stroke/1'], ['radius', 'radius/2xl'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']]);
const ROW = rec('search result', [['background', 'fill/primary'], ['background · hover', 'fill/primary-hover'], ['border · hover', 'border/primary-hover'], ['effect · hover', 'effect · inner-shade'], ['radius', 'radius/lg'], ['type', 'type/body/md/medium']]);
const ROW_ON = rec('search result · highlighted', [['background', 'fill/primary-hover'], ['border', 'border/primary-hover'], ['border width', 'stroke/1'], ['effect', 'effect · inner-shade'], ['radius', 'radius/lg'], ['type', 'type/body/md/medium']]);
const MARK = rec('result icon tile', [['background', 'fill/primary-active'], ['border', 'border/primary'], ['radius', 'radius/md'], ['size', 'size/control/2xs']]);

// Site-wide docs behaviour, mounted once by Shell:
//   · Search (Ctrl K, ⌘K or /): pages, sections and every token. Tokens load on first open.
//   · Click any token chip (.d-token) to copy it, or any element with data-copy (colours copy their hex).
//   · One toast for both: the shared toast() (the <Toaster /> sits in the root layout).
export const openSearch = () => window.dispatchEvent(new Event('heyoz:search'));

export function SearchKey() {
  const [mac, setMac] = useState(false);
  useEffect(() => { setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)); }, []);
  return <kbd className="d-kbd type-label-lg-medium">{mac ? '⌘' : 'Ctrl'} K</kbd>;
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    document.body.append(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  }
}

let tokensP = null;
const loadTokens = () => (tokensP ??= import('./search-tokens').then((m) => m.default()));

function score(e, terms) {
  const title = e.title.toLowerCase(), hay = `${title} ${e.sub || ''} ${e.kind}`.toLowerCase();
  if (!terms.every((t) => hay.includes(t))) return null;
  const q = terms.join(' ');
  return (title === q ? 100 : 0) + (title.startsWith(q) ? 50 : 0) + (title.includes(q) ? 20 : 0) + (e.kind === 'Page' ? 15 : e.kind === 'Section' ? 8 : 0) - title.length / 100;
}

export default function DocsChrome({ nav }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [tokens, setTokens] = useState(null);
  const [active, setActive] = useState(0);
  const { mounted, leaving } = usePresence(open);
  const input = useRef(null), list = useRef(null), back = useRef(null);

  // Same id: a second copy updates the toast in place instead of stacking another.
  const say = useCallback((msg) => { toast(msg, { id: 'copied', duration: 1800 }); }, []);

  // Pages and their sections, from the site map.
  const base = useMemo(() => [
    { kind: 'Page', title: 'Overview', sub: 'HeyOz design system', href: '/', icon: 'layout-dashboard' },
    ...nav.flatMap((g) => g.items.flatMap((p) => [
      { kind: 'Page', title: p.title, sub: g.group, href: p.href, external: p.external, icon: p.icon },
      ...p.toc.map((s) => ({ kind: 'Section', title: s, sub: p.title, href: `${p.href}#${slug(s)}`, icon: 'hash' })),
    ])),
  ], [nav]);

  const results = useMemo(() => {
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return base.filter((e) => e.kind === 'Page');
    return [...base, ...(tokens || [])].map((e) => [score(e, terms), e]).filter(([s]) => s !== null).sort((a, b) => b[0] - a[0]).slice(0, 60).map(([, e]) => e);
  }, [q, base, tokens]);

  const show = useCallback(() => {
    back.current = document.activeElement;
    setOpen(true);
    loadTokens().then(setTokens);
  }, []);
  const hide = useCallback(() => { setOpen(false); setQ(''); setActive(0); back.current?.focus?.(); }, []);

  // Shortcuts and the open event from the sidebar buttons.
  useEffect(() => {
    const key = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey) && !e.altKey) { e.preventDefault(); open ? hide() : show(); }
      else if (e.key === '/' && !typing && !open) { e.preventDefault(); show(); }
    };
    window.addEventListener('keydown', key);
    window.addEventListener('heyoz:search', show);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('heyoz:search', show); };
  }, [open, show, hide]);

  // Click a token chip to copy it, or anything with data-copy (e.g. a colour: its hex). The nearest wins,
  // so a token name inside a coloured surface copies the name, the surface around it copies the hex.
  useEffect(() => {
    const timers = new Set();
    const click = async (e) => {
      const el = e.target.closest?.('[data-copy], .d-token');
      if (!el || e.target.closest('a, button')) return;
      const text = el.dataset.copy || el.textContent.trim();
      if (await copy(text)) { say(`Copied ${text}`); el.dataset.copied = ''; const t = setTimeout(() => { delete el.dataset.copied; timers.delete(t); }, 900); timers.add(t); }
    };
    document.addEventListener('click', click);
    return () => { document.removeEventListener('click', click); timers.forEach(clearTimeout); };
  }, [say]);

  useEffect(() => { if (open) requestAnimationFrame(() => input.current?.focus()); }, [open]);
  useEffect(() => { setActive(0); }, [q]);
  useEffect(() => { list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }); }, [active]);

  const pick = async (e) => {
    if (!e) return;
    if (e.copy) { if (await copy(e.copy)) say(`Copied ${e.copy}`); hide(); return; }
    hide();
    if (e.external) window.open(e.href, '_blank', 'noopener');
    else router.push(e.href);
  };
  const onKey = (ev) => {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (ev.key === 'Enter') { ev.preventDefault(); pick(results[active]); }
    else if (ev.key === 'Escape') { ev.preventDefault(); hide(); }
    else if (ev.key === 'Tab') ev.preventDefault(); // focus stays in the dialog
  };

  return (
    <>
      {mounted && (
        <div className="k-overlay motion-fade" data-leaving={leaving || undefined} data-light-root onPointerDown={(e) => e.target === e.currentTarget && hide()}>
          <div className="k-panel lit motion-pop" data-leaving={leaving || undefined} role="dialog" aria-modal="true" aria-label="Search the design system" {...PANEL}>
            <div className="k-field">
              <Lucide name="search" size="md" />
              <input ref={input} className="k-input type-body-lg-regular" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
                placeholder="Search pages, sections and tokens" aria-label="Search" role="combobox" aria-expanded="true" aria-controls="k-list"
                aria-activedescendant={results[active] ? `k-${active}` : undefined} spellCheck={false} autoComplete="off" />
              <kbd className="d-kbd type-label-lg-medium">Esc</kbd>
            </div>
            <div ref={list} id="k-list" className="k-list" role="listbox" aria-label="Results">
              {results.length === 0 && <p className="k-empty type-body-md-regular d-dim">{tokens ? `Nothing matches “${q}”.` : 'Loading tokens…'}</p>}
              {results.map((e, i) => (
                <div key={e.kind + e.title + e.href} id={`k-${i}`} role="option" aria-selected={i === active} className="k-item" {...(i === active ? ROW_ON : ROW)}
                  onPointerMove={() => i !== active && setActive(i)} onClick={() => pick(e)}>
                  <span className="k-mark" {...(e.swatch ? rec(e.title, [['background', e.title], ['border', 'border/primary']]) : MARK)} style={e.swatch ? { background: e.swatch } : undefined} data-kind={e.kind}>{!e.swatch && e.icon && <i className="k-icon" style={{ '--icon': `url(${lucide(e.icon)})` }} />}</span>
                  <span className="k-text">
                    <span className="type-body-md-medium k-title">{e.title}</span>
                    <span className="type-label-lg-regular d-dim k-sub">{e.kind} · {e.sub}</span>
                  </span>
                  <span className="type-label-lg-regular d-dim k-hint">{e.copy ? 'Copy' : 'Open'}{e.external && <Lucide name="arrow-up-right" size="xs" />} <Lucide name="corner-down-left" size="xs" /></span>
                </div>
              ))}
            </div>
            <div className="k-foot type-label-lg-regular d-dim">
              <span><kbd className="d-kbd"><Lucide name="arrow-up" label="Up" /></kbd> <kbd className="d-kbd"><Lucide name="arrow-down" label="Down" /></kbd> move</span>
              <span><kbd className="d-kbd"><Lucide name="corner-down-left" label="Enter" /></kbd> open or copy</span>
              <span className="d-grow" />
              <span>{tokens ? `${tokens.length} tokens` : ''}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
