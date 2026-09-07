# Repository audit — 6 September 2026

Audited checkout: `45709477` (`payload-components` 1.5.0), plus the existing working-tree dependency fixes. The findings below describe the pre-remediation checkout. The authorized implementation and its validation are recorded in the remediation section at the end.

## Assessment

The repository has a sound architectural split and substantial useful testing. It also has **real consumer-facing safety/correctness gaps, excessive unconditional CI work, and an oversized editorial tooling/test subsystem**. A wholesale rewrite or blanket test deletion would be the wrong response.

Fix the consumer problems first. Then make CI conditional on what changed, preserve meaningful security and behavioral checks, and remove assertions that merely duplicate editorial copy or implementation structure.

The most concerning mismatch: hundreds of checks protect appearance and exact content, yet the suite misses unsafe draft access and two ways of declaring stale installed source “up to date.”

## Scope and evidence

The scan inventoried all **1,551 tracked files**, inspected dependency declarations and the package allowlist, followed installer and filesystem boundaries, reviewed scaffolded target code, site routes and client import paths, examined all four workflow definitions, ran static dependency analysis, and reviewed representative tests in every major test category. Manual reading was risk-based; this is not a claim that every line received a formal security review.

The audit also inspected two recent successful GitHub Actions runs and current PR checks. Local reproductions used disposable project fixtures and real command/state implementations. No consumer database, production deployment, external publishing, or messages to collaborators were involved.

| Measure                   | Observed result                                                        |
| ------------------------- | ---------------------------------------------------------------------- |
| Tracked file contents     | 236.1 MB, decimal units; not Git history or installed dependencies     |
| Screenshot baseline files | 466 PNGs, 212.3 MB; 233 each for Linux and macOS                       |
| Integration suite         | 667 cases: 666 enabled, 1 opt-in packed-artifact case                  |
| Browser suite             | 619 production cases in 12 specs; development mode lists 557           |
| Current dependency audit  | 0 reported advisories after the pre-existing dependency edits finished |
| Packed CLI                | Approximately 181 KB compressed / 1.13 MB unpacked; 292 files          |
| Recent successful CI runs | 13.2–17.3 minute longest jobs; 47.3–53.3 summed runner-minutes         |

## Findings to fix

### 1. High — scaffolded Pages permits anonymous draft reads

**Location:** [Pages collection](../../payload-components/source/base/collections/Pages/index.ts), lines 18–21 and 46–48.

The base collection installed by `init --scaffold` combines `read: () => true` with `versions: { drafts: true }`. It places no published-status restriction on anonymous reads. A consumer exposing Payload's usual REST API therefore has no collection-level protection against a request such as `GET /api/pages?draft=true` retrieving draft content.

**Impact:** unpublished page content can be exposed in consumer applications using this scaffold. This does not add a Payload API to the documentation site.

**Evidence:** direct inspection of the actual shipped collection and the upstream draft-access contract. Payload explicitly documents restricting draft visibility through the collection's `read` access function. [Payload draft documentation](https://payloadcms.com/docs/versions/drafts).

**Fix:** return a `_status = published` query constraint for anonymous readers and grant draft reads only to appropriately authorized users. Add a real consumer regression covering anonymous draft denial and authorized draft access. This finding was not exercised against a live Payload database during this audit.

### 2. High — source fixes ship without component version changes

**Locations:** [signup manifest](../../payload-components/manifests/call-to-action-signup.json), lines 4–5; [inventory](../../tools/payload-components/inventory.ts), version comparison; [update selection](../../tools/payload-components/commands/update.ts), target selection around line 186.

Commit `3be5a409` fixes the signup component's missing-action behavior and accessible submit label, but the manifest still says `0.1.0` with only “Initial release.” Component update selection depends on manifest versions, independently of the npm package version.

**Reproduced:** installed the actual signup renderer from `3be5a409^` into a disposable fixture and recorded its valid `0.1.0` baseline. With the current CLI:

- `list`/inventory returned `updateAvailable: false`;
- ordinary `update` left the old renderer unchanged;
- `diff` returned clean, because it compared against the recorded old baseline.

**Impact:** existing consumers do not discover or receive fixes through the documented update flow. New installs and old installs can carry different bytes under the same component version.

