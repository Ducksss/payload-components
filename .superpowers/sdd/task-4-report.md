# Task 4 report

Implemented blog metadata/footer/sitemap coverage, deferred catalog query URL updates with popstate synchronization, and aligned installation docs and count-free catalog copy.

## Verification

- `pnpm exec tsc --noEmit`

Follow-up TDD evidence: centralized `cliVersion` from `package.json` and moved
`pipelineStages` into `src/lib/site.ts`; About and docs now consume those shared
values. Verified with `pnpm exec tsc --noEmit` and `pnpm lint`.

Follow-up commit: `d5e562a5c4ea6e35a01bbda9f1d8d6f63eb791d8`.

Commit: `57c34351b61e58fdbfb4d9a305140a87e5178320` (`fullstack(fix): align site metadata and product copy`)

Final review-fix commit: `007af67` (`fullstack(test): prove product consistency contracts`).

Final fix evidence:
- RED: catalog input remained bound to the URL query while `history.replaceState` updated only local state; the new catalog contract exposed the stale controlled value.
- GREEN: `pnpm exec vitest run --config ./vitest.config.mts tests/int/fumadocs-site.int.spec.ts -t 'blog routes|catalog search'` — 2 tests passed.
- Removed the remaining sample-content claim from `content/docs/registry.mdx`.
- Full existing `fumadocs-site` file still has three unrelated pre-existing failures (SiteHeader assumptions, countLabel, and MDX parse); the focused new contracts pass.

Task 4 review-fix evidence:
- RED: the stale catalog test still expected numeric page/upcoming counts, the
  corrected first-block link was still `/docs/components`, and installation
  docs lacked the explicit five stage identifiers/order contract.
- GREEN: `pnpm exec vitest run --config ./vitest.config.mts
  tests/int/fumadocs-site.int.spec.ts -t 'blog routes|catalog search|count copy|product-surface'`
  — 4 tests passed.
- GREEN: `pnpm lint` — passed.
- GREEN: `pnpm exec tsc --noEmit` — passed.

Count-copy follow-up evidence:
- RED: `pnpm vitest run tests/int/fumadocs-site.int.spec.ts -t 'numeric catalog counts'` — failed on the stale “About 53 page blocks” callout.
- GREEN: replaced numeric About/blog copy with community-first evergreen wording and removed unused count imports; focused test passed.
- GREEN: `pnpm vitest run tests/int/fumadocs-site.int.spec.ts -t 'numeric catalog counts'`, `pnpm lint`, and `pnpm exec tsc --noEmit` — passed.

Strict stale-export cleanup evidence:
- RED: `pnpm exec vitest run --config ./vitest.config.mts tests/int/fumadocs-site.int.spec.ts -t 'stale numeric catalog counts'` — failed because `installablePageCount` was still exported.
- GREEN: removed `installablePageCount` and `upcomingPostCount` from `src/lib/site.ts`; focused regression assertion now passes.
- GREEN: `pnpm exec vitest run --config ./vitest.config.mts tests/int/fumadocs-site.int.spec.ts -t 'stale numeric catalog counts'`, `pnpm lint`, and `pnpm exec tsc --noEmit` — passed.
