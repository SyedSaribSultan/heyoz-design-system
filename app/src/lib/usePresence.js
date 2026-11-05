'use client';
import { useEffect, useState } from 'react';
import cssTime from './cssTime';

// Keeps a popup mounted while it animates out (D-031: popups leave with duration/fast · easing/exit).
// const { mounted, leaving } = usePresence(open);  →  {mounted && <div className="motion-pop" data-leaving={leaving || undefined}>…}
const LEAVE_MS = 120; // duration/fast

export default function usePresence(open) {
  const [mounted, setMounted] = useState(open);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (open) { setMounted(true); setLeaving(false); return; }
    if (!mounted) return;
    setLeaving(true);
    const ms = cssTime('--duration-fast', LEAVE_MS);
    const t = setTimeout(() => { setMounted(false); setLeaving(false); }, ms);
    return () => clearTimeout(t);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  return { mounted, leaving };
}
