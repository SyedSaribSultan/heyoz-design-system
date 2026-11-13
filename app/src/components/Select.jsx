'use client';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import c from '@/tokens/components.json';
import '@/styles/components.css';
import './select.css';
import Lucide from '@/lib/Lucide';
import usePresence from '@/lib/usePresence';
import useDismiss from '@/lib/useDismiss';
import { rec } from '@/lib/rec';
import { Surface, List, normalize, leaves, stepKey, isChar, useTypeahead, useHighlight } from './Menu';

// Select, built from its spec: components/select.json → (npm run tokens) → components.json + components.css (--sel-*).
// The list is the Menu's surface, list and items (Menu.jsx, components/menu.json). Change the specs, not this file. Docs: /components/select.
//
//   <Select label="Model" options={[{ value: 'fast', label: 'Fast', icon: 'zap', description: 'Cheapest' }, …]} value={v} onChange={setV} />
//
// label        string · the field's name; always give one (or aria-label)
// options      entries: { value, label, icon (Lucide name), description, disabled } · { group: 'Name', options: [ … ] } · { type: 'separator' } · { type: 'label', label }
// value / defaultValue / onChange(value)   controlled or not
// placeholder  shown when nothing is chosen · hint · error (shows in the hint's place and marks the field invalid; '' = none yet) · invalid (red border, no message)
// size         'xs' (32, default) | 'sm' (40) | 'md' (48) · icon: a Lucide name shown in the well when nothing is chosen
// disabled · name (adds a hidden input so the value posts with a form) · id
// state        'hover' | 'open' | 'focus' forces a look, for the docs · className  on the root · aria-label  the name when there is no label
export const SELECT = c.select;
export const SIZE_NAMES = ['xs', 'sm', 'md'];
const TY = SELECT.types;
const MENU_TOKENS = [['background', 'surface/tertiary'], ['border', 'border/tertiary'], ['radius', 'radius/xl'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']];
const WELL_ROWS = (size) => [['height', `size/control/${size}`], ['radius', { xs: 'radius/lg', sm: 'radius/xl', md: 'radius/2xl' }[size]], ['padding x', { xs: 'space/12', sm: 'space/16', md: 'space/20' }[size]],
  ['gap', 'space/8'], ['type', TY[`size-${size}`].replaceAll('-', '/')], ['background', 'fill/primary'], ['border', 'border/primary'], ['border · hover', 'border/primary-hover'],
  ['border · open', 'border/primary-active'], ['border · invalid', 'border/critical'], ['effect', 'effect · inner-shade'], ['focus ring', 'border/focus'], ['text colour', 'content/primary'], ['placeholder', 'content/tertiary'], ['chevron', 'content/secondary']];

export default function Select({ label, hint, error, invalid, placeholder = 'Select…', size = 'xs', options, value, defaultValue, onChange, disabled, name, icon, id, state, className = '', 'aria-label': ariaLabel }) {
  const uid = useId(), fid = id || `sel-${uid}`, listId = `${fid}-list`, labelId = `${fid}-label`, valueId = `${fid}-value`, noteId = `${fid}-note`;
  const [inner, setInner] = useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const [open, setOpen] = useState(false);
  const hl = useHighlight(), act = hl.active, how = hl.how;
  const [client, setClient] = useState(false);
  useEffect(() => setClient(true), []);
  const { mounted, leaving, gen } = usePresence(open);
  const anchor = useRef(null), btn = useRef(null);
  const type = useTypeahead();

  const tree = useMemo(() => normalize(options, fid), [options, fid]);
  const all = leaves(tree), items = all.filter((e) => !e.disabled);
  const sel = all.find((e) => e.value === cur);
  const showError = !!error, bad = invalid || showError;

  const openList = (h) => { if (disabled) return; hl.set(sel && !sel.disabled ? sel.uid : h === 'last' ? items[items.length - 1]?.uid : items[0]?.uid ?? null, h === 'pointer' ? 'pointer' : 'kb'); setOpen(true); };
  const close = () => setOpen(false); // the highlight stays while the list fades; openList sets it again
  const choose = (e) => { if (e.disabled) return; if (e.value !== cur) { if (value === undefined) setInner(e.value); onChange?.(e.value); } close(); btn.current?.focus(); };
  const go = (to) => { hl.set(to.uid, 'kb'); requestAnimationFrame(() => document.getElementById(to.uid)?.scrollIntoView({ block: 'nearest' })); };

  // Esc, or a press outside the field and its list, closes it (the shared rule, lib/useDismiss). Esc on the field is handled below first.
  useDismiss({ open, inside: (t) => !!anchor.current?.contains(t) || !!t?.closest?.(`[data-owner="${fid}"]`), onDismiss: close });

  // The list opens with the chosen option in the middle of the view.
  useLayoutEffect(() => {
    if (!mounted || !client) return;
    const el = sel && document.getElementById(sel.uid), box = el?.closest('.mn-scroll');
    if (box) box.scrollTop = el.offsetTop - (box.clientHeight - el.offsetHeight) / 2;
  }, [mounted, client, gen]); // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDown = (e) => {
    if (disabled || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key;
    if (!open) {
      if (k === 'Enter' || k === ' ' || k === 'ArrowDown') { e.preventDefault(); openList('first'); }
      else if (k === 'ArrowUp') { e.preventDefault(); openList('last'); }
      else if (isChar(e)) { const hit = type(k, items, items.findIndex((x) => x.uid === sel?.uid)); if (hit) { e.preventDefault(); choose(hit); } } // like a native select: typing picks
      return;
    }
    if (k === 'Escape') { e.preventDefault(); close(); return; }
    if (k === 'Tab') { close(); return; }
    if (k === 'Enter' || k === ' ') { e.preventDefault(); const en = all.find((x) => x.uid === act); if (en) choose(en); else close(); return; }
    const from = act ?? sel?.uid ?? null;
    const to = stepKey(k, items, from) ?? (isChar(e) ? type(k, items, items.findIndex((x) => x.uid === from)) : undefined);
    if (to !== undefined) { e.preventDefault(); if (to) go(to); }
  };

  const hasNote = hint !== undefined || error !== undefined;
  return (
    <div className={`sel ${className}`.trim()} data-size={size} data-disabled={disabled || undefined} data-invalid={bad || undefined} data-component="select" data-name={`select · ${size}`} data-tokens={JSON.stringify(WELL_ROWS(size))}>
      {label && <span id={labelId} className={`sel-label ${TY.label}`} onClick={() => btn.current?.focus()}>{label}</span>}
      <span ref={anchor} className="sel-anchor">
        <button ref={btn} id={fid} type="button" role="combobox" className={`sel-well ${TY[`size-${size}`]}`} disabled={disabled} data-state={state}
          aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listId : undefined} aria-activedescendant={open && act ? act : undefined}
          aria-labelledby={ariaLabel ? undefined : `${label ? labelId : ''} ${valueId}`.trim()} aria-label={ariaLabel} aria-invalid={bad || undefined} aria-describedby={hasNote ? noteId : undefined}
          onClick={() => (open ? close() : openList('pointer'))} onKeyDown={onKeyDown} onKeyUp={(e) => { if (e.key === ' ') e.preventDefault(); }}>
          {(sel?.icon || (!sel && icon)) && <Lucide name={sel?.icon || icon} className="sel-icon" />}
          <span id={valueId} className="sel-value" data-placeholder={!sel || undefined}>{sel ? sel.label : placeholder}</span>
          <span className="sel-chev" aria-hidden><Lucide name="chevron-down" /><Lucide name="chevron-up" /></span>
        </button>
      </span>
      {hasNote && (
        <div id={noteId} className={`sel-msg ${TY.hint}`} aria-live="polite" data-error={showError || undefined}>
          {showError ? <><Lucide name="circle-alert" size="xs" />{error}</> : hint}
        </div>
      )}
      {name && <input type="hidden" name={name} value={cur ?? ''} />}
      {mounted && client && (
        <Surface key={gen} owner={fid} side="bottom" attached matchWidth leaving={leaving} name="select list" rect={() => anchor.current?.getBoundingClientRect()} onMouseDown={(e) => e.preventDefault()}>
          <List tree={tree} mode="listbox" listId={listId} labelledBy={label ? labelId : undefined} label={label ? undefined : ariaLabel} hl={act} how={how} selected={sel?.uid}
            onHover={(e) => hl.set(e ? e.uid : null, 'pointer')} onLeave={() => hl.set(null)} onItem={choose} />
        </Surface>
      )}
    </div>
  );
}
