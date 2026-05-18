# payload-components — Stitch Design Handover

> **Purpose of this doc:** Give Google Stitch enough context to generate 5 strong, on-brand screen directions for a community-first relaunch of payload-components. Each screen has a ready-to-paste prompt block at the end. Copy them into Stitch one screen at a time.

> **Author:** Chai (pinzheng@reactor.school) · **Date:** 14 May 2026 · **Status:** Draft for design exploration

---

## TL;DR for Stitch

We're designing the public site for **payload-components** — an open-source kit registry and CLI (`payload-kit`) for [Payload CMS](https://payloadcms.com) v3 + Next.js App Router. Think *"shadcn/ui, but for Payload blocks, with a real install pipeline that handles schema wiring, type generation, and import maps."*

We are pivoting from an open-core-with-Pro positioning to a **community-first open-source positioning**. No paid tiers, no pricing tables, no "Pro early access" in this design pass. Lead with the kits, the CLI, the catalog, the contributors. Monetization comes back later as a separate effort.

**Visual archetype:** shadcn/ui · Linear · Vercel · Resend. Clean, minimal, devtool-native. Mono accent on neutral surfaces. Code-forward. Light *and* dark, dark feels like the canonical mode.

**Five screens to design:** Landing → Registry (browse all kits) → Kit detail (single kit page) → Docs (CLI reference) → Community (contributors, roadmap, Discord/GitHub).

---

## 1. Product context

### What it is

`payload-components` is a curated **catalog of installable kits** (heroes, feature grids, CTAs, footers, etc.) for Payload CMS v3 projects on Next.js App Router. Each kit is a complete unit: the block config, the frontend component, the Payload schema wiring, sample content, and any post-install tasks needed to make it work in a real repo.

The companion CLI, `payload-kit`, is the install surface:

```bash
npx payload-kit add hero-basic
npx payload-kit add feature-grid-basic
npx payload-kit doctor   # roadmap
```

The CLI:

- Drops kit files into the right places in a Payload v3 repo
- Registers the block in collections without duplicating wiring
- Regenerates Payload types
- Updates the admin import map
- Leaves the repo in a clean, idempotent state — no fragile manual cleanup

### Current state (May 2026)

- **2 kits shipped** in the public alpha: `hero-basic`, `feature-grid-basic`
- **`payload-kit add`** is the only shipped command
- **`payload-kit doctor`** is on the roadmap (compatibility checks, drift detection)
- Repo: `https://github.com/Ducksss/payload-components`
- Built on Payload `3.82.1`, Next.js `16.2.3`, React `19.2.4`, Tailwind v4
- Distribution model: a `payload-kits/registry.json` built via `shadcn build` into `public/r/` — so the registry follows the shadcn convention, but the install logic is Payload-aware

### Why it exists

Agencies and freelancers building Payload sites repeatedly hand-roll the same handful of blocks. Generic component libraries don't fit because they don't speak Payload's schema/admin/types model. payload-components packages the high-leverage 80% so teams can ship in days instead of weeks — and so the community has a shared, dependable base to build on.

---

## 2. The strategic pivot — community-first

### What changes

| Before (open-core) | After (community-first) |
|---|---|
| Lead with "Public registry (free) + Pro private registry ($19/seat/month)" | Lead with "Free, open, MIT-licensed kits — install in one command" |
| Pricing tier on the landing page | No pricing on the landing page at all |
| "Request Pro early access" CTA | "Star on GitHub" / "Install your first kit" CTAs |
| Audience: agencies who'll pay | Audience: every Payload developer, with agencies as power users |
| Emphasis: reliability for paying teams | Emphasis: the catalog, the contributors, the install ergonomics |

### Why

- The catalog is too small (2 kits) to justify a paid tier yet. Trust > revenue at this stage.
- A community-first relaunch lets us recruit contributors who'll grow the catalog.
- Payload itself is open-source; the audience expects OSS-native positioning.
- Monetization is not dead — it just doesn't belong in this design pass.

### What this means for design

- **No pricing pages, no "Pro" badges, no dollar signs anywhere.**
- **Lead with the kits and the CLI**, not with business outcomes.
- **Surface the GitHub repo, the contributors, and the roadmap.**
- **Show real code and real install commands**, not abstract benefits.
- **Make it feel like a piece of devtool infrastructure**, not a SaaS landing page.

---

