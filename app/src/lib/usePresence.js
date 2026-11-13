'use client';
import { useEffect, useState } from 'react';
import cssTime from './cssTime';

// Keeps a popup mounted while it animates out (D-031: popups leave with duration/fast · easing/exit).
//   const { mounted, leaving, phase, gen } = usePresence(open);
//   {mounted && <div key={gen} className="motion-pop" data-leaving={leaving || undefined}>…}
//
// phase is one of three states, all derived in the same render that `open` changes (no lag frame):
//   'closed'   not mounted
//   'open'     mounted, open is true
//   'leaving'  mounted, open is false, the exit animation is running (duration/fast, then 'closed')
// open → true while leaving goes back to 'open' at once. gen counts the closed/leaving → open edges:
// key the popup by it and every open is a fresh instance, so no highlight, focus request or opener
// survives from the previous open.
const LEAVE_MS = 120; // duration/fast

export default function usePresence(open) {
  const [held, setHeld] = useState(open); // true from the first open until the exit animation ends
  const [was, setWas] = useState(open);
  const [gen, setGen] = useState(0);
  // adjusted during render (React's pattern for state that follows a prop), so the first output is already right
  if (open !== was) { setWas(open); if (open) setGen((g) => g + 1); }

  useEffect(() => {
    if (open) { setHeld(true); return; }
    if (!held) return;
    const t = setTimeout(() => setHeld(false), cssTime('--duration-fast', LEAVE_MS));
    return () => clearTimeout(t);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const mounted = open || held;
  const phase = open ? 'open' : mounted ? 'leaving' : 'closed';
  return { mounted, leaving: phase === 'leaving', phase, gen };
}
