# Tagged audit catalog

## How to use this catalog

Each control declares four routing tags:

- `Surface:` web, docs, registry, cli, app, mcp, or external.
- `Objective:` discovery, selection, trust, freshness, handoff, or verification.
- `Evidence:` standard, project-contract, observed, estimated, unverified, or not-applicable.
- `Owner:` repository, maintainer, or platform.

Set a separate result status: `verified`, `implemented`, `unverified`, `missing`,
or `not-applicable`. The default evidence tag describes the expected proof type, not a
pre-computed result.

## Web controls

### WEB-01 Canonical public origin

Tags — Surface: web · Objective: discovery, trust · Evidence: standard · Owner: repository

- Check: one HTTPS host is canonical; redirects, metadata, sitemap, feeds, JSON-LD, and
  generated absolute URLs agree.
- Accept: representative alternate hosts redirect permanently and public documents emit
  the canonical URL.

### WEB-02 Fetchable primary pages

Tags — Surface: web · Objective: discovery · Evidence: observed · Owner: repository

- Check: important URLs return successful HTML without authentication or required
  client-only rendering.
- Accept: direct HTTP and a browser expose meaningful headings and content.

### WEB-03 Robots policy

Tags — Surface: web · Objective: discovery, trust · Evidence: standard · Owner: repository

- Check: `robots.txt` is syntactically clear, points to the sitemap, does not block public
  canonical documents, and is not used to protect secrets.
- Accept: deployed response matches the intended crawl boundary.

### WEB-04 Canonical sitemap inventory

Tags — Surface: web · Objective: discovery, freshness · Evidence: standard · Owner: repository

- Check: sitemap enumerates indexable canonical URLs from maintained sources.
- Accept: no development/duplicate/private URLs; dates are omitted unless authoritative.

### WEB-05 Truthful page metadata

Tags — Surface: web · Objective: selection, trust · Evidence: project-contract · Owner: repository

- Check: title, description, canonical, robots, Open Graph, and sharing metadata match
  visible content and source identity.
- Accept: route tests and rendered head agree on representative pages.

### WEB-06 Stable structured identity

Tags — Surface: web · Objective: selection, trust · Evidence: standard · Owner: repository

- Check: JSON-LD uses appropriate types, canonical URLs, stable `@id` references, and
  only real organizations, people, software, articles, products, or offers.
- Accept: valid JSON and fields match visible facts; duplicate identity nodes refer by ID.

### WEB-07 Dated update feed

Tags — Surface: web · Objective: discovery, freshness · Evidence: standard · Owner: repository

- Check: RSS/Atom exists when dated updates exist, is advertised in metadata, escapes
  dynamic values, and orders real publication dates.
- Accept: validators and tests confirm canonical links, content type, syntax, and dates.

### WEB-08 AI-readable source map

Tags — Surface: web · Objective: discovery, handoff · Evidence: project-contract · Owner: repository

- Check: a concise plain-text map links primary sources; an optional full representation
  is derived from maintained content.
- Accept: routes return text with canonical links and no private or invented surfaces.
- Note: `llms.txt` is additive and emerging, never a substitute for accessible HTML.

### WEB-09 Internal linking and breadcrumbs

Tags — Surface: web · Objective: discovery, handoff · Evidence: project-contract · Owner: repository

- Check: important pages are reachable through navigation/context links and use visible
  plus structured breadcrumbs where useful.
- Accept: no orphaned primary route; links resolve without redirect chains.

### WEB-10 Semantic and accessible content

Tags — Surface: web · Objective: selection, trust · Evidence: standard · Owner: repository

- Check: unique H1, meaningful hierarchy, descriptive links, text alternatives, keyboard
  behavior, reduced motion, readable source order, and no essential screenshot-only facts.
- Accept: accessibility/e2e checks pass on representative routes.

### WEB-11 Performance and deterministic rendering

Tags — Surface: web · Objective: discovery, selection · Evidence: observed · Owner: repository

- Check: important content is present in the server response, routes avoid unstable or
  blocking dependencies, and assets do not cause layout or overflow failures.
- Accept: production build and route tests pass; field measurements are dated observations.

### WEB-12 Safe delivery headers

Tags — Surface: web · Objective: trust, verification · Evidence: standard · Owner: repository

- Check: HTTPS deployment, HSTS where valid, MIME sniffing protection, referrer policy,
  deliberate framing, and minimum permissions policy.
- Accept: representative responses expose expected headers and intended frames still work.

### WEB-13 Claim-to-evidence paths

Tags — Surface: web · Objective: trust, handoff · Evidence: project-contract · Owner: repository

