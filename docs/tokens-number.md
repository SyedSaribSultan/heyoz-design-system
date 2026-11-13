# Number tokens (generated)

> Generated from `tokens/number.json` by `app/scripts/build-tokens.mjs`. Do not edit.

HeyOz number tokens: space, radius, size and stroke. Source of truth. All values are px. Names say the size: space/16 is 16px, stroke/1 is 1px. Radius runs none, xs to 3xl, full; size uses t-shirt names (icon xs to xl; control adds 2xs and 2xl).

## space

Gaps and padding. 4px grid; 2 and 6 are half-steps for tight UI. The name is the value.

| Token | CSS variable | Value |
|---|---|---|
| `space/0` | `--space-0` | 0px |
| `space/2` | `--space-2` | 2px |
| `space/4` | `--space-4` | 4px |
| `space/6` | `--space-6` | 6px |
| `space/8` | `--space-8` | 8px |
| `space/12` | `--space-12` | 12px |
| `space/16` | `--space-16` | 16px |
| `space/20` | `--space-20` | 20px |
| `space/24` | `--space-24` | 24px |
| `space/32` | `--space-32` | 32px |
| `space/40` | `--space-40` | 40px |
| `space/48` | `--space-48` | 48px |
| `space/64` | `--space-64` | 64px |
| `space/80` | `--space-80` | 80px |
| `space/96` | `--space-96` | 96px |

## radius

Corner rounding. Nested corners: inner radius = outer radius minus the gap between them.

| Token | CSS variable | Value |
|---|---|---|
| `radius/none` | `--radius-none` | 0px |
| `radius/xs` | `--radius-xs` | 4px |
| `radius/sm` | `--radius-sm` | 6px |
| `radius/md` | `--radius-md` | 8px |
| `radius/lg` | `--radius-lg` | 12px |
| `radius/xl` | `--radius-xl` | 16px |
| `radius/2xl` | `--radius-2xl` | 20px |
| `radius/3xl` | `--radius-3xl` | 24px |
| `radius/full` | `--radius-full` | 9999px |

## size

Fixed sizes. control = height of buttons, inputs, chips; seven sizes, 2xs 28, then 8px steps from xs 32 to 2xl 72. xs (32) is the everyday size. icon = the icon's frame. iconGrid = the icon grid, as ratios of the frame, so it works at any size: padding keeps the frame's edge clear, square and circle are the key shapes, stroke is the line weight (24 → 2 padding, 18 square, 20 circle, 1.5 stroke). HeyOz icons fill the key square: longest side frame × 0.75, at least 1/8 clear on every side. Every icon asset is exported as its frame, never as the bare vector. target = smallest touch area, built as an invisible layer if the visible element is smaller.

| Token | CSS variable | Value |
|---|---|---|
| `size/control/2xs` | `--size-control-2xs` | 28px |
| `size/control/xs` | `--size-control-xs` | 32px |
| `size/control/sm` | `--size-control-sm` | 40px |
| `size/control/md` | `--size-control-md` | 48px |
| `size/control/lg` | `--size-control-lg` | 56px |
| `size/control/xl` | `--size-control-xl` | 64px |
| `size/control/2xl` | `--size-control-2xl` | 72px |
| `size/icon/xs` | `--size-icon-xs` | 12px |
| `size/icon/sm` | `--size-icon-sm` | 16px |
| `size/icon/md` | `--size-icon-md` | 20px |
| `size/icon/lg` | `--size-icon-lg` | 24px |
| `size/icon/xl` | `--size-icon-xl` | 32px |
| `size/target` | `--size-target` | 44px |
| `size/icon/grid/padding` | `--size-icon-grid-padding` | 0.0833 (ratio) |
| `size/icon/grid/square` | `--size-icon-grid-square` | 0.75 (ratio) |
| `size/icon/grid/circle` | `--size-icon-grid-circle` | 0.8333 (ratio) |
| `size/icon/grid/stroke` | `--size-icon-grid-stroke` | 0.0625 (ratio) |

## stroke

Line widths. stroke/1 for borders and dividers, stroke/2 for focus rings and selected outlines.

| Token | CSS variable | Value |
|---|---|---|
| `stroke/1` | `--stroke-1` | 1px |
| `stroke/2` | `--stroke-2` | 2px |
