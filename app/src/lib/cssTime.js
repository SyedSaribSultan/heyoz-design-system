// A motion token in milliseconds, read from CSS. CSS minifiers rewrite units (200ms → .2s), so the unit
// must be read, never assumed. cssTime('--duration-base') → 200.
export default function cssTime(name, fallback = 0) {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseFloat(raw);
  if (Number.isNaN(n)) return fallback;
  return raw.endsWith('ms') ? n : raw.endsWith('s') ? n * 1000 : n;
}
