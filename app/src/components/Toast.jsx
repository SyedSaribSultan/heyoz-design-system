'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import Button from './Button';
import Lucide, { lucide } from '@/lib/Lucide';
import cssTime from '@/lib/cssTime';
import { rec } from '@/lib/rec';
import c from '@/tokens/components.json';
import '@/styles/components.css';
import { TOAST } from './toast-config';
import './toast.css';

// Toast, built from its spec: components/toast.json → (npm run tokens) → components.json + components.css.
// Change the spec, not this file. Docs: docs/components/toast.md.
//
//   <Toaster />                              once, in the root layout (a second one renders nothing)
//   toast('Saved')                           neutral · toast.success / .warning / .critical / .info set the type
//   toast.success('Clip added', { description, action: { label: 'Undo', onClick }, duration, icon, id, dismissible })
//   toast.dismiss(id) · toast.dismiss()      close one · close all
// Same id = update in place (its timer restarts). duration in ms, Infinity keeps it. Returns the id.
// Time: 5000; with an action 10000; critical stays. Pauses while the pointer or focus is in the toaster and while the tab is hidden.
// Stack: at most 3, newest at the bottom. F8 focuses the toaster; Esc on a toast closes it and gives focus back.
// Specimen for the docs: <ToastCard static …> draws one card (no timer, stack or keys) and leaves the Tab order.
const spec = c.toast;
const TY = spec.types;
const ICON = { neutral: null, success: 'circle-check', warning: 'triangle-alert', critical: 'octagon-alert', info: 'info' };
const TONE = { neutral: 'content/secondary', success: 'content/success', warning: 'content/warning', critical: 'content/critical', info: 'content/info' };

// ─── The store: no provider, so toast() works from anywhere ──────────────────────────────────────────────────
let items = [], nextId = 1;
const subs = new Set(), EMPTY = [];
const emit = () => { items = [...items]; subs.forEach((f) => f()); };
const subscribe = (f) => { subs.add(f); return () => subs.delete(f); };

function dismiss(id) {
  const out = id == null ? items.filter((t) => !t.leaving) : items.filter((t) => t.id === id && !t.leaving);
  if (!out.length) return;
  out.forEach((t) => { t.leaving = true; });
  emit();
  setTimeout(() => { items = items.filter((t) => !out.includes(t)); emit(); }, cssTime('--duration-fast', 120)); // leave = a fade (D-031), then the stack closes up
}

function push(type, message, opts = {}) {
  if (typeof window === 'undefined') return undefined;
  const id = opts.id ?? `t${nextId++}`, old = items.find((t) => t.id === id && !t.leaving);
  const next = { dismissible: true, ...opts, id, type, message, version: (old?.version || 0) + 1 };
  if (old) items = items.map((t) => (t === old ? next : t));
  else items = [...items.filter((t) => t.id !== id), next];
  // a fourth toast removes the oldest one that is not critical (critical goes last)
  const live = items.filter((t) => !t.leaving);
  for (let n = live.length - TOAST.max; n > 0; n--) { const gone = live.find((t) => t.type !== 'critical') || live[0]; live.splice(live.indexOf(gone), 1); dismiss(gone.id); }
  emit();
  return id;
}
export const toast = Object.assign((message, opts) => push('neutral', message, opts), {
  success: (m, o) => push('success', m, o), warning: (m, o) => push('warning', m, o),
  critical: (m, o) => push('critical', m, o), info: (m, o) => push('info', m, o), dismiss,
});

const lifetime = (t) => t.duration ?? (t.type === 'critical' ? Infinity : t.action ? TOAST.actionDuration : TOAST.duration);

// ─── One card ────────────────────────────────────────────────────────────────────────────────────────────────
// onAction / onClose: handlers for the two Buttons. tone is read from type. Presentational: no timer, no store.
export function ToastCard({ type = 'neutral', message, description, icon, action, onAction, onClose, dismissible = true, leaving, static: isStatic, cardRef, ...rest }) {
  const name = icon === undefined ? ICON[type] : icon;
  const card = (
    <div ref={cardRef} className="tst-card lit" data-type={type} data-leaving={leaving || undefined} inert={isStatic || undefined} {...rest}
      {...rec(`toast · ${type}`, [['background', 'surface/tertiary'], ['border', 'border/tertiary'], ['radius', 'radius/xl'], ['padding y', 'space/12'], ['padding left', 'space/16'], ['padding right', 'space/12'], ['gap', 'space/8'],
        ['icon', `size/icon/md · ${TONE[type]}`], ['effect', 'effect · inner-shade'], ['effect', 'effect · drop-md'], ['light', 'light/cursor']])}>
      {name && <span className="tst-icon"><Lucide name={name} size="md" /></span>}
      <div className="tst-text">
        <p className={`tst-msg ${TY.message}`}>{message}</p>
        {description && <p className={`tst-desc ${TY.description}`}>{description}</p>}
      </div>
      {action && <Button type="secondary" size="2xs" onClick={onAction}>{action.label}</Button>}
      {dismissible && <Button type="ghost" size="2xs" icon={lucide('x')} label="Dismiss notification" onClick={onClose} />}
    </div>
  );
  return isStatic ? <div className="tst tst-frame">{card}</div> : card; // the live card sits in the toaster, which carries the variables
}

