'use client';
import { cloneElement, isValidElement, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import c from '@/tokens/components.json';
import '@/styles/components.css';
import './menu.css';
import Light from '@/lib/Light';
import Lucide from '@/lib/Lucide';
import usePresence from '@/lib/usePresence';
import useIndicator from '@/lib/useIndicator';
import cssTime from '@/lib/cssTime';
import { rec } from '@/lib/rec';

// Menu, built from its spec: components/menu.json → (npm run tokens) → components.json + components.css (--mn-*).
// Change the spec, not this file. Docs: docs/components/menu.md.
//
//   <Menu trigger={(p) => <Button {...p} icon={lucide('ellipsis')}>More</Button>} items={[…]} onSelect={(item) => …} />
//
// trigger   a Button (or any control): a render function (p) => element, or an element. p carries aria-haspopup,
//           aria-expanded, aria-controls, onClick, onKeyDown, onKeyUp and `state` ('active' while open: Button's pressed look;
//           drop `state` for a control that is not a Button).
// items     entries, in order:
//             { label, icon, description, shortcut, onSelect, danger, disabled, keepOpen, id }      an action
//             { label, kind: 'checkbox' | 'radio', checked, … }                                      a checkable item
//             { label, items: [ … ] }                                                                  a submenu (one level)
//             { type: 'label', label }  ·  { type: 'separator' }  ·  { group: 'Name', items: [ … ] }
//           `text` is the typeahead text when label is not a string.
// side      'bottom' (default) | 'top': the preferred side; it flips when it does not fit.
// align     'start' | 'end': which edge of the trigger the surface lines up with.
// open / defaultOpen / onOpenChange   control it from outside. onSelect(item) runs for every chosen item.
// MenuPanel is the same surface, drawn in place and not floating (docs specimens): active = the label to highlight, force = 'hover' | 'pressed' | 'focus'.
//
// The pieces below (Surface, List, normalize, leaves, useTypeahead) are exported for Select, which is built on this surface and these items.
export const MENU = c.menu;
const T = MENU.types;
const TYPE = { item: T.item, desc: T['item-description'], kbd: T['item-shortcut'], label: T.label };

// ─── Entries ────────────────────────────────────────────────────────────────
// normalize gives every entry a uid (also its DOM id) and turns { group } into a node with children.
export function normalize(entries = [], prefix) {
  let n = 0;
  const walk = (list) => list.map((e) => {
    const uid = `${prefix}-${n++}`;
    if (e.type === 'separator') return { ...e, uid };
    if (e.type === 'label') return { ...e, uid };
    if (e.group !== undefined) return { type: 'group', label: e.group, uid, children: walk(e.items || e.options || []) };
    return { ...e, type: 'item', uid };
  });
  return walk(entries);
}
export const leaves = (tree) => tree.flatMap((e) => (e.type === 'group' ? leaves(e.children) : e.type === 'item' ? [e] : []));
const textOf = (e) => String(e.text ?? (typeof e.label === 'string' ? e.label : '')).toLowerCase();

// Typeahead: letters typed within 500 ms add up; the next enabled item whose text starts with them gets the highlight.
// The same letter repeated cycles through the items that start with it.
export function useTypeahead() {
  const s = useRef({ buf: '', t: 0 });
  useEffect(() => () => clearTimeout(s.current.t), []);
  return useCallback((ch, items, from) => {
    const st = s.current;
    clearTimeout(st.t); st.buf += ch.toLowerCase(); st.t = setTimeout(() => { st.buf = ''; }, 500);
    const rep = st.buf.length > 1 && [...st.buf].every((x) => x === st.buf[0]), q = rep ? st.buf[0] : st.buf;
    const start = q.length === 1 ? from + 1 : Math.max(from, 0), n = items.length;
    for (let k = 0; k < n; k++) { const it = items[(start + k) % n]; if (textOf(it).startsWith(q)) return it; }
    return null;
  }, []);
}
export const isChar = (e) => e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey;
// Arrow keys, Home and End over the enabled items. Returns the item to go to, or undefined for any other key.
export function stepKey(key, items, active) {
  const i = items.findIndex((x) => x.uid === active), n = items.length;
  if (!n) return undefined;
  if (key === 'ArrowDown') return items[(i + 1) % n];
  if (key === 'ArrowUp') return items[i <= 0 ? n - 1 : i - 1];
  if (key === 'Home') return items[0];
  if (key === 'End') return items[n - 1];
  return undefined;
}

// ─── Placement ──────────────────────────────────────────────────────────────
// Sets left, top and max-height straight on the element, from the anchor's rectangle; no render in between.
// Below or above (flips to the roomier side when the preferred one is too short), or beside (flips left); always inside the viewport.
const num = (el, name) => parseFloat(getComputedStyle(el).getPropertyValue(name)) || 0;
function place(el, r, { side, align, attached, matchWidth }) {
  const M = num(el, '--mn-surface-viewport-margin'), cap = num(el, '--mn-surface-max-height');
  const gap = num(el, side === 'right' ? '--mn-surface-sub-offset' : attached ? '--mn-surface-offset-attached' : '--mn-surface-offset');
  const vw = document.documentElement.clientWidth, vh = window.innerHeight;
  el.style.maxHeight = ''; el.style.width = matchWidth ? `${r.width}px` : '';
  const w = el.offsetWidth, natural = el.offsetHeight;
  let x, y, used = side, avail;
  if (side === 'right') {
    used = r.right + gap + w > vw - M && r.left - gap - w >= M ? 'left' : 'right';
    x = used === 'right' ? r.right + gap : r.left - gap - w;
    avail = vh - 2 * M; y = r.top - num(el, '--mn-surface-padding');
    y = Math.max(M, Math.min(y, vh - M - Math.min(natural, Math.min(cap, avail))));
  } else {
    const below = vh - M - (r.bottom + gap), above = r.top - gap - M;
    used = side;
    if (side === 'bottom' && natural > below && above > below) used = 'top';
    else if (side === 'top' && natural > above && below > above) used = 'bottom';
    avail = used === 'bottom' ? below : above;
    const h = Math.min(natural, cap, avail);
    y = used === 'bottom' ? r.bottom + gap : r.top - gap - h;
    x = align === 'end' ? r.right - w : r.left;
    x = Math.max(M, Math.min(x, vw - M - w));
  }
  if (side === 'right') x = Math.max(M, Math.min(x, vw - M - w));
  el.style.maxHeight = `${Math.max(0, Math.min(cap, avail))}px`;
  el.style.left = `${x}px`; el.style.top = `${y}px`;
  el.dataset.side = used; el.dataset.placed = '';
}

// ─── Surface ────────────────────────────────────────────────────────────────
// The floating card: a <Light> root drawn on the popover layer (document.body), above everything, placed from its anchor.
//   rect: () => the anchor's DOMRect · side: 'bottom' | 'top' | 'right' · align: 'start' | 'end' · attached: the gap of a field's list
//   matchWidth: as wide as the anchor (Select) · inline: not floating, drawn where it is (docs) · leaving: from usePresence
export function Surface({ rect, side = 'bottom', align = 'start', attached, matchWidth, inline, leaving, owner, name = 'menu', className = '', children, ...rest }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (inline) return;
    const el = ref.current;
    const run = () => { const r = rect(); if (r) place(el, r, { side, align, attached, matchWidth }); };
    run();
    const onScroll = (e) => { if (!el.contains(e.target)) run(); };
    window.addEventListener('resize', run); window.addEventListener('scroll', onScroll, true);
    return () => { window.removeEventListener('resize', run); window.removeEventListener('scroll', onScroll, true); };
  }, [inline, side, align, attached, matchWidth]); // eslint-disable-line react-hooks/exhaustive-deps
  const node = (
    <Light ref={ref} className={`mn ${inline ? '' : 'motion-pop'} ${className}`.trim()} data-floating={inline ? undefined : ''} data-attached={attached || undefined} data-align={align}
      data-side={inline ? undefined : side} data-owner={owner} data-leaving={leaving || undefined}
      data-component="menu" {...rec(name, SURFACE_ROWS)} {...rest}>
      <Sheen />
      <div className="mn-scroll">{children}</div>
    </Light>
  );
  return inline ? node : createPortal(node, document.body);
}
const SURFACE_ROWS = [['background', 'surface/tertiary'], ['border', 'border/tertiary'], ['radius', 'radius/xl'], ['padding', 'space/4'], ['effect', 'effect · inner-shade'], ['sheen', 'content/primary · 10% (Figma effect, not a token)'], ['light', 'light/cursor']];
const ITEM_ROWS = [['height', 'size/control/xs'], ['padding x', 'space/12'], ['padding y', 'space/6'], ['gap', 'space/8'], ['radius', 'radius/lg'], ['type', 'type/body/md/regular'], ['text colour', 'content/primary'], ['icon colour', 'content/secondary'],
  ['highlight', 'fill/tertiary-hover'], ['highlight border', 'border/tertiary-hover'], ['pressed', 'fill/tertiary-active']];
