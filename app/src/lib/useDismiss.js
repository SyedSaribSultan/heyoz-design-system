'use client';
import { useEffect, useRef } from 'react';

// One dismiss rule for every floating layer (Popover, Menu, Select, Dialog, Tooltip):
//   Esc          only the newest open layer answers, and only if nothing handled the key first (defaultPrevented)
//   press        a pointer press outside closes it (capture phase, so a stopPropagation in the page cannot hide it)
//   focus        optional: focus moving outside closes it
//
//   const { isTop } = useDismiss({ open, onDismiss: (reason) => …, inside: (target) => bool })
// reason: 'escape' | 'press' | 'focus'. inside(target): true when the target belongs to this layer (its trigger, its panel,
// a layer nested in it); a press or focus there is not "outside".
// capture: Esc is read on window in the capture phase and stopped there (a Tooltip closes first and nothing else).
//          Such a layer is not on the stack (stacked: false), so it never hides Esc from the layer below.
// isTop(): true while this layer is the newest on the stack (a Dialog uses it to trap Tab only when it is on top).
const stack = [];

export default function useDismiss({ open, onDismiss, inside, escape = true, press = true, focus = false, capture = false, stacked = true }) {
  const live = useRef({}); live.current = { onDismiss, inside };
  const me = useRef({});
  useEffect(() => {
    if (!open) return;
    const self = me.current;
    if (stacked) stack.push(self);
    const top = () => !stacked || stack[stack.length - 1] === self;
    const out = (t) => !live.current.inside?.(t);
    const key = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented || !top()) return;
      if (capture) e.stopPropagation();
      live.current.onDismiss?.('escape', e);
    };
    const down = (e) => { if (out(e.target)) live.current.onDismiss?.('press', e); };
    const into = (e) => { if (out(e.target)) live.current.onDismiss?.('focus', e); };
    const keyTarget = capture ? window : document;
    if (escape) keyTarget.addEventListener('keydown', key, capture);
    if (press) document.addEventListener('pointerdown', down, true);
    if (focus) document.addEventListener('focusin', into);
    return () => {
      const i = stack.indexOf(self); if (i >= 0) stack.splice(i, 1);
      keyTarget.removeEventListener('keydown', key, capture);
      document.removeEventListener('pointerdown', down, true); document.removeEventListener('focusin', into);
    };
  }, [open, escape, press, focus, capture, stacked]);
  return { isTop: () => stack[stack.length - 1] === me.current };
}
