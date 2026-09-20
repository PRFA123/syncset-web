# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing site for SyncSet (workflow-automation agency, Australia). Astro 6, `output: 'server'` with the
`@astrojs/cloudflare` adapter; deployed to Cloudflare Pages. Every page is server-rendered on each request
by default now (no page sets `prerender = true`) — this changed from the original `output: 'static'` when a
deploy-config fix from origin was merged in (see the `80307cd` merge commit); nothing in this repo has
re-added `prerender = true` since, so treat that as the current, intentional state, not an oversight.

The primary conversion path is the **"Diagnostic de Automação"** — a conversational chat (`#diagnostic`,
`DiagnosticChat.astro`) that posts to `/api/diagnostic.ts`. **Cal.com and `/book/` were removed entirely**
(commit `374c69f`, 2026-09-19) — this was a deliberate founder decision, not scope drift: a solo founder
with no team can't absorb an open booking calendar pre-qualification, and the interactive
form/chatbot was always meant to be the priority over a booked call. If a prospect wants a video call, they
request it by email — there is no booking UI on the site anymore. Google Business Profile still lists a
phone number and WhatsApp as of 2026-09-20; the founder has not decided whether to keep those.
The secondary path is the short contact form (`ContactForm.astro`, `#contact`, "quick message, no
diagnostic").

## Commands

```bash
npm run dev                 # astro dev on :4321 (port often taken — use `npx astro dev --port 4330`)
npm run build               # astro build → dist/ (server-rendered via dist/_worker.js, output: 'server')
npx astro check             # type-check .astro/.ts (needs @astrojs/check, installed as devDependency)
npx wrangler pages dev ./dist --port 8788 --compatibility-date=2026-09-11   # run the real Workers runtime
```

There is no test suite. `.claude/hooks/stop.sh` runs `npm run build` at the end of every turn and blocks
the turn if it fails — keep the build green before stopping.

To exercise `/api/lead` end-to-end, `.dev.vars` (gitignored) must contain `MAKE_WEBHOOK_URL`; a real POST
under `wrangler pages dev` reaches the `lead-intake-v1` Make scenario, so use obviously-fake probe data.
`/api/diagnostic` needs `DIAGNOSTIC_WEBHOOK_URL`, `ANTHROPIC_API_KEY`, and a `DIAGNOSTIC_KV` namespace
binding (see Architecture below) — `wrangler pages dev` needs the KV binding passed explicitly since there's
no committed `wrangler.jsonc` (`--kv=DIAGNOSTIC_KV`), and a fake `ANTHROPIC_API_KEY` will 500 past the cap
check but exercise everything up to the real API call.
**Known environment issue on this machine (2026-09-20, unrelated to app code):** `wrangler pages dev` fails
to start with `Uncaught Error: No such module ".../middleware-insertion-facade.js"` — reproduced from a
clean `.wrangler/tmp`, so it's not a stale-cache issue. `npx astro dev` (Miniflare-backed) works fine and
exercises everything except real KV/binding behaviour. If you need the real Workers runtime and hit this,
it's a pre-existing wrangler/Windows issue, not something your change broke — try a wrangler upgrade before
assuming your code is wrong.

## Architecture

- `src/styles/tokens.css` is the **single source of design tokens** (colours, type scale, spacing, motion) and
  also carries the base reset the hand-written CSS depends on. Do not add a second token system or a CSS
  framework (Tailwind was removed on purpose — zero utility classes were ever used).
- `src/styles/v28.css` implements the approved "V28" visual direction (dark forest-green/steel-blue theme,
  `.frame`/`.frame--glow` cards, `.btn`, section headers, benchmark dashboard, compass plate, animated flow
  diagram, connector marquee). Page-specific layout lives in `<style>` blocks inside each `.astro` page.
  `docs/DESIGN.md` describes the *previous* light theme and is out of date; `tokens.css` is authoritative.
  **Known duplicate-CSS landmine (not yet cleaned up, do not touch until the site is fully live):**
  a global `v28.css` selector and a same-named selector scoped inside `index.astro`'s own `<style>` block
  both exist for the same class, and Astro's scoped-attribute selector wins by specificity regardless of
  source order — so the `v28.css` copy silently does nothing. Confirmed instances as of 2026-09-18:
  - `.how-it-works` — dead: `index.astro:859` (`padding: var(--space-32)…`), `v28.css:937`. Live:
    `index.astro:1074` (`padding: var(--space-16)…`).
  - `.pricing` — same pattern: dead `index.astro:910` + `v28.css:1015`, live `index.astro:1077`.
  - `.how-it-works__title` — dead: `v28.css:946` (`font-weight: 600`). Live: `index.astro:869`
    (`font-weight: 700`).
  These currently compute correct/consistent values by accident of source order — this is the same class
  of bug that caused the real regression fixed in commit `616020b` (a duplicate `.how-it-works__steps` gap
  rule). Planned cleanup: delete the dead declarations once the site is 100% published, so a future edit to
  the "obvious" file (`v28.css`) doesn't silently do nothing.
- `src/layouts/BaseLayout.astro` owns `<head>`: absolute canonical/OG URLs derived from `Astro.site`,
  Google Fonts (Instrument Sans + JetBrains Mono), and a `schema` slot for per-page JSON-LD.
  `src/lib/schema.ts` builds the Organization/LocalBusiness/WebSite graph used on the home page.
- `src/pages/api/lead.ts` and `src/pages/api/diagnostic.ts` are the two server routes (both
  `prerender = false`). Secrets come from **`import { env } from 'cloudflare:workers'`** (typed via the
  module augmentation in `src/env.d.ts`), never `Astro.locals.runtime.env` and never `process.env`.
  `locals.runtime.env` was the correct pattern under Astro 5 but **Astro 6 removed it — the getter now
  throws instead of returning `undefined`**, which silently 500'd every real submission on both endpoints
  in production until commit `810b6ea` caught it via `wrangler tail` and fixed both files. If you see
  `locals.runtime` anywhere, it's stale/wrong — do not copy that pattern into new code.
  Each endpoint validates content type, body size and field lengths, checks the honeypot and a
  render-timestamp server-side (bots get a fake 200). `lead.ts` forwards straight to the `lead-intake-v1`
  Make webhook, unchanged.
  `diagnostic.ts` (rewritten 2026-09-20, resolving the Council item below) now calls the Anthropic API
  **directly** — `POST https://api.anthropic.com/v1/messages` with `ANTHROPIC_API_KEY`, model
  `claude-haiku-4-5-20251001`, a forced tool call (`submit_diagnostic_report`) so the response is
  structured JSON, never free text to parse. The score and `estimated_revenue_aud` are computed **in code**
  (`missed_enquiries_2wk × 0.3 × avg_deal_value_aud`, thresholds in `scoreFromRevenue()`) — never trust an
  LLM to do the arithmetic; Claude only writes the qualitative summary + 2-3 recommendations, grounded in
  the already-computed numbers so it can't contradict them. The report is returned to the browser
  immediately (`DiagnosticChat.astro`'s `renderReport()` shows it inline, no more "check your email"), and
  the full payload — original answers **plus** the computed `report` object — is still forwarded to the
  `diagnostic-audit-v1` Make webhook afterwards for the CRM row, Telegram ping, and a backup copy emailed to
  the lead. **The Make scenario must stop calling Claude itself** — it now receives the finished `report`
  (`score`, `estimated_revenue_aud`, `summary`, `recommendations`, `show_booking_cta`) in the payload; if it
  still calls Claude too, every submission bills twice. A Make/CRM failure never throws away the report the
  visitor already has — it's logged and the request still returns 200 with the report.
  Two enforcement layers before the paid API call: the pre-existing in-memory per-IP rate limit (5/hour,
  not distributed, first line of defence only) and a **global monthly spend cap** (`MONTHLY_DIAGNOSTIC_CAP
  = 200`, enforced via the `DIAGNOSTIC_KV` binding, fails closed if the KV read/write itself errors — see
  `agents/BUDGET.md` in the Agent Studio repo for why 200 and how to change it). `DIAGNOSTIC_KV` is a
  **separate KV namespace Paulo needs to create and bind** in the Cloudflare Pages dashboard — it is not
  the adapter's auto-provisioned `SESSION` KV (reusing that risked colliding with Astro's own session key
  namespace, not worth the ambiguity).
  This was a Council-reviewed change (`memory/COUNCIL.md`, session "2026-09-20 (retroativa)", Agent Studio
  repo) — the original brief always wanted the report shown immediately; a prior session silently switched
  it to email-only, which is now fixed rather than left as an open question.
- `src/components/ContactForm.astro` and `src/components/DiagnosticChat.astro` are the client halves of
  those two flows: both must send `company_website` (empty) and `form_ts` (captured on load, not on
  submit — a real bug fixed in `c838757`) with the payload, otherwise the server treats the submission as
  a bot.
- Internal links use the trailing-slash form (`/privacy/`, `/terms/`) because Cloudflare Pages serves
  `privacy/index.html` and 308-redirects the bare path. There is no `/book/` anymore — it was deleted along
  with Cal.com (commit `374c69f`); don't re-add a link to it.
- SVG animations in `index.astro` are SMIL (`<animateMotion>`); CSS cannot pause them, so the inline script
  at the bottom of `index.astro` pauses every `<svg>` under `prefers-reduced-motion`.
- `public/` is copied verbatim to `dist/`. `public/logos/*.svg` are generated by `get-logos.ps1`
  (Simple Icons, brand colour baked in).

## Repo notes

- `audit/` holds the production-readiness audit reports (`00-baseline.md`, `01-findings.md`, …) and
  Lighthouse JSON baselines; `audit/_*.log` files are scratch and untracked.
- `brand/` is a separate brand/strategy workspace (with its own `.claude/`) checked into this repo; it is
  not part of the site build.
- Line endings: the tree is LF; Git on this Windows machine warns about CRLF conversion. Commit with
  `git -c core.safecrlf=false commit …` to silence it.

## Token discipline (apply to every task in this repo)

- Batch verification: run build/typecheck/console-check once at the end of a group of
  related edits, not after every single file change, unless the task is animation/
  geometry/interactive logic where per-step verification already caught real bugs
  (e.g. the item 05 border-beam work) — for that category, keep verifying per step.
- Screenshot only when a change affects layout, spacing, visual geometry, or
  animation. Pure text/copy swaps of equal-or-shorter length never need one — say so
  instead of taking one.
- For exact, pre-specified string replacements, use sed/grep directly instead of
  re-reading and re-reasoning over the whole file.
- Keep end-of-task reports short: what changed, what was verified, what's pending. No
  restating full diffs already visible in the edit tool output.
- Never publish a numeric/timing/performance claim in site copy unless it's both (a)
  an approved figure in the project's honest-placeholders reference and (b) actually
  measurable from something in this codebase or confirmed externally. If in doubt,
  stop and ask rather than publish.
- Never treat a quote or "validated in real conversation" line in any reference doc
  as ground truth without checking — this project has already found fabricated
  content presented as verbatim customer language more than once this session.
