# Light tokens (generated)

> Generated from `tokens/light.json` by `app/scripts/build-tokens.mjs`. Do not edit.

Light effects. Source of truth. Philosophy: light falls on every surface above the background, never on the background itself and never on media (D-020). One cursor light per screen: each lit surface paints its own share of it at the cursor's true position, so neighbouring surfaces join seamlessly and the background between them stays dark. It blends with soft-light, so it brightens each surface in proportion to its own lightness. Media sits above the light and the light dims while the cursor is over media. 'fill' references a semantic colour; 'fade' references a motion duration. 'blur' is in Figma layer-blur units; CSS blur() uses half of it. The build turns size and blur into the falloff of a blurred disc, so a larger blur spreads the light wider and dimmer, exactly as in Figma.

> `blur` is the Figma layer-blur value. CSS `blur()` uses half of it.

| Token | Fill | Blend | Opacity | Over media | Size | Blur (Figma → CSS) | Peak | Reach | Fade |
|---|---|---|---|---|---|---|---|---|---|
| `light/cursor` | `content/primary` (#F1EEEC) | soft-light | 100% | 25% | 75px | 120 → 60px | 18% | 218px | 200ms (`duration/base`) |

Peak: the share of the fill under the cursor (a disc of `size` blurred by `blur`). Reach: the radius where the light ends.
