# Menu (generated)

> Generated from `components/menu.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Menu: a dropdown opened from a trigger (any Button). Also the surface and the item look that Select builds on. Every value is a token reference, a plain number (a set value in px, not a token), 'none' or a rule (D-025).

Status: **draft**

## Anatomy

A floating surface (a light root) holding one scrolling list. The list holds items, group labels and separators. An item is: leading mark or icon, label (+ description), then a shortcut or a submenu chevron. One highlight indicator sits behind the items and slides to the one pointed at or reached by keyboard. A submenu is a second surface beside its parent item (one level).

## Rules

- **when**: Use a Menu for a list of actions or settings behind one trigger (more, account, view options). Use Select to choose one value for a field. Use Segmented when 2 to 4 options must stay visible. Never put a form field or a long page of content in a menu.
- **trigger**: Any Button (or any control). The trigger gets aria-haspopup='menu', aria-expanded and aria-controls from the Menu. It stays pressed (state active) while the menu is open.
- **tier**: The surface is surface/tertiary, the tier of floating cards (D-036), with border/tertiary and the inner shade, exactly like Home's brand menu. surface/secondary is the tooltip tier and is not used here. Items sit on the surface, so the highlight is fill/tertiary-hover, one step lighter.
- **sheen**: The surface carries the four soft blobs of Home's brand menu: content/primary, 10% opacity, a 38px blur (Figma blur 75), clipped to the surface and above the items, pointer-events none. A Figma effect, not a token (D-021).
- **light**: The surface is a <Light> root (D-020): it carries its own light wherever it opens. A submenu is its own light root.
- **highlight**: One indicator (D-032), not a style on each item. It is a rounded fill with an inset border and the inner shade, so nothing moves. It slides from the old item to the new one, position and size together, duration/base, easing/standard, whatever the distance. The first time it shows, and the first time after the pointer has left, it appears in place and fades in (duration/fast): it never slides in from a stale spot. Rest of the time without a highlighted item it is hidden (opacity 0, duration/fast). Hover: fill/tertiary-hover and border/tertiary-hover. Pressed: fill/tertiary-active and border/tertiary-active (D-035), shown only once the indicator has landed. Reached by keyboard it also draws the focus ring, border/focus, inset stroke/2, so it can never be clipped. Reduced motion: no slide, the indicator cross-fades.
- **items**: Four kinds: action (menuitem), checkbox (menuitemcheckbox, a check mark when checked), radio (menuitemradio, a dot when checked; one per group), submenu (an item with items, trailing chevron-right). Checkable items keep a leading mark slot, so labels line up whether or not they are checked. A description sits under the label. A shortcut is shown as text on the right (content/tertiary); it only labels the key, the app binds it. An action closes the menu after it runs; checkbox and radio items close it too unless the item says keepOpen.
- **danger**: A danger item (delete, remove) uses content/critical for its text and icon. It uses the same highlight. Put it last, after a separator.
- **disabled**: A disabled item uses the -disabled content tokens, is skipped by arrow keys and typeahead, never takes the highlight and never runs. It stays in place so nothing shifts. aria-disabled is set.
- **groups**: A group label (label/sm/medium, content/tertiary) names the items below it, inside role='group' with aria-labelledby. A separator (border/elevated, stroke/1) splits kinds of items. Use either, not both in a row.
- **submenu**: One level. It opens beside the parent item (after duration/fast of hover, on click, Enter, Space or ArrowRight), top-aligned with the item, and flips to the left when the right side has no room. The parent item keeps the highlight and aria-expanded while it is open. ArrowLeft or Esc closes it and returns focus to the parent item. Selecting a submenu item closes every level. Moving the pointer to another item of the parent closes it after the same delay.
- **placement**: Below the trigger (default), aligned to its start edge, surface.offset away. It flips above when below is too short and above is longer, and ends up inside the viewport, surface.viewport-margin from every edge. Align end puts the right edges together. Width fits the content between surface.min-width and surface.max-width. It repositions on scroll and resize.
- **scroll**: Height is at most surface.max-height and what the viewport leaves. Taller content scrolls inside the surface, never the page (overscroll contain), with the one scrollbar (D-037). The scroll area keeps stroke/2 of room on every side (padding, pulled back by a matching negative margin) so the focus ring and the indicator border are never cut.
- **keyboard**: On the trigger: Enter, Space and ArrowDown open the menu and focus the first item; ArrowUp opens it and focuses the last. In the menu: ArrowDown and ArrowUp move (wrapping), Home and End jump, ArrowRight opens a submenu, ArrowLeft closes one, Enter and Space run the item, a letter jumps to the next item whose label starts with what you typed (the typed text resets after 500 ms), Esc closes and returns focus to the trigger, Tab closes and moves on from the trigger. A click on the trigger opens the menu with no item focused, so no highlight shows until you point at one or press a key.
- **pointer**: Pointing at an item focuses it and moves the highlight. Clicking outside the menu and its submenu closes it, and the press is not passed on as a selection. Leaving the list hides the highlight.
- **aria**: Surface role='menu' (aria-orientation vertical) labelled by the trigger. Items as above. The trigger names the menu. Icons are decorative (aria-hidden). Focus moves onto the item (roving), so screen readers read it.
- **motion**: The surface enters with motion-pop from the side it opens on (fade, 4px drop, scale from 0.98, duration/base, easing/enter) and leaves with a fade (duration/fast, easing/exit), kept mounted by usePresence. Every state change runs at duration/fast (D-031). Reduced motion keeps the fades and drops the drop and the scale.
- **select**: Select (components/select.json) reuses this surface, list and item look. Its options are items with role='option', the check sits at the end, and it matches the trigger's width.

## Values

| Variable | Value |
|---|---|
| `--mn-surface-background` | `surface/tertiary` |
| `--mn-surface-border` | `border/tertiary` |
| `--mn-surface-radius` | `radius/xl` |
| `--mn-surface-padding` | `space/4` |
| `--mn-surface-offset` | `space/8` |
| `--mn-surface-offset-attached` | `space/4` |
| `--mn-surface-sub-offset` | `space/4` |
| `--mn-surface-viewport-margin` | `space/8` |
| `--mn-surface-min-width` | 192px (set) |
| `--mn-surface-max-width` | 320px (set) |
| `--mn-surface-max-height` | 320px (set) |
| `--mn-surface-scroll-room` | `stroke/2` |
| `--mn-sheen-color` | `content/primary` |
| `--mn-sheen-width` | 232px (set) |
| `--mn-sheen-height` | 150px (set) |
| `--mn-sheen-blur` | 38px (set) |
| `--mn-item-height` | `size/control/xs` |
| `--mn-item-padding-x` | `space/12` |
| `--mn-item-padding-y` | `space/6` |
| `--mn-item-gap` | `space/8` |
| `--mn-item-radius` | `radius/lg` |
| `--mn-item-list-gap` | `space/2` |
| `--mn-item-icon` | `size/icon/sm` |
| `--mn-item-color` | `content/primary` |
| `--mn-item-icon-color` | `content/secondary` |
| `--mn-item-mark-color` | `content/primary` |
| `--mn-item-hover-fill` | `fill/tertiary-hover` |
| `--mn-item-hover-border` | `border/tertiary-hover` |
| `--mn-item-hover-icon` | `content/primary` |
| `--mn-item-pressed-fill` | `fill/tertiary-active` |
| `--mn-item-pressed-border` | `border/tertiary-active` |
| `--mn-item-focus-ring` | `border/focus` |
| `--mn-item-focus-width` | `stroke/2` |
| `--mn-item-danger-color` | `content/critical` |
| `--mn-item-danger-icon` | `content/critical` |
| `--mn-item-disabled-color` | `content/primary-disabled` |
| `--mn-item-disabled-icon` | `content/secondary-disabled` |
| `--mn-item-disabled-description` | `content/tertiary-disabled` |
| `--mn-item-disabled-shortcut` | `content/tertiary-disabled` |
| `--mn-item-description-color` | `content/secondary` |
| `--mn-item-shortcut-color` | `content/tertiary` |
| `--mn-item-shortcut-gap` | `space/16` |
| `--mn-item-chevron-size` | `size/icon/sm` |
| `--mn-item-chevron-color` | `content/secondary` |
| `--mn-label-color` | `content/tertiary` |
| `--mn-label-padding-x` | `space/12` |
| `--mn-label-padding-top` | `space/8` |
| `--mn-label-padding-bottom` | `space/4` |
| `--mn-separator-background` | `border/elevated` |
| `--mn-separator-height` | `stroke/1` |
| `--mn-separator-margin-y` | `space/4` |
| `--mn-separator-margin-x` | `space/8` |
| type · item | `type-body-md-regular` |
| type · item-description | `type-body-sm-regular` |
| type · item-shortcut | `type-label-md-medium` |
| type · label | `type-label-sm-medium` |
