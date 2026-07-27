import { existsSync, readdirSync } from 'node:fs'

import { expect, test, type TestInfo } from '@playwright/test'

/* Shared platform-baseline guards for the visual specs (components, templates,
 * blog). Import these rather than re-implementing the dance a fourth time.
 *
 * Cross-platform rendering differs (a darwin dev box vs the linux CI image), so
 * every baseline is committed per platform as
 * `<stem>-<project>-<platform>.png` and a small maxDiffPixelRatio absorbs
 * sub-pixel noise. A platform's baselines have to be generated in that
 * platform's own renderer — linux output will never match darwin — which forces
 * the two rules every visual spec shares:
 *
 *   1. A case SKIPS while its current-platform baseline is absent, so a
 *      not-yet-minted platform stays green instead of failing the gate. It must
 *      never skip while explicitly updating, or `--update-snapshots` could
 *      never create that baseline in the first place.
 *   2. That skip would also hide a case shipped without a baseline, so once a
 *      platform has any baseline at all, the coverage guard fails loudly on the
 *      missing ones.
 *
 * Neither guard can see a baseline that exists but is STALE. A visual change
 * minted on only one platform leaves the other platform's committed image
 * showing the old render, and the gate stays green there because a stale
 * baseline is, by definition, the reference it compares against — that is how
 * the blog index kept a pre-redesign darwin baseline through a green `pr-gate`
 * (which only ever renders linux). Mint both platforms for every intended
 * visual change; see "Visual baselines" in CONTRIBUTING.md. */

export type VisualBaselines = {
  /** Names these baselines in skip and failure messages, e.g. `component baselines`. */
  label: string
  /** How to mint them, quoted in skip and failure messages. */
  mintHint: string
  /**
   * Fail instead of skipping when the platform has no baselines at all. Set it
   * where an unminted platform is a real defect rather than a not-yet state.
   */
  requireMinted?: boolean
  /** Directory holding the committed `<stem>-<project>-<platform>.png` files. */
  snapshotDir: URL
}

/* Playwright's `all` and `changed` modes overwrite baselines; the default
 * `none` / `missing` compare modes must not be treated as an update. */
const isUpdating = (mode: TestInfo['config']['updateSnapshots']) =>
  mode !== 'none' && mode !== 'missing'

const platformSuffix = (projectName: string) => `-${projectName}-${process.platform}.png`

/**
 * Coverage guard: every expected stem must have a current-platform baseline
 * once the platform is minted. Call it from a plain (non-page) test.
 */
export const expectCompletePlatformBaselines = (baselines: VisualBaselines, stems: string[]) => {
  const { config, project } = test.info()
  // Nothing to enforce while baselines are being (re)generated.
  test.skip(isUpdating(config.updateSnapshots), 'updating snapshots')

  const suffix = platformSuffix(project.name)
  const minted = existsSync(baselines.snapshotDir)
    ? readdirSync(baselines.snapshotDir).filter((file) => file.endsWith(suffix))
    : []
  // A platform with zero baselines hasn't been minted yet (e.g. a fresh CI
  // image before the visual-baselines workflow runs) — stay green there.
  test.skip(
    minted.length === 0 && !baselines.requireMinted,
    `No ${process.platform} ${baselines.label} yet — ${baselines.mintHint}`,
  )

  // Once the platform is minted, a missing baseline is a real gap (a case added
  // without its baseline) and must fail rather than silently skip.
  const missing = stems.filter(
    (stem) => !existsSync(new URL(`${stem}${suffix}`, baselines.snapshotDir)),
  )
  expect(
    missing,
    `Missing ${process.platform} ${baselines.label} (${baselines.mintHint}): ${missing.join(', ')}`,
  ).toEqual([])
}

/**
 * Per-case guard: skip a case whose current-platform baseline is absent, unless
 * this run is the one minting it. Call it from inside the case's test body.
 */
export const skipWithoutPlatformBaseline = (baselines: VisualBaselines, stem: string) => {
  const { config, project } = test.info()
  const baseline = new URL(`${stem}${platformSuffix(project.name)}`, baselines.snapshotDir)

  test.skip(
    !existsSync(baseline) && !isUpdating(config.updateSnapshots),
    `No ${process.platform} baseline for ${stem} — ${baselines.mintHint}`,
  )
}
