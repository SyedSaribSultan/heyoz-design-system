# Changelog

What changed, when, and why. Newest first. A change with a reason and checks gets a block written like a commit message; a small change gets one line, `type(scope): what changed`. Decisions (D-xxx) hold the rules; this file holds the history.

```
type(scope): what changed

Why:    the reason
Checks: what was verified
```

Types: `feat` (new) · `fix` (correction) · `change` (alters existing behaviour) · `docs` (writing only) · `remove`

---

## 2026-11-13

```
feat(components): 17 draft components, each with a spec, a component and a docs page (D-040 to D-047)

Why:    the owner wants the baseline components, built to the Button and Sidebar standard.
What:   Text field (+ textarea, field frame), Checkbox, Radio, Switch, Segmented (spec and page for the
        existing control; one Tab stop, icons, hug), Tabs, Menu, Select, Tooltip, Popover, Dialog (+ alert,
        bottom sheet), Toast, Badge, Chip, Avatar, Slider, Progress (+ Spinner). Each has
        components/<name>.json (generated docs/components/<name>.md and --<prefix>-* variables), a component
        in app/src/components and a page under /components/. Pages read every number from the spec.
        Segmented's CSS moved out of button.css into segmented.css. Selection docs classes renamed sc-* so
        they never meet Select's sel-*. Open choices: Q-5 to Q-9.
Checks: npm run tokens (19 components); npm test 9/9; production build passes with every route;
        browser checks of Tabs, Checkbox, Text field, Slider, Popover and Dialog
```

- fix(avatar): the status dot is the top layer, so the photo no longer covers it and the squircle's 1px corner edge no longer cuts across it.
- remove(type preview): the typeface switcher is gone from every page, with its 8 preview fonts and session script; Bricolage Grotesque and Geist stay (D-018, D-033).
- change(focus): focus is subtle everywhere. `border/focus` orange/10 → gray/8, so every keyboard focus ring (Button, side nav, Checkbox, Radio, Switch, Tabs, Menu, Chip, Segmented, Slider) is a quiet neutral ring; Text field and Select show focus only by stepping their border up to `border/primary-active`; the docs-site outline no longer draws over components (D-035, D-040).
- fix(checkbox, radio, switch): no inner shade, so on is a flat solid white that pops; the tick and dash are drawn for the box (about 7/16 wide, 2/16 stroke) instead of a full-size, thin icon (D-041).
- fix(segmented): in hug mode options size to their content, so icon-only options are squares and the indicator lines up.
- fix(sidenav): the search box no longer shrinks when the link list is longer than the screen; only the list gives way.

```
fix(repo): everything documented once, in sync, no duplicates

Why:    the owner asked for the repository to be well documented, synced and free of redundancy.
What:   Dashboard (/dashboard): documented (D-039, site map, overview tile, README); its CSS uses tokens only
        (type variables instead of raw px, size/space/radius tokens, no scrollbar-width, D-035 hover and
        focus borders); Oz's answer enters with motion-pop; it shares Home's IconButton (now
        home/IconButton.jsx) and the Lucide icon instead of copies; its README keeps only states and data sources.
        Effects (D-021): written once as --fx-inner-shade, --fx-inner-highlight, --fx-drop-md, --fx-drop-sm in
        globals.css; Button, Segmented, side nav, docs, inspector, type switcher, editor and tk() FX use them
        (were 10 copies). Same values, no visual change.
        Shared helpers: Lucide moved to lib/ (a shipped component no longer imports from the docs frame);
        rec() lives once in lib/rec.js (was 3 copies); the editor's Ic and iconUrl are the shared Lucide.
        Dead code removed: Home's old NavList, tk() hoverBorder/hoverFx and unused classes, unused CSS,
        getKey, trackOfSel, unused imports. Raw values replaced by existing tokens in the editor.
        Docs site: motion, size and sidebar numbers and the icon count are read from the tokens and specs
        (no hand-typed copies). Figma node ids removed from specs, tokens, comments and decisions (D-002).
        Fixed: D-030 said labels fade at duration/slow (they fade at duration/fast); number.json radius
        names; README generated-file list (icons.json), styles/ (motion.css is hand-written), redirects.
        Build: every component spec other than Button is one generic "parts" format with its own selector
        and prefix (D-025), so new components need no build change. .gitignore covers .env files at any
        depth; app/.gitignore was a duplicate.
Checks: npm run tokens (unchanged output for the side nav), npm test 9/9, every route 200, /dashboard
        checked in all five states
```

## 2026-11-06

```
feat(exports): shadcn/ui mapping (D-038)

Why:    developers on shadcn/ui need the HeyOz tokens in shadcn's variable names.
What:   exports/shadcn/map.json (source): all 27 shadcn colour slots, 10 HeyOz additions (brand, brand-muted,
        success, warning, info + foregrounds), 14 state colours (-hover / -active), radius sm–3xl, fonts.
        npm run tokens checks every reference, that every shadcn slot is mapped and every addition has a
        -foreground, and writes exports/shadcn/globals.css (Tailwind v4, resolved OKLCH, token named per line)
        and docs/shadcn.md. exports/shadcn/README.md, example/layout.tsx (dark class + fonts) and preview/.
Checks: npm run tokens passes; a fresh Next.js + shadcn@latest app (base-nova) with button, input, textarea,
        select, checkbox, switch, slider, tabs, card, badge, dropdown-menu, dialog and sidebar builds and
        renders on the file with only globals.css and layout.tsx changed; fonts resolve to Geist and Bricolage;
        screenshots in exports/shadcn/preview/
```

## 2026-11-05

- fix(sidebar): the logomark no longer jerks when the nav opens or closes. It was two elements (a link open, a button collapsed) swapped at the start of the motion, so it jumped 2px against the direction of travel, and on opening its link was squeezed to 0 wide and centred, throwing the logomark 46px left for a frame. Now one logo stays mounted, the open button lies over it, the wordmark and close button fade; measured frame by frame: 16 → 10 and 10 → 16, one direction, no jump. Also: the logo link has a focus ring, the row keeps stroke/2 of clip room (D-037), and toggling from the logo row hands keyboard focus between the open and close buttons instead of dropping it (Ctrl+B too, when focus is on a toggle). The sidebar, icons and light pages (and the sidebar spec) no longer cite Figma node ids.

