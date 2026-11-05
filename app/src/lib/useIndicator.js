'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import cssTime from './cssTime';

// D-032 · Selection moves, it doesn't jump. One indicator carries the selected look and slides from the
// old item to the new one (position and size together, duration/base · easing/standard).
//
// const { vars, ready } = useIndicator(groupRef, '[aria-checked="true"]', [value]);
// <div ref={groupRef} data-indicator-ready={ready || undefined}>
//   <span className="motion-indicator" style={vars} />   ← first child, absolutely placed
//   …items…
// </div>
// The group must be positioned. Works for a row, a column or a grid: the indicator travels in a straight
// line. ready turns on after the first placement, so the first paint never animates.
// moving is true while the indicator travels: put it on the group as data-indicator-moving, so hover and
// press styles wait until it lands (it travels with the plain selected look, never a hover look).
export default function useIndicator(ref, selector, deps = []) {
  const [box, setBox] = useState(null);
  const [ready, setReady] = useState(false);
  const [moving, setMoving] = useState(false);
  const last = useRef(null), timer = useRef(0);
  useLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;
    const measure = () => {
      const el = group.querySelector(selector);
      setBox(el ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(group);
    for (const child of group.children) ro.observe(child);
    return () => ro.disconnect();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  // A move starts when the box changes after the first placement; it ends after duration/base.
  useEffect(() => {
    const prev = last.current; last.current = box;
    if (!ready || !box || !prev || (prev.x === box.x && prev.y === box.y && prev.w === box.w && prev.h === box.h)) return;
    setMoving(true);
    clearTimeout(timer.current);
    const ms = cssTime('--duration-base', 200);
    timer.current = setTimeout(() => setMoving(false), ms);
  }, [box, ready]);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!box || ready) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(id);
  }, [box, ready]);
  const vars = box ? { '--ind-x': `${box.x}px`, '--ind-y': `${box.y}px`, '--ind-w': `${box.w}px`, '--ind-h': `${box.h}px` } : { opacity: 0 };
  return { vars, ready, moving, visible: !!box };
}
