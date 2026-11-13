'use client';
import { cloneElement, createContext, isValidElement, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import c from '@/tokens/components.json';
import Button from './Button';
import Light from '@/lib/Light';
import { lucide } from '@/lib/Lucide';
import usePresence from '@/lib/usePresence';
import useDismiss from '@/lib/useDismiss';
import { rec } from '@/lib/rec';
import { useAnchored, tabbables } from './floating';
import '@/styles/components.css';
import './popover.css';

// Popover, built from its spec: components/popover.json → (npm run tokens) → --pop-* variables. Docs: docs/components/popover.md.
// An anchored, non-modal panel with any content, opened by a click on its trigger.
//
// <Popover trigger={<Button>Export</Button>} title="Export" size="md" footer={({ close }) => <Button onClick={close}>Done</Button>}>body</Popover>
// trigger:    one element that accepts a ref and onClick (Button, a native element). It gets aria-haspopup, aria-expanded, aria-controls.
// title:      the header title (names the dialog) · label: the name when there is no title · closable: false hides the close button
// size:       sm 240 | md 320 (default) | lg 400 · placement: bottom (default) | top | left | right · align: start (default) | center | end
// children, footer: nodes, or functions of { close } · open + onOpenChange (controlled) or defaultOpen
// className: on the panel · aria-label: the name when there is no title (label is the same thing)
// Focus: opened by keyboard, it moves into the popover (data-autofocus, else the first control, else the panel); opened by pointer,
//        it stays on the trigger. It returns to the trigger on Esc, close button or close(). Tab never traps: it leaves for the next
//        thing after the trigger. Esc closes the newest popover; a press or focus outside closes it too. Rules: spec rules.
// PopoverPanel draws the same panel inline (documentation specimens, no behaviour).
const TY = c.popover.types;

const Tree = createContext(''); // the ids of the popovers around this one: a press inside a nested popover is not "outside" its parent

const call = (x, arg) => (typeof x === 'function' ? x(arg) : x);

export function PopoverPanel({ as: Tag = 'div', title, titleId, closable = true, onClose, footer, size = 'md', children, className = '', ...props }) {
  return (
    <Tag className={`pop ${className}`.trim()} data-size={size} data-component="popover" {...props}
      {...rec(`popover · ${size}`, [['background', 'surface/tertiary'], ['border', 'border/tertiary'], ['radius', 'radius/xl'], ['padding', 'space/16'], ['gap', 'space/12'], ['effect', 'effect · inner-shade'], ['effect', 'effect · drop-md'], ['light', 'light/cursor']])}>
      {title && (
        <div className="pop-head" data-name="popover header" data-tokens={JSON.stringify([['title', 'type/heading/xs/semibold'], ['colour', 'content/primary'], ['min height', 'size/control/2xs']])}>
          <div id={titleId} className={`pop-title ${TY.header}`}>{title}</div>
          {closable && <Button type="ghost" size="2xs" icon={lucide('x')} label="Close" onClick={onClose} />}
        </div>
      )}
      <div className={`pop-body ${TY.body}`} data-name="popover body" data-tokens={JSON.stringify([['type', 'type/body/md/regular'], ['colour', 'content/secondary']])}>{children}</div>
      {footer && <div className="pop-foot" data-name="popover footer" data-tokens={JSON.stringify([['gap', 'space/8']])}>{footer}</div>}
    </Tag>
  );
}

export default function Popover({ trigger, title, label, 'aria-label': ariaLabel, className = '', size = 'md', placement = 'bottom', align = 'start', closable = true, open: openProp, defaultOpen = false, onOpenChange, footer, children }) {
  const id = useId(), titleId = `${id}-title`, panelId = `${id}-panel`;
  const parentTree = useContext(Tree);
  const [inner, setInner] = useState(defaultOpen);
  const open = openProp ?? inner;
  const [node, setNode] = useState(null); // the trigger
  const [panel, setPanel] = useState(null);
  const { mounted, leaving, gen } = usePresence(open);
  const viaPointer = useRef(false), wantFocus = useRef(false), was = useRef(open);
  const childRef = useRef(null); childRef.current = isValidElement(trigger) ? trigger.props.ref : null;
  const live = useRef({}); live.current = { open, onOpenChange, controlled: openProp !== undefined, node, panel };

  const setOpen = useCallback((v) => {
    const l = live.current;
    l.onOpenChange?.(v);
    if (!l.controlled) setInner(v);
  }, []);
  // close(true): also hand focus back to the trigger (Esc, close button, an action). Not when the user went elsewhere.
  const close = useCallback((restore = true) => {
    const l = live.current;
    setOpen(false);
    if (!restore || !l.node) return;
    const a = document.activeElement;
    if (!a || a === document.body || l.panel?.contains(a)) l.node.focus({ preventScroll: true });
  }, [setOpen]);

  useAnchored({ anchor: node, float: panel, placement, align, offset: '--pop-panel-offset', margin: '--pop-panel-margin' });

  // Focus moves in only when it was opened by keyboard (or from outside), never at first paint.
  useEffect(() => {
    if (open && !was.current) { wantFocus.current = !viaPointer.current; viaPointer.current = false; }
    was.current = open;
  }, [open]);
  useEffect(() => {
    if (!open || !panel || !wantFocus.current) return;
    wantFocus.current = false;
    const target = panel.querySelector('[data-autofocus]') || tabbables(panel).find((el) => !el.closest('.pop-head')) || panel;
    target.focus({ preventScroll: true });
  }, [open, panel]);

  // Esc (the newest layer only), a press outside, a focus move outside: the shared rule (lib/useDismiss).
  const inside = (t) => !!node?.contains(t) || !!t?.closest?.('[data-pop-tree]')?.getAttribute('data-pop-tree').split(' ').includes(id);
  useDismiss({ open, inside, focus: true, onDismiss: (reason) => close(reason === 'escape') });

  // The trigger left the page while the popover was open: there is nothing to follow, so it closes.
  const hadNode = useRef(false);
  useEffect(() => {
    if (node) hadNode.current = true;
    else if (open && hadNode.current) close(false);
  }, [node, open, close]);

  // Tab leaves for the next thing after the trigger, never trapped. From the trigger, Tab goes in.
  const onPanelKey = (e) => {
    if (e.key !== 'Tab' || !node || !panel?.contains(e.target)) return; // a nested popover's keys bubble here through the portal
    const list = tabbables(panel), i = list.indexOf(document.activeElement);
    if (e.shiftKey && (i <= 0)) { e.preventDefault(); node.focus(); }
    else if (!e.shiftKey && (i === list.length - 1 || !list.length)) {
      const page = tabbables().filter((el) => !panel.contains(el)), at = page.indexOf(node);
      if (page[at + 1]) { e.preventDefault(); page[at + 1].focus(); }
    }
  };
  const onTriggerKey = (e) => {
    trigger.props.onKeyDown?.(e);
    if (e.key === 'Tab' && !e.shiftKey && open && panel && !e.defaultPrevented) {
      const first = tabbables(panel)[0] || panel;
      e.preventDefault(); first.focus({ preventScroll: true });
    }
  };

  const ref = useCallback((el) => { setNode(el); const r = childRef.current; if (typeof r === 'function') r(el); else if (r) r.current = el; }, []);
  const control = isValidElement(trigger) ? cloneElement(trigger, {
    ref, 'aria-haspopup': 'dialog', 'aria-expanded': open, 'aria-controls': mounted ? panelId : undefined,
    onClick: (e) => { trigger.props.onClick?.(e); if (e.defaultPrevented) return; viaPointer.current = e.detail > 0; setOpen(!live.current.open); },
    onKeyDown: onTriggerKey,
  }) : trigger;

  const ctx = { close: () => close(true) };
  return (
    <>
      {control}
      {mounted && createPortal(
        <Tree.Provider key={gen} value={`${id} ${parentTree}`.trim()}>
          <PopoverPanel as={Light} ref={setPanel} id={panelId} role="dialog" aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : ariaLabel ?? label} tabIndex={-1}
            className={`pop-floating motion-pop ${className}`.trim()} data-pop-tree={`${id} ${parentTree}`.trim()} data-leaving={leaving || undefined} onKeyDown={onPanelKey}
            title={title} titleId={titleId} closable={closable} onClose={() => close(true)} size={size} footer={footer && call(footer, ctx)}>
            {call(children, ctx)}
          </PopoverPanel>
        </Tree.Provider>, document.body)}
    </>
  );
}
