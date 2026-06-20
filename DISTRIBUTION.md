# Payload Components Distribution Roadmap

How Payload Components earns attention, adoption, and contributions — without
betraying the community-first, MIT, no-gating promise in [ROADMAP.md](./ROADMAP.md).

`ROADMAP.md` is about the **product** (the install contract and the catalog).
This document is about **distribution** — getting the product discovered, cited,
and talked about. The two never contradict: nothing here adds pricing, license
keys, a waitlist funnel, or gated components.

## The opportunity

The technical side of distribution is already strong: an npm package, a
shadcn-compatible registry, 44 live blocks, `/llms.txt`, JSON-LD, dynamic Open
Graph, a blog, and full community scaffolding. What is missing is **demand-side
distribution** — being found and recommended.

The decisive fact from ecosystem research: **there is no centralized Payload CMS
block/component registry yet.** PayloadKit is a full project scaffold;
shadcnblocks is a boilerplate; PayloadBlocks appears dormant. That is the wedge.
Payload Components can own the category before anyone else does.

## Positioning spine (one narrative, repeated everywhere)

- **One-liner:** *The shadcn registry for Payload CMS — blocks that arrive wired, not pasted.*
- **Wedge:** the first centralized, MIT, copy-paste Payload **block** registry.
  Not a scaffold, not a boilerplate — incrementally adoptable into an existing repo.
- **Proof, not adjectives:** the wiring ledger, the git-diff install, the nightly
  fresh-repo smoke. Reuse the exact site copy (`heroHeadline`, `wiringLedger`, the
  FAQ in `src/lib/site.ts`) so the message stays identical from tweet → README →
  docs → `llms.txt`.

Repeat this spine verbatim. Consistency is what makes a category name stick.

## Four compounding channels (run continuously, weeks 1–8 and beyond)

