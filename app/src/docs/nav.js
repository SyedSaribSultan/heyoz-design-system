// The site map. One entry per page, one thing per page. Sidebar, page headers,
// overview cards, prev/next links, the "On this page" list (toc) and search all read from here,
// so a page is added in one place. icon: a Lucide icon (public/icons/lucide/{icon}.svg). Server only: it reads tokens.resolved.json. Client code gets
// what it needs as props (see Shell.jsx).
import t from '@/tokens/tokens.resolved.json';

// Numbers in the summaries come from the tokens and specs, so they never drift.
const px = (name) => t.numbers.find((n) => n.name === name).px;
const D = t.motion.duration, SN = Object.fromEntries(t.components.sidenav.vars.map((x) => [x.key, x.px]));

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
        summary: `Control heights from ${px('size/control/2xs')} to ${px('size/control/2xl')} (xs ${px('size/control/xs')} is the everyday size), icon frames from ${px('size/icon/xs')} to ${px('size/icon/xl')}, a ${px('size/target')}px touch target and two stroke widths.` },
      { href: '/foundations/icons', icon: 'shapes', toc: ['The grid', 'Three sizes', 'Good icons', 'HeyOz icons', 'Lucide icons'], title: 'Icons',
        summary: 'One grid for every icon: the drawing fills 75% of its frame with a line 1/16 of the frame. HeyOz icons, plus Lucide redrawn on the same grid.' },
      { href: '/foundations/motion', icon: 'wind', toc: ['The rule', 'How fast', 'How it moves', 'Popups', 'Picking one', 'Icon swaps'], title: 'Motion',
        summary: `Every visual change animates. Three durations (${D.fast}, ${D.base}, ${D.slow}ms) and three easings, chosen by what is moving.` },
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
        summary: `One side nav for every screen, this site included: ${SN['nav-width']} open, ${SN['nav-width-collapsed']} folded, Ctrl+B to toggle. Menu items, brand picker and their states.` },
      { href: '/components/text-field', icon: 'text-cursor-input', toc: ['Playground', 'Sizes', 'States', 'Label, hint and error', 'Icons, text and buttons', 'Textarea', 'Usage', 'Keyboard', 'The details'], title: 'Text field',
        summary: "One field for one line or many: 3 sizes (32, 40, 48), rest, hover, focus, invalid, disabled and read-only, with label, hint, error, count, clear and password buttons, and a textarea that grows from 3 to 8 rows." },
      { href: '/components/checkbox', icon: 'square-check', toc: ['Playground', 'States', 'Label and description', 'Groups', 'Two sizes', 'When to use', 'Keyboard and screen readers', 'The details'], title: 'Checkbox',
        summary: "Checked, unchecked and indeterminate in two sizes (16 and 20 box), with label, description and groups. White when on, a tick that draws in, a 44 × 44 hit area." },
      { href: '/components/radio', icon: 'circle-dot', toc: ['Playground', 'States', 'Groups', 'Label and description', 'Disabled', 'Two sizes', 'When to use', 'Keyboard and screen readers', 'The details'], title: 'Radio',
        summary: "One choice of several: a 16 or 20 circle, vertical or horizontal groups, one Tab stop, arrows move and choose, Home and End jump." },
      { href: '/components/switch', icon: 'toggle-right', toc: ['Playground', 'States', 'Label side', 'In a settings list', 'Two sizes', 'When to use', 'Keyboard and screen readers', 'The details'], title: 'Switch',
        summary: "On or off, effective at once: a 28 × 16 or 36 × 20 track, the thumb slides in 200ms, label left or right, role=switch." },
      { href: '/components/segmented', icon: 'rectangle-ellipsis', toc: ['Playground', 'Options', 'States', 'Seven sizes', 'Width', 'When to use', 'Keyboard', 'The details'], title: 'Segmented',
        summary: "Pick one value from 2 to 6 visible options: label, icon or both, 7 sizes from 28 to 72, fill or hug, one indicator that slides in 200ms." },
      { href: '/components/tabs', icon: 'panel-top', toc: ['Playground', 'The look', 'States', 'Sizes', 'Icons and counts', 'Activation', 'Overflow', 'Tabs or Segmented', 'Keyboard and roles', 'The details'], title: 'Tabs',
        summary: "Switch views of content: tabs on a 1px baseline, one 2px underline that slides, 2 sizes (40 and 32), icons, counts, automatic or manual activation, sideways scroll." },
      { href: '/components/menu', icon: 'list', toc: ['Playground', 'Item kinds', 'States', 'Submenu', 'Placement and long lists', 'When to use', 'Keyboard and screen readers', 'The details'], title: 'Menu',
        summary: "A dropdown from any Button: 4 item kinds, one level of submenu, 32-tall items under one sliding highlight, on a card 192–320 wide that scrolls past 320 tall." },
      { href: '/components/select', icon: 'chevrons-up-down', toc: ['Playground', 'States', 'Three sizes', 'Options', 'In a form', 'When to use', 'Keyboard and screen readers', 'The details'], title: 'Select',
        summary: "One choice from a list, in the text field's well (32, 40, 48): options with icon, description and groups; the list is the Menu's card, as wide as the trigger." },
      { href: '/components/tooltip', icon: 'message-square-more', toc: ['Playground', 'Placement', 'Timing', 'Content', 'Keyboard and touch', 'Use it, or not', 'The details'], title: 'Tooltip',
        summary: "One short label for one control: opens after 500ms (at once when another was just open), on keyboard focus at once, never on touch; four sides, 8 away, flips and stays 8 inside the window." },
      { href: '/components/popover', icon: 'message-square', toc: ['Playground', 'Sizes', 'Parts', 'Placement', 'Focus and keyboard', 'Use it, or not', 'The details'], title: 'Popover',
        summary: "A non-modal card opened from its trigger: 240, 320 or 400 wide, optional header and footer, 8 from the trigger, flips and stays inside the window; focus goes in when opened by keyboard and returns on close." },
      { href: '/components/dialog', icon: 'app-window', toc: ['Playground', 'Sizes', 'Alert dialog', 'Bottom sheet', 'Scrolling', 'Keyboard and focus', 'When to use', 'The details'], title: 'Dialog',
        summary: "A modal in three widths (400, 520, 640) that traps focus, closes on Esc or a scrim press, locks the page without shifting it, and becomes a bottom sheet below 640; plus an alert dialog to confirm or cancel." },
      { href: '/components/toast', icon: 'bell', toc: ['Playground', 'Types', 'Content', 'Time and stack', 'Keyboard and screen readers', 'When to use', 'The details'], title: 'Toast',
        summary: "A short message in the bottom-right corner (full width below 640): five types, gone after 5s (10s with an action, critical stays), up to 3 stacked, paused on hover and focus, reachable with F8." },
      { href: '/components/badge', icon: 'badge', toc: ['Playground', 'Tones', 'Dot, icon and count', 'On other things', 'Usage', 'The details'], title: 'Badge',
        summary: "A status label you can't press: 6 tones, soft or solid, 2 sizes (18 and 24 tall), a count capped at 99+, and a dot-only signal." },
      { href: '/components/chip', icon: 'tag', toc: ['Playground', 'Kinds', 'States', 'Choice group', 'Sizes', 'Keyboard', 'Usage', 'The details'], title: 'Chip',
        summary: "A compact control in 2 sizes (32 and 28): action, filter, choice (one sliding indicator) and input (removable), with Space, Enter, arrows and Backspace." },
      { href: '/components/avatar', icon: 'circle-user', toc: ['Playground', 'Fallbacks', 'Tone from the name', 'Sizes', 'Shapes', 'Status', 'Groups', 'Usage', 'The details'], title: 'Avatar',
        summary: "Picture, then initials, then an icon: 6 sizes (20 to 56), circle or squircle, 4 statuses, and an overlapping group with +N." },
      { href: '/components/slider', icon: 'sliders-horizontal', toc: ['Playground', 'Variants', 'States', 'Keyboard', 'When to use', 'The details'], title: 'Slider',
        summary: "Single and range sliders on native range inputs: a 20 thumb on an 8 track in a 44-tall hit row; arrows step, Shift × 10, Page 10%, Home and End; optional ticks, min/max labels and a number field." },
      { href: '/components/progress', icon: 'loader', toc: ['Playground', 'Bar', 'Tones', 'Spinner', 'In a button', 'Bar, spinner or skeleton', 'Accessibility', 'The details'], title: 'Progress',
        summary: "A bar 2, 4 or 8 tall and a ring at the five icon sizes (12–32): determinate or indeterminate, neutral, brand, success or critical. The spinner is an icon on the icon grid." },
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
