# shadcn/ui mapping (generated)

> Generated from `exports/shadcn/map.json` by `app/scripts/build-tokens.mjs`. Do not edit.

HeyOz → shadcn/ui. Fills shadcn's CSS variable slots with HeyOz tokens so every shadcn component renders in HeyOz colours, radii and fonts. Every value is a {token} reference; the build checks each one and writes exports/shadcn/globals.css and docs/shadcn.md (D-038). Target: shadcn/ui on Tailwind CSS v4 (CSS-first config, OKLCH).

Checked against: shadcn CLI (shadcn@latest init, style base-nova) on Tailwind CSS v4, checked 2026-11-06.

## Use it

1. Set up shadcn/ui in the app as usual (Tailwind v4).
2. Replace the shadcn `globals.css` with `exports/shadcn/globals.css`. In a project made before the 2026 shadcn CLI, delete the `@import "shadcn/tailwind.css"` line.
3. Put `class="dark"` on `<html>`. HeyOz is dark only (D-001); the file gives `:root` and `.dark` the same values, and the class turns on shadcn's own `dark:` tweaks.
4. Load the fonts. With `next/font`: Geist with `variable: "--font-geist-sans"` (the create-next-app default) and Bricolage Grotesque with `variable: "--font-bricolage"`, both classes on `<html>`. Without `next/font`, install the two families and the names are used as they are.
5. Optional: make the class swaps below in `components/ui/*`, so hover and press step like HeyOz instead of fading.

## shadcn slots

| shadcn variable | Tailwind class | HeyOz token | Hex | Why |
|---|---|---|---|---|
| `--background` | `bg-background` | `background` | #070505 | The app background. |
| `--foreground` | `text-foreground` | `content/primary` | #F1EEEC | Default text. |
| `--card` | `bg-card` | `surface/primary` | #0E0C0B | Cards and panels: the first surface above the background. |
| `--card-foreground` | `text-card-foreground` | `content/primary` | #F1EEEC | Text on cards. |
| `--popover` | `bg-popover` | `surface/secondary` | #151312 | Menus, selects, popovers and dialogs float one step above cards (modals use surface/secondary). |
| `--popover-foreground` | `text-popover-foreground` | `content/primary` | #F1EEEC | Text in popovers. |
| `--primary` | `bg-primary` | `fill/inverse` | #F1EEEC | shadcn's default button, checkbox, switch, slider and radio. White, like the HeyOz primary button, so orange stays for the one main action (use brand). |
| `--primary-foreground` | `text-primary-foreground` | `content/inverse-primary` | #070505 | Dark text and icons on primary. |
| `--secondary` | `bg-secondary` | `fill/secondary` | #151312 | Secondary button fill. |
| `--secondary-foreground` | `text-secondary-foreground` | `content/primary` | #F1EEEC | Text on secondary. |
| `--muted` | `bg-muted` | `fill/tertiary` | #1D1B1A | Quiet backgrounds: tabs list, skeletons, code, table rows. |
| `--muted-foreground` | `text-muted-foreground` | `content/tertiary` | #92908E | Hints, descriptions, placeholders. |
| `--accent` | `bg-accent` | `fill/secondary-hover` | #1D1B1A | Hover and focus on menu items, ghost and outline buttons: one step above the popover surface. |
| `--accent-foreground` | `text-accent-foreground` | `content/primary` | #F1EEEC | Text on accent. |
| `--destructive` | `bg-destructive` | `fill/critical` | #FF383F | Delete and error actions. |
| `--destructive-foreground` | `text-destructive-foreground` | `content/on-critical` | #FFFFFF | Text on destructive (shadcn maps it in @theme but no longer defines it; HeyOz does). |
| `--border` | `border-border` | `border/primary` | #1D1B1A | Default borders and dividers: two steps above surface/primary. |
| `--input` | `border-input` | `border/secondary` | #262322 | Input, select and outline button borders. |
| `--ring` | `ring-ring` | `border/focus` | #403E3C | Keyboard focus ring (gray/8, subtle, stroke/2). |
| `--sidebar` | `bg-sidebar` | `surface/primary` | #0E0C0B | Side nav background (sidenav.json nav.background). |
| `--sidebar-foreground` | `text-sidebar-foreground` | `content/primary` | #F1EEEC | Side nav item text. |
| `--sidebar-primary` | `bg-sidebar-primary` | `fill/brand` | #FF3D01 | The logo square and brand mark in the sidebar header (the HeyOz logomark is orange). |
| `--sidebar-primary-foreground` | `text-sidebar-primary-foreground` | `content/on-brand` | #FFFFFF | Text and icons on sidebar-primary. |
| `--sidebar-accent` | `bg-sidebar-accent` | `fill/primary-active` | #1D1B1A | The current page item (sidenav item.active.fill). shadcn also uses it for hover; HeyOz hover is sidebar-accent-hover below. |
| `--sidebar-accent-foreground` | `text-sidebar-accent-foreground` | `content/primary` | #F1EEEC | Text on the current item. |
| `--sidebar-border` | `border-sidebar-border` | `border/primary` | #1D1B1A | Side nav borders and dividers. |
| `--sidebar-ring` | `ring-sidebar-ring` | `border/focus` | #403E3C | Focus ring in the side nav. |

