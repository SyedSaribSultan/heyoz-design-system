# Oz dashboard (`/dashboard`)

Home, agent version. A prompt box in the middle (that's Oz), the one next move Oz suggests under it,
then everything Oz knows, in plain words. Prototype with sample data.

## What changed
feat(dashboard): add /dashboard, the agent home, built from existing tokens and components

Why: the CEO wants the whole ad engine (research → x-ray → ideas → make → test) in one page
anyone can use. The engine stays invisible. The page shows outcomes and one decision at a time.
Reuses: HomeSideNav + APP_NAV (unchanged, nothing removed), tk(), Button, Segmented, Home's top nav,
prompt-box anatomy (surface/secondary, border/brand-secondary, radius/3xl, gradient brand button).
No foundation files touched: tokens, components, sidenav data, Home are unchanged.

## Rules the page follows
- One orange fill: **Ask Oz**. Every yes is a white primary button.
- Thinking is free and automatic. Credits, money and brand changes need a yes (shown as cost pills).
- One picture, one sentence, one button per card. One number per stat tile.
- No jargon on screen: "people who tried your app", "cost of each one", "running 214 days".
- Sections appear only when they have something in them, ordered by what matters most right now.

## The five states (demo switcher, keys 1–5)
| State | Leads with | Oz suggests |
|---|---|---|
| New | What Oz does · what's working in ads | Set up my brand from my website |
| Knows brand | Ideas for you · what's working · competitors | Make my first 5 ads |
| Ads ready | Your ads · ideas | Test my ads for 7 days |
| Ads live | How your ads are doing · your ads | Put more money on the winner |
| Next day | Since yesterday · your ads · what's working | Make 5 more like the winner |
In production the state is worked out from data (brand exists? ads exist? campaign live?), never asked.

## Where each block's data comes from (feasibility)
| Block | Source | Status |
|---|---|---|
| Brand facts | Website crawl → Brand DNA, Products | Exists (Brand DNA) |
| Competitors, ads running | Meta Ad Library API (ads_archive: page, start date, active) | Public API |
| "Running N days" | ad_delivery_start_time vs today | Public API |
| TikTok ads | TikTok Creative Center top ads | Scrape / partner |
| "Why it works" line | LLM over the ad (hook, format, claim) | New, cheap |
| Ideas, ranked | LLM: competitor angles × brand fit → Playbook | New, builds on Playbook |
| Make ads | Existing image/video generation + Brand Kit | Exists |
| Test, results, budget moves | Meta Marketing API (needs ad-account OAuth + ads_management) | New, biggest lift |
| Prompt routing | LLM intent → one of: setup, make, test, scale, more, explain | New |

Biggest risks: Meta Marketing API approval and spend permissions; "why it works" being wrong.
Ship order: research + ideas + make (no ad account needed) → test and results.

## Files
- `page.jsx` route + metadata · `Dashboard.jsx` the page and Oz logic · `data.js` sample data · `dashboard.css` layout