### 1. Ecosystem placement — highest ROI, lowest effort
- **awesome-payload**: open a PR to [`DanailMinchev/awesome-payload`](https://github.com/DanailMinchev/awesome-payload)
  adding a "Blocks / Components" entry. High SEO value + community credibility.
- **GitHub topics**: already comprehensive (`payload-cms`, `payload-blocks`,
  `shadcn`, `nextjs`, `component-library`, …). The repo is at GitHub's 20-topic
  cap — if you want discovery emphasis, swap a weak topic (`help-wanted`,
  `first-timers-only`) for `payload-plugin` or `shadcn-registry`.
- **Payload Directory** ([payloaddirectory.dev](https://www.payloaddirectory.dev/))
  and **Payload Market** ([payload.market](https://payload.market/)) — submit a listing.
- **awesome-shadcn-ui lists** (birobirobiro, bytefer) + the shadcn registry
  directory — frames the project inside the wider shadcn ecosystem, not as a competitor.

### 2. GEO / LLM discoverability — the structural advantage
Already best-in-class (AI crawler allowlist, `/llms.txt`, `/llms-full.txt`,
JSON-LD). Keep enriching the llms routes so Claude / ChatGPT / Cursor / v0
recommend Payload Components for "payload cms blocks" prompts. The llms routes now
state the "first centralized Payload block registry" positioning explicitly.
- **Cadence:** quarterly, ask the major assistants "how do I add a hero block to
  Payload CMS" and check whether they surface `payload-components add`. Treat a
  miss as a docs/llms gap to close.

### 3. SEO content engine — the blog already exists at `/blog`
Target the confirmed content gaps, one post each, cross-posted to dev.to +
Hashnode (`#payloadcms`). Each post links the catalog + a specific component doc;
titles mirror the FAQ questions already pinned in `faqEntries`.
- "How to add a hero block to Payload CMS" — high buyer-intent. **(seeded in this PR)**
- "Payload CMS block library: copy-paste blocks, wired not pasted" — category-defining.
- "payload-components vs hand-wiring blocks" + an honest "vs PayloadKit / vs plain
  `shadcn add`" comparison.
- Expand and promote the existing "Anatomy of an install" post.

### 4. Build-in-public on X + creator outreach — the amplifier
The single biggest lever for indie dev-tool growth.
- Founder X account, 2–3 posts/week: new components (with live-preview GIFs),
  install diffs, a "building the Payload block registry in public" thread series.
  Reply genuinely in the Payload / Next.js / shadcn niche.
- Direct outreach to Payload creators — **Build with Matija** (the most prolific
  Payload content creator), DEV `payload-cms` authors, and the Payload Discord
  (with permission) — offering a featured integration or tutorial.

## The launch moment (gated behind a readiness bar, ~week 6–8)

Fire only when the bar is met: the **/showcase page has ≥3 real community installs**,
the README has a working demo GIF, the live catalog and `npx payload-components add`
are flawless, and the founder X account has some warm audience.

- **Show HN** (Tue–Thu, 9am–12pm ET): *"Show HN: Payload Components – copy-paste
  CMS blocks that arrive wired, not pasted."* Maker comment ready; stay online
  2–4h answering. Roughly 1.4 GitHub stars per upvote.
- **Product Hunt** (12:01am PT, same week): gallery leads with the terminal install
  and the live catalog.
- **Payload Discord / GitHub Discussions** announcement + the cross-posted launch
  blog post.
- Hold the *second* launch 12–18 months out — a weak follow-up burns credibility.

## Sustainability — free forever + donations

Every component stays MIT and free; **donations never gate anything.** A
`.github/FUNDING.yml` is in place so the GitHub "Sponsor" button activates the
moment GitHub Sponsors / Open Collective is enabled. This funds maintenance time
only — it is not a pricing tier, a license key, or gated access, so it is fully
consistent with `ROADMAP.md`.

## Metrics & cadence

Review monthly:

- GitHub stars, npm weekly downloads (`payload-components`), `/r/registry.json` hits.
- awesome-payload merge, Payload Directory / Market listings live.
- AI-citation spot-checks (channel 2).
- X followers, `/showcase` submissions via the show-and-tell issue template.

**Leading indicator the wedge is working:** inbound show-and-tell issues from
people who found the project *without* you telling them.

## Execution checklist

### Shipped in this PR (in-repo)
- [x] This `DISTRIBUTION.md` + a reconciliation note in `ROADMAP.md`.
- [x] `.github/FUNDING.yml` (activates when Sponsors is enabled).
- [x] `/showcase` page that delivers on "early installs get featured", with an
      empty-state CTA to the show-and-tell issue template (`src/app/showcase/page.tsx`,
      `communityShowcase` in `src/lib/site.ts`).
- [x] GEO enrichment of `/llms.txt` + `/llms-full.txt` (positioning line; all
      pinned GEO-contract substrings preserved).
- [x] `/showcase` and `/blog` added to the sitemap (posts are crawled via the `/blog` index).
- [x] Seed SEO post: "How to add a hero block to Payload CMS" (`content/blog/`).
- [x] README links to Discussions, Showcase, Blog, and this roadmap.

### Needs your action (external — see notes inline)
- [ ] Create / confirm the **founder X handle**; then wire it into the footer +
      README and start the build-in-public cadence.
- [ ] Enable **GitHub Sponsors** (and/or Open Collective); then surface the
      Sponsor link in the footer/README. (`FUNDING.yml` already references `Ducksss`.)
- [ ] Footer social links (X / Discussions / Sponsors): adding these changes the
      `landing-home-*.png` visual baselines, which must be regenerated **on the CI
      platform** — do it in a dedicated PR with `--update-snapshots`.
- [ ] Submit the **awesome-payload** PR, the **Payload Directory**, and **Payload
      Market** listings.
- [ ] Record the README demo GIF — `vhs`/`asciinema` are not installed in CI and a
      real recording needs a target Payload project. Suggested `vhs` tape:

      ```tape
      # demo.tape — render with: vhs demo.tape  (https://github.com/charmbracelet/vhs)
      Output payload-components-add.gif
      Set FontSize 18
      Set Width 1100
      Set Height 600
      Set Theme "Dracula"
      Type "npx payload-components add hero-basic"  Sleep 600ms  Enter
      Sleep 6s
      ```

      Run it against a real Payload v3 + Next.js starter so the output is genuine,
      then commit the GIF to `public/` and embed it near the top of the README.