function Sheen() { return <span className="mn-sheen" aria-hidden><i /><i /><i /><i /></span>; }

// ─── List ───────────────────────────────────────────────────────────────────
// Items, group labels and separators, with the one highlight indicator behind them (D-032). It only draws; the owner holds the state.
//   hl: the uid that carries the highlight now (null: none) · how: 'kb' | 'pointer' · mode: 'menu' | 'listbox'
//   onHover(entry|null, node) · onItem(entry, node) (a click) · expanded: uid of the item whose submenu is open · selected: uid of the chosen option (listbox)
//   force: 'hover' | 'pressed' | 'focus' pins that look on the indicator (docs)
export function List({ tree, mode = 'menu', hl = null, how = 'pointer', onHover, onItem, expanded, selected, force, listRef, label, labelledBy, listId, onKeyDown, onLeave, children, ...rest }) {
  const own = useRef(null), ref = listRef || own;
  const lastRef = useRef(null);
  if (hl != null) lastRef.current = hl;
  const last = lastRef.current;
  const { vars, ready, moving } = useIndicator(ref, '[data-last]', [last]);
  // The first time the highlight shows after it was hidden, it appears in place and fades in: no slide from a stale spot.
  const [snap, setSnap] = useState(false), was = useRef(false), on = hl != null;
  useLayoutEffect(() => {
    const before = was.current; was.current = on;
    if (!on || before) return;
    setSnap(true);
    let b; const a = requestAnimationFrame(() => { b = requestAnimationFrame(() => setSnap(false)); });
    return () => { cancelAnimationFrame(a); cancelAnimationFrame(b); };
  }, [on]);
  const role = mode === 'listbox' ? 'listbox' : 'menu';
  const render = (e) => {
    if (e.type === 'separator') return <div key={e.uid} role="separator" className="mn-sep" data-name="menu separator" data-tokens={SEP_ROWS} />;
    if (e.type === 'label') return <div key={e.uid} id={e.uid} role="presentation" className={`mn-group ${TYPE.label}`}>{e.label}</div>;
    if (e.type === 'group') return (
      <div key={e.uid} role="group" aria-labelledby={e.uid} className="mn-grouped">
        <div id={e.uid} className={`mn-group ${TYPE.label}`} data-name="menu group label" data-tokens={GROUP_ROWS}>{e.label}</div>
        {e.children.map(render)}
      </div>
    );
    return <Item key={e.uid} e={e} mode={mode} active={e.uid === hl} last={e.uid === last} expanded={e.uid === expanded} selected={e.uid === selected} onHover={onHover} onItem={onItem} />;
  };
  return (
    <div ref={ref} id={listId} role={role} aria-label={label} aria-labelledby={labelledBy} aria-orientation={mode === 'menu' ? 'vertical' : undefined}
      tabIndex={mode === 'menu' ? -1 : undefined} className="mn-list" data-force={force}
      data-indicator-ready={(ready && !snap) || undefined} data-indicator-moving={moving || undefined}
      onKeyDown={onKeyDown} onPointerLeave={onLeave} onMouseDown={mode === 'listbox' ? (ev) => ev.preventDefault() : undefined} {...rest}>
      <span className="mn-ind motion-indicator" style={vars} data-on={on || undefined} data-kb={how === 'kb' || undefined} aria-hidden />
      {tree.map(render)}
      {children}
    </div>
  );
}
const SEP_ROWS = JSON.stringify([['background', 'border/elevated'], ['height', 'stroke/1'], ['margin y', 'space/4']]);
const GROUP_ROWS = JSON.stringify([['type', 'type/label/sm/medium'], ['text colour', 'content/tertiary'], ['padding x', 'space/12']]);

