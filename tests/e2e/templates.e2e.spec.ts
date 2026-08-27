import { expect, type Page, test } from '@playwright/test'

import { grantConsent } from './consent'

import {
  templateDetailHref,
  templatePreviewHref,
  templateShowcases,
  templateStarterBlockSlug,
  templateStarterInstallCommand,
} from '../../src/lib/templates/registry'
import {
  TEMPLATE_CONCEPT_DISCLOSURE,
  TEMPLATE_CONCEPT_STATUS_LABEL,
} from '../../src/lib/templates/types'
import {
  catalogTemplatesLinkLabel,
  templatesDescription,
  templatesMetadataDescription,
  templatesMetadataTitle,
  templatesTitle,
} from '../../src/lib/site'

/* Full-site template showcases — /templates gallery, /templates/<slug> detail,
 * and the raw /templates/<slug>/preview/<page> routes (website-only "Concept
 * preview" phase).
 *
 * Everything is data-driven from src/lib/templates/registry so the suite can
 * never drift from the frozen showcase contract: indexable gallery/detail with
 * the concept status impossible to miss and one honest block action, noindexed
 * chrome-free previews rendered by each template's own shell, real-width
 * viewport presets on the detail iframe, and the general analytics stream kept
 * off the preview routes (AnalyticsShell returns null there). House patterns
 * follow frontend.e2e.spec.ts / a11y.e2e.spec.ts. */

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`
const googleTagId = 'G-EMGRZ0H9R9'

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

async function hasHorizontalOverflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  )
}

/* Page-switcher buttons carry aria-pressed; the label alone could collide with
 * site chrome, the pressed-state contract cannot. */
function switcherButton(page: Page, label: string) {
  return page.getByRole('button', { name: label, exact: true }).and(page.locator('[aria-pressed]'))
}

/* Analytics consent granted for the whole file: these specs interact with the
   page, and the undecided-state banner is fixed to the bottom of the viewport
   where it could intercept clicks. The banner has its own spec, and the axe
   suites deliberately run without consent so it is still held to the a11y bar. */
test.beforeEach(async ({ context }) => grantConsent(context))

test.describe('Templates gallery (/templates)', () => {
  test('publishes indexable metadata and a canonical URL', async ({ page }) => {
    await page.goto(`${baseURL}/templates`)

    await expect(page).toHaveTitle(new RegExp(escapeRegExp(templatesMetadataTitle)))
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      templatesMetadataDescription,
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${baseURL}/templates`,
    )
    // Gallery is indexable — noindex belongs to the preview routes only.
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
  })

  test('renders one H1, the disclosure, and a concept card per template', async ({ page }) => {
    await page.goto(`${baseURL}/templates`)

    await expect(page.getByRole('heading', { level: 1, name: templatesTitle })).toBeVisible()
    await expect(page.getByText(TEMPLATE_CONCEPT_DISCLOSURE).first()).toBeVisible()

    for (const template of templateShowcases) {
      const card = page.locator('article').filter({ hasText: template.title })
      await expect(card).toHaveCount(1)
      await expect(card.getByText(TEMPLATE_CONCEPT_STATUS_LABEL).first()).toBeVisible()
      await expect(
        card.locator(`a[href="${templateDetailHref(template.slug)}"]`).first(),
      ).toBeVisible()
    }

    // The gallery never mounts live previews — posters only.
    await expect(page.locator('iframe')).toHaveCount(0)
  })

  test('keeps supported starting points connected to the gallery', async ({ page }) => {
    await page.goto(`${baseURL}/templates`)

    await expect(page.getByText(templatesDescription)).toBeVisible()
    await expect(page.locator('main a[href="/components"]')).toBeVisible()
    await expect(page.locator('main a[href="/docs/installation"]')).toBeVisible()

    await page.goto(`${baseURL}/components`)
    await expect(page.getByRole('link', { name: catalogTemplatesLinkLabel })).toHaveAttribute(
      'href',
      '/templates',
    )
  })

  test('shows no install, waitlist, or price UI', async ({ page }) => {
    await page.goto(`${baseURL}/templates`)
    await expect(page.locator('h1')).toHaveCount(1)

    /* Scoped to main: the concept surface itself must never render an install
       command. The shared SiteFooter's component install command is sitewide
       chrome pinned by the frontend suite, not a template availability claim. */
    const text = await page.locator('main').innerText()
    expect(text).not.toMatch(/payload-components\s+add/i)
    expect(text).not.toMatch(/\bwaitlist\b/i)
    expect(text).not.toMatch(/coming\s+soon/i)
    expect(text).not.toMatch(/\$\d/)
  })

  test('keeps the gallery free of horizontal overflow on desktop and mobile', async ({ page }) => {
    await page.goto(`${baseURL}/templates`)
    await expect(page.locator('h1')).toHaveCount(1)
    expect(await hasHorizontalOverflow(page)).toBe(false)

    await page.setViewportSize({ height: 844, width: 390 })
    await page.goto(`${baseURL}/templates`)
    await expect(page.locator('h1')).toHaveCount(1)
    expect(await hasHorizontalOverflow(page)).toBe(false)
  })
})

