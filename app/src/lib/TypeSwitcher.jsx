'use client';
import { useEffect, useRef, useState } from 'react';
import Segmented from '@/components/Segmented';
import Lucide from '@/docs/Lucide';
import usePresence from './usePresence';
import { TYPE_OPTIONS, DEFAULT_TYPE, TYPE_KEY, applyType } from './typeOptions';
import './type-switcher.css';

// Type preview (D-033): always visible, on every page. Pick a typeface and the whole app takes it.
// The choice lasts this browser session only; a new session starts from the system fonts.
export default function TypeSwitcher() {
  const [type, setType] = useState(DEFAULT_TYPE);
  const [open, setOpen] = useState(false);
  const { mounted, leaving } = usePresence(open);
  const ref = useRef(null);
  useEffect(() => { try { const s = sessionStorage.getItem(TYPE_KEY); if (s && TYPE_OPTIONS.some((o) => o.id === s)) setType(s); } catch {} }, []);
  useEffect(() => {
    if (!open) return;
    const off = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', off); window.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', off); window.removeEventListener('keydown', esc); };
  }, [open]);
  const pick = (id) => { setType(id); applyType(id); try { sessionStorage.setItem(TYPE_KEY, id); } catch {} };
  const current = TYPE_OPTIONS.find((o) => o.id === type) || TYPE_OPTIONS[0];
  const items = TYPE_OPTIONS.map((o) => [o.id, <span key={o.id} className="ts-opt"><span style={{ fontFamily: `var(${o.display}), system-ui, sans-serif` }}>{o.name}</span><span className="ts-note">{o.kind} · {o.note}</span></span>]);
  return (
    <div ref={ref} className="ts" data-light-root>
      {mounted && (
        <div className="ts-panel lit motion-pop" data-leaving={leaving || undefined} style={{ '--motion-pop-from': '4px', '--motion-pop-origin': 'bottom right' }}
          role="dialog" aria-label="Typeface preview" data-name="type preview · lit" data-tokens={JSON.stringify([['background', 'surface/secondary'], ['border', 'border/secondary'], ['radius', 'radius/xl'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']])}>
          <div className="ts-head">
            <span className="type-label-lg-medium">Typeface preview</span>
            <span className="type-label-lg-regular ts-dim">Applies to the whole app · resets each session</span>
          </div>
          <Segmented label="Typeface" cols={1} size="sm" items={items} value={type} onChange={pick} />
        </div>
      )}
      <button type="button" className="ts-trigger lit type-label-lg-medium" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="dialog"
        data-name="type preview trigger" data-tokens={JSON.stringify([['background', 'surface/secondary'], ['border', 'border/secondary'], ['type', 'type/label/lg/medium']])}>
        <Lucide name="type" /><span>{current.name}</span><Lucide name="chevron-up" className="ts-chev" />
      </button>
    </div>
  );
}
