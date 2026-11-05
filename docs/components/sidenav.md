# Side nav (generated)

> Generated from `components/sidenav.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Side nav: one component for every sidebar (the HeyOz app and the docs site). Every value is a token reference, a plain number (a set value in px, not a token), 'none' or a rule. Started from Figma 707:12639; this spec is the authority (D-002, D-030).

Status: **stable** · Figma 707:12639

## Anatomy

A column: logo row (logomark + wordmark, close button), brand picker, slot (e.g. search), groups of menu items (title + items), then the community card and the profile. Collapsed: a 54 rail of icons, the logomark opens it.

## Rules

- **states**: Menu item: default, hover, active. Brand picker: default, hover. Hover and active add an inset border and the inner shade, so nothing moves. Active uses border/primary-active (D-035).
- **shade**: The nav, active and hovered items, the brand picker and its logo carry the inner shade (0, −4, blur 10, #000 50%). The community card carries the inner highlight. Figma effects, not tokens (D-021).
- **light**: Lit by light/cursor like everything else (D-020).
- **scroll**: Only the link list scrolls on short screens, so the brand menu and the footer are never clipped. It never passes the scroll to the page (overscroll contain). Its scrollbar is an 8px gutter kept in the nav's padding (items never change width), with the thumb shown only while the pointer is over the nav (D-037). Tooltips are fixed to the window.
- **icons**: Lucide. Item icons in a size/icon/md frame (20, vector 15). The 'opens in a new tab' arrow is a hint one step smaller: item.ext-icon, size/icon/sm (16, vector 12).
- **collapse**: Collapsed (54 rail), every item is 36 x 36 with its icon anchored left, never centred, so icons glide on one line while the width animates. Labels stay in place at zero width and fade (never display: none), so opening mirrors closing. Item height is fixed (40 open, 36 collapsed) so it animates instead of snapping. The logo row is never swapped: collapsed, the open button lies over the logomark, the wordmark fades and clips like a label and the close button fades out of the flow, so the logomark glides one way (16 to 10 from the nav edge) with no jump. Toggling from the logo row keeps keyboard focus on the toggle (open and close hand focus to each other); Ctrl+B leaves focus where it is, unless it is on one of those toggles, which hands over the same way. Width, spacing and size move at duration/slow; labels fade at duration/fast (D-031).
- **shortcut**: Ctrl+B / Cmd+B opens and closes the page's main nav. Ignored while typing in a field.

## Values

| Variable | Value |
|---|---|
| `--sn-nav-background` | `surface/primary` |
| `--sn-nav-width` | 300px (set) |
| `--sn-nav-width-collapsed` | 54px (set) |
| `--sn-nav-padding` | `space/16` |
| `--sn-nav-padding-collapsed` | `space/8` |
| `--sn-nav-gap` | `space/16` |
| `--sn-logo-size` | 32px (set) |
| `--sn-logo-gap` | `space/8` |
| `--sn-logo-toggle-icon` | `size/icon/sm` |
| `--sn-title-color` | `content/tertiary` |
| `--sn-item-height` | 40px (set) |
| `--sn-item-size-collapsed` | 36px (set) |
| `--sn-item-padding-x` | `space/12` |
| `--sn-item-padding-y` | `space/8` |
| `--sn-item-gap` | `space/6` |
| `--sn-item-radius` | `radius/lg` |
| `--sn-item-icon` | `size/icon/md` |
| `--sn-item-ext-icon` | `size/icon/sm` |
| `--sn-item-color` | `content/primary` |
| `--sn-item-default-fill` | `fill/primary` |
| `--sn-item-default-border` | none |
| `--sn-item-hover-fill` | `fill/primary-hover` |
| `--sn-item-hover-border` | `border/primary-hover` |
| `--sn-item-active-fill` | `fill/primary-active` |
| `--sn-item-active-border` | `border/primary-active` |
| `--sn-brand-height` | 50px (set) |
| `--sn-brand-size-collapsed` | 36px (set) |
| `--sn-brand-padding` | `space/4` |
| `--sn-brand-padding-right` | `space/8` |
| `--sn-brand-gap` | `space/8` |
| `--sn-brand-radius` | `radius/xl` |
| `--sn-brand-radius-collapsed` | `radius/lg` |
| `--sn-brand-logo` | `size/control/sm` |
| `--sn-brand-logo-radius` | `radius/lg` |
| `--sn-brand-logo-collapsed` | `size/control/2xs` |
| `--sn-brand-logo-radius-collapsed` | `radius/md` |
| `--sn-brand-chevron` | `content/secondary` |
| `--sn-brand-default-fill` | `fill/tertiary` |
| `--sn-brand-default-border` | `border/tertiary` |
| `--sn-brand-hover-fill` | `fill/tertiary-hover` |
| `--sn-brand-hover-border` | `border/tertiary-hover` |
| `--sn-community-background` | `surface/primary` |
| `--sn-community-border` | `border/primary-disabled` |
| `--sn-community-radius` | `radius/xl` |
| `--sn-community-padding` | `space/12` |
| `--sn-community-gap` | `space/12` |
| `--sn-community-copy-gap` | `space/4` |
| `--sn-community-muted` | `content/tertiary` |
| `--sn-profile-border` | `border/primary` |
| `--sn-profile-padding` | `space/12` |
| `--sn-profile-row-padding` | `space/8` |
| `--sn-profile-gap` | `space/8` |
| `--sn-profile-radius` | `radius/xl` |
| `--sn-profile-avatar` | `size/control/xs` |
| `--sn-profile-avatar-border` | `border/primary` |
| `--sn-profile-muted` | `content/tertiary` |
| `--sn-tooltip-background` | `surface/secondary` |
| `--sn-tooltip-border` | `border/secondary` |
| `--sn-tooltip-radius` | `radius/md` |
| `--sn-tooltip-padding-x` | `space/8` |
| `--sn-tooltip-padding-y` | `space/4` |
| `--sn-tooltip-offset` | `space/8` |
| type · logo | `type-heading-md-medium` |
| type · title | `type-label-sm-medium` |
| type · item | `type-body-lg-regular` |
| type · brand | `type-body-lg-medium` |
| type · community-title | `type-body-md-medium` |
| type · community-copy | `type-body-sm-regular` |
| type · profile-name | `type-body-md-regular` |
| type · profile-plan | `type-body-sm-regular` |
| type · tooltip | `type-label-lg-medium` |