- feat(repo): the repository is on GitHub (private): https://github.com/SyedSaribSultan/heyoz-design-system. `.gitignore` covers dependencies, builds, test output and secrets at any depth; `.gitattributes` keeps LF line endings on every machine.

- fix(repo): the review gate also counts added, removed and renamed files (a folder's date changes), its skip list is anchored to the repository root, its timestamp stays out of version control; README shows `.claude/` in the folder tree and says what the gate ignores and that the build writes only changed files. Found by the gate's own first review.

```
feat(repo): a sync review after every change

Why:    the owner wants every fix reflected everywhere in the repository, checked by an agent each time.
What:   .claude/agents/repo-sync-reviewer.md: a read-only reviewer that checks decisions, specs, generated docs,
        site pages, README and changelog against a change. .claude/settings.json: a Stop hook
        (.claude/hooks/repo-review-gate.mjs) that, when repository files changed since the last review, makes
        Claude run the reviewer and fix its findings before finishing; once per reply, never loops.
        The token build now writes a generated file only when its content changed (an unchanged build touches
        nothing). .claude/ is kept out of the deploy. README: "Working with Claude Code".
Checks: hook script pipe-tested (first run, no change, change, loop guard, after review); unchanged build
        touches no file; settings.json valid
```

- fix(sidenav): the keyboard focus ring on menu items was clipped where an item touches the link list's edge (the list is a scroll container). The list keeps stroke/2 of room on every side and pulls back by the same amount; items do not move. Scan of every page for focusable elements closer than 2px to a clipping edge: none left.
- fix(docs): Button page anatomy, with the measure marks on the specimen is a picture, so it also leaves the Tab order (its focus ring was clipped by the zoom frame).
- fix(docs): Sidebar page, the demo frames' outer ring was clipped at the top: their row is a scroll container, which clips anything painted outside it. The row now keeps one stroke of room (padding + matching negative margin, layout unchanged).
- docs(site): every page intro and section description now states the rule and its numbers (spacing grid, radii, heights, durations, easings, tracking, step jobs) instead of a picture-book line. Q-4 closed: white stays on the brand fill (D-003).

```
docs: the repository is ready for handoff

Why:    the repository is the source of truth for developers; every intended behaviour must be written down, correct and easy to find.
What:   Decisions: D-002 now says the repository wins over Figma; Figma is no longer called the authority (D-025, D-030,
        README, both specs). D-030 gains the sidebar behaviours (collapse motion, Ctrl+B, title and arrow sizes), D-034 the
        editor's scenes, static page and no-shift load, D-035 its exceptions (focus, selected), D-036 the tool panel, D-037
        the sidebar scrollbar. D-033 / D-034 split, D-031 example fixed, the brand-label question moved to Open (Q-4),
        same-day back-and-forth removed from History. Specs: sidenav rules collapse, shortcut, scroll, icons; button rule
        states; the build prints the light rule on top of the light docs and no longer prints "Variant: undefined".
        Site: Sidebar, Button, Colour (borders), Size and Light pages say what the code does; search copies `lit`.
        Code follows the docs: editor selection rings use border/selected; the Home tile glow has its own set values
        (no longer moves when the cursor light is tuned). Removed dead nav.js fields and an unused 500 KB import;
        references to files outside the repo; tokens/colors-dark.tokens.json moved to archive/. README: complete map,
        generated-vs-hand-written list, how to add a component, npm test, editor scenes.
Checks: npm run tokens (every reference resolves), npm test 9/9, every page 200
```

- change(sidenav): group titles (FOUNDATIONS, COMPONENTS, SCREENS; CREATION on Home) body/md/regular (14px) → label/sm/medium (11px). Differs from Figma 707:12639 until Figma is updated.

```
change(app): minimal scrollbars everywhere; the sidebar list keeps its scroll; overview polish

Why:    the owner wants a modern, minimal scrollbar, and saw the sidebar move while scrolling the page.
What:   One scrollbar style (D-037, app/globals.css): a floating pill on a transparent track, no arrows,
        4px at rest, 6px and brighter on hover, brighter while dragged; Firefox gets the thin standard bar in
        the same colours. Per-panel scrollbar rules removed so every panel uses it. Sidebar: when its links
        are taller than the screen, the list scrolls on its own and never hands the scroll to the page
        (overscroll contain); its 8px bar shows only while the pointer is over the nav and sits in the nav's
        padding, so items never change width. Overview: the title is two lines, "Design System" / "HeyOz"
        (no dot starting a line); the Editor tile shows the clapperboard icon (40, like the Home logomark).
Checks: real mouse-wheel over the sidebar on /home and a docs page: page stays at 0, list scrolls to its end;
        sidebar items still end at the brand picker's edge (284px)
```

- change(sidenav): the "opens in a new tab" arrow is size/icon/sm (16, vector 12), one step below the item icon (20, vector 15); new spec value item.ext-icon. It is a hint that the item is a link, not the item's icon.

```
fix(app): health audit before the stakeholder demo

Why:    the owner asked for the repository and the app in perfect, fast condition.
What:   Editor: no layout shift on load (CLS 0.17 → 0): the timeline keeps its scrollbar room, and the preview
        and lanes stay hidden until measured, then fade in. /editor is now static (served from the CDN); the
        ?scene= demo links are read in the browser. Tab title no longer doubled. Meta description + canonical.
        Accessibility: Home icon buttons named (Tasks, Add), clip and search names match their visible text.
        Home: canonical link. Cursor light: reads all positions, then writes (one layout per frame); reach from
        the token only. Removed dead CSS (13 unused classes), stale comments, unused next/image config.
        Moved 23 unused Home assets (2.2 MB, PNG originals and old nav SVGs) to archive/ (not deployed);
        tokens/colors-dark.tokens.json no longer uploaded. Installed the two missing build-time packages.
Checks: npm test 9/9; every route 200; live Lighthouse (desktop): overview A11y/BP/SEO 100, LCP 318 ms,
        CLS 0; Home LCP 279 ms, CLS 0; Editor LCP 556 ms, CLS 0. Cursor light 0.6 ms per frame (356 lit elements).
```

- change(light): light/cursor blur 150 → 120: peak 12% → 18% of the fill, reach 263 → 218px. The sweet spot between the original (blur 75) and too faint (blur 150).
- change(editor): the typeface preview (D-033) is hidden on /editor; it covered the timeline.
- change(light): light/cursor opacity 0.8 → 1, a little brighter; size 75 and blur 150 unchanged.

```
change(light): only surfaces above the background catch the light; softer, wider, no banding

Why:    the owner wants the light subtler and spread out, never on the background, smooth (no rings).
What:   light/cursor blur 75 → 150: the build now works out the real falloff of a blurred disc
        (peak 39% → 12% of the fill, reach 263px) as --light-cursor-stops / --light-cursor-reach.
        Size 120 / blur 300 (peak 8%, reach 510px) was tried and reverted by the owner as too subtle.
        Page frames (docs shell, Home, editor) are no longer lit. LightField moves to the root layout and paints
        every lit surface within reach at the cursor's true position; nested lit elements are covered by their
        surface. A brand edge glow on borders was tried and removed (owner). A noise mask dithers the light so it never bands. <Light> is now a lit popover
        root (menus, editor popovers); the token inspector too. Home: tk() marks every surface above the
        background as lit. Editor: stage, timeline, dock, inspector sections and tool panel are lit. Colour
        ladder rungs and the Light page specimens (except background) are lit. D-020 rewritten.
Checks: docs, editor: page frame never lit; surfaces within reach lit; editor popover layer intact;
        npm run tokens: every reference resolves (466 tokens)
```

- feat(sidenav): Ctrl+B / ⌘B opens and closes the main sidebar (docs and Home), like VS Code. Ignored while typing in a field.

```
change(editor): panels on distinct surfaces, more space

Why:    every region was surface/primary split by 1px lines, so the surfaces blurred together (owner, for a presentation).
What:   background → stage surface/primary → tool panels (inspector, timeline, dock) surface/secondary →
        floating cards surface/tertiary (D-036). Panels are radius/2xl with their own border, 12 apart on the
        background (8 on narrow). Top bar sits on the background. Timeline lanes are fill/primary wells; video
        and audio clips fill/elevated, text clips fill/tertiary. Fields fill/primary. More padding in the stage,
        transport, inspector and panels; ruler 32. The action bar is a centred dock. Thin scrollbars in panels.
Checks: screenshots at 1440 (clip selected, grown) and 390; the dock fits at 390 with no overflow
```

```
feat(color): every border family gets -active; pressed and active borders use it

Why:    the owner wants hover and active borders always, used in pressed, active and selected states (D-035).
What:   12 new tokens: border/{primary,secondary,tertiary,elevated,inverse,brand,success,warning,critical,info}-active
        and border/brand-secondary-hover, -active. 161 → 173 semantic colours.
        Button pressed (secondary, tertiary, outline, ghost) → border/<family>-active.
        Sidebar item active → border/primary-active. Editor toggle (pressed) and docs segmented (on) → border/primary-active.
Checks: npm run tokens: every reference resolves, 464 tokens in figma/tokens-studio.json
```

- remove(overview): the three hero buttons (Start with colour, Button, Home screen).

```
fix(sidenav): collapsed menu items are square, 36 × 36

Why:    they rendered 36 × 40: padding 8 + 24 + 8 grew past the spec's size-collapsed 36.
What:   collapsed item: height 36, icon anchored left (padding-left (36 − 20) / 2 = 8), never centred:
        centring made icons slide in from the right while the width animated. Labels keep their place
        in the DOM at zero width and opacity 0 (not display:none), so opening fades them in like closing.
        Item height is fixed (40), so 40 ↔ 36 animates instead of snapping.
Checks: rail items 36 × 36, icon at 8/8; on open and close the icon only moves left/right on one line,
        the label fades with the width, and the item and icon are the same DOM nodes throughout
```

```
change(button): hover lights the icon only; borders stay in their own family

Why:    the orange border on hover was too loud, as the owner asked.
What:   secondary, tertiary, outline, ghost — hover and pressed: icon → content/brand;
        border → border/secondary-hover (tertiary: border/tertiary-hover). Fills unchanged.
        No border/*-active tokens exist, so pressed reuses the hover border.
Checks: build passes; every reference resolves; generated button.md tables checked
```

```
feat(editor): timeline editor redesign as a screen, /editor

Why:    implement heyoz-editor-prototype.html (handoff: editor-redesign-handoff.md) in the new system.
What:   default = preview + transport, one video strip, five-button bar (Add, Text, Captions, Sound, AI);
        inspector only on selection; text/audio lanes only with content; magnetic video track;
        trim, reorder, move, snap, scrub, zoom, split, duplicate, delete, undo/redo; AI on the selection
        (Regenerate / Extend / Edit) gated by the model registry; music/SFX at the playhead; captions;
        export popover; ⌘K and ? ; bottom sheets under 820px. Built from Button and Segmented; the
        missing controls are drafts in app/src/app/editor/parts (D-034). Scenes: /editor?scene=none|clip|text|ai|empty|grown.
Checks: npm test (9 model tests: speed math, ripple, lane stacking, capability gating, AI undo, migration,
        0/1/30 clips) pass; 36 browser checks at 1440 and 390 pass; AA contrast checked (brand button fails, see D-034).
```
- change(home): brand picker chevron → double chevron now crossfades and slides 4px (duration/base, easing/standard), in and out; reduced motion keeps the fade.
- change(home): brand menu is single-select — the trigger shows the active brand's logo and name, picking another switches and closes the menu; rows are menuitemradio and keyboard-focusable.
- change(home): brand row actions (⋮) is now the Button component (ghost · 2xs · icon only, Lucide ellipsis-vertical) with every state; it stays pressed while its menu is open.

```
fix(home): menus placed relative to their trigger, on top of everything

Why:    menus sat under media, and the brand actions menu used a fixed 221px offset.
What:   Menu is placed from its trigger's position (right: beside, tops aligned; down; up),
        flips when it does not fit and stays on screen, and follows scroll and resize. It is
        drawn on the popover layer (above the light and media) and carries its own light.
        Brand actions menu: beside the brand menu, top aligned with the row it came from.
        Clicks inside any of a trigger's menus keep it open.
Checks: at 1280×800 and 1920×1080, every menu is the top layer at its corners and centre,
        including over media; brand actions top = row top, 8px from the brand menu; menus
        close on outside click; 0 page errors
```


```
feat(sidebar): spec file components/sidenav.json; the build checks it (D-025, D-030)

Why:    every component has a spec file the build checks; the side nav had none.
What:   sidenav.json holds every part: nav, logo, title, item (default · hover · active),
        brand (default · hover), community, profile, tooltip. npm run tokens validates each
        reference, writes --sn-* variables (components.css), type classes
        (components.json) and docs/components/sidenav.md. sidenav.css and SideNav.jsx read
        only those; the Sidebar page spec table is generated from the spec.
        Fix: menu items, brand name and the search input lost their type style to an
        all: unset reset (items showed 14/20, not 16/24); resets are now zero-specificity.
Checks: a planted bad reference fails the build (sidenav/item/hover/fill); item 16/24,
        brand 16/24 medium, wordmark 20/28, heights 40 / 50, widths 300 / 54
```

```
fix(home): brand menu opens to the right of the brand picker, top edges aligned

What:   new menu placement menu-right (top 0, 8px to the right of the trigger).
Checks: measured at 1920: menu top = trigger top, 8px gap; screenshot reviewed
```


```
change(light): retract "never on the background"; one light per screen again (D-020)

Why:    owner: the whole ladder of light, background included, looks right.
What:   the docs page frame is the lit area, so the background and every surface catch the
        light once; the search overlay is its own lit screen (data-light-root). Light page
        text and demo back to "everything except media". Overview: the Sidebar tile gets a
        preview (three real menu items; radius 16 = item 12 + padding 4).
Checks: localhost: background step lit; media dims; search panel lit, page frame idle
```

```
feat(sidebar): SideNav component from Figma 707:12639; every sidebar uses it

Why:    the Home sidebar is a finalised design; one component for every sidebar.
What:   components/SideNav.jsx + sidenav.css: expanded 300 / collapsed 54, menu item
        (default · hover · active), brand picker (default · hover, collapsed), community
        card, profile, close / open with tooltips (design annotation). Lucide icons
        (shared list: components/sidenav-data.js). Surface/primary, inner shade, lit.
        Only the groups scroll on short screens; tooltips are fixed to the window.
        Used by /home (with the live brand menu) and by this site (search in the slot,
        collapse remembered). New page: Components → Sidebar, with every state.
        Button specimens: label "label", square icons both sides, to check icon frames.
        Fix: lit surfaces that reset styles (search box, icon buttons) lit the whole
        sidebar; lit now survives all: unset.
Checks: 300 / 54 wide, brand 50, item 40 (8/12, radius 12); state colours computed;
        794-tall window: no overlap, groups scroll, brand menu fully visible
```

```
change(site): conventions applied everywhere: Lucide only, lit surfaces, inner shade, tiers

Why:    owner: the conventions were applied page by page, not globally.
What:   Icons: Lucide only in the docs UI (arrows, search, menu, pager, key hints, Button
        specimens); prose notation (→ ref, 24 × 24) stays text. Light: one mechanism, class
        `lit` + LightField; every surface is lit (cards, panels, tables, tiles, pager, nav
        items, search box, icon tiles, Figma steps, playground, segmented, buttons); never the
        page background (D-020 updated). Inner shade on the same surfaces. Skip link, key chips
        and toast moved to the secondary tier. Type: the 3× Figma-step label uses the xs
        button text style (was a typed 36/48); anatomy pins use label/lg. Zoom bar radius
        follows nesting (2xs radius 10 + 4). Light page: background step stays dark, a button
        to try, labels wrap, media lit behind and dimmed.
Checks: localhost: light on over surfaces, 0 lit areas over background, media state dims
```

```
feat(site): docs site live at heyoz.syedsarib.com; faster pages; search, mobile nav, metadata

Why:    host the docs site on Vercel, make it fast, and finish it as a website.
What:   Speed. The build also writes src/styles/components.css (button sizes and types as
        CSS) and src/tokens/components.json (the specs alone, for browser code); a Button is
        now attributes, not an inline style block (Button page HTML 917 → 329 KB). The icon
        libraries load from /icon-index/{lib} and render in batches (Icons page 1.57 MB →
        119 KB). The token inspector loads its data on first Ctrl + Alt, not with every page;
        the sidebar no longer pulls token data into the browser. Home images are WebP at 2×
        their shown size (2.18 MB → 36 KB). Static assets cache for a day.
        Site. Search (/ or Ctrl K): pages, sections and all 305 tokens; Enter copies a
        token. Click any token chip to copy it. Mobile top bar and drawer; wide tables
        scroll sideways. "On this page" marks the current section. Section titles are
        anchor links. Overview: lit hero, ramps, counts, link buttons (Button href).
        Titles, descriptions, social card, favicon, manifest, sitemap, robots, styled 404.
        Each page's toc lives in nav.js with the rest of the site map.
Checks: build passes; every route checked in a browser at 1440 and 390 wide; 2xs button
        measured 28 / 10 / 10 from the generated CSS
```

```
change(site): search and inspector on the primary/secondary tiers, lit; overview trimmed

Why:    owner review: the overlays used tertiary and elevated colours and did not catch the
        light (D-020); the overview carried sections nobody needed.
What:   Search: surface/primary + border/primary + inner shade, lit by light/cursor; rows
        fill/primary → fill/primary-hover + border/primary-hover + inner shade (the docs/Home
        nav pattern); a Lucide icon per page (nav.js icon), section and token kind. Sidebar
        search key chip radius/md (12 − 4, nesting rule). Inspector: surface/secondary +
        border/secondary + inner shade, lit at the real pointer position. Overview: the
        hero and each tile are their own lit area, so the page background never glows;
        tiles and hero get the inner shade; title "Design System ·
        HeyOz"; eyebrow, counts and "How a value travels" removed.
Checks: computed colours match the tokens; light on at the pointer; live on heyoz.syedsarib.com
```

```
change(button): 2xs is 28 tall with 6 / 10 padding and radius 10

Why:    owner's call for the smallest size.
What:   size/control/2xs 24 → 28 (padding 6 top and bottom around a 16 icon). 2xs padding x
        and radius are set values (10), not tokens; the spec allows a plain number for that.
        Grid rule: 4px, 2px half-steps under 12. Size page target demo follows the token.
Checks: 2xs measured: 28 tall, 10 side padding, radius 10, 6 above icon and text
```

```
docs(verify): full check of the folder and the running site

Checks: every file in the folder matches the tested build; regenerating tokens and icons
        changes nothing; every CSS variable, type class, asset and token name used in code
        exists; every nav page has a route and every route is in the nav; all 13 routes load
        with no errors, no failed requests, and all 2,756 icon references resolve
```


```
feat(type): body/2xl 20/28 and body/3xl 24/32; larger buttons grow their text

Why:    xl and 2xl buttons were empty: body stopped at 18, so text fell to a quarter of
        the height. Geist had nothing between 18 and display's 32.
What:   two body sizes (8 new styles, 88 in total, D-018 updated). The build allows a role
        to add 2xl and 3xl, in order, on the 4px grid. Buttons: xl 20/28 with a 24 icon,
        2xl 24/32 with a 32 icon (size/icon/xl).
Checks: build passes; Tokens Studio file resolves (452 tokens); every button still on the
        4px grid
```


```
change(button, number): new size scale from the 32px sweet spot; body text; 4px grid

Why:    small sizes looked bad and large ones empty; the old md (32) is the sweet spot.
What:   size/control is now 24, 32, 40, 48, 56, 64, 72 (2xs → 2xl). Old md becomes xs.
        Button text uses only the body role: 12, 14, 14, 16, 18, 18, 18 (xs = body/md 14/20).
        Icon frame from the icon scale by text size: 16, 16, 16, 20, 24, 24, 24. Padding x
        8, 12, 16, 20, 24, 32, 40. Squircle radius = height × 0.375 rounded to the nearest 4:
        8, 12, 16, 20, 20, 24, 28. The build fails if any typed value leaves the 4px grid.
        Other users of size/control keep their pixels (docs nav xs, search sm, Home icon
        buttons xs/sm; the Home tile's 28px add button is now a labelled off-scale size).
Checks: every rendered button measured: height, padding, gap and radius on the 4px grid;
        Home screenshot unchanged; build passes
```


```
change(button): inner shade on every filled state; Segmented control built from Button

Why:    the owner applies the inner shade to every clickable surface with a fill. And the
        playground's option groups were hand-made, with 2px edges that read as no padding.
What:   shade is no longer a per-type flag: the build gives every state with a fill the shade
        (outline, ghost, brand-ghost get it on hover and press). New Segmented component:
        options are real Buttons (selected = tertiary, others = ghost, sm), 4px frame padding,
        frame radius = button radius + padding. Used for the playground panel; the zoom bar
        uses Buttons too. Button gets block (fill the width).
Checks: every option sits 4px from its frame on all four sides (measured); build passes
```


```
change(app): button playground controls become a fixed property panel

Why:    options appeared and disappeared, shifting the layout.
What:   panel beside the stage, one row per property, options in a fixed grid. Options that
        don't apply are disabled, never removed (links: no icon-only, shape, loading or
        anatomy). Links moved into Type (link brand, link neutral). The legend dims instead
        of disappearing. Stage height fixed.
Checks: panel and stage size identical before and after switching to a link; 0 page errors
```


```
change(button): tertiary, outline and ghost get the orange hover

Why:    same behaviour as secondary, as the owner asked.
What:   hover and pressed: border → border/brand, icon → border/brand. Fills unchanged.
Checks: build passes; all four types screenshotted in hover and pressed
```


```
feat(button): eight types, icon buttons, two links; playground with zoom

What:   components/button.json gets types (brand, primary, secondary, tertiary, outline,
        ghost, brand-tone, brand-ghost), each with rest/hover/pressed/disabled colours and
        a shade flag, plus links (brand, neutral). The build checks every token. Button takes
        type=…; LinkButton is new. Button page: Playground (type, size, content, shape, state,
        anatomy on/off, zoom 100–800% with sizes at real proportions), Types, Icon buttons,
        Links, Colour table for every type.
Learned: old Figma buttons 25:11966 for which types exist and their token pairs. Dropped:
        Info (success/warning/error), Fixed, on-image and Link Neutral Subtle.
Checks: build passes; every type and state rendered; 0 page errors
```

## 2026-11-04

```
feat(icons): Icons page with the icon guide, the HeyOz icons and all of Lucide on the grid (D-029)

What:   /foundations/icons: grid + tokens, how to make the grid, sizes 16/24/32 with line and
        radius, rules (Figma 25:6154), 1,077 HeyOz icons from Figma 25:48 grouped by set, and
        2,019 Lucide icons (v1.67) redrawn on the grid, both searchable, click to download.
        New: icons/ (source exports), app/scripts/build-icons.mjs (npm run icons), generated
        app/public/icons/ (files + sprites). The icon grid moved from Size to Icons.
Checks: build fails if any Lucide icon is off the grid (all 2,019 pass: longest side 18,
        centred, line 1.5). HeyOz icons measured: 524 of 655 line icons inside the key square,
        105 in the circle zone, 26 wider (most carry a full-frame backing shape).
```

```
change(icons): icon grid from Figma 25:6154 replaces the single live-area token (D-028)

Why:    the Figma iconography page defines a full grid (padding, key square, key circle,
        stroke), not one ratio.
What:   size/icon/live-area → size/icon/grid/{padding 1/12, square 0.75, circle 5/6,
        stroke 1/16}. The grid is drawn over every icon frame in the Button anatomy and the
        Figma steps, and on the Size page at 16, 24 and 32. Spinner now follows the grid:
        ring = key square, line = frame × grid stroke (was full frame, stroke/2).
        Fixed: step 3 art showed padding hatching it shouldn't have.
Checks: every icon on the Button page rendered at 8× and measured: vector geometry 0.75 of the
        frame everywhere; painted edge incl. stroke ≤ 0.84; spinner 0.75; build passes
```

```
change(app): docs site readable at 14px minimum; only necessary information

Why:    the docs must be easy to read and say only what connects a value everywhere.
What:   no text below 14px outside specimens (labels, tables, legends, inspector, pins).
        Page headers now give Source · Figma · In code for every page. Removed: sidebar
        token counts, overview stat cards, hex labels under ramp chips (Ctrl + Alt shows
        them), the Draft chip. Overview opens with the four-step flow Source → Build → Code
        → Figma.
Checks: every text node on every docs page measured ≥ 14px (specimens excluded); build passes
```

```
feat(icons): icon live area, 75% of the frame (D-028)

Why:    icons must keep 1/8 of their frame clear on every side; some exported icons were bare
        vectors with no frame, so they filled their box and looked too big.
What:   new token size/icon/live-area = 0.75 (number.json, CSS, Tokens Studio). Every icon in
        app/public/home re-framed: square viewBox, longest side = 75%, centred. Coordinates
        untouched, so Home renders exactly as before. Button icons now show a 12px vector in
        a 16px frame at md. Size page shows the live area; anatomy marks it (dotted).
Remove: unused icon-button, language, model and openai-16 svgs.
Checks: every icon measured at 0.75 after; Home screenshot unchanged; build passes
```

```
change(inspector): token inspector only while Ctrl + Alt is held, on every page

Why:    the overlay got in the way; the owner wants it on demand, on the docs site too.
What:   Inspector moved to src/lib and mounted once in app/layout.jsx. It shows while Ctrl and
        Alt are held and hides on release or window blur. Button, panels, tables, the page,
        the sidebar, colour swatches, ramp chips, the surface ladder and type samples now
        record their tokens; primitives resolve too.
Checks: hidden at rest, shown with Ctrl + Alt, hidden on release; tested on Button, Colour
        and Home; 0 page errors
```

```
feat(button): anatomy diagram and Figma build steps on the Button page

Why:    the owner builds the button in Figma and needs to see every part to check it.
What:   Anatomy: a real Button at large zoom with every part marked (frame, icon frames,
        label, padding x, gap, height, radius), switchable by size and shape, values read
        from components/button.json. Build it in Figma: eight illustrated steps for md.
Checks: built; anatomy checked at md squircle and 2xl pill; 0 console errors
```

```
remove(home): canvas glow (Q-2 dropped); Q-3 tool names dropped
```

```
change(system): cleanup pass; components get a spec file; Home inspector back on

Why:    make the folder clean and connected end to end.
What:   components/button.json is the button's source (D-025). The build checks every token it
        references, writes docs/components/button.md, and adds it to tokens.resolved.json;
        Button.jsx and the Button page now read it, so code, docs and site cannot drift.
        Tracking table on the Typography page now comes from tokens/typography.json.
        Home: token inspector on again; Lit renamed RestGlow (it is the tiles' Figma resting
        glow, not the cursor light); inspector shows the light's blend.
        README: map, folder tree and how it connects updated. Decisions D-025, D-026, D-027.
Remove: CursorLight.jsx (unused), heyoz-design-system-v1.zip and "Claude outputs/" (stale
        copies of an older state).
Checks: npm run tokens passes (components: button); next build passes; every route renders with
        0 console errors; Button page and Home inspector screenshotted.
```

```
change(button): squircle radius = height × 3/8 at every size

Why:    md (12 on 32) has the right roundness; every size now matches it:
        7.5 · 9 · 10.5 · 12 · 15 · 18 · 21. A component rule, not a radius token.
Checks: built and screenshotted all 7 sizes
```

```
remove(app): Prompt box page

Why:    not useful yet. Components reach the app only after they are finalised together.
```

```
change(button): icon frame = label line height; hover goes border/brand

Why:    icons were too big. One frame holds [icon] [label] [icon]; the icon frame is a square as
        tall as the label's line height (12, 14, 16, 16, 18, 20, 20 for 2xs → 2xl), so icon and text
        share one height. Gap 2/4/4/4/4/6/6. Hover and pressed: border and icon → border/brand.
Checks: built and screenshotted all 7 sizes × squircle / pill / icon only, and every state
```

```
feat(app): docs split into pages, one thing per page

Why:    the single page was too long to read. Sidebar (Foundations · Components · Screens),
        overview with a tile per page, and Colour, Typography, Spacing, Radius, Size & stroke,
        Motion, Light, Button, Prompt box as their own pages, each built from the same blocks
        (src/docs/ui.jsx). Pages are listed once in src/docs/nav.js.
Checks: next build passes, all 13 routes render with no console errors, Home unchanged
```

```
change(light): light falls on everything except media (D-020)

Why:    the prompt box and the model menu items did not catch the light. One <Light> per
        screen now paints above all content with blend soft-light (light/cursor/blend),
        opacity 15% → 80% to match. Media sits above it. Tile resting glows stay as designed.
Checks: lightness rise measured per surface: background +0.026, elevated +0.067 (≈ equal %)
```

```
feat(number): size/control/2xs (20) and size/control/2xl (56)

Why:    buttons have seven sizes and follow size/control.
```

```
feat(button): secondary button, 7 sizes × squircle / pill (Draft)

Why:    padding = squircle radius; pill uses the same padding with radius/full. States use the
        secondary set: fill/secondary(-hover/-active/-disabled), border/secondary(-hover/-disabled).
```

```
feat(app): /components page; prompt box Use-brand variant and language button

What:   new route /components with Figma 693:3112 (prompt box with GPT Image
        2.0, Use brand Off/On, Enhance prompt, 2 credits) and 693:3136
        (language button "Eng"). Home screen untouched.
Fix:    button/link reset in home.css now has zero specificity, so type and
        colour classes on buttons apply (Generate, Claim, See all were
        falling back to body text).
        Home tiles renamed tile -> tile-lit to stop clashing with logo tiles.
Note:   in 693:3112 "Use brand: Off" is built unlike every other chip
        (10/6 padding, 14px regular, no inner shade). Kept as designed.
Checks: build passes; both pages rendered and reviewed; Home prompt box
        re-compared with Figma at 1920.
```

```
feat(app/home): brand picker, model picker and nav item states from Figma

What:   brand picker trigger 693:3294 (rest / hover: fill + border to
        tertiary-hover, chevron -> double chevron); brand menu + actions
        693:3226 (multi-select with checks, row actions on hover, Rename /
        Brand DNA / Delete brand in content/critical); model picker 693:3393
        (selected row fill/tertiary-hover, orange model icon, check); nav item
        693:3307 (rest fill/primary; hover fill/primary-hover + border/
        primary-hover + inner shade; active fill/primary-active +
        border/primary + inner shade).
        Menu surface: surface/tertiary + border/tertiary + inner shade, lit by
        light/cursor, with the design's four sheen blobs (content/primary 10%,
        Figma blur 75) drawn above the rows. Icons and logos exported from the
        file. tk() gained hoverBorder / hoverFx.
Mapped: Figma *-variant tokens -> base tokens (variants were removed).
Checks: build passes; menus opened, rows hovered and selected in a
        browser; 0 broken images; 0 page errors.
```

```
fix(app/home): match Figma 693:4599 exactly; inspector shows the whole stack

Why:    first build drifted from the design. Causes: placeholder icon asset
        used instead of the real swapped icons, effects left out, wrong icon
        button sizes/radii, extra showcase content added to the layout.
What:   real icons exported from the file (collapse, chevron, settings,
        tasks, plus); icon buttons 32/40/28 with their Figma radii; Go Back
        has no fill; brand picker full width; settings chips left-aligned;
        Figma effects (inner shade, inner highlight, drop shadows) applied
        from one list in tk.js and labelled "not a token" in the inspector;
        showcase chips and Use brand toggle removed (menus stay: they open
        from components in the design). Generate gradient uses
        fill/brand-hover -> fill/brand, matching the design's light top.
        Inspector now lists every layer under the cursor, top to bottom.
Checks: side-by-side with the Figma render at 1920x1080; build passes;
        0 broken images; 0 page errors.
```

```
feat(app): Home screen at /home, built only from tokens, with a token inspector

What:   Figma 693:4599 (Static Ads home) rebuilt in app/src/app/home.
        Every token is applied through tk() (app/src/lib/tk.js), which writes
        the CSS and records the same tokens on the element; hover anything to
        see them (Inspector.jsx). Values with no token (fixed widths from the
        design) are labelled "layout".
        Menus from the showcase frames: brand picker (+ Rename / Brand DNA /
        Delete), model picker, add menu (+ More tools submenu), output
        settings (+ count submenu), chip and tag states, Use brand toggle.
        Depth: background > surface/primary|secondary > surface/elevated
        (menus) > fill/elevated rest / hover / active.
        BRAND KIT and STYLE tiles use light/cursor (rests top-right, follows
        the cursor).
Not in: drop and inner shadows (D-021). Icon buttons show the design's
        placeholder circle asset; the real icons were not in the export.
Checks: next build passes; 0 broken images; 0 page errors; menus opened and
        hovered in a browser; screenshots reviewed.
```

```
feat(number, motion, figma): number and motion tokens; Tokens Studio export

What:   tokens/number.json: space 0 2 4 6 8 12 16 20 24 32 40 48 64 80 96
        (named by value), radius none-full, size/control and size/icon xs-xl,
        size/target 44, stroke 1 and 2.
        tokens/motion.json: duration fast 120 / base 200 / slow 320 ms,
        easing standard / enter / exit. light/cursor fade now references
        duration/base.
        figma/tokens-studio.json (generated): 431 tokens in five sets and
        themes -> Figma collections Primitives, Color (Dark), Number,
        Typography (80 text styles), Effect. Primitive descriptions carry
        the OKLCH value and the step's job.
Checks: build validates grids, growth order, target >= 44, and that every
        reference in the Tokens Studio file resolves (0 broken).

docs(cleanup): one clean decisions page, principles removed

What:   docs/01-principles.md deleted (parked, never approved).
        decisions.md rewritten: In force / Open / History. IDs unchanged.
        New: D-019 naming, D-020 cursor light, D-021 not tokenised,
        D-022 number scales, D-023 Tokens Studio, D-024 order of truth.
        README: new map, folder tree, Figma steps; principles links removed.
```

```
feat(light): cursor light dims over media

Why:    owner: the user should feel a shift when the cursor enters media.
What:   light/cursor gains mediaOpacity 0.05 (1/3 of 0.15) and fade 200ms.
        Over [data-media] the glow keeps tracking, stays behind the media
        and fades to 5%. New vars --light-cursor-media-opacity, -fade.
Checks: build fails if mediaOpacity is not lower than opacity.
```

```
change(color): steps 1-8 rise by an even +0.035 L

Why:    owner picked the +0.035 ladder (2nd option on the comparison grid).
What:   lightness 1-8: 0.12 0.155 0.19 0.225 0.26 0.295 0.33 0.365
        (was 0.12 0.18 0.24 0.28 0.32 0.36 0.42 0.50). Steps 9-12 unchanged.
        Applies to every ramp, so surfaces, tints and borders all step evenly.
Effect: background -> elevated is now +0.035 per level; borders are quieter.
```

```
change(light): cursor light passes behind media instead of switching off

Why:    owner: keep tracking, let media cover the glow.
How:    the glow is the lit surface's ::before (isolation: isolate; z-index: -1),
        so it paints above the surface fill and below every child. No media
        detection, no extra DOM.
```

```
remove(repo): delete files the new system replaced

What:   app/src/tokens/colors.resolved.json (now tokens.resolved.json),
        tokens/colors-dark.tokens.json (archived working copy),
        scripts/migrate-figma-to-oklch.py (migration no longer applies).
```

```
change(color)!: one 12-step scale for every colour, primitives named by hue

Why:    the neutral rebuild named steps by lightness while colour ramps
        counted the other way. Owner: no inconsistencies, follow a standard.
What:   modelled on Radix Colors (dark). Ramps: gray, orange, green, amber,
        red, blue, plus white. Every ramp has steps 1-12 with the same
        lightness and the same job:
          1-2 app backgrounds · 3-5 component bg (rest, hover, active)
          6-8 borders · 9 solid · 10 solid hover · 11-12 text
        Primitives are generated from a recipe in tokens/colors.json, not
        hand-picked. Orange 9 = #FF3D01 exactly (the build fails otherwise).
        Status ramps take the most chroma their hue can reach at step 9.
        Opacity primitives removed; every state is a step.
Rules:  surfaces gray 1-5 · neutral fills rest/+1/+2, disabled -1 ·
        solid colour 9 / hover 10 / active 8 · tinted fills 3/4/5, disabled 2 ·
        border/X = surface/X + 2 · text gray 12 / 11 / 9, disabled 8 ·
        colour text 10 / hover 11 / active 9 / disabled 7.
Removed: surface/*-flat (5): identical to the tinted surfaces now.
Renamed primitives: brand -> orange, error -> red, info -> blue,
        success -> green, warning -> amber, neutral -> gray.
Counts: 6 ramps x 12 + white = 73 primitives, 161 semantic.
Checks: build passes its own rules (12 steps, rising lightness, hue names,
        brand anchor, every reference exists, no duplicate variables);
        298 CSS variables, 0 unresolved; screenshot reviewed.

feat(type): 80-style type scale

What:   tokens/typography.json. display / heading (Bricolage Grotesque),
        body / label (Geist) x xs-xl x regular 400, medium 500,
        semibold 600, bold 700. Body md = 14px, sm = 12px.
        Line heights on the 4px grid (2px half-step allowed).
        Tracking by size: <=12 +0.01em · <=18 0 · <=28 -0.01em ·
        <=40 -0.02em · larger -0.03em. Bricolage optical size follows size.
Output: --type-{role}-{size}-size|line-height|tracking, --font-{role},
        --font-weight-{weight}, classes .type-{role}-{size}-{weight},
        docs/tokens-typography.md. Demo page now uses these for all text.
Checks: build fails on a missing cell, a size that does not grow, or a
        line height off the grid; screenshot reviewed.
```

```
change(color): rebuild the neutral scale on one hue and an even 0.02 L grid

Why:    owner asked for a clean neutral scale now. Hue wobbled 39-70 and
        steps were hand-picked one-offs (102, 103, 105, 107, 115, 117).
What:   neutral = oklch(L 0.004 55). Steps sit on a 0.02 lightness grid and
        are named by lightness x 100 (neutral/24 = L 0.24). Only referenced
        steps exist: 12 18 24 26 28 30 32 34 36 38 48 66 74 80 92 94 98 white.
        Mapping old -> new:
          150->12 130->18 120->24 117->26 115->28 110->30 107->32 105->34
          103->36 102->36 100->38 90->48 70->66 60->74 50->80 30->92
          20->94 10->98
        103 and 102 merged (0.015 L apart, under one grid step), so
        border/tertiary = border/secondary-hover.
Effect: max colour shift dE2000 1.08 (neutral/28), all others under 1.
        Fills still share surface steps, as decided.
Checks: token build passes (54 solid, 43 opacity, 166 semantic);
        0 unresolved CSS variables; demo screenshot reviewed.
Note:   names now mean lightness. Old neutral/30 (L 0.911) is not new
        neutral/30 (L 0.30). The Figma export snapshot still uses old names.
        scripts/migrate-figma-to-oklch.py reproduces the pre-cleanup state only.
```

```
fix(light): cursor light size 73 -> 75

Why:    owner confirmed the glow is 75 x 75 and follows the cursor (closes the
        "fixed corner glow?" question).
Checks: token build passes; --light-cursor-size is 75px.
```

```
feat(light): light/cursor token and demo

Why:    D-014. Values from Figma node 693:3121.
Adds:   tokens/light.json (source), --light-cursor-* CSS variables,
        docs/tokens-light.md (generated), demo section with live cursor light.
Checks: build validates the fill reference; values match the Figma SVG export
        (#EFEDEC, opacity 0.15, r 36.5, stdDeviation 37.5).
```

```
remove(color): spectrum-purple/50 and content/link-visited

Why:    D-015. No purple in HeyOz.
Checks: tokens rebuilt; no remaining reference.
```

```
docs(demo): surface ladder proposals side by side

Why:    owner thinks the surface steps are too big. Preview only, no token changed.
```

```
remove(color): chart palette

Why:    D-012. HeyOz has no charts; the 5 chart tokens were unused.
Removes: chart/1–5, and primitives spectrum-purple/70, spectrum-blue/60,
        spectrum-teal/40, spectrum-yellow/30. spectrum-purple/50 kept
        (used by content/link-visited). Chart section removed from the demo.
Checks: tokens rebuilt; no remaining reference to a removed token.
```

```
docs(decisions): canvas glow will be a token (D-013); Q-3 parked

Why:    owner's call. Glow values pending the Figma component.
```

## 2026-11-03

```
feat(color): OKLCH token source, token build and colour demo page

Why:    one source of truth in OKLCH; CSS, docs and the demo are generated from it.
Adds:   tokens/colors.json (source), app/scripts/build-tokens.mjs (build),
        app/ Next.js page, docs/tokens-color.md (generated reference),
        scripts/migrate-figma-to-oklch.py (one-off migration, kept for audit).
Fix:    fill/selected-hover, -active, -disabled were left behind when
        fill/selected was removed. Now gone. 175 -> 172 semantic tokens.
Checks: 60 solid primitives round-trip to the exact Figma hex (0 errors);
        every semantic token matches the Figma export's hex, alias and alpha
        (0 mismatches); 0 unresolved CSS variables in the browser;
        page screenshot reviewed.
Note:   values are unchanged from Figma. Only the colour space changed.
```

```
docs(readme): set the order of truth for agents

Why:    owner's screenshots outrank the docs; the codebase carries no authority.
```

```
remove(effects): drop fill/inner-shadow (neutral, brand) and all 9 gradient tokens

Why:    effects and gradients are designed separately in Figma, not tokenised here.
Scope:  tokens/colors-dark.tokens.json, 186 -> 175.
Todo:   delete the variables in Figma.
```

```
remove(effects): drop the elevation group (overlay dimness/blur, drop shadows)

Why:    not used; effects will be designed separately in Figma.
Scope:  tokens/colors-dark.tokens.json, 192 -> 186.
Todo:   delete the variables in Figma.
```

```
remove(color): drop surface/overlay

Why:    identical to surface/elevated (neutral/105) and never used for real
        overlays. Modals use surface/secondary on a dimmed, blurred backdrop
        (backdrop handled in Figma by design).
Scope:  tokens/colors-dark.tokens.json, 193 -> 192. Ladder is now 5 surfaces:
        background, primary, secondary, tertiary, elevated.
Checks: 0 references to surface/overlay remain.
Todo:   delete the variable in Figma.
```

```
remove(color): drop fill/selected, all -variant tokens, content/placeholder

Why:    duplicates. Every -variant equalled its base; fill/selected equalled
        fill/brand-secondary; content/placeholder equalled content/secondary.
Scope:  17 tokens removed from tokens/colors-dark.tokens.json (210 -> 193).
        Original Figma export left untouched as reference.
Checks: scripted removal; 0 remaining references to removed tokens.
Todo:   delete the same variables in Figma.
```

```
docs(system): add README, principles, decisions and changelog

Why:    the system needs a single front door, and rules to trace every
        later decision back to, before any tokens are cut.
Checks: read through for plain language and consistent page shape;
        principle order reviewed for tie-breaks.
```