## HeyOz additions

HeyOz colours shadcn has no slot for, added the shadcn way: a colour and its -foreground, mapped in @theme inline so bg-brand, text-brand-foreground and the rest work.

| shadcn variable | Tailwind class | HeyOz token | Hex | Why |
|---|---|---|---|---|
| `--brand` | `bg-brand` | `fill/brand` | #FF3D01 | The one main action on a screen (Generate, Export). HeyOz button type brand. |
| `--brand-foreground` | `text-brand-foreground` | `content/on-brand` | #FFFFFF | Text on brand. |
| `--brand-muted` | `bg-brand-muted` | `fill/brand-secondary` | #250A05 | A brand action that should not shout. HeyOz button type brand-tone. |
| `--brand-muted-foreground` | `text-brand-muted-foreground` | `content/brand` | #FF6645 | Text on brand-muted. |
| `--success` | `bg-success` | `fill/success` | #00AC62 | Success fill. |
| `--success-foreground` | `text-success-foreground` | `content/on-success` | #FFFFFF | Text on success. |
| `--warning` | `bg-warning` | `fill/warning` | #C08200 | Warning fill. |
| `--warning-foreground` | `text-warning-foreground` | `content/on-warning` | #FFFFFF | Text on warning. |
| `--info` | `bg-info` | `fill/info` | #478CFF | Info fill. |
| `--info-foreground` | `text-info-foreground` | `content/on-info` | #FFFFFF | Text on info. |

## States

shadcn makes hover by fading a colour (bg-primary/90). HeyOz uses real steps: hover one step up, pressed two (D-035). These variables carry those steps; swap the classes listed in swaps.

| shadcn variable | Tailwind class | HeyOz token | Hex | Why |
|---|---|---|---|---|
| `--primary-hover` | `bg-primary-hover` | `fill/inverse-hover` | #FFFFFF | Primary, pointed at. |
| `--primary-active` | `bg-primary-active` | `fill/inverse-active` | #C0BDBB | Primary, pressed. |
| `--secondary-hover` | `bg-secondary-hover` | `fill/secondary-hover` | #1D1B1A | Secondary, pointed at. |
| `--secondary-active` | `bg-secondary-active` | `fill/secondary-active` | #262322 | Secondary, pressed. |
| `--brand-hover` | `bg-brand-hover` | `fill/brand-hover` | #FF6645 | Brand, pointed at. |
| `--brand-active` | `bg-brand-active` | `fill/brand-active` | #741600 | Brand, pressed. |
| `--brand-muted-hover` | `bg-brand-muted-hover` | `fill/brand-secondary-hover` | #330E07 | Brand-muted, pointed at. |
| `--brand-muted-active` | `bg-brand-muted-active` | `fill/brand-secondary-active` | #411208 | Brand-muted, pressed. |
| `--destructive-hover` | `bg-destructive-hover` | `fill/critical-hover` | #FF635F | Destructive, pointed at. |
| `--destructive-active` | `bg-destructive-active` | `fill/critical-active` | #760F15 | Destructive, pressed. |
| `--accent-active` | `bg-accent-active` | `fill/secondary-active` | #262322 | Menu item or ghost button, pressed. |
| `--input-hover` | `border-input-hover` | `border/secondary-hover` | #2E2C2B | Input and outline borders, pointed at. |
| `--input-active` | `border-input-active` | `border/secondary-active` | #373533 | Input and outline borders, pressed or open. |
| `--sidebar-accent-hover` | `bg-sidebar-accent-hover` | `fill/primary-hover` | #151312 | Side nav item, pointed at (sidenav item.hover.fill). |

