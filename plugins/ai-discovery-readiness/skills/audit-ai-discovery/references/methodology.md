# Evidence-first discovery methodology

## Purpose

Use this methodology to make public information easier for search engines and AI
systems to retrieve, interpret, verify, and revisit. It does not promise ranking,
citation, recommendation, traffic, or revenue. Those outcomes depend on systems and
contexts outside the audited project.

The methodology distills the Appkitekt AI Guides corpus listed in `sources.md` into
controls suitable for repositories and public developer products. It does not retain
the source vendor's commercial workflow, proprietary wording, constants, or weights.

## Start with the real surface

Classify the target before selecting controls:

- **Web:** public URLs, HTML, HTTP behavior, structured data, feeds, sitemaps, and
  external identity references.
- **Docs:** authored source, navigation, search, page-level Markdown, code examples,
  change records, and canonical technical claims.
- **Registry:** public indexes, item manifests, schemas, source payloads, versions,
  reproducibility, and install targets.
- **CLI:** package identity, help, errors, project detection, deterministic behavior,
  state, recovery, and public documentation.
- **App:** store listings, deep links, app metadata, privacy declarations, releases,
  and platform-specific indexing. Use only when a real app exists.
- **MCP:** discoverable server metadata, tool contracts, authentication, safety, and
  live tool verification. Use only when a real MCP server exists.
- **External:** search consoles, directories, profiles, social accounts, knowledge
  graphs, model answers, and other platform observations.

Mark an absent app or MCP surface `not-applicable`; do not invent one to improve an
audit result.

## Six objectives

1. **Discovery:** the canonical surface is reachable and linked through ordinary web
   or platform standards.
2. **Selection:** a retriever can determine what the product is, who it serves, what
   makes it different, and which artifact or page answers the current need.
3. **Trust:** factual claims resolve to primary evidence such as code, manifests,
   tests, policies, releases, or owned profiles.
4. **Freshness:** change signals reflect authoritative content dates and versions,
   not artificial activity.
5. **Handoff:** a human or agent can move from explanation to the correct docs,
   install, API, registry artifact, issue tracker, or maintainer action.
6. **Verification:** observable contracts are tested, and unobservable third-party
   outcomes remain explicitly uncertain.

These are lifecycle objectives, not a funnel with guaranteed conversion. A control may
support several objectives.

## Evidence hierarchy

Prefer evidence in this order:

1. **Primary deterministic evidence:** source, schema, generated artifact, automated
   test, signed release, or direct HTTP response.
2. **Project-contract evidence:** documented invariant with an owner and regression
   test.
3. **Dated observation:** screenshot, console state, search result, model answer, or
   profile inspection with time and environment.
4. **Estimate:** modeled traffic, impact, value, confidence, or effort with assumptions.
5. **Unknown:** unavailable, stale, ambiguous, or contradictory evidence.

Never turn levels 3–5 into level 1 through confident wording.

## Status model

- `verified`: current acceptance evidence directly passes.
- `implemented`: repository or configuration contains the control, but deployed or
  external evidence has not been observed.
- `unverified`: the control may exist, but evidence is absent, stale, inaccessible, or
  contradictory.
- `missing`: the control applies and is absent or failing.
- `not-applicable`: the surface/control does not fit, with a recorded reason.

An estimate is an evidence type, not a passing status. A control supported only by an
estimate stays `unverified` unless its acceptance condition is itself an estimate.

## Audit sequence

### 1. Establish identity and boundary

Record canonical name, URL, repository/package identity, audience, product category,
surface types, deployment boundary, and forbidden or private areas. Resolve duplicate
hosts and historical names before auditing discoverability.

### 2. Inventory existing evidence

Search before building. List routes, metadata sources, structured data builders,
content collections, registry schemas, package manifests, tests, policies, releases,
and external profiles. Identify duplicated claims and generated outputs.

### 3. Select applicable controls

