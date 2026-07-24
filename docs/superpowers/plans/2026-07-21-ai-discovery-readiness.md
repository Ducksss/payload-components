# AI Discovery Readiness Implementation Plan

Design: `docs/superpowers/specs/2026-07-21-ai-discovery-readiness-design.md`

## 1. Lock public contracts in tests

Modify:

- `tests/int/fumadocs-site.int.spec.ts`
- `tests/e2e/geo.e2e.spec.ts`

Add failing coverage for:

- truthful sitemap dates;
- RSS route content, ordering, escaping, and discovery metadata;
- sitewide trust headers with same-origin framing;
- Blog and BlogPosting JSON-LD;
- blog/feed links in `llms.txt` and blog content in `llms-full.txt`;
- the AI discovery documentation page and Markdown negotiation;
- the repo plugin, marketplace, skill, and tag catalog shape.

Run the focused Vitest file and confirm the new assertions fail for the expected
missing behavior.

## 2. Implement canonical discovery data and routes

Modify:

- `src/lib/site.ts`
- `src/lib/blog-source.ts`
- `src/app/sitemap.ts`
- `src/app/llms.txt/route.ts`
- `src/app/llms-full.txt/route.ts`
- `src/app/layout.tsx`
- `next.config.mjs`

Create:

- `src/app/feed.xml/route.ts`

Implement:

- canonical feed URL and source-map links;
- sorted blog source helpers and processed blog text;
- RSS 2.0 generation with XML escaping and latest-post build date;
- sitemap entries without deployment-time freshness;
- feed alternate metadata;
- safe sitewide trust headers and crawl metadata caching.

Run focused Vitest after the slice.

## 3. Add structured blog evidence

Modify:

- `src/lib/structured-data.ts`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`

Add Blog and BlogPosting builders that reference the existing Organization and
WebSite IDs, match visible author/date content, and use canonical URLs. Emit
breadcrumbs on the index and posts. Run structured-data integration assertions.

## 4. Publish the project methodology

Modify:

- `content/docs/meta.json`
- `src/lib/site.ts`
- `content/docs/architecture.mdx` if a cross-link is needed

Create:

- `content/docs/ai-discovery.mdx`

Document the six-objective model, evidence states, public source map, crawler
policy, freshness rules, external maintainer actions, and drift response. Add
the page to navigation, footer/source maps, and generated Markdown coverage.

Run `pnpm source:build`, TypeScript, and focused docs tests.

## 5. Scaffold the repo/team plugin

Use the plugin creator to generate:

- `plugins/ai-discovery-readiness/.codex-plugin/plugin.json`
- `plugins/ai-discovery-readiness/skills/`
- `.agents/plugins/marketplace.json`

Use the skill creator to generate:

- `plugins/ai-discovery-readiness/skills/audit-ai-discovery/SKILL.md`
- `plugins/ai-discovery-readiness/skills/audit-ai-discovery/agents/openai.yaml`
- `plugins/ai-discovery-readiness/skills/audit-ai-discovery/references/`

Replace scaffold placeholders with concise imperative instructions and these
references:

- `methodology.md`
- `audit-catalog.md`
- `payload-components.md`
- `sources.md`
- `verification.md`

Validate the four-axis tag taxonomy and keep every detailed reference one level
from `SKILL.md`.

## 6. Validate the plugin and site

Run:

- skill creator `quick_validate.py`;
- plugin creator `validate_plugin.py`;
- focused Vitest;
- registry/document source generation;
- TypeScript and lint;
- focused GEO Playwright tests.

Fix every product defect found by the validators or focused checks.

## 7. Release verification

Run `pnpm test:release`. Inspect `git diff --check`, the complete diff, and the
working tree for unrelated or generated artifacts. Report the implemented
surfaces, plugin location, validation results, and any external maintainer-only
actions without performing them.
