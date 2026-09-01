# Brief: extend the Payload Components template showcases

You are picking up a mature, shipped feature. Read this whole brief before touching anything, then read `AGENTS.md` at the repo root — it is the single source of truth for repo conventions.

## Where things stand (verified at dev `093eb594`, PR #491)

- `/templates` ships **10 full-site "Concept preview" showcases**, 5 pages each = **50 preview pages**, all live in production.
- The catalog has **74 installable components**; **41 block slugs** are admitted into template recipes.
- Assets: **60 posters**, **100 darwin + 100 linux** visual baselines.
- Existing concepts (do not restyle these without being asked):
  `saas-launch` (Relay), `agency-studio` (Northline), `commerce-brand` (Fieldnote),
  `event-conference` (Frameworks '26), `fintech-trust` (Ledgerline), `portfolio-solo` (Ilse Renko),
  `nonprofit-cause` (Rivermouth Trust), `education-course` (Northfield School),
  `healthcare-clinic` (Alder Practice), `trade-service` (Halloran & Sons).

## Your task (pick what the user asked for)

**A. More concepts (the proven path).** Add N new verticals. Choose for *uncovered register and information architecture*, not just a new palette — that is the bar. Already covered: product SaaS, editorial agency, DTC commerce, dark event, institutional fintech, minimal portfolio, give/volunteer nonprofit, syllabus education, calm healthcare, plain trade. Genuinely uncovered ideas: restaurant/hospitality (menu + reservation IA), real estate (listing IA), music/artist (tour dates), B2B marketplace (two-sided), government/civic (plain-language compliance), membership/community.

**B. More pages inside existing concepts.** The 5-page shape is currently frozen per concept. Adding a 6th page means updating that concept's `pages[]`, `navigation[]`, capturing a new poster, and minting 2 new baselines per platform.

**C. More components.** Follow `payload-components/templates/component-template/README.md` — that is the canonical add-a-component workflow. A new block must land source + manifest + `registry.json` + docs page + demo twin + tests together, and be added to `TemplateSectionContentMap` before a template can use it.

## The contract (read these files first)

| What | Where |
|---|---|
| Concept definitions (pure serializable data) | `src/lib/templates/<slug>.ts` |
| Types + admitted block slugs | `src/lib/templates/types.ts` (`TemplateSectionContentMap`) |
| Registry + route helpers | `src/lib/templates/registry.ts` |
| Shell + scoped theme per concept | `src/components/site/templates/<slug>/{Shell.tsx,theme.css}` |
| Shell registration | `src/components/site/templates/shells.ts` |
| Content shapes for every block | `src/lib/demo-content.ts` |
| Demo twins (NEVER edit) | `src/components/site/demos/` |
| Category labels + gallery copy | `src/lib/site.ts` (`templateCategoryLabels`, `templates*`) |
| Poster capture tool | `tools/templates/capture.ts` (`pnpm templates:capture`) |
| Tests | `tests/int/template-showcases.int.spec.ts`, `tests/e2e/templates{,-visual,-a11y}.e2e.spec.ts` |

`TemplateSection` is a discriminated union: `componentSlug` narrows `content` to that twin's type, so a mismatched recipe fails at the definition file rather than at render time. Sections render through existing demo twins — the concepts can never drift from what actually installs.

## Proven workflow (use it; it has shipped 10 concepts)

1. **Wave 0 — freeze the contract yourself, solo, and commit it.** Extend `TemplateCategory` + `templateCategoryLabels`; write skeleton definitions with the full 5-page recipe over existing twins (catalog-default content is fine as a placeholder, but mark it clearly and never ship it); scaffold `Shell.tsx` + `theme.css`; register in `shells.ts` and `registry.ts`; add `public/templates/<slug>/PROVENANCE.md`. Verify `tsc`, `lint`, and the int specs — the only acceptable failures are the "generated poster" assertions for the new slugs. **Commit before spawning anyone.** Agents get cut from `main` by default, so tell each one: *"run `git log --oneline -3`; if you do not see commit `<SHA>`, run `git reset --hard <SHA>`"*.
2. **Wave 1 — one art-direction agent per concept, in parallel, in isolated worktrees.** Each owns ONLY its own `src/lib/templates/<slug>.ts`, `src/components/site/templates/<slug>/**`, and `public/templates/<slug>/PROVENANCE.md`. Give each a distinct dev port. Everything shared is yours alone.
3. **Wave 2 — you integrate.** Cherry-pick each commit, verify, capture posters, mint baselines both platforms, run the full gate, PR to `dev`, merge, then promote.

## Non-negotiable contracts (bake these into every agent brief)

- **Scoped themes.** Every rule under `[data-template-theme='<slug>']`. Never touch `:root`, `.dark`, `globals.css`, or a sibling concept's scope. The site is forced-light; dark bands come from the concept's own named tokens.
- **No literal currency.** An e2e guard scans `/\$\d/` on preview surfaces. This is a *design* constraint that produces better work — Rivermouth prices giving in "metres fenced", Halloran says "no callout fee, fixed first-hour rate", Northfield's pricing-card figure slot carries scope ("Six modules") not price.
- **Banned copy:** `payload-components add`, "waitlist", "coming soon", "download" on any concept surface.
- **Reduced motion = finished frame.** Use `useReducedMotion()` AND a CSS `@media (prefers-reduced-motion: reduce)` net. **Never branch JSX on `useReducedMotion()`** — it is always false during SSR, so that is a hydration mismatch. Branch the *transition* instead.
- **Transform-only entrances on chrome containing a filled CTA.** An opacity fade alpha-composites the button toward the page background and axe catches it as a transient AA failure.
- **Mobile menu contract, asserted by e2e:** trigger is a `<button>` whose accessible name matches `/menu|navigation/i`, carrying `aria-expanded` and `aria-controls` pointing at the menu; Escape closes it AND returns focus to the trigger.
- **Fiction safety.** Invent everything. Never fabricate a registration number, regulator, accreditation body, university affiliation, insurer, licence, or trade association. Use reserved `.example` domains and obviously-fictional phone ranges. Healthcare additionally: nothing that reads as medical advice, no clinical outcome statistics, emergency guidance stays generic.

## Traps that have each cost an agent real time

- **`bg-background/85` inner panels assume a white page** — they dissolve on any tinted/dark background. Remap to a named surface token inside your scope.
- **`> [aria-hidden] > div:first-child` does not match `hero-aurora`** — its twin's first child is a `<style>`. Use `> div`.
- **Tailwind v4 compiles `translate-*` to the `translate` property, not `transform`** — `transform: none` is inert; zero `--tw-translate-y` instead. Needed to pin hover-revealed content (`team-grid` hides roles behind hover, losing them in static captures).
- **`whileInView` never fires inside its own `overflow:hidden` mask** — put the trigger on the unclipped wrapper, drive the masked child via variants.
- **`stats-proof`/`content-quote` take an optional `logoLabel`** (PR #360). If a concept uses them and omits it, the proof band renders with no attribution lockup. Set it from the concept's own fiction, or deliberately omit it and say why.
- **axe cannot police text over a gradient** — it scores those `incomplete`, never `violation`. "axe passed" does NOT cover hero letterbox/aurora plates. Measure painted pixels for those.
- **`getComputedStyle().color` returns `oklch()`/`lab()` verbatim** in Chromium — naive regex parsing yields ~1:1 garbage. Convert by painting through a 1×1 canvas.
- **`scroll-behavior: smooth` on `html` defeats normal-motion capture walks**, leaving below-fold sections at `opacity: 0` and producing blank bands that look exactly like a design bug. It is `auto` under reduced motion, so the poster tool and baselines are safe — this only bites ad-hoc normal-motion rigs.
- **Playwright scripts must import from `@playwright/test`** (`playwright` is not a direct dep) and must live inside the worktree — Node resolves ESM from the script's location. **Namespace capture output per agent**; the scratchpad is shared and agents have overwritten each other's screenshots.

## Commands

```bash
pnpm install && pnpm source:build        # fresh worktree: source:build or tsc fails on missing .source/
pnpm exec tsc --noEmit && pnpm lint
pnpm exec vitest run tests/int/template-showcases.int.spec.ts tests/int/demo-twins.int.spec.ts tests/int/visual-standards.int.spec.ts

# Posters (needs a running server; JPEG, <=250 KB budget, exit pill auto-hidden)
pnpm templates:capture --base-url=http://localhost:3000

# Visual baselines — MUST be production mode. Dev mode crashes the Turbopack
# server (ERR_CONNECTION_REFUSED) at this route count.
pnpm build:e2e && PLAYWRIGHT_SERVER_MODE=production pnpm test:e2e templates-visual --update-snapshots

# Linux baselines: dispatch the workflow, then merge the PR it opens
gh workflow run visual-baselines.yml --ref <branch> -f spec="templates-visual"

pnpm test:release                        # the full gate; production-mode e2e
```

## Shipping

Branch off `dev` (never `main`), PR into `dev`. Protection reports `BLOCKED` on a green gate by design — merge with `--squash --admin`. For `dev → main`, a plain merge genuinely conflicts (squash-promote divergence); build a snapshot whose **tree is identical to dev** with both branches as parents:

```bash
git commit-tree $(git rev-parse origin/dev^{tree}) -p origin/dev -p origin/main -m "…"
```

Verify it diffs to zero against `dev` before opening. Production deploys via Vercel and can lag or fail on a build rate limit after a busy day — verify live routes rather than assuming.

## Rules of engagement

- **Rebase onto `dev` before every push.** Dev moves fast and has twice invalidated in-flight assumptions (a twin gained `logoLabel`; `globals.css` changed). After rebasing, re-run `templates-visual` — if it shifts, understand *why* before re-minting. Re-minting over a real regression freezes the bug.
- **Verify, don't assume.** Read the posters and at least one full-page baseline. Check live routes with curl. If a test fails, prove whether it is yours by reproducing on a clean `origin/dev` checkout.
- **Report honestly.** If something is blocked, environmental, or pre-existing, say so plainly and name the evidence.

## Known open items (not yours unless asked)

- `main` is usually behind `dev`; promotes are periodic.
- ~69 stale remote branches remain whose merge state can't be proven from content (all have PRs). Clearing them needs human judgement about abandoned work.
- Historical: `blog-visual`'s `blog-index` snapshots have been flaky in a way consistent with date-dependent rendering.