Use the catalog by surface. Exclude irrelevant controls from the denominator. State why
conditional controls such as MCP discovery, app-store metadata, IndexNow, or CSP do or
do not apply.

### 4. Trace every public claim

For each important claim, record:

- exact wording and locations;
- primary source of truth;
- machine-readable representation;
- visible human representation;
- owner and update trigger;
- acceptance evidence;
- failure mode when the source drifts.

Prefer generated parity from one source over manual synchronization.

### 5. Fix in dependency order

Use this order when several gaps interact:

1. canonical identity and route correctness;
2. public access, rendering, content types, and status codes;
3. explicit content and source-backed claims;
4. structured and alternate representations;
5. truthful dates, versions, and feeds;
6. trust and security delivery defaults;
7. deterministic tests and deployed checks;
8. external submissions or observations.

### 6. Verify locally and at the edge

Build-time success does not prove deployment behavior. Check both repository contracts
and live responses, including redirects, canonical host, headers, content type, body,
and cache. External platforms may lag; record pending recrawls as external state.

## Measurement and scoring

Prefer a finding ledger over a single score. When a user explicitly requests scoring:

- score only applicable controls;
- disclose every weight and denominator;
- keep evidence confidence separate from control completion;
- avoid false precision;
- show missing/unverified controls rather than silently assigning zero or full credit;
- report sensitivity when a weight materially changes the result;
- never compare products using undisclosed or vendor-specific constants.

A simple transparent model is:

```text
completion = sum(applicable_weight × completion_state) / sum(applicable_weight)
confidence = sum(applicable_weight × evidence_confidence) / sum(applicable_weight)
```

Define state mappings in the report. One defensible mapping might use `verified=1`,
`implemented=0.7`, `unverified=0`, and `missing=0`, but it is a local decision, not a
universal truth. Never score `not-applicable` controls.

## Traffic, revenue, and impact

Treat traffic and revenue projections as scenario estimates. State source period,
attribution window, baseline, conversion assumptions, uncertainty, and excluded
effects. Do not claim an AI discovery change caused business outcomes merely because
metrics changed afterward.

For measurable impact:

1. record a baseline before changes;
2. define leading technical indicators and lagging product outcomes;
3. release a bounded change set;
4. annotate deployment and recrawl dates;
5. compare suitable windows while accounting for releases, seasonality, campaigns, and
   platform changes;
6. preserve raw observations and methodology;
7. prefer directional conclusions when attribution is weak.

Useful leading indicators include successful crawl, indexed canonical URLs, valid
structured data, feed fetches, registry downloads, docs search use, and install command
completion. Citations, referred sessions, package downloads, installs, issues, and
contributions may be lagging indicators. None is automatically causal.

## Safety and integrity

- Publish the same facts to users and crawlers.
- Keep robots policy separate from access control.
- Use real identities and omit unknown ones.
- Emit dates only from authoritative sources.
- Escape generated formats and validate their syntax.
- Avoid repeated low-value pages made only for keyword coverage.
- Preserve user privacy; do not introduce tracking merely to create an audit metric.
- Treat security headers as delivery controls that require compatibility testing.
- Document assumptions, unavailable evidence, and owner handoffs.

## Compact glossary

- **Canonical:** preferred public identity for equivalent content.
- **Citation readiness:** content is explicit, attributable, and linked to evidence;
  it is not a guarantee of citation.
- **Cloaking:** materially different content served to crawlers and users.
- **Discovery surface:** a representation or profile through which content can be found.
- **Evidence confidence:** strength and recency of proof, separate from completion.
- **Freshness signal:** a source-backed date or version indicating real change.
- **Handoff:** the route from an answer to a useful next action or artifact.
- **Machine-readable alternate:** feed, JSON-LD, Markdown, manifest, or plain-text view
  derived from canonical source.
- **Primary evidence:** code, artifact, response, test, policy, or owned record directly
  supporting a claim.
- **Selection:** ability to decide that a source or artifact matches a request.
- **Verification:** deterministic or dated observation against an acceptance condition.
