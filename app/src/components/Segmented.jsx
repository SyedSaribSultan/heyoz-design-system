'use client';
import { useRef, useState } from 'react';
import Button from './Button';
import useIndicator from '@/lib/useIndicator';
import useRoving from '@/lib/useRoving';
import './segmented.css';

// Segmented control, built from the Button component: the options are buttons of one size; the chosen
// one reads as a tertiary button. Spec: components/segmented.json → (npm run tokens) → --seg-* variables.
// The frame follows the nesting rule: outer radius = button radius + padding, so the corners stay parallel.
// Motion (D-032): the tertiary look is one indicator (a real tertiary Button surface) that slides from
// the old option to the new one; the chosen option itself paints no fill, so nothing flashes.
//
// <Segmented label="Speed" items={[[1, '1×'], [2, '2×']]} value={v} onChange={setV} />
// items:    [[value, label, extra?]] · extra: { icon: svg url, label: accessible name (icon-only), off: true, state: 'hover' | 'active' forces a look, for the docs }
//           label '' or null with an icon = an icon-only option (square); it needs extra.label for its name
// off:      values to disable (they stay in place, so nothing shifts) · disabled: the whole group
// value / defaultValue: controlled or not · onChange(value) · label or aria-label: the group's name · className: on the root
// size:     2xs … 2xl, Button's sizes (default xs) · cols: a grid of n columns (1 = a column)
// fit:      hug the options instead of filling the container (each option as wide as its content)
// Keyboard: one Tab stop (the chosen option); arrows move and choose, Home / End jump, wrapping, disabled skipped.
export default function Segmented({ label, 'aria-label': ariaLabel, items, value, defaultValue, onChange, cols, off = [], size = 'xs', fit, disabled, className = '' }) {
  const ref = useRef(null);
  const [inner, setInner] = useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const choose = (v) => { if (value === undefined) setInner(v); onChange?.(v); };
  const { vars, ready, moving } = useIndicator(ref, '[aria-checked="true"]', [cur, items.length, cols, size, fit]);
  const isOff = (v, x) => !!disabled || off.includes(v) || !!x?.off;
  // the one Tab stop: the chosen option, or the first enabled one when none is chosen (or the chosen one is off)
  const stop = items.some(([v, , x]) => v === cur && !isOff(v, x)) ? cur : items.find(([v, , x]) => !isOff(v, x))?.[0];
  const { onKeyDown } = useRoving({ ref, item: '[role="radio"]' });

  const style = cols ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : fit ? undefined : { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` };
  return (
    <div ref={ref} className={`seg lit ${className}`.trim()} role="radiogroup" aria-label={ariaLabel ?? label} aria-disabled={disabled || undefined} data-size={size} data-fit={(fit && !cols) || undefined}
      data-indicator-ready={ready || undefined} data-indicator-moving={moving || undefined} onKeyDown={onKeyDown} style={style}
      data-name={`segmented · ${size}${fit ? ' · hug' : ''}`} data-tokens={JSON.stringify([['background', 'surface/primary'], ['border', 'border/primary'], ['padding', 'space/4'], ['gap', 'space/4'], ['radius', 'button radius + space/4'], ['effect', 'effect · inner-shade'], ['indicator', 'button · tertiary (slides, D-032)']])}>
      <span className="btn seg-thumb motion-indicator" data-type="tertiary" data-size={size} data-shape="squircle" data-component="button" data-name={`segmented indicator · tertiary · ${size}`} style={vars} aria-hidden />
      {items.map(([v, text, x]) => (
        <Button key={v} block={!fit || !!cols} size={size} type={v === cur ? 'tertiary' : 'ghost'} role="radio" aria-checked={v === cur} tabIndex={v === stop ? 0 : -1}
          icon={x?.icon} state={x?.state} label={x?.label ?? (text ? undefined : String(v))} disabled={isOff(v, x)} onClick={() => choose(v)}>{text || undefined}</Button>
      ))}
    </div>
  );
}