function Item({ e, mode, active, last, expanded, selected, onHover, onItem }) {
  const listbox = mode === 'listbox', checkable = !listbox && (e.kind === 'checkbox' || e.kind === 'radio');
  const role = listbox ? 'option' : e.kind === 'checkbox' ? 'menuitemcheckbox' : e.kind === 'radio' ? 'menuitemradio' : 'menuitem';
  const sub = !!e.items;
  return (
    <div id={e.uid} role={role} tabIndex={listbox ? undefined : -1} className={`mn-item ${TYPE.item}`}
      aria-checked={checkable ? !!e.checked : undefined} aria-selected={listbox ? !!selected : undefined} aria-disabled={e.disabled || undefined}
      aria-haspopup={sub ? 'menu' : undefined} aria-expanded={sub ? expanded : undefined}
      data-danger={e.danger || undefined} data-active={active || undefined} data-last={last || undefined} data-checked={checkable ? !!e.checked : undefined} data-selected={listbox ? !!selected : undefined}
      onPointerMove={() => onHover?.(e.disabled ? null : e, document.getElementById(e.uid))} onClick={(ev) => !e.disabled && onItem?.(e, ev.currentTarget)}
      data-name={`menu item${e.danger ? ' · danger' : ''}${e.disabled ? ' · disabled' : ''}`} data-tokens={JSON.stringify(ITEM_ROWS)}>
      {checkable && <span className="mn-mark" data-kind={e.kind} aria-hidden>{e.kind === 'radio' ? <i className="mn-dot" /> : <Lucide name="check" />}</span>}
      {e.icon && <Lucide name={e.icon} className="mn-icon" />}
      <span className="mn-text">
        <span className="mn-name">{e.label}</span>
        {e.description && <span className={`mn-desc ${TYPE.desc}`}>{e.description}</span>}
      </span>
      {e.shortcut && <kbd className={`mn-kbd ${TYPE.kbd}`}>{e.shortcut}</kbd>}
      {sub && <Lucide name="chevron-right" className="mn-chev" />}
      {listbox && <Lucide name="check" className="mn-check" />}
    </div>
  );
}

