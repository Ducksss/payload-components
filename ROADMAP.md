# Payload Kits — MVP → Launch Roadmap

> Working roadmap for getting Payload Kits from "strong pitch, thin catalog" to a
> measurable public launch. The ordering matters more than the dates: **capture
> first → credible catalog + an install you can trust → launch → build on demand.**

## Where we are

Payload Kits is an MIT-licensed, shadcn-style registry + CLI that installs Payload
CMS blocks *fully wired* — it copies the source, registers the block in the Pages
collection, maps it in `RenderBlocks`, and regenerates types + the admin import
map, landing it all as one reviewable git diff. The differentiator versus a plain
`shadcn add` is the wiring: 1 of 5 artifacts → 5 of 5.

- **Positioning is done and strong.** Hero ("Install Payload blocks wired, not
  pasted"), the grunt-work-tax framing, the 5/5 wiring ledger, the freelance
  origin story, the live catalog, and the docs are all shipped. We are *not*
  rebuilding the landing.
- **The catalog is thin.** Two installable page blocks (`hero-basic`,
  `feature-grid-basic`); eight post components are declared "in development" but
  not built. The full family + variant map and build waves live in **Catalog
  roadmap** below.
- **The installer's happy path is solid** — a nightly fresh-Payload smoke test
  plus integration and e2e suites — **but it has one launch-blocking flaw:**
  fragment wiring is string-anchor based and can fail silently (or wedge) on any
  reformatted `RenderBlocks.tsx` / `Pages/index.ts`, there is no rollback/recover
  path, and only one project shape is supported (`payload-website-starter`). For a
  product whose entire promise is "trust the installer that edits your repo," a
  bad first install erodes the only thing the pitch is built on.
- **There is no interest capture on the site yet.** The CTA is GitHub stars +
  "open an issue."

**Direction (current):** launch *lean and loud* — ship a minimal-but-credible
catalog plus interest capture, then launch to the Payload community within weeks.
Capture uses all four mechanisms (email, opt-in CLI telemetry, GitHub signals,
funnel analytics). The launch catalog is a *mix*: a few wiring-showcase page
blocks plus a few post components.

**Why a mix and not just the eight planned post components:** the planned post
components are component-level installs with *no block wiring* — they grow the
catalog count but don't exercise the core differentiator. Page blocks show off
the wiring; post components add breadth. Lead with the former.

---

## At a glance

| Phase | Theme | Why it's here | Window |
|---|---|---|---|
| **0** | Instrument & capture | Make interest measurable *before* traffic arrives. Low-lift, unblocks everything. | Week 1 |
| **1** | Credible catalog + an install you can trust | ~9 kits (mix) + stop the installer failing silently. The two things that make a launch land instead of backfire. | Weeks 1–3 (parallel) |
| **2** | Launch lean & loud | Ship the demo asset and hit the platforms where Payload devs actually are. | Week ~4 |
| **3** | Build on demand | Let real install/vote signal pick the next kits; expand targets + harden the installer once volume justifies it. | Post-launch |

Dates are relative — compress or stretch to your velocity. The sequence is the point.

---

## Phase 0 — Instrument & capture (do this first)

Stand up the capture stack so the launch (and even pre-launch traffic) is
measurable. All four mechanisms, ordered by signal value.

> **Constraint:** the v2 docs site must stay backend-free — no database, no
> `PAYLOAD_SECRET`, **no waitlist/runtime API routes** (see `CONTRIBUTING.md`).
> So capture runs through *external* services and client-side posts, never a
> self-hosted route handler on this site.

### 0.1 Email waitlist / kit-notify *(collect contacts)*
- Capture through a hosted form provider — **Loops, ConvertKit, Buttondown, Tally,
  or Formspree** — embedded or posted to client-side. No Next route handler, no DB.
  Pick one that doubles as a broadcast channel so you can email "your kit just
  shipped" later (Loops/ConvertKit/Buttondown do this).
- **UI (must match the design system — light-first shadcn monochrome + emerald
  accent only):**
  - A "Notify me" affordance on each `UpcomingKitCard`
    (`src/components/site/KitGrid.tsx`) — this captures *which kit* they want, so
    it's also a priority vote.
  - A general waitlist field in `src/components/site/sections/CommunityCta.tsx`.

### 0.2 Opt-in CLI telemetry *(prove real installs — highest-intent signal)*
- On a successful `payload-kit add`, if opted in, the **CLI** (`tools/payload-kit`,
  not the docs site) posts an anonymized event
  `{ kit, kitVersion, targetId, nodeVersion, pkgManager, success }` directly to an
  external sink (PostHog server-side capture).
- **Opt-in and on-brand:** first-run prompt — "Send anonymous install events to
  help improve Payload Kits? (y/N)" — persisted in `.payload-kit/config`. Honor
  `DO_NOT_TRACK` and CI env vars. Never send repo paths, emails, or content.
- Wire into `tools/payload-kit/commands/add.ts`; add `tools/payload-kit/telemetry.ts`.

### 0.3 Product analytics *(see where attention drops)*
- Add **PostHog** (external script — unifies the web funnel *and* the CLI telemetry
  events from 0.2 in one place). Layer it on the `@vercel/analytics` already wired
  in `src/app/layout.tsx`.
- Instrument the funnel: landing view → catalog view → docs view → **copy-install-command
  click** (the key web intent event) → waitlist submit.

### 0.4 GitHub signals *(no build, sharpen what exists)*
- Add a star/count button + "Watch releases" to the site header / community CTA.
- Add issue templates: "I installed a kit" (the featured-install funnel) and
  "Request a kit" (demand signal). Keep "early installs get featured."

---

## Phase 1 — Credible catalog + an install you can trust (parallel tracks)

### Track A — Catalog to ~9 kits (the "mix")

Build the five-part bundle for each kit (source + manifest + registry entry + docs
+ installer test/sampleContent), scaffolding from `payload-kits/templates/alpha-kit/`,
then register it in `src/lib/site.ts` and the catalog.

Priority order — **page blocks first**, because they showcase the wiring:

| # | Kit | Type | Why | Notes |
|---|---|---|---|---|
| ✓ | hero-basic | page block | shipped | |
| ✓ | feature-grid-basic | page block | shipped | |
| ✓ | feature-split | page block | shipped | two-column; shares featureFields |
| ✓ | feature-bento | page block | shipped | asymmetric grid; shares featureFields |
| ✓ | feature-steps | page block | shipped | numbered; shares featureFields |
| 1 | **cta-basic** | page block | Universal; cleanest second wiring demo | independent |
| 2 | **pricing-basic** | page block | High value on every marketing site | independent |
| 3 | **faq-basic** | page block | Common, structured, easy win | independent |
| 4 | **post-card** | post component | Foundation of the editorial story | archive depends on it |
| 5 | **post-archive** | post component | The "list of posts" surface | needs post-card |
| 6 | **post-hero** | post component | Post header | independent |
| 7 | **author-card** | post component | Byline / social proof | independent |

Stretch if fast: `testimonial-basic` (page block) or `newsletter-callout` (post
component — pairs naturally with the 0.1 email capture).

### Track B — Stop the installer failing silently (launch-blocker only)

Scope is **"fail loud + previewable + recoverable,"** *not* a full rewrite. The
fragile code lives in `tools/payload-kit/project.ts` (string-anchor inserts, a
brittle closing-brace heuristic, string-match verification) and
`tools/payload-kit/commands/add.ts`.

1. **Never silent.** When an anchor or file shape is unexpected, abort with an
   actionable error ("couldn't find `const blockComponents = {` in
   RenderBlocks.tsx — here's the exact line to add") and record `partial` state.
   Tighten the brace heuristic and the comment-matching false positive in
   verification.
2. **`--dry-run` / preview.** Print the exact diff it *would* apply without
   writing. This doubles as a trust feature ("read it before you trust it") and a
   safety net for unusual repos.
3. **Recoverable.** A `--force` / `payload-kit recover` path that reads `partial`
   state and completes or rolls back, instead of a wedged "already installed"
   dead-end.

**Deferred to Phase 3** (gated on demand): AST-based wiring, multi-target support
beyond `payload-website-starter`, and removing the hardcoded POC env defaults from
non-smoke paths.

---

## Phase 2 — Launch lean & loud

Capture is already live (Phase 0), so every visitor can convert to a star, a
waitlist email, or a kit-notify vote. This phase is about driving qualified
traffic — and the order you hit platforms in matters as much as which ones.

### 2.1 The one asset that does the selling

A **45–60s screen recording**: `payload-kit add cta-basic` → the block rendering in
a running app → `git diff --stat` showing the five wired artifacts. Narrate the
four edits it did *for* you. This clip *is* the pitch.

- Host it embeddable everywhere: a short YouTube/Loom **plus a GIF** for places
  that autoplay (Discord, X).
- Supporting assets: the live catalog (`/components`), the wiring-ledger graphic, a
  one-paragraph "what it is" blurb, and a polished README with a copy-pastable
  install command.

### 2.2 Launch sequence — stagger, don't blast

A staged sequence beats a simultaneous blast: soft-launch where the audience is
most forgiving, fix what they surface, *then* go wide.

- **T − ~1 week — Soft launch (Payload Discord).** Post in the showcase channel as
  "I built this — would love feedback." Lowest risk, highest-quality feedback,
  and it catches install bugs before the wide launch. Fix what they find.
- **T − 0 — Wide launch (one weekday morning, US ET).** Show HN + r/PayloadCMS +
  r/nextjs + an X thread, all within a couple of hours so the momentum compounds
  (HN points, Reddit upvotes, and RTs reinforce each other). Be at your desk all
  day to answer every comment.
- **T + days — Evergreen.** Publish the origin-story writeup, submit to
  newsletters, keep replying.

### 2.3 Platforms to hit

| Platform | Why / audience | What to post | Etiquette & timing | Primary metric |
|---|---|---|---|---|
| **Payload Discord** (showcase channel) | Warmest, most qualified — actual Payload devs | "Built payload-kit — installs blocks fully wired. Feedback?" + GIF + repo link | Be a member first; reply fast; not a drive-by. Soft-launch here ~1 week early | install replies, bug reports |
| **Show HN** | Huge reach; a skeptical crowd that *loves* "read the source, it's MIT" | Title: "Show HN: Payload Kits – install Payload CMS blocks wired, not pasted." First comment = the backstory + exactly what it wires | Tue–Thu, ~8–10am ET. Engage every comment. Never ask for upvotes | front page, comment sentiment, stars spike |
| **r/PayloadCMS** | Small but exactly your audience | Same as Discord, a touch more formal | Read the subreddit rules; genuine tone, not a pitch | upvotes, installs |
| **r/nextjs** | Large adjacent audience (Payload runs on Next) | Frame around the Next + Payload workflow pain, *then* the tool | Bigger sub, stricter on self-promo — lead with the problem | reach, click-through |
| **X / Twitter** | Amplification; the Payload team is active here | Thread: the problem → the four edits → the demo clip → the repo | Launch morning; tag @payloadcms / @jmikrut; reply to quote-tweets | RTs, Payload-team notice |
| **dev.to / Hashnode** | Evergreen SEO, linkable | The origin-story essay (reuse the About-page narrative) with the demo embedded | Publish T+1–2 days; link back to the site | search traffic over time |
| **Dev newsletters** (Bytes, This Week in React, Node Weekly, Payload's own) | Curated reach to exactly your people | Submit the launch link with a one-line pitch | Submit during launch week | referral traffic |
| **Product Hunt** *(optional)* | Maker/PM audience — less dev-native | A standard PH launch | Lower priority for a CLI; skip unless you have bandwidth | signups |

### 2.4 The biggest amplifier: get on Payload's radar

The single highest-leverage outcome is the **Payload core team noticing** — a
retweet, a Discord pin, a line in their newsletter. One Payload-team RT outweighs
most other channels combined. Build the Discord relationship *before* launch, tag
the team respectfully, and make something genuinely good enough to be worth their
share.

### 2.5 Pre-launch checklist (all green before T − 0)

- [ ] `pnpm test:fresh` passes — install actually works on a clean Payload app
- [ ] Installer fails *loud* on odd repos (Phase 1B done)
- [ ] Capture is live — waitlist form + analytics firing + CLI telemetry opt-in shipped
- [ ] Demo recording + GIF + wiring-ledger image ready
- [ ] README, catalog, and docs polished; install command is copy-pastable
- [ ] You can be online on launch day to answer everything

### 2.6 Engagement rules

Reply to every comment in the first 24 hours. Treat criticism as free QA — log it
as issues. Never argue; thank, then fix. Convert every "does it support X?" into a
kit-request / roadmap item.

---

## Phase 3 — Build on demand (post-launch)

- **Vote-for-next-kit.** Aggregate kit-notify subscriptions (0.1) + "request a kit"
  issues (0.4) and build what wins. This honors the stated philosophy — "the
  catalog grows from real installs, not roadmap theater" — so you never guess.
- **Expand supported targets** beyond `payload-website-starter` once telemetry shows
  what real repos actually look like.
- **Harden the installer** to AST-based wiring once install volume justifies it.
- **Finish the remaining post components** (post-list, featured-post, related-posts,
  newsletter-callout) as demand pulls them.

---

## Catalog roadmap — the component vision

`At a glance` and Phases 1/3 sequence *when* kits ship against the launch. This
section is the other axis: *what* the catalog becomes and how each kit is shaped.
The unit is **family × variant × install mode** — every kit belongs to a family,
and a family is one shared field base plus N variants (the model proven by
`hero-basic` + `payload-kits/source/blocks/shared/heroFields.ts`).

### Two install modes

- **Page blocks** — installed with full Payload wiring (Pages collection + render
  map + `generate:types` + import map). This is the differentiator; **lead with
  these.** Each page-block family shares a field base so its variants don't diverge.
- **Post components** — file-only shadcn-native installs for the Posts collection,
  no block wiring. Lower effort, lower differentiation; they add breadth.

### The family map

**Page blocks (full wiring)**

| Family | Base → variants | Shared base |
|---|---|---|
| Hero | `hero-basic` ✓ · `hero-split` · `hero-media` · `hero-dramatic` | `heroFields` ✓ |
| Feature | `feature-grid-basic` ✓ · `feature-split` ✓ · `feature-bento` ✓ · `feature-steps` ✓ | `featureFields` ✓ |
| CTA | `cta-basic` · `cta-banner` · `cta-split` | `ctaFields` |
| Pricing | `pricing-basic` (tiers) · `pricing-comparison` · `pricing-single` | `pricingFields` |
| Social proof | `testimonial-basic` · `testimonial-grid` · `logo-cloud` · `stats-band` | mixed |
| FAQ | `faq-basic` (accordion) · `faq-grid` | `faqFields` |
| Content / media (Payload starter parity) | `content-columns` · `media-block` · `banner` · `code-block` | — |
| Team | `team-grid` · `team-member` | — |
| Forms | `form-block` (form-builder) · `newsletter-inline` · `contact-split` | — |

**Post components (file-only)**

`post-card` · `post-archive` · `post-hero` · `featured-post` · `post-list` ·
`author-card` · `related-posts` · `newsletter-callout` — the eight declared in
`src/lib/site.ts` `upcomingKits`, plus natural additions `post-toc` and `share-bar`.

**Shared primitives** (bases the variants compose — *not* installable kits)

`heroFields` ✓ · `featureFields` ✓ · `ctaFields` · `pricingFields` · `faqFields` ·
`mediaField` · a section-shell wrapper carrying `id` / `className` /
`disableInnerContainer`.

### Build waves

Waves are the *component* sequence; they feed the GTM phases above (Wave 1 ≈
Phase 1 · Track A). Page blocks before post components — the wiring is the moat.

| Wave | Build | Maps to |
|---|---|---|
| **1 — Launch catalog** | `cta-basic`, `pricing-basic`, `faq-basic`, `testimonial-basic` (page) + `post-card`, `post-archive`, `post-hero`, `author-card` (posts) | Phase 1 · Track A |
| **2 — Depth via variants** | `hero-split`, `hero-media`; `feature-split`, `feature-bento`; extract `featureFields` / `ctaFields`; `content-columns` + `media-block` | post-launch — the payoff of the shared-base model |
| **3 — Breadth** | remaining posts (`post-list`, `featured-post`, `related-posts`, `newsletter-callout`), `team-grid`, `logo-cloud`, `stats-band`, `form-block` | Phase 3 · build on demand (vote-for-next-kit picks order) |
| **4 — Chrome & advanced** | `header` / nav, `footer`, `pricing-comparison`, multi-target support | gated on volume (Phase 3) |

### Sequencing rules

- **Page blocks before post components** — they exercise the wiring, which is the
  core pitch. Post components grow the count but not the differentiator.
- **Within a family: base first, then extract, then variants.** Ship the `-basic`
  base, extract its shared field base (the `heroFields` step), *then* add variants
  that compose it. A second variant is cheap once the base exists; a one-variant
  family isn't worth a shared base yet.
- **Demand-pull past Wave 2.** Beyond the launch catalog and the variant-depth
  proof, let kit-notify votes + "request a kit" issues order the rest — don't build
  breadth on spec.
- **Every kit is the five-part bundle** (see Execution notes) plus its shared base
  and the landing-ledger sync in `src/lib/site.ts`.

---

## How to tell if people are interested (the signal ladder)

Don't read stars as success. Climb the ladder — each rung is a stronger signal than
the one below it. The numbers are calibration anchors for the first ~30–90 days, not
targets to game.

| Rung | Signal | Source | What it means | "It's working" anchor |
|---|---|---|---|---|
| **Attention** | Landing visits, GitHub stars | PostHog, GitHub | The pitch gets clicks | ~300+ stars in launch week |
| **Intent** | Copy-install-command clicks, docs views, **waitlist + kit-notify signups** | PostHog, form provider | They're considering it | >50 waitlist, healthy command copies |
| **Commitment** | **npm downloads of `payload-kit`, opt-in telemetry installs**, "I installed a kit" issues | npm, PostHog, GitHub | They actually ran it — *the rung that matters* | 20+ distinct real installs in month 1 |
| **Pull** | Kit-request issues, kit-notify vote distribution, Discord questions | GitHub, PostHog | They want *more* — product-market pull | Specific, repeated requests for named kits |

**Decision rule after launch:**
- Attention but no Commitment → the pitch lands, the value doesn't. Investigate
  install friction (Track B) or whether the wiring is really the pain.
- Commitment + Pull → you have something. Pour into Phase 3 and build the requested
  kits fast.

---

## Execution notes

**Each new kit** ships as a five-part bundle (scaffold from
`payload-kits/templates/alpha-kit/`): source under
`payload-kits/source/blocks/<Name>/`, a `payload-kits/manifests/<slug>.json` (with
`sampleContent` for smoke), a `payload-kits/registry.json` entry, a
`content/docs/kits/<slug>.mdx`, installer test coverage in `tests/int/`, and
registration in `src/lib/site.ts`.

**Verification gate** before any release: `pnpm test:release` (lint, source:build,
tsc, registry, int, e2e, build). Per local notes, use `E2E_PORT=3100` for e2e
(port 3000 contention) and run `pnpm source:build` after a fresh install before
tsc. `pnpm test:fresh` runs the slower fresh-Payload smoke.