test.describe('Template detail pages (/templates/<slug>)', () => {
  for (const template of templateShowcases) {
    const detailHref = templateDetailHref(template.slug)

    test(`${template.slug}: publishes metadata, status, disclosure, and one attributed block action`, async ({
      context,
      page,
    }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write'])
      await page.goto(`${baseURL}${detailHref}`)
      await page.evaluate(() => {
        window.__disablePostHogNetwork = true
        window.__posthogEvents = []
      })
      await expect
        .poll(() => page.evaluate(() => document.documentElement.dataset.copyControllerReady))
        .toBe('true')

      await expect(page).toHaveTitle(new RegExp(escapeRegExp(template.title)))
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `${baseURL}${detailHref}`,
      )
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)

      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.getByRole('heading', { level: 1, name: template.title })).toBeVisible()
      await expect(page.getByText(TEMPLATE_CONCEPT_STATUS_LABEL).first()).toBeVisible()
      await expect(page.getByText(TEMPLATE_CONCEPT_DISCLOSURE).first()).toBeVisible()

      const starterBlockSlug = templateStarterBlockSlug(template)
      const starterInstallCommand = templateStarterInstallCommand(template)
      const installButton = page.getByRole('button', {
        name: `Copy the ${starterBlockSlug} install command`,
      })
      await expect(installButton).toHaveCount(1)
      await expect(installButton).toHaveAttribute('data-cta-level', 'primary')
      await expect(page.locator('main')).toContainText(`This installs only ${starterBlockSlug}`)
      await installButton.click()
      await expect
        .poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toBe(starterInstallCommand)
      expect(await page.evaluate(() => window.__posthogEvents)).toEqual(
        expect.arrayContaining([
          {
            event: 'copy_install_command',
            properties: {
              command: starterInstallCommand,
              component: starterBlockSlug,
              source_path: detailHref,
            },
          },
        ]),
      )

      /* Scoped to main — the only command is one real block from the recipe;
         the full concept remains explicitly non-installable. */
      const text = await page.locator('main').innerText()
      expect(text.match(/payload-components\s+add/gi)).toHaveLength(1)
      expect(text).not.toMatch(/\bwaitlist\b/i)
      expect(text).not.toMatch(/coming\s+soon/i)
      expect(text).not.toMatch(/\$\d/)

      expect(await hasHorizontalOverflow(page)).toBe(false)

      await page.setViewportSize({ height: 844, width: 390 })
      await page.goto(`${baseURL}${detailHref}`)
      await expect(page.getByRole('heading', { level: 1, name: template.title })).toBeVisible()
      expect(await hasHorizontalOverflow(page)).toBe(false)
    })

    test(`${template.slug}: drives one iframe through the page switcher`, async ({ page }) => {
      await page.setViewportSize({ height: 900, width: 1280 })
      await page.goto(`${baseURL}${detailHref}`)

      // Exactly one live preview per detail page.
      const frame = page.locator('iframe')
      await expect(frame).toHaveCount(1)
      await expect(frame).toHaveAttribute('src', templatePreviewHref(template.slug))

      // Five pages in the launch contract — one aria-pressed button each.
      expect(template.pages.length).toBe(5)
      for (const templatePage of template.pages) {
        await expect(switcherButton(page, templatePage.label)).toBeVisible()
      }

      const openFullPreview = page.getByRole('link', { name: /open full preview/i })
      await expect(openFullPreview).toHaveAttribute('href', templatePreviewHref(template.slug))

      // Switching pages retargets the iframe and the open-full-preview link.
      for (const templatePage of template.pages.slice(1)) {
        const pageHref = templatePreviewHref(template.slug, templatePage.path)
        const button = switcherButton(page, templatePage.label)

        await expect(button).toHaveAttribute('aria-pressed', 'false')
        await button.click()
        await expect(button).toHaveAttribute('aria-pressed', 'true')
        await expect(frame).toHaveAttribute('src', pageHref)
        await expect(openFullPreview).toHaveAttribute('href', pageHref)
      }
    })

    test(`${template.slug}: viewport presets resize the frame to real device widths`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 900, width: 1280 })
      await page.goto(`${baseURL}${detailHref}`)

      const frame = page.locator('iframe')
      await expect(frame).toHaveCount(1)

      const frameWidth = async () => (await frame.boundingBox())?.width ?? 0

      const desktop = switcherButton(page, 'Desktop')
      const tablet = switcherButton(page, 'Tablet')
      const mobile = switcherButton(page, 'Mobile')

      await expect(desktop).toHaveAttribute('aria-pressed', 'true')
      const desktopWidth = await frameWidth()

      // Real widths, not CSS scaling: the iframe element itself narrows so the
      // template's Tailwind breakpoints genuinely reflow.
      await tablet.click()
      await expect(tablet).toHaveAttribute('aria-pressed', 'true')
      await expect(desktop).toHaveAttribute('aria-pressed', 'false')
      await expect.poll(frameWidth).toBeLessThanOrEqual(770)
      await expect.poll(frameWidth).toBeGreaterThanOrEqual(766)

      await mobile.click()
      await expect(mobile).toHaveAttribute('aria-pressed', 'true')
      await expect.poll(frameWidth).toBeLessThanOrEqual(392)
      await expect.poll(frameWidth).toBeGreaterThanOrEqual(388)

      await desktop.click()
      await expect(desktop).toHaveAttribute('aria-pressed', 'true')
      await expect.poll(frameWidth).toBeGreaterThan(770)
      expect(desktopWidth).toBeGreaterThan(770)
    })

    test(`${template.slug}: lists every page recipe as ordered docs links`, async ({ page }) => {
      await page.goto(`${baseURL}${detailHref}`)
      await expect(page.getByRole('heading', { level: 1, name: template.title })).toBeVisible()

      const hrefs = await page
        .locator('main a[href^="/docs/components/"]')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')))

      // Every page's recipe must appear as a docs-link run in section order
      // (an ordered subsequence of the rendered docs links).
      let cursor = 0
      for (const templatePage of template.pages) {
        for (const section of templatePage.sections) {
          const expected = `/docs/components/${section.componentSlug}`
          const index = hrefs.indexOf(expected, cursor)
          expect(
            index,
            `${templatePage.label} recipe link ${expected} is missing or out of order (rendered: ${hrefs.join(', ')})`,
          ).toBeGreaterThanOrEqual(cursor)
          cursor = index + 1
        }
      }
    })
  }

  test('unknown template slugs return 404', async ({ page }) => {
    const detail = await page.goto(`${baseURL}/templates/not-a-template`)
    expect(detail?.status()).toBe(404)
  })
})

