# AI Discovery Readiness Design

Status: Approved

Date: 2026-07-21

## Summary

Payload Components will adopt the applicable parts of Appkitekt AI's guide
corpus as a comprehensive, evidence-first hardening pass for the existing
open-source site, documentation, registry, and CLI. The work will improve how
search engines and AI agents discover, interpret, verify, and revisit the
project without turning the repository into an AIAO SaaS product.

The implementation will also preserve the distilled methodology as a
repository-owned Codex plugin. The plugin will bundle a reusable skill that can
audit future changes against a tagged catalog of discovery and trust controls.

## Source corpus

The design is based on the Appkitekt AI Guides library, retrieved between
2026-07-18 and 2026-07-19:

- [Guide library](https://ai.appkitekt.com/guides)
- [Start here](https://ai.appkitekt.com/guides/beginners)
- [Methodology](https://ai.appkitekt.com/guides/methodology)
- [Calculations](https://ai.appkitekt.com/guides/calculations)
- [Constants and sources](https://ai.appkitekt.com/guides/constants)
- [Estimated versus verified](https://ai.appkitekt.com/guides/estimated-vs-verified)
- [Reading the numbers](https://ai.appkitekt.com/guides/reading-numbers)
- [Web versus app](https://ai.appkitekt.com/guides/web-vs-app)
- [The 12 pillars](https://ai.appkitekt.com/guides/pillars)
- [Scoring and weighting](https://ai.appkitekt.com/guides/scoring)
- [Credits](https://ai.appkitekt.com/guides/credits)
- [Traffic and revenue](https://ai.appkitekt.com/guides/traffic-revenue)
- [Measuring impact](https://ai.appkitekt.com/guides/measuring-impact)
- [FAQ](https://ai.appkitekt.com/guides/faq)
- [Glossary](https://ai.appkitekt.com/guides/glossary)
- Pillar surface routes for web, app, and MCP were also inspected. At retrieval
  time, their server-rendered bodies repeated the pillar overview rather than
  exposing additional actionable material.

The implementation will paraphrase the methodology and cite this source
register. It will not copy proprietary prose, reproduce proprietary weights,
or present Appkitekt-specific claims as Payload Components evidence.

## User decisions

The following decisions were approved during design:

1. Optimize the existing Payload Components project rather than build an AIAO
   auditing platform.
2. Limit implementation to repository-controlled code and content.
3. Record console, directory, knowledge-graph, and social actions as
   maintainer-run procedures instead of performing external mutations.
4. Use the comprehensive evidence-first approach.
5. Keep one source of truth for human and machine-readable representations.
6. Package the knowledge distillation as a repo/team plugin with a bundled
   reusable skill and repo-local marketplace entry.

## Goals

- Make the project easy for search engines and AI agents to discover, parse,
  cite, and verify.
- Keep public claims factual, source-backed, and consistent across HTML,
  Markdown, JSON-LD, feeds, registry artifacts, and GitHub.
- Publish truthful freshness instead of build-time freshness.
- Give maintainers a durable checklist for keeping the surfaces aligned.
- Add automated contracts that catch crawl, metadata, feed, schema, and
  machine-readable-content regressions.
- Preserve the methodology in a concise, progressively disclosed Codex skill.

## Non-goals

- No agent monitoring dashboard, audit scoring engine, revenue estimator,
  billing wallet, connector platform, approval service, or push-to-live system.
- No Payload CMS runtime, database, admin routes, or `PAYLOAD_SECRET` for the
  documentation site.
- No MCP server or fabricated `/.well-known/mcp.json`; Payload Components does
  not currently expose callable MCP tools.
- No crawler-specific facts, agent-specific rendering, or content cloaking.
- No fabricated social profiles, knowledge-graph identities, customer proof,
  performance numbers, or verification states.
- No automated submissions or messages to external services.

## Distilled model

The source corpus is reduced to six repo-relevant objectives:

1. **Discovery**: crawlers can reach canonical HTML, Markdown, feeds, sitemaps,
   registry artifacts, and source code.
2. **Selection**: pages state the project's category, supported stack,
   differentiator, installation contract, and component inventory clearly.
3. **Trust**: claims resolve to code, manifests, tests, license text, or public
   repository evidence; response and transport headers are safe.
4. **Freshness**: dated content publishes authoritative dates, and undated
   content does not pretend every deployment was a content update.
5. **Handoff**: humans and agents receive direct paths to installation,
   documentation, registry JSON, per-page Markdown, and GitHub.
6. **Verification**: deterministic checks assert the public contracts, while
   maintainer-run external tasks retain an explicit unverified state until
   evidence exists.

The source corpus's web, app, and MCP surfaces are not treated as interchangeable.
Only the web/docs/registry/CLI controls that match this repository are applied.

## Architecture

The existing runtime boundary remains unchanged:

- `src/`, `content/docs/`, and `content/blog/` are the public Next.js and
  Fumadocs discovery surface.
- `payload-components/` remains the installable registry and target source.
- `tools/payload-components/` and `bin/` remain the CLI implementation.
- The new plugin is developer tooling stored in the repository; it is not
  imported by the site or shipped in the npm package unless a future decision
  explicitly changes the package file list.

Existing canonical data in `src/lib/site.ts`, component manifests, the registry,
Fumadocs sources, and blog frontmatter will feed machine-readable routes. New
data structures will be introduced only where the existing sources cannot
express a required fact without duplication.

## Public discovery surfaces

### Crawler policy

`src/app/robots.ts` will retain an open default policy and explicit AI crawler
rules. The crawler list will be maintained as documentation of intent, not as a
claim that each provider consumes every allowed page.

Crawler rules must not advertise or link to private, non-existent, or
unsupported surfaces. Search APIs may remain excluded from general crawling if
their query behavior would create an unbounded crawl space; primary documents
must remain reachable without them.

### Sitemap and freshness

The sitemap currently assigns `new Date()` to marketing and documentation pages,
which turns every build into a false content update. The new contract is:

- use blog frontmatter dates for blog posts;
- publish an authoritative modified date only when the source owns one;
- omit `lastModified` when no defensible date exists;
- continue enumerating canonical marketing, documentation, component, and blog
  URLs from their source collections.

No file-system modification time or deployment time will masquerade as an
editorial update.

### AI-readable text

The existing `/llms.txt`, `/llms-full.txt`, and per-doc Markdown routes remain
the primary text surfaces. They will be extended so their link and content maps
include applicable blog, feed, registry, and AI discovery documentation without
creating parallel catalogs.

The concise route will stay concise. Detailed prose belongs in the full route
or referenced Markdown pages.

### Update feed

Add a standards-compliant RSS or Atom feed for dated project updates. It will be
generated from blog frontmatter, XML-escape all dynamic values, use canonical
URLs, and advertise itself through page metadata and the AI-readable source map.

The feed will not invent update dates for undated component or documentation
content.

### Structured data

Extend the existing stable `@id` graph rather than emit duplicate identity
nodes. The target model includes:

- Organization, WebSite, CollectionPage, SoftwareApplication, FAQPage, and
  component catalog nodes already present;
- Blog for the blog index;
- BlogPosting and BreadcrumbList for individual posts;
- accurate source/software relationships for the CLI, registry, and component
  entries;
- dates only where blog or other authoritative source data provides them.

All JSON-LD must be valid JSON, use canonical URLs, and match visible content.

### Trust headers

Add broadly safe response headers at the Next.js boundary:

- Strict-Transport-Security for the deployed HTTPS origin;
- X-Content-Type-Options;
- Referrer-Policy;
- same-origin frame embedding protection, because component previews are
  intentionally rendered in same-origin frames;
- a conservative Permissions-Policy.

A Content-Security-Policy is conditional. It will ship only if it supports the
actual Next.js, Fumadocs, font, analytics, image, and script requirements without
falling back to a misleadingly permissive policy or breaking the site.

## Documentation distillation

Add a project-specific documentation page under `content/docs/` and link it from
the documentation tree. It will cover:

- the discovery, selection, trust, freshness, handoff, and verification model;
- every machine-readable public surface and its source of truth;
- evidence states: implemented, verified, estimated, external action required,
  and not applicable;
- why Payload Components does not use agent-specific rendering or publish an
  MCP manifest;
- how to update claims, dates, schemas, feeds, crawler lists, and registry links;
- maintainer-run external steps and the evidence required to mark them done;
- a drift and incident checklist for wrong citations, stale facts, broken
  registry URLs, or crawler regressions.

The page will use concise, project-owned language. It is not an endorsement of
the source vendor or a copy of its commercial product model.

## Repository plugin

### Layout

Create a repo/team plugin with this structure:

```text
plugins/ai-discovery-readiness/
├── .codex-plugin/
│   └── plugin.json
└── skills/
    └── audit-ai-discovery/
        ├── SKILL.md
        ├── agents/
        │   └── openai.yaml
        └── references/
            ├── methodology.md
            ├── audit-catalog.md
            ├── payload-components.md
            ├── sources.md
            └── verification.md
```

Create `.agents/plugins/marketplace.json` as the repo/team marketplace entry.
The entry will use these required defaults:

- marketplace name: `payload-components`;
- marketplace display name: `Payload Components`;
- installation: `AVAILABLE`;
- authentication: `ON_INSTALL`;
- category: `Productivity`;
- local source path: `./plugins/ai-discovery-readiness`.

The plugin manifest will start at version `0.1.0` and use real repository
metadata, MIT licensing, and `./skills/`. It will identify the developer as
Payload Components, link to the public site and GitHub repository, and use
AI/search discovery terms as manifest keywords. It will not declare hooks,
apps, MCP servers, screenshots, icons, or other companion resources that do
not exist.

### Skill behavior

The skill name is `audit-ai-discovery`. Its description will trigger on requests
to audit or improve a website, documentation site, registry, CLI, or developer
tool for AI/search discovery, machine-readable content, crawler access,
structured data, freshness, trust, or verification.

Its generated `agents/openai.yaml` interface will use:

- display name: `AI Discovery Audit`;
- short description: `Audit AI/search discovery and trust surfaces`;
- default prompt: `Use $audit-ai-discovery to audit this project's AI and search discovery surfaces.`

The skill will:

1. identify the target's real surfaces and boundaries;
2. load only the relevant reference sections;
3. inventory existing evidence before recommending changes;
4. classify findings with the approved taxonomy;
5. implement or recommend only applicable controls;
6. verify repository-controlled changes deterministically;
7. keep external actions explicitly unverified until evidence is supplied;
8. reject fabricated scores, revenue claims, social identities, MCP surfaces,
   and agent-specific cloaking.

### Tag taxonomy

Every catalog control will carry four tags:

| Axis      | Values                                                                                  |
| --------- | --------------------------------------------------------------------------------------- |
| Surface   | `web`, `docs`, `registry`, `cli`, `external`                                            |
| Objective | `discovery`, `selection`, `trust`, `freshness`, `handoff`, `verification`               |
| Evidence  | `standard`, `project-contract`, `observed`, `estimated`, `unverified`, `not-applicable` |
| Owner     | `repository`, `maintainer`, `platform`                                                  |

Tags describe status and routing; they are not a numeric score. A control can be
marked verified only when its acceptance evidence exists.

### Progressive disclosure

`SKILL.md` will remain a short procedural router. Detailed methodology, the
control catalog, project state, sources, and commands will live in one-level
reference files. Information will not be duplicated between the skill body and
references.

The skill folder will not include README, installation guide, changelog, quick
reference, or other auxiliary documents prohibited by the skill-authoring
contract.

## Data flow

```text
site.ts + manifests + registry + Fumadocs + blog frontmatter
                           |
          +----------------+----------------+
          |                |                |
        HTML            JSON-LD          sitemap/feed
          |                |                |
          +---------- llms + Markdown ------+
                           |
                 tests verify parity

Appkitekt guide corpus -> distilled references -> audit skill
                                         |
                              tagged recommendations
                                         |
                           repo changes or owner tasks
```

## Error handling and integrity

- Feed generation must escape XML characters and fail tests on malformed output.
- Structured data serialization must preserve the existing safe JSON-LD output
  behavior and remain parseable.
- Missing optional dates must omit date fields rather than fall back to now.
- Canonical URLs must use the normalized `www` production host and the existing
  development override contract.
- A missing optional external identity must omit the identity rather than use a
  placeholder.
- New discovery links must resolve locally or point to an existing public source.
- Security headers must not break route rendering, fonts, analytics, images, or
  registry downloads.
- External tasks must state the owner, required evidence, and recheck cadence.

## Testing strategy

### Focused integration tests

Extend the Vitest site contracts to assert:

- route and canonical-source parity;
- sitemap coverage and absence of fabricated build-time dates;
- feed generation, ordering, canonical URLs, and XML escaping;
- structured-data builders for blog and software/source relationships;
- crawler inventory and route policy;
- `llms` source maps include the new guide and feed;
- plugin and skill files remain internally consistent.

### End-to-end tests

Extend the GEO Playwright suite to assert:

- feed content type and required XML elements;
- discovery link metadata;
- trust headers on representative HTML and machine-readable responses;
- Blog and BlogPosting JSON-LD;
- new documentation Markdown negotiation;
- existing canonical, overflow, accessibility, and AI-readable contracts remain
  green.

### Plugin and skill validation

Use the official authoring helpers:

```bash
python3 /Users/chaipinzheng/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  plugins/ai-discovery-readiness/skills/audit-ai-discovery

python3 /Users/chaipinzheng/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py \
  plugins/ai-discovery-readiness
```

Run realistic local invocation scenarios against the skill references and
acceptance checklist. The current environment prohibits unsolicited subagent
delegation, so no subagent forward-test is part of this implementation.

### Release gate

After focused checks, run the repository's complete local release gate:

```bash
pnpm test:release
```

## External maintainer actions

The project guide and skill catalog will record, but not perform, relevant
external actions such as:

- verify the production sitemap in Google Search Console and Bing Webmaster;
- verify the live registry endpoints and submit the documented shadcn directory
  entry after deployment;
- evaluate IndexNow only if the deployed host and release workflow can support a
  defensible key and update cadence;
- add real social or knowledge-graph identities only after the maintainer owns
  and verifies them;
- periodically sample major AI/search answers for stale or fabricated claims;
- record evidence and review dates for any completed external control.

These are owner-run steps because they require accounts, credentials, public
submissions, or human judgment.

## Acceptance criteria

The implementation is complete when:

1. Public crawler, sitemap, feed, Markdown, JSON-LD, canonical, registry, and
   security-header contracts are implemented and tested.
2. Sitemap freshness is truthful and no longer resets all content dates on each
   build.
3. Blog and update content are discoverable through HTML, structured data,
   sitemap, feed, and AI-readable indexes.
4. The project-specific methodology page is published and included in the docs
   tree and machine-readable surfaces.
5. The repo/team plugin and bundled skill exist, contain no placeholders, and
   pass both official validators.
6. The tagged catalog distinguishes implemented, verified, estimated,
   unverified, and not-applicable controls.
7. No agent-specific cloaking, fabricated MCP manifest, unsupported identity,
   commercial pricing logic, or AIAO product runtime is introduced.
8. The full release gate passes, or any environment-only limitation is recorded
   with the exact successful focused checks and failure evidence.

## Risks and trade-offs

- Explicit crawler user-agent lists age. The maintainer checklist and tests make
  drift visible, while the wildcard allow rule keeps unknown crawlers from being
  accidentally blocked.
- `llms.txt` is an emerging convention rather than a universal standard. It is
  retained as an additive source map, never as the only path to content.
- Structured data can become duplicative. Stable `@id` references and shared
  builders keep identity nodes canonical.
- Security policies can break modern framework output. Safe headers ship
  unconditionally; CSP remains evidence-gated.
- A repo-local marketplace is another maintained artifact. Official scaffold
  and validation scripts make its contract explicit and reproducible.
- Source methodology may change. The source register records retrieval dates,
  and the skill treats external claims as references rather than timeless facts.
