# Colour tokens (generated)

> Generated from `tokens/colors.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Mode **dark** · 6 ramps × 12 steps + white · 173 semantic tokens. Values are OKLCH `L C H`.

## The scale

12-step scale, modelled on Radix Colors. Step jobs: 1-2 app backgrounds, 3-5 component backgrounds (rest, hover, active), 6-8 borders, 9 solid colour, 10 solid hover, 11 low-contrast text, 12 high-contrast text. Colour ramp chroma = ramp chroma x step factor, reduced only where sRGB cannot show it. Status ramps use "max": the most chroma their hue can reach at step 9, so each status colour is as vivid as it can be at the same lightness. Orange is fixed to the brand colour. Gray chroma is constant.

| Step | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Lightness | 0.12 | 0.155 | 0.19 | 0.225 | 0.26 | 0.295 | 0.33 | 0.365 | 0.6536 | 0.7 | 0.8 | 0.95 |
| Chroma factor | 0.1 | 0.14 | 0.2 | 0.26 | 0.32 | 0.38 | 0.46 | 0.58 | 1 | 0.92 | 0.62 | 0.22 |

## Ramps

| Ramp | Hue | Chroma | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `gray` | 55 | 0.004 (constant) | #070505 | #0E0C0B | #151312 | #1D1B1A | #262322 | #2E2C2B | #373533 | #403E3C | #92908E | #A09E9C | #C0BDBB | #F1EEEC |
| `orange` | 33.98 | 0.2347 | #0D0302 | #180704 | #250A05 | #330E07 | #411208 | #50160A | #611807 | #741600 | #FF3D01 | #FF6645 | #FFA28C | #FFE9E4 |
| `green` | 155 | 0.1616 | #030704 | #050F08 | #07180D | #092113 | #0B2B19 | #0D351F | #0A4024 | #004C28 | #00AC62 | #3CB974 | #88D1A2 | #DDF6E4 |
| `amber` | 75 | 0.1379 | #080502 | #110B04 | #1B1206 | #251907 | #302109 | #3C280A | #483008 | #563700 | #C08200 | #CC9235 | #DEB67F | #FBECD9 |
| `red` | 25 | 0.2328 | #0D0303 | #180606 | #250A09 | #330E0D | #411110 | #501514 | #611617 | #760F15 | #FF383F | #FF635F | #FFA098 | #FFE9E6 |
| `blue` | 260 | 0.1853 | #03060C | #060C17 | #0A1424 | #0E1B32 | #122340 | #162C4F | #193460 | #193C76 | #478CFF | #629DFF | #98BFFF | #E5EFFF |
| `white` | – | – | #FFFFFF |

## Semantic

| Token | CSS variable | References | Hex |
|---|---|---|---|
| `background` | `--background` | `gray/1` | #070505 |
| `surface/primary` | `--surface-primary` | `gray/2` | #0E0C0B |
| `surface/secondary` | `--surface-secondary` | `gray/3` | #151312 |
| `surface/tertiary` | `--surface-tertiary` | `gray/4` | #1D1B1A |
| `surface/elevated` | `--surface-elevated` | `gray/5` | #262322 |
| `surface/inverse` | `--surface-inverse` | `gray/12` | #F1EEEC |
| `surface/fixed` | `--surface-fixed` | `white` | #FFFFFF |
| `surface/brand` | `--surface-brand` | `orange/3` | #250A05 |
| `surface/success` | `--surface-success` | `green/3` | #07180D |
| `surface/warning` | `--surface-warning` | `amber/3` | #1B1206 |
| `surface/critical` | `--surface-critical` | `red/3` | #250A09 |
| `surface/info` | `--surface-info` | `blue/3` | #0A1424 |
| `fill/primary` | `--fill-primary` | `gray/2` | #0E0C0B |
| `fill/primary-hover` | `--fill-primary-hover` | `gray/3` | #151312 |
| `fill/primary-active` | `--fill-primary-active` | `gray/4` | #1D1B1A |
| `fill/primary-disabled` | `--fill-primary-disabled` | `gray/1` | #070505 |
| `fill/secondary` | `--fill-secondary` | `gray/3` | #151312 |
| `fill/secondary-hover` | `--fill-secondary-hover` | `gray/4` | #1D1B1A |
| `fill/secondary-active` | `--fill-secondary-active` | `gray/5` | #262322 |
| `fill/secondary-disabled` | `--fill-secondary-disabled` | `gray/2` | #0E0C0B |
| `fill/tertiary` | `--fill-tertiary` | `gray/4` | #1D1B1A |
| `fill/tertiary-hover` | `--fill-tertiary-hover` | `gray/5` | #262322 |
| `fill/tertiary-active` | `--fill-tertiary-active` | `gray/6` | #2E2C2B |
| `fill/tertiary-disabled` | `--fill-tertiary-disabled` | `gray/3` | #151312 |
| `fill/elevated` | `--fill-elevated` | `gray/5` | #262322 |
| `fill/elevated-hover` | `--fill-elevated-hover` | `gray/6` | #2E2C2B |
| `fill/elevated-active` | `--fill-elevated-active` | `gray/7` | #373533 |
| `fill/elevated-disabled` | `--fill-elevated-disabled` | `gray/4` | #1D1B1A |
| `fill/inverse` | `--fill-inverse` | `gray/12` | #F1EEEC |
| `fill/inverse-hover` | `--fill-inverse-hover` | `white` | #FFFFFF |
| `fill/inverse-active` | `--fill-inverse-active` | `gray/11` | #C0BDBB |
| `fill/inverse-disabled` | `--fill-inverse-disabled` | `gray/9` | #92908E |
| `fill/brand` | `--fill-brand` | `orange/9` | #FF3D01 |
| `fill/brand-hover` | `--fill-brand-hover` | `orange/10` | #FF6645 |
| `fill/brand-active` | `--fill-brand-active` | `orange/8` | #741600 |
| `fill/brand-disabled` | `--fill-brand-disabled` | `gray/4` | #1D1B1A |
| `fill/success` | `--fill-success` | `green/9` | #00AC62 |
| `fill/success-hover` | `--fill-success-hover` | `green/10` | #3CB974 |
| `fill/success-active` | `--fill-success-active` | `green/8` | #004C28 |
| `fill/success-disabled` | `--fill-success-disabled` | `gray/4` | #1D1B1A |
| `fill/warning` | `--fill-warning` | `amber/9` | #C08200 |
| `fill/warning-hover` | `--fill-warning-hover` | `amber/10` | #CC9235 |
| `fill/warning-active` | `--fill-warning-active` | `amber/8` | #563700 |
| `fill/warning-disabled` | `--fill-warning-disabled` | `gray/4` | #1D1B1A |
| `fill/critical` | `--fill-critical` | `red/9` | #FF383F |
| `fill/critical-hover` | `--fill-critical-hover` | `red/10` | #FF635F |
| `fill/critical-active` | `--fill-critical-active` | `red/8` | #760F15 |
| `fill/critical-disabled` | `--fill-critical-disabled` | `gray/4` | #1D1B1A |
| `fill/info` | `--fill-info` | `blue/9` | #478CFF |
| `fill/info-hover` | `--fill-info-hover` | `blue/10` | #629DFF |
| `fill/info-active` | `--fill-info-active` | `blue/8` | #193C76 |
| `fill/info-disabled` | `--fill-info-disabled` | `gray/4` | #1D1B1A |
| `fill/brand-secondary` | `--fill-brand-secondary` | `orange/3` | #250A05 |
| `fill/brand-secondary-hover` | `--fill-brand-secondary-hover` | `orange/4` | #330E07 |
| `fill/brand-secondary-active` | `--fill-brand-secondary-active` | `orange/5` | #411208 |
| `fill/brand-secondary-disabled` | `--fill-brand-secondary-disabled` | `orange/2` | #180704 |
| `fill/success-secondary` | `--fill-success-secondary` | `green/3` | #07180D |
| `fill/success-secondary-hover` | `--fill-success-secondary-hover` | `green/4` | #092113 |
| `fill/success-secondary-active` | `--fill-success-secondary-active` | `green/5` | #0B2B19 |
| `fill/success-secondary-disabled` | `--fill-success-secondary-disabled` | `green/2` | #050F08 |
| `fill/warning-secondary` | `--fill-warning-secondary` | `amber/3` | #1B1206 |
| `fill/warning-secondary-hover` | `--fill-warning-secondary-hover` | `amber/4` | #251907 |
| `fill/warning-secondary-active` | `--fill-warning-secondary-active` | `amber/5` | #302109 |
| `fill/warning-secondary-disabled` | `--fill-warning-secondary-disabled` | `amber/2` | #110B04 |
| `fill/critical-secondary` | `--fill-critical-secondary` | `red/3` | #250A09 |
| `fill/critical-secondary-hover` | `--fill-critical-secondary-hover` | `red/4` | #330E0D |
| `fill/critical-secondary-active` | `--fill-critical-secondary-active` | `red/5` | #411110 |
| `fill/critical-secondary-disabled` | `--fill-critical-secondary-disabled` | `red/2` | #180606 |
| `fill/info-secondary` | `--fill-info-secondary` | `blue/3` | #0A1424 |
| `fill/info-secondary-hover` | `--fill-info-secondary-hover` | `blue/4` | #0E1B32 |
| `fill/info-secondary-active` | `--fill-info-secondary-active` | `blue/5` | #122340 |
| `fill/info-secondary-disabled` | `--fill-info-secondary-disabled` | `blue/2` | #060C17 |
| `fill/fixed` | `--fill-fixed` | `white` | #FFFFFF |
| `fill/fixed-disabled` | `--fill-fixed-disabled` | `gray/9` | #92908E |
| `border/primary` | `--border-primary` | `gray/4` | #1D1B1A |
| `border/primary-hover` | `--border-primary-hover` | `gray/5` | #262322 |
| `border/primary-active` | `--border-primary-active` | `gray/6` | #2E2C2B |
| `border/primary-disabled` | `--border-primary-disabled` | `gray/3` | #151312 |
| `border/secondary` | `--border-secondary` | `gray/5` | #262322 |
| `border/secondary-hover` | `--border-secondary-hover` | `gray/6` | #2E2C2B |
| `border/secondary-active` | `--border-secondary-active` | `gray/7` | #373533 |
| `border/secondary-disabled` | `--border-secondary-disabled` | `gray/4` | #1D1B1A |
| `border/tertiary` | `--border-tertiary` | `gray/6` | #2E2C2B |
| `border/tertiary-hover` | `--border-tertiary-hover` | `gray/7` | #373533 |
| `border/tertiary-active` | `--border-tertiary-active` | `gray/8` | #403E3C |
| `border/tertiary-disabled` | `--border-tertiary-disabled` | `gray/5` | #262322 |
| `border/elevated` | `--border-elevated` | `gray/7` | #373533 |
| `border/elevated-hover` | `--border-elevated-hover` | `gray/8` | #403E3C |
| `border/elevated-active` | `--border-elevated-active` | `gray/8` | #403E3C |
| `border/elevated-disabled` | `--border-elevated-disabled` | `gray/6` | #2E2C2B |
| `border/inverse` | `--border-inverse` | `gray/12` | #F1EEEC |
| `border/inverse-hover` | `--border-inverse-hover` | `white` | #FFFFFF |
| `border/inverse-active` | `--border-inverse-active` | `gray/11` | #C0BDBB |
| `border/inverse-disabled` | `--border-inverse-disabled` | `gray/9` | #92908E |
| `border/brand` | `--border-brand` | `orange/9` | #FF3D01 |
| `border/brand-hover` | `--border-brand-hover` | `orange/10` | #FF6645 |
| `border/brand-active` | `--border-brand-active` | `orange/8` | #741600 |
| `border/brand-disabled` | `--border-brand-disabled` | `orange/7` | #611807 |
| `border/success` | `--border-success` | `green/9` | #00AC62 |
| `border/success-hover` | `--border-success-hover` | `green/10` | #3CB974 |
| `border/success-active` | `--border-success-active` | `green/8` | #004C28 |
| `border/success-disabled` | `--border-success-disabled` | `green/7` | #0A4024 |
| `border/warning` | `--border-warning` | `amber/9` | #C08200 |
| `border/warning-hover` | `--border-warning-hover` | `amber/10` | #CC9235 |
| `border/warning-active` | `--border-warning-active` | `amber/8` | #563700 |
| `border/warning-disabled` | `--border-warning-disabled` | `amber/7` | #483008 |
| `border/critical` | `--border-critical` | `red/9` | #FF383F |
| `border/critical-hover` | `--border-critical-hover` | `red/10` | #FF635F |
| `border/critical-active` | `--border-critical-active` | `red/8` | #760F15 |
| `border/critical-disabled` | `--border-critical-disabled` | `red/7` | #611617 |
| `border/info` | `--border-info` | `blue/9` | #478CFF |
| `border/info-hover` | `--border-info-hover` | `blue/10` | #629DFF |
| `border/info-active` | `--border-info-active` | `blue/8` | #193C76 |
| `border/info-disabled` | `--border-info-disabled` | `blue/7` | #193460 |
| `border/focus` | `--border-focus` | `orange/10` | #FF6645 |
| `border/focus-inverse` | `--border-focus-inverse` | `gray/1` | #070505 |
| `border/brand-secondary` | `--border-brand-secondary` | `orange/6` | #50160A |
| `border/brand-secondary-hover` | `--border-brand-secondary-hover` | `orange/7` | #611807 |
| `border/brand-secondary-active` | `--border-brand-secondary-active` | `orange/8` | #741600 |
| `border/selected` | `--border-selected` | `orange/10` | #FF6645 |
| `content/primary` | `--content-primary` | `gray/12` | #F1EEEC |
| `content/secondary` | `--content-secondary` | `gray/11` | #C0BDBB |
| `content/tertiary` | `--content-tertiary` | `gray/9` | #92908E |
| `content/primary-disabled` | `--content-primary-disabled` | `gray/8` | #403E3C |
| `content/secondary-disabled` | `--content-secondary-disabled` | `gray/8` | #403E3C |
| `content/tertiary-disabled` | `--content-tertiary-disabled` | `gray/8` | #403E3C |
| `content/link` | `--content-link` | `orange/10` | #FF6645 |
| `content/link-hover` | `--content-link-hover` | `orange/11` | #FFA28C |
| `content/selected` | `--content-selected` | `orange/10` | #FF6645 |
| `content/inverse-primary` | `--content-inverse-primary` | `gray/1` | #070505 |
| `content/inverse-secondary` | `--content-inverse-secondary` | `gray/4` | #1D1B1A |
| `content/inverse-primary-disabled` | `--content-inverse-primary-disabled` | `gray/9` | #92908E |
| `content/inverse-secondary-disabled` | `--content-inverse-secondary-disabled` | `gray/9` | #92908E |
| `content/fixed-primary` | `--content-fixed-primary` | `gray/1` | #070505 |
| `content/fixed-inverse` | `--content-fixed-inverse` | `white` | #FFFFFF |
| `content/fixed-primary-disabled` | `--content-fixed-primary-disabled` | `gray/9` | #92908E |
| `content/fixed-inverse-disabled` | `--content-fixed-inverse-disabled` | `gray/9` | #92908E |
| `content/brand` | `--content-brand` | `orange/10` | #FF6645 |
| `content/brand-hover` | `--content-brand-hover` | `orange/11` | #FFA28C |
| `content/brand-active` | `--content-brand-active` | `orange/9` | #FF3D01 |
| `content/brand-disabled` | `--content-brand-disabled` | `orange/7` | #611807 |
| `content/success` | `--content-success` | `green/10` | #3CB974 |
| `content/success-hover` | `--content-success-hover` | `green/11` | #88D1A2 |
| `content/success-active` | `--content-success-active` | `green/9` | #00AC62 |
| `content/success-disabled` | `--content-success-disabled` | `green/7` | #0A4024 |
| `content/warning` | `--content-warning` | `amber/10` | #CC9235 |
| `content/warning-hover` | `--content-warning-hover` | `amber/11` | #DEB67F |
| `content/warning-active` | `--content-warning-active` | `amber/9` | #C08200 |
| `content/warning-disabled` | `--content-warning-disabled` | `amber/7` | #483008 |
| `content/critical` | `--content-critical` | `red/10` | #FF635F |
| `content/critical-hover` | `--content-critical-hover` | `red/11` | #FFA098 |
| `content/critical-active` | `--content-critical-active` | `red/9` | #FF383F |
| `content/critical-disabled` | `--content-critical-disabled` | `red/7` | #611617 |
| `content/info` | `--content-info` | `blue/10` | #629DFF |
| `content/info-hover` | `--content-info-hover` | `blue/11` | #98BFFF |
| `content/info-active` | `--content-info-active` | `blue/9` | #478CFF |
| `content/info-disabled` | `--content-info-disabled` | `blue/7` | #193460 |
| `content/brand-inverse` | `--content-brand-inverse` | `orange/8` | #741600 |
| `content/success-inverse` | `--content-success-inverse` | `green/8` | #004C28 |
| `content/warning-inverse` | `--content-warning-inverse` | `amber/8` | #563700 |
| `content/critical-inverse` | `--content-critical-inverse` | `red/8` | #760F15 |
| `content/info-inverse` | `--content-info-inverse` | `blue/8` | #193C76 |
| `content/on-brand` | `--content-on-brand` | `white` | #FFFFFF |
| `content/on-success` | `--content-on-success` | `white` | #FFFFFF |
| `content/on-warning` | `--content-on-warning` | `white` | #FFFFFF |
| `content/on-critical` | `--content-on-critical` | `white` | #FFFFFF |
| `content/on-info` | `--content-on-info` | `white` | #FFFFFF |
| `content/on-inverse` | `--content-on-inverse` | `gray/1` | #070505 |
| `content/on-brand-disabled` | `--content-on-brand-disabled` | `gray/9` | #92908E |
| `content/on-success-disabled` | `--content-on-success-disabled` | `gray/9` | #92908E |
| `content/on-warning-disabled` | `--content-on-warning-disabled` | `gray/9` | #92908E |
| `content/on-critical-disabled` | `--content-on-critical-disabled` | `gray/9` | #92908E |
| `content/on-info-disabled` | `--content-on-info-disabled` | `gray/9` | #92908E |
