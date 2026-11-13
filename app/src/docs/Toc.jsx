'use client';
import { useEffect, useRef, useState } from 'react';
import useIndicator from '@/lib/useIndicator';

// "On this page", with the section you are reading marked. items: [[title, id]].
// Clicking scrolls smoothly (html scroll-behavior, D-031). The marker is one indicator that slides
// to the active link (D-032). A clicked link holds the marker until the scroll ends, so it travels
// once to the target instead of stepping through every section the page passes on the way.
export default function Toc({ items }) {
  const [active, setActive] = useState(items[0]?.[1]);
  const ref = useRef(null), lock = useRef(null), fallback = useRef(0);
  useEffect(() => () => clearTimeout(fallback.current), []);
  const { vars, ready } = useIndicator(ref, '[aria-current="true"]', [active]);
  useEffect(() => {
    const els = items.map(([, id]) => document.getElementById(id)).filter(Boolean);
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target.id, e.isIntersecting);
      if (lock.current) return;
      // the first section still on screen; at the very bottom, the last one
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      const first = atEnd ? els.at(-1)?.id : els.find((el) => seen.get(el.id))?.id;
      if (first) setActive(first);
    }, { rootMargin: '-64px 0px -55% 0px' });
    els.forEach((el) => io.observe(el));
    // The scroll a click started has ended: let the observer mark sections again.
    let t = 0;
    const release = () => { clearTimeout(t); t = setTimeout(() => { lock.current = null; }, 120); };
    const onScroll = () => { if (lock.current && !('onscrollend' in window)) release(); }; // browsers without scrollend
    window.addEventListener('scrollend', release);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scrollend', release); window.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, [items]);
  // The lock ends with the scroll; the 2 s timer is the fallback for a click that scrolls nothing (that section is already in place).
  const go = (id) => { lock.current = id; setActive(id); clearTimeout(fallback.current); fallback.current = setTimeout(() => { if (lock.current === id) lock.current = null; }, 2000); };
  return (
    <nav ref={ref} className="d-toc" aria-label="On this page" data-indicator-ready={ready || undefined}>
      <span className="d-toc-ind motion-indicator" style={vars} aria-hidden />
      <span className="type-label-lg-medium d-dim">On this page</span>
      {items.map(([t, id]) => (
        <a key={id} href={`#${id}`} className="type-label-lg-regular" aria-current={active === id ? 'true' : undefined} onClick={() => go(id)}>{t}</a>
      ))}
    </nav>
  );
}
