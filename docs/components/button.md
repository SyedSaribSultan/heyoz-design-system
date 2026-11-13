# Button (generated)

> Generated from `components/button.json` by `app/scripts/build-tokens.mjs`. Do not edit.

**Status:** draft

One frame: [icon] [label] [icon]. The frame carries height, padding x, gap, radius, fill and border; the same values apply to all three children. Either icon is optional; with no label the button is icon-only and square.

## Rules

- **Height.** size/control/{size}: 2xs 28, then 8px steps from xs 32 to 2xl 72. xs (32) is the everyday size. Fixed; children are centred, so padding y is not set: it is whatever is left over (2xs: 6).
- **Label.** Text is always the body role, medium weight: 2xs 12, xs 14 (the everyday size), sm 14, md 16, lg 18, xl 20, 2xl 24. From md up, text stays about a third of the height.
- **Icon.** A square frame from the icon scale, chosen by text size: 16 for 12 and 14px text, 20 for 16px, 24 for 18 and 20px, 32 for 24px. The vector follows the icon grid: it fills the key square (size/icon/grid/square, 75%).
- **Radius.** Squircle: height × 0.375 (xs: 12 on 32), rounded to the nearest 4, so every size stays about equally round. 2xs sets its own: 10. Pill: radius/full (1000 in Figma). Same padding for both.
- **Border.** stroke/1 at every size.
- **States.** Secondary, tertiary, outline and ghost: hover and pressed turn the icon content/brand; the label stays content/primary; the border stays in its own family, -hover on hover and -active when pressed (D-035). Brand, primary, brand-tone and brand-ghost change fill only.
- **Shade.** Every state that has a fill gets the inner shade: inner shadow x 0, y −4, blur 10, spread 0, #000000 at 50%. No fill, no shade (outline, ghost and brand-ghost at rest; they get it on hover and press).
- **Grid.** Every value you type in Figma is on the 4px grid; values under 12 may use 2px half-steps (2xs: padding x 10, radius 10). A plain number in a size means a set value that is not a token.

## Sizes

| Size | Height | Padding x | Padding y | Gap | Label | Icon | Radius (squircle) |
|---|---|---|---|---|---|---|---|
| 2xs | 28 `size/control/2xs` | 10 (set, not a token) | 6 (left over) | 4 `space/4` | 12/16 `type/body/sm/medium` | 16 × 16 `size/icon/sm` | 10 (set) |
| xs | 32 `size/control/xs` | 12 `space/12` | 6 (left over) | 4 `space/4` | 14/20 `type/body/md/medium` | 16 × 16 `size/icon/sm` | 12 |
| sm | 40 `size/control/sm` | 16 `space/16` | 10 (left over) | 4 `space/4` | 14/20 `type/body/md/medium` | 16 × 16 `size/icon/sm` | 16 |
| md | 48 `size/control/md` | 20 `space/20` | 12 (left over) | 8 `space/8` | 16/24 `type/body/lg/medium` | 20 × 20 `size/icon/md` | 20 |
| lg | 56 `size/control/lg` | 24 `space/24` | 14 (left over) | 8 `space/8` | 18/28 `type/body/xl/medium` | 24 × 24 `size/icon/lg` | 20 |
| xl | 64 `size/control/xl` | 32 `space/32` | 18 (left over) | 8 `space/8` | 20/28 `type/body/2xl/medium` | 24 × 24 `size/icon/lg` | 24 |
| 2xl | 72 `size/control/2xl` | 40 `space/40` | 20 (left over) | 12 `space/12` | 24/32 `type/body/3xl/medium` | 32 × 32 `size/icon/xl` | 28 |

Pill: same values, `radius/full`.

## Types

Every type has the same four states. `none` = transparent.

### brand

The main action. One per view.

| State | Fill | Border | Label | Icon | Inner shade |
|---|---|---|---|---|---|
| rest | `fill/brand` | `none` | `content/on-brand` | `content/on-brand` | yes |
| hover | `fill/brand-hover` | `none` | `content/on-brand` | `content/on-brand` | yes |
| pressed | `fill/brand-active` | `none` | `content/on-brand` | `content/on-brand` | yes |
| disabled | `fill/brand-disabled` | `none` | `content/on-brand-disabled` | `content/on-brand-disabled` | yes |

### primary

Strong neutral action, light on dark.

