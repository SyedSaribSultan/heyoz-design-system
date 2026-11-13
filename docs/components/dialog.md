# Dialog (generated)

> Generated from `components/dialog.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Dialog: a modal that asks for one thing or tells one thing and blocks the page until it is answered. Every value is a token reference, a plain number (a set value in px, not a token), 'none' or a rule. This spec is the authority (D-025).

Status: **draft**

## Anatomy

A scrim over the page, then one panel: header (title, optional description, close button), a scrolling body, a footer with the actions. Three widths (sm, md, lg). Alert dialog: the same panel with no close button, a short message and two actions. Below 640 the panel is a bottom sheet: full width, anchored to the bottom edge, top corners rounded.

## Rules

- **use**: Use a dialog when the answer must come before anything else happens: a short form, a confirmation, a choice that is hard to undo. Do not use it for a message that needs no answer (use a toast), for help text on one control (use a tooltip or popover), for a menu or a pick from a list (use a menu or select), or for anything the person may want to look at while working (use a panel in the page).
- **variants**: Dialog (role dialog) and alert dialog (role alertdialog). The alert dialog has no close button, does not close on a scrim press, is sm wide, and is for one question: confirm or cancel. When the confirm action is destructive the focus starts on Cancel, never on the destructive action.
- **size**: sm 400, md 520, lg 640. The panel is never wider than the window minus 2 x panel.inset. Height follows the content up to the window height minus 2 x panel.inset (100dvh); beyond that only the body scrolls.
- **layout**: Panel: surface/primary, border/primary, radius/2xl, the inner shade (0, -4, blur 10, #000 50%), the same panel as the search dialog, so there is one modal look. Header: title (heading/sm/semibold) and the close button on one line, 32 tall; the description (body/md/regular, content/secondary) sits under the title. The text starts 24 from the left edge. Body: body/md/regular. Footer: actions on the right, gap 8; an optional note or checkbox on the left. Order: the safe action first, the main action last.
- **actions**: At most one brand Button per dialog (D-026). The main action is a brand Button; a dialog whose answer is a plain yes uses primary (white). Cancel is ghost. Other actions are secondary. Buttons are size sm (40), size md (48) in the sheet so every target is at least 44. A destructive confirm has no Button type of its own: it is a secondary Button with the label and icon in content/critical (hover content/critical-hover, pressed content/critical-active). Proposal: a critical Button type.
- **scrim**: color-mix of background at 72% and transparent, with a backdrop blur of scrim.blur (space/4): the same values as the search dialog. 72% is a set value, not a token (D-021). The scrim fades in at duration/base and out at duration/fast (motion-fade). A press (pointerdown) on the scrim closes the dialog unless the dialog is blocking or scrimClose is off; a press inside the panel that ends on the scrim does not.
- **motion**: Enter: the scrim fades; the panel fades, drops 4px and scales from 0.98 at duration/base, easing/enter (motion-pop, origin centre). Leave: both fade at duration/fast, easing/exit; the panel stays mounted until the fade ends (usePresence). Sheet: enters by sliding up from its own height at duration/slow, easing/enter, and leaves with the fade. Reduced motion keeps every fade and drops the scale, the drop and the slide (D-031). While it leaves, the dialog is inert and focus is already back on the element that opened it; opening again during the fade starts a fresh dialog.
- **focus**: On open, focus moves into the panel: the first field in the body, else the main action in the footer (the safe action in an alert dialog whose confirm is destructive), else the panel itself (tabindex -1). The close button is never the first stop. Tab and Shift+Tab cycle inside the panel; focus that escapes (a click on the page, a script) is pulled back. On close, focus returns to the element that had it when the dialog opened, or to a trigger passed in. Focus rings are never clipped: header and footer keep their padding, the body keeps panel.body.padding-y and padding-x, both larger than stroke/2 (D-037).
- **keyboard**: Esc closes (unless blocking), but only when no layer inside the dialog (a select, a menu) already handled it (event.defaultPrevented). Tab and Shift+Tab cycle. Space and Enter activate the focused Button. Only the topmost of stacked dialogs answers Esc and traps focus.
- **aria**: role dialog or alertdialog, aria-modal true, aria-labelledby the title, aria-describedby the description (alert dialog: the description is required, it is the question). The close button has aria-label Close. The panel is the only thing reading as interactive while open: nothing behind it takes focus. The scrim is not focusable and has no role.
- **scroll**: The page does not scroll while a dialog is open: html gets overflow hidden and, only when the page has a scrollbar, scrollbar-gutter stable, so the page never shifts sideways. Only the body scrolls, with overscroll-behavior contain, so the scroll never passes to the page. Pop-ups show no scroll bar: instead a blurred fade of fade.height (space/24) sits on the top edge once the body is scrolled and on the bottom edge while more is below, in surface/primary with a backdrop blur of fade.blur. Header and footer never scroll away.
- **sheet**: Below 640 (container width, so a specimen in a 360 frame behaves like a phone): the panel is full width, bottom-aligned with no side or bottom gap, radius/2xl on the top corners only, max height 85% of the window, and the footer clears the device's bottom safe area. The actions share the footer row equally. The close button grows to size/control/sm (40). There is no drag handle, because the sheet is not draggable: it closes with Close, Esc, a scrim press or an action.
- **blocking**: A blocking dialog ignores Esc and scrim presses and has no close button, so only its actions end it. Use it only while work is running that must not be interrupted. It still traps focus and still has a title.
- **layers**: z-index 1040: above the page and the side nav, below the search dialog (1050) and the toaster (1070), so a toast fired from a dialog stays visible. The overlay is a light root (data-light-root): the panel is a lit surface (D-020).
- **static**: A specimen for the docs only: the panel without the scrim, the portal, the trap, the scroll lock or the keys. It is inert, so it leaves the Tab order.
- **states**: Actions use the Button states. The panel itself has none. Loading is the Button's: the confirm shows the spinner and the dialog stays open until the work ends. An alert dialog that is loading is blocking: Esc and scrim presses do nothing and Cancel is disabled until the work ends.

## Values

| Variable | Value |
|---|---|
| `--dlg-scrim-background` | `background` |
| `--dlg-scrim-blur` | `space/4` |
| `--dlg-panel-background` | `surface/primary` |
| `--dlg-panel-border` | `border/primary` |
| `--dlg-panel-radius` | `radius/2xl` |
| `--dlg-panel-inset` | `space/16` |
| `--dlg-panel-width-sm` | 400px (set) |
| `--dlg-panel-width-md` | 520px (set) |
| `--dlg-panel-width-lg` | 640px (set) |
| `--dlg-header-padding-left` | `space/24` |
| `--dlg-header-padding-right` | `space/16` |
| `--dlg-header-padding-top` | `space/16` |
| `--dlg-header-padding-bottom` | `space/8` |
| `--dlg-header-gap` | `space/4` |
| `--dlg-header-title-color` | `content/primary` |
| `--dlg-header-description-color` | `content/secondary` |
| `--dlg-header-close-size` | `size/control/xs` |
| `--dlg-header-close-size-sheet` | `size/control/sm` |
| `--dlg-body-padding-x` | `space/24` |
| `--dlg-body-padding-y` | `space/4` |
| `--dlg-body-color` | `content/primary` |
| `--dlg-fade-height` | `space/24` |
| `--dlg-fade-blur` | `space/4` |
| `--dlg-footer-padding-x` | `space/24` |
| `--dlg-footer-padding-top` | `space/16` |
| `--dlg-footer-padding-bottom` | `space/24` |
| `--dlg-footer-gap` | `space/8` |
| `--dlg-footer-button` | `size/control/sm` |
| `--dlg-footer-button-sheet` | `size/control/md` |
| `--dlg-sheet-below` | 640px (set) |
| `--dlg-critical-rest` | `content/critical` |
| `--dlg-critical-hover` | `content/critical-hover` |
| `--dlg-critical-pressed` | `content/critical-active` |
| type · header-title | `type-heading-sm-semibold` |
| type · header-description | `type-body-md-regular` |
| type · body | `type-body-md-regular` |
