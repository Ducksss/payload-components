# GEO Maintenance Runbook

This repo treats Generative Engine Optimization (GEO) as a small set of machine-readable surfaces that must stay aligned with the visible marketing site. GEO does not replace SEO: Google AI Overviews, AI Mode, snippets, and other Google AI features still rely heavily on crawlable pages, core SEO metadata, visible text, internal links, authority, and freshness. The `llms.txt` format is a proposed, low-cost source map for AI crawlers, not a guaranteed ranking signal.

## Surfaces

- Homepage JSON-LD entity graph: exposes answer-ready facts about Payload Kits, the project identity, product, offer, and FAQ content. Keep it synchronized with landing page copy and FAQ claims.
- Resource article schema: every `marketingResources` guide should emit `Article` JSON-LD plus breadcrumbs, using the same title, description, keyword, slug, and summary that render on the page.
- `/llms.txt`: concise AI-readable source map for the public site. It should point to the canonical homepage and resource pages, then list short facts that answer common product questions.
- `/llms-full.txt`: expanded AI-readable source map. It should include the concise source map plus the full public resource guide text, but still avoid claims that are not visible on the site.
- Resource sitemap entries: static resource routes must be discoverable alongside `/` and `/resources`; each `marketingResources` slug should have a matching sitemap entry.

## Update Flow

When landing copy changes:

1. Update the visible source of truth first, usually `src/components/landing/content.ts` and the rendered landing components.
2. Mirror only stable factual claims into the homepage JSON-LD entity graph, especially organization description, product category, offer details, FAQ questions, and FAQ answers.
3. Refresh `/llms.txt` and `/llms-full.txt` so summaries, answer-ready facts, and links match the new visible copy.
4. If claims changed materially, update the GEO and SEO integration assertions that protect those facts.

When `marketingResources` changes:

1. Update `src/content/marketingResources.ts` with the new or edited `title`, `description`, `keyword`, `summary`, `sections`, `slug`, `source`, and `readingTime`.
2. Confirm the `/resources/[slug]` page renders the same title, description, summary, sections, and CTA source parameter.
3. Confirm resource article JSON-LD uses the same title, description, canonical URL, keyword, and breadcrumb label.
4. Confirm the corresponding `/resources/{slug}` entry is present in the static sitemap source generated from `marketingResources`.
5. Update `/llms.txt` and `/llms-full.txt` so the resource list and expanded guide text match the rendered resource page.

## Verification

Run the focused GEO checks after any GEO surface change:

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/geo.int.spec.ts
```

Run type and lint checks before shipping broader copy/schema edits:

```bash
pnpm exec tsc --noEmit
pnpm lint
```

Run the full integration suite when shared content, routes, or sitemap behavior changed:

```bash
pnpm run test:int
```

Run the production build when route handlers, sitemap generation, or public metadata changed:

```bash
pnpm build
```

`pnpm build` also runs `next-sitemap` through `postbuild`, so inspect generated sitemap output when resource discoverability changes.

## Review Checklist

- JSON-LD facts are present, parseable, and match visible page text.
- FAQ schema questions and answers match the rendered FAQ.
- Every `marketingResources` entry has a rendered page, article schema, `/llms.txt` link, `/llms-full.txt` content, and sitemap entry.
- Canonical URLs use the configured public origin, not localhost or placeholder domains in production.
- `llms.txt` files summarize and point to source content; they do not introduce unsupported marketing claims.
