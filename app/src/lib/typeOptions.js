// Type preview (D-033): typefaces to review with stakeholders. Picking one swaps the four font tokens
// (--font-display, --font-heading, --font-body, --font-label) for the whole app. A pair sets display and
// heading from the first family, body and label from the second; a single sets all four.
// The choice lasts one browser session (sessionStorage), like every setting. The tokens in
// tokens/typography.json stay the source of truth until a choice is made final there.
// display / body: the CSS variables next/font defines (src/lib/fonts.js).
export const TYPE_OPTIONS = [
  { id: 'bricolage-geist', name: 'Bricolage + Geist', kind: 'pair', display: '--font-bricolage', body: '--font-geist', note: 'Current system (D-018)' },
  { id: 'intertight-inter', name: 'Inter Tight + Inter', kind: 'pair', display: '--font-inter-tight', body: '--font-inter', note: 'Linear-style' },
  { id: 'hubot-mona', name: 'Hubot Sans + Mona Sans', kind: 'pair', display: '--font-hubot', body: '--font-mona', note: 'GitHub' },
  { id: 'instrument-inter', name: 'Instrument Serif + Inter', kind: 'pair', display: '--font-instrument', body: '--font-inter', note: 'Editorial serif headlines', singleWeight: true },
  { id: 'space-geist', name: 'Space Grotesk + Geist', kind: 'pair', display: '--font-space', body: '--font-geist', note: 'Techy headlines' },
  { id: 'inter', name: 'Inter', kind: 'single', display: '--font-inter', body: '--font-inter', note: 'Linear, Notion' },
  { id: 'geist', name: 'Geist', kind: 'single', display: '--font-geist', body: '--font-geist', note: 'Vercel' },
  { id: 'mona', name: 'Mona Sans', kind: 'single', display: '--font-mona', body: '--font-mona', note: 'GitHub' },
  { id: 'jakarta', name: 'Plus Jakarta Sans', kind: 'single', display: '--font-jakarta', body: '--font-jakarta', note: 'Warm, consumer' },
  { id: 'manrope', name: 'Manrope', kind: 'single', display: '--font-manrope', body: '--font-manrope', note: 'Round, friendly' },
];
export const DEFAULT_TYPE = 'bricolage-geist';
export const TYPE_KEY = 'heyoz:type';

// Applies an option to <html>: the default clears the overrides so the tokens apply as written.
export function applyType(id) {
  const o = TYPE_OPTIONS.find((x) => x.id === id) || TYPE_OPTIONS[0], r = document.documentElement;
  const stack = (v) => `var(${v}), system-ui, sans-serif`;
  if (o.id === DEFAULT_TYPE) for (const k of ['display', 'heading', 'body', 'label']) r.style.removeProperty(`--font-${k}`);
  else { r.style.setProperty('--font-display', stack(o.display)); r.style.setProperty('--font-heading', stack(o.display)); r.style.setProperty('--font-body', stack(o.body)); r.style.setProperty('--font-label', stack(o.body)); }
  if (o.singleWeight) r.dataset.typeSingleWeight = ''; else delete r.dataset.typeSingleWeight;
  r.dataset.type = o.id;
  window.dispatchEvent(new CustomEvent('heyoz:type', { detail: o.id })); // copy that names the typeface listens (useTypeOption)
}

// Runs in <head> before the first paint, so a reload keeps the session's choice without a flash.
export const TYPE_BOOT = `try{var o=${JSON.stringify(TYPE_OPTIONS.map(({ id, display, body, singleWeight }) => ({ id, display, body, singleWeight })))},i=sessionStorage.getItem('${TYPE_KEY}'),x=o.find(function(a){return a.id===i});if(x&&x.id!=='${DEFAULT_TYPE}'){var r=document.documentElement.style,s=function(v){return 'var('+v+'), system-ui, sans-serif'};r.setProperty('--font-display',s(x.display));r.setProperty('--font-heading',s(x.display));r.setProperty('--font-body',s(x.body));r.setProperty('--font-label',s(x.body));if(x.singleWeight)document.documentElement.dataset.typeSingleWeight='';document.documentElement.dataset.type=x.id;}}catch(e){}`;

// Family names, for copy that names the typeface (it follows the preview, D-033).
export const FAMILY = {
  '--font-bricolage': ['Bricolage Grotesque', 'Bricolage'], '--font-geist': ['Geist', 'Geist'], '--font-inter': ['Inter', 'Inter'],
  '--font-inter-tight': ['Inter Tight', 'Inter Tight'], '--font-mona': ['Mona Sans', 'Mona Sans'], '--font-hubot': ['Hubot Sans', 'Hubot Sans'],
  '--font-jakarta': ['Plus Jakarta Sans', 'Plus Jakarta'], '--font-manrope': ['Manrope', 'Manrope'], '--font-instrument': ['Instrument Serif', 'Instrument Serif'],
  '--font-space': ['Space Grotesk', 'Space Grotesk'],
};
export const TYPE_EVENT = 'heyoz:type';
