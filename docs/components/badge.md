# Badge (generated)

> Generated from `components/badge.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Badge: a small, non-interactive label for a status, a count or a new-thing signal. Every value is a token reference, a plain even number (a set value in px, not a token), 'none' or a rule (D-025). Unifies the editor Badge draft and the dashboard pills.

Status: **draft**

## Anatomy

One pill: [dot or icon] [label]. Three forms of the same frame: a label badge (text, optional leading dot or icon), a count badge (a number, 99+ above the cap) and a dot-only badge (no text, the 'new' signal on an icon or avatar). Height is not set: it is the line height of the label type plus padding y twice.

## Rules

- **role**: Not interactive: no hover, no pressed, no focus, never a button. If it can be clicked, it is a Chip or a Button. It is a span with text; a dot-only badge is role img with an aria-label, because a dot alone says nothing to a screen reader.
- **tones**: Six tones: neutral, brand, success, warning, critical, info. Status tones mean what Status means in the rest of the system; brand is for what is new or yours, never for a plain status.
- **variants**: Soft is the default: fill/*-secondary with content/*, a tint that does not shout. Solid is the strong one: fill/* with content/on-*; neutral solid is fill/inverse with content/inverse-primary. Use solid for a count or a dot that must be seen on a busy surface, soft everywhere else.
- **sizes**: sm: label/sm (11/14) with padding y 2, so 18 tall. md: label/md (12/16) with padding y 4, so 24 tall. Heights come from padding, never from a typed height.
- **radius**: radius/full for every badge. A badge is a pill; a Chip is a squircle, so the two never read as the same thing.
- **shade**: Solid badges carry the inner shade (0, -4, blur 10, #000 50%), like any filled control. Soft badges are a tint and carry none; dot-only badges carry none. An effect, not a token (D-021).
- **light**: Label and count badges are lit (D-020). A dot-only badge is a signal, not a surface, and is not lit.
- **icon**: Lucide, in a frame from the icon scale: sm 12, md 16. The vector fills the key square of the icon grid.
- **dot**: A leading dot is 6, drawn in the tone's own colour (soft: fill/*, solid: the label colour). The dot-only badge is 8 (sm) or 10 (md).
- **count**: A number in tabular figures. One digit is a circle: min-width equals the height. Above the cap (default 99) it reads 99+. A count of 0 renders nothing. Give it a label ('unread') so a screen reader says what is being counted.
- **anchor**: On an icon, a button or an avatar the badge sits on the top-right corner, centred on it, with a ring of the surface colour (ring-colour, stroke/2) so it cuts out of what it covers. On a circle the corner is 14.6% in from each side, so the badge sits on the circle's edge. BadgeAnchor does this; the ring colour follows the surface the badge sits on.
- **motion**: A change of tone or variant fades at duration/fast (D-031). A badge that appears fades in; nothing slides or scales. Reduced motion keeps the fade.
- **clip**: A badge outside its anchor paints beyond the anchor's box, so a scrolling or clipping parent needs space for it (stroke/2 plus half the badge, D-037).
- **usage**: Use a Badge for a status (Live, Failed, Draft), a count on a nav item or icon, or a quiet 'New'. Do not use it for an action (Button), a removable or selectable tag (Chip), a message (Toast, Callout) or a long label: if it needs more than about two words, it is text.

## Values

| Variable | Value |
|---|---|
| `--bdg-sm-padding-x` | `space/6` |
| `--bdg-sm-padding-y` | 2px (set) |
| `--bdg-sm-gap` | `space/2` |
| `--bdg-sm-icon` | `size/icon/xs` |
| `--bdg-sm-dot` | 6px (set) |
| `--bdg-sm-signal` | 8px (set) |
| `--bdg-md-padding-x` | `space/8` |
| `--bdg-md-padding-y` | 4px (set) |
| `--bdg-md-gap` | `space/4` |
| `--bdg-md-icon` | `size/icon/sm` |
| `--bdg-md-dot` | 6px (set) |
| `--bdg-md-signal` | 10px (set) |
| `--bdg-radius` | `radius/full` |
| `--bdg-ring-colour` | `surface/primary` |
| `--bdg-ring-width` | `stroke/2` |
| `--bdg-soft-neutral-fill` | `fill/tertiary` |
| `--bdg-soft-neutral-content` | `content/secondary` |
| `--bdg-soft-neutral-dot` | `content/tertiary` |
| `--bdg-soft-brand-fill` | `fill/brand-secondary` |
| `--bdg-soft-brand-content` | `content/brand` |
| `--bdg-soft-brand-dot` | `fill/brand` |
| `--bdg-soft-success-fill` | `fill/success-secondary` |
| `--bdg-soft-success-content` | `content/success` |
| `--bdg-soft-success-dot` | `fill/success` |
| `--bdg-soft-warning-fill` | `fill/warning-secondary` |
| `--bdg-soft-warning-content` | `content/warning` |
| `--bdg-soft-warning-dot` | `fill/warning` |
| `--bdg-soft-critical-fill` | `fill/critical-secondary` |
| `--bdg-soft-critical-content` | `content/critical` |
| `--bdg-soft-critical-dot` | `fill/critical` |
| `--bdg-soft-info-fill` | `fill/info-secondary` |
| `--bdg-soft-info-content` | `content/info` |
| `--bdg-soft-info-dot` | `fill/info` |
| `--bdg-solid-neutral-fill` | `fill/inverse` |
| `--bdg-solid-neutral-content` | `content/inverse-primary` |
| `--bdg-solid-brand-fill` | `fill/brand` |
| `--bdg-solid-brand-content` | `content/on-brand` |
| `--bdg-solid-success-fill` | `fill/success` |
| `--bdg-solid-success-content` | `content/on-success` |
| `--bdg-solid-warning-fill` | `fill/warning` |
| `--bdg-solid-warning-content` | `content/on-warning` |
| `--bdg-solid-critical-fill` | `fill/critical` |
| `--bdg-solid-critical-content` | `content/on-critical` |
| `--bdg-solid-info-fill` | `fill/info` |
| `--bdg-solid-info-content` | `content/on-info` |
| type · sm | `type-label-sm-medium` |
| type · md | `type-label-md-medium` |
