'use client';
import { useEffect } from 'react';
import './light.css';

// light/cursor (D-020). Light falls on every surface above the background, never on the background
// itself, never on media.
//
// Mounted once, in the root layout. On every pointer move (one frame at a time) it finds every lit element
// (class `lit`) within reach of the cursor and hands it the cursor's position in its own coordinates:
// - outermost lit surfaces get data-light (on / media): they paint the light over everything inside them.
//   An element is outermost when no lit element sits above it, counting up to a light root
//   (data-light-root: popovers, menus, the search overlay), which starts a new screen.
// Elements out of reach are switched off, so the light fades on them. Off on touch (light.css also hides
// it on touch and with reduced motion).

export default function LightField() {
  useEffect(() => {
    let pos = null, raf = 0, reach = 0, media = false; // reach comes from the token (--light-cursor-reach)
    const lit = new Set();
    const readReach = () => { reach = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--light-cursor-reach')) || reach; };
    const outermost = (el) => {
      if (el.hasAttribute('data-light-root')) return true;
      for (let p = el.parentElement; p; p = p.parentElement) {
        if (p.classList.contains('lit') || p.hasAttribute('data-lit')) return false;
        if (p.hasAttribute('data-light-root')) return true;
      }
      return true;
    };
    const off = (el) => { delete el.dataset.light; lit.delete(el); };
    const paint = () => {
      raf = 0;
      if (!pos) { for (const el of [...lit]) off(el); return; }
      const [cx, cy] = pos;
      const state = media ? 'media' : 'on';
      // Read every position first, then write, so the browser lays out once per frame, not once per surface.
      const hits = [];
      for (const el of document.querySelectorAll('.lit, [data-lit]')) {
        if (!outermost(el)) continue; // covered by the lit surface around it
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        const dx = Math.max(r.left - cx, 0, cx - r.right), dy = Math.max(r.top - cy, 0, cy - r.bottom);
        if (dx * dx + dy * dy <= reach * reach) hits.push([el, cx - r.left, cy - r.top]);
      }
      const seen = new Set();
      for (const [el, x, y] of hits) {
        el.style.setProperty('--x', `${x}px`);
        el.style.setProperty('--y', `${y}px`);
        el.dataset.light = state;
        seen.add(el); lit.add(el);
      }
      for (const el of [...lit]) if (!seen.has(el)) off(el);
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const move = (e) => {
      if (e.pointerType === 'touch') return;
      pos = [e.clientX, e.clientY];
      media = !!e.target.closest?.('[data-media]');
      queue();
    };
    const leave = () => { pos = null; queue(); };
    readReach();
    document.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', queue, { passive: true, capture: true });
    window.addEventListener('resize', readReach);
    window.addEventListener('blur', leave);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', queue, { capture: true }); window.removeEventListener('resize', readReach); window.removeEventListener('blur', leave);
      for (const el of [...lit]) off(el);
    };
  }, []);
  return null;
}
