# Switch (generated)

> Generated from `components/switch.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Switch: a track and a thumb. On or off, effective at once. Every value is a token reference, a plain number (a set value in px, not a token), 'none' or a rule (D-025). Status draft: the owner may still change it.

Status: **draft**

## Anatomy

A row: [track with thumb] [label + description], or [label + description] [track] when the label is on the left. The track is a rounded well; the thumb slides inside it. The whole row is the click target.

## Rules

- **states**: Off, on; each at rest, hover, pressed, focus and disabled. Off is a well: fill/primary track with border/secondary, and a content/secondary thumb. On is fill/inverse (white, like shadcn's primary, D-038) with a content/inverse-primary thumb. Orange stays for the one main action (D-003).
- **hover**: Hover is the -hover fill and border of the track's own family (D-035); the off thumb lights to content/primary. Pressed is one step stronger, the -active fill and border. Hover and press work on the whole row, label included. Nothing moves or changes size: the border is an inset box-shadow.
- **shade**: Every state with a fill carries the inner shade (inset 0 -4 10, #000 at 50%), like Button (D-021). The track is a lit surface (D-020).
- **motion**: The thumb slides from one end of the track to the other, duration/base, easing/standard (D-031). Track colour and thumb colour change at duration/fast. The first paint never animates. Reduced motion: no slide, the thumb and track fade to the new state.
- **size**: sm: track 28 x 16, thumb 12. md: track 36 x 20, thumb 16. md is the default. The thumb sits 2 from the track's edge on every side. The thumb's travel is the track width minus the thumb minus 4. Text is the same in both: label body/md/regular, description body/sm/regular.
- **label**: Right of the switch by default. On the left (labelPosition start), the row can span the full width (block) so the switch sits at the far edge, as in a settings list.
- **colours**: Label content/primary, description content/tertiary. Disabled: label content/primary-disabled, description content/tertiary-disabled, track -disabled fill and border, thumb content/primary-disabled; a disabled on track uses fill/secondary-disabled, like a disabled primary Button, because fill/inverse-disabled is the same grey as the thumb.
- **focus**: Keyboard focus (focus-visible only) draws a ring outside the track: border/focus, stroke/2. The row never clips it. A scroll or clip container around a switch keeps stroke/2 of room (D-037).
- **hit**: The visible track is smaller than size/target (44) in height, and in width too. An invisible layer around the track makes the hit area at least 44 x 44 without moving anything. The label and description are part of the click target too.
- **keyboard**: Tab reaches each switch. Space toggles it. Enter does not. A disabled switch leaves the Tab order.
- **aria**: A native input type=checkbox with role=switch, so it works in forms and is announced as on or off. The label names it (aria-labelledby), the description describes it (aria-describedby). With no visible label, pass aria-label.
- **use**: Use a switch for a setting that takes effect the moment it changes, like turning a feature on. Use a Checkbox when a choice waits for a Save or Submit button, or when several options can be picked. The label names what is on ('Auto-save'), so on and off both read right; never label a switch with an action.
- **light**: The track is lit by light/cursor (D-020). The thumb sits inside it, so it is covered; the label is plain text and is not.

## Values

| Variable | Value |
|---|---|
| `--sw-track-width-sm` | 28px (set) |
| `--sw-track-width-md` | 36px (set) |
| `--sw-track-height-sm` | `size/icon/sm` |
| `--sw-track-height-md` | `size/icon/md` |
| `--sw-track-padding` | `space/2` |
| `--sw-track-stroke` | `stroke/1` |
| `--sw-track-radius` | `radius/full` |
| `--sw-track-target` | `size/target` |
| `--sw-track-focus-ring` | `stroke/2` |
| `--sw-thumb-sm` | `size/icon/xs` |
| `--sw-thumb-md` | `size/icon/sm` |
| `--sw-thumb-off` | `content/secondary` |
| `--sw-thumb-off-hover` | `content/primary` |
| `--sw-thumb-off-disabled` | `content/primary-disabled` |
| `--sw-thumb-on` | `content/inverse-primary` |
| `--sw-thumb-on-disabled` | `content/primary-disabled` |
| `--sw-row-gap` | `space/8` |
| `--sw-row-text-gap` | `space/2` |
| `--sw-label-color` | `content/primary` |
| `--sw-label-color-disabled` | `content/primary-disabled` |
| `--sw-description-color` | `content/tertiary` |
| `--sw-description-color-disabled` | `content/tertiary-disabled` |
| `--sw-off-rest-fill` | `fill/primary` |
| `--sw-off-rest-border` | `border/secondary` |
| `--sw-off-hover-fill` | `fill/primary-hover` |
| `--sw-off-hover-border` | `border/secondary-hover` |
| `--sw-off-pressed-fill` | `fill/primary-active` |
| `--sw-off-pressed-border` | `border/secondary-active` |
| `--sw-off-disabled-fill` | `fill/primary-disabled` |
| `--sw-off-disabled-border` | `border/secondary-disabled` |
| `--sw-on-rest-fill` | `fill/inverse` |
| `--sw-on-rest-border` | `border/inverse` |
| `--sw-on-hover-fill` | `fill/inverse-hover` |
| `--sw-on-hover-border` | `border/inverse-hover` |
| `--sw-on-pressed-fill` | `fill/inverse-active` |
| `--sw-on-pressed-border` | `border/inverse-active` |
| `--sw-on-disabled-fill` | `fill/secondary-disabled` |
| `--sw-on-disabled-border` | `border/secondary-disabled` |
| type · label | `type-body-md-regular` |
| type · description | `type-body-sm-regular` |
