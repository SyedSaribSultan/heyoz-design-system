// Icon build. Applies the icon grid (tokens/number.json → size.iconGrid, D-028) to every icon set:
//   lucide-static (npm)    → every icon redrawn on the HeyOz grid: frame 24, longest side = key square
//                            (24 × 0.75 = 18), centred, line = frame × grid stroke (1.5), round caps.
//   ../icons/heyoz/*.svg   → the HeyOz icons from Figma (page Icons, 25:48), kept as drawn. Single-colour
//                            icons are recoloured to currentColor so they follow the text colour.
// Writes (generated, never edit by hand):
//   public/icons/lucide/<name>.svg   one file per icon, ready to download
//   public/icons/lucide.svg          sprite: <svg><use href="/icons/lucide.svg#<name>"/></svg>
//   public/icons/heyoz/<file>.svg    HeyOz icons; single-colour ones also in public/icons/heyoz.svg
//   src/icons/icons.json             the index the docs site reads
// The build fails if any Lucide icon ends up off the grid.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { svgPathBbox } from 'svg-path-bbox';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(here, '..'), root = path.resolve(app, '..');
const require = createRequire(import.meta.url);
const fail = (m) => { console.error('✗ ' + m); process.exit(1); };
const out = (...p) => path.join(app, ...p);
const r3 = (n) => Math.round(n * 1000) / 1000;

const grid = JSON.parse(fs.readFileSync(path.join(root, 'tokens/number.json'), 'utf8')).size.iconGrid;
const F = 24, KEY = F * grid.square, STROKE = F * grid.stroke;

// ─── Lucide ──────────────────────────────────────────────────────────────────
const nodes = require('lucide-static/icon-nodes.json');
const tags = require('lucide-static/tags.json');
const lucideVersion = require('lucide-static/package.json').version;

// Every Lucide element as path data, so one function measures them all (geometry, without the line).
const toPath = ([tag, a]) => {
  const n = (k) => +(a[k] ?? 0);
  if (tag === 'path') return a.d;
  if (tag === 'circle') return `M${n('cx') - n('r')} ${n('cy')}a${n('r')} ${n('r')} 0 1 0 ${2 * n('r')} 0a${n('r')} ${n('r')} 0 1 0 ${-2 * n('r')} 0`;
  if (tag === 'ellipse') return `M${n('cx') - n('rx')} ${n('cy')}a${n('rx')} ${n('ry')} 0 1 0 ${2 * n('rx')} 0a${n('rx')} ${n('ry')} 0 1 0 ${-2 * n('rx')} 0`;
  if (tag === 'rect') return `M${n('x')} ${n('y')}h${n('width')}v${n('height')}h${-n('width')}z`;
  if (tag === 'line') return `M${n('x1')} ${n('y1')}L${n('x2')} ${n('y2')}`;
  if (tag === 'polyline' || tag === 'polygon') return 'M' + a.points.trim().replace(/\s+/g, ' ');
  fail(`unknown element ${tag}`);
};
const attrs = (a) => Object.entries(a).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${v}"`).join(' ');