- Check: product capabilities, compatibility, license, pricing, performance, and social
  proof link to direct evidence.
- Accept: each material claim has one source, owner, and update trigger.

### WEB-14 No crawler-specific facts

Tags — Surface: web · Objective: trust, verification · Evidence: observed · Owner: repository

- Check: crawler user agents receive equivalent facts and functionality.
- Accept: sampled responses differ only for legitimate negotiation, not claims or meaning.

## Documentation controls

### DOCS-01 Single authored source

Tags — Surface: docs · Objective: trust, freshness · Evidence: project-contract · Owner: repository

- Check: HTML, search, Markdown, and full-text representations derive from the same docs.
- Accept: parity tests detect duplicated or drifting catalogs and claims.

### DOCS-02 Explicit product definition

Tags — Surface: docs · Objective: selection · Evidence: project-contract · Owner: repository

- Check: introduction names category, audience, supported stack, differentiator, limits,
  and the first safe action.
- Accept: a reader can answer what it is and what it is not from the opening page.

### DOCS-03 Task-complete guides

Tags — Surface: docs · Objective: selection, handoff · Evidence: project-contract · Owner: repository

- Check: prerequisites, commands, effects, expected output, failure states, recovery, and
  verification are documented together.
- Accept: examples match current interfaces and are covered by tests where executable.

### DOCS-04 Reference contracts

Tags — Surface: docs · Objective: trust, verification · Evidence: project-contract · Owner: repository

- Check: schemas, manifests, API/CLI options, file targets, and compatibility are precise.
- Accept: reference data derives from or is checked against implementation sources.

### DOCS-05 Page-level machine-readable text

Tags — Surface: docs · Objective: discovery, handoff · Evidence: project-contract · Owner: repository

- Check: stable Markdown or text representations exist for canonical docs pages.
- Accept: content type, title, URL, headings, code, and links survive serialization.

### DOCS-06 Searchable information architecture

Tags — Surface: docs · Objective: discovery, selection · Evidence: project-contract · Owner: repository

- Check: navigation, headings, metadata, local search, family links, and terminology make
  authoritative pages distinguishable.
- Accept: metadata references real pages and representative queries find the right result.

### DOCS-07 Sources and uncertainty

Tags — Surface: docs · Objective: trust · Evidence: project-contract · Owner: repository

- Check: external methods and standards are attributed; observations, estimates, and
  unknowns are labeled.
- Accept: no copied proprietary prose or unsupported universal claims.

### DOCS-08 Maintainer operations

Tags — Surface: docs · Objective: freshness, verification · Evidence: project-contract · Owner: maintainer

- Check: release, incident, rollback, external verification, and stale-claim procedures
  name owners and evidence.
- Accept: maintainers have executable commands and a clear external handoff.

## Registry controls

### REG-01 Public canonical index

Tags — Surface: registry · Objective: discovery, handoff · Evidence: observed · Owner: repository

- Check: registry index is public, canonical, documented, cacheable, and references valid items.
- Accept: deployed index returns the declared schema/content type without auth.

### REG-02 Complete item contract

Tags — Surface: registry · Objective: selection, trust · Evidence: project-contract · Owner: repository

- Check: item name, version, type, dependencies, files, install targets, and embedded
  content are complete and truthful.
- Accept: schema validation and representative installs pass.

### REG-03 Reproducible generation

Tags — Surface: registry · Objective: trust, verification · Evidence: project-contract · Owner: repository

- Check: public artifacts rebuild from committed source without hand edits.
- Accept: clean generation produces the expected output and reproducibility tests pass.

### REG-04 Source and artifact traceability

Tags — Surface: registry · Objective: trust, handoff · Evidence: project-contract · Owner: repository

- Check: every shipped file resolves to maintained source and correct consumer target.
- Accept: manifests, registry entries, docs, source files, and install state share identity.

### REG-05 Version and freshness semantics

Tags — Surface: registry · Objective: freshness, trust · Evidence: project-contract · Owner: repository

- Check: versions change intentionally; generated time does not masquerade as content version.
- Accept: release/version policy is documented and item changes are reviewable.

### REG-06 Directory submission evidence

Tags — Surface: external · Objective: discovery, verification · Evidence: unverified · Owner: maintainer

- Check: third-party directory entry is submitted only after live endpoints pass its validation.
- Accept: public PR/listing URL and observation date; otherwise keep `unverified`.

## CLI controls

### CLI-01 Package identity parity

Tags — Surface: cli · Objective: selection, trust · Evidence: project-contract · Owner: repository

- Check: package name, binary, version, repository, homepage, license, and docs agree.
- Accept: package manifest and `--version`/help expose current identity.

### CLI-02 Discoverable help and examples

