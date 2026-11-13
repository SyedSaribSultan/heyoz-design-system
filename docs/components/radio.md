# Radio (generated)

> Generated from `components/radio.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Radio: a round well with a dot. One option of several. Every value is a token reference, a plain number (a set value in px, not a token), 'none' or a rule (D-025). Status draft: the owner may still change it.

Status: **draft**

## Anatomy

A radio group is a column or a row of radios under an optional group label. A radio is a row: [circle] [label + description]. The circle is a round well; the chosen one holds a dot. The whole row is the click target.

## Rules

- **states**: Unchecked, checked; each at rest, hover, pressed, focus and disabled. Unchecked is a well: fill/primary with border/secondary. Checked is fill/inverse (white, like shadcn's primary, D-038) with a content/inverse-primary dot. Orange stays for the one main action (D-003).
- **hover**: Hover is the -hover fill and border of the circle's own family (D-035). Pressed is one step stronger, the -active fill and border. Hover and press work on the whole row, label included. Nothing moves or changes size: the border is an inset box-shadow.
- **shade**: No inner shade, unlike Button: at 16–20px the shade greys the white out, so on stays a flat, solid fill that pops (D-041). The circle is a lit surface (D-020).
- **dot**: The dot is a set value: 6 in the sm circle, 8 in the md circle. It grows from 50% to full size while it fades in, and fades out when another radio is chosen (duration/base, easing/standard). Reduced motion: the fade stays, the growth goes (D-031).
- **size**: sm: circle 16 (size/icon/sm). md: circle 20 (size/icon/md). md is the default. Text is the same in both: label body/md/regular, description body/sm/regular.
- **colours**: Label content/primary, description content/tertiary. Disabled: label content/primary-disabled, description content/tertiary-disabled, circle -disabled fill and border; a disabled checked circle uses fill/secondary-disabled and a content/primary-disabled dot, like a disabled primary Button, because fill/inverse-disabled is the same grey as its dot.
- **focus**: Keyboard focus (focus-visible only) draws a ring outside the circle: border/focus, stroke/2. The row never clips it. A scroll or clip container around a group keeps stroke/2 of room (D-037).
- **hit**: The visible circle is smaller than size/target (44). An invisible layer around the circle makes the hit area at least 44 x 44 without moving anything. The label and description are part of the click target too.
- **keyboard**: Roving tabindex: the group is one Tab stop. Tab lands on the chosen radio, or on the first enabled one when none is chosen. Arrow Down and Right move to the next radio and choose it; Up and Left go back; both wrap round the ends. Home and End go to the first and the last enabled radio and choose it. Space chooses the focused radio. Disabled radios are skipped by the arrows and are not in the Tab order.
- **aria**: The group is role=radiogroup named by its group label (aria-labelledby), or by aria-label. Each radio is role=radio with aria-checked, named by its label (aria-labelledby) and described by its description (aria-describedby). Disabled radios carry aria-disabled.
- **group**: A group label (body/md/medium, content/primary), then the options. Vertical: space/12 between options. Horizontal: space/24. The group label sits space/8 above the options. A disabled group disables every option. With no default, none is chosen.
- **use**: Use a radio group when exactly one of two to five options must be chosen and all of them should be visible. Use Select for more than five. Use Segmented for a view or mode that changes the screen at once. Use a Switch for a single on/off. Clicking the chosen radio again does not clear it; offer a 'None' option when that is needed.
- **light**: The circle is lit by light/cursor (D-020). The label is plain text and is not.

## Values

| Variable | Value |
|---|---|
| `--rd-circle-sm` | `size/icon/sm` |
| `--rd-circle-md` | `size/icon/md` |
| `--rd-circle-stroke` | `stroke/1` |
| `--rd-circle-target` | `size/target` |
| `--rd-circle-focus-ring` | `stroke/2` |
| `--rd-dot-sm` | 6px (set) |
| `--rd-dot-md` | 8px (set) |
| `--rd-row-gap` | `space/8` |
| `--rd-row-text-gap` | `space/2` |
| `--rd-label-color` | `content/primary` |
| `--rd-label-color-disabled` | `content/primary-disabled` |
| `--rd-description-color` | `content/tertiary` |
| `--rd-description-color-disabled` | `content/tertiary-disabled` |
| `--rd-group-gap` | `space/12` |
| `--rd-group-gap-horizontal` | `space/24` |
| `--rd-group-label-gap` | `space/8` |
| `--rd-group-label-color` | `content/primary` |
| `--rd-unchecked-rest-fill` | `fill/primary` |
| `--rd-unchecked-rest-border` | `border/secondary` |
| `--rd-unchecked-hover-fill` | `fill/primary-hover` |
| `--rd-unchecked-hover-border` | `border/secondary-hover` |
| `--rd-unchecked-pressed-fill` | `fill/primary-active` |
| `--rd-unchecked-pressed-border` | `border/secondary-active` |
| `--rd-unchecked-disabled-fill` | `fill/primary-disabled` |
| `--rd-unchecked-disabled-border` | `border/secondary-disabled` |
| `--rd-checked-rest-fill` | `fill/inverse` |
| `--rd-checked-rest-border` | `border/inverse` |
| `--rd-checked-rest-dot` | `content/inverse-primary` |
| `--rd-checked-hover-fill` | `fill/inverse-hover` |
| `--rd-checked-hover-border` | `border/inverse-hover` |
| `--rd-checked-hover-dot` | `content/inverse-primary` |
| `--rd-checked-pressed-fill` | `fill/inverse-active` |
| `--rd-checked-pressed-border` | `border/inverse-active` |
| `--rd-checked-pressed-dot` | `content/inverse-primary` |
| `--rd-checked-disabled-fill` | `fill/secondary-disabled` |
| `--rd-checked-disabled-border` | `border/secondary-disabled` |
| `--rd-checked-disabled-dot` | `content/primary-disabled` |
| type · label | `type-body-md-regular` |
| type · description | `type-body-sm-regular` |
| type · group-label | `type-body-md-medium` |
