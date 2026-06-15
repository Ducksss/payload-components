/**
 * Captures above-the-fold screenshots of the maintainer's real client sites
 * for the /about showcase. Standalone — NOT part of the e2e suite (it hits
 * live third-party URLs, so it must never gate CI). Run manually after the
 * `clientProjects` list changes:
 *
 *   pnpm showcase:capture                 # all projects
 *   pnpm showcase:capture --only=genium   # one (or comma-separated) slugs
 *
 * Output: public/showcase/<slug>.jpg at 1280x800 logical @2x (retina-crisp),
 * captured with reduced motion + forced light scheme so entrance animations
 * and carousels are frozen. JPEG (not PNG) — these are photographic website
 * screenshots that compress to a few hundred KB as JPEG vs. multiple MB as
 * PNG. Plain <img> from /public either way. Commit the resulting JPEGs.
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'

import { clientProjects } from '../../src/lib/site'

const VIEWPORT = { height: 800, width: 1280 } as const
const DEVICE_SCALE_FACTOR = 2
const SETTLE_MS = 1_200
const GOTO_TIMEOUT_MS = 45_000

const OUT_DIR = path.resolve(fileURLToPath(import.meta.url), '../../../public/showcase')

/* Best-effort consent/cookie dismissal so banners stay out of the shot.
 * Site-specific overlays may still need a bespoke step — extend per site. */
async function dismissConsent(page: import('@playwright/test').Page) {
  const labels = [/^accept/i, /^agree/i, /^got it/i, /^allow all/i, /^dismiss/i]
  for (const name of labels) {
    try {
      const button = page.getByRole('button', { name }).first()
      if (await button.isVisible({ timeout: 500 })) {
        await button.click({ timeout: 1_000 })
        return
      }
    } catch {
      /* no matching control — ignore and move on */
    }
  }
}

async function main() {
  const onlyArg = process.argv
    .find((arg) => arg.startsWith('--only='))
    ?.slice('--only='.length)
  const only = onlyArg ? onlyArg.split(',').map((s) => s.trim()).filter(Boolean) : null

  const targets = only
    ? clientProjects.filter((project) => only.includes(project.slug))
    : clientProjects

  if (only && targets.length === 0) {
    console.error(`No clientProjects matched --only=${onlyArg}`)
    process.exitCode = 1
    return
  }

  await mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    colorScheme: 'light',
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    reducedMotion: 'reduce',
    viewport: { ...VIEWPORT },
  })

  for (const project of targets) {
    const page = await context.newPage()
    const outPath = path.join(OUT_DIR, `${project.slug}.jpg`)
    try {
      await page.goto(project.url, { timeout: GOTO_TIMEOUT_MS, waitUntil: 'networkidle' })
      await dismissConsent(page)
      await page.waitForTimeout(SETTLE_MS)
      await page.screenshot({
        clip: { height: VIEWPORT.height, width: VIEWPORT.width, x: 0, y: 0 },
        path: outPath,
        quality: 82,
        type: 'jpeg',
      })
      console.log(`captured ${project.slug} → public/showcase/${project.slug}.jpg`)
    } catch (error) {
      console.error(`FAILED ${project.slug} (${project.url}):`, error)
      process.exitCode = 1
    } finally {
      await page.close()
    }
  }

  await context.close()
  await browser.close()
}

void main()
