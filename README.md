# HeyOz Design System

The single place that says how HeyOz looks, feels and behaves, and why.

It's written for two readers at once:

- **Designers and engineers** who need to know what to use and when.
- **AI agents** (Claude, mainly) that build HeyOz screens and components from these docs.

Both readers get the same text. If something only makes sense to one of them, it's written badly. Fix it.

---

## Start here

1. Open the page for what you're working on (see the map below).
2. If you need a value that doesn't exist, **stop**. Don't invent one. Propose it in **[Decisions](docs/decisions.md)**.

**For AI agents, the order of truth:**
1. Screenshots the design owner shares. These are always the newest reference.
2. This folder.
3. Nothing else. The existing codebase is not a source of truth.

If a screenshot and these docs disagree, follow the screenshot and flag the drift so the docs get updated. Never use a raw hex, px or ms value that isn't a token here.

---

## Map

| Page | What it covers | Source | Status |
|---|---|---|---|
| [Colour](docs/tokens-color.md) | 12-step ramps + 173 semantic colours, OKLCH | `tokens/colors.json` | Stable v1 |
| [Typography](docs/tokens-typography.md) | 88 styles | `tokens/typography.json` | Stable v1 |
| [Number](docs/tokens-number.md) | Space, radius, size, stroke | `tokens/number.json` | Stable v1 |
| [Motion](docs/tokens-motion.md) | Durations, easing | `tokens/motion.json` | Stable v1 |
| [Light](docs/tokens-light.md) | Cursor light: on every surface above the background, never on the background or media | `tokens/light.json` | Stable v1 |
| Icons (docs site `/foundations/icons`) | Icon grid, rules, 1,077 HeyOz icons, 2,019 Lucide icons on the grid | `icons/heyoz/` + `lucide-static` | Stable v1 |
| [Button](docs/components/button.md) | 8 types, icon buttons, 2 links, 7 sizes, squircle and pill | `components/button.json` | Draft |
| [Sidebar](docs/components/sidenav.md) | Side nav: expanded / collapsed, states, collapse motion, Ctrl+B, scrolling; every sidebar uses it | `components/sidenav.json` | Stable |
| Tokens Studio export | All tokens as Figma variables (optional) | `figma/tokens-studio.json` (generated) | Stable v1 |
| [shadcn/ui](docs/shadcn.md) | HeyOz in shadcn's variable names: paste-ready `globals.css` for Tailwind v4 | `exports/shadcn/map.json` → `exports/shadcn/globals.css` (generated) | Stable v1 |
| [Decisions](docs/decisions.md) | The judgment calls and why | – | Live |
| [Changelog](docs/changelog.md) | What changed, when, and why | – | Live |

