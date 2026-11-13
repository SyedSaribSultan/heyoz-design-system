'use client';
import { useId } from 'react';
import c from '@/tokens/components.json';
import { rec } from '@/lib/rec';
import '@/styles/components.css';
import './progress.css';

// Progress, built from its spec: components/progress.json → (npm run tokens) → components.json + components.css (--pg-*).
// Change the spec, not this file. Docs: docs/components/progress.md, page /components/progress.
//
//   <Progress label="Uploading" value={42} />                bar, determinate: 42%
//   <Progress label="Preparing" />                           bar, indeterminate (no value)
//   <Spinner size="md" />                                    ring, indeterminate · <Spinner value={42} /> determinate
//
// Progress props   value (0–100, omit for indeterminate) · label · aria-label or ariaLabel (when there is no visible label)
//                  size sm 2 | md 4 | lg 8 · tone neutral | brand | success | critical · showValue (default true)
//                  valueText: replaces "42%" in the head row and in aria-valuetext
// Spinner props    size xs 12 | sm 16 | md 20 | lg 24 | xl 32 (the icon scale) · value · tone (also 'inherit': the text colour)
//                  label: accessible name (default "Loading") · decorative: no role, hidden from screen readers
//                  (for a spinner inside a Button, which already says it is busy)
// The ring is an icon (D-028): the same frame, the ring fills the key square (grid square, 75%), line = frame × grid stroke.
const TY = c.progress.types;
const GRID = c.iconGrid;
const clamp = (v) => Math.min(100, Math.max(0, v));

export default function Progress({ value, label, ariaLabel: ariaLabelProp, 'aria-label': ariaLabelAlt, size = 'md', tone = 'neutral', showValue = true, valueText, className = '' }) {
  const id = useId(), ariaLabel = ariaLabelAlt ?? ariaLabelProp;
  const det = typeof value === 'number';
  const n = det ? clamp(value) : 0;
  const text = valueText ?? `${Math.round(n)}%`;
  return (
    <div className={`pg pg-bar ${className}`.trim()} data-size={size} data-tone={tone} data-indeterminate={!det || undefined} data-component="progress"
      {...rec(`progress bar · ${size} · ${tone}${det ? '' : ' · indeterminate'}`, [['track', 'fill/tertiary'], ['filled', `tone · ${tone}`], ['radius', 'radius/full'], ['height', `layout · ${{ sm: 2, md: 4, lg: 8 }[size]}px`], ['label', 'type/label/md/medium'], ['motion', 'duration/base · easing/standard']])}>
      {(label || (showValue && det)) && (
        <div className="pg-head">
          <span id={id} className={`pg-label ${TY['head-label']}`}>{label}</span>
          {showValue && det && <span className={`pg-value ${TY['head-value']}`} aria-hidden>{text}</span>}
        </div>
      )}
      <div className="pg-track" role="progressbar" aria-labelledby={label ? id : undefined} aria-label={label ? undefined : ariaLabel} aria-valuemin={0} aria-valuemax={100}
        aria-valuenow={det ? Math.round(n) : undefined} aria-valuetext={det && valueText ? valueText : undefined} aria-busy={!det || n < 100 || undefined}>
        <i className="pg-fill" style={{ '--v': n / 100 }} />
      </div>
    </div>
  );
}

// The ring, drawn in a 100-unit frame so the icon grid applies at every size: key square 75, line 6.25.
const SQ = GRID.square * 100, W = GRID.stroke * 100, R = (SQ - W) / 2;
export function Spinner({ size = 'md', value, tone = 'neutral', label = 'Loading', 'aria-label': ariaLabel, decorative, className = '' }) {
  const det = typeof value === 'number';
  const n = det ? clamp(value) : 0;
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'progressbar', 'aria-label': ariaLabel ?? label, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': det ? Math.round(n) : undefined, 'aria-busy': det ? n < 100 || undefined : true };
  return (
    <span className={`pg pg-ring ${className}`.trim()} data-size={size} data-tone={tone} data-determinate={det || undefined} data-component="spinner" {...a11y}
      {...rec(`spinner · ${size}${det ? ' · determinate' : ''}`, [['frame', `size/icon/${size}`], ['ring', 'size/icon/grid/square'], ['line', 'size/icon/grid/stroke'], ['colour', `tone · ${tone}`], ['track', 'fill/tertiary-active']])}>
      <svg viewBox="0 0 100 100" aria-hidden focusable="false">
        {det && <circle className="pg-ring-track" cx="50" cy="50" r={R} strokeWidth={W} />}
        <circle className="pg-ring-arc" cx="50" cy="50" r={R} strokeWidth={W} pathLength="100" style={det ? { '--n': n, opacity: n > 0 ? 1 : 0 } : undefined} />
      </svg>
    </span>
  );
}
