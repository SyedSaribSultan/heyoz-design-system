# Checkbox (generated)

> Generated from `components/checkbox.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Checkbox: a square well that holds a tick. Every value is a token reference, a plain number (a set value in px, not a token), 'none' or a rule (D-025). Status draft: the owner may still change it.

Status: **draft**

## Anatomy

A row: [box] [label + description]. The box is a square well with a tick (checked) or a dash (indeterminate) drawn as an icon inside it. The whole row is the click target. A group is a column or a row of these rows under a group label.

## Rules

- **states**: Unchecked, checked, indeterminate; each at rest, hover, pressed, focus and disabled. Unchecked is a well: fill/primary with border/secondary. Checked and indeterminate look the same: fill/inverse (white, like shadcn's primary, D-038) with a content/inverse-primary mark. Orange stays for the one main action (D-003).
- **hover**: Hover is the -hover fill and border of the box's own family (D-035). Pressed is one step stronger, the -active fill and border. Hover and press work on the whole row, label included. Nothing moves or changes size: the border is an inset box-shadow.
- **shade**: No inner shade, unlike Button: at 16–20px the shade greys the white out, so on stays a flat, solid fill that pops (D-041). The box is a lit surface (D-020).
- **mark**: The mark is drawn for the box, not taken from the icon set: a tick about 7/16 of the box wide and a 6/16 dash, both with a 2/16 stroke (2px in the 16 box, 2.5px in the 20) and round caps. A full-size icon tick read too big and too thin. It draws in from the left while it fades (duration/base, easing/standard) and fades out the same way. Check and dash swap by drawing one out and the other in. Reduced motion: the fade stays, the draw goes (D-031).
- **size**: sm: box 16 (size/icon/sm), radius xs. md: box 20 (size/icon/md), radius sm. md is the default. Text is the same in both: label body/md/regular, description body/sm/regular.
- **colours**: Label content/primary, description content/tertiary. Disabled: label content/primary-disabled, description content/tertiary-disabled, box -disabled fill and border; a disabled checked box uses fill/secondary-disabled and a content/primary-disabled mark, like a disabled primary Button, because fill/inverse-disabled is the same grey as its mark.
- **focus**: Keyboard focus (focus-visible only) draws a ring outside the box: border/focus, stroke/2. The row never clips it. A scroll or clip container around a checkbox keeps stroke/2 of room (D-037).
- **hit**: The visible box is smaller than size/target (44). An invisible layer around the box makes the hit area at least 44 x 44 without moving anything. The label and description are part of the click target too.
- **keyboard**: Tab reaches each checkbox. Space toggles it. Enter does not (that submits a form). A disabled checkbox leaves the Tab order.
- **aria**: A native input type=checkbox, so form, label and mixed state work as usual. The label names it (aria-labelledby), the description describes it (aria-describedby). Indeterminate is the input's own indeterminate state (aria-checked mixed). With no visible label, pass aria-label. A group is role=group named by its group label.
- **indeterminate**: Mixed state for a parent that controls a list: some of the children are checked. Clicking it checks it (the parent decides what the children do). It is a display state, never something a user sets on a single option.
- **group**: A group label (body/md/medium, content/primary), then the options. Vertical: space/12 between options. Horizontal: space/24. The group label sits space/8 above the options. A disabled group disables every option.
- **use**: Use a checkbox when each option is independent and zero, one or many can be on, or for one explicit agreement. Use a Switch when the change takes effect at once. Use Radio when exactly one of several must be chosen.
- **light**: The box is lit by light/cursor (D-020). The label is plain text and is not.

## Values

| Variable | Value |
|---|---|
| `--cb-box-sm` | `size/icon/sm` |
| `--cb-box-md` | `size/icon/md` |
| `--cb-box-radius-sm` | `radius/xs` |
| `--cb-box-radius-md` | `radius/sm` |
| `--cb-box-stroke` | `stroke/1` |
| `--cb-box-target` | `size/target` |
| `--cb-box-focus-ring` | `stroke/2` |
| `--cb-row-gap` | `space/8` |
| `--cb-row-text-gap` | `space/2` |
| `--cb-label-color` | `content/primary` |
| `--cb-label-color-disabled` | `content/primary-disabled` |
| `--cb-description-color` | `content/tertiary` |
| `--cb-description-color-disabled` | `content/tertiary-disabled` |
| `--cb-group-gap` | `space/12` |
| `--cb-group-gap-horizontal` | `space/24` |
| `--cb-group-label-gap` | `space/8` |
| `--cb-group-label-color` | `content/primary` |
| `--cb-unchecked-rest-fill` | `fill/primary` |
| `--cb-unchecked-rest-border` | `border/secondary` |
| `--cb-unchecked-hover-fill` | `fill/primary-hover` |
| `--cb-unchecked-hover-border` | `border/secondary-hover` |
| `--cb-unchecked-pressed-fill` | `fill/primary-active` |
| `--cb-unchecked-pressed-border` | `border/secondary-active` |
| `--cb-unchecked-disabled-fill` | `fill/primary-disabled` |
| `--cb-unchecked-disabled-border` | `border/secondary-disabled` |
| `--cb-checked-rest-fill` | `fill/inverse` |
| `--cb-checked-rest-border` | `border/inverse` |
| `--cb-checked-rest-mark` | `content/inverse-primary` |
| `--cb-checked-hover-fill` | `fill/inverse-hover` |
| `--cb-checked-hover-border` | `border/inverse-hover` |
| `--cb-checked-hover-mark` | `content/inverse-primary` |
| `--cb-checked-pressed-fill` | `fill/inverse-active` |
| `--cb-checked-pressed-border` | `border/inverse-active` |
| `--cb-checked-pressed-mark` | `content/inverse-primary` |
| `--cb-checked-disabled-fill` | `fill/secondary-disabled` |
| `--cb-checked-disabled-border` | `border/secondary-disabled` |
| `--cb-checked-disabled-mark` | `content/primary-disabled` |
| type · label | `type-body-md-regular` |
| type · description | `type-body-sm-regular` |
| type · group-label | `type-body-md-medium` |
