'use client';
import { useEffect, useRef, useState } from 'react';

// Info tooltips for the docs (one shared tooltip, mounted by DocsChrome). Any element with data-info
// shows its note on hover or keyboard focus: the plain story stays on the page, the details (token
// names, references, values) live here. New lines in data-info become new lines in the tooltip.
// Placed above the element, or below when there is no room; kept on screen. Fades (D-031).
export default function InfoTips() {
  const [tip, setTip] = useState(null);
  const timer = useRef(0), current = useRef(null);
  useEffect(() => {
    const show = (el) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const r = el.getBoundingClientRect();
        current.current = el;
        setTip({ text: el.dataset.info, x: r.left + r.width / 2, top: r.top, bottom: r.bottom, on: true });
      }, 150);
    };
    const hide = () => { clearTimeout(timer.current); current.current = null; setTip((t) => (t ? { ...t, on: false } : t)); };
    const over = (e) => { const el = e.target.closest?.('[data-info]'); if (el && el !== current.current) show(el); else if (!el && current.current) hide(); };
    const focus = (e) => { const el = e.target.closest?.('[data-info]'); el ? show(el) : hide(); };
    document.addEventListener('pointerover', over);
    document.addEventListener('focusin', focus);
    document.addEventListener('focusout', hide);
    window.addEventListener('scroll', hide, { passive: true, capture: true });
    return () => {
      document.removeEventListener('pointerover', over); document.removeEventListener('focusin', focus); document.removeEventListener('focusout', hide);
      window.removeEventListener('scroll', hide, { capture: true }); clearTimeout(timer.current);
    };
  }, []);
  const ref = useRef(null);
  const [pos, setPos] = useState(null);
  useEffect(() => {
    if (!tip || !ref.current) return;
    const w = ref.current.offsetWidth, h = ref.current.offsetHeight, M = 8, G = 8;
    const below = tip.top - G - h < M;
    setPos({ left: Math.max(M, Math.min(tip.x - w / 2, window.innerWidth - M - w)), top: below ? tip.bottom + G : tip.top - G - h });
  }, [tip]);
  if (!tip) return null;
  return (
    <div ref={ref} className="d-info type-label-lg-regular" role="tooltip" data-on={tip.on && pos ? '' : undefined}
      style={pos ? { left: pos.left, top: pos.top } : { left: -9999, top: 0 }}>{tip.text}</div>
  );
}
