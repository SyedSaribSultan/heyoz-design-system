# HeyOz for shadcn/ui

Everything a developer needs to run shadcn/ui on the HeyOz design system. The full mapping, with every value and the reason for it, is **[docs/shadcn.md](../../docs/shadcn.md)** (D-038).

| File | What it is | Edit? |
|---|---|---|
| `map.json` | The source: each shadcn slot → the HeyOz token it uses, and why | Yes, by hand. Then `npm run tokens` in `app/` |
| `globals.css` | The theme, paste-ready for Tailwind v4 | No, generated from `map.json` |
| `example/layout.tsx` | The two lines of setup in a Next.js app: the `dark` class and the fonts | Copy it |
| `preview/` | Stock shadcn components on this theme (checked 2026-11-06) | No, screenshots |

## Set up in three steps

1. Replace your shadcn `globals.css` with `globals.css` from this folder.
2. Put `class="dark"` on `<html>` and load Geist (`--font-geist-sans`) and Bricolage Grotesque (`--font-bricolage`). See `example/layout.tsx`.
3. Use shadcn as usual. For the one main action on a screen, use the HeyOz addition `bg-brand text-brand-foreground`, not `primary`.

Optional: the class swaps in docs/shadcn.md make hover and press step like HeyOz instead of fading.

## The three choices behind it

- **`primary` is white** (`fill/inverse`), like the HeyOz primary button. shadcn uses `primary` for checkboxes, switches and sliders too, so orange would be everywhere. Orange is `brand`.
- **Values, not references.** `globals.css` holds resolved OKLCH values, with the HeyOz token named on every line, so it works in any project without the HeyOz CSS.
- **No chart colours.** HeyOz has no chart palette (D-012); `chart-1…5` keep shadcn's defaults.
