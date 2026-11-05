# Type tokens (generated)

> Generated from `tokens/typography.json` by `app/scripts/build-tokens.mjs`. Do not edit.

HeyOz type tokens. Source of truth. Every role has xs to xl; body adds 2xl and 3xl for lead text and large buttons. 22 sizes x 4 weights = 88 styles. Each style bundles family, size, line height, letter spacing and weight. Sizes and line heights are px. Line heights sit on a 4px grid, with a 2px half-step only where 4px would be too loose.

## Families

| Role | Family |
|---|---|
| display | Bricolage Grotesque |
| heading | Bricolage Grotesque |
| body | Geist |
| label | Geist |

## Weights

| Weight | Value |
|---|---|
| regular | 400 |
| medium | 500 |
| semibold | 600 |
| bold | 700 |

## Styles

Class: `.type-{role}-{size}-{weight}`, e.g. `.type-body-md-regular`. Variables: `--type-{role}-{size}-size | -line-height | -tracking`.

| Role | Size | Font size | Line height | Ratio | Tracking |
|---|---|---|---|---|---|
| display | xs | 32px | 36px | 1.125 | -0.02em |
| display | sm | 40px | 44px | 1.1 | -0.02em |
| display | md | 48px | 52px | 1.0833 | -0.03em |
| display | lg | 56px | 60px | 1.0714 | -0.03em |
| display | xl | 64px | 68px | 1.0625 | -0.03em |
| heading | xs | 16px | 20px | 1.25 | 0em |
| heading | sm | 18px | 24px | 1.3333 | 0em |
| heading | md | 20px | 28px | 1.4 | -0.01em |
| heading | lg | 24px | 32px | 1.3333 | -0.01em |
| heading | xl | 28px | 36px | 1.2857 | -0.01em |
| body | xs | 11px | 16px | 1.4545 | 0.01em |
| body | sm | 12px | 16px | 1.3333 | 0.01em |
| body | md | 14px | 20px | 1.4286 | 0em |
| body | lg | 16px | 24px | 1.5 | 0em |
| body | xl | 18px | 28px | 1.5556 | 0em |
| body | 2xl | 20px | 28px | 1.4 | -0.01em |
| body | 3xl | 24px | 32px | 1.3333 | -0.01em |
| label | xs | 10px | 12px | 1.2 | 0.01em |
| label | sm | 11px | 14px | 1.2727 | 0.01em |
| label | md | 12px | 16px | 1.3333 | 0.01em |
| label | lg | 14px | 18px | 1.2857 | 0em |
| label | xl | 16px | 20px | 1.25 | 0em |

## Tracking rule

Letter spacing is a function of size: looser when small, tighter when large. Each row applies up to and including maxSize.

| Up to | Tracking |
|---|---|
| 12px | 0.01em |
| 18px | 0em |
| 28px | -0.01em |
| 40px | -0.02em |
| larger | -0.03em |
