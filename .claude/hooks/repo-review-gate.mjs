#!/usr/bin/env node
// Stop hook: before Claude finishes a reply, make sure the repository was reviewed after it changed.
//
// - Looks for files in the repository modified since the last review (.claude/.last-review).
// - If there are any, it blocks the stop once and tells Claude to run the repo-sync-reviewer agent
//   and fix what it confirms. When Claude then stops again (stop_hook_active is true), the review is
//   taken as done: the timestamp moves forward and the stop goes through, so it never loops.
// - The very first run only creates the timestamp.
// Skipped: dependencies and builds, tool state (.claude, .vercel, test screenshots), the archive, the old Figma
// export and the generated icons. A deleted file counts: it changes its folder's date.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const STAMP = path.join(ROOT, '.claude', '.last-review');
const SKIP_ANYWHERE = new Set(['node_modules', '.next', '.git']); // dependencies and builds, at any depth
const SKIP_PATHS = ['.vercel', '.claude', '.playwright-mcp', 'archive', 'current-figma-tokens-11.03.2026', 'app/public/icons'] // tool state, reference copies, generated icons
  .map((p) => path.join(ROOT, ...p.split('/')));

let input = {};
try { input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { input = {}; }

const touchStamp = () => { fs.mkdirSync(path.dirname(STAMP), { recursive: true }); fs.writeFileSync(STAMP, new Date().toISOString() + '\n'); };

if (!fs.existsSync(STAMP)) { touchStamp(); process.exit(0); }
if (input.stop_hook_active) { touchStamp(); process.exit(0); } // the review was asked for in this reply: let it finish

const since = fs.statSync(STAMP).mtimeMs;
const changed = [];
const walk = (dir) => {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_ANYWHERE.has(e.name) || e.name.startsWith('.next-') || SKIP_PATHS.includes(p)) continue;
      // Adding, removing or renaming a file updates its folder's date, so a reply that only deletes still counts.
      try { if (fs.statSync(p).mtimeMs > since) changed.push(path.relative(ROOT, p).split(path.sep).join('/') + '/ (a file was added, removed or renamed)'); } catch {}
      walk(p);
    } else if (e.isFile()) {
      try { if (fs.statSync(p).mtimeMs > since) changed.push(path.relative(ROOT, p).split(path.sep).join('/')); } catch {}
    }
  }
};
walk(ROOT);

if (!changed.length) process.exit(0);

const list = changed.slice(0, 15).map((f) => '- ' + f).join('\n') + (changed.length > 15 ? `\n- …and ${changed.length - 15} more` : '');
process.stdout.write(JSON.stringify({
  decision: 'block',
  reason:
    `Repository files changed in this reply:\n${list}\n\n` +
    'Before finishing: run the repo-sync-reviewer agent (Agent tool, subagent_type "repo-sync-reviewer") and give it this list and what the change was for. ' +
    'Fix every finding it confirms (decisions, specs, generated docs via npm run tokens, site pages, README, changelog), re-check, deploy as usual, then finish your reply with what the review found.',
}));
process.exit(0);
