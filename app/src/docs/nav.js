// The site map. One entry per page, one thing per page. Sidebar, page headers,
// overview cards, prev/next links, the "On this page" list (toc) and search all read from here,
// so a page is added in one place. icon: a Lucide icon (public/icons/lucide/{icon}.svg). Server only: it reads tokens.resolved.json. Client code gets
// what it needs as props (see Shell.jsx).
import t from '@/tokens/tokens.resolved.json';

export const NAV = [
  {
    group: 'Foundations',
    items: [
      { href: '/foundations/colour', icon: 'palette', toc: ['Colour families', 'Layers', 'Fills', 'Borders', 'Words and icons'], title: 'Colour',
        summary: 'Six ramps of 12 OKLCH steps plus white, and the semantic tokens built on them: surfaces, fills, borders and content, with hover, active and disabled where they apply.' },
      { href: '/foundations/typography', icon: 'type', toc: ['The letters', 'Four jobs', ...t.type.roles.map((r) => r[0].toUpperCase() + r.slice(1)), 'Thickness', 'Letter spacing'], title: 'Typography',
        summary: 'Four roles in five sizes each, body with two more, four weights. Bricolage for display and headings, Geist for everything else.' },
      { href: '/foundations/spacing', icon: 'gap-horizontal', toc: ['Steps', 'Room inside and between', 'Which one to pick'], title: 'Spacing',
        summary: 'A 4px grid, with 2 and 6 as half-steps. The name is the value: space/16 is 16px.' },
      { href: '/foundations/radius', icon: 'square-round-corner', toc: ['Corners', 'Corners inside corners'], title: 'Radius',
        summary: 'Nine corner radii, from none to full. A box inside a box takes the outer radius minus the padding.' },
      { href: '/foundations/size', icon: 'ruler-dimension-line', toc: ['Buttons and inputs', 'Icon boxes', 'Finger space', 'Lines'], title: 'Size & stroke',
        summary: 'Control heights from 28 to 72 (xs 32 is the everyday size), icon frames from 12 to 32, a 44px touch target and two stroke widths.' },
      { href: '/foundations/icons', icon: 'shapes', toc: ['The grid', 'Three sizes', 'Good icons', 'HeyOz icons', 'Lucide icons'], title: 'Icons',
        summary: 'One grid for every icon: the drawing fills 75% of its frame with a line 1/16 of the frame. HeyOz icons, plus Lucide redrawn on the same grid.' },
      { href: '/foundations/motion', icon: 'wind', toc: ['The rule', 'How fast', 'How it moves', 'Popups', 'Picking one', 'Icon swaps'], title: 'Motion',
        summary: 'Every visual change animates. Three durations (120, 200, 320ms) and three easings, chosen by what is moving.' },
      { href: '/foundations/light', icon: 'sun', toc: ['The rule', 'Try it', 'The numbers'], title: 'Light',
        summary: 'One cursor light per screen, blended onto every surface above the background. Never the background, never media.' },
    ],
  },
  {
    group: 'Components',
    items: [
      { href: '/components/button', icon: 'mouse-pointer-click', toc: ['Playground', 'Eight kinds', 'Icon buttons', 'Links', 'Seven sizes', 'Build it in Figma', 'Size details', 'Colour details'], title: 'Button',
        summary: 'Eight types, seven sizes, squircle or pill, with rest, hover, pressed, disabled and loading states.' },
      { href: '/components/sidebar', icon: 'panel-left', toc: ['Open and folded', 'Menu items', 'Brand picker', 'On this site', 'The details'], title: 'Sidebar',
        summary: 'One side nav for every screen, this site included: 300 open, 54 folded, Ctrl+B to toggle. Menu items, brand picker and their states.' },
    ],
  },
  {
    group: 'Screens',
    items: [
      { href: '/home', icon: 'house', title: 'Home', external: true, summary: 'The HeyOz home screen, built only from the pieces on this site.' },
      { href: '/editor', icon: 'clapperboard', title: 'Editor', external: true, summary: 'The video editor redesign: preview, one strip, a five-button bar, the inspector on selection and AI on the selected clip.' },
    ],
  },
];

export const PAGES = NAV.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group })));
export const pageFor = (href) => PAGES.find((p) => p.href === href);

// Prev / next walk the docs pages only (screens open on their own).
export function neighbours(href) {
  const docs = PAGES.filter((p) => !p.external);
  const i = docs.findIndex((p) => p.href === href);
  return { prev: docs[i - 1], next: docs[i + 1] };
}


// Page metadata from the site map: title (the layout adds " · HeyOz Design System"), description, canonical URL.
export function meta(href) {
  const p = pageFor(href);
  return { title: p.title, description: p.summary, alternates: { canonical: href }, openGraph: { title: `${p.title} · HeyOz Design System`, description: p.summary, url: href } };
}
