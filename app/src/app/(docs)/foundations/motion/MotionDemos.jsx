'use client';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/Button';
import Lucide, { lucide } from '@/lib/Lucide';
import usePresence from '@/lib/usePresence';
import Segmented from '@/components/Segmented';

// Selection (D-032): one indicator slides to the chosen option, in a row or across a grid.
export function SelectionDemo() {
  const [a, setA] = useState('week');
  const [b, setB] = useState('9:16');
  return (
    <div className="d-row" style={{ gap: 'var(--space-32)', alignItems: 'flex-start' }}>
      <div className="m-sel"><Segmented label="Range" items={[['day', 'Day'], ['week', 'Week'], ['month', 'Month']]} value={a} onChange={setA} /></div>
      <div className="m-sel"><Segmented label="Aspect" cols={2} items={[['1:1', '1:1'], ['4:5', '4:5'], ['9:16', '9:16'], ['16:9', '16:9']]} value={b} onChange={setB} /></div>
    </div>
  );
}

// Popup: enters with fade + 4px drop + scale 0.98 (duration/base · easing/enter), leaves with a fade
// (duration/fast · easing/exit). The same classes every popup uses: motion-pop + data-leaving.
export function PopupDemo() {
  const [open, setOpen] = useState(false);
  const { mounted, leaving } = usePresence(open);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const off = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, [open]);
  return (
    <div ref={ref} className="m-pop-anchor">
      <Button size="sm" iconAfter={lucide('chevron-down')} onClick={() => setOpen(!open)} aria-expanded={open}>Open a popup</Button>
      {mounted && (
        <div className="m-pop motion-pop" data-leaving={leaving || undefined} role="menu">
          {['Rename', 'Duplicate', 'Brand DNA'].map((l) => <button key={l} type="button" className="m-pop-row type-body-md-regular" role="menuitem" onClick={() => setOpen(false)}>{l}</button>)}
        </div>
      )}
    </div>
  );
}

// Icon swap: the two icons crossfade while the new one slides 4px into place (duration/base · easing/standard).
export function SwapDemo() {
  return (
    <div className="d-row" style={{ gap: 'var(--space-24)' }}>
      {[['chevron-right', 'chevrons-right', 'Brand picker'], ['copy', 'check', 'Copy → done'], ['eye-off', 'eye', 'Reveal']].map(([a, b, l]) => (
        <span key={l} className="m-swap-card lit">
          <span className="motion-swap"><Lucide name={a} size="md" /><Lucide name={b} size="md" className="motion-swap-in" /></span>
          <span className="type-label-lg-medium">{l}</span>
        </span>
      ))}
    </div>
  );
}