## 3. Audience & jobs-to-be-done

### Primary persona: the Payload developer

Mid-to-senior full-stack dev who has shipped at least one Payload v3 + Next.js project. Comfortable with TypeScript, the App Router, and CLIs. Reads release notes. Cares about repo cleanliness, type safety, and not yak-shaving the same scaffolding twice.

**Jobs:**

1. *"Drop a hero into my Payload repo without breaking my collections."*
2. *"Find a feature grid block that doesn't look like every other Tailwind starter."*
3. *"See what kits exist and whether they're maintained before I install one."*
4. *"Contribute a kit I made for a client back upstream."*

### Secondary persona: the agency tech lead

Runs a small studio shipping Payload sites for clients. Wants speed, consistency across projects, and an opinionated base layer the whole team can adopt.

**Jobs:**

1. *"Standardize my team on a shared block library."*
2. *"Vet the project's reliability before I bet client work on it."*
3. *"See who else is using this so I know it'll be around."*

### Anti-persona (do NOT design for them this pass)

- Designers looking for a Figma kit (out of scope)
- Procurement teams comparing SaaS vendors (no pricing this round)
- Non-Payload devs (we're not generic; we lean into Payload-specificity)

---

## 4. Brand voice & mood keywords

### Voice

Confident, technical, slightly understated. The voice of a senior engineer who built this because they were tired of doing it manually — not a marketing team selling a platform. Short sentences. Concrete examples. No hype words ("revolutionary", "game-changing", "unleash"). No emoji clusters in headlines.

**Lean toward:** shadcn/ui's docs, Linear's homepage, Resend's product copy, Trigger.dev's release notes.

### Mood keywords for Stitch

> *minimal · technical · trustworthy · open · devtool-native · contributor-friendly · type-safe · idempotent · curated · grown-up · monospace · low-chrome · high-density*

### Tone examples

| Don't say | Say instead |
|---|---|
| "Revolutionize your Payload workflow" | "Install a hero in one command" |
| "The ultimate component library" | "Two kits shipped. More on the way." |
| "Built for enterprise teams" | "Built for the next site you ship this week" |
| "Unlock premium features" | (delete entirely) |
| "Get started in seconds!" | `npx payload-kit add hero-basic` |

---

## 5. Visual direction

### Reference set (give these to Stitch)

| Reference | What to borrow |
|---|---|
| **shadcn/ui** (`ui.shadcn.com`) | Component-grid layouts, code blocks, dark/light parity, monospace install commands, "Copy" buttons everywhere |
| **Linear** (`linear.app`) | Confident headline typography, restrained color, subtle gradients, screenshot-as-hero |
| **Vercel** (`vercel.com`) | Grid systems, geometric accents, code-forward hero, footer density |
| **Resend** (`resend.com`) | Code-as-hero, dev-native voice, contributor section vibe |
| **Trigger.dev** (`trigger.dev`) | Block-based feature sections, command-line as visual primitive |
| **shadcn/ui registry browser** (`ui.shadcn.com/blocks`) | The actual UX pattern for Registry + Kit detail pages |

### Palette

Neutral-first with a single mono accent. Both modes ship, but the **dark mode is canonical** for screenshots and marketing.

**Dark (canonical):**

- Background: `#0A0A0A` → `#0F0F10` (near-black, subtle warm tint okay)
- Surface: `#161618`
- Border: `#27272A` (very low contrast)
- Foreground: `#FAFAFA` / `#E5E5E5` for body
- Muted text: `#A1A1AA`
- Accent: a single **electric green** `#00FF88` or a **cool indigo** `#7C7CFF` — pick *one* and use it sparingly, only for primary CTAs, focus rings, and "shipped" pills. Treat color as a scalpel, not a paint roller.

**Light:**

- Background: `#FFFFFF`
- Surface: `#FAFAFA`
- Border: `#E4E4E7`
- Foreground: `#09090B`
- Muted text: `#71717A`
- Accent: same as dark

**No** purple-to-pink gradients. **No** glassmorphism. **No** colorful illustrations. **No** stock photos of humans.

### Typography

- **Display & body:** Geist Sans (already in the dep tree) or Inter as fallback
- **Mono:** Geist Mono or JetBrains Mono — used for install commands, kit slugs, code blocks, and the occasional UI label (kit name in the registry grid)
- **Headline scale:** `text-5xl`/`text-6xl` on landing hero, `text-3xl` on section headers
- **Tracking:** slightly tight on display sizes (`tracking-tight`), normal on body
- **No** decorative scripts. **No** italics for emphasis.

### Spacing & density

- Generous on the landing hero (lots of whitespace)
- Tight and grid-y on the registry browser (think shadcn's blocks page)
- Docs page is dense, reading-optimized, with a sticky sidebar
- Use **8px base unit**. Common scales: 16, 24, 32, 48, 64, 96

### Iconography

- **lucide-react** only (already in the dep tree). Strokes, not fills. `1.5px` stroke width.
- One icon per feature card maximum. No icon stacks, no icon gradients.

### Motion

- Restrained. Page-load fades, hover lifts on cards (`translateY(-2px)`), CTA shimmer on the install command. Nothing parallax, nothing on scroll-trigger beyond a section fade-in. Respect `prefers-reduced-motion`.

### Imagery / hero treatment

- Hero is **code-forward**: a real terminal showing `npx payload-kit add hero-basic` finishing successfully, paired with a rendered hero block screenshot to the right. No people, no abstract gradients.
- Kit detail pages show a **live-ish preview frame** + the **install command** + the **block schema** as code.
- Community page can use **GitHub-style contributor avatar grids** — those *are* the imagery.

---

## 6. Sitemap & navigation

```
/                       Landing
/registry               Registry browser (grid of all kits, filterable)
/registry/[slug]        Kit detail page (e.g. /registry/hero-basic)
/docs                   Docs root — CLI reference, getting started, contributing
/community              Contributors, roadmap, Discord/GitHub, recent releases
```

### Top nav (every page)

`Registry · Docs · Community` on the left after the wordmark, `GitHub (with star count) · Theme toggle` on the right. No "Sign in", no "Pricing", no "Get started" button — the CTA lives in the page body.

### Footer (every page)

Three columns: **Product** (Registry, Docs, Roadmap, Changelog), **Community** (GitHub, Discord, Contributors, X/Twitter), **Legal** (License (MIT), Code of Conduct). Tiny wordmark + "MIT licensed · Built on Payload" bottom strip. No newsletter signup.

---

## 7. Per-screen briefs

Each screen below has: **purpose**, **section-by-section content**, and a **copy-paste Stitch prompt**. Paste each prompt into Stitch as a separate generation; iterate on each independently.

---

### Screen 1 of 5 — Landing (`/`)

**Purpose:** Convince a Payload developer in 15 seconds that this is the cleanest way to scaffold blocks, and get them to either (a) run an install command, (b) browse the registry, or (c) star the repo.

**Sections (top to bottom):**

1. **Top nav** — wordmark "payload-components", links `Registry · Docs · Community`, right side `GitHub ★ 1.2k` (mocked star count) and theme toggle.
2. **Hero**
   - Eyebrow: "MIT-licensed · Built for Payload v3"
   - Headline (display, two lines): *"Installable kits for Payload."* / *"One command. Real wiring."*
   - Subhead (one sentence, muted): "A curated open-source catalog of blocks for Payload v3 + Next.js App Router. Schema, types, and import maps handled."
   - Primary CTA: a **terminal panel** showing `npx payload-kit add hero-basic` with a copy button — *this is the CTA*, not a button.
   - Secondary CTA (text link): "Browse the registry →"
   - Tiny proof strip below: "Payload v3 · Next.js App Router · Type-safe · Idempotent installs"
3. **Right side of hero (split layout on desktop, stacked on mobile):** a screenshot of a rendered hero block — the actual output of `hero-basic`. Frame it lightly with a subtle device chrome (just a rounded rectangle with a 1px border, no browser bar).
4. **"What gets installed"** — three-column row, mono labels:
   - **Block config** — Payload schema, typed and validated
   - **Frontend component** — RSC-friendly, App-Router native
   - **Wiring** — collection registration, import map, generated types
5. **The catalog** — a small preview grid showing the 2 shipped kits (`hero-basic`, `feature-grid-basic`) as cards with mini-previews. Link: "See all kits →"
6. **CLI section** — left: a single terminal showing a full session (`add`, `doctor` greyed out as "coming soon"). Right: 3 short bullet points about what the CLI does — *registers the block, regenerates types, updates the import map*.
7. **Contributors & community** — a row of contributor avatars (GitHub-style), a star-count callout, "Made by the community. Built in public." link to `/community`.
8. **FAQ** (compact, 4 items max) — drawn from `src/components/landing/content.ts`. Drop anything pricing-related.
9. **Footer** as specified in §6.

**Do not include:** any pricing, any "Pro" mention, any "early access" form, any newsletter capture, any dark-purple gradient.

**Stitch prompt — paste this:**

```text
Design a dark-mode-canonical landing page for an open-source developer tool
called "payload-components". It is a catalog of installable kits (blocks) for
Payload CMS v3 + Next.js. The visual direction is shadcn/ui meets Linear meets
Vercel: minimal, technical, monospace-forward, single accent color, no
gradients, no illustrations.

Layout, top to bottom:

1. Top nav: wordmark "payload-components" on the left, links "Registry, Docs,
   Community", right side has "GitHub ★ 1.2k" pill and a theme toggle.

2. Hero, split into two columns on desktop:
   - Left column: eyebrow text "MIT-licensed · Built for Payload v3", a
     two-line display headline "Installable kits for Payload. / One command.
     Real wiring." Below it, a one-sentence muted subhead. Below that, the
     primary call-to-action is a terminal-style panel showing the command
     "npx payload-kit add hero-basic" with a copy button on the right. Below
     the terminal, a small text link "Browse the registry →". A thin proof
     strip of plain text labels: "Payload v3 · Next.js App Router · Type-safe
     · Idempotent installs".
   - Right column: a screenshot of a rendered "hero" block (a marketing
     headline section with two buttons and three small proof pills). Frame it
     in a subtle rounded rectangle with a 1px border, no browser chrome.

3. A three-column "what gets installed" row with monospace labels: "Block
   config", "Frontend component", "Wiring". One short sentence under each.

4. A "The catalog" section showing two kit cards in a row: "Hero Basic" and
   "Feature Grid Basic". Each card has a tiny rendered preview at top, the kit
   name in monospace, a one-line description, and a "Shipped alpha" pill. A
   text link below the grid: "See all kits →".

5. A "The CLI" section, two columns. Left: a realistic terminal window
   showing a full install session, with successful checkmarks. Right: three
   short bullets — "Registers the block in your collections", "Regenerates
   Payload types", "Updates the admin import map".

6. A community strip: a horizontal row of about 16 small circular contributor
   avatars (GitHub-style), a star-count number, and one line: "Made by the
   community. Built in public." with a link to /community.

7. A compact FAQ section with 4 questions in an accordion. No pricing
   questions.

8. Footer with three columns: Product, Community, Legal. Tiny wordmark and
   "MIT licensed · Built on Payload" bottom strip.

Palette (dark mode): background near-black (#0A0A0A), surface (#161618),
border (#27272A), foreground (#FAFAFA), muted (#A1A1AA), single accent of
electric green (#00FF88) used only on primary CTAs, focus rings, and "shipped"
pills. Typography: Geist Sans for display and body, Geist Mono for all
commands, kit slugs, code, and any UI element where a developer would expect
mono. Tight tracking on display sizes. No emoji, no illustrations, no stock
photography, no purple gradients.

Voice: confident, technical, understated. The voice of a senior engineer who
built this because they were tired of doing it manually. No hype words.
```

---

### Screen 2 of 5 — Registry browser (`/registry`)

**Purpose:** Let a developer scan the entire catalog of kits, filter by category, and click through to install. Borrow the UX from `ui.shadcn.com/blocks`.

**Sections:**

1. **Top nav** (same as landing).
2. **Page header** — short, dense:
   - Heading: "Registry"
   - Subhead: "Every kit ships with block config, frontend, schema wiring, and post-install tasks. Install with `npx payload-kit add <slug>`."
   - Right side: a small "kit count" pill (`2 kits`) and a "Request a kit" link → GitHub issue template.
3. **Filter rail** (left side on desktop, top on mobile):
   - Categories: All · Hero · Feature · CTA · Footer · Layout · Form · Media · Pricing · Testimonial
   - Status: All · Shipped · In review · Roadmap
   - Sort: Newest · A→Z
4. **Kit grid** — 3 columns desktop, 2 tablet, 1 mobile. Each card:
   - Top: live-ish preview thumbnail (rendered block, lightly framed)
   - Mid: kit name in mono (e.g. `hero-basic`), one-line description
   - Bottom: a "Shipped alpha" pill on the left, copy-install-command icon button on the right
   - Hover: card lifts 2px, install command appears as overlay strip
5. **Empty filter state** — gentle copy: *"No kits match yet. Want this category? Open an RFC →"*
6. **Footer**.

**Stitch prompt — paste this:**

```text
Design a registry browser page for "payload-components", an open-source
catalog of installable kits for Payload CMS v3. Dark mode canonical. Visual
direction is shadcn/ui's block browser (ui.shadcn.com/blocks) — dense, grid-
y, minimal chrome.

Layout:

1. Same top nav as the landing page: wordmark "payload-components", links
   "Registry, Docs, Community", right side "GitHub ★ 1.2k" and a theme
   toggle. The "Registry" link is active.

2. Page header row: large heading "Registry" on the left. Below it a one-line
   muted subhead: "Every kit ships with block config, frontend, schema
   wiring, and post-install tasks. Install with `npx payload-kit add
   <slug>`." On the right side of the row, a small monospace pill reading "2
   kits" and a text link "Request a kit →".

3. Two-column body: a 220px-wide filter rail on the left, a kit grid on the
   right.

   Filter rail has three grouped sections:
   - "Category" with checkboxes: All, Hero, Feature, CTA, Footer, Layout,
     Form, Media, Pricing, Testimonial
   - "Status" with radio buttons: All, Shipped, In review, Roadmap
   - "Sort" with radio buttons: Newest, A→Z

   Kit grid is a responsive 3-column grid. Each card:
   - A 16:10 thumbnail showing a small rendered preview of the block
   - Below the thumbnail, the kit slug in monospace ("hero-basic") and a
     one-line description in muted text
   - A bottom strip with a "Shipped alpha" pill on the left and a small
     monospace "npx payload-kit add hero-basic" with a copy icon on the right
   - On hover, the card lifts subtly and the install command background
     highlights

   Show 6 cards in the grid: hero-basic, feature-grid-basic, and 4 ghosted
   "coming soon" cards with diagonal-stripe placeholder thumbnails and
   monospace slugs like "cta-split", "footer-minimal", "pricing-three",
   "testimonial-quote".

4. Footer as specified.

Palette and typography same as the landing brief: near-black background,
single electric green accent used sparingly, Geist Sans + Geist Mono. No
gradients, no illustrations.
```

---

### Screen 3 of 5 — Kit detail (`/registry/hero-basic`)

**Purpose:** Deep view of a single kit. Convince the developer this kit is worth installing, then give them the exact command.

**Sections:**

1. **Top nav**.
2. **Breadcrumb:** `Registry / hero-basic`
3. **Header row:**
   - Left: kit name as a large heading ("Hero Basic"), monospace slug pill (`hero-basic`), status pill ("Shipped alpha"), one-line description.
   - Right: primary install command terminal with copy button. Below it: "View source on GitHub →" link.
4. **Live preview frame** — a large, framed render of the actual block output. Includes a small toolbar with "Desktop / Tablet / Mobile" view toggles and a "Reload" affordance.
5. **Tabs row** (sticky-ish under the preview):
   - `Overview` (default) — what it is, what's in the box, when to use it
   - `Code` — the block config (.ts) and the React component as syntax-highlighted code with a copy button per file
   - `Schema` — the Payload field config rendered as a readable table
   - `Install` — a step-by-step explanation of what `add` will do to a repo, with file diff snippets
6. **"Used in" / "Pairs well with"** — a small footer-of-page strip linking 2–3 other kits that compose nicely.
7. **Edit on GitHub** link.
8. **Footer**.

**Stitch prompt — paste this:**

```text
Design a kit detail page for "payload-components", on the route
/registry/hero-basic. Dark mode canonical, shadcn/ui-style minimal devtool
aesthetic.

Layout:

1. Top nav identical to other screens.

2. A thin breadcrumb row: "Registry / hero-basic" with the slug in
   monospace.

3. A header section, two columns:
   - Left column: a large heading "Hero Basic". Below it, on one line: a
     monospace pill "hero-basic", a green "Shipped alpha" pill, and a small
     dot-separated meta strip "Updated 3 days ago · MIT". Below that, a
     one-paragraph description (2 sentences): "A headline-first hero block
     with proof items and CTA support. Shipped through the real payload-kit
     alpha install flow with typed props, schema wiring, and import-map-safe
     output."
   - Right column: a terminal-style panel showing "npx payload-kit add
     hero-basic" with a copy button. Below it, two small text links: "View
     source on GitHub →" and "Report an issue →".

4. A large live-preview frame spanning the full content width. It shows a
   real rendered hero block: an eyebrow ("Payload Kits alpha"), a long
   headline ("Ship a production-ready hero without manual repo cleanup."),
   two CTA buttons ("Open the live gallery" primary, "View on GitHub"
   secondary), and a row of three proof pills ("Registry-backed install",
   "Payload-aware wiring", "Types generated automatically"). Above the
   preview, a small toolbar with "Desktop / Tablet / Mobile" view-size
   toggles on the left and a refresh icon on the right.

5. Below the preview, a sticky tab strip with four tabs: Overview, Code,
   Schema, Install. Overview is active. Under it, three short subsections:
   - "What it is" — one paragraph
   - "What's in the box" — a bullet list: block config, React component,
     collection registration, sample content, type updates
   - "When to use it" — one paragraph

6. A "Pairs well with" row near the bottom: 2 kit cards (feature-grid-basic
   and a ghosted "cta-split coming soon"), styled identically to the
   registry grid cards.

7. A small "Edit this page on GitHub →" link.

8. Footer.

Palette and typography same as previous screens. The preview frame should
have a 1px subtle border and rounded corners, no browser chrome. Use Geist
Mono for the slug, the install command, file names, and any code. No
gradients, no decorative imagery, no emoji.
```

---

### Screen 4 of 5 — Docs (`/docs`)

**Purpose:** Reference for the CLI and the kit-authoring workflow. Optimized for reading and scanning, not for marketing.

**Sections:**

1. **Top nav**.
2. **Three-column docs shell:**
   - **Left rail (sticky):** nav tree — Getting started, CLI (add, doctor, list), Authoring a kit, Conventions, Contributing, Changelog. Active item highlighted with the accent color.
   - **Center (reading column, ~720px):** the actual docs content. For this design, show the "Getting started" page: H1 "Getting started", followed by prose, then a code block with `npx payload-kit add hero-basic`, then a callout block, then more prose.
   - **Right rail (sticky):** on-this-page table of contents with anchor links and a small "Edit on GitHub" link at the bottom.
3. **Footer**.

The whole page should feel like Stripe docs or shadcn/ui docs — dense, calm, lots of code blocks, no marketing chrome.

**Stitch prompt — paste this:**

```text
Design a documentation page for "payload-components" at /docs/getting-
started. Dark mode canonical, optimized for reading. Visual reference: the
shadcn/ui docs and Stripe docs — calm, dense, code-forward, no marketing
chrome.

Layout: three-column docs shell.

1. Top nav same as other screens, "Docs" link active.

2. Left sticky sidebar (240px wide) with a nav tree grouped under headings:
   - "Get started" — Introduction, Installation, Your first kit
   - "CLI reference" — add, doctor, list
   - "Authoring kits" — Anatomy, Schema, Wiring, Post-install tasks
   - "Conventions" — Type safety, Idempotency, Import maps
   - "Contributing" — Setup, RFC process, Style guide
   - "Changelog"
   Each top-level group is a small uppercase label, items below are normal-
   weight. Active item ("Installation") highlighted with the accent color on
   the left edge.

3. Center column, ~720px wide, holding the actual docs content. Show:
   - Breadcrumb row: "Get started / Installation"
   - H1: "Installation"
   - A paragraph of prose
   - A code block (monospace, dark surface) showing:
       "npx payload-kit add hero-basic"
     with a copy button in the top-right corner
   - A subheading H2: "What this installs"
   - A bulleted list of 4 items
   - A subtle callout block (border-left accent) titled "Note" with one
     sentence about Payload v3 only support
   - H2: "Prerequisites"
   - Another paragraph of prose
   - A two-column code-and-explanation block

4. Right sticky sidebar (200px wide) titled "On this page" with anchor
   links to each H2 in the content column. Bottom of this rail has a small
   "Edit this page on GitHub →" link.

5. Footer.

Use Geist Mono for all code, file names, package names, and CLI flags. Body
copy in Geist Sans. The reading column should have generous line-height
(1.7) and a max-width that feels like a book column. No illustrations, no
hero image, no "Was this helpful?" widget — keep it pure reference.
```

---

### Screen 5 of 5 — Community (`/community`)

**Purpose:** Show that this is built in public and earn contributor trust. Surface contributors, the roadmap, and the channels to engage.

**Sections:**

1. **Top nav**.
2. **Page header:**
   - Heading: "Built in public."
   - Subhead: "payload-components is MIT-licensed and shaped by the people using it. Here's where it's going and how to help."
3. **Channels row** — 3 cards:
   - **GitHub** — repo link, current star count, "Open an issue" CTA
   - **Discord** — invite link, "Join the build" CTA
   - **RFCs** — link to the RFC discussion category, one line about the process
4. **Roadmap** — a three-column kanban-ish view: **Shipped · In progress · Next**. Each card is a small monospace title (e.g. `payload-kit doctor`, `cta-split kit`, `cli list command`) plus a one-line description and an optional GitHub issue link.
5. **Contributors** — a large grid of contributor avatars (rounded squares, 64px), with a "+ 24 more" tile at the end. One line: "Made by these people. Want your face here? Ship a kit."
6. **Recent activity** — a vertical feed of 6 recent events: commits, releases, RFCs opened, issues closed. Each row has an icon, a short label, and a timestamp.
7. **Footer**.

**Stitch prompt — paste this:**

```text
Design a community page for "payload-components" at /community. Dark mode
canonical, shadcn/Linear/Resend aesthetic. The whole page should feel like a
public dashboard for an open-source project — honest, technical, no
marketing fluff.

Layout:

1. Top nav same as other screens. "Community" link active.

2. Page header: a large two-line heading "Built in public." (period
   included). Below it, a one-sentence muted subhead: "payload-components is
   MIT-licensed and shaped by the people using it. Here's where it's going
   and how to help."

3. A three-card row of channels:
   - GitHub card: GitHub icon, headline "GitHub", muted line "1,247 stars ·
     34 contributors", a small monospace repo URL, and a CTA button "Open an
     issue".
   - Discord card: Discord icon, headline "Discord", muted line "Live build
     chat and RFC discussions", CTA button "Join the server".
   - RFCs card: a doc icon, headline "RFCs", muted line "Propose new kits
     and CLI features", CTA button "Browse open RFCs".

4. A "Roadmap" section. Heading "Roadmap" on the left, a small filter "All ·
   CLI · Kits · Registry" on the right. Below it, three columns:
   - "Shipped" — three cards titled in monospace: "hero-basic kit", "feature-
     grid-basic kit", "payload-kit add". Each card has a one-line
     description and a small green check.
   - "In progress" — two cards: "payload-kit doctor", "cta-split kit". Each
     has a small spinner icon and a linked GitHub issue number.
   - "Next" — three cards: "payload-kit list", "footer-minimal kit",
     "pricing-three kit". Each has a small clock icon.

5. A "Contributors" section. Heading "Contributors" on the left, a small
   "34 people" pill on the right. Below it, a grid of 33 contributor avatars
   (rounded square, 64px, GitHub-style) plus a 34th tile reading "+ more" in
   muted text. Below the grid, one line of prose: "Made by these people. Want
   your face here? Ship a kit."

6. A "Recent activity" section. Heading "Recent activity" on the left.
   Below it, a vertical feed of 6 rows. Each row has a small icon on the
   left, a one-line activity description (e.g. "feature-grid-basic v0.3.1
   released", "RFC: cta-split kit opened by @username", "Issue #42 closed:
   import map regeneration on Windows"), and a right-aligned timestamp
   ("2h ago", "yesterday", etc.).

7. Footer.

Palette and typography same as previous screens. Lean on monospace for kit
names, repo URLs, release versions, and issue numbers. No marketing
gradients, no shiny CTAs, no testimonials, no logo wall.
```

---

## 8. Anti-patterns — do NOT design

- Any pricing table, "Pro" badge, dollar sign, or "Request early access" form
- Newsletter capture in the hero
- Purple-to-pink gradients, glassmorphism, or 3D illustrations
- Stock photography of people pointing at laptops
- Logo walls of fake customer brands
- "Trusted by 10,000+ teams" social proof copy
- Generic shapes-on-gradient hero backgrounds
- Marketing video embedded in the hero
- Animated mascots
- Light mode treated as an afterthought — both modes must feel intentional
- Emoji clusters in headlines ("🚀 Ship faster ⚡")
- Long marketing paragraphs — every section's prose should fit in 1–2 lines
- "Sign in" button in the nav (there is no account yet)

## 9. Design tokens (give these to Stitch verbatim if asked)

```css
/* Dark (canonical) */
--bg:            #0A0A0A;
--surface:       #161618;
--surface-2:     #1F1F22;
--border:        #27272A;
--border-strong: #3F3F46;
--fg:            #FAFAFA;
--fg-muted:      #A1A1AA;
--fg-dim:        #71717A;
--accent:        #00FF88;   /* pick one: 00FF88 or 7C7CFF */
--accent-fg:     #0A0A0A;
--success:       #22C55E;
--warning:       #F59E0B;
--danger:        #EF4444;

/* Light */
--bg-light:            #FFFFFF;
--surface-light:       #FAFAFA;
--border-light:        #E4E4E7;
--fg-light:            #09090B;
--fg-muted-light:      #71717A;

/* Type */
--font-sans: 'Geist Sans', Inter, system-ui, sans-serif;
--font-mono: 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;

/* Radii */
--radius-sm: 6px;
--radius:    8px;
--radius-lg: 12px;
--radius-xl: 16px;

/* Spacing scale */
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128
```

## 10. How to drive Stitch with this doc

1. **One screen at a time.** Open Stitch, paste *only* the prompt block for the screen you want. Don't paste the whole doc — Stitch performs better with focused 300–500 word briefs.
2. **Lock the visual direction once.** On the first generation (the Landing prompt), if Stitch's output drifts off the shadcn/Linear archetype, use a follow-up message: *"More restrained. Reference shadcn/ui's homepage. Reduce gradients. Single accent color only."*
3. **Iterate on a screen before moving on.** Get the Landing right first — it sets the system. Once it feels right, reuse its accent, type, and nav language verbatim in the next screen's prompt.
4. **Ask Stitch for variants.** After a generation you like, ask: *"Give me a more minimal variant"* and *"Give me a slightly bolder variant with one more visual element"*. Pick the strongest.
5. **Export the screens you keep.** Stitch can export to Figma — push all 5 to the same Figma file, then assemble a one-page design overview.
6. **Don't ask Stitch for code yet.** This pass is for direction. Code generation comes after you've picked the visual system.

## 11. Real data Stitch should use in mockups

So Stitch doesn't invent fake content:

- **Repo:** `github.com/Ducksss/payload-components`
- **Wordmark:** `payload-components` (all lowercase, no dot, no logomark for now — keep it word-only on this pass)
- **Shipped kits:** `hero-basic`, `feature-grid-basic`
- **Roadmap kits (use as ghost cards):** `cta-split`, `footer-minimal`, `pricing-three`, `testimonial-quote`
- **CLI commands:**
  - Shipped: `npx payload-kit add <slug>`
  - Roadmap: `npx payload-kit doctor`, `npx payload-kit list`
- **Stack tags:** Payload v3 · Next.js App Router · React 19 · TypeScript · Tailwind v4
- **License:** MIT
- **Hero block sample copy:**
  - Eyebrow: "Payload Kits alpha"
  - Headline: "Ship a production-ready hero without manual repo cleanup."
  - Proof items: "Registry-backed install", "Payload-aware wiring", "Types generated automatically"
- **Feature grid block sample copy:**
  - Eyebrow: "Product features"
  - Headline: "Show the product layer with a feature grid that belongs in the repo immediately."
  - Items: "Real install surface", "Text-first schema", "Post-install cleanup handled"

## 12. After Stitch — handover back to engineering

Once a direction is picked:

1. Export the chosen screens to Figma. Share with the team for one round of critique.
2. Update `src/components/landing/content.ts` to remove the `registryColumns` array and any pricing-related strings.
3. Rebuild the landing components (`LandingPage.tsx`, `FaqAccordion.tsx`, etc.) against the new visual system.
4. Add the four new routes: `/registry`, `/registry/[slug]`, `/docs`, `/community`. They can ship in that order; the landing reroute happens last so analytics on the existing page stay clean during the transition.
5. Update FAQs in `content.ts` — keep the four non-pricing questions, drop the Pro question, add one about "How do I contribute a kit?".

---

*End of handover. Questions or pushback → open an issue on the repo or @ Chai directly.*
