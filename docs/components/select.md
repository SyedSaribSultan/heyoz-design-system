# Select (generated)

> Generated from `components/select.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Select: choose one value from a list, in a form. The trigger looks like a text field; the list is the Menu's surface and item look (components/menu.json). Every value is a token reference, a plain number (a set value in px, not a token), 'none' or a rule (D-025).

Status: **draft**

## Anatomy

A field: label above, the trigger (well with an optional icon, the value or placeholder, a chevron), then a hint or an error below. Pressing the trigger opens a listbox under it, as wide as the trigger. The chosen option shows a check at its end.

## Rules

- **when**: Use Select to pick one value from 4 to about 12 options in a form. Use Segmented for 2 to 4 options that should stay visible. Use Menu for actions. Over about 12 options a list needs search, which Select does not have yet.
- **fieldConventions**: Shared with the text field so they sit side by side. Heights on size/control: xs 32 (everyday), sm 40, md 48. Radius: xs radius/lg, sm radius/xl, md radius/2xl. Padding x as Button for the size: xs space/12, sm space/16, md space/20. Value body/md/regular (xs, sm) and body/lg/regular (md). Label label/md/medium content/secondary, gap space/6 to the well. Hint and error body/sm/regular, gap space/6.
- **well**: Fill fill/primary and border border/primary, an inset border so nothing moves. Hover: fill/primary-hover and border/primary-hover. Open and focus: fill/primary and border/primary-active; no ring (subtle, like the text field). Disabled: fill/primary-disabled, border/primary-disabled, text content/primary-disabled. All changes run at duration/fast (D-031). The well carries the inner shade, like the text field's.
- **value**: The chosen label in content/primary. With nothing chosen, the placeholder in content/tertiary. A long label is cut with an ellipsis, never wrapped. The chosen option's icon shows in the well before the label, content/secondary.
- **invalid**: Invalid: border/critical (hover border/critical-hover, open border/critical-active), the message below in content/critical with aria-describedby and aria-invalid on the trigger. The message starts with a circle-alert icon (size/icon/xs) and replaces the hint, in the same space.
- **chevron**: chevron-down, size/icon/sm, content/secondary, at the end of the well. On open it turns over: chevron-down fades out and turns 180 degrees while chevron-up turns in and fades in, duration/base, easing/standard (D-031). Reduced motion: the fade stays, the turn goes.
- **surface**: The list is the Menu's surface (surface/tertiary: floating card tier, D-036; border/tertiary; inner shade; sheen; a light root), placed below the trigger with offset-attached (space/4) between. It flips above when below is too short, and stays inside the viewport. Width is the trigger's width, never narrower; longer labels are cut with an ellipsis. Height is at most menu surface.max-height, then it scrolls inside with the one scrollbar and stroke/2 of clip room (D-037). It enters with motion-pop and leaves with a fade (usePresence).
- **options**: An option has a label and optionally an icon (Lucide) and a description. A group label and a separator are allowed. A disabled option shows the -disabled colours, is skipped by arrows and typeahead and cannot be chosen. The chosen option shows a check (check, size/icon/sm) at its end, and the list opens with it highlighted and scrolled into view.
- **highlight**: The Menu's one sliding indicator (D-032): it follows the pointer and the arrow keys, fill/tertiary-hover with border/tertiary-hover. It is not the chosen option: the chosen option is marked by the check and by aria-selected only.
- **keyboard**: Focus stays on the trigger (role='combobox', aria-activedescendant names the highlighted option). Enter, Space, ArrowDown and ArrowUp open the list; ArrowDown and ArrowUp move (wrapping, like Menu); Home and End jump; Enter or Space chooses and closes; Esc closes and keeps focus on the trigger; Tab closes and moves on. A letter jumps to the next option that starts with it (the typed text resets after 500 ms); with the list closed it chooses that option straight away, like a native select. Clicking outside closes it.
- **aria**: Trigger: role='combobox', aria-haspopup='listbox', aria-expanded, aria-controls, aria-activedescendant while open, aria-labelledby the label and the value, aria-invalid, aria-describedby the hint or the error. List: role='listbox'. Option: role='option', aria-selected, aria-disabled. A name prop adds a hidden input, so the value posts with a form.
- **states**: rest, hover, open, focus (keyboard), invalid, disabled. The docs force each with the state prop.
- **motion**: Chevron as above. The list enters and leaves as the Menu does. The indicator slides as in the Menu.

## Values

| Variable | Value |
|---|---|
| `--sel-label-color` | `content/secondary` |
| `--sel-label-gap` | `space/6` |
| `--sel-label-color-disabled` | `content/primary-disabled` |
| `--sel-hint-color` | `content/tertiary` |
| `--sel-hint-gap` | `space/6` |
| `--sel-hint-icon` | `size/icon/xs` |
| `--sel-hint-icon-gap` | `space/4` |
| `--sel-error-color` | `content/critical` |
| `--sel-well-fill` | `fill/primary` |
| `--sel-well-border` | `border/primary` |
| `--sel-well-gap` | `space/8` |
| `--sel-well-hover-fill` | `fill/primary-hover` |
| `--sel-well-hover-border` | `border/primary-hover` |
| `--sel-well-open-fill` | `fill/primary` |
| `--sel-well-open-border` | `border/primary-active` |
| `--sel-well-invalid-border` | `border/critical` |
| `--sel-well-invalid-hover` | `border/critical-hover` |
| `--sel-well-invalid-open` | `border/critical-active` |
| `--sel-well-disabled-fill` | `fill/primary-disabled` |
| `--sel-well-disabled-border` | `border/primary-disabled` |
| `--sel-well-disabled-color` | `content/primary-disabled` |
| `--sel-well-disabled-icon` | `content/secondary-disabled` |
| `--sel-well-border-width` | `stroke/1` |
| `--sel-value-color` | `content/primary` |
| `--sel-value-placeholder` | `content/tertiary` |
| `--sel-value-icon-color` | `content/secondary` |
| `--sel-value-icon` | `size/icon/sm` |
| `--sel-chevron-size` | `size/icon/sm` |
| `--sel-chevron-color` | `content/secondary` |
| `--sel-size-xs-height` | `size/control/xs` |
| `--sel-size-xs-radius` | `radius/lg` |
| `--sel-size-xs-padding-x` | `space/12` |
| `--sel-size-sm-height` | `size/control/sm` |
| `--sel-size-sm-radius` | `radius/xl` |
| `--sel-size-sm-padding-x` | `space/16` |
| `--sel-size-md-height` | `size/control/md` |
| `--sel-size-md-radius` | `radius/2xl` |
| `--sel-size-md-padding-x` | `space/20` |
| type · label | `type-label-md-medium` |
| type · hint | `type-body-sm-regular` |
| type · size-xs | `type-body-md-regular` |
| type · size-sm | `type-body-md-regular` |
| type · size-md | `type-body-lg-regular` |
