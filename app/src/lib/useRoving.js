'use client';
import { useCallback, useLayoutEffect, useState } from 'react';

// One keyboard model for every "one Tab stop, arrows move" group: Segmented, Tabs, ChipGroup, RadioGroup.
//   const { onKeyDown, first } = useRoving({ ref, item: '[role="radio"]', axis: 'both', activate: 'click' });
// item      selector of the group's items; disabled ones (:disabled, aria-disabled="true") are skipped
// axis      'both' (Left/Up = back, Right/Down = next) · 'x' (Left/Right only: a horizontal tab list)
// activate  'click' (default): the item that gets focus is also chosen, by a click · 'focus': focus only (manual tabs)
// Home / End jump to the ends, and every move wraps. Modified keys (Ctrl, Alt, Meta, Shift) are left alone.
// first     the data-value of the first enabled item, for a group that starts with none chosen (its Tab stop); read only if you pass track: true
const STEP = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 };

export default function useRoving({ ref, item, axis = 'both', activate = 'click', track = false }) {
  const enabled = useCallback(() => [...(ref.current?.querySelectorAll(item) || [])].filter((el) => !el.matches(':disabled, [aria-disabled="true"]')), [ref, item]);

  const [first, setFirst] = useState(null);
  // after every render of the owner (its items may change); setState bails out when the value is the same
  useLayoutEffect(() => { if (track) setFirst(enabled()[0]?.dataset.value ?? null); });

  const onKeyDown = (e) => {
    if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;
    const step = STEP[e.key];
    if (step !== undefined && axis === 'x' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (step === undefined && e.key !== 'Home' && e.key !== 'End') return;
    const list = enabled();
    if (!list.length) return;
    const at = list.indexOf(e.target.closest?.(item) || document.activeElement);
    if (step !== undefined && at < 0) return;
    const to = e.key === 'Home' ? list[0] : e.key === 'End' ? list[list.length - 1] : list[(at + step + list.length) % list.length];
    e.preventDefault();
    to.focus();
    if (activate === 'click') to.click();
  };
  return { onKeyDown, first };
}
