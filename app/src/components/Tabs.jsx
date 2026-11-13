'use client';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import useIndicator from '@/lib/useIndicator';
import useRoving from '@/lib/useRoving';
import c from '@/tokens/components.json';
import './tabs.css';

// Tabs: switch between views of content, one at a time. Spec: components/tabs.json → (npm run tokens) →
// --tab-* variables and type classes. Docs: docs/components/tabs.md.
// One underline (a real element) slides to the selected tab (D-032); it is the only selected style.
//
// <Tabs label="Project" value={tab} onChange={setTab} items={[
//   { value: 'assets', label: 'Assets', icon: lucide('image'), count: 12, panel: <Assets /> },
//   { value: 'brand', label: 'Brand', panel: <Brand /> },
//   { value: 'old', label: 'Archive', off: true, panel: null } ]} />
// items:      { value, label, icon (svg url), count (number or short text), off (disabled), panel (content),
//               state ('hover' | 'active' forces a look, for the docs) }
//             a tab with no panel (panel undefined) is a plain tab: no aria-controls, the caller shows the content
// value:      the selected value (controlled) · defaultValue: the first enabled one when uncontrolled · onChange(value)
// activation: 'auto' (arrows move and select) | 'manual' (arrows move focus, Enter / Space select)
// label or aria-label: the tab list's name · className: on the root
// size:       'md' (40, default) | 'sm' (32) · stretch: the tabs share the full width
// Keyboard:   one Tab stop (the selected tab); Left / Right move, Home / End jump, wrapping, disabled skipped.
const TABS = c.tabs;

export default function Tabs({ label, 'aria-label': ariaLabel, items, value, defaultValue, onChange, activation = 'auto', size = 'md', stretch, className = '' }) {
  const uid = useId();
  const [inner, setInner] = useState(defaultValue ?? items.find((i) => !i.off)?.value);
  const current = value !== undefined ? value : inner;
  const select = (v) => { if (value === undefined) setInner(v); if (v !== current) onChange?.(v); };

  const trackRef = useRef(null), listRef = useRef(null), first = useRef(true);
  const { vars, ready, moving } = useIndicator(trackRef, '[aria-selected="true"]', [current, items.length, size, stretch]);

  // Edge fades: an edge fades only while more tabs are behind it.
  const [fade, setFade] = useState({ start: false, end: false });
  const measure = useCallback(() => {
    const l = listRef.current;
    if (!l) return;
    const start = l.scrollLeft > 1, end = l.scrollLeft + l.clientWidth < l.scrollWidth - 1;
    setFade((f) => (f.start === start && f.end === end ? f : { start, end }));
  }, []);
  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(listRef.current);
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure, items.length, size, stretch]);

  // The selected tab scrolls into view (clear of the fades) when it changes; never on the first paint.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const l = listRef.current, el = trackRef.current?.querySelector('[aria-selected="true"]');
    if (!l || !el) return;
    const cs = getComputedStyle(l), room = parseFloat(cs.getPropertyValue('--tab-list-fade')) || 0, pad = parseFloat(cs.paddingLeft) || 0;
    const left = el.offsetLeft + pad, right = left + el.offsetWidth;
    let to = null;
    if (left - room < l.scrollLeft) to = left - room;
    else if (right + room > l.scrollLeft + l.clientWidth) to = right + room - l.clientWidth;
    if (to !== null) l.scrollTo({ left: Math.max(0, to), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [current]);

  const stop = items.some((i) => i.value === current && !i.off) ? current : items.find((i) => !i.off)?.value;
  const { onKeyDown } = useRoving({ ref: trackRef, item: '[role="tab"]', axis: 'x', activate: activation === 'auto' ? 'click' : 'focus' });

  const labelClass = TABS.types[`tab-${size}`];
  const id = (v, part) => `${uid}-${part}-${String(v).replace(/\s+/g, '-')}`;
  return (
    <div className={`tabs ${className}`.trim()} data-size={size} data-stretch={stretch || undefined} data-component="tabs" data-name={`tabs · ${size}${stretch ? ' · stretch' : ''}`}
      data-tokens={JSON.stringify([['baseline', 'border/primary'], ['baseline width', 'stroke/1'], ['indicator', 'content/primary · stroke/2 (slides, D-032)'], ['label colour', 'content/secondary'], ['label colour · selected', 'content/primary'], ['gap', 'space/4'], ['clip room', 'stroke/2']])}>
      <div ref={listRef} className="tabs-list" onScroll={measure} data-fade-start={fade.start || undefined} data-fade-end={fade.end || undefined}>
        <div ref={trackRef} className="tabs-track" role="tablist" aria-label={ariaLabel ?? label} aria-orientation="horizontal" onKeyDown={onKeyDown}
          data-indicator-ready={ready || undefined} data-indicator-moving={moving || undefined}>
          <span className="tabs-ink motion-indicator" style={vars} aria-hidden />
          {items.map((it) => (
            <button key={it.value} type="button" role="tab" id={id(it.value, 'tab')} className={`tabs-tab ${labelClass}`} aria-selected={it.value === current}
              aria-controls={it.panel !== undefined ? id(it.value, 'panel') : undefined} tabIndex={it.value === stop ? 0 : -1} disabled={it.off} data-state={it.state}
              onClick={() => select(it.value)}>
              {it.icon && <span className="tabs-icon" style={{ '--icon': `url(${it.icon})` }} aria-hidden />}
              <span className="tabs-label">{it.label}</span>
              {it.count != null && <span className="tabs-count type-label-md-medium">{it.count}</span>}
            </button>
          ))}
        </div>
      </div>
      {items.map((it) => it.panel !== undefined && (
        <div key={it.value} role="tabpanel" id={id(it.value, 'panel')} aria-labelledby={id(it.value, 'tab')} tabIndex={0} hidden={it.value !== current} className="tabs-panel motion-fade">{it.panel}</div>
      ))}
    </div>
  );
}
