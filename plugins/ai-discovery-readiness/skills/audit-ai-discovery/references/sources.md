# Source register and distillation map

## Provenance

The methodology was distilled from the Appkitekt AI Guides library at
`https://ai.appkitekt.com/guides`, retrieved 2026-07-18 through 2026-07-19.
This reference paraphrases concepts for repository use. It does not reproduce source prose,
proprietary weights, constants, product screens, or commercial workflow.

Revisit the source before treating any vendor-specific statement as current. Standards and
platform behavior should be verified from their own primary documentation during a live audit.

## Guide-by-guide map

### Guide library

- URL: `https://ai.appkitekt.com/guides`
- Distilled use: inventory the corpus and separate orientation, methodology, calculation,
  interpretation, surface, pillar, impact, FAQ, and glossary material.

### Start here / beginners

- URL: `https://ai.appkitekt.com/guides/beginners`
- Distilled use: begin with a product/surface inventory, identify baseline evidence, avoid
  optimizing unknowns, and convert findings into ordered owner actions.

### Methodology

- URL: `https://ai.appkitekt.com/guides/methodology`
- Distilled use: make scope, evidence, assumptions, calculations, sources, and limitations
  explicit; distinguish assessed surfaces and keep the method reproducible.

### Calculations

- URL: `https://ai.appkitekt.com/guides/calculations`
- Distilled use: show formulas, denominators, applicability, and confidence; do not hide
  exclusions or turn estimates into observations.

### Constants and sources

- URL: `https://ai.appkitekt.com/guides/constants`
- Distilled use: register where constants and benchmarks originate, date them, scope them,
  and avoid treating context-dependent vendor values as universal facts.

### Estimated versus verified

- URL: `https://ai.appkitekt.com/guides/estimated-vs-verified`
- Distilled use: label direct evidence, modeled values, observations, unknowns, and completed
  verification separately. Repository presence does not prove deployed behavior.

### Reading the numbers

- URL: `https://ai.appkitekt.com/guides/reading-numbers`
- Distilled use: interpret magnitude with uncertainty and dependencies; pair any aggregate
  with the underlying control ledger and avoid false precision.

### Web versus app

- URL: `https://ai.appkitekt.com/guides/web-vs-app`
- Distilled use: select controls by actual surface. Web crawl/metadata checks do not replace
  app-store/deep-link checks, and app checks do not establish public web accessibility.

### Pillars overview

- URL: `https://ai.appkitekt.com/guides/pillars`
- Distilled use: group the broad field into discoverability, content/selection, technical
  access, trust/identity, freshness, distribution/handoff, and measurement without assuming
  every pillar is applicable or equally weighted.

### Pillar surface routes

- URLs inspected:
  - `https://ai.appkitekt.com/guides/pillars/web`
  - `https://ai.appkitekt.com/guides/pillars/app`
  - `https://ai.appkitekt.com/guides/pillars/mcp`
- Distilled use: preserve surface-specific routing. At retrieval time the server-rendered
  pages repeated the pillar overview and did not expose additional actionable detail, so no
  unique controls were inferred from unavailable client state.

### Scoring and weighting

- URL: `https://ai.appkitekt.com/guides/scoring`
- Distilled use: disclose weights, exclude `not-applicable` controls, separate confidence
  from completion, and prefer a ledger when a single score would obscure evidence.

### Credits

- URL: `https://ai.appkitekt.com/guides/credits`
- Distilled use: retain attribution and distinguish source concepts from project-specific
  synthesis. Credit does not transfer authority to unsupported claims.

### Traffic and revenue

- URL: `https://ai.appkitekt.com/guides/traffic-revenue`
- Distilled use: treat projections as scenarios with baselines, conversion assumptions,
  attribution windows, and uncertainty; do not claim causality from correlated movement.

### Measuring impact

- URL: `https://ai.appkitekt.com/guides/measuring-impact`
- Distilled use: establish a baseline, annotate changes and recrawl lag, track leading and
  lagging indicators, preserve confounders, and report directional findings when causal
  isolation is weak.

### FAQ

- URL: `https://ai.appkitekt.com/guides/faq`
- Distilled use: answer recurring scope, evidence, score, timing, and verification questions
  explicitly; avoid presenting platform behavior as guaranteed.

### Glossary

- URL: `https://ai.appkitekt.com/guides/glossary`
- Distilled use: normalize ambiguous terminology so maintainers distinguish crawl, index,
  retrieval, citation, recommendation, verification, estimation, and attribution.

## What was intentionally not carried forward

- proprietary numeric weights or constants;
- product-specific credit/billing/workflow mechanics;
- universal claims about model or search-engine behavior;
- inferred content not present in retrievable source;
- revenue or traffic promises;
- any instruction to fabricate profiles, scores, citations, or MCP capability.

## Project adaptation

Payload Components reduces the corpus to six objectives—discovery, selection, trust,
freshness, handoff, and verification—and maps them to web, docs, registry, CLI, external,
and conditional app/MCP surfaces. See `methodology.md` for the reusable model and
`payload-components.md` for the concrete repository implementation.
