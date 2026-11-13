# Slider (generated)

> Generated from `components/slider.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Slider: every value is a token reference, a plain even number (a set value in px, not a token) or a rule (D-025). Draft: the owner may still change it.

Status: **draft**

## Anatomy

A label row (label left, value readout right), then one row: [number field] track + thumb(s) [number field], then optional tick marks and min / max labels. Single value: one thumb, the track is filled from the start to the thumb. Range: two thumbs, the track is filled between them. The track is drawn by the component; the thumbs are native range inputs laid over it, so the keyboard and screen readers work as they do for any slider.

## Rules

- **native**: Each thumb is an <input type=range>: role slider, aria-valuenow, aria-valuemin, aria-valuemax and the name come from the element. aria-valuetext carries the formatted value, with its unit. A range slider is two inputs named "<label> minimum" and "<label> maximum" in one role=group named by the label. The inputs are transparent and ignore the pointer; only their thumbs take it. A press anywhere else on the control row (the whole 44 height, along the full width) jumps the nearest thumb to that point and carries on as a drag.
- **hit**: The control row is size/target (44) tall, so a press anywhere on it counts. The visible track is 8 and the thumb 20, centred in it.
- **track**: A well: fill/primary with an inset stroke/1 border, border/secondary, so it reads on every surface. Hover (pointer on the control) border/secondary-hover; dragging border/secondary-active (D-035). The border is an inset shadow drawn above the fill, so it never moves anything.
- **range**: The filled part is fill/inverse-active, one step below the thumb, and takes the inner shade. Hover and dragging turn it fill/inverse.
- **thumb**: The primary look (D-038, D-020): fill/inverse at rest, fill/inverse-hover on hover, fill/inverse-active while dragging, with the inner shade. A halo of 4 in the thumb's own colour at 24% shows on hover and 40% while dragging. The thumb never changes size and the halo is a shadow, so nothing moves. Effects are not tokens (D-021).
- **focus**: Keyboard focus (focus-visible) draws a border/focus ring of stroke/2 around the focused thumb. Nothing clips it: the control row is not a clipping container. Leave 6 free beyond each end of the track (ring 2 + halo 4) when the slider sits in a clipping container (D-037).
- **tip**: A value tag floats 8 above the thumb while it is dragged or keyboard-focused: fill/elevated, border/tertiary, radius/md, label/md/medium. It fades in at duration/fast and rises 4px; reduced motion keeps the fade. It is lit (D-020). It is aria-hidden: the input already announces the value.
- **ticks**: Optional marks below the track, one per step (up to 20 steps; more steps show 10 even marks, or the count you give). 2 wide, 4 tall, border/tertiary; marks inside the filled part use content/tertiary. They sit on the same centre line as the thumb, so a thumb lands exactly on its mark.
- **limits**: Optional min and max labels under the track ends, label/md/regular, content/tertiary.
- **field**: Optional number field beside the track (a plain <input type=number>, spin buttons hidden): fill/primary, border/primary, hover border/primary-hover, focus border/focus, radius/lg, height size/control/xs (32), body/md/regular. It follows the slider live while the typed number is inside the range, and snaps to the step and clamps to the range on blur or Enter. Range sliders get two fields, one at each end of the track. With a field, the value readout in the label row is dropped (it would say the same thing twice).
- **keyboard**: Tab goes to each thumb in turn (minimum, then maximum). Arrows: one step. Shift + arrows: ten steps. Page Up / Page Down: 10% of the range (at least one step). Home / End: the lowest and highest allowed value (a minimum thumb stops at the maximum thumb, and the other way round). Every change fires onChange; onChangeEnd fires when a drag ends, after a key press and after a field is committed.
- **stacking**: When two thumbs sit on the same value the one last used is on top; at the start of the range the maximum thumb is on top and at the end the minimum thumb, so one can always be pulled away.
- **motion**: State changes (halo, fill, border) run at duration/fast, easing/standard (D-031). The thumb and the filled part follow the pointer with no easing: they are the pointer position. Reduced motion keeps the fades and drops the tag's rise.
- **disabled**: Track fill/primary with border/secondary-disabled, range content/primary-disabled, thumb fill/inverse-disabled, label and value content/primary-disabled. No halo, no tag, the cursor stays an arrow, and the inputs leave the Tab order.
- **when**: Use a slider for a value on a continuous or finely stepped scale where the rough position matters more than the exact number: volume, opacity, duration, strength. Add the number field when people need the exact value. Use a segmented control for 2 to 5 named choices, a number field alone for an exact value on a wide range, and a switch for on / off.
- **grid**: Set values are on the 4px grid with 2px half-steps (D-025). Thumb 20, track 8, halo 4, tick 2 by 4, tag 24, field 72 wide.

## Values

| Variable | Value |
|---|---|
| `--sl-hit` | `size/target` |
| `--sl-gap` | `space/4` |
| `--sl-label-color` | `content/primary` |
| `--sl-label-color-disabled` | `content/primary-disabled` |
| `--sl-value-color` | `content/secondary` |
| `--sl-value-color-disabled` | `content/primary-disabled` |
| `--sl-track-height` | 8px (set) |
| `--sl-track-radius` | `radius/full` |
| `--sl-track-fill` | `fill/primary` |
| `--sl-track-border` | `border/secondary` |
| `--sl-track-border-hover` | `border/secondary-hover` |
| `--sl-track-border-active` | `border/secondary-active` |
| `--sl-track-border-disabled` | `border/secondary-disabled` |
| `--sl-range-fill` | `fill/inverse-active` |
| `--sl-range-fill-hover` | `fill/inverse` |
| `--sl-range-fill-disabled` | `content/primary-disabled` |
| `--sl-thumb-size` | 20px (set) |
| `--sl-thumb-halo` | 4px (set) |
| `--sl-thumb-fill` | `fill/inverse` |
| `--sl-thumb-fill-hover` | `fill/inverse-hover` |
| `--sl-thumb-fill-active` | `fill/inverse-active` |
| `--sl-thumb-fill-disabled` | `fill/inverse-disabled` |
| `--sl-thumb-ring` | `stroke/2` |
| `--sl-thumb-ring-color` | `border/focus` |
| `--sl-tick-width` | 2px (set) |
| `--sl-tick-height` | 4px (set) |
| `--sl-tick-offset` | 4px (set) |
| `--sl-tick-color` | `border/tertiary` |
| `--sl-tick-color-active` | `content/tertiary` |
| `--sl-tip-height` | 24px (set) |
| `--sl-tip-padding-x` | `space/8` |
| `--sl-tip-gap` | `space/8` |
| `--sl-tip-radius` | `radius/md` |
| `--sl-tip-fill` | `fill/elevated` |
| `--sl-tip-border` | `border/tertiary` |
| `--sl-tip-color` | `content/primary` |
| `--sl-limit-color` | `content/tertiary` |
| `--sl-field-width` | 72px (set) |
| `--sl-field-height` | `size/control/xs` |
| `--sl-field-gap` | `space/12` |
| `--sl-field-padding-x` | `space/12` |
| `--sl-field-radius` | `radius/lg` |
| `--sl-field-fill` | `fill/primary` |
| `--sl-field-fill-disabled` | `fill/primary-disabled` |
| `--sl-field-border` | `border/primary` |
| `--sl-field-border-hover` | `border/primary-hover` |
| `--sl-field-border-focus` | `border/focus` |
| `--sl-field-border-disabled` | `border/primary-disabled` |
| `--sl-field-color` | `content/primary` |
| `--sl-field-color-disabled` | `content/primary-disabled` |
| type · label | `type-label-md-medium` |
| type · value | `type-label-md-medium` |
| type · tip | `type-label-md-medium` |
| type · limit | `type-label-md-regular` |
| type · field | `type-body-md-regular` |
