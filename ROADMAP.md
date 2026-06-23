# Payload Components Roadmap

Payload Components stays MIT, open-source, and community-first. The roadmap is
about improving the install contract, expanding useful blocks, and making real
contribution paths obvious.

## Current State

- The registry ships 53 installable page blocks across 11 families, with 8 post
  components in development.
- `payload-components add` copies files, wires Payload, regenerates types, and
  records install state.
- `payload-components doctor` checks supported project shape and install drift.
- Fresh Payload smoke testing remains the slower confidence path for releases.
- Anonymous analytics for install-copy and primary-link intent are collected;
  no PII is captured (see [analytics docs](./content/docs/analytics.mdx)).

## Priorities

1. Harden install recovery.
   - Improve diagnostics when anchors move in `RenderBlocks.tsx` or
     `Pages/index.ts`.
   - Keep retry behavior idempotent after partial installs.
   - Expand supported project shapes only with fixtures and docs.

2. Grow the catalog by complete bundles.
   - Ship source, manifest, registry entry, docs, demo twin, and install coverage
     together.
   - Prefer families with real repeated use: CTA, content, team, integrations,
     logos, and editorial post surfaces.
   - Let GitHub issues and real install feedback decide ordering.

3. Keep the public site and docs accurate.
   - Keep README, component docs, LLM routes, and registry metadata aligned with
     `payload-components/registry.json`.
   - Avoid Payload runtime assumptions in the docs site.
   - Keep visual standards token-based and snapshot-backed.

4. Tighten release confidence.
   - Keep the PR gate fast enough for contributors.
   - Run the full release gate before promotion.
   - Run the fresh Payload smoke for pre-release and scheduled confidence.

## Not Planned

- No pricing tiers, license keys, or gated component access.
- No Payload admin/runtime app inside this docs site.
- No broad repo-shape support without a reproducible fixture.
