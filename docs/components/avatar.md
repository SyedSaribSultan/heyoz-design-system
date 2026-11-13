# Avatar (generated)

> Generated from `components/avatar.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Avatar: who or what something belongs to. Shows a picture, falls back to initials, then to an icon. Every value is a token reference, a plain even number (a set value in px, not a token), 'none' or a rule (D-025).

Status: **draft**

## Anatomy

One face: a picture, or initials on a tinted fill, or an icon. Optional status dot on the edge. A group stacks faces with overlap and ends with a +N face. The face carries the border/primary edge; the status dot sits outside it so it is never clipped.

## Rules

- **fallback**: Three layers, in order: the picture; initials from the name; an icon (Lucide user) when there is no name. The fallback is always painted underneath, so a slow or broken picture never leaves a hole. The picture fades in at duration/fast when it has loaded; if it fails, the fallback stays. Initials are the first letter of the first and last word: one letter at 2xs and xs, two from sm up.
- **tone**: The fill of a fallback is picked from the name, so the same name always gets the same colour. Five tones: neutral, brand, success, warning, info, each fill/*-secondary with content/*. Critical is left out (red reads as an error) and so is purple (D-015). A tone prop overrides the pick.
- **sizes**: Six sizes taken from the size tokens: 2xs 20 (icon/md), xs 24 (icon/lg), sm 32 (control/xs, the side nav profile), md 40 (control/sm, the default), lg 48 (control/md), xl 56 (control/lg). 20 and 24 sit in a line of text or a dense list and show one initial; 32 to 56 stand alone. Above 56 an avatar is a picture, not a component size. Initial type grows with the face: 10, 10, 12, 14, 16, 20.
- **shape**: Circle (radius/full) for people. Squircle for brands, products and workspaces: radius is size × 0.3, to the nearest 2 under 12 and the nearest 4 above (6, 8, 10, 12, 16, 16). The 0.3 matches the side nav brand logo (40, radius/lg 12). Set values, listed per size.
- **edge**: A 1px border/primary edge drawn over the picture, inside the face, so a picture that is the same colour as the surface still has an outline (as the side nav profile). It sits on the media layer, after the picture.
- **status**: Four statuses: online fill/success, away fill/warning, busy fill/critical, offline content/tertiary. The dot sits on the face's edge at 45° (inset = radius × 0.2929, so it sits on the circle, or on the squircle's rounded corner), with a ring of the surface colour (ring-colour, stroke/2). Dot sizes 6, 6, 8, 10, 12, 14 by avatar size. The status is also in the accessible name; colour is never the only signal.
- **group**: A group overlaps faces by a set amount per size (4, 6, 8, 10, 12, 14), each with a ring of the surface colour so the faces cut into each other. Later faces sit on top. Past max it shows one +N face (neutral tone, same size) and names the rest. The group is one unit: role group, labelled; each face keeps its name.
- **light**: A fallback face is a surface and is lit (D-020). A picture is media (data-media): it sits above the light, which dims to 25% while the pointer is over it.
- **motion**: A picture fades in at duration/fast; a status change fades at duration/fast (D-031). Nothing moves or resizes.
- **aria**: A face is an image with the name as its accessible name (role img, aria-label), plus the status. Where the name is written next to the face, pass decorative: the face is then hidden from assistive tech and the name is not read twice. A +N face is named 'and N more'.
- **interactive**: An avatar is not a button. To make it one, wrap it in a Button or a link; the focus ring then belongs to that control.
- **use**: Use an Avatar for a person, a brand or a workspace. For a count or a status label on its own use a Badge. A group of more than about five faces should show +N.

## Values

| Variable | Value |
|---|---|
| `--av-2xs-size` | `size/icon/md` |
| `--av-2xs-radius` | 6px (set) |
| `--av-2xs-icon` | `size/icon/xs` |
| `--av-2xs-dot` | 6px (set) |
| `--av-2xs-overlap` | 4px (set) |
| `--av-xs-size` | `size/icon/lg` |
| `--av-xs-radius` | 8px (set) |
| `--av-xs-icon` | `size/icon/xs` |
| `--av-xs-dot` | 6px (set) |
| `--av-xs-overlap` | 6px (set) |
| `--av-sm-size` | `size/control/xs` |
| `--av-sm-radius` | 10px (set) |
| `--av-sm-icon` | `size/icon/sm` |
| `--av-sm-dot` | 8px (set) |
| `--av-sm-overlap` | 8px (set) |
| `--av-md-size` | `size/control/sm` |
| `--av-md-radius` | 12px (set) |
| `--av-md-icon` | `size/icon/md` |
| `--av-md-dot` | 10px (set) |
| `--av-md-overlap` | 10px (set) |
| `--av-lg-size` | `size/control/md` |
| `--av-lg-radius` | 16px (set) |
| `--av-lg-icon` | `size/icon/lg` |
| `--av-lg-dot` | 12px (set) |
| `--av-lg-overlap` | 12px (set) |
| `--av-xl-size` | `size/control/lg` |
| `--av-xl-radius` | 16px (set) |
| `--av-xl-icon` | `size/icon/xl` |
| `--av-xl-dot` | 14px (set) |
| `--av-xl-overlap` | 14px (set) |
| `--av-circle` | `radius/full` |
| `--av-edge` | `border/primary` |
| `--av-ring-colour` | `surface/primary` |
| `--av-ring-width` | `stroke/2` |
| `--av-status-online` | `fill/success` |
| `--av-status-away` | `fill/warning` |
| `--av-status-busy` | `fill/critical` |
| `--av-status-offline` | `content/tertiary` |
| `--av-tone-neutral-fill` | `fill/tertiary` |
| `--av-tone-neutral-content` | `content/primary` |
| `--av-tone-brand-fill` | `fill/brand-secondary` |
| `--av-tone-brand-content` | `content/brand` |
| `--av-tone-success-fill` | `fill/success-secondary` |
| `--av-tone-success-content` | `content/success` |
| `--av-tone-warning-fill` | `fill/warning-secondary` |
| `--av-tone-warning-content` | `content/warning` |
| `--av-tone-info-fill` | `fill/info-secondary` |
| `--av-tone-info-content` | `content/info` |
| type · 2xs | `type-label-xs-medium` |
| type · xs | `type-label-xs-medium` |
| type · sm | `type-label-md-medium` |
| type · md | `type-label-lg-medium` |
| type · lg | `type-label-xl-medium` |
| type · xl | `type-body-2xl-medium` |
