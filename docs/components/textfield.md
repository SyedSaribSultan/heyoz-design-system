# Text field (generated)

> Generated from `components/textfield.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Text field: one component for a single line and for several lines (textarea), plus the field frame around it (label, hint, error, count). Every value is a token reference, a plain even number (a set value in px, not a token), 'none' or a rule (D-025). Status draft: the owner may still change it.

Status: **draft**

## Anatomy

A column: label row (label + optional marker), the control, the message row (hint or error on the left, character count on the right). The control is one frame, a well: [icon] [prefix] value [suffix] [trailing icon] [action button]. Single line: fixed height. Textarea: the same frame, min height of its rows, grows with the text up to its max rows, then scrolls inside.

## Rules

- **height**: size/control/{size}: xs 32 (everyday), sm 40, md 48. Fixed for a single line. A textarea has this as the height of one row's frame; its min height is rows × line height + 2 × padding y.
- **radius**: Squircle like Button: height × 0.375 rounded to 4. xs 12 (radius/lg), sm 16 (radius/xl), md 20 (radius/2xl). Padding x is the Button's for the size: xs space/12, sm space/16, md space/20.
- **well**: D-036: a field is a well, darker than its surface: fill/primary at rest, with border/primary and the inner shade (0, -4, blur 10, #000 50%, D-021). It is a lit surface (D-020).
- **border**: stroke/1, drawn as an inset box-shadow, so no state moves anything.
- **states**: Rest: fill/primary, border/primary. Hover: fill/primary-hover, border/primary-hover. Focus: the border steps up to border/primary-active, nothing else: subtle, no ring (D-040). Invalid: border/critical (hover border/critical-hover, focus border/critical-active). Disabled: fill/primary-disabled, border/primary-disabled, value, placeholder, icons and label content/primary-disabled; not focusable. Read-only: looks like rest and does not change on hover, still focusable, value selectable and submitted, no clear button.
- **focus**: Focus is the frame's border stepping up (no ring, no outline). Focus on the clear or show button gives that button its own ring, not the frame. Clicking anywhere on the frame (not on a button) puts the caret in the input. The textarea clips only inside the frame.
- **value**: body/md/regular for xs and sm, body/lg/regular for md, content/primary. Placeholder content/tertiary. A placeholder is an example, never the label: it disappears when you type.
- **icons**: Leading and trailing icons are Lucide at size/icon/sm (xs, sm) and size/icon/md (md), content/secondary, 8 from the text. They are decoration and are hidden from screen readers. The control carries the meaning.
- **affix**: Prefix and suffix are text (https://, $, .com, USD) in the value's type and content/tertiary, inside the frame, 8 from the value. Clicking them focuses the input. They are read out with the field (aria-describedby).
- **action**: Clear and show/hide password are Button: ghost, icon-only, one step smaller than the frame, so it sits inside with equal room on three sides: xs field 28 (2xs) with 2 around it, sm field 28 with 6, md field 32 (xs) with 8. The inner radius is the frame radius minus that room, so corners stay parallel. Clear shows only when there is a value (fades at duration/fast, keeps its slot so nothing shifts), clears, and gives focus back to the input. Password: starts hidden, eye / eye-off, aria-pressed, label Show password / Hide password; the value never leaves the field.
- **label**: label/md/medium, content/secondary, space/6 above the control. A label is always present: visible, or aria-label when the design truly has none. 'optional' follows the label in label/md/regular, content/tertiary. Required fields get no marker; mark the optional ones instead.
- **message**: Hint and error use body/sm/regular, space/6 below the control. Hint content/tertiary. An error replaces the hint in the same row, content/critical, with a 12 alert icon so colour is not the only signal, and sets aria-invalid; the control points at it with aria-describedby. The row is a polite live region, so a new error is read out. When a field has a hint, an error swaps into the same height and nothing moves.
- **count**: Character count 'n / max' on the right of the message row, body/sm/regular, content/tertiary, tabular numbers, tied to the control with aria-describedby. It shows only when there is a max length, and the browser stops typing at max. It turns content/critical at max.
- **textarea**: Rows (min) default 3, max rows default 8. It grows with the text, one line at a time, as you type: the height follows the text with no animation, since an animated height would lag behind the caret. At max rows it scrolls inside with the global scrollbar (D-037). Padding y puts the first line where a single line sits: xs 6, sm 10, md 12. With auto grow off, the user resizes vertically with the corner handle.
- **motion**: Fill, border, ring and colours animate at duration/fast, easing/standard (D-031). The clear button fades at duration/fast. Reduced motion keeps the fades; there is no movement to drop.
- **keyboard**: Tab enters and leaves. Esc clears a field that has a clear button and a value; it does nothing else. Enter submits the form, as a native input does; in a textarea it adds a line. The clear and show buttons are in the Tab order after the input (not while hidden).
- **aria**: Native input and textarea, label via htmlFor. aria-invalid on an error. aria-describedby: hint or error, count, prefix, suffix. disabled and readOnly are the native attributes. The password toggle is a button with aria-pressed, not a checkbox.
- **use**: Use a text field for free text of any length: names, URLs, prompts, notes. Use a select for a fixed list, a number field or slider for numbers, a switch or checkbox for yes/no. Use a textarea when the answer can run past one line, never to look big.

## Values

| Variable | Value |
|---|---|
| `--tf-xs-height` | `size/control/xs` |
| `--tf-xs-radius` | `radius/lg` |
| `--tf-xs-padding-x` | `space/12` |
| `--tf-xs-gap` | `space/8` |
| `--tf-xs-icon` | `size/icon/sm` |
| `--tf-xs-action` | `size/control/2xs` |
| `--tf-xs-textarea-padding-y` | 6px (set) |
| `--tf-sm-height` | `size/control/sm` |
| `--tf-sm-radius` | `radius/xl` |
| `--tf-sm-padding-x` | `space/16` |
| `--tf-sm-gap` | `space/8` |
| `--tf-sm-icon` | `size/icon/sm` |
| `--tf-sm-action` | `size/control/2xs` |
| `--tf-sm-textarea-padding-y` | 10px (set) |
| `--tf-md-height` | `size/control/md` |
| `--tf-md-radius` | `radius/2xl` |
| `--tf-md-padding-x` | `space/20` |
| `--tf-md-gap` | `space/8` |
| `--tf-md-icon` | `size/icon/md` |
| `--tf-md-action` | `size/control/xs` |
| `--tf-md-textarea-padding-y` | 12px (set) |
| `--tf-frame-border-width` | `stroke/1` |
| `--tf-frame-ring-width` | `stroke/2` |
| `--tf-frame-rest-fill` | `fill/primary` |
| `--tf-frame-rest-border` | `border/primary` |
| `--tf-frame-hover-fill` | `fill/primary-hover` |
| `--tf-frame-hover-border` | `border/primary-hover` |
| `--tf-frame-focus-fill` | `fill/primary` |
| `--tf-frame-focus-border` | `border/primary-active` |
| `--tf-frame-invalid-fill` | `fill/primary` |
| `--tf-frame-invalid-border` | `border/critical` |
| `--tf-frame-invalid-hover-fill` | `fill/primary-hover` |
| `--tf-frame-invalid-hover-border` | `border/critical-hover` |
| `--tf-frame-invalid-focus-fill` | `fill/primary` |
| `--tf-frame-invalid-focus-border` | `border/critical-active` |
| `--tf-frame-disabled-fill` | `fill/primary-disabled` |
| `--tf-frame-disabled-border` | `border/primary-disabled` |
| `--tf-value-color` | `content/primary` |
| `--tf-value-placeholder` | `content/tertiary` |
| `--tf-value-disabled` | `content/primary-disabled` |
| `--tf-value-icon` | `content/secondary` |
| `--tf-value-icon-disabled` | `content/primary-disabled` |
| `--tf-value-affix` | `content/tertiary` |
| `--tf-label-color` | `content/secondary` |
| `--tf-label-color-disabled` | `content/primary-disabled` |
| `--tf-label-gap` | `space/6` |
| `--tf-label-gap-optional` | `space/4` |
| `--tf-label-optional-color` | `content/tertiary` |
| `--tf-message-color` | `content/tertiary` |
| `--tf-message-error` | `content/critical` |
| `--tf-message-gap` | `space/6` |
| `--tf-message-gap-inline` | `space/12` |
| `--tf-message-icon` | `size/icon/xs` |
| `--tf-message-icon-gap` | `space/4` |
| `--tf-count-color` | `content/tertiary` |
| `--tf-count-limit` | `content/critical` |
| type · xs | `type-body-md-regular` |
| type · sm | `type-body-md-regular` |
| type · md | `type-body-lg-regular` |
| type · label | `type-label-md-medium` |
| type · label-optional | `type-label-md-regular` |
| type · message | `type-body-sm-regular` |
| type · count | `type-body-sm-regular` |
