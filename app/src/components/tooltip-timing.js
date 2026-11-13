// Tooltip timing, in ms. Set values (not tokens), named in components/tooltip.json rules → timing.
// A plain module, so the docs page (a server component) can read them too.
export const DELAY = 500; // hover → open
export const WARM = 300; // after one closes, the next opens at once
export const GRACE = 100; // the pointer may cross the gap onto the bubble
