# Tabs (generated)

> Generated from `components/tabs.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Tabs: switch between views of content, one at a time. A row of tabs with one underline that slides (D-032), and the panel each tab controls. Every value is a token reference, a plain number (a set value in px, not a token), 'none' or a rule (D-025).

Status: **draft**

## Anatomy

A tab list: a row of tabs on a 1px baseline, with one 2px underline under the selected tab. Each tab is a label, with an optional icon before it and an optional count after it. Under the list, one panel shows the selected tab's content.

## Rules

- **use**: Tabs switch views of content: the pages of a settings area, the lists of a project (Assets, Brand, Members). Each tab owns a panel. Segmented sets a value (speed, alignment, resolution): it has no panels, it changes how something looks or works. If the choice changes what the page shows, use Tabs. If it changes a setting, use Segmented. Use 2 to 7 tabs; more than that, or a long list, belongs in a Select or a Menu.
- **look**: No frame and no fill: labels on a baseline. The selected tab has a 2px underline in content/primary, not orange, so orange stays for the one main action (D-003). The baseline is border/primary, 1px, the full width of the list. The underline sits on the baseline and covers it.
- **sizes**: md: 40 tall (size/control/sm), body/md/medium (14), padding x 12. sm: 32 tall (size/control/xs), body/sm/medium (12), padding x 8. Labels are always medium weight; the weight never changes with selection, so nothing shifts.
- **tab**: Label colour: rest content/secondary, hover and selected content/primary, disabled content/primary-disabled. The icon follows the label, and turns content/brand on hover like Button's ghost. Icon frame size/icon/sm (16), gap 6 between icon, label and count.
- **hover**: An unselected tab on hover shows a 2px rule under it in border/primary-hover, and pressed in border/primary-active (D-035: one step stronger, in its own family). The rule fades in at duration/fast; nothing moves or changes size. The selected tab's underline stays as it is.
- **count**: An optional count after the label: label/md/medium (12) in content/secondary on fill/tertiary, 20 tall, pill radius, padding x 6. On the selected tab the count is content/primary on fill/elevated. Counts are numbers or short text (99+); they are part of the tab's accessible name.
- **motion**: The underline slides from the old tab to the new one: position and width together, duration/base, easing/standard, in a straight line, the same duration whatever the distance (D-032). Labels and counts change colour in place at duration/fast (D-031). The first paint never animates. Reduced motion: no slide, a cross-fade. Panels swap with a fade at duration/base, easing/enter and no movement.
- **activation**: Automatic (default): arrow keys move focus and select, and the panel changes at once. Use it when panels are already loaded. Manual: arrow keys move focus only; Enter or Space selects. Use it when showing a panel costs a request or a layout jump.
- **keyboard**: The tab list is role tablist (aria-orientation horizontal) with aria-label. Each tab is role tab with aria-selected and, when it has a panel, aria-controls pointing at it. One Tab stop in the list: the selected tab (tabindex 0); the others are tabindex -1. Left and Right move to the previous or next tab and wrap at the ends; Home and End go to the first and last. Disabled tabs are skipped. Tab then goes to the panel.
- **disabled**: A disabled tab stays in the row, dimmed, as a disabled button (so it is also out of the Tab order). It is skipped by the arrow keys and cannot be selected. Never remove a tab that does not apply; disable it.
- **overflow**: When the tabs are wider than their container, the list scrolls sideways (D-037 scrollbar) and tabs never wrap or shrink. The selected tab scrolls into view when it changes. The edges that have more tabs behind them fade over space/24. The list is a scroll container, so it keeps stroke/2 of room on every side (padding, pulled back with a matching negative margin) and a focus ring is never cut. The baseline and the underline live inside the scrolling track, so they scroll with the tabs.
- **focus**: A stroke/2 ring in border/focus around the focused tab, radius/md, drawn outside the tab. It shows for keyboard focus only.
- **panel**: The panel sits space/16 under the list. It is role tabpanel, tabindex 0, labelled by its tab. Panels that are not selected stay mounted and are hidden (hidden attribute), so their state is kept and aria-controls always resolves.
- **light**: Tabs are not a surface: no fill, so nothing is lit. The count pill is a small lit fill.
- **width**: Hug (default): each tab is as wide as its content and padding, the row is as wide as its tabs and the baseline runs the full width of the container. Stretch: the tabs share the full width equally (use it on a narrow panel or a phone).

## Values

| Variable | Value |
|---|---|
| `--tab-list-gap` | `space/4` |
| `--tab-list-clip-room` | `stroke/2` |
| `--tab-list-fade` | `space/24` |
| `--tab-list-panel-gap` | `space/16` |
| `--tab-baseline-color` | `border/primary` |
| `--tab-baseline-width` | `stroke/1` |
| `--tab-indicator-color` | `content/primary` |
| `--tab-indicator-height` | `stroke/2` |
| `--tab-indicator-radius` | `radius/full` |
| `--tab-tab-gap` | `space/6` |
| `--tab-tab-radius` | `radius/md` |
| `--tab-tab-icon` | `size/icon/sm` |
| `--tab-tab-color` | `content/secondary` |
| `--tab-tab-color-hover` | `content/primary` |
| `--tab-tab-color-selected` | `content/primary` |
| `--tab-tab-color-disabled` | `content/primary-disabled` |
| `--tab-tab-icon-hover` | `content/brand` |
| `--tab-tab-rule-hover` | `border/primary-hover` |
| `--tab-tab-rule-pressed` | `border/primary-active` |
| `--tab-tab-rule-height` | `stroke/2` |
| `--tab-tab-md-height` | `size/control/sm` |
| `--tab-tab-md-padding-x` | `space/12` |
| `--tab-tab-sm-height` | `size/control/xs` |
| `--tab-tab-sm-padding-x` | `space/8` |
| `--tab-count-height` | 20px (set) |
| `--tab-count-padding-x` | `space/6` |
| `--tab-count-radius` | `radius/full` |
| `--tab-count-fill` | `fill/tertiary` |
| `--tab-count-fill-selected` | `fill/elevated` |
| `--tab-count-color` | `content/secondary` |
| `--tab-count-color-selected` | `content/primary` |
| `--tab-count-color-disabled` | `content/primary-disabled` |
| type · tab-md | `type-body-md-medium` |
| type · tab-sm | `type-body-sm-medium` |
| type · count | `type-label-md-medium` |
