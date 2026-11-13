'use client';
import { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import c from '@/tokens/components.json';
import Light from '@/lib/Light';
import usePresence from '@/lib/usePresence';
import useDismiss from '@/lib/useDismiss';
import { rec } from '@/lib/rec';
import { useAnchored } from './floating';
import '@/styles/components.css';
import './tooltip.css';
import { DELAY, WARM, GRACE } from './tooltip-timing';

// Tooltip, built from its spec: components/tooltip.json → (npm run tokens) → --tt-* variables. Docs: docs/components/tooltip.md.
// One look for the whole system: the side nav and the docs site use it.
//
// <Tooltip content="Save" shortcut="Ctrl S" placement="top"><Button …/></Tooltip>
// children:   one element that accepts a ref (Button, a link, a native element). A disabled control gets no events:
//             wrap it in a focusable span, or use aria-disabled.
// content:    one short sentence (new lines are kept) · shortcut: 'Ctrl K' (split on spaces) or ['Ctrl', 'K']
// placement:  top (default) | bottom | left | right: flips and clamps to the window, fixed to it (never clipped)
// wide:       the 320 max width instead of 240 (a token's details) · delay: ms before a hover opens it (DELAY)
// ...rest:     any other props (a Popover trigger adds its own) go to the control: <Popover trigger={<Tooltip …><Button/></Tooltip>}>
// className:  on the bubble · disabled: never shows · describe: false when the text repeats the control's own label (no aria-describedby)
// Hover opens after DELAY; while "warm" (another is open, or one closed within WARM) it opens at once. Keyboard
// focus opens at once. Closes on leave (after GRACE), blur, Esc, press. Never on touch. Rules: spec rules.
const TY = c.tooltip.types;
export { DELAY, WARM, GRACE }; // (a client module's constants cannot be read by a server page: import them from tooltip-timing.js there)

let current = null; // the tooltip that is open: { close }
let warmUntil = 0;

const keysOf = (shortcut) => (Array.isArray(shortcut) ? shortcut : shortcut ? String(shortcut).split(/\s+/).filter(Boolean) : []);

// The bubble alone: used by Tooltip (floating) and by the docs (inline specimens, `as` and `placed` untouched).
export function TooltipBubble({ as: Tag = 'div', content, shortcut, wide, className = '', ...props }) {
  const keys = keysOf(shortcut);
  return (
    <Tag className={`tt ${TY.bubble} ${className}`.trim()} data-component="tooltip" data-wide={wide || undefined} {...props}
      {...rec(`tooltip${wide ? ' · wide' : ''}${keys.length ? ' · shortcut' : ''}`, [['background', 'surface/secondary'], ['border', 'border/secondary'], ['radius', 'radius/md'], ['padding', 'space/8 · space/4'], ['type', 'type/label/lg/medium'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']])}>
      <span className="tt-text">{content}</span>
      {keys.length > 0 && <span className="tt-keys">{keys.map((k, i) => <kbd key={i} className={`tt-kbd ${TY.kbd}`} {...rec('tooltip key', [['background', 'fill/tertiary'], ['border', 'border/tertiary'], ['radius', 'radius/xs'], ['type', 'type/label/md/medium']])}>{k}</kbd>)}</span>}
    </Tag>
  );
}

export default function Tooltip({ content, shortcut, placement = 'top', wide, delay = DELAY, disabled, describe = true, className = '', children, ref: outerRef, ...rest }) {
  const id = useId();
  const [node, setNode] = useState(null); // the control
  const [bubble, setBubble] = useState(null); // the floating bubble
  const [open, setOpen] = useState(false);
  const { mounted, leaving } = usePresence(open);
  const timer = useRef(0);
  const me = useRef(null);
  const refs = useRef([]); refs.current = [isValidElement(children) ? children.props.ref : null, outerRef]; // the control's own ref and the one given to Tooltip, kept
  const delayRef = useRef(delay); delayRef.current = delay;

  useAnchored({ anchor: node, float: bubble, placement, offset: '--tt-bubble-offset', margin: '--tt-bubble-margin' });

  // me: how another tooltip closes this one
  useEffect(() => {
    const self = { close: () => { clearTimeout(timer.current); setOpen(false); } };
    me.current = self;
    return () => { clearTimeout(timer.current); if (current === self) { current = null; warmUntil = performance.now() + WARM; } };
  }, []);

  const show = useCallback((now) => {
    clearTimeout(timer.current);
    const go = () => {
      if (current && current !== me.current) current.close();
      current = me.current; setOpen(true);
    };
    if (now || current || performance.now() < warmUntil) go(); else timer.current = setTimeout(go, delayRef.current);
  }, []);
  const hide = useCallback((grace = 0) => {
    clearTimeout(timer.current);
    const go = () => {
      setOpen(false);
      if (current === me.current) { current = null; warmUntil = performance.now() + WARM; }
    };
    if (grace) timer.current = setTimeout(go, grace); else go();
  }, []);

  useEffect(() => {
    if (!node) return;
    if (disabled) { hide(); return; }
    let pressed = false; // a press hides it until the pointer leaves and comes back
    const enter = (e) => { if (e.pointerType !== 'touch' && !pressed) show(false); };
    const leave = (e) => { pressed = false; if (e.pointerType !== 'touch') hide(GRACE); };
    const down = () => { pressed = true; hide(); };
    const focus = () => { if (node.matches(':focus-visible')) show(true); };
    const blur = () => hide();
    node.addEventListener('pointerenter', enter); node.addEventListener('pointerleave', leave); node.addEventListener('pointerdown', down);
    node.addEventListener('focus', focus); node.addEventListener('blur', blur);
    return () => {
      node.removeEventListener('pointerenter', enter); node.removeEventListener('pointerleave', leave); node.removeEventListener('pointerdown', down);
      node.removeEventListener('focus', focus); node.removeEventListener('blur', blur);
      hide();
    };
  }, [node, disabled, show, hide]);

  // Esc closes the tooltip and nothing else: it is read first (window, capture) and stops there. Not on the layer stack.
  useDismiss({ open, press: false, capture: true, stacked: false, onDismiss: () => hide() });

  // stable, so React never detaches and re-attaches it between renders
  const ref = useCallback((el) => { setNode(el); for (const r of refs.current) { if (typeof r === 'function') r(el); else if (r) r.current = el; } }, []);
  const own = rest['aria-describedby'] ?? (isValidElement(children) ? children.props['aria-describedby'] : undefined);
  const control = isValidElement(children)
    ? cloneElement(children, { ...rest, ref, 'aria-describedby': (open && describe && !disabled ? [own, id].filter(Boolean).join(' ') : own) || undefined })
    : children;

  return (
    <>
      {control}
      {mounted && !disabled && createPortal(
        <TooltipBubble as={Light} ref={setBubble} id={id} role="tooltip" content={content} shortcut={shortcut} wide={wide} className={`tt-floating motion-pop ${className}`.trim()}
          data-leaving={leaving || undefined} onPointerEnter={() => clearTimeout(timer.current)} onPointerLeave={() => hide(GRACE)} />,
        document.body)}
    </>
  );
}