**Status:** *Draft* (open for change) → *Stable* (safe to build on) → *Deprecated* (don't use, see the replacement).
**This repository is the source of truth** (D-002). Every change starts in the source files here. Figma was a one-time starting point; where it differs, the repository wins.

---

## Conventions

**Token names.** Always in `code`, always lowercase, always slash-separated `group/role-state`.
Example: `fill/primary-hover` means group *fill*, role *primary*, state *hover*.
The name says what the token is *for*, never what colour it is. `content/secondary`, not `grey-400`.

**Two layers.** *Primitives* are raw values named by hue and step (`gray/3`, `orange/9`). *Semantic* tokens point at primitives (`surface/secondary → gray/3`). Components only use semantic tokens, so the product is retuned by editing one line.

**Names everywhere are the same.** `gray/3` in the docs is `gray.3` in Tokens Studio, `gray/3` in Figma and `--gray-3` in CSS.

**Writing.** Plain words, short sentences, numbers instead of adjectives ("4.5:1", not "good contrast"). Every rule says why once.

---

## How a change happens

1. **Decide.** Add a record to [Decisions](docs/decisions.md): context, decision, why, cost.
2. **Change the source.** Edit `tokens/*.json` or `components/*.json`, then run `npm run tokens` in `app/`. The build checks the rules.
3. **Check it.** Look at the page on the docs site, and run `npm test` if the editor is touched. Never hand-edit generated files (list below).
4. **Log.** Add an entry to the [Changelog](docs/changelog.md).

If step 2's check fails, the change doesn't ship. A check you didn't run hasn't passed.

---

## Folder

```
heyoz-design-system/
├── README.md                     ← you are here
├── .claude/                      ← Claude Code review gate: agents/repo-sync-reviewer.md, hooks/repo-review-gate.mjs, settings.json (not deployed)
├── tokens/                       ← SOURCE: colors, typography, number, motion, light (.json)
├── components/                   ← SOURCE: component specs (button.json, sidenav.json): token references + rules
├── icons/                        ← SOURCE: HeyOz icons exported from Figma (Icons, 25:48) + heyoz.json index
├── docs/
│   ├── decisions.md, changelog.md        ← written by hand
│   ├── tokens-*.md                       ← generated, one per tokens/*.json
│   ├── shadcn.md                         ← generated, from exports/shadcn/map.json
│   └── components/*.md                   ← generated, one per components/*.json
├── figma/tokens-studio.json      ← generated, load into Tokens Studio
├── exports/shadcn/               ← shadcn/ui: map.json (SOURCE) → globals.css (generated); README, example/, preview/
├── app/                          ← Next.js docs site
│   ├── scripts/build-tokens.mjs  ← the build: reads the sources, checks every rule, writes everything generated
│   ├── scripts/build-icons.mjs   ← npm run icons: puts Lucide on the icon grid, prepares the HeyOz icons
│   ├── public/icons/             ← generated icon files and sprites
│   └── src/
│       ├── styles/, tokens/      ← generated CSS (tokens, type, components) and JSON (resolved: server only; components: for the browser)
│       ├── lib/                  ← tk() (applies tokens, records them), LightField (cursor light) + Light (popover light root),
│       │                            useIndicator (sliding selection), usePresence (exit animations), Inspector (Ctrl + Alt), TypeSwitcher
│       ├── components/           ← components built from their spec: Button, SideNav; Segmented (built on Button)
│       ├── docs/                 ← the docs frame: nav.js (the site map + each page's sections), Sidebar, Shell, DocsChrome (search, copy), ui blocks
│       └── app/                  ← routes: / · foundations/* · components/* · home and editor (screens)
├── archive/                      ← kept for reference, never deployed (old assets, the archived Figma colour export)
└── current-figma-tokens-11.03.2026/   ← the original Figma export, reference only, never deployed
```

**Generated, never edit by hand:** `app/src/styles/tokens.css`, `typography.css`, `components.css`; `app/src/tokens/*.json`; `docs/tokens-*.md`; `docs/components/*.md`; `figma/tokens-studio.json`; `exports/shadcn/globals.css`, `docs/shadcn.md`; `app/public/icons/`. Everything else is written by hand.

**How it connects:** `tokens/*.json` + `components/*.json` → `npm run tokens` → CSS variables, type classes, `tokens.resolved.json`, `docs/*.md`, `figma/tokens-studio.json`, `exports/shadcn/globals.css`. The docs site and the components read only the generated files, so every page shows exactly what the sources say.

---

## Run the docs site

```
cd app
npm install
npm run dev        # rebuilds tokens, then serves http://localhost:3000
```

```
npm test           # the editor model's rules (node --test), no UI needed
```

Code: **https://github.com/SyedSaribSultan/heyoz-design-system** (private, branch `main`).

Live: **https://heyoz.syedsarib.com** (Vercel project `heyoz-design-system`, root directory `app`). Deploy from the **repo root** with `vercel deploy --prod` (the build reads `tokens/` and `components/`).

Pages: `/` overview · `/foundations/colour` · `/foundations/typography` · `/foundations/spacing` · `/foundations/radius` · `/foundations/size` · `/foundations/icons` · `/foundations/motion` · `/foundations/light` · `/components/button` · `/components/sidebar` · screens `/home` and `/editor` (demo states: `/editor?scene=none|clip|text|ai|empty|grown`; below 820px wide it switches to the narrow layout). On any page, hold **Ctrl + Alt** and point at something to see its tokens. Press **/** or **Ctrl K** to search pages, sections and tokens; click a token chip to copy it. Add a page in `app/src/docs/nav.js`.

`npm run tokens` rebuilds every generated file (it writes only the files whose content changed). `npm run icons` (needs `npm install` once, for `lucide-static`) regenerates the icon files; run it after re-exporting icons from Figma or updating Lucide. The build fails if a rule is broken or a spec points at a token that doesn't exist.

## Working with Claude Code

`.claude/` holds a review gate for agents working in this repository. After any reply that changed, added or removed files here (except `.claude/`, `archive/`, the old Figma export and the generated icons), a Stop hook (`.claude/hooks/repo-review-gate.mjs`) has Claude run the **repo-sync-reviewer** agent (`.claude/agents/repo-sync-reviewer.md`): it checks that decisions, specs, generated docs, site pages, README and changelog all match the change, and Claude fixes what it finds before finishing. It runs once per reply and never loops; `/hooks` shows or disables it.

## Add a component

1. Write `components/<name>.json`: every value a token reference, a set number, `none` or a rule. Behaviour that is not a value (motion, keyboard, scroll) goes in `rules`.
2. Run `npm run tokens`. The build checks every reference and writes `docs/components/<name>.md` and the CSS variables.
3. Build `app/src/components/<Name>.jsx` from the generated files only, never from raw values.
4. Add its page: one entry in `app/src/docs/nav.js` and a route under `app/src/app/(docs)/components/`.
5. Record the decision in [Decisions](docs/decisions.md) and log it in the [Changelog](docs/changelog.md).

## Load into Figma (Tokens Studio, optional)

1. In Figma, open the Tokens Studio plugin.
2. Tools → Load from file → pick `figma/tokens-studio.json`.
3. Styles & Variables → Create variables. Tick the five themes: Primitives, Color · Dark, Number, Typography, Effect.
4. Create styles for Typography to get the 88 text styles.

Component specs are not in the Tokens Studio file; their pages under `docs/components/` list every value.