| State | Fill | Border | Label | Icon | Inner shade |
|---|---|---|---|---|---|
| rest | `fill/inverse` | `none` | `content/inverse-primary` | `content/inverse-primary` | yes |
| hover | `fill/inverse-hover` | `none` | `content/inverse-primary` | `content/inverse-primary` | yes |
| pressed | `fill/inverse-active` | `none` | `content/inverse-primary` | `content/inverse-primary` | yes |
| disabled | `fill/secondary-disabled` | `none` | `content/primary-disabled` | `content/primary-disabled` | yes |

### secondary

Default action on surfaces.

| State | Fill | Border | Label | Icon | Inner shade |
|---|---|---|---|---|---|
| rest | `fill/secondary` | `border/secondary` | `content/primary` | `content/primary` | yes |
| hover | `fill/secondary-hover` | `border/secondary-hover` | `content/primary` | `content/brand` | yes |
| pressed | `fill/secondary-active` | `border/secondary-active` | `content/primary` | `content/brand` | yes |
| disabled | `fill/secondary-disabled` | `border/secondary-disabled` | `content/primary-disabled` | `content/primary-disabled` | yes |

### tertiary

Quiet action; chips and settings in the prompt box.

| State | Fill | Border | Label | Icon | Inner shade |
|---|---|---|---|---|---|
| rest | `fill/tertiary` | `border/tertiary` | `content/primary` | `content/primary` | yes |
| hover | `fill/tertiary-hover` | `border/tertiary-hover` | `content/primary` | `content/brand` | yes |
| pressed | `fill/tertiary-active` | `border/tertiary-active` | `content/primary` | `content/brand` | yes |
| disabled | `fill/tertiary-disabled` | `border/tertiary-disabled` | `content/primary-disabled` | `content/primary-disabled` | yes |

### outline

Border only, no fill.

| State | Fill | Border | Label | Icon | Inner shade |
|---|---|---|---|---|---|
| rest | `none` | `border/secondary` | `content/primary` | `content/primary` | no |
| hover | `fill/secondary` | `border/secondary-hover` | `content/primary` | `content/brand` | yes |
| pressed | `fill/secondary-hover` | `border/secondary-active` | `content/primary` | `content/brand` | yes |
| disabled | `none` | `border/secondary-disabled` | `content/primary-disabled` | `content/primary-disabled` | no |

### ghost

No fill or border until hovered.

| State | Fill | Border | Label | Icon | Inner shade |
|---|---|---|---|---|---|
| rest | `none` | `none` | `content/primary` | `content/primary` | no |
| hover | `fill/secondary` | `border/secondary-hover` | `content/primary` | `content/brand` | yes |
| pressed | `fill/secondary-hover` | `border/secondary-active` | `content/primary` | `content/brand` | yes |
| disabled | `none` | `none` | `content/primary-disabled` | `content/primary-disabled` | no |

### brand-tone

Brand action that should not shout.

| State | Fill | Border | Label | Icon | Inner shade |
|---|---|---|---|---|---|
| rest | `fill/brand-secondary` | `none` | `content/brand` | `content/brand` | yes |
| hover | `fill/brand-secondary-hover` | `none` | `content/brand` | `content/brand` | yes |
| pressed | `fill/brand-secondary-active` | `none` | `content/brand` | `content/brand` | yes |
| disabled | `fill/brand-secondary-disabled` | `none` | `content/brand-disabled` | `content/brand-disabled` | yes |

### brand-ghost

Brand text, fill only on hover.

| State | Fill | Border | Label | Icon | Inner shade |
|---|---|---|---|---|---|
| rest | `none` | `none` | `content/brand` | `content/brand` | no |
| hover | `fill/brand-secondary` | `none` | `content/brand` | `content/brand` | yes |
| pressed | `fill/brand-secondary-hover` | `none` | `content/brand` | `content/brand` | yes |
| disabled | `none` | `none` | `content/brand-disabled` | `content/brand-disabled` | no |

## Links

Links have no frame: text (and an optional icon) in the button's label style for that size, no fill, no border, no padding. Colour changes per state.

| Link | Rest | Hover | Pressed | Disabled |
|---|---|---|---|---|
| brand | `content/brand` | `content/brand-hover` | `content/brand-active` | `content/brand-disabled` |
| neutral | `content/primary` | `content/secondary` | `content/tertiary` | `content/primary-disabled` |

- **Loading.** Disabled colours; the trailing icon becomes a spinner. The spinner is an icon: same frame, the ring fills the key square, line weight = frame × size/icon/grid/stroke.
- **Focus.** Rest colours plus a ring outside the border: border/focus, stroke/2.
- **Effects.** Inner shade on every filled state, inset 0 -4 10 rgba(0,0,0,.5). An effect, not a token (D-021).