Tags — Surface: cli · Objective: selection, handoff · Evidence: project-contract · Owner: repository

- Check: help names commands, required arguments, options, effects, and safe examples.
- Accept: help tests pass and docs use supported commands.

### CLI-03 Preflight and compatibility evidence

Tags — Surface: cli · Objective: trust, verification · Evidence: project-contract · Owner: repository

- Check: environment/project compatibility is checked before mutation.
- Accept: unsupported shapes fail clearly without partial unsafe changes.

### CLI-04 Idempotence, state, and recovery

Tags — Surface: cli · Objective: trust, verification · Evidence: project-contract · Owner: repository

- Check: retries converge, state records completed/partial work, and recovery distinguishes
  owned files from patched host files.
- Accept: integration fixtures prove repeat installs and partial recovery.

### CLI-05 Reviewable effects

Tags — Surface: cli · Objective: trust, handoff · Evidence: project-contract · Owner: repository

- Check: mutations are scoped, described, and left as reviewable source/artifact changes.
- Accept: install tests assert exact files/patches and no unrelated mutation.

### CLI-06 Actionable errors

Tags — Surface: cli · Objective: handoff, trust · Evidence: project-contract · Owner: repository

- Check: errors name failed stage, affected path, preserved state, and next safe action.
- Accept: failure tests assert diagnosis and recovery guidance.

## External controls

### EXT-01 Search-console ownership and coverage

Tags — Surface: external · Objective: discovery, verification · Evidence: unverified · Owner: maintainer

- Check: canonical property ownership, sitemap submission, crawl/index issues, and manual
  actions in relevant webmaster consoles.
- Accept: dated console observation by an authorized maintainer.

### EXT-02 Owned identity consistency

Tags — Surface: external · Objective: selection, trust · Evidence: observed · Owner: maintainer

- Check: repository, organization, package, directory, and real social profiles use
  consistent name, URL, category, description, and current capabilities.
- Accept: dated URLs/screenshots from accounts the project actually controls.

### EXT-03 Search result observation

Tags — Surface: external · Objective: discovery, selection · Evidence: observed · Owner: platform

- Check: exact-name and problem-category queries, result canonicalization, snippets, and
  stale pages for a stated locale/date.
- Accept: dated observation; never a guaranteed rank or universal result.

### EXT-04 AI answer and citation sampling

Tags — Surface: external · Objective: selection, trust · Evidence: observed · Owner: platform

- Check: preserved prompt, provider/model, date, answer, citations, false claims, and gaps.
- Accept: reproducible observation record; use it to find source ambiguity, not to claim
  provider endorsement.

### EXT-05 Impact measurement

Tags — Surface: external · Objective: verification · Evidence: estimated · Owner: maintainer

- Check: baseline, release date, recrawl lag, attribution window, confounders, raw metrics,
  and uncertainty.
- Accept: a documented method; causal language only when design supports it.

### EXT-06 Recurring review ownership

Tags — Surface: external · Objective: freshness, verification · Evidence: project-contract · Owner: maintainer

- Check: review cadence for console errors, stale profiles, broken citations, registry
  listings, and sampled answers.
- Accept: named owner, last review, next review, and evidence link.

## Conditional app and MCP controls

### APP-01 Native application discovery

Tags — Surface: app · Objective: discovery, selection · Evidence: not-applicable · Owner: platform

- Apply only to a real native/distributed app. Audit store listing, app/site association,
  deep links, privacy declarations, versions, screenshots, support URLs, and reviews.
- If the target is only a website or CLI, mark `not-applicable` with that reason.

### MCP-01 Real server discovery and contract

Tags — Surface: mcp · Objective: discovery, trust, verification · Evidence: not-applicable · Owner: repository

- Apply only when a real MCP server exposes callable tools/resources.
- Audit server metadata, transport, authentication, tool schemas, side effects, consent,
  error behavior, privacy, and live calls.
- Never add `/.well-known/mcp.json` or a plugin declaration for a nonexistent server.

### WEB-15 IndexNow or push indexing

Tags — Surface: web · Objective: freshness · Evidence: not-applicable · Owner: maintainer

- Conditional on supported deployment, a defensible key, real update cadence, and an
  owner for failure/revocation.
- A sitemap/feed is sufficient when those conditions do not exist.

### WEB-16 Content Security Policy

Tags — Surface: web · Objective: trust, verification · Evidence: unverified · Owner: repository

- Conditional on an inventory of scripts, styles, fonts, images, frames, analytics, and
  framework requirements.
- Accept only after route-aware browser tests prove functionality; do not ship a broken or
  misleadingly permissive policy for checklist completion.