**Fix:** make each component release immutable. Changes to installed source, including shared source, must bump every affected manifest's version and add a changelog entry. Preserve historical hashes for migrations. Add a release check comparing shipped file content against the previous released manifests. Treat this separately from the following `add` bug: either can hide upgrades on its own.

### 3. High — `add` can mark old source as upgraded without replacing it

**Location:** [add command](../../tools/payload-components/commands/add.ts), lines 393–441, 471–488, and 570–578.

If a recorded component's version differs from the current manifest, `add` proceeds instead of taking the “already installed” return. But it invokes the registry installer only when files are missing. Existing old source is retained, then the current manifest version is recorded.

**Reproduced:** used the repository's real Stats Proof `0.2.0` fixture source and recorded baseline, with the current `0.3.0` manifest/file set available. Before `add stats-proof`, an update was available. Afterwards:

```text
recorded version:       0.2.0 -> 0.3.0
old config unchanged:   true
updateAvailable:        false
diff clean:             true
```

The reproduction also demonstrates that presence checks do not establish source-version identity. In an ordinary older install with additional new files, those missing files may be added while existing old files remain.

**Fix:** when a recorded version differs, preserve it and direct the user to `update`, or explicitly enter the same guarded update planner. Never advance the source version merely because files and wiring exist. Cover `add-template` too, because it calls `add` for its component union.

### 4. High — `update` deletes files before validating the replacement install

**Location:** [update command](../../tools/payload-components/commands/update.ts), lines 329–334.

The update loop removes the component's files and only then calls `addCommand`, which performs target detection, peer-dependency checks and install planning. Failures in those checks occur after deletion and before `add` records a partial attempt.

**Reproduced:** started from a valid recorded Hero Basic install, changed the fixture's declared Payload version to unsupported `^2.0.0`, then ran `update hero-basic` without `--force`. It rejected the project, but all three component files were already gone. Install state still said `installed`.

**Impact:** an avoidable preflight failure breaks the consumer tree and leaves misleading recovery state. Shared family files can affect sibling components too.

**Fix:** resolve and validate the complete update plan before the first deletion. Stage replacement files before committing filesystem changes, and record a recoverable operation before destructive work. Preserve backups for rollback if registry retrieval or post-processing fails. Add failure-injection coverage for preflight, download, write and generator failures.

### 5. Medium — corrupt install state is silently replaced with incomplete ownership

**Location:** [state loader](../../tools/payload-components/state.ts), lines 159–184; [existing-install adoption](../../tools/payload-components/commands/add.ts), lines 407–419.

Malformed state becomes an empty state after a warning. A subsequent successful mutation overwrites the malformed original with whichever components the current invocation touches.

**Reproduced:** recorded Hero Basic and Feature Grid Basic, truncated `state.json`, then ran `add hero-basic`. The new state contained only Hero Basic; the other component's source and wiring were still present.

**Impact:** ownership, local-edit baselines and installed-component inventory are lost. A later shared-file decision cannot account for an install that vanished from state. The existing test explicitly approves the empty-state fallback, so more tests alone will not fix the policy.

**Fix:** distinguish missing state from corrupt state. Refuse mutations on corruption, preserve the original bytes, and provide an explicit repair/reconstruction path that does not bless arbitrary local source as pristine. Validate the parsed state schema as well as its version.

### 6. Medium — scaffold registration mistakes comments and imports for collection registration

**Location:** [base-bundle registration](../../tools/payload-components/base-bundle.ts), lines 71–93.

Unlike the main fragment patcher, this helper searches the entire source for the words `Pages` and `Media` and uses the first raw `collections: [` match. It does not verify membership in the real `buildConfig` collections array.

**Reproduced input:**

```ts
// Pages and Media will be added later
export default buildConfig({ collections: [] })
```

The result was `already-registered`, with the empty array unchanged. Unused imports can produce the same false positive; a commented-out `collections` array can misdirect the anchor.

**Fix:** reuse the masking/scanning infrastructure already present in the main patcher. Resolve the actual configuration property, distinguish imports from registrations, and refuse ambiguous expressions rather than modifying the wrong location.

### 7. Medium — a scaffold retry does not repair a failed dependency install