// ─── One toast in the stack: timer, swipe, keys ──────────────────────────────────────────────────────────────
function Item({ t, offset, paused, restore, onSize }) {
  const wrap = useRef(null), card = useRef(null), drag = useRef(null);
  const left = useRef(lifetime(t)), since = useRef(0);

  // Timer: pauses (keeping what is left) while the toaster is hovered, focused or hidden. A new version restarts it.
  useEffect(() => { left.current = lifetime(t); }, [t.version]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (t.leaving || paused || !Number.isFinite(left.current)) return;
    since.current = Date.now();
    const id = setTimeout(() => dismiss(t.id), left.current);
    return () => { clearTimeout(id); left.current -= Date.now() - since.current; };
  }, [paused, t.leaving, t.id, t.version]); // eslint-disable-line react-hooks/exhaustive-deps

  // Report this toast's height, so the ones above it can sit over it.
  useLayoutEffect(() => {
    const el = wrap.current, report = () => onSize(t.id, el.offsetHeight);
    report();
    const ro = new ResizeObserver(report); ro.observe(el);
    return () => { ro.disconnect(); onSize(t.id, null); };
  }, [t.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => { const had = card.current?.contains(document.activeElement); dismiss(t.id); if (had) restore(); };
  const act = () => { t.action?.onClick?.(); if (t.action?.dismiss !== false) close(); };

  // Swipe (touch and pen): the card follows the finger; past `swipe` px it goes, otherwise it springs back.
  const down = (e) => {
    if (e.pointerType === 'mouse' || e.target.closest('button')) return;
    drag.current = { x: e.clientX, dx: 0 }; e.currentTarget.setPointerCapture(e.pointerId); card.current.dataset.dragging = '';
  };
  const move = (e) => {
    if (!drag.current) return;
    drag.current.dx = e.clientX - drag.current.x; card.current.style.setProperty('--tst-drag', `${drag.current.dx}px`);
  };
  const up = () => {
    if (!drag.current) return;
    const { dx } = drag.current; drag.current = null; delete card.current.dataset.dragging;
    if (Math.abs(dx) > TOAST.swipe) { card.current.style.setProperty('--tst-drag', `${Math.sign(dx) * TOAST.swipe}px`); dismiss(t.id); }
    else card.current.style.removeProperty('--tst-drag');
  };
  const key = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(); } };

  return (
    <li ref={wrap} className="tst-item" data-light-root="" style={{ '--tst-offset': offset }} onKeyDown={key}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <ToastCard role={t.type === 'critical' ? 'alert' : 'status'} cardRef={card} type={t.type} message={t.message} description={t.description} icon={t.icon} action={t.action} onAction={act} onClose={close}
        dismissible={t.dismissible} leaving={t.leaving} />
    </li>
  );
}

// ─── The toaster: one fixed corner region ────────────────────────────────────────────────────────────────────
let host = null; // only the first mounted Toaster renders
export function Toaster() {
  const list = useSyncExternalStore(subscribe, () => items, () => EMPTY);
  const [mine, setMine] = useState(false), [hover, setHover] = useState(false), [focus, setFocus] = useState(false), [hidden, setHidden] = useState(false);
  const [heights, setHeights] = useState({});
  const region = useRef(null), back = useRef(null);

  useEffect(() => { const me = {}; if (!host) { host = me; setMine(true); } return () => { if (host === me) host = null; }; }, []);
  useEffect(() => {
    const vis = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', vis); vis();
    return () => document.removeEventListener('visibilitychange', vis);
  }, []);
  const restore = useCallback(() => { const el = back.current; if (el && el.isConnected) el.focus({ preventScroll: true }); back.current = null; }, []);
  // F8: move focus into the toaster, newest toast first.
  useEffect(() => {
    if (!mine) return;
    const onKey = (e) => {
      if (e.key !== 'F8' || e.defaultPrevented) return;
      const el = region.current?.querySelector('.tst-item:last-child button');
      if (!el) return;
      e.preventDefault(); if (!region.current.contains(document.activeElement)) back.current = document.activeElement; el.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mine]);
  const onSize = useCallback((id, h) => setHeights((s) => {
    if (h == null) { if (!(id in s)) return s; const { [id]: _gone, ...rest } = s; return rest; }
    return s[id] === h ? s : { ...s, [id]: h };
  }), []);

  if (!mine) return null;
  // Stack: the newest sits at the bottom; every older toast rises by the heights above its slot plus one gap each.
  const rows = list.map((t, i) => {
    const above = list.slice(i + 1);
    return [t, `calc(var(--tst-region-gap) * ${above.length} + ${above.reduce((n, a) => n + (heights[a.id] || 0), 0)}px)`];
  });
  return (
    <section ref={region} className="tst tst-region" aria-label="Notifications (F8)" aria-live="polite" aria-relevant="additions text" data-focus-allow="" data-component="toast" data-name="toaster"
      onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}
      onFocus={(e) => { if (!region.current.contains(e.relatedTarget)) back.current = e.relatedTarget; setFocus(true); }}
      onBlur={(e) => { if (!region.current.contains(e.relatedTarget)) setFocus(false); }}
      {...rec('toaster', [['width', 'layout · 360px'], ['inset', 'space/24'], ['gap', 'space/8'], ['rise', 'space/12']])}>
      <ol className="tst-list">
        {rows.map(([t, offset]) => <Item key={t.id} t={t} offset={offset} paused={hover || focus || hidden} restore={restore} onSize={onSize} />)}
      </ol>
    </section>
  );
}