## Class swaps

Class changes inside the shadcn component files (components/ui/*.tsx). Optional: without them every component works, its hover just fades instead of stepping. Exact classes differ a little between shadcn styles (base-nova, new-york); look for the pattern on the left.

| Where | shadcn | HeyOz |
|---|---|---|
| button · default | `hover:bg-primary/80 (or /90)` | `hover:bg-primary-hover active:bg-primary-active` |
| button · secondary | `hover:bg-[color-mix(…)] (or hover:bg-secondary/80)` | `hover:bg-secondary-hover active:bg-secondary-active` |
| button · destructive (solid) | `hover:bg-destructive/90` | `hover:bg-destructive-hover active:bg-destructive-active` |
| button · outline, ghost | `hover:bg-muted (or hover:bg-accent), dark:hover:bg-input/50` | `hover:bg-accent active:bg-accent-active` |
| button · new brand variant | `(none)` | `bg-brand text-brand-foreground hover:bg-brand-hover active:bg-brand-active` |
| input, select, textarea | `border-input` | `border-input hover:border-input-hover` |
| focus, every component | `focus-visible:ring-ring/50 focus-visible:ring-3` | `focus-visible:ring-ring focus-visible:ring-2` |
| sidebar menu button | `hover:bg-sidebar-accent` | `hover:bg-sidebar-accent-hover` |

## Radius

shadcn derives its radii from one --radius with multipliers. HeyOz has a fixed scale with the same names, so each Tailwind radius is set to the HeyOz token of the same name: rounded-md is radius/md (8). --radius is radius/lg (12), what shadcn calls lg.

| Tailwind | HeyOz token | Value |
|---|---|---|
| `--radius` | `radius/lg` | 12px |
| `rounded-xs` | `radius/xs` | 4px |
| `rounded-sm` | `radius/sm` | 6px |
| `rounded-md` | `radius/md` | 8px |
| `rounded-lg` | `radius/lg` | 12px |
| `rounded-xl` | `radius/xl` | 16px |
| `rounded-2xl` | `radius/2xl` | 20px |
| `rounded-3xl` | `radius/3xl` | 24px |

## Fonts

font-sans is Geist (body and label); font-heading and font-display are Bricolage Grotesque (display and heading; shadcn's own headings use font-heading). Each reads a next/font variable first and falls back to the installed family name: load Geist with variable --font-geist-sans (the create-next-app default) and Bricolage Grotesque with --font-bricolage.

| Tailwind | HeyOz role | Family | next/font variable |
|---|---|---|---|
| `font-sans` | body | Geist | `--font-geist-sans` |
| `font-heading` | heading | Bricolage Grotesque | `--font-bricolage` |
| `font-display` | display | Bricolage Grotesque | `--font-bricolage` |

## Not mapped

- **chart-1 … chart-5.** HeyOz has no chart palette (D-012). The file keeps shadcn's dark chart colours so charts still render; they are not HeyOz colours. Revisit with the first screen that needs a chart.
- **light mode.** HeyOz is dark only (D-001). :root and .dark carry the same values, so nothing turns light by accident.
- **--radius-4xl.** HeyOz has no radius above radius/3xl (24). The file leaves rounded-4xl at Tailwind's default (32px); avoid it.
