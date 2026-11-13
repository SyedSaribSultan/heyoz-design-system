# Toast (generated)

> Generated from `components/toast.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Toast: a short message that says something happened, in a corner, and goes away by itself. It asks for nothing. Every value is a token reference, a plain number (a set value in px, not a token), 'none' or a rule. This spec is the authority (D-025).

Status: **draft**

## Anatomy

One toaster per app: a fixed region in the bottom-right corner (full width at the bottom on narrow screens) holding a stack of up to 3 toasts. A toast is a card: a status icon, a message with an optional description, an optional action Button and a close Button.

## Rules

- **use**: Use a toast to confirm something that already happened (Saved, Link copied, Clip deleted) or to report a background result (Export ready, Upload failed). Do not use it for a question or a decision (use a dialog), for an error on a field (show it at the field), for anything the person must not miss while it is the only record of it (use a persistent banner or dialog), or for messages that arrive in bursts (group them into one).
- **api**: toast(message, options) from anywhere, no provider. toast.success, toast.warning, toast.critical, toast.info set the type. Options: description, action { label, onClick }, duration (ms, Infinity keeps it), icon (a Lucide name), id (a toast with the same id is updated in place, its timer restarts), dismissible (default true). toast.dismiss(id) closes one, toast.dismiss() closes all. It returns the id. Render <Toaster /> once, in the root layout; a second Toaster renders nothing.
- **types**: neutral, success, warning, critical, info. The status shows on the icon only: the surface, border and text are the same for every type. Reason: a stack of tinted cards turns a corner of the screen into a traffic light and fights the content behind it, and tinted fills need their own text and border sets; the icon colour plus its own shape (check, triangle, cross, i) carries the type without relying on colour alone. Neutral has no icon unless one is given.
- **surface**: surface/tertiary, border/tertiary, radius/xl, the inner shade and the drop shadow (drop-md). It floats above the page and above dialogs (surface/primary), so it is one step lighter than both. A lit surface (D-020), and a light root, because it opens over other lit surfaces.
- **live**: The toaster is a region (aria-label Notifications) with aria-live polite, aria-relevant additions and text. Each toast is role status, except critical, which is role alert (assertive, interrupts). A toast never takes focus when it appears. F8 moves focus into the toaster (newest toast first, then its controls in order); Esc on a focused toast closes it and returns focus to where it was; Tab leaves the toaster normally. The close Button has aria-label Dismiss notification.
- **time**: Auto-dismiss: 5000 ms. With an action: 10000 ms, because an Undo that stays for minutes undoes something other than what the person remembers, and the pause rules below give time to reach it. Critical: stays until dismissed. All can be set with duration. The timer pauses while the pointer is over the toaster, while focus is inside it, and while the tab is hidden, and it resumes with the time that was left. With the toaster paused no toast leaves, so the stack never moves under the pointer.
- **stack**: At most 3 visible. The newest sits at the bottom, next to the corner where the eye already is; older toasts move up by the height of the newest plus the gap. A fourth toast removes the oldest non-critical one (critical toasts go last). Toasts move to their new place at duration/base, easing/standard (D-031), never snap.
- **motion**: Enter: the card fades in and rises region.travel (space/12) at duration/base, easing/enter. Leave: a fade at duration/fast, easing/exit, then the stack closes up. Swipe (touch and pen): drag sideways to follow the finger, release past 80px to dismiss, otherwise it springs back at duration/base. Reduced motion keeps the fades, drops the rise.
- **placement**: Desktop: bottom-right, region.width wide, region.inset from the right and bottom edges. Below 640: full width with region.inset-narrow on the sides and bottom, above the device's bottom safe area. A toast does not avoid a bottom sheet; the toaster sits above it (z-index 1070).
- **actions**: The action is a secondary Button, size 2xs (28). It runs its onClick and then closes the toast (action.dismiss false keeps it). At most one action. There is no brand Button in a toast (D-026, one per view). The close Button is ghost, size 2xs, icon only.
- **static**: A specimen for the docs only: the card without the toaster, the timer, the keys or the swipe. It is inert, so it leaves the Tab order.
- **states**: Action and close use the Button states. The card has no hover look: hover only pauses the timers and shows nothing, so nothing moves or changes size under the pointer.

## Values

| Variable | Value |
|---|---|
| `--tst-region-width` | 360px (set) |
| `--tst-region-inset` | `space/24` |
| `--tst-region-inset-narrow` | `space/16` |
| `--tst-region-gap` | `space/8` |
| `--tst-region-travel` | `space/12` |
| `--tst-card-background` | `surface/tertiary` |
| `--tst-card-border` | `border/tertiary` |
| `--tst-card-radius` | `radius/xl` |
| `--tst-card-padding-y` | `space/12` |
| `--tst-card-padding-left` | `space/16` |
| `--tst-card-padding-right` | `space/12` |
| `--tst-card-gap` | `space/8` |
| `--tst-card-row` | `size/control/2xs` |
| `--tst-icon-size` | `size/icon/md` |
| `--tst-icon-neutral` | `content/secondary` |
| `--tst-icon-success` | `content/success` |
| `--tst-icon-warning` | `content/warning` |
| `--tst-icon-critical` | `content/critical` |
| `--tst-icon-info` | `content/info` |
| `--tst-message-color` | `content/primary` |
| `--tst-description-color` | `content/secondary` |
| type · message | `type-body-md-medium` |
| type · description | `type-body-sm-regular` |