fs.rmSync(out('public/icons/lucide'), { recursive: true, force: true });
fs.mkdirSync(out('public/icons/lucide'), { recursive: true });
const lucide = [], sprite = [];
for (const [name, els] of Object.entries(nodes)) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const el of els) { const [a, b, c, d] = svgPathBbox(toPath(el)); x0 = Math.min(x0, a); y0 = Math.min(y0, b); x1 = Math.max(x1, c); y1 = Math.max(y1, d); }
  const w = x1 - x0, h = y1 - y0, long = Math.max(w, h);
  if (!(long > 0)) fail(`lucide/${name} has no size`);
  const s = KEY / long, tx = F / 2 - s * (x0 + w / 2), ty = F / 2 - s * (y0 + h / 2);
  // check: the redrawn icon fills the key square and is centred
  const nx0 = tx + s * x0, ny0 = ty + s * y0;
  if (Math.abs(Math.max(w, h) * s - KEY) > 1e-6 || Math.abs(nx0 + (w * s) / 2 - F / 2) > 1e-6 || Math.abs(ny0 + (h * s) / 2 - F / 2) > 1e-6) fail(`lucide/${name} is off the grid`);
  const body = els.map(([tag, a]) => `<${tag} ${attrs(a)}/>`).join('');
  const g = `<g transform="translate(${r3(tx)} ${r3(ty)}) scale(${r3(s)})" stroke-width="${r3(STROKE / s)}">${body}</g>`;
  fs.writeFileSync(out('public/icons/lucide', `${name}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${F}" height="${F}" viewBox="0 0 ${F} ${F}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${g}</svg>\n`);
  sprite.push(`<symbol id="${name}" viewBox="0 0 ${F} ${F}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${g}</symbol>`);
  lucide.push({ name, tags: tags[name] || [] });
}
fs.copyFileSync(require.resolve('lucide-static/LICENSE'), out('public/icons/lucide/LICENSE.txt')); // ISC: keep the notice with the icons
fs.writeFileSync(out('public/icons/lucide.svg'), `<svg xmlns="http://www.w3.org/2000/svg">${sprite.join('')}</svg>\n`);

// ─── HeyOz ───────────────────────────────────────────────────────────────────
const src = JSON.parse(fs.readFileSync(path.join(root, 'icons/heyoz.json'), 'utf8')).icons;
const neutral = (c) => { c = c.toLowerCase(); if (c === 'black' || c === 'white') return true; const m = c.match(/^#([0-9a-f]{6})$/); if (!m) return false; const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)); return Math.max(r, g, b) - Math.min(r, g, b) < 20; };
const light = (c) => { c = c.toLowerCase(); if (c === 'white') return true; const m = c.match(/^#([0-9a-f]{2})/); return !!m && parseInt(m[1], 16) > 200; };
fs.rmSync(out('public/icons/heyoz'), { recursive: true, force: true });
fs.mkdirSync(out('public/icons/heyoz'), { recursive: true });
const heyoz = [], hsprite = [];
for (const i of src) {
  let svg = fs.readFileSync(path.join(root, 'icons/heyoz', `${i.file}.svg`), 'utf8');
  const cols = new Set([...svg.matchAll(/(?:fill|stroke|stop-color|flood-color)="([^"]+)"/g)].map((m) => m[1]).filter((c) => c !== 'none' && c !== 'currentColor'));
  const mono = ![...cols].some((c) => !neutral(c)) && !/<(linearGradient|radialGradient|pattern|image|filter)\b/.test(svg);
  if (mono) {
    const hasDark = [...cols].some((c) => !light(c));
    // dark ink follows the text colour; light shapes inside dark ink are cut-outs and show the surface behind
    svg = svg.replace(/(fill|stroke)="([^"]+)"/g, (m, k, c) => (c === 'none' || c === 'currentColor' || !neutral(c)) ? m
      : light(c) && hasDark ? `style="${k}: var(--icon-cutout, #fff)"` : `${k}="currentColor"`);
    const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    const vb = svg.match(/viewBox="([^"]+)"/)[1];
    hsprite.push(`<symbol id="${i.file}" viewBox="${vb}">${inner}</symbol>`);
  }
  fs.writeFileSync(out('public/icons/heyoz', `${i.file}.svg`), svg);
  heyoz.push({ ...i, mono });
}
fs.writeFileSync(out('public/icons/heyoz.svg'), `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${hsprite.join('')}</svg>\n`);

fs.mkdirSync(out('src/icons'), { recursive: true });
fs.writeFileSync(out('src/icons/icons.json'), JSON.stringify({ grid: { frame: F, key: KEY, stroke: STROKE }, lucideVersion, lucide, heyoz }));
console.log(`✓ icons: ${lucide.length} Lucide on the grid (key ${KEY}, line ${STROKE}) · ${heyoz.length} HeyOz (${heyoz.filter((h) => h.mono).length} single-colour)`);