// ─── One level: the items, their keys and their submenu ─────────────────────
function MenuLevel({ tree, level, owner, leaving, autoFocus, onChoose, onCloseAll, onCloseSelf, force, listId, label, labelledBy }) {
  const [active, setActive] = useState(null), [how, setHow] = useState('pointer');
  const [sub, setSub] = useState(null);
  const subLast = useRef(null); if (sub) subLast.current = sub;
  const subPresence = usePresence(!!sub);
  const listRef = useRef(null), timer = useRef(0), pend = useRef(null);
  const type = useTypeahead();
  const all = leaves(tree), items = all.filter((e) => !e.disabled);
  const byUid = (uid) => all.find((e) => e.uid === uid);
  const node = (uid) => document.getElementById(uid);
  useEffect(() => () => clearTimeout(timer.current), []);

  const go = (uid, h = 'kb') => { setActive(uid); setHow(h); if (h === 'kb' && uid) node(uid)?.focus(); };
  useEffect(() => { // where focus lands when the level opens
    if (autoFocus === 'first') go(items[0]?.uid);
    else if (autoFocus === 'last') go(items[items.length - 1]?.uid);
    else if (autoFocus === 'list') listRef.current?.focus({ preventScroll: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const delay = (key, fn) => {
    if (pend.current === key) return;
    clearTimeout(timer.current); pend.current = key;
    timer.current = setTimeout(() => { pend.current = null; fn(); }, cssTime('--duration-fast', 120));
  };
  const cancel = () => { clearTimeout(timer.current); pend.current = null; };
  const openSub = (e, how2) => { cancel(); setSub({ uid: e.uid, entry: e, focus: how2 === 'pointer' ? 'none' : 'first' }); setActive(e.uid); };
  const choose = (e, h) => {
    if (e.disabled) return;
    if (e.items) { if (h === 'click' && sub?.uid === e.uid) setSub(null); else openSub(e, h); return; }
    onChoose(e);
  };
  const hover = (e, el) => {
    if (!e) { setActive(null); setHow('pointer'); if (sub) delay('close', () => setSub(null)); else cancel(); return; }
    setActive(e.uid); setHow('pointer');
    if (document.activeElement !== el) el?.focus({ preventScroll: true });
    if (e.items) { if (sub?.uid !== e.uid) delay(e.uid, () => openSub(e, 'pointer')); else cancel(); }
    else if (sub) delay('close', () => setSub(null)); else cancel();
  };
  const closeSub = () => { const u = sub?.uid; setSub(null); if (u) go(u); };

  const onKeyDown = (ev) => {
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
    const k = ev.key, cur = byUid(active);
    if (k === 'Escape') { ev.preventDefault(); level ? onCloseSelf() : onCloseAll(true); return; }
    if (k === 'Tab') { onCloseAll(true); return; } // focus goes to the trigger first, then Tab moves on from it
    if (k === 'Enter' || k === ' ') { if (cur) { ev.preventDefault(); choose(cur, 'kb'); } return; }
    if (k === 'ArrowRight') { if (cur?.items) { ev.preventDefault(); openSub(cur, 'kb'); } return; }
    if (k === 'ArrowLeft') { if (level) { ev.preventDefault(); onCloseSelf(); } return; }
    const to = stepKey(k, items, active) ?? (isChar(ev) ? type(k, items, items.findIndex((x) => x.uid === active)) : undefined);
    if (to !== undefined) { ev.preventDefault(); if (to) go(to.uid); }
  };

  const subTree = useMemo(() => (subLast.current ? normalize(subLast.current.entry.items, `${subLast.current.uid}-s`) : []), [subLast.current?.uid]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <List tree={tree} mode="menu" hl={active ?? sub?.uid ?? null} how={how} onHover={hover} onItem={(e) => choose(e, 'click')} expanded={sub?.uid} listRef={listRef} force={force}
        listId={listId} label={label} labelledBy={labelledBy} onKeyDown={onKeyDown} onLeave={() => { cancel(); setActive(null); }} />
      {subPresence.mounted && subLast.current && (
        <Surface owner={owner} side="right" name="submenu" leaving={leaving || subPresence.leaving} rect={() => node(subLast.current.uid)?.getBoundingClientRect()}>
          <MenuLevel tree={subTree} level={level + 1} owner={owner} leaving={leaving} autoFocus={subLast.current.focus} onChoose={onChoose} onCloseAll={onCloseAll} onCloseSelf={closeSub} labelledBy={subLast.current.uid} />
        </Surface>
      )}
    </>
  );
}

// ─── Menu ───────────────────────────────────────────────────────────────────
export default function Menu({ trigger, items, side = 'bottom', align = 'start', onSelect, open: openProp, defaultOpen = false, onOpenChange, label }) {
  const id = useId(), anchor = useRef(null), listId = `${id}-menu`;
  const [openState, setOpenState] = useState(defaultOpen), open = openProp ?? openState;
  const [focus, setFocus] = useState('list');
  const [client, setClient] = useState(false);
  useEffect(() => setClient(true), []);
  const { mounted, leaving } = usePresence(open);
  const tree = useMemo(() => normalize(items, id), [items, id]);
  const set = (v) => { if (openProp === undefined) setOpenState(v); onOpenChange?.(v); };
  const focusTrigger = () => anchor.current?.querySelector('button, a[href], input, [tabindex]:not([tabindex="-1"])')?.focus();
  const close = (returnFocus = true) => { set(false); if (returnFocus) focusTrigger(); };
  const openWith = (f) => { setFocus(f); set(true); };

  // Clicking anywhere outside the trigger, the menu and its submenu closes it.
  useEffect(() => {
    if (!open) return;
    const off = (e) => { if (!anchor.current?.contains(e.target) && !e.target.closest?.(`[data-owner="${id}"]`)) set(false); };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [open, id]); // eslint-disable-line react-hooks/exhaustive-deps

  const chosen = (e) => { e.onSelect?.(e); onSelect?.(e); if (!e.keepOpen) close(true); };
  const p = {
    id: `${id}-trigger`, 'aria-haspopup': 'menu', 'aria-expanded': open, 'aria-controls': open ? listId : undefined, state: open ? 'active' : undefined,
    onClick: () => (open ? close(false) : openWith('list')),
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); if (!open) openWith('first'); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (!open) openWith('last'); }
    },
    onKeyUp: (e) => { if (e.key === ' ') e.preventDefault(); }, // a Space release must not click the button a second time
  };
  let node;
  if (typeof trigger === 'function') node = trigger(p);
  else if (isValidElement(trigger)) {
    const own = trigger.props;
    node = cloneElement(trigger, { ...p, onClick: (e) => { own.onClick?.(e); p.onClick(e); }, onKeyDown: (e) => { own.onKeyDown?.(e); p.onKeyDown(e); } });
  }
  return (
    <>
      <span ref={anchor} className="mn-anchor" data-component="menu-trigger">{node}</span>
      {mounted && client && (
        <Surface owner={id} side={side} align={align} leaving={leaving} rect={() => anchor.current?.getBoundingClientRect()}>
          <MenuLevel tree={tree} level={0} owner={id} leaving={leaving} autoFocus={focus} onChoose={chosen} onCloseAll={close} listId={listId} label={label} labelledBy={label ? undefined : `${id}-trigger`} />
        </Surface>
      )}
    </>
  );
}

// The surface and list drawn in place, for docs. active: the label of the item to highlight · force: 'hover' | 'pressed' | 'focus'.
export function MenuPanel({ items, active, force, width, style }) {
  const id = useId();
  const tree = useMemo(() => normalize(items, id), [items, id]);
  const hit = leaves(tree).find((e) => e.label === active);
  return (
    <Surface inline name="menu · specimen" style={{ width, ...style }}>
      <List tree={tree} mode="menu" hl={hit?.uid ?? null} how={force === 'focus' ? 'kb' : 'pointer'} force={force} tabIndex={undefined} />
    </Surface>
  );
}
