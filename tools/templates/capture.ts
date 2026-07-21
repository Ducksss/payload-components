/**
 * Deterministic poster capture for the /templates showcase gallery and
 * detail pages. Standalone — NOT part of the e2e suite. Run against a local
 * server after a template's visual direction changes (and bump the template's
 * `revision` in the same change):
 *
 *   pnpm dev                                  # or next start
 *   pnpm templates:capture                    # all templates
 *   pnpm templates:capture --only=saas-launch # one (or comma-separated) slugs
 *   pnpm templates:capture --base-url=http://localhost:3211
 *
 * Output per template under public/templates/<slug>/posters/:
 *   home-desktop.jpg   — gallery card poster (1280x800 logical @2x)
 *   page-<path>.jpg    — detail "pages included" grid, one per page
 *
 * Captures are frozen (reduced motion + forced light + fonts settled) so the
 * same template revision reproduces the same poster. JPEG like
 * public/showcase/ — photographic page screenshots at a few hundred KB. The
 * gallery poster budget is ~250 KB; the tool warns when a file exceeds it.
 * Commit the resulting JPEGs; tests/int/template-showcases.int.spec.ts fails
 * if a declared template is missing a poster.
 */
import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'

import {
  templatePagePosterSrc,
  templatePosterSrc,
  templatePreviewHref,
  templateShowcases,
} from '../../src/lib/templates/registry'

const VIEWPORT = { height: 800, width: 1280 } as const
const DEVICE_SCALE_FACTOR = 2
const JPEG_QUALITY = 70
const SETTLE_MS = 900
const GOTO_TIMEOUT_MS = 45_000
const POSTER_BUDGET_BYTES = 250 * 1024

const PUBLIC_DIR = path.resolve(fileURLToPath(import.meta.url), '../../../public')

async function main() {
  const baseUrl =
    process.argv.find((arg) => arg.startsWith('--base-url='))?.slice('--base-url='.length) ??
    'http://localhost:3000'
  const onlyArg = process.argv.find((arg) => arg.startsWith('--only='))?.slice('--only='.length)
  const only = onlyArg ? onlyArg.split(',').map((s) => s.trim()).filter(Boolean) : null

  const targets = only
    ? templateShowcases.filter((template) => only.includes(template.slug))
    : templateShowcases

  if (targets.length === 0) {
    console.error(`No templates matched --only=${onlyArg}`)
    process.exitCode = 1
    return
  }

  try {
    await fetch(baseUrl, { method: 'HEAD' })
  } catch {
    console.error(`No server responding at ${baseUrl} — start one (pnpm dev) or pass --base-url.`)
    process.exitCode = 1
    return
  }

  const browser = await chromium.launch()
  const context = await browser.newContext({
    colorScheme: 'light',
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    reducedMotion: 'reduce',
    viewport: { ...VIEWPORT },
  })

  for (const template of targets) {
    for (const page of template.pages) {
      const tab = await context.newPage()
      const url = `${baseUrl}${templatePreviewHref(template.slug, page.path)}`

      try {
        await tab.goto(url, { timeout: GOTO_TIMEOUT_MS, waitUntil: 'networkidle' })
        await tab.evaluate(() => document.fonts.ready)
        await tab.waitForTimeout(SETTLE_MS)

        const outputs = [`public${templatePagePosterSrc(template.slug, page.path)}`]
        if (page.path === '') outputs.push(`public${templatePosterSrc(template.slug)}`)

        for (const relative of outputs) {
          const outPath = path.resolve(PUBLIC_DIR, '..', relative)
          await mkdir(path.dirname(outPath), { recursive: true })
          await tab.screenshot({ path: outPath, quality: JPEG_QUALITY, type: 'jpeg' })

          const { size } = await stat(outPath)
          const kb = Math.round(size / 1024)
          const over = size > POSTER_BUDGET_BYTES ? ` — over the ${POSTER_BUDGET_BYTES / 1024} KB budget` : ''
          console.log(`captured ${relative} (${kb} KB)${over}`)
        }
      } catch (error) {
        console.error(`failed ${url}:`, error)
        process.exitCode = 1
      } finally {
        await tab.close()
      }
    }
  }

  await browser.close()
}

void main()