**Location:** [init command](../../tools/payload-components/commands/init.ts), lines 97–106.

The command copies the base files, then installs `clsx` and `tailwind-merge` only when `created.length > 0`. If package installation fails after copying succeeds, every base file already exists on the next run, so dependency installation is skipped.

**Reproduced:** prepared all eight base files but omitted both dependencies, representing the state after an interrupted/failed package-manager stage. `init --scaffold` completed without adding either dependency.

**Impact:** the advertised rerun leaves copied imports unresolved. The user must discover and install the missing packages manually.

**Fix:** check the base bundle's dependency requirements independently of whether files were created. Install only missing requirements and preserve the existing compatibility checks. Add a retry test where the copy stage succeeds and dependency installation fails once.

## Test suite: what I would keep, change and remove

**The count is not the primary problem.** A registry with 77 components needs broad enumeration: an omitted file or untested variant can break a real install. The suite also represents real historical failures. Keep that knowledge while reducing duplication and brittle assertions.

| Test category                                                                           | Decision                                                       | Reason                                                                                                       |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Filesystem boundaries, traversal, symlinks, process locking                             | Keep on every relevant PR                                      | These protect consumer files; mocking away the filesystem would weaken them.                                 |
| Lifecycle ownership, shared files, drift, localization, partial install recovery        | Keep; extend for findings above                                | Core product behavior and meaningful failure cases.                                                          |
| Generated seed ownership, interruption journals, drafts, media preservation             | Keep                                                           | The generated operator-run scripts can modify real data.                                                     |
| Registry/schema/template contract enumeration and demo-twin fidelity                    | Keep                                                           | Cheap checks across every component; intentional distribution architecture.                                  |
| Real Payload compilation                                                                | Keep for distribution changes and releases                     | Site `tsc` excludes shipped target code; source parsing alone is insufficient.                               |
| Browser copy/install flows, search, consent, navigation, mobile overflow, keyboard/a11y | Keep                                                           | User-visible behavior. Run affected routes on PRs, exhaustive sweeps on broader changes/release/nightly.     |
| Visual baselines                                                                        | Keep a canonical Linux set                                     | The product distributes UI. Screenshot tests are justified; two full OS baseline sets are optional overhead. |
| Exact editorial paragraphs, captions, heading wording beyond actual public contracts    | Remove or replace                                              | They force intentional copy edits to be made twice without testing behavior.                                 |
| Tests asserting precise workflow job names/counts or import spellings                   | Replace with outcome/semantic checks                           | They make safe restructuring fail even when coverage and policy remain intact.                               |
| Blog raster generation and contact-sheet checks                                         | Run on relevant tooling/assets changes or dedicated validation | Useful tooling tests, but unrelated installer PRs should not pay for them.                                   |

Concrete examples:

- [fumadocs-site.int.spec.ts:201](../../tests/int/fumadocs-site.int.spec.ts): one test pins the troubleshooting title, multiple exact prose lines, exactly four commands and particular JSX attributes. Keep valid links, working/correct commands and telemetry behavior; remove the prescribed phrasing/count unless it is a deliberate product contract.
- [blog-visual-system.int.spec.ts:1467](../../tests/int/blog-visual-system.int.spec.ts): duplicates long exact alt/caption strings for eight figures. Keep accessible text presence, valid assets and truthful fixture labeling; stop pinning every sentence.
- [release-gate.int.spec.ts:135](../../tests/int/release-gate.int.spec.ts): pins exactly four smoke shards and named jobs. Test that every required selected check must succeed and that unsafe publish candidates are rejected. Do not freeze today's scheduling layout.
- The blog visual-system spec alone is **4,069 lines and 73 cases**. The associated `tools/blog` implementation is **7,603 lines**, compared with **13,047 lines for the entire CLI tool directory**. That is a disproportionate maintenance investment in article illustration machinery. Consolidate its templates/helpers gradually, and stop adding one-off assertions for each editorial request.

### Reliability finding

The normal release gate stopped at integration tests: **6 timeouts, 660 passed, 1 skipped**, across four spec files. Several timed-out async tests continued into fixture teardown, producing secondary missing-directory errors.

The same complete integration suite with `--maxWorkers=2` passed **666/666 enabled tests in 84.21 seconds**, versus 95.09 seconds for the failing default run. No source fixes or timeout increases were needed.