test.describe('Template full previews (/templates/<slug>/preview/<page>)', () => {
  for (const template of templateShowcases) {
    test(`${template.slug}: every page serves its shell, recipe, and noindex`, async ({ page }) => {
      for (const templatePage of template.pages) {
        const href = templatePreviewHref(template.slug, templatePage.path)
        const response = await page.goto(`${baseURL}${href}`, { waitUntil: 'domcontentloaded' })
        expect(response?.status(), `${href} must serve 200`).toBe(200)

        await expect(page).toHaveTitle(new RegExp(escapeRegExp(TEMPLATE_CONCEPT_STATUS_LABEL)))

        // Shareable but never indexable.
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /nofollow/)

        // One screen-reader H1 naming the fictional page.
        const h1 = page.locator('h1')
        await expect(h1).toHaveCount(1)
        await expect(h1).toHaveClass(/sr-only/)
        await expect(h1).toHaveText(templatePage.title)

        // The template's own shell navigation, not the site chrome.
        await expect(page.locator('a[aria-label="Payload Components home"]')).toHaveCount(0)
        for (const item of template.navigation) {
          await expect(
            page.locator(`a[href="${templatePreviewHref(template.slug, item.path)}"]`).first(),
          ).toBeAttached()
        }

        // The full composed recipe renders — one wrapper per declared section.
        for (const section of templatePage.sections) {
          await expect(page.locator(`[data-template-section="${section.id}"]`)).toHaveCount(1)
        }

        expect(await hasHorizontalOverflow(page), `${href} has horizontal overflow`).toBe(false)
      }
    })

    test(`${template.slug}: internal navigation navigates and browser back returns`, async ({
      page,
    }) => {
      const homeHref = templatePreviewHref(template.slug)
      const target = template.navigation.find((item) => item.path !== '')
      expect(target, 'navigation must include at least one non-home page').toBeTruthy()
      const targetHref = templatePreviewHref(template.slug, target!.path)

      await page.goto(`${baseURL}${homeHref}`)
      await expect(page.locator('[data-template-canvas]')).toBeVisible()

      await page.locator(`a[href="${targetHref}"]`).first().click()
      await expect(page).toHaveURL(`${baseURL}${targetHref}`)
      await expect(page.locator('[data-template-canvas]')).toBeVisible()

      await page.goBack()
      await expect(page).toHaveURL(`${baseURL}${homeHref}`)
      await expect(page.locator('[data-template-canvas]')).toBeVisible()
    })

    test(`${template.slug}: shell navigation stays operable at 390px`, async ({ page }) => {
      await page.setViewportSize({ height: 844, width: 390 })
      await page.goto(`${baseURL}${templatePreviewHref(template.slug)}`)
      await expect(page.locator('[data-template-canvas]')).toBeVisible()

      const target = template.navigation.find((item) => item.path !== '')!
      const targetHref = templatePreviewHref(template.slug, target.path)
      const targetLink = page.locator(`a[href="${targetHref}"]`).first()

      if (await targetLink.isVisible()) {
        // The shell keeps its navigation inline at mobile widths — fine, as
        // long as it stays reachable and nothing overflows.
        await expect(targetLink).toBeVisible()
      } else {
        // Disclosure pattern: a labelled menu trigger opens the navigation,
        // Escape closes it and restores focus to the trigger.
        const trigger = page
          .getByRole('button', { name: /menu|navigation/i })
          .and(page.locator('[aria-expanded]'))
          .first()
        await expect(trigger).toBeVisible()

        await trigger.click()
        await expect(trigger).toHaveAttribute('aria-expanded', 'true')

        /* Assert inside the element the trigger controls — a bare .first()
           href match can resolve to the hidden desktop nav link, which shares
           the same href. */
        const menuId = await trigger.getAttribute('aria-controls')
        expect(menuId).toBeTruthy()
        const menu = page.locator(`#${menuId}`)
        await expect(menu.locator(`a[href="${targetHref}"]`).first()).toBeVisible()

        await page.keyboard.press('Escape')
        await expect(menu.locator(`a[href="${targetHref}"]`).first()).toBeHidden()
        await expect(trigger).toBeFocused()
      }

      expect(await hasHorizontalOverflow(page)).toBe(false)
    })
  }

  test('the preview exit names its concept and keeps clear of the mobile content column', async ({
    page,
  }) => {
    // Chrome shared by every concept's preview shell, so one concept covers it.
    const template = templateShowcases[0]
    const exit = page.locator('[data-template-preview-exit] a')

    const mobile = { height: 844, width: 390 }
    await page.setViewportSize(mobile)
    await page.goto(`${baseURL}${templatePreviewHref(template.slug)}`)
    await expect(page.locator('[data-template-canvas]')).toBeVisible()

    await expect(exit).toHaveAttribute('href', templateDetailHref(template.slug))
    /* The concept's name is dropped from the VISIBLE label at this width, never
       from the accessible name — the link still says what it leaves. */
    await expect(exit).toHaveAccessibleName(`${template.title} · ${TEMPLATE_CONCEPT_STATUS_LABEL}`)

    /* Being fixed, it floats over the concept it describes. With one column to
       work with it has to stay in the corner: centred and full-width it covered
       a band of hero content at 390px. */
    const mobileBox = (await exit.boundingBox())!
    expect(mobileBox.x).toBeGreaterThan(mobile.width / 2)
    expect(mobileBox.x + mobileBox.width).toBeLessThanOrEqual(mobile.width)

    const desktop = { height: 900, width: 1280 }
    await page.setViewportSize(desktop)
    await page.goto(`${baseURL}${templatePreviewHref(template.slug)}`)
    await expect(page.locator('[data-template-canvas]')).toBeVisible()

    // From sm up there is room for the full pill, centred.
    const desktopBox = (await exit.boundingBox())!
    expect(desktopBox.width).toBeGreaterThan(mobileBox.width)
    expect(Math.abs(desktopBox.x + desktopBox.width / 2 - desktop.width / 2)).toBeLessThanOrEqual(2)
  })

  test('every concept reserves a strip so the exit pill never covers its footer', async ({
    page,
  }) => {
    /* The pill is fixed, so at the END of the document there is no scroll left
       to move content out from under it — anything it covers there is covered
       for good. preview-exit-clearance.css reserves a strip inside each shell's
       footer for it to land on; this proves the strip is actually big enough on
       every concept, which the visual baselines cannot: they would only show
       that the page height changed, and a reviewer re-minting them would accept
       the regression. 390px is the tight case — one content column. */
    const occluded: string[] = []

    for (const template of templateShowcases) {
      await page.setViewportSize({ height: 844, width: 390 })
      await page.goto(`${baseURL}${templatePreviewHref(template.slug)}`)
      await expect(page.locator('[data-template-canvas]')).toBeVisible()
      // Font swap moves every line; measuring before it lands reads stale boxes.
      await page.evaluate(() => document.fonts.ready)

      /* `behavior: instant` because globals.css sets `scroll-behavior: smooth`
         on html — a plain scrollTo animates, and the first measurement then
         reads the page still at the top, reporting hero content as "covered". */
      await page.evaluate(() =>
        window.scrollTo({
          behavior: 'instant',
          left: 0,
          top: document.documentElement.scrollHeight,
        }),
      )
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              Math.ceil(window.scrollY + window.innerHeight) >=
              document.documentElement.scrollHeight,
          ),
        )
        .toBe(true)

      const covered = await page.evaluate(() => {
        const pill = document.querySelector('[data-template-preview-exit] a')
        if (!pill) return ['the exit pill is missing entirely']
        const box = pill.getBoundingClientRect()
        const hits: string[] = []

        /* Text nodes, not elements: a <p> box can extend under the pill while
           its rendered lines stop short, and the reverse. Range rects are what
           the reader actually sees. */
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        let node: Node | null
        while ((node = walker.nextNode())) {
          const text = node.textContent?.trim()
          const parent = node.parentElement
          if (!text || !parent) continue
          if (parent.closest('[data-template-preview-exit]') || parent.closest('.sr-only')) continue
          const style = getComputedStyle(parent)
          if (style.visibility === 'hidden' || style.display === 'none') continue

          const range = document.createRange()
          range.selectNodeContents(node)
          for (const rect of Array.from(range.getClientRects())) {
            if (rect.width < 1 || rect.height < 1) continue
            if (
              rect.right > box.left &&
              rect.left < box.right &&
              rect.bottom > box.top &&
              rect.top < box.bottom
            ) {
              hits.push(text.slice(0, 50))
              break
            }
          }
        }

        return hits
      })

      if (covered.length > 0) occluded.push(`${template.slug}: ${covered.join(' | ')}`)
    }

    expect(
      occluded,
      `the exit pill permanently covers footer content on ${occluded.length} concept(s) at 390px:\n  ${occluded.join('\n  ')}`,
    ).toEqual([])
  })

  test('unknown preview slugs and pages return 404', async ({ page }) => {
    const template = templateShowcases[0]

    const unknownTemplate = await page.goto(`${baseURL}/templates/not-a-template/preview`)
    expect(unknownTemplate?.status()).toBe(404)

    const unknownPage = await page.goto(
      `${baseURL}${templatePreviewHref(template.slug, 'not-a-page')}`,
    )
    expect(unknownPage?.status()).toBe(404)

    const deepSegments = await page.goto(
      `${baseURL}${templatePreviewHref(template.slug)}/pricing/extra`,
    )
    expect(deepSegments?.status()).toBe(404)
  })

  test('preview routes never mount the general analytics stream', async ({ page }) => {
    const template = templateShowcases[0]

    await page.goto(`${baseURL}${templatePreviewHref(template.slug)}`)
    await expect(page.locator('[data-template-canvas]')).toBeVisible()
    await page.waitForLoadState('load')
    // AnalyticsShell returns null on preview routes — no GA tag, ever.
    await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0)
    await expect(page.locator('script#google-tag')).toHaveCount(0)

    // ...while the indexable gallery keeps the one Google tag.
    await page.goto(`${baseURL}/templates`)
    await expect(
      page.locator(`script[src="https://www.googletagmanager.com/gtag/js?id=${googleTagId}"]`),
    ).toHaveCount(1)
  })

  test('sitemap lists the gallery and detail pages but never preview routes', async ({
    request,
  }) => {
    const sitemap = await request.get(`${baseURL}/sitemap.xml`)
    expect(sitemap.ok()).toBe(true)

    const body = await sitemap.text()
    expect(body).toContain(`${baseURL}/templates</loc>`)
    for (const template of templateShowcases) {
      expect(body).toContain(`${baseURL}${templateDetailHref(template.slug)}</loc>`)
    }
    expect(body).not.toContain('/preview')
  })
})

test.describe('Templates under reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } })

  for (const template of templateShowcases) {
    test(`${template.slug} preview renders its final state without motion`, async ({ page }) => {
      await page.goto(`${baseURL}${templatePreviewHref(template.slug)}`)
      await expect(page.locator('[data-template-canvas]')).toBeVisible()
      await page.evaluate(() => document.fonts.ready)

      const home = template.pages.find((templatePage) => templatePage.path === '')!
      const firstSection = page.locator(`[data-template-section="${home.sections[0].id}"]`)
      const lastSection = page.locator(
        `[data-template-section="${home.sections[home.sections.length - 1].id}"]`,
      )

      await expect(firstSection).toBeVisible()
      await lastSection.scrollIntoViewIfNeeded()
      await expect(lastSection).toBeVisible()

      expect(await hasHorizontalOverflow(page)).toBe(false)
    })
  }
})

/* The accessibility sweep lives in templates-a11y.e2e.spec.ts. It used to be a
   describe block here, pinned to templateShowcases[0] — one concept out of ten,
   each with its own scoped theme and hand-tuned contrast. It now covers every
   concept's detail page and full preview at both widths, plus the painted-pixel
   contrast pass axe cannot do, and runs as its own isolated Playwright batch. */
