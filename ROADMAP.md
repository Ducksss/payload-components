# Payload Components Roadmap

Payload Components stays MIT, open-source, and community-first. The roadmap is
about improving the install contract, expanding useful blocks, and making real
contribution paths obvious.

Active, scoped work lives in the [GitHub issue queue][issues]; the priorities
below group it rather than replace it. Anything not tracked as an issue is a
direction, not a commitment. New contributors can start with
[`good first issue`][gfi] or [`up-for-grabs`][ufg].

## Current State

- The registry ships 58 installable page blocks across 12 families, with 8 post
  components in development.
- `payload-components add` copies files, wires Payload, regenerates types, and
  records install state.
- `payload-components doctor` checks supported project shape and install drift.
- Fresh Payload smoke testing remains the slower confidence path for releases.
- Anonymous analytics for install-copy and primary-link intent are collected;
  no PII is captured.

## Priorities

Each priority links representative issues; the [full queue][issues] has the rest.

1. Harden install recovery.
   - Improve diagnostics when anchors move in `RenderBlocks.tsx` or
     `Pages/index.ts` ([#121]).
   - Keep retry behavior idempotent after partial installs.
   - Expand supported project shapes only with fixtures and docs.
   - Add a dry-run preview ([#120]) and machine-readable `doctor` output ([#19]).

2. Grow the catalog by complete bundles.
   - Ship source, manifest, registry entry, docs, demo twin, and install coverage
     together.
   - Prefer families with real repeated use: CTA, content, team, integrations,
     logos, and editorial post surfaces.
   - Land the eight in-development post components ([#123]–[#126],
     [#132]–[#135]); more heroes ([#136], [#137]), a contact form ([#116]), and
     `pricing-basic` ([#24]) are scoped too — see [`enhancement`][enh].
   - Let GitHub issues and real install feedback decide ordering.

3. Keep the public site and docs accurate.
   - Keep README, component docs, LLM routes, and registry metadata aligned with
     `payload-components/registry.json` — sync inventories ([#103]) and derive
     counts from catalog data ([#131]).
   - Document the anonymous analytics events ([#109]) and canonicalize manual
     install URLs to the www host ([#112]).
   - Avoid Payload runtime assumptions in the docs site.
   - Keep visual standards token-based and snapshot-backed.

4. Tighten release confidence.
   - Keep the PR gate fast enough for contributors.
   - Run the full release gate before promotion.
   - Run the fresh Payload smoke for pre-release and scheduled confidence;
     include every installable item in its defaults ([#119]) and verify the live
     registry matches local ([#105]).
   - Run the packed CLI smoke before release-sensitive publishes ([#113]).

## Exploring (not committed)

Directions under consideration, not scheduled work:

- Submit Payload Components to the shadcn registry index ([#16]).
- Prove raw `shadcn` URL installs from a clean external project ([#15]).

## Not Planned

- No pricing tiers, license keys, waitlist funnel, or gated component access.
- No Payload admin/runtime app inside this docs site.
- No broad repo-shape support without a reproducible fixture.

[issues]: https://github.com/Ducksss/payload-components/issues
[gfi]: https://github.com/Ducksss/payload-components/labels/good%20first%20issue
[ufg]: https://github.com/Ducksss/payload-components/labels/up-for-grabs
[enh]: https://github.com/Ducksss/payload-components/labels/enhancement
[#15]: https://github.com/Ducksss/payload-components/issues/15
[#16]: https://github.com/Ducksss/payload-components/issues/16
[#19]: https://github.com/Ducksss/payload-components/issues/19
[#24]: https://github.com/Ducksss/payload-components/issues/24
[#103]: https://github.com/Ducksss/payload-components/issues/103
[#105]: https://github.com/Ducksss/payload-components/issues/105
[#109]: https://github.com/Ducksss/payload-components/issues/109
[#112]: https://github.com/Ducksss/payload-components/issues/112
[#113]: https://github.com/Ducksss/payload-components/issues/113
[#116]: https://github.com/Ducksss/payload-components/issues/116
[#119]: https://github.com/Ducksss/payload-components/issues/119
[#120]: https://github.com/Ducksss/payload-components/issues/120
[#121]: https://github.com/Ducksss/payload-components/issues/121
[#123]: https://github.com/Ducksss/payload-components/issues/123
[#126]: https://github.com/Ducksss/payload-components/issues/126
[#131]: https://github.com/Ducksss/payload-components/issues/131
[#132]: https://github.com/Ducksss/payload-components/issues/132
[#135]: https://github.com/Ducksss/payload-components/issues/135
[#136]: https://github.com/Ducksss/payload-components/issues/136
[#137]: https://github.com/Ducksss/payload-components/issues/137