**Decision:** bound workers; separate CPU-heavy rendering/typecheck tasks from fast filesystem tests; assign realistic per-operation timeouts where necessary. Do not hide this behind blanket retries or simply raise every timeout. The opt-in pack case should remain a release-level check, not be counted as a broken skipped test.

The complete production browser run later passed 618 cases and timed out once in `templates.e2e.spec.ts:352`, clicking the marketplace-wholesale “For shops” navigation link. Playwright reported an unstable element. That exact case passed alone in 5.9 seconds without changes. The root cause is unconfirmed; retain failure traces and investigate animation/load interactions before changing the test or product. This is useful behavioral coverage, so deleting it or forcing the click would be a poor response.

## CI: what is actually necessary

Two sampled successful Registry Verification runs:

| Run                                                                                   | Longest job | Summed job time | Four fresh-consumer shards combined |
| ------------------------------------------------------------------------------------- | ----------- | --------------- | ----------------------------------- |
| [34021462053](https://github.com/Ducksss/payload-components/actions/runs/34021462053) | 13.18 min   | 47.27 min       | 30.82 min                           |
| [34020531161](https://github.com/Ducksss/payload-components/actions/runs/34020531161) | 17.33 min   | 53.25 min       | 32.26 min                           |

These are measured job durations, not a billing estimate or a long-term percentile. Parallel jobs consume time simultaneously.

### Definite duplication and waste

1. **Bare-app smoke runs four times.** The matrix passes only `--shard-index`. `runSmoke` defaults to both scenarios, and [the bare scenario call](../../tools/payload-components/smoke/fresh-payload-repo.ts) at lines 1313–1321 does not take the selected component shard. All four jobs repeat the same fixed base-bundle scenario. Their logs confirm four “create bare Payload project” stages. Run the bare scenario once; shard only the website/component coverage.
2. **Every PR runs every consumer shard.** There is no change classifier. A site-copy edit still installs and compiles fresh Payload consumers. Add job-level routing; keep an always-running aggregate gate that distinguishes intentional skips from failed/missing work.
3. **No superseded-run cancellation.** The workflow has no `concurrency` group. New commits can leave previous full runs consuming resources. Cancel outdated PR runs; do not use cancellation for active release publication.
4. **Lint, formatting and site typecheck repeat.** `quick-checks` runs them, and `release-gate` starts with the same checks through `test:release`. Keep quick feedback, then give the slower job a command that starts after those checks. Node-version coverage should focus on CLI compatibility rather than repeatedly checking the same site source.
5. **PR correctness is tied to upstream `latest`.** The smoke generator invokes `create-payload-app@latest`. Pin the fixture generator/version for deterministic PR validation; separately test upstream latest on a schedule. Keep the latest sweep because compatibility drift matters, but separate it from regressions introduced by a PR.
6. **Editorial/visual sweeps are unconditional.** Full template snapshots, template a11y, blog graphics rendering and all route checks belong on broad UI changes and full gates. Use transitive dependencies when selecting affected templates/components, so a shared theme change still runs the full affected family.

### Recommended pipeline

| Trigger/change                                                             | Required work                                                                                                                                                                                                        |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Every PR                                                                   | Lint/format/types once; applicable integration contracts; dependency/security checks; aggregate gate                                                                                                                 |
| Site-only PR                                                               | Production build; core site smoke; affected visual/a11y routes. Full UI sweep for global CSS, shared chrome or rendering changes                                                                                     |
| CLI, registry, shared target code, install contracts or dependency changes | All installer/security tests; one bare-app smoke; full shipped-target compilation; changed/affected consumer render coverage. Retain the existing wider shards until narrower compilation/render selection is proven |
| Nightly                                                                    | All components/templates/browser checks; full website smoke shards; one bare smoke; upstream-latest compatibility; dependency audit                                                                                  |
| Promote/release candidate                                                  | Full deterministic gate, packed artifact verification, existing trusted-main publish guard and provenance                                                                                                            |

Do this in two stages: first remove proven duplicate work, cancel obsolete runs, and skip consumer jobs for unrelated site/docs changes. Only then introduce narrower consumer coverage after showing it still compiles every affected shipped source file. Do not drop the real-Payload gate just because site `tsc` is green.

The visible “14 checks” are not 14 separate test suites. At inspection, PR #554 showed 15 checks before the aggregate completed: our jobs plus CodeQL, CodeRabbit, Vercel comments and **two Vercel deployments**. Keep security scanning and the final aggregate. Confirm whether both Vercel projects have distinct purposes; remove an accidental duplicate deployment if they do not. Check names alone are insufficient evidence to remove CodeQL analyses: JavaScript/TypeScript and Actions cover different languages.

## Bloat and maintainability

### 212 MB of screenshot baselines

Baselines are about **90% of the tracked file bytes**. Linux takes 108.3 MB and macOS 104.0 MB. They are meaningful tests, but the duplicated platform set is the largest measurable repository-weight opportunity.

**Decision:** standardize snapshot generation/comparison on the CI Linux renderer, keep browser-invariant local tests on macOS, and regenerate in that canonical environment. Removing the macOS baseline set would remove roughly 104 MB from the working tree. It will not shrink existing Git history; do not rewrite shared history as part of routine cleanup. Preserve Linux baseline coverage guards. Keep the targeted WebKit checks because they cover engine behavior without adding another screenshot set.

### Client preview imports and document weight

[ComponentCatalogBrowser](../../src/components/site/ComponentCatalogBrowser.tsx) is a client boundary. It imports `ComponentCard`, which imports `ComponentPreviewThumb`, which imports the eager registry of every demo twin. This puts the complete demo registry into the catalog client dependency graph.

A local production HTML/asset probe measured:

| Route                         | External script bytes, uncompressed | Same scripts individually gzipped | HTML response bytes, decoded |
| ----------------------------- | ----------------------------------- | --------------------------------- | ---------------------------- |
| `/components`                 | 1.10 MB                             | 310 KB                            | 869 KB                       |
| `/`                           | 956 KB                              | 294 KB                            | 831 KB                       |
| `/docs/components/hero-basic` | 1.52 MB                             | 478 KB                            | 350 KB                       |

These totals include shared framework code, count unique external script tags, exclude CSS/images/inline scripts and are **not** a browser transfer or performance benchmark. They establish payload size; they do not isolate each library's contribution or measure Core Web Vitals.

**Decision:** show inexpensive thumbnails or server-rendered preview shells in the catalog and load the full interactive twin when visible/opened. Separate per-slug client loaders from the eager server registry. Inspect whether the hero wall needs so many live demos on initial render. Add a small route asset budget after profiling, rather than asserting an arbitrary numeric score.

### Dead code: small cleanup, not a large unused dependency problem

Knip found **no unused declared dependencies** and no unused application/tool source files. Its 189 raw unused-file flags were overwhelmingly installable target files, templates and framework/fixture entry points. Those are loaded through registry metadata or conventions; deleting them would break distribution.

There are genuine stale exports/copy constants in `src/lib/site.ts`: `heroEyebrow`, `stackBandLede`, `workflowIntro`, `wiringIntro`, `faqIntro`, `communityIntro`, `composerEmptyHint`, `templatesEyebrow`, `surfaceLinks` and `templateCategoryLabels` had no external usages in the scan. Manually distinguish dead declarations from functions used internally but unnecessarily exported. Do not mass-delete all “unused export” results.

The Vite run explicitly reports that native `resolve.tsconfigPaths` can replace `vite-tsconfig-paths`. Remove the redundant plugin during a scoped tooling cleanup, retaining the test aliases. This is small maintenance savings, not a security fix.

### Complexity hotspots

- `project.ts`: **1,907 lines** mixing detection, scanning, wiring and localization. Extract cohesive modules around the existing behavior; preserve anchor/dedup tests. Do not rewrite it wholesale into a new parser before resolving the proven lifecycle defects.
- Base scaffolding has a separate, weaker patcher; finding 6 is an actual consequence of that duplication.
- `site.ts` is **1,772 lines**, with copy also living in locale messages, template recipes and demo data. Make the ownership map explicit instead of calling it the sole copy source.
- `AGENTS.md` still says bare apps need a future base bundle, although `init --scaffold` and that bundle exist. It also describes fresh smoke as pre-release/nightly while CI requires it on every PR. Update the guide so future contributors do not make decisions from obsolete architecture descriptions.
- Historical `docs/superpowers` plans are modest in bytes. Mark them historical and exclude them from authoritative guidance; deleting them is low priority compared with runtime and CI issues.

## Security controls that are already worth preserving

- Filesystem path containment, symlink rejection, atomic file writes and project locks.
- First-party manifest validation and controlled component names.
- Child-process argument arrays rather than shell-interpolated component input.
- Generated seed private ownership records, operation journaling and no automatic database access by the CLI.
- Embed URL restrictions/sandboxing, same-origin form-action validation and escaped JSON-LD.
- SHA-pinned Actions, read-only default workflow permissions, trusted-main release validation and provenance.
- Architectural separation between the public docs site and installable Payload target code.

The initial dependency audit reported seven advisories in `fast-uri`, `qs` and `@humanfs/node` while the pre-existing dependency update was settling. The working-tree lockfile now resolves `fast-uri 3.1.7`, `qs 6.16.0` and `@humanfs/node 0.16.8`; a fresh audit reported zero. Treat this as a pending dependency fix already present, not an unresolved set of seven exploitable site vulnerabilities. The `fast-uri` SSRF advisory requires normalization of attacker-controlled URLs in an outbound-request decision; that reachability was not established here. [Upstream advisory](https://github.com/fastify/fast-uri/security/advisories/GHSA-fph4-wmhf-6fwf).

A narrow tracked-file credential-signature scan found no private-key, GitHub-token, AWS-access-key or OpenAI-project-key signatures. This was not a full Git-history or external-secret-store scan.

## Validation record

- Lint, formatting, Fumadocs source generation, site TypeScript check and registry reproducibility/schema validation passed in the release sequence.
- Default integration run: 660 passed, 6 timed out, 1 opt-in case skipped.
- Complete bounded-worker integration rerun: 666 passed, 1 opt-in case skipped.
- Production site build and CLI bundle build passed.
- Package dry-run inspected: small distribution artifact; screenshot assets are not shipped in the CLI.
- Seven targeted safety/lifecycle/scaffolding observations documented above; six exercised in disposable fixtures, draft exposure assessed from shipped access configuration plus upstream documentation.
- Production browser verification: 618 passed and 1 navigation timeout in the complete 619-case run. The isolated failing case passed in 5.9 seconds without code changes. All frontend, component visual, template visual and template accessibility batches passed on the first complete run. This is not a claim that the unmodified full release command passed cleanly.
- Local fresh-Payload database smoke was not rerun. The two sampled remote runs passed all four existing shards, which does not test the missing draft-access policy or lifecycle cases above.

## Order of work

1. Fix draft read access and establish component version discipline; ship discoverable patches.
2. Fix update preflight/rollback and prevent `add` from advancing versions without updating source.
3. Make corrupt state fail safely; reuse the scanner in scaffold registration and repair missing dependencies on retries.
4. Bound integration concurrency, run bare smoke once, cancel superseded runs and classify changes before expensive jobs.
5. Remove exact-copy/implementation-shape assertions; retain semantic contracts and behavioral coverage.
6. Standardize visual baselines, reduce eager client preview weight, and gradually simplify editorial tooling and stale documentation.

Do not set a target such as “cut the tests in half.” Measure useful failure detection, stable runtimes and reviewer effort. The seven missing cases above are better additions than another hundred exact-copy assertions.

## Authorized remediation — 6 September 2026

Implemented on `codex/repo-audit-remediation`, preserving the pre-existing dependency overrides.

| Area                 | Implemented change                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Draft access         | New scaffolded Pages restrict anonymous reads to published records. The shipped callback has a regression test and the base bundle compiled in a real Payload 3.88.0 consumer. Existing consumer collections are preserved; README explains how owners apply the fix.                                                                                                                                                               |
| Version discipline   | Signup moves to 0.1.1 so the existing security fix is discoverable through `update`. The old source has a historical baseline. All 77 current components now have frozen source hashes; `registry:snapshot` refuses to replace an existing version. Shared-file changes require bumps for each affected item.                                                                                                                       |
| Add/update ownership | `add` rejects a version change and directs the operator to `update`. Updates preflight all selected components before replacement, save a private durable backup, and restore source, hosts, package files, standard generator outputs, permissions and ownership on failure. A crashed run blocks further CLI mutations until explicit `update --recover`.                                                                         |
| State and scaffold   | Invalid state fails closed. Scaffold registration uses the existing masked scanner, distinguishes imports from collection membership, handles aliases, and refuses ambiguous arrays. Re-running scaffold repairs missing dependencies even when source files already exist.                                                                                                                                                         |
| CI                   | Integration workers are bounded at two. Consumer-affecting changes run one bare smoke plus four website shards. Known site-only PRs skip consumer jobs through a classifier; the required aggregate rejects unexpected skips and failures. Superseded PR runs cancel. Quick lint/format/types checks are not repeated in the slow job. Scaffolder/Payload are pinned to 3.88.0 in normal runs, with latest on the nightly schedule. |
| Repository weight    | Removed the duplicate macOS snapshot set (237 images after integrating the latest dev; over 104 MB). Linux remains the canonical visual renderer and requires baseline coverage in CI. Git history was not rewritten. Removed the redundant Vite paths plugin and ten unused site exports.                                                                                                                                          |
| Test relevance       | Removed exact figure-copy duplication, fixed article dates/counts and minimum-word quotas from integration assertions. Retained link resolution, asset integrity, access, source fidelity, accessibility and installer safety tests. Added regression cases for the actual defects rather than targeting a lower test count.                                                                                                        |

Recovery restores the saved project files, not arbitrary effects of consumer scripts or changes inside `node_modules`. Operators may need to reinstall dependencies or reconcile custom generator outputs. A legacy v2 signup installation made after the unversioned change can be ambiguous; the CLI conservatively protects it instead of inventing a clean historical baseline.

The catalog now receives server-rendered preview slots, so filtering and selection no longer import the complete demo registry into the client bundle. Broad editorial-tool simplification and gradual extraction from `project.ts` remain architectural follow-ups. Those are separate architecture/performance changes. The duplicate Vercel deployment checks were not removed: their distinct purposes have not been established. Linux screenshots and the modified GitHub workflow require the remote PR gate; local macOS checks deliberately skip canonical visual comparisons.

### Remediation validation

- Full integration run: **681 passed, 1 opt-in package case skipped**, in 76.0 seconds. Three additional regression cases were subsequently added; the final focused safety/CLI/classifier run passed all 76 cases. Relevant installer, registry, release-contract and editorial tests were rerun after their final changes.
- The opt-in packaged-CLI test then **passed**, installing through the published tarball/bin with only its runtime dependencies.
- Fresh bare Payload **3.88.0** smoke passed: pack, scaffold, component installation and real consumer TypeScript compilation.
- Lint, formatting, source generation, TypeScript, registry reproducibility/schema validation and production build passed.
- Complete production browser run: **383 passed, 235 intentionally skipped on macOS, one consent assertion raced hydration**. The test now polls for both identifiers to be cleared instead of treating absent server-rendered scripts as proof of hydration. All **10 consent browser tests passed** on the corrected rerun. The complete browser command was not repeated after that test-only correction.
- Latest dependency audit: **zero reported advisories**. The original working-tree dependency fixes remain intact.
- `git diff --check` passed. No production release, remote deployment, history rewrite or consumer-project migration was performed.

This is a tested local remediation with explicit limits, not a claim that the repository is vulnerability-free or that the revised remote CI has already run.

### Integration with current dev (2026-09-08)

The PR incorporates `a7a9d0ca` from dev, preserving managed starter-base updates, file-only article installs, semantic localization consent, shared-file ownership checks and typed CLI exit statuses. All 77 previously snapshotted components needed a new patch version after upstream changed shipped or localized source without versioning it. Their old baselines remain immutable; the four new components receive initial baselines. The generated site catalog carries the new versions.

A failed multi-component localization update now restores every source, the shared helper and the prior ownership state. Retrying after fixing the failure uses the original localization-policy consent. The catalog receives rendered preview slots from its server page, keeping its filtering/selection code independent of the eager demo registry.

The earlier validation above describes the pre-integration revision. Final PR checks and fresh-consumer smoke results are recorded in the PR after integration; they supersede those counts.
