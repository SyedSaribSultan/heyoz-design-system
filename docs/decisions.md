# Decisions

The judgment calls behind the system, with the reason for each. IDs never change, so the changelog can point at them.
The **In force** list is what applies today. Anything replaced or withdrawn moves to **History** as one line.

Format for a new record: **ID · Title** · date, then what we do, why, and what it costs.

---

## In force

**D-001 · Dark mode only** · 2026-11-03
One mode, dark. Components still use semantic tokens, so a future mode is a token change, not a redesign.

**D-002 · One source of truth** · 2026-11-03, updated 2026-11-05
This repository is the design system. Figma was a one-time starting point; where the two differ, the repository wins. Values are written only in `tokens/*.json` and `components/*.json`; CSS, the token and component docs and `figma/tokens-studio.json` are generated from them by `npm run tokens`. Nobody edits generated files (README lists them).

**D-003 · The brand orange is #FF3D01** · 2026-11-03
It is `orange/9`, the build fails if it drifts. White text on it, as shipped.
*Cost:* white on this orange is 3.55:1 (2.90:1 on hover), below 4.5:1 for normal text. Keep text on orange at label size or larger. Reviewed 2026-11-05 against a dark label (#190b06): the owner keeps white.

**D-010 · The name is "HeyOz"** · 2026-11-03
Capital H, capital O, one word. In UI, logos and docs.

**D-012 · No chart palette** · 2026-11-04
HeyOz has no charts today. *Revisit:* the first screen that needs one.

**D-015 · No purple** · 2026-11-04
Visited links look like `content/link`. The palette is gray, orange and status colours only.

**D-017 · One 12-step colour scale (Radix model)** · 2026-11-04
Ramps: gray, orange, green, amber, red, blue, plus white. Every ramp has steps 1–12 with the same lightness and the same job: 1–2 app backgrounds, 3–5 component backgrounds (rest, hover, active), 6–8 borders, 9 solid, 10 solid hover, 11–12 text. Steps 1–8 rise by an even +0.035 L. Primitives are named by hue; roles live only in semantic tokens.
Gray is `oklch(L 0.004 55)`. Status ramps take the most chroma their hue can reach at step 9. Colour values are OKLCH.
*Why:* one convention everywhere, taken from a proven dark-mode system.

**D-018 · Type scale** · 2026-11-04, updated 2026-11-05
Roles display, heading, body, label, each in xs–xl, four weights (regular, medium, semibold, bold). Body adds `2xl` 20/28 and `3xl` 24/32 for lead text and large buttons, so Geist has steps between 18 and the 32 of display. 22 sizes × 4 weights = 88 styles. Bricolage Grotesque for display and heading, Geist for body and label. Body md is 14px. Extra sizes are added only when a real need shows up; label stays at xs–xl.

**D-019 · Semantic names follow the owner's convention** · 2026-11-04
`group/role-state`, e.g. `fill/primary-hover`. States: rest (no suffix), hover, active, disabled.

**D-020 · Light falls on every surface above the background** · 2026-11-04, updated 2026-11-05
One light per screen (`light/cursor`). Every surface above `background` catches it: cards, panels, the sidebar, buttons, open menus. The background itself, and media, never do. Each lit surface (class `lit`) paints its own share of the light at the cursor's true position, so neighbouring surfaces join seamlessly and the background between them stays dark. Lit elements inside a lit surface are already covered, so nothing is lit twice. LightField (root layout) finds every lit element within reach and moves the light. Popovers, menus and the token inspector are light roots (`<Light>`, `data-light-root`): they carry their own light wherever they open. Home: `tk()` marks everything painted above the background as lit. It blends with `soft-light`, so lighter surfaces glow a little more. Media sits above the light, and the light dims to 25% while the cursor is over media. Shape: a 75px disc under Figma blur 120; the build works out the falloff (peak about 18% of the fill, reach 218px), and a noise mask dithers it so it never bands. `content/primary`, 100%, `duration/base` fade. Off on touch and with reduced motion.
*Why:* the light should lift the things you can use, not the empty space between them; the owner wants it soft and wide.

**D-021 · Not tokenised for now** · 2026-11-04
Gradients, shadows, inner shadows, blur and contrast targets. They are set values in code, written once and marked where used (e.g. the inner shade in `tk.js` FX and component CSS). Contrast gets tested and fixed alongside.

**D-022 · Number scales** · 2026-11-04
Space on a 4px grid (2 and 6 as half-steps), named by value: `space/16` = 16px. Radius `none, xs, sm, md, lg, xl, 2xl, 3xl, full`. Size: `control` in 2xs–2xl (28, 32, 40, 48, 56, 64, 72; xs 32 is the everyday size), `icon` in xs–xl, `target` 44px. Stroke 1 and 2. Motion: `duration/fast|base|slow`, `easing/standard|enter|exit`.

**D-023 · Figma through Tokens Studio** · 2026-11-04
The build writes one Tokens Studio file with five sets, one Figma collection each: Primitives, Color, Number, Typography, Effect. Names match the CSS variables one to one (`gray/3` ↔ `--gray-3`).

**D-024 · Order of truth for agents** · 2026-11-04
The owner's screenshots first, then this folder. The existing codebase carries no authority.

**D-025 · Components have a spec file** · 2026-11-04, updated 2026-11-13
Each component has `components/<name>.json`: token references and rules only. The build checks every reference, writes `docs/components/<name>.md`, and the code component reads the resolved spec. A component changes here first: spec, then code, then its docs page. Behaviour that the spec cannot hold as a token (animation, keyboard, scroll) is written in the spec's `rules`. A spec names its CSS `selector` and a unique `prefix`; every value becomes a `--<prefix>-*` variable, so a new component needs no change to the build.

**D-026 · Button (draft)** · 2026-11-04, updated 2026-11-05
Eight types: brand, primary, secondary, tertiary, outline, ghost, brand-tone, brand-ghost; every type also as an icon button. Two links: brand, neutral. Seven sizes on `size/control`: 2xs 28, then 8px steps from xs 32 to 2xl 72; xs (32) is the everyday size and the start of the scale. 2xs is set by hand: padding 6 top and bottom, 10 left and right, radius 10. Text is the body role only, medium: 12, 14, 14, 16, 18, 20, 24. Icon frame from the icon scale by text size (16, 20, 24, 32). Squircle radius = height × 0.375 rounded to the nearest 4; pill = `radius/full`. Every typed value is on the 4px grid (2px half-steps under 12); padding y is not set (fixed height, centred). States rest, hover, pressed, disabled, loading. Secondary, tertiary, outline and ghost: hover and pressed turn the icon `content/brand`; the border stays in its own family: hover `border/secondary-hover`, pressed `border/secondary-active` (tertiary: `border/tertiary-hover`, `border/tertiary-active`). Inner shade (0, −4, blur 10, #000 50%) on every state with a fill. Spec: `components/button.json`; border states follow D-035.

**D-027 · Docs site: one thing per page** · 2026-11-04
Overview, then a page per foundation and per component, all built from the same blocks. Pages are listed once in `app/src/docs/nav.js`.

**D-028 · Icon grid** · 2026-11-04
Icons follow one grid, stored as ratios of the frame so it works at any size: `size/icon/grid/padding` 1/12 (2 at 24), `square` 0.75 (18), `circle` 5/6 (20), `stroke` 1/16 (1.5). HeyOz icons fill the key square: the longest side of the vector is frame × 0.75, so at least 1/8 of the frame stays clear on every side. Icon files are always exported as the frame, never the bare vector, so any component can size the frame and get the right vector. The loading spinner is an icon too.
*Why:* icons stay breathable and optically equal at every size.

**D-029 · Icon library** · 2026-11-04
Two sets on the Icons page. HeyOz icons: exported from Figma (Icons, 25:48) into `icons/heyoz/`, shown as drawn; single-colour ones follow the text colour. Lucide: every icon redrawn by `npm run icons` on the HeyOz grid (longest side 18 in 24, centred, 1.5 line, round caps and joins like the HeyOz set). Every icon downloads as its frame.

**D-030 · Side nav (stable)** · 2026-11-05
One component for every sidebar: the HeyOz app and this docs site. Expanded 300, collapsed 54 (the logomark opens it; Ctrl+B / ⌘B toggles it, except while typing). Menu item 40 tall, default · hover · active; brand picker 50 tall, default · hover. Hover and active add an inset border and the inner shade, so nothing moves. Group titles are `label/sm/medium` (11px). Item icons are 20 (vector 15); the "opens in a new tab" arrow is a hint one step smaller, 16 (vector 12). Collapsed, every item is 36 × 36 with its icon anchored left, never centred, so icons glide on one line while the width animates; labels fade out in place and fade back in on opening (`duration/fast`; width and spacing move at `duration/slow`, D-031). Only the link list scrolls on short screens (D-037). Spec: `components/sidenav.json`; the build checks every reference and writes the `--sn-*` variables and type classes. Icons Lucide.

**D-031 · Every visual change animates** · 2026-11-05
Nothing snaps. State changes (colour, fill, border, shadow, glow, opacity — e.g. a border turning `border/secondary-hover` on hover) run at `duration/fast`, `easing/standard`; this is the default for every element (src/styles/motion.css), so new components get it for free. Icon swaps crossfade while the new icon slides 4px into place, `duration/base`, `easing/standard` (e.g. the brand chevron). Popups enter with a fade, a 4px drop and scale from 0.98 at `duration/base`, `easing/enter`, and leave with a fade at `duration/fast`, `easing/exit`, so closing never feels slow. Larger moves (drawers, the side nav collapsing) use `duration/slow`. The light fades with `light/cursor/fade`. Reduced motion keeps the fades and drops the movement. In code: `motion-swap`, `motion-pop`, `usePresence`.

**D-032 · Selection moves, it doesn't jump** · 2026-11-05
In any group where one item is selected (segmented controls, tabs, toggle groups, picker rows), the selected look is one indicator, not a style on each item. When the selection changes it slides from the old item to the new one: position and size together, `duration/base`, `easing/standard`, in a straight line across a row, a column or a grid, the same duration whatever the distance. Labels change colour in place (a state change, D-031). Items in different containers cross-fade instead. The first paint never animates. Hover and press on the selected item style the indicator, but only once it has landed: while it travels it keeps the plain selected look, so a click never drags a hover look across the group. Reduced motion: no slide, a cross-fade. In code: `useIndicator` + `motion-indicator`; the Segmented control is the first user.

**D-033 · Settings last one session** · 2026-11-05, updated 2026-11-13
Every setting (side nav collapsed) lasts one browser session: a reload keeps it, a new session starts from the defaults. The typeface preview that lived here was removed on 2026-11-13; the system fonts are D-018.

**D-034 · Editor parts are drafts** · 2026-11-05
The editor (/editor) uses Button and Segmented as they are. Everything it needed that the system does not have yet is built once, from tokens, in `app/src/app/editor/parts`, marked "(draft)" in the inspector: icon, keyboard hint, slider, switch, number field, textarea, field label, hint, menu item, separator, badge, action bar button, callout, progress, plus the popover, bottom sheet, toast, inspector section and model picker in the editor itself. None is a component until the owner signs it off; then it moves to `src/components` with a spec and a docs page. Dark only. The page is static; demo states open with `/editor?scene=none|clip|text|ai|empty|grown`, and below 820px the layout becomes the narrow one (bottom sheets). On load nothing moves: the preview and the timeline lanes stay hidden until measured, then fade in, and the timeline always keeps room for its scrollbar. With reduced motion the editor turns off all transitions and animations (stricter than D-031). Keyboard shortcuts are listed in the editor's own shortcuts popover (`?`, `Popovers.jsx`).

**D-035 · Every border has hover and active** · 2026-11-05
Every border family has rest, `-hover` and `-active`: primary, secondary, tertiary, elevated, inverse, brand, brand-secondary and the four statuses. Active mirrors fills. Grays go one step past hover (primary 6, secondary 7, tertiary 8). Elevated stops at 8, the top of the border range, so it matches hover. Inverse active is gray/11. Brand and status active are step 8, like `fill/*-active`. brand-secondary has hover orange/7 and active orange/8, and no disabled. On controls, hover uses `-hover`; pressed and active (toggled on, current page) use the `-active` border of the control's own family. Three borders are states in themselves and have no hover or active: `border/focus` (the keyboard focus ring: a quiet `gray/8`, so focus is subtle, never an orange line; fields show focus by stepping their own border up instead, D-040), `border/focus-inverse`, and `border/selected` (the orange ring, stroke/2, around a selected object on a canvas or timeline: a clip, the preview, a text overlay).
*Why:* a pressed control should read one step stronger than hover, in its own colour; orange is kept for selected objects and the one main action, so focus stays quiet (changed 2026-11-13: focus was orange/10).

**D-036 · Editor surfaces: fill and space, not lines** · 2026-11-05
Editor regions are panels on `background`, told apart by surface step and 12px of space (8 on narrow): stage `surface/primary`; inspector, timeline and action dock `surface/secondary`; floating cards (AI card, popovers) `surface/tertiary`. Each panel is `radius/2xl` with the border of its own step. The tool panel that opens above the dock is a floating `surface/secondary` card (`radius/xl`, `border/tertiary`, drop shadow), so its own cards (`surface/tertiary`) still read as raised. Inside, wells go darker (`fill/primary` for timeline lanes and fields) and raised things go lighter (`fill/elevated` clips).
*Why:* with one surface and 1px dividers the regions were hard to tell apart.

**D-037 · One minimal scrollbar** · 2026-11-05
Every scroll area uses one style, set once in `app/globals.css`: a pill on a transparent track with no arrows, `border/tertiary`, 4px at rest, 6px and `border/elevated` on hover, `border/elevated-hover` while dragged. Firefox gets the thin standard bar in the same colours. Nothing else sets `scrollbar-width` or `scrollbar-color` (in Chrome they turn the style off). The sidebar's link list scrolls on its own when it is taller than the screen and never passes the scroll to the page (`overscroll-behavior: contain`). Its bar is a slimmer variant: an 8px gutter, always kept and sitting in the nav's padding so items never change width, with the thumb shown only while the pointer is over the nav.
A scroll or clipping container clips anything painted outside it, so it keeps `stroke/2` of room on every side (padding, pulled back with a matching negative margin) for focus rings and outer borders. A specimen that is only a picture leaves the Tab order.
*Why:* the default Windows scrollbar looked out of place; a scrolling sidebar must never move the page; a focus ring must never be cut.


**D-038 · shadcn/ui mapping** · 2026-11-06
Developers on shadcn/ui get HeyOz through one file. `exports/shadcn/map.json` fills every shadcn slot with a HeyOz token; `npm run tokens` checks each reference and writes `exports/shadcn/globals.css` (Tailwind v4, paste-ready) and `docs/shadcn.md`. `primary` is `fill/inverse` (white), not orange: shadcn paints checkboxes, switches, sliders and the default button with `primary`, and orange is for the one main action, shipped as the extra `brand`. Other extras: `brand-muted`, `success`, `warning`, `info`, each with `-foreground`, plus `-hover` / `-active` state colours, because shadcn fades colours on hover and HeyOz steps them (D-035); the class swaps are listed, the component files stay as shadcn wrote them. The file holds resolved OKLCH values (each line names its token), so it works without the HeyOz CSS. Radii use the HeyOz scale under Tailwind's names (`rounded-md` = `radius/md`); `--radius` is `radius/lg`. Fonts: `font-sans` Geist, `font-heading` and `font-display` Bricolage. Dark only: `:root` and `.dark` are identical and the app sets `class="dark"`. Charts keep shadcn's defaults (D-012).
*Cost:* shadcn's own hover fades and `dark:` tweaks stay unless a developer makes the swaps; `rounded-4xl` stays at Tailwind's 32px.

**D-039 · Oz dashboard (prototype screen)** · 2026-11-13
`/dashboard` is Home, agent version: a prompt box (Oz), the one next move Oz suggests under it, then what Oz knows, in plain words. It uses Home's side nav, top nav and prompt box, plus Button, Segmented, tk(), and the editor's icon part, as they are. One orange fill per view: the Ask Oz button. Every yes is a primary (white) button. Thinking is free and automatic; anything that costs credits, money or changes the brand waits for a yes, and shows its cost as pills first. One picture, one sentence and one button per card; one number per stat tile; no jargon on screen. Sections appear only when they have something in them, ordered by what matters now. Oz's answer opens right under the prompt and enters like a popup (D-031). Five demo states (keys 1–5); in production the state comes from data, never asked. The pill, stat tile, idea card and competitor card are drafts, like the editor parts (D-034). Drawn ads are media: they use the primitive ramps and their own type, as a real ad would, and the light skips them (D-020). Data sources and ship order: `app/src/app/dashboard/README.md`.

**D-040 · Text field (draft)** · 2026-11-13
One component for one line and many (`components/textfield.json`): sizes xs 32, sm 40, md 48 with radius lg, xl, 2xl and Button's padding. The field is a well (D-036): `fill/primary`, `border/primary`, inner shade; hover `-hover`; focus steps the border up to `border/primary-active`, with no ring (subtle; the owner's call); invalid `border/critical`; disabled and read-only. Clear and show/hide are ghost Buttons one size smaller, inset evenly so corners stay parallel; Esc clears. The textarea grows from 3 to 8 rows. An error replaces the hint, with an icon, in a polite live region; a count turns critical at the limit.
*Cost:* the textarea's growing height does not animate (it would lag the caret), the one exception to D-031.

**D-041 · Checkbox, Radio and Switch (draft)** · 2026-11-13
Three selection controls with their own specs. Off is a well (`fill/primary`, `border/secondary`); on is white (`fill/inverse`, mark `content/inverse-primary`), as in D-038, so orange stays for the main action. Hover and press work on the whole row, label included (D-035); nothing moves. Box and circle are the icon frame (16 or 20); the switch track is 28 × 16 or 36 × 20. The tick draws in, the dot grows, the thumb slides at `duration/base`. No inner shade on these small controls: it greyed the white out, so on is a flat solid fill, as in most systems (Radix, shadcn). Every one has a 44 × 44 hit area (`size/target`) and a focus ring outside. Checkbox and Switch are native inputs; Radio is a radiogroup with one Tab stop and arrow keys.
*Cost:* disabled-on uses the disabled primary Button colours, because `fill/inverse-disabled` hides the mark.

**D-042 · Segmented and Tabs (draft)** · 2026-11-13
Segmented sets a value from 2 to 6 visible options; its options are Buttons and one tertiary indicator slides behind the chosen one (D-032). It is one Tab stop with arrow keys, takes icon-only and icon + label options, and fills or hugs. Tabs switch views of content: labels on a 1px `border/primary` baseline, one 2px `content/primary` underline that slides; sizes 40 and 32; counts, icons, automatic or manual activation, sideways scroll with clip room (D-037).
*Why:* the two look different on purpose, so a view switch is never mistaken for a setting.

**D-043 · Menu and Select (draft)** · 2026-11-13
Menu opens from any Button: action, checkbox, radio and submenu items, groups, separators, danger and disabled items. Its card is the Home menu's: `surface/tertiary`, `border/tertiary`, inner shade, the sheen, a light root (D-020); radius xl, items radius lg, padding 4; 192–320 wide, scrolls past 320 tall. One highlight slides behind the items (D-032). Select uses the same card and items as a listbox; its trigger is the text field's well (D-040), and the list is as wide as the trigger.
*Cost:* no diagonal "safe triangle" for submenus; items stay 32 tall in every Select size.

**D-044 · Tooltip and Popover (draft)** · 2026-11-13
One tooltip look, the side nav's: `surface/secondary`, `border/secondary`, radius md, padding 8/4, 8 from its control, `label/lg/medium`. It opens after 500ms on hover, at once on keyboard focus or when another tooltip was just open, never on touch; it flips and stays 8 inside the window. Popover is a non-modal card (`surface/tertiary`, radius xl, inner shade, drop-md) 240, 320 or 400 wide, opened by click; focus goes in when opened by keyboard and returns on close; Esc or a press outside closes it. Both are light roots fixed to the window, so no scroll area clips them.
*Cost:* the side nav and docs info tips still use their own tooltips until they move to this one.

**D-045 · Dialog and Toast (draft)** · 2026-11-13
Dialog is the one modal: the search dialog's scrim (background at 72%, `space/4` blur) and a `surface/primary` panel, radius 2xl, inner shade; widths 400, 520, 640. It traps focus, closes on Esc or a scrim press, gives focus back to its opener and locks the page without shifting it. Below 640 it becomes a bottom sheet. Alert dialog confirms or cancels. Toast: one toaster, bottom right (full width below 640); five types, the status shows on the icon only, the card stays `surface/tertiary`. Gone after 5s, 10s with an action; critical stays. Up to 3 stack; hover and focus pause them; F8 reaches them.
*Cost:* the destructive confirm is styled locally until Button has a critical type (Open, Q-6).

**D-046 · Badge, Chip and Avatar (draft)** · 2026-11-13
Badge is a status label you cannot press: 6 tones, soft (`fill/*-secondary` + `content/*`) or solid (`fill/*` + `content/on-*`), 18 or 24 tall from padding, `radius/full`, plus counts (99+) and a dot. Chip is the Home prompt chip made a component: tertiary fill, inner shade, 32 or 28 tall; action, filter (selected = the pressed look held, D-035), choice (one sliding indicator) and input (removable). Avatar: picture, then initials, then an icon; 6 sizes from 20 to 56 on existing tokens; circle for people, squircle for brands; status dot and overlapping groups. The picture is media (D-020).
*Why:* one badge replaces the editor badge and the dashboard pills; one chip replaces Home's chips.

**D-047 · Slider and Progress (draft)** · 2026-11-13
Slider: native range inputs over a drawn 8-tall well track, a 20 white thumb (the primary Button look), a value tag while dragging or focused, ticks, range with two thumbs, an optional number field; a 44-tall hit row; arrows, Shift × 10, Page Up/Down, Home and End. Progress: a bar 2, 4 or 8 tall, determinate or indeterminate, neutral (white) by default, brand only when it is the screen's main event. The Spinner is an icon on the icon grid (D-028) at the five icon sizes; reduced motion slows it.
*Cost:* the Spinner has round caps; Button's own spinner keeps butt caps until it uses this one.

---

## Open

Draft components (D-040 to D-047) wait for the owner's sign-off. The defaults below are in place.

- **Q-5 · Scroll in pop-ups.** Dialog hides its scrollbar and fades the edge; Popover and Menu use the one scrollbar (D-037). Default: as built. Pick one rule for every pop-up.
- **Q-6 · A critical Button type.** Destructive confirms need one (fill/critical, content/on-critical). Default: a local style in the dialog.
- **Q-7 · White or orange for "on".** Checkbox, Radio, Switch and the Tabs underline are white (D-038). Default: white.
- **Q-8 · The main action in a dialog.** Brand (orange) or primary (white, as D-039). Default: brand.

---

## History

- D-004 Full type matrix → replaced by D-018.
- D-005 Cursor light scoped, D-013 canvas glow as token, D-014 cursor light token → replaced by D-020.
- D-006 Warm neutrals, D-007 even surface ladder → folded into D-017.
- D-008 One selection model, D-009 hover never moves anything, D-011 principles tie-break → withdrawn with the principles page (2026-11-04).
- D-016 Neutral scale named by lightness → replaced by D-017.
- Q-2 Canvas glow → dropped (2026-11-04); removed from Home.
- Q-3 Canonical tool names → dropped (2026-11-04).
- D-033 typeface preview (switcher for stakeholder review) → removed 2026-11-13; fonts stay D-018.
- Q-4 Label colour on the brand fill → decided 2026-11-05: white stays (D-003).
