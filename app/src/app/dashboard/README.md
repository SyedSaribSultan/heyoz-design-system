# Oz dashboard (`/dashboard`)

Home, agent version: a prototype with sample data. The rules it follows are in [D-039](../../../../docs/decisions.md). This file holds what a developer needs beyond them: the demo states and where each block's data would come from.

## The five states (demo switcher, keys 1–5)

| State | Leads with | Oz suggests |
|---|---|---|
| New | What Oz does · what's working in ads | Set up my brand from my website |
| Knows brand | Ideas for you · what's working · competitors | Make my first 5 ads |
| Ads ready | Your ads · ideas | Test my ads for 7 days |
| Ads live | How your ads are doing · your ads | Put more money on the winner |
| Next day | Since yesterday · your ads · what's working | Make 5 more like the winner |

In production, the state is worked out from data (does a brand exist? do ads exist? is a campaign live?). It is never asked.

## Where each block's data comes from

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

Biggest risks: Meta Marketing API approval and spend permissions; the "why it works" line being wrong.
Ship order: research + ideas + make (no ad account needed) → test and results.

## Files

- `page.jsx`: the route and its metadata.
- `Dashboard.jsx`: the page and Oz's logic.
- `data.js`: the sample data.
- `dashboard.css`: layout, written in tokens only.
