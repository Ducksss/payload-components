# Payload Components project profile

## Boundary

Payload Components is both a Fumadocs/Next.js public site and an MIT registry + CLI
that installs target Payload CMS code into consumer repositories. The public site is
not a Payload CMS runtime and must not gain an admin, database, collections, globals,
preview runtime, or `PAYLOAD_SECRET` requirement.

## Canonical identity

- Name: Payload Components
- Canonical site: `https://www.payload-components.xyz`
- Source: `https://github.com/Ducksss/payload-components`
- License: MIT
- Package/binary: `payload-components`
- Primary category: typed Payload CMS v3 blocks for Next.js, installed with wiring
- Core claim: the wrapper copies source, registers the block, maps the renderer,
  regenerates types and the admin import map, and records reviewable install state.

Verify these values against current repository data before reporting them.

## Source map

| Surface | Source of truth |
| --- | --- |
| Shared site identity/copy | `src/lib/site.ts` |
| HTML routes and metadata | `src/app/` |
| Docs | `content/docs/`, `source.config.ts`, `src/lib/source.ts` |
| Blog and dates | `content/blog/`, `src/lib/blog-source.ts` |
| Structured data | `src/lib/structured-data.ts`, page routes |
| Robots/sitemap/feed | `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/feed.xml/route.ts` |
| AI text/Markdown | `src/app/llms*.txt`, `src/app/llms.mdx/`, `src/proxy.ts` |
| Registry source | `payload-components/registry.json`, `payload-components/source/` |
| Wiring contracts | `payload-components/manifests/`, schema, support matrix |
| CLI behavior | `tools/payload-components/`, `bin/payload-components.mjs` |
| Generated public registry | `public/r/` (ignored; never hand-edit) |
| Tests | `tests/int/`, `tests/e2e/` |

## Current discovery contracts

- `robots.txt` allows public documents, disallows unbounded `/api/` crawling, and points
  to the canonical sitemap.
- `sitemap.xml` inventories marketing, docs, blog, and component URLs. Undated evergreen
  pages omit `lastModified`; blog dates come from frontmatter.
- `feed.xml` is deterministic RSS from blog frontmatter and is advertised in root metadata.
- `llms.txt` is the concise link/FAQ/component map.
- `llms-full.txt` compiles docs and blog bodies.
- docs have direct/negotiated Markdown routes.
- JSON-LD uses stable Organization, WebSite, SoftwareApplication, documentation, catalog,
  Blog, BlogPosting, FAQ, breadcrumb, and TechArticle nodes.
- public registry JSON and GitHub provide primary implementation evidence.
- security headers intentionally allow same-origin framing because live component previews
  use same-origin iframes.

## Repository invariants

- Keep public runtime code under `src/`, docs under `content/docs/`, and blog source under
  `content/blog/`.
- Keep installable Payload target code under `payload-components/source/`.
- A component ships source, manifest, registry entry, docs, demo twin, and installer tests
  together.
- Demo twins mirror component source class literals and stay non-interactive/aria-hidden.
- Direct shadcn installs copy files; the wrapper CLI owns Payload wiring and post-install.
- No commercial pricing, license keys, gated tiers, waitlists, or fabricated customer proof.
- Preserve forced-light UI and preview behavior while changing headers or metadata.

## Evidence lookup sequence

1. Read `AGENTS.md` and repository status.
2. Inspect `src/lib/site.ts` before changing public facts.
3. Trace a component claim through `componentEntries`, registry item, manifest, source,
   docs page, and install test.
4. Trace freshness through blog frontmatter, feed output, and sitemap output.
5. Trace identity through `siteUrl`, route metadata, structured `@id` values, GitHub, and
   package metadata.
6. Validate source generation before TypeScript in a fresh worktree.

## External states

Keep these `unverified` until a maintainer supplies dated evidence:

- production deployment of newly added routes/headers;
- Google/Bing console property and sitemap state;
- shadcn registry directory submission/listing;
- real social/community profile parity;
- search results and AI answer/citation samples;
- traffic, referral, download, install, or contribution impact.

Do not perform submissions, profile edits, public posts, or account actions without explicit
authority.

## Not applicable by default

- Native app/store controls: no native app is in scope.
- MCP discovery: no callable Payload Components MCP server exists.
- Revenue/pricing conversion: the project is community-first and MIT.
- Customer proof/endorsement controls: use only real, authorized public evidence.
- Build-time freshness: deployment time is not an editorial date.
