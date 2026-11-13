'use client';
import { useLayoutEffect, useRef } from 'react';

// Placement for floating parts (Tooltip, Popover, Menu, Select). All are position: fixed on the document, so a scroll
// container never clips them. Rules live in components/tooltip.json, popover.json, menu.json (placement).
//   place():       pure. Preferred side → flip to the opposite side when it has no room → clamp inside the window.
//   useAnchored(): measures the floating element (hidden until placed), sets left/top/data-side/data-placed on it,
//                  and keeps it on its anchor while the page scrolls or resizes. Written to the element, not to
//                  React state, so following a scroll costs no re-render.
const OPPOSITE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, hi));

// a: the anchor's rect · w, h: the floating's natural size · returns { left, top, side, maxHeight }
// cap: a tallest height (a list that scrolls inside): the side is chosen for the natural height, then the height is
//      capped by `cap` and the room on that side, and returned as maxHeight.
export function place(a, w, h, { placement = 'top', align = 'center', gap = 8, margin = 8, vw, vh, cap }) {
  const room = { top: a.top - margin, bottom: vh - margin - a.bottom, left: a.left - margin, right: vw - margin - a.right };
  const need = (s) => (s === 'top' || s === 'bottom' ? h : w) + gap;
  let side = placement;
  if (room[side] < need(side)) {
    const o = OPPOSITE[side];
    if (room[o] >= need(o) || room[o] > room[side]) side = o;
  }
  const vertical = side === 'top' || side === 'bottom';
  let maxHeight;
  if (cap) {
    maxHeight = Math.max(0, Math.min(cap, vertical ? room[side] - gap : vh - 2 * margin));
    h = Math.min(h, maxHeight);
  }
  let left, top;
  if (vertical) {
    left = align === 'start' ? a.left : align === 'end' ? a.right - w : a.left + a.width / 2 - w / 2;
    top = side === 'top' ? a.top - gap - h : a.bottom + gap;
  } else {
    top = align === 'start' ? a.top : align === 'end' ? a.bottom - h : a.top + a.height / 2 - h / 2;
    left = side === 'left' ? a.left - gap - w : a.right + gap;
  }
  return { left: clamp(left, margin, Math.max(margin, vw - margin - w)), top: clamp(top, margin, Math.max(margin, vh - margin - h)), side, maxHeight };
}

const cssPx = (el, name) => (name ? parseFloat(getComputedStyle(el).getPropertyValue(name)) || 0 : 0);

// Motion origin and slide for the side the element sits on (motion-pop reads --motion-pop-from / --motion-pop-origin).
// Left and right fade and scale only: motion-pop slides vertically.
function motion(side, align) {
  const h = align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
  const v = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';
  if (side === 'top') return { from: '4px', origin: `${h} bottom` };
  if (side === 'bottom') return { from: '-4px', origin: `${h} top` };
  return { from: '0px', origin: `${side === 'left' ? 'right' : 'left'} ${v}` };
}

// float: the element (null until mounted) · anchor: the element it follows, or rect: () => DOMRect | null for an anchor that is not one
// offset, margin: names of the component's CSS variables (spec: offset, margin)
// attached: the float is a field's list, joined to it: the gap is the variable named by offsetAttached instead of offset
// matchWidth: as wide as the anchor · maxHeight: the name of the variable that caps the height (it then scrolls inside)
export function useAnchored({ anchor, rect, float, placement, align = 'center', offset, margin, attached, offsetAttached, matchWidth, maxHeight }) {
  const rectRef = useRef(rect); rectRef.current = rect;
  const useRect = !!rect;
  useLayoutEffect(() => {
    if ((!anchor && !useRect) || !float) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const a = rectRef.current ? rectRef.current() : anchor.getBoundingClientRect();
      if (!a) return;
      const doc = document.documentElement;
      const cap = cssPx(float, maxHeight);
      if (cap) float.style.maxHeight = ''; // measure the natural height
      if (matchWidth) float.style.width = `${a.width}px`;
      const p = place(a, float.offsetWidth, float.offsetHeight, { placement, align, gap: cssPx(float, attached ? offsetAttached : offset), margin: cssPx(float, margin), vw: doc.clientWidth, vh: doc.clientHeight, cap });
      if (cap) float.style.maxHeight = `${p.maxHeight}px`;
      float.style.left = `${Math.round(p.left)}px`;
      float.style.top = `${Math.round(p.top)}px`;
      const m = motion(p.side, align);
      float.style.setProperty('--motion-pop-from', m.from);
      float.style.setProperty('--motion-pop-origin', m.origin);
      float.dataset.side = p.side;
      float.dataset.placed = '';
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
    // a scroll inside the float itself (a long list) never moves it
    const onScroll = (e) => { if (!float.contains(e.target)) queue(); };
    update();
    window.addEventListener('resize', queue);
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    const ro = new ResizeObserver(queue);
    ro.observe(float); if (anchor) ro.observe(anchor);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', queue); window.removeEventListener('scroll', onScroll, { capture: true }); ro.disconnect(); };
  }, [anchor, useRect, float, placement, align, offset, margin, attached, offsetAttached, matchWidth, maxHeight]);
}

const TABBABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
// Elements in tab order inside root (visible, not inert).
export const tabbables = (root = document) => [...root.querySelectorAll(TABBABLE)].filter((el) => el.tabIndex >= 0 && el.getClientRects().length && !el.closest('[inert]'));
