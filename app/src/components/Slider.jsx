'use client';
import { useEffect, useId, useRef, useState } from 'react';
import c from '@/tokens/components.json';
import { rec } from '@/lib/rec';
import '@/styles/components.css';
import './slider.css';

// Slider, built from its spec: components/slider.json → (npm run tokens) → components.json + components.css (--sl-*).
// Change the spec, not this file. Docs: docs/components/slider.md, page /components/slider.
//
// The track is drawn here; each thumb is a native <input type=range> laid over it (transparent, pointer-events
// off except on the thumb), so role, aria-value*, focus and Tab order are the browser's. A press on the
// rest of the 44 tall row jumps the nearest thumb there and carries on as a drag.
//
//   <Slider label="Opacity" value={v} onChange={setV} unit="%" field limits />
//   <Slider label="Range" range defaultValue={[20, 60]} ticks />
//
// value / defaultValue  a number, or [low, high] for a range slider (controlled or not)
// onChange(value)       on every change · onChangeEnd(value): drag end, key press, field commit
// min · max · step      the scale (default 0 · 100 · 1)
// unit · format(v)      readout text: unit is appended; format replaces it
// label                 shown above; also the accessible name (aria-label, or ariaLabel, when there is no label)
// readout               value at the right of the label row (default true; hidden when `field` is on)
// ticks                 true: a mark per step (10 even marks past 20 steps) · a number: that many intervals
// limits                min and max labels under the track · field: number field(s) beside the track
// disabled · state      'hover' | 'active' | 'focus' forces a look (docs)
const TY = c.slider.types;
const decimals = (n) => (String(n).split('.')[1] || '').length;

function NumField({ value, set, min, max, step, label, disabled }) {
  const [draft, setDraft] = useState(null);
  const commit = () => { if (draft === null) return; const n = parseFloat(draft); setDraft(null); if (Number.isFinite(n)) set(n, true); };
  return (
    <input className={`sl-field lit ${TY.field}`} type="number" inputMode="decimal" min={min} max={max} step={step} value={draft ?? String(value)}
      aria-label={label} disabled={disabled}
      onChange={(e) => { const t = e.target.value; setDraft(t); const n = parseFloat(t); if (Number.isFinite(n) && n >= min && n <= max) set(n); }}
      onBlur={commit} onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
      {...rec('slider number field', [['background', 'fill/primary'], ['border', 'border/primary'], ['border · hover', 'border/primary-hover'], ['border · focus', 'border/focus'], ['radius', 'radius/lg'], ['height', 'size/control/xs'], ['type', 'type/body/md/regular'], ['light', 'light/cursor']])} />
  );
}

