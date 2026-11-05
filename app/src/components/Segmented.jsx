'use client';
import { useRef } from 'react';
import Button from './Button';
import useIndicator from '@/lib/useIndicator';

// Segmented control, built from the Button component: the options are buttons of one size; the chosen
// one reads as a tertiary button. The frame follows the nesting rule: outer radius = button radius +
// padding, so the corners stay parallel.
// Motion (D-032): the tertiary look is one indicator (a real tertiary Button surface) that slides from
// the old option to the new one; the chosen option itself paints no fill, so nothing flashes.
// items: [[value, label]] · off: values to disable (they stay in place, so nothing shifts)
export default function Segmented({ label, items, value, onChange, cols, off = [], size = 'xs' }) {
  const ref = useRef(null);
  const { vars, ready, moving } = useIndicator(ref, '[aria-checked="true"]', [value, items.length, cols, size]);
  return (
    <div ref={ref} className="seg lit" role="radiogroup" aria-label={label} data-size={size} data-indicator-ready={ready || undefined} data-indicator-moving={moving || undefined}
      style={{ gridTemplateColumns: `repeat(${cols || items.length}, minmax(0, 1fr))` }}
      data-name={`segmented · ${size}`} data-tokens={JSON.stringify([['background', 'surface/primary'], ['border', 'border/primary'], ['padding', 'space/4'], ['gap', 'space/4'], ['indicator', 'button · tertiary (slides, D-032)']])}>
      <span className="btn seg-thumb motion-indicator" data-type="tertiary" data-size={size} data-shape="squircle" data-component="button" data-name={`segmented indicator · tertiary · ${size}`} style={vars} aria-hidden />
      {items.map(([v, text]) => (
        <Button key={v} block size={size} type={v === value ? 'tertiary' : 'ghost'} role="radio" aria-checked={v === value}
          disabled={off.includes(v)} onClick={() => onChange(v)}>{text}</Button>
      ))}
    </div>
  );
}