export default function Slider({ label, ariaLabel: ariaLabelProp, 'aria-label': ariaLabelAlt, value, defaultValue, onChange, onChangeEnd, min = 0, max = 100, step = 1, unit = '', format,
  readout = true, ticks, limits, field, disabled, state, className = '' }) {
  const ariaLabel = ariaLabelAlt ?? ariaLabelProp, range = Array.isArray(value ?? defaultValue);
  const [own, setOwn] = useState(defaultValue ?? (range ? [min, max] : min));
  const val = value ?? own;
  // drag: null (idle) or { i: the thumb, mode: 'native' (the browser drags the real thumb) | 'custom' (a press on the track: we move it), id: the pointer }.
  // One object, so the thumb, the mode and the pointer can never disagree.
  const [drag, setDrag] = useState(null), [focusI, setFocusI] = useState(null), [last, setLast] = useState(0);
  const box = useRef(null), inputs = useRef([]);
  const lid = useId();

  const dp = Math.max(decimals(step), decimals(min));
  const snap = (v) => +Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min)).toFixed(dp);
  const fmt = (v) => (format ? format(v) : `${v}${unit}`);
  const thumbs = range ? val : [val];
  const pct = (v) => (max === min ? 0 : (v - min) / (max - min));

  const setThumb = (i, raw, end) => {
    const v = snap(raw);
    const next = range ? (i === 0 ? [Math.min(v, val[1]), val[1]] : [val[0], Math.max(v, val[0])]) : v;
    if (value === undefined) setOwn(next);
    onChange?.(next);
    if (end) onChangeEnd?.(next);
  };
  // Pointer handlers outlive a render: they call the latest closure through refs.
  const live = useRef({});
  live.current = { setThumb, val, onChangeEnd };
  const fromX = (x) => {
    const r = box.current.getBoundingClientRect(), t = parseFloat(getComputedStyle(box.current).getPropertyValue('--sl-thumb-size')) || 20;
    return min + Math.min(1, Math.max(0, (x - r.left - t / 2) / (r.width - t))) * (max - min);
  };

  const down = (e) => {
    if (disabled || (e.button && e.button > 0)) return;
    const native = e.target.closest?.('input');
    if (native) { const i = +native.dataset.i; setDrag({ i, mode: 'native', id: e.pointerId }); setLast(i); return; }
    const v = fromX(e.clientX);
    const cur = range ? live.current.val : [live.current.val];
    const da = Math.abs(v - cur[0]), db = range ? Math.abs(v - cur[1]) : Infinity;
    const i = da < db ? 0 : db < da ? 1 : v < cur[0] ? 0 : 1;
    setThumb(i, v); setDrag({ i, mode: 'custom', id: e.pointerId }); setLast(i);
    inputs.current[i]?.focus({ preventScroll: true });
    e.preventDefault();
  };
  useEffect(() => {
    if (drag === null) return;
    const move = (e) => { if (e.pointerId === drag.id && drag.mode === 'custom') live.current.setThumb(drag.i, fromX(e.clientX)); };
    const up = (e) => { if (e.pointerId !== drag.id) return; setDrag(null); live.current.onChangeEnd?.(live.current.val); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
  }, [drag]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (disabled && drag) setDrag(null); }, [disabled, drag]); // disabling mid-drag ends it

  // Keys: arrows one step · Shift ×10 · Page Up/Down 10% of the range · Home/End the allowed ends.
  const key = (i) => (e) => {
    if (disabled || e.ctrlKey || e.metaKey || e.altKey) return;
    const big = e.shiftKey ? step * 10 : step, page = Math.max(step, (max - min) / 10), cur = thumbs[i];
    const lo = range && i === 1 ? val[0] : min, hi = range && i === 0 ? val[1] : max;
    const to = { ArrowRight: cur + big, ArrowUp: cur + big, ArrowLeft: cur - big, ArrowDown: cur - big, PageUp: cur + page, PageDown: cur - page, Home: lo, End: hi }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    setThumb(i, to, true);
  };

  const nSteps = Math.round((max - min) / step);
  const nTicks = ticks === true ? (nSteps <= 20 ? nSteps : 10) : ticks ? +ticks : 0;
  const lo = range ? val[0] : min, hi = range ? val[1] : val;
  const top = range ? (val[0] === val[1] ? (val[1] >= max ? 0 : val[0] <= min ? 1 : last) : last) : 0;
  const nameOf = (i) => (range ? `${label || ariaLabel || 'Value'} ${i === 0 ? 'minimum' : 'maximum'}` : undefined);
  const style = { '--p0': range ? pct(val[0]) : 0, '--p1': pct(range ? val[1] : val) };
  const showReadout = readout && !field && label !== undefined;
  const fieldProps = (i) => ({ value: thumbs[i], set: (n, end) => setThumb(i, n, end), min: range && i === 1 ? val[0] : min, max: range && i === 0 ? val[1] : max, step, disabled,
    label: range ? nameOf(i) : (label || ariaLabel || 'Value') });
  const kind = range ? 'range' : 'single';

  return (
    <div className={`sl ${className}`.trim()} role={range ? 'group' : undefined} aria-labelledby={range && label ? lid : undefined} aria-label={range && !label ? ariaLabel : undefined}
      data-range={range || undefined} data-disabled={disabled || undefined} data-state={state} data-drag={drag !== null || undefined} data-ticks={nTicks > 0 || undefined}
      data-component="slider" style={style}
      {...rec(`slider · ${kind}`, [['track', 'fill/primary'], ['track border', 'border/secondary'], ['range', 'fill/inverse-active'], ['thumb', 'fill/inverse'], ['thumb · hover', 'fill/inverse-hover'], ['thumb · dragging', 'fill/inverse-active'], ['effect', 'effect · inner-shade'], ['focus', 'border/focus'], ['hit area', 'size/target'], ['label', 'type/label/md/medium']])}>
      {(label || showReadout) && (
        <div className="sl-head">
          <span id={lid} className={`sl-label ${TY.label}`}>{label}</span>
          {showReadout && <span className={`sl-value ${TY.value}`} aria-hidden>{range ? `${fmt(val[0])} – ${fmt(val[1])}` : fmt(val)}</span>}
        </div>
      )}
      <div className="sl-row">
        {field && range && <NumField {...fieldProps(0)} />}
        <div className="sl-main">
          <div className="sl-box" ref={box} onPointerDown={down}>
            <span className="sl-track" aria-hidden><i className="sl-fill" /></span>
            {Array.from({ length: nTicks > 0 ? nTicks + 1 : 0 }, (_, k) => {
              const v = min + (k * (max - min)) / nTicks;
              return <i key={k} className="sl-tick" style={{ '--p': k / nTicks }} data-on={v >= lo && v <= hi || undefined} aria-hidden />;
            })}
            {thumbs.map((v, i) => (
              <input key={i} ref={(el) => { inputs.current[i] = el; }} className="sl-in" type="range" min={min} max={max} step={step} value={v} disabled={disabled}
                data-i={i} data-drag={drag?.i === i || undefined} style={{ zIndex: i === top ? 2 : 1 }}
                aria-labelledby={range ? undefined : label ? lid : undefined} aria-label={range ? nameOf(i) : label ? undefined : ariaLabel}
                aria-valuetext={fmt(v)}
                onChange={(e) => setThumb(i, +e.target.value)} onKeyDown={key(i)}
                onFocus={(e) => { setLast(i); if (e.target.matches(':focus-visible')) setFocusI(i); }} onBlur={() => setFocusI(null)} />
            ))}
            {thumbs.map((v, i) => (
              <span key={i} className={`sl-tip lit ${TY.tip}`} style={{ '--p': pct(v) }} data-show={drag?.i === i || focusI === i || undefined} aria-hidden
                {...rec('slider value tag', [['background', 'fill/elevated'], ['border', 'border/tertiary'], ['radius', 'radius/md'], ['type', 'type/label/md/medium'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']])}>{fmt(v)}</span>
            ))}
          </div>
          {limits && <div className={`sl-limits ${TY.limit}`} aria-hidden><span>{fmt(min)}</span><span>{fmt(max)}</span></div>}
        </div>
        {field && <NumField {...fieldProps(range ? 1 : 0)} />}
      </div>
    </div>
  );
}
