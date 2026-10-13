import { expect, type Page, test } from '@playwright/test'

import { grantConsent, mountGoogleTagOffline } from './support/consent'

import {
  blogTitle,
  catalogBlocksGuideLinkLabel,
  catalogInstallationLinkLabel,
  composerAddLabel,
  composerClearLabel,
  composerCopyLabel,
  composerInstallCommand,
  composerRemoveLabel,
  composerTrayLabel,
  catalogMetadataDescription,
  catalogMetadataTitle,
  catalogTitle,
  githubRepoUrl,
  heroHeadline,
  heroGuideLink,
  heroTertiaryLinks,
  homeMetadataDescription,
  homeMetadataTitle,
  componentEntries,
  landingSections,
  primaryInstallCommand,
  benchSteps,
  benchTour,
  upcomingComponents,
} from '../../src/lib/site'

import { expectNoHorizontalOverflow } from './support/horizontal-overflow'

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`
const isProductionE2E = process.env.PLAYWRIGHT_SERVER_MODE === 'production'
const googleTagId = 'G-EMGRZ0H9R9'
const copiedAlertText = 'Copied to clipboard.'

type PostHogTestEvent = {
  event: string
  properties: Record<string, unknown>
}

async function stubGtagEvents(page: Page) {
  await page.waitForFunction(() => typeof window.gtag === 'function')
  await page.evaluate(() => {
    const targetWindow = window as Window & { __gtagEvents?: unknown[][] }
    targetWindow.__gtagEvents = []
    window.gtag = (...args: Parameters<NonNullable<Window['gtag']>>) => {
      targetWindow.__gtagEvents?.push(args)
    }
  })
}

async function getGtagEvents(page: Page) {
  return page.evaluate(() => (window as Window & { __gtagEvents?: unknown[][] }).__gtagEvents ?? [])
}

async function getPostHogEvents(page: Page) {
  return page.evaluate(
    () => (window as Window & { __posthogEvents?: PostHogTestEvent[] }).__posthogEvents ?? [],
  )
}

async function expectCopiedAlert(page: Page) {
  await expect(page.getByRole('alert').filter({ hasText: copiedAlertText })).toBeVisible({
    timeout: 15000,
  })
}

async function waitForCopyController(page: Page) {
  await expect(page.locator('html')).toHaveAttribute('data-copy-controller-ready', 'true')
}

/* File-level: every describe here wants the post-opt-in site. The analytics
   assertions need the scripts mounted, so the Google tag is mounted offline (GA4
   only mounts on a production host), and the landing snapshots are baselined
   without the consent banner over them. The banner has its own spec. */
test.beforeEach(async ({ context }) => {
  await grantConsent(context)
  await mountGoogleTagOffline(context)
})

test.describe('Light shadcn frontend', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      const targetWindow = window as Window & {
        __disablePostHogNetwork?: boolean
        __posthogEvents?: PostHogTestEvent[]
      }

      targetWindow.__disablePostHogNetwork = true
      targetWindow.__posthogEvents = []
    })
  })

  test('installs the Google tag once', async ({ page }) => {
    await page.goto(baseURL)

    await expect(
      page.locator(`script[src="https://www.googletagmanager.com/gtag/js?id=${googleTagId}"]`),
    ).toHaveCount(1)
    await expect(page.locator('script#google-tag')).toHaveCount(1)
    const inlineGoogleTag = await page
      .locator('script#google-tag')
      .evaluate((script) => script.textContent ?? '')
    expect(inlineGoogleTag).toContain(`gtag('config', '${googleTagId}')`)
  })

  test('tracks homepage visits in readable analytics', async ({ page }) => {
    await page.goto(baseURL)

    await expect(page.getByRole('heading', { level: 1, name: heroHeadline })).toBeVisible()
    await expect
      .poll(() => getPostHogEvents(page))
      .toEqual(
        expect.arrayContaining([
          {
            event: '$pageview',
            properties: {
              page_path: '/',
              source_path: '/',
              traffic_source: 'other',
              verification_run: false,
            },
          },
        ]),
      )
  })

  test('classifies organic visits without sending raw acquisition details', async ({ page }) => {
    await page.goto(`${baseURL}/?utm_medium=organic&utm_campaign=private-query-text`)

    await expect
      .poll(() => getPostHogEvents(page))
      .toEqual(
        expect.arrayContaining([
          {
            event: '$pageview',
            properties: {
              page_path: '/',
              source_path: '/',
              traffic_source: 'organic_search',
              verification_run: false,
            },
          },
        ]),
      )
    expect(JSON.stringify(await getPostHogEvents(page))).not.toContain('private-query-text')
  })

  test('preserves the first organic entry on install and GitHub actions', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(
      `${baseURL}/docs/installation?utm_medium=organic&utm_campaign=private-entry-query`,
    )
    await expect
      .poll(() => page.evaluate(() => window.sessionStorage.getItem('pc_organic_entry_page')))
      .toBe('/docs/installation')

    // A second organic-looking route must not replace the first entry path.
    await page.goto(`${baseURL}/?utm_medium=organic&utm_campaign=private-second-query`)
    await waitForCopyController(page)
    await stubGtagEvents(page)
    await page.evaluate(() => {
      document.addEventListener(
        'click',
        (event) => {
          const target = event.target
          if (!(target instanceof Element)) return

          if (target.closest('a[href="https://github.com/Ducksss/payload-components"]')) {
            event.preventDefault()
          }
        },
        { capture: true },
      )
    })

    await page.locator('.hero-shell button[data-copy-command]').click()
    await page.locator('a[href="https://github.com/Ducksss/payload-components"]').first().click()

    const entryPage = '/docs/installation'
    expect(await getGtagEvents(page)).toEqual(
      expect.arrayContaining([
        [
          'event',
          'copy_install_command',
          {
            command: primaryInstallCommand,
            component: 'hero-basic',
            source_path: '/',
            entry_page: entryPage,
          },
        ],
        [
          'event',
          'primary_link_click',
          {
            destination: 'github',
            href: 'https://github.com/Ducksss/payload-components',
            source_path: '/',
            entry_page: entryPage,
          },
        ],
      ]),
    )
    expect(await getPostHogEvents(page)).toEqual(
      expect.arrayContaining([
        {
          event: 'copy_install_command',
          properties: {
            command: primaryInstallCommand,
            component: 'hero-basic',
            source_path: '/',
            entry_page: entryPage,
          },
        },
        {
          event: 'primary_link_click',
          properties: {
            destination: 'github',
            href: 'https://github.com/Ducksss/payload-components',
            source_path: '/',
            entry_page: entryPage,
          },
        },
      ]),
    )
    expect(JSON.stringify(await getPostHogEvents(page))).not.toContain('private-entry-query')
    expect(JSON.stringify(await getPostHogEvents(page))).not.toContain('private-second-query')
  })

  test('does not create an organic entry for referral visits', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(baseURL, {
      referer: 'https://example.com/private-referral-path?campaign=private-referral-query',
    })
    await waitForCopyController(page)
    await stubGtagEvents(page)
    await page.locator('.hero-shell button[data-copy-command]').click()

    expect(
      await page.evaluate(() => window.sessionStorage.getItem('pc_organic_entry_page')),
    ).toBeNull()
    expect(await getGtagEvents(page)).toContainEqual([
      'event',
      'copy_install_command',
      {
        command: primaryInstallCommand,
        component: 'hero-basic',
        source_path: '/',
      },
    ])
    expect(await getPostHogEvents(page)).toEqual(
      expect.arrayContaining([
        {
          event: 'copy_install_command',
          properties: {
            command: primaryInstallCommand,
            component: 'hero-basic',
            source_path: '/',
          },
        },
      ]),
    )
    expect(JSON.stringify(await getPostHogEvents(page))).not.toContain('private-referral')
  })

  test('marks controlled page views without retaining the verification query', async ({ page }) => {
    await page.goto(`${baseURL}/?verification_run=1`)

    await expect
      .poll(() => getPostHogEvents(page))
      .toEqual(
        expect.arrayContaining([
          {
            event: '$pageview',
            properties: {
              page_path: '/',
              source_path: '/',
              traffic_source: 'other',
              verification_run: true,
            },
          },
        ]),
      )
    expect(JSON.stringify(await getPostHogEvents(page))).not.toContain('verification_run=1')
  })

  test('keeps the landing hero action hierarchy focused', async ({ page }) => {
    await page.goto(baseURL)

    const hero = page.locator('.hero-shell')
    await expect(hero.locator('[data-cta-level="primary"]')).toHaveCount(1)
    await expect(
      hero.getByRole('button', { name: 'Copy install command', exact: true }),
    ).toBeVisible()
    await expect(hero.getByRole('link', { name: heroGuideLink.label, exact: true })).toBeVisible()
    await expect(hero.locator(`a[href="${githubRepoUrl}"]`)).toHaveAccessibleName('Star on GitHub')
    await expect(
      hero.getByRole('link', { name: heroTertiaryLinks[0].label, exact: true }),
    ).toBeVisible()
    await expect(hero.locator('[data-cta-level="tertiary"]')).toHaveCount(3)
    await expect(hero.getByRole('link', { name: 'Get started', exact: true })).toHaveCount(0)

    const community = page.locator(`#${landingSections.community.id}`)
    await expect(community.locator('[data-cta-level="primary"]')).toHaveCount(1)
    await expect(
      community.getByRole('button', { name: 'Copy install command', exact: true }),
    ).toBeVisible()
  })

  test('keeps the desktop hero composition compact', async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 })
    await page.goto(baseURL)

    const headline = page.getByRole('heading', { level: 1, name: heroHeadline })
    await expect(headline).toBeVisible()

    const headlineSize = await headline.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    )
    expect(headlineSize).toBeLessThanOrEqual(88.1)

    /* The command has to survive above the fold: the bench is the proof, not
       the pitch, so it may never push the CTA row off a 900px-tall viewport. */
    const ctaBottom = await page
      .getByRole('button', { name: 'Copy install command' })
      .first()
      .evaluate((element) => element.getBoundingClientRect().bottom)
    expect(ctaBottom).toBeLessThan(900)

    const benchOverflow = await expectNoHorizontalOverflow(page, 'the landing bench')
    expect(benchOverflow.offenders, benchOverflow.message).toEqual([])
  })

  /* The command is the call to action, so no width may clip it. The bench
     puts it in a half-width column, which on a 1024-1366px laptop is too
     narrow for the command beside the full "Copy install command" label; the
     key drops to its icon there (a container query on the field), as on
     phones. */
  test('shows the whole install command at every width', async ({ page }) => {
    await page.goto(baseURL)
    await page.evaluate(() => document.fonts.ready)
    const commands = [
      page.locator('.hero-shell code').first(),
      page.locator(`#${landingSections.community.id} code`).first(),
    ]

    for (const width of [390, 768, 1024, 1280, 1366, 1440]) {
      await page.setViewportSize({ height: 900, width })
      for (const command of commands) {
        await expect(command).toHaveText(primaryInstallCommand)
        await expect
          .poll(() => command.evaluate((el) => el.scrollWidth - el.clientWidth), {
            message: `${width}px clips the install command`,
          })
          .toBeLessThanOrEqual(0)
      }
    }

    /* Where the field has the room (the hero at 1440px), the key keeps its
       full label rather than collapsing early. */
    await page.setViewportSize({ height: 900, width: 1440 })
    await expect
      .poll(() =>
        page
          .locator('.hero-shell [data-copy-label]')
          .first()
          .evaluate((label) => getComputedStyle(label).position),
      )
      .not.toBe('absolute')
  })

  test('the bench installs hero-basic as the page scrolls', async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 })
    await page.goto(baseURL)

    const bench = page.locator('#bench')
    await expect(bench).toHaveAttribute('data-step', '0')

    /* Pinned on a wide, tall, motion-allowed viewport: the stage sticks under
       the header while the section scrolls past. */
    expect(
      await bench.locator('.bench-stage').evaluate((stage) => getComputedStyle(stage).position),
    ).toBe('sticky')

    const scrollTo = (fraction: number) =>
      bench.evaluate((element, value) => {
        const section = element as HTMLElement
        const stage = section.firstElementChild as HTMLElement
        window.scrollTo(0, section.offsetTop + value * (section.offsetHeight - stage.offsetHeight))
      }, fraction)

    const wired = () =>
      bench
        .locator('.bench-board [data-active] svg.pinout-desktop .pinout-wire')
        .evaluateAll(
          (wires) =>
            wires.filter((wire) => Number.parseFloat(getComputedStyle(wire).strokeDashoffset) < 1)
              .length,
        )

    /* Before the wiring step no trace is drawn; after it, all five are. */
    await scrollTo(0.18)
    await expect(bench).toHaveAttribute('data-step', '1')
    expect(await wired()).toBe(0)

    await scrollTo(0.62)
    await expect(bench).toHaveAttribute('data-step', '3')
    await expect.poll(wired).toBe(5)
    await expect(bench.locator('.bench-page [data-active] .bench-twin')).toBeVisible()

    /* The last step puts other parts on the bench. */
    await scrollTo(0.97)
    await expect(bench).toHaveAttribute('data-step', '4')
    await expect(
      bench.locator('.bench-board [data-active]').getByText('PC-HERO-BASIC'),
    ).toHaveCount(0)
  })

  test('the bench states its facts in text and keeps drawings out of the a11y tree', async ({
    page,
  }) => {
    await page.goto(baseURL)

    const bench = page.locator('#bench')
    await expect(bench.getByText(`${componentEntries.length} blocks`).first()).toBeAttached()

    for (const step of benchSteps) {
      await expect(
        bench.getByRole('heading', { level: 2, name: step.title.join('') }),
      ).toBeAttached()
    }

    /* The ledger is the drawing's outputs, as text. */
    await expect(bench.locator('.bench-ledger li')).toHaveCount(5)

    for (const decorative of await bench.locator('svg.pinout, .bench-twin').all()) {
      await expect(decorative).toHaveAttribute('aria-hidden', 'true')
    }
  })

  test('renders the light token-driven homepage', async ({ page }) => {
    await page.goto(baseURL)

    await expect(page).toHaveTitle(homeMetadataTitle)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      homeMetadataDescription,
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      homeMetadataTitle,
    )
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      homeMetadataDescription,
    )
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      homeMetadataTitle,
    )
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
      'content',
      homeMetadataDescription,
    )
    await expect(page.getByRole('heading', { level: 1, name: heroHeadline })).toBeVisible()
    await expect(page.locator('code', { hasText: primaryInstallCommand }).first()).toBeVisible()

    // Forced single light theme: the dark class must never appear.
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    // The body background must resolve from the --background token rather
    // than any hardcoded color, so the assertion derives its expectation
    // from the same token in-page.
    const { actual, expected } = await page.evaluate(() => {
      const probe = document.createElement('div')
      probe.style.backgroundColor = 'var(--background)'
      document.body.appendChild(probe)
      const resolved = getComputedStyle(probe).backgroundColor
      probe.remove()

      return {
        actual: getComputedStyle(document.body).backgroundColor,
        expected: resolved,
      }
    })

    expect(expected).not.toBe('rgba(0, 0, 0, 0)')
    expect(actual).toBe(expected)

    // "Light themed first": the resolved background must actually be light.
    // A canvas normalizes any CSS color syntax (oklch included) to sRGB bytes.
    const meanChannel = await page.evaluate(() => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext('2d')
      if (!ctx) return -1
      ctx.fillStyle = getComputedStyle(document.body).backgroundColor
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
      return (r + g + b) / 3
    })
    expect(meanChannel).toBeGreaterThan(220)
  })

  test('links setup FAQ answers to their canonical guides', async ({ page }) => {
    await page.goto(baseURL)

    await page
      .getByRole('group')
      .filter({ hasText: 'What is a Payload CMS block?' })
      .getByText('What is a Payload CMS block?')
      .click()
    await expect(page.getByRole('link', { name: 'Read the Payload blocks guide' })).toHaveAttribute(
      'href',
      '/docs/payload-blocks',
    )

    await page
      .getByRole('group')
      .filter({ hasText: 'What exactly does an install change in my repo?' })
      .getByText('What exactly does an install change in my repo?')
      .click()
    await expect(page.getByRole('link', { name: 'Read the installation guide' })).toHaveAttribute(
      'href',
      '/docs/installation',
    )

    await page
      .getByRole('group')
      .filter({ hasText: 'Why not just run npx shadcn add?' })
      .getByText('Why not just run npx shadcn add?')
      .click()
    await expect(
      page.getByRole('link', { name: 'Read the full shadcn comparison' }),
    ).toHaveAttribute('href', '/docs/shadcn-vs-payload-components')
  })

  test('aligns the brand mark relative to the documentation rail', async ({ page }) => {
    const viewports = [
      { alignTo: 'header-padding', height: 844, name: 'mobile', width: 390 },
      { alignTo: 'documentation-title', height: 1024, name: 'tablet', width: 768 },
      { alignTo: 'documentation-title', height: 720, name: 'desktop', width: 1280 },
    ] as const

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto(`${baseURL}/docs`)

      const geometry = await page.evaluate(() => {
        const brandMark = document.querySelector(
          'body > header a[aria-label="Payload Components home"] span[aria-hidden="true"]',
        )
        const headerInner = document.querySelector('body > header > div')
        const documentationTitle = [...document.querySelectorAll('#nd-sidebar span')].find(
          (element) => element.textContent?.trim() === 'Documentation',
        )
        const brandMarkRect = brandMark?.getBoundingClientRect()
        const headerInnerRect = headerInner?.getBoundingClientRect()
        const documentationTitleRect = documentationTitle?.getBoundingClientRect()
        const headerStyle = headerInner ? getComputedStyle(headerInner) : null
        const headerPaddingStart = headerStyle
          ? Number.parseFloat(headerStyle.paddingInlineStart)
          : null
        return {
          brandMark: brandMarkRect ? { width: brandMarkRect.width, x: brandMarkRect.x } : null,
          documentationTitle:
            documentationTitleRect && documentationTitleRect.width > 0
              ? { width: documentationTitleRect.width, x: documentationTitleRect.x }
              : null,
          headerPaddingStart,
          headerStart: headerInnerRect?.x ?? null,
        }
      })

      expect(geometry.brandMark, viewport.name).not.toBeNull()
      expect(geometry.brandMark!.width, viewport.name).toBe(24)
      const headerOverflow = await expectNoHorizontalOverflow(page, viewport.name)
      expect(headerOverflow.offenders, headerOverflow.message).toEqual([])

      if (viewport.alignTo === 'documentation-title') {
        expect(geometry.documentationTitle, viewport.name).not.toBeNull()
        expect(
          Math.abs(geometry.brandMark!.x - geometry.documentationTitle!.x),
          viewport.name,
        ).toBeLessThanOrEqual(1)
      } else {
        expect(geometry.documentationTitle, viewport.name).toBeNull()
        expect(geometry.headerPaddingStart, viewport.name).not.toBeNull()
        expect(geometry.headerStart, viewport.name).not.toBeNull()
        expect(
          Math.abs(geometry.brandMark!.x - (geometry.headerStart! + geometry.headerPaddingStart!)),
          viewport.name,
        ).toBeLessThanOrEqual(1)
      }
    }
  })

  // Production mode checks every prebuilt component page; development mode checks
  // one representative per category so Next's on-demand compiler does not restart
  // mid-run.
  const overflowCheckedComponents = isProductionE2E
    ? componentEntries
    : componentEntries.filter(
        (component, index, entries) =>
          entries.findIndex((entry) => entry.category === component.category) === index,
      )
  const overflowComponentTitleOverrides = new Map([
    ['content-feature-media', /Feature Media Block for Payload CMS/],
    ['content-image-lead', /Image-led Content Block for Payload CMS/],
  ])

  const overflowRoutes = [
    {
      h1: heroHeadline,
      path: '/',
      title: homeMetadataTitle,
    },
    {
      h1: 'Introduction',
      path: '/docs',
      title: /CLI setup and architecture/,
    },
    {
      h1: 'Architecture',
      path: '/docs/architecture',
      title: /Architecture/,
    },
    {
      h1: 'Design philosophy',
      path: '/docs/design',
      title: /Design philosophy/,
    },
    {
      h1: catalogTitle,
      path: '/components',
      title: new RegExp(catalogMetadataTitle),
    },
    {
      h1: 'Why Payload Components exists',
      path: '/about',
      title: /About/,
    },
    {
      h1: 'Payload Components',
      path: '/about/case-study',
      title: /Design case study/,
    },
    {
      h1: 'Help shape an editorial publishing system.',
      path: '/roadmap/editorial',
      title: /Editorial component roadmap/,
    },
    {
      h1: 'The Payload Components brand',
      path: '/brand-guide',
      title: /Brand Guide/,
    },
    ...overflowCheckedComponents.map((component) => ({
      h1: component.title,
      path: component.href,
      title: overflowComponentTitleOverrides.get(component.slug) ?? new RegExp(component.title),
    })),
  ]

  /* One test per route rather than one long walk: the walk used to fold every
     route into a single sequential test, so one slow navigation could push the
     whole matrix over the per-test timeout even though every route passed in
     isolation, and a failure only pointed at the matrix, never the route. */
  for (const overflowRoute of overflowRoutes) {
    test(`route ${overflowRoute.path} exposes title, h1, and no horizontal overflow`, async ({
      page,
    }) => {
      // Each /docs/components/<slug> page embeds a live-preview iframe that compiles a
      // second route (/components/preview/<slug>). Compiling that preview alongside the
      // page overwhelms the dev server (ERR_CONNECTION_RESET). This smoke check only
      // asserts the page's title/h1/overflow, so block the preview subframe.
      await page.route('**/components/preview/**', (previewRoute) => previewRoute.abort())

      await page.goto(`${baseURL}${overflowRoute.path}`, { waitUntil: 'domcontentloaded' })
      await expect(page).toHaveTitle(overflowRoute.title)
      await expect(page.getByRole('heading', { level: 1, name: overflowRoute.h1 })).toBeVisible()

      // domcontentloaded can fire before webfonts settle final layout widths.
      await page.evaluate(() => document.fonts.ready)
      const routeOverflow = await expectNoHorizontalOverflow(page, overflowRoute.path)
      expect(routeOverflow.offenders, routeOverflow.message).toEqual([])
    })
  }

  for (const locale of ['zh', 'ja', 'ko', 'ar']) {
    test(`redirects inactive ${locale} catalog links to English without losing location`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      await page.goto(`${baseURL}/${locale}/components?q=hero#hero-basic`)
      await expect(page).toHaveURL(`${baseURL}/components?q=hero#hero-basic`)
      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
      await expect(
        page.locator('article#hero-basic').getByRole('link', { name: 'Hero Basic', exact: true }),
      ).toBeVisible()
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/components$/)
      await expect(page.locator('link[rel="alternate"][hreflang="zh-CN"]')).toHaveCount(0)
      await expect(page.getByRole('combobox', { name: 'Language', exact: true })).toHaveCount(0)
      const overflow = await expectNoHorizontalOverflow(page, '/components')
      expect(overflow.offenders, overflow.message).toEqual([])
    })
  }

  test('does not offer inactive languages on desktop or in mobile navigation', async ({ page }) => {
    await page.goto(`${baseURL}/docs`)
    await expect(page.locator('form[action="/locale"]')).toHaveCount(0)
    await page.setViewportSize({ width: 320, height: 800 })
    await waitForCopyController(page)
    await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
    await expect(page.locator('#mobile-navigation')).toBeVisible()
    await expect(page.locator('form[action="/locale"]')).toHaveCount(0)
  })

  test('language endpoint falls back to English and preserves route, query, and hash', async ({
    page,
  }) => {
    const destination = '/ja/components?q=hero#hero-basic'
    await page.goto(`${baseURL}/locale?locale=ja&returnTo=${encodeURIComponent(destination)}`)
    await expect(page).toHaveURL(`${baseURL}/components?q=hero#hero-basic`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  for (const resource of [
    '/docs',
    '/docs/architecture.md',
    '/llms.mdx/docs/architecture/content.md',
    '/og/docs/architecture/image.png',
  ]) {
    test(`inactive locale redirects the ${resource} resource`, async ({ request }) => {
      const response = await request.get(`${baseURL}/zh${resource}?source=saved`, {
        maxRedirects: 0,
      })
      expect(response.status()).toBe(307)
      const destination = new URL(response.headers().location, response.url())
      expect(destination.pathname).toBe(resource)
      expect(destination.search).toBe('?source=saved')
    })
  }

  test('drives the responsive component preview frame', async ({ page }) => {
    await page.goto(`${baseURL}/docs/components/hero-basic`)

    const frame = page.locator('iframe[title="Hero Basic preview"]')
    await expect(frame).toBeVisible()

    // Viewport presets are a toggle group; Mobile constrains the frame width.
    const mobile = page.getByRole('button', { name: 'Mobile' })
    await expect(mobile).toHaveAttribute('aria-pressed', 'false')
    await mobile.click()
    await expect(mobile).toHaveAttribute('aria-pressed', 'true')
    await expect.poll(async () => (await frame.boundingBox())?.width ?? 0).toBeLessThanOrEqual(400)
  })

  test('mobile header stays bounded and supports keyboard disclosure', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 })
    await page.goto(`${baseURL}/docs`)
    const trigger = page.getByRole('button', { name: 'Open navigation' })
    const navigation = page.locator('#mobile-navigation')
    await expect(trigger).toBeVisible()
    await expect(navigation).toBeAttached()
    await expect(navigation).toBeHidden()
    await trigger.click()
    await expect(navigation).toBeVisible()
    const docsLink = navigation.getByRole('link', { name: 'Docs' })
    await expect(docsLink).toBeVisible()
    await expect(docsLink).toHaveClass(/bg-secondary/)
    await expect(docsLink).toHaveClass(/text-foreground/)
    await expect(navigation.getByRole('link', { name: 'Components' })).toHaveClass(
      /text-muted-foreground/,
    )
    /* The accessible name is the localized Header.github string, matching the
       desktop control; "GitHub" stays the visible label, which is what keeps
       the name label-in-name compliant. */
    const githubLink = navigation.getByRole('link', { name: 'GitHub repository' })
    await expect(githubLink).toHaveAttribute('target', '_blank')
    await expect(githubLink).toHaveAttribute('rel', 'noreferrer')
    await expect(githubLink).toHaveText('GitHub')
    await expect(page.getByRole('button', { name: 'Close navigation' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(navigation).toBeAttached()
    await expect(navigation).toBeHidden()
    await expect(trigger).toBeFocused()
    const mobileNavOverflow = await expectNoHorizontalOverflow(page, 'the 320px mobile navigation')
    expect(mobileNavOverflow.offenders, mobileNavOverflow.message).toEqual([])
  })

  test('saved-locale docs retain an accessible English mobile GitHub link', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 })
    await page.goto(`${baseURL}/zh/docs`)
    await waitForCopyController(page)

    await page.getByRole('button', { name: 'Open navigation' }).click()
    const githubLink = page
      .locator('#mobile-navigation')
      .getByRole('link', { name: 'GitHub repository' })

    await expect(githubLink).toBeVisible()
    await expect(githubLink).toHaveText('GitHub')
  })

  test('preview frame grows and shrinks across presets without analytics', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 })
    await page.goto(`${baseURL}/docs/components/hero-basic`)
    const frame = page.locator('iframe[title="Hero Basic preview"]')
    await expect(frame.contentFrame().locator('main')).toBeVisible()
    await expect.poll(async () => (await frame.boundingBox())?.height ?? 0).toBeGreaterThan(160)
    const initial = (await frame.boundingBox())?.height ?? 0
    await page.getByRole('button', { name: 'Mobile' }).click()
    await expect.poll(async () => (await frame.boundingBox())?.height ?? 0).toBeGreaterThan(initial)
    const mobileHeight = (await frame.boundingBox())?.height ?? initial
    await page.getByRole('button', { name: 'Desktop' }).click()
    await expect
      .poll(async () => (await frame.boundingBox())?.height ?? 0)
      .toBeLessThan(mobileHeight - 2)
    await page.getByRole('button', { name: 'Mobile' }).click()
    await expect
      .poll(async () => (await frame.boundingBox())?.height ?? 0)
      .toBeGreaterThan(mobileHeight - 2)

    await page.goto(`${baseURL}/components/preview/hero-basic`)
    await expect(
      page.locator(
        'script[src*="googletagmanager"], script[src*="vercel"], script[src*="posthog"]',
      ),
    ).toHaveCount(0)
  })

  test('component wiring paths and actions wrap at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 })
    await page.goto(`${baseURL}/docs/components/logo-cloud-inline-wrap`)
    const wiring = page.getByText('What it installs', { exact: false }).locator('..')
    const path = page
      .locator('code:visible')
      .filter({ hasText: 'src/blocks/LogoCloudInlineWrap/Component.tsx' })
    await expect(path).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    await expect
      .poll(async () =>
        path.evaluate((el) => {
          const style = getComputedStyle(el)
          const line = Number.parseFloat(style.lineHeight)

          return {
            breakable: style.overflowWrap === 'anywhere' || style.wordBreak === 'break-all',
            fits: el.scrollWidth <= el.clientWidth,
            multiline: el.getBoundingClientRect().height > line * 1.5,
          }
        }),
      )
      .toEqual({ breakable: true, fits: true, multiline: true })
    const ledgerOverflow = await expectNoHorizontalOverflow(page, 'the wiring ledger')
    expect(ledgerOverflow.offenders, ledgerOverflow.message).toEqual([])
    await expect(wiring).toBeVisible()
  })

  test('serves the standalone preview route without site chrome or overflow', async ({ page }) => {
    await page.goto(`${baseURL}/components/preview/hero-basic`)

    await expect(page.locator('main')).toBeVisible()
    // The bare iframe target inherits only the root layout — no header/footer.
    await expect(page.getByRole('contentinfo')).toHaveCount(0)

    const previewOverflow = await expectNoHorizontalOverflow(page, 'the standalone preview route')
    expect(previewOverflow.offenders, previewOverflow.message).toEqual([])
  })

  test('marks only the current top-level navigation item active', async ({ page }) => {
    await page.goto(baseURL)
    await expect(page.getByRole('navigation').locator('a.bg-secondary')).toHaveCount(0)

    for (const route of [
      { label: 'Docs', path: '/docs' },
      { label: 'Components', path: '/components' },
      { label: 'About', path: '/about' },
    ]) {
      await page.goto(`${baseURL}${route.path}`)
      await expect(
        page.getByRole('navigation').getByRole('link', { name: route.label }),
      ).toHaveClass(/bg-secondary/)
    }
  })

  test('redirects old kit docs URLs to component docs', async ({ page }) => {
    await page.goto(`${baseURL}/docs/kits/hero-basic`)
    expect(page.url()).toBe(`${baseURL}/docs/components/hero-basic`)
    await expect(page.getByRole('heading', { level: 1, name: 'Hero Basic' })).toBeVisible()

    await page.goto(`${baseURL}/docs/what-is-a-payload-kit`)
    expect(page.url()).toBe(`${baseURL}/docs/what-is-a-payload-component`)
  })

  test('filters the catalog from URL search params', async ({ page }) => {
    await page.goto(`${baseURL}/components?q=bento`)

    await expect(page.locator('#feature-bento')).toBeVisible()
    await expect(page.locator('#hero-basic')).toBeHidden()
    await expect(page.getByLabel('Search components')).toHaveValue('bento')

    await page.goto(`${baseURL}/components?category=features`)

    await expect(page.locator('#feature-grid-basic')).toBeVisible()
    await expect(page.locator('#feature-steps')).toBeVisible()
    await expect(page.locator('#hero-basic')).toBeHidden()
  })

  test('explains the catalog search promise without weakening component discovery', async ({
    page,
  }) => {
    await page.goto(`${baseURL}/components`)

    await expect(page.getByRole('heading', { level: 1, name: catalogTitle })).toBeVisible()
    await expect(page).toHaveTitle(new RegExp(catalogMetadataTitle))
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      catalogMetadataDescription,
    )
    await expect(
      page.getByRole('link', { name: catalogInstallationLinkLabel, exact: true }),
    ).toHaveAttribute('href', '/docs/installation')
    await expect(
      page.getByRole('link', { name: catalogBlocksGuideLinkLabel, exact: true }),
    ).toHaveAttribute('href', '/docs/payload-blocks')

    for (const component of componentEntries) {
      await expect(page.locator(`a[href="${component.href}"]`).first()).toBeAttached()
    }
  })

  test('gives nearby search pages distinct titles and catalog paths', async ({ page }) => {
    const routes = [
      {
        link: /Browse the components/,
        path: '/',
        title: new RegExp(homeMetadataTitle),
      },
      {
        link: new RegExp(`Browse all ${componentEntries.length} installable components`),
        path: '/blog',
        title: new RegExp(blogTitle),
      },
      {
        link: /Browse the catalog/,
        path: '/about',
        title: /About \| Payload Components/,
      },
      {
        link: /Component Catalog/,
        path: '/docs',
        title: /CLI setup and architecture/,
      },
      {
        link: /component catalog/,
        path: '/docs/installation',
        title: /Install Payload CMS blocks with the CLI/,
      },
    ]

    for (const route of routes) {
      await page.goto(`${baseURL}${route.path}`)
      await expect(page).toHaveTitle(route.title)
      await expect(page.getByRole('link', { name: route.link }).first()).toHaveAttribute(
        'href',
        '/components',
      )
    }
  })

  test('filters catalog immediately, debounces shareable URL state, and syncs popstate', async ({
    page,
  }) => {
    await page.goto(`${baseURL}/components`)
    const search = page.getByLabel('Search components')
    await expect(search).toHaveValue('')

    const initialUrl = page.url()
    const navigations: string[] = []
    const requests: string[] = []
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) navigations.push(frame.url())
    })
    page.on('request', (request) => {
      if (request.isNavigationRequest() || request.resourceType() === 'document') {
        requests.push(request.url())
      }
    })

    await search.fill('feature-bento')

    // Filtering is local state: cards update without waiting for a route change.
    await expect(page.locator('#feature-bento')).toBeVisible()
    expect(page.url()).toBe(initialUrl)

    // The URL is intentionally debounced (250ms); no document/RSC navigation
    // should be generated for each keypress or for the history-only update.
    await page.waitForTimeout(150)
    expect(page.url()).toBe(initialUrl)
    await expect.poll(() => page.url(), { timeout: 5000 }).toContain('/components?q=feature-bento')
    // replaceState updates the frame URL without a document request; the
    // initial frame event and history-only URL events are expected.
    expect(navigations.length).toBeGreaterThan(0)
    expect(requests).toEqual([])

    // Browser history restores the input and local result set through popstate.
    await page.evaluate(() => {
      window.history.pushState(null, '', '/components?q=hero-basic')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    await expect(search).toHaveValue('hero-basic')
    await expect(page.locator('#hero-basic')).toBeVisible()

    // A family selection made inside the debounce window must carry the
    // in-progress local query instead of restoring stale router state.
    await search.fill('hero')
    await page
      .getByRole('button', { name: /Page blocks/ })
      .first()
      .click()
    await expect(search).toHaveValue('hero')
    await expect.poll(() => new URL(page.url()).searchParams.get('q')).toBe('hero')
    await expect.poll(() => new URL(page.url()).searchParams.get('type')).toBe('pages')
  })

  test('composes several blocks into one install command and shares it in the URL', async ({
    context,
    page,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`${baseURL}/components`)

    const tray = page.getByRole('region', { name: composerTrayLabel })

    // No selection, no bar: it must never cover the last row of the wall.
    await expect(tray).toBeHidden()

    await page.getByRole('button', { name: composerAddLabel('hero-basic') }).click()
    await expect(tray).toBeVisible()

    // Selecting across families is the point — the command carries both.
    await page.getByLabel('Search components').fill('faq-card')
    await page.getByRole('button', { name: composerAddLabel('faq-card') }).click()

    const expectedCommand = composerInstallCommand(['hero-basic', 'faq-card'])
    await expect(tray.getByText(expectedCommand)).toBeVisible()
    await expect(tray.getByText('2 selected')).toBeVisible()

    // The selection is shareable state, and the in-progress query is preserved.
    await expect.poll(() => new URL(page.url()).searchParams.get('add')).toBe('hero-basic,faq-card')
    await expect.poll(() => new URL(page.url()).searchParams.get('q')).toBe('faq-card')

    // The tray copies one command for the whole set.
    await tray.getByRole('button', { name: composerCopyLabel }).click()
    await expect(page.getByText(copiedAlertText)).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(expectedCommand)

    // A selected card offers the inverse action.
    await expect(page.getByRole('button', { name: composerRemoveLabel('faq-card') })).toBeVisible()

    await tray.getByRole('button', { name: composerClearLabel }).click()
    await expect(tray).toBeHidden()
    await expect.poll(() => new URL(page.url()).searchParams.get('add')).toBeNull()
  })

  test('restores a shared selection and ignores unknown slugs in it', async ({ page }) => {
    await page.goto(`${baseURL}/components?add=hero-basic,not-a-component,hero-basic`)

    const tray = page.getByRole('region', { name: composerTrayLabel })

    // Deduplicated, and an unknown name can never reach the command.
    await expect(tray.getByText('1 selected')).toBeVisible()
    await expect(tray.getByText(composerInstallCommand(['hero-basic']))).toBeVisible()
    await expect(
      page.getByRole('button', { name: composerRemoveLabel('hero-basic') }),
    ).toBeVisible()
  })

  test('presents upcoming post components as public roadmap proposals', async ({ page }) => {
    test.skip(upcomingComponents.length === 0, 'Every proposed post component is installable.')
    const component = upcomingComponents[0]

    await page.goto(`${baseURL}/components?type=posts`)

    await expect(page.getByText('Concept preview', { exact: true })).toHaveCount(
      upcomingComponents.length,
    )
    await expect(page.getByText(component.title).first()).toBeVisible()

    const roadmapLink = page.getByRole('link', {
      name: `View ${component.title} on the editorial roadmap`,
    })
    await expect(roadmapLink).toHaveAttribute('href', `/roadmap/editorial#${component.slug}`)

    await roadmapLink.focus()
    await expect(roadmapLink).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(`${baseURL}/roadmap/editorial#${component.slug}`)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Help shape an editorial publishing system.',
      }),
    ).toBeVisible()
  })

  test('keeps the editorial roadmap coherent once every proposal has shipped', async ({ page }) => {
    test.skip(upcomingComponents.length > 0, 'Open proposals are listed instead.')

    await page.goto(`${baseURL}/components?type=posts`)
    await expect(page.getByRole('button', { name: composerAddLabel('post-hero') })).toBeVisible()
    await expect(page.getByText('Concept preview', { exact: true })).toHaveCount(0)

    await page.goto(`${baseURL}/roadmap/editorial`)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Help shape an editorial publishing system.',
      }),
    ).toBeVisible()
    const collection = page.locator('#collection')
    // No empty proposal list: the section invites the next proposal instead.
    await expect(collection.getByRole('list')).toHaveCount(0)
    await expect(collection.getByText(/Propose the next one\.$/)).toBeVisible()
    await expect(collection.getByRole('link', { name: 'Open an issue' })).toHaveAttribute(
      'href',
      /\/issues\/new\?template=feature_request\.yml/,
    )
  })

  test('shows installable article components in the Posts filter and composer', async ({
    page,
  }) => {
    await page.goto(`${baseURL}/components?type=posts`)
    await expect(page.getByRole('button', { name: composerAddLabel('post-hero') })).toBeVisible()
    await expect(page.getByRole('button', { name: composerAddLabel('author-card') })).toBeVisible()
    await expect(
      page.getByRole('button', { name: composerAddLabel('related-posts') }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: composerAddLabel('hero-basic') })).toHaveCount(0)
    await page.getByRole('button', { name: composerAddLabel('post-hero') }).click()
    await expect(page.getByRole('region', { name: composerTrayLabel })).toContainText(
      'npx payload-components add post-hero',
    )
    await page.goto(`${baseURL}/docs/components/post-hero`)
    await expect(page.getByText('Post component', { exact: true })).toBeVisible()
  })

  test('exposes every landing section, the catalog teaser, and the footer', async ({ page }) => {
    await page.goto(baseURL)

    for (const section of Object.values(landingSections)) {
      await expect(page.getByRole('heading', { level: 2, name: section.heading })).toBeVisible()
    }

    // The bench ends on the catalog; the full index lives at /components.
    await expect(
      page.getByRole('link', { name: `Browse ${componentEntries.length} blocks` }),
    ).toBeAttached()
    await expect(page.locator('code', { hasText: primaryInstallCommand }).first()).toBeVisible()

    await expect(page.getByRole('contentinfo')).toBeVisible()
    await expect(page.getByRole('link', { name: /GitHub/ }).first()).toBeVisible()
    await expect(
      page.getByRole('contentinfo').getByRole('link', { name: 'Brand Guide' }),
    ).toBeVisible()
  })

  test('exposes the Fumadocs docs shell navigation', async ({ page }) => {
    await page.goto(`${baseURL}/docs`)

    const sidebar = page.locator('#nd-sidebar')

    await expect(sidebar.getByRole('link', { name: 'Architecture' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Installation' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Registry Contract' })).toBeVisible()
    // Components are grouped install-mode → family in the sidebar (see src/lib/component-page-tree).
    await expect(sidebar.getByRole('button', { name: 'Page blocks' })).toBeVisible()
    await expect(sidebar.getByRole('button', { name: 'Feature' })).toBeVisible()
    await expect(sidebar.getByRole('button', { name: /Search/ })).toBeVisible()
  })

  test('hydrates docs pages without React errors', async ({ page }) => {
    /* Docs pages are prerendered at their internal /en route and served at the
       public URL. Fumadocs matched its chrome (the TOC trigger label, the
       prev/next footer) against a pathname that read /en/docs in the static
       HTML and /docs in the browser, so every docs page threw React #418 in
       production. Dev renders on request and never showed it. */
    const pageErrors: string[] = []
    page.on('pageerror', (error) => pageErrors.push(error.message))

    for (const path of [
      '/docs',
      '/docs/installation',
      '/docs/components/hero-basic',
      '/docs/design',
    ]) {
      await page.goto(`${baseURL}${path}`)
      await waitForCopyController(page)
      expect(pageErrors, path).toEqual([])
    }
  })

  test('keeps the site typefaces, accents, and radius scale on docs and blog routes', async ({
    page,
  }) => {
    /* The docs and blog build Tailwind a second time (src/app/fumadocs.css), and
       that build's stock theme used to replace these on every one of their
       pages. The landing loads globals.css alone, so it is the reference; the
       Fumadocs routes must resolve identically. */
    const readTokens = () =>
      page.evaluate(() => {
        const root = getComputedStyle(document.documentElement)
        const probe = (className: string, color = '') => {
          const element = document.createElement('div')
          element.className = className
          element.style.color = color
          document.body.appendChild(element)
          const style = getComputedStyle(element)
          const resolved = { color: style.color, radius: style.borderTopLeftRadius }
          element.remove()
          return resolved
        }

        const header = document.querySelector('body > header')

        return {
          bodyFont: getComputedStyle(document.body).fontFamily,
          /* The Datasheet brand faces, and the shared header that wears them. */
          display: root.getPropertyValue('--font-display').trim(),
          error: probe('', 'var(--color-fd-error)').color,
          headerFont: header ? getComputedStyle(header).fontFamily : '',
          mono: root.getPropertyValue('--font-mono').trim(),
          radii: ['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl'].map(
            (utility) => probe(utility).radius,
          ),
          sans: root.getPropertyValue('--font-sans').trim(),
          serif: root.getPropertyValue('--font-serif').trim(),
          spec: root.getPropertyValue('--font-spec').trim(),
          success: probe('', 'var(--color-fd-success)').color,
        }
      })

    await page.goto(baseURL)
    const site = await readTokens()
    expect(site.sans).toContain('Geist')
    expect(site.mono).toContain('Geist')
    expect(site.serif).toContain('Instrument Serif')
    expect(site.display).toContain('Archivo')
    expect(site.spec).toContain('Azeret Mono')
    expect(site.headerFont).toContain('Archivo')
    expect(site.bodyFont).toContain('Geist')
    /* A real scale, so equality below cannot pass on probes that all read 0px. */
    const radii = site.radii.map((value) => Number.parseFloat(value))
    expect(radii.every((value, index) => value > (radii[index - 1] ?? 0))).toBe(true)

    for (const path of ['/docs/installation', '/blog/what-is-a-payload-cms-block']) {
      await page.goto(`${baseURL}${path}`)
      expect(await readTokens(), path).toEqual(site)
    }
  })

  test('keeps every demo twin on the component tokens inside the branded landing', async ({
    page,
  }) => {
    /* The landing wears the Datasheet brand ([data-brand]: Archivo, Azeret
       Mono, the --brand ramp remapped to trace green), and every twin in it
       sits in a .preview-scope that restores the component tokens. The visual
       baselines only see the chrome-free preview routes, so this is the check
       that a twin INSIDE the chrome still renders as it installs. */
    await page.goto(baseURL)
    await page.evaluate(() => document.fonts.ready)

    const report = await page.evaluate(() => {
      const resolve = (host: Element, property: 'color' | 'fontFamily', value: string) => {
        const probe = document.createElement('span')
        if (property === 'color') probe.style.color = value
        host.appendChild(probe)
        const resolved = getComputedStyle(probe)[property]
        probe.remove()
        return resolved
      }
      const chrome = document.querySelector('main[data-brand]')
      const scopes = [...document.querySelectorAll('main[data-brand] .preview-scope')]
      const leaks: string[] = []

      for (const scope of scopes) {
        for (const element of scope.querySelectorAll('*')) {
          if (element.children.length > 0 || !element.textContent?.trim()) continue
          const family = getComputedStyle(element).fontFamily
          if (/Archivo|Azeret/.test(family)) leaks.push(`${element.tagName}: ${family}`)
        }
      }

      return {
        chromeBrand: chrome ? resolve(chrome, 'color', 'var(--brand)') : '',
        chromeFont: chrome ? resolve(chrome, 'fontFamily', '') : '',
        componentBrand: resolve(document.body, 'color', 'var(--brand)'),
        componentFont: getComputedStyle(document.body).fontFamily,
        headline: getComputedStyle(document.querySelector('h1') as Element).fontFamily,
        leaks: leaks.slice(0, 10),
        scopeBrands: [...new Set(scopes.map((scope) => resolve(scope, 'color', 'var(--brand)')))],
        scopeFonts: [...new Set(scopes.map((scope) => resolve(scope, 'fontFamily', '')))],
        scopes: scopes.length,
      }
    })

    /* The chrome really is branded, so the equalities below are not vacuous. */
    expect(report.headline).toContain('Archivo')
    expect(report.chromeFont).toContain('Archivo')
    expect(report.chromeBrand).not.toBe(report.componentBrand)

    /* One rendered twin per part the bench can put on the page. */
    expect(report.scopes).toBe(benchTour.length)
    expect(report.leaks).toEqual([])
    expect(report.scopeFonts).toEqual([report.componentFont])
    expect(report.scopeBrands).toEqual([report.componentBrand])
  })

  test('draws hero-basic as a datasheet pinout in the hero', async ({ page }) => {
    const hero = page.locator('.hero-shell')

    for (const viewport of [
      { drawing: '.pinout-desktop', height: 900, width: 1440 },
      { drawing: '.pinout-phone', height: 844, width: 390 },
    ]) {
      await page.setViewportSize({ height: viewport.height, width: viewport.width })
      await page.goto(baseURL)

      /* Decorative: the headline and command carry the claim in text. */
      const drawing = hero.locator(`.bench-board [data-active] svg${viewport.drawing}`)
      await expect(drawing).toBeVisible()
      await expect(drawing).toHaveAttribute('aria-hidden', 'true')
      /* Five fields in, five artifacts out. */
      await expect(drawing.locator('.pinout-net')).toHaveCount(5)
      await expect(drawing.locator('.pinout-leg:not(.pinout-leg-out)')).toHaveCount(5)
    }
  })

  test('opens every component page’s install section with its datasheet', async ({ page }) => {
    /* The drawing comes from the manifest (outputs) and the block config or
       props type (inputs); tests/int/datasheet.int.spec.ts checks the data for
       every component. This checks that it renders, per layout: a wired block
       and a file-only component, on the drawing's own two layouts. */
    const cases = [
      {
        caption:
          'Fig. 1 Pinout of PC-HERO-BASIC: 5 fields in (pins 1–4 from the shared heroFields base), 5 outputs to your project.',
        nets: 5,
        slug: 'hero-basic',
      },
      {
        caption: 'Fig. 1 Pinout of PC-RELATED-POSTS: 4 props in, 1 output to your project.',
        nets: 1,
        slug: 'related-posts',
      },
    ]

    for (const viewport of [
      { drawing: '.pinout-desktop', height: 900, width: 1440 },
      { drawing: '.pinout-phone', height: 844, width: 390 },
    ]) {
      await page.setViewportSize({ height: viewport.height, width: viewport.width })
      for (const { caption, nets, slug } of cases) {
        await page.goto(`${baseURL}/docs/components/${slug}`)
        const figure = page.locator('figure.datasheet-figure')
        const drawing = figure.locator(`svg${viewport.drawing}`)

        await expect(drawing, `${slug} ${viewport.width}`).toBeVisible()
        await expect(drawing).toHaveAttribute('aria-hidden', 'true')
        await expect(drawing.locator('.pinout-net')).toHaveCount(nets)
        await expect(figure.locator('figcaption')).toHaveText(caption)
      }
    }
  })

  test('brands the docs and blog chrome and keeps their reading columns on Geist', async ({
    page,
  }) => {
    const font = (selector: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((element) => getComputedStyle(element).fontFamily)

    await page.goto(`${baseURL}/docs/installation`)
    expect(await font('#nd-sidebar')).toContain('Archivo')
    expect(await font('#nd-page h1')).toContain('Archivo')
    expect(await font('#nd-page .prose p')).toContain('Geist')

    await page.goto(`${baseURL}/blog/what-is-a-payload-cms-block`)
    expect(await font('main h1')).toContain('Archivo')
    expect(await font('main article p')).toContain('Geist')

    await page.goto(`${baseURL}/components`)
    expect(await font('main h1')).toContain('Archivo')
  })

  test('exposes a working command copy control', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(baseURL)
    await waitForCopyController(page)
    await stubGtagEvents(page)

    const copyButton = page.locator('.hero-shell button[data-copy-command]')

    await expect(copyButton).toHaveAccessibleName('Copy install command')
    await copyButton.click()
    await expect(copyButton).toHaveAccessibleName('Copied')
    await expectCopiedAlert(page)
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(primaryInstallCommand)
    await expect(copyButton).toHaveAccessibleName('Copy install command', { timeout: 2_000 })
    expect(await getGtagEvents(page)).toContainEqual([
      'event',
      'copy_install_command',
      {
        command: primaryInstallCommand,
        component: 'hero-basic',
        source_path: '/',
      },
    ])
    expect(await getPostHogEvents(page)).toEqual(
      expect.arrayContaining([
        {
          event: 'copy_install_command',
          properties: {
            command: primaryInstallCommand,
            component: 'hero-basic',
            source_path: '/',
          },
        },
      ]),
    )
  })

  test('attributes the canonical comparison guide install action to the guide', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`${baseURL}/docs/shadcn-vs-payload-components`)
    await waitForCopyController(page)
    await stubGtagEvents(page)

    const copyButton = page.getByRole('button', { name: 'Copy install command', exact: true })
    await expect(copyButton).toBeVisible()
    await copyButton.click()

    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(primaryInstallCommand)
    expect(await getGtagEvents(page)).toContainEqual([
      'event',
      'copy_install_command',
      {
        command: primaryInstallCommand,
        component: 'hero-basic',
        source_path: '/docs/shadcn-vs-payload-components',
      },
    ])
    expect(await getPostHogEvents(page)).toEqual(
      expect.arrayContaining([
        {
          event: 'copy_install_command',
          properties: {
            command: primaryInstallCommand,
            component: 'hero-basic',
            source_path: '/docs/shadcn-vs-payload-components',
          },
        },
      ]),
    )
  })

  test('turns the first-block workflow into an attributed install entry', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`${baseURL}/docs/first-block`)
    await waitForCopyController(page)
    await stubGtagEvents(page)

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Use your first Payload CMS v3 block',
      }),
    ).toBeVisible()

    const copyButton = page.getByRole('button', {
      name: 'Copy the feature-grid-basic install command',
    })
    await expect(copyButton).toBeVisible()
    await copyButton.click()

    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe('npx payload-components add feature-grid-basic')
    expect(await getGtagEvents(page)).toContainEqual([
      'event',
      'copy_install_command',
      {
        command: 'npx payload-components add feature-grid-basic',
        component: 'feature-grid-basic',
        source_path: '/docs/first-block',
      },
    ])
    expect(await getPostHogEvents(page)).toEqual(
      expect.arrayContaining([
        {
          event: 'copy_install_command',
          properties: {
            command: 'npx payload-components add feature-grid-basic',
            component: 'feature-grid-basic',
            source_path: '/docs/first-block',
          },
        },
      ]),
    )
  })

  test('turns the top search component pages into attributed install entries', async ({
    page,
    context,
  }) => {
    const entries = [
      {
        description:
          'Install a typed Payload CMS content-list block with a serif heading and labeled terms. The CLI wires it into your Pages layout, renderer, types, and import map.',
        seoTitle: 'Content List Block for Payload CMS',
        slug: 'content-list',
      },
      {
        description:
          'Install a typed Payload CMS content block with a full-width lead image, two-column copy, and CTA. The CLI wires it into your Pages layout and renderer.',
        seoTitle: 'Image-led Content Block for Payload CMS',
        slug: 'content-image-lead',
      },
      {
        description:
          'Install a typed Payload CMS feature-media block with body copy, two icon features, and a framed image. The CLI wires it into your Pages layout and renderer.',
        seoTitle: 'Feature Media Block for Payload CMS',
        slug: 'content-feature-media',
      },
    ] as const

    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    for (const entry of entries) {
      const command = `npx payload-components add ${entry.slug}`
      const sourcePath = `/docs/components/${entry.slug}`

      await page.goto(`${baseURL}${sourcePath}`)
      await waitForCopyController(page)
      await stubGtagEvents(page)

      await expect(page).toHaveTitle(new RegExp(entry.seoTitle))
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        entry.description,
      )

      const installButton = page.getByRole('button', {
        name: `Copy the ${entry.slug} install command`,
      })
      await expect(installButton).toBeVisible()
      await expect(installButton).toHaveAttribute('data-cta-level', 'primary')
      await installButton.click()

      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(command)
      expect(await getGtagEvents(page)).toContainEqual([
        'event',
        'copy_install_command',
        {
          command,
          component: entry.slug,
          source_path: sourcePath,
        },
      ])
      expect(await getPostHogEvents(page)).toEqual(
        expect.arrayContaining([
          {
            event: 'copy_install_command',
            properties: {
              command,
              component: entry.slug,
              source_path: sourcePath,
            },
          },
        ]),
      )
      const entryOverflow = await expectNoHorizontalOverflow(page, sourcePath)
      expect(entryOverflow.offenders, entryOverflow.message).toEqual([])
    }
  })

  test('copies a catalog family-card command', async ({ page, context }) => {
    // feature-bento's card on /components; its command differs from the hero's
    // primaryInstallCommand.
    const catalogComponent = componentEntries.find((entry) => entry.slug === 'feature-bento')!

    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`${baseURL}/components`)
    await waitForCopyController(page)
    await page.locator(`#${catalogComponent.slug}`).getByRole('button', { name: 'Copy' }).click()

    await expect(
      page.locator(`#${catalogComponent.slug}`).getByRole('button', { name: 'Copied' }),
    ).toBeVisible()
    await expectCopiedAlert(page)
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(catalogComponent.command)
  })

  test('tracks primary GitHub link clicks', async ({ page }) => {
    await page.goto(baseURL)
    await stubGtagEvents(page)
    await page.evaluate(() => {
      document.addEventListener(
        'click',
        (event) => {
          const target = event.target
          if (!(target instanceof Element)) return

          if (target.closest('a[href="https://github.com/Ducksss/payload-components"]')) {
            event.preventDefault()
          }
        },
        { capture: true },
      )
    })

    await page.locator('a[href="https://github.com/Ducksss/payload-components"]').first().click()

    expect(await getGtagEvents(page)).toContainEqual([
      'event',
      'primary_link_click',
      {
        destination: 'github',
        href: 'https://github.com/Ducksss/payload-components',
        source_path: '/',
      },
    ])
    expect(await getPostHogEvents(page)).toEqual(
      expect.arrayContaining([
        {
          event: 'primary_link_click',
          properties: {
            destination: 'github',
            href: 'https://github.com/Ducksss/payload-components',
            source_path: '/',
          },
        },
      ]),
    )
  })

  test('marks only controlled install and GitHub actions', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`${baseURL}/?verification_run=1`)
    await waitForCopyController(page)
    await stubGtagEvents(page)
    await page.evaluate(() => {
      document.addEventListener(
        'click',
        (event) => {
          const target = event.target
          if (!(target instanceof Element)) return

          if (target.closest('a[href="https://github.com/Ducksss/payload-components"]')) {
            event.preventDefault()
          }
        },
        { capture: true },
      )
    })

    await page.locator('.hero-shell button[data-copy-command]').click()
    await page.locator('a[href="https://github.com/Ducksss/payload-components"]').first().click()

    expect(await getGtagEvents(page)).toEqual(
      expect.arrayContaining([
        [
          'event',
          'copy_install_command',
          {
            command: primaryInstallCommand,
            component: 'hero-basic',
            source_path: '/',
          },
        ],
        [
          'event',
          'primary_link_click',
          {
            destination: 'github',
            href: 'https://github.com/Ducksss/payload-components',
            source_path: '/',
          },
        ],
      ]),
    )
    expect(await getPostHogEvents(page)).toEqual(
      expect.arrayContaining([
        {
          event: 'copy_install_command',
          properties: {
            command: primaryInstallCommand,
            component: 'hero-basic',
            source_path: '/',
            verification_run: true,
          },
        },
        {
          event: 'primary_link_click',
          properties: {
            destination: 'github',
            href: 'https://github.com/Ducksss/payload-components',
            source_path: '/',
            verification_run: true,
          },
        },
      ]),
    )
    expect(JSON.stringify(await getPostHogEvents(page))).not.toContain('verification_run=1')
  })

  for (const sourcePath of ['/docs/installation', '/docs/payload-blocks']) {
    test(`keeps GitHub clicks attributable to ${sourcePath}`, async ({ page }) => {
      await page.goto(`${baseURL}${sourcePath}`)
      await waitForCopyController(page)
      await stubGtagEvents(page)
      await page.evaluate(() => {
        window.history.replaceState({}, '', `${window.location.pathname}#github-proof`)
        document.addEventListener(
          'click',
          (event) => {
            const target = event.target
            if (!(target instanceof Element)) return

            if (target.closest('a[href="https://github.com/Ducksss/payload-components"]')) {
              event.preventDefault()
            }
          },
          { capture: true },
        )
      })

      const githubLink = page.getByRole('link', { name: 'Star on GitHub', exact: true })
      await expect(githubLink).toHaveAttribute(
        'href',
        'https://github.com/Ducksss/payload-components',
      )
      await githubLink.click()

      expect(await getGtagEvents(page)).toContainEqual([
        'event',
        'primary_link_click',
        {
          destination: 'github',
          href: 'https://github.com/Ducksss/payload-components',
          source_path: sourcePath,
        },
      ])
      expect(await getPostHogEvents(page)).toEqual(
        expect.arrayContaining([
          {
            event: 'primary_link_click',
            properties: {
              destination: 'github',
              href: 'https://github.com/Ducksss/payload-components',
              source_path: sourcePath,
            },
          },
        ]),
      )
    })
  }

  test('shows an alert after copying a docs code block', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`${baseURL}/docs`)
    await waitForCopyController(page)

    await page.getByRole('button', { name: 'Copy Text' }).first().click()

    await expectCopiedAlert(page)
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(primaryInstallCommand)
  })

  test('copies troubleshooting commands without mislabeling maintenance as installs', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`${baseURL}/blog/anatomy-of-an-install`)
    await waitForCopyController(page)
    await stubGtagEvents(page)

    const postOverflow = await expectNoHorizontalOverflow(page, '/blog/anatomy-of-an-install')
    expect(postOverflow.offenders, postOverflow.message).toEqual([])

    const maintenanceCommands = [
      ['Copy the generate types command', 'pnpm payload generate:types'],
      ['Copy the generate import map command', 'pnpm payload generate:importmap'],
      ['Copy the doctor command', 'npx payload-components doctor'],
    ] as const

    for (const [label, command] of maintenanceCommands) {
      const button = page.getByRole('button', { name: label })
      await expect(button).toBeVisible()
      await button.focus()
      await expect(button).toBeFocused()
      await page.keyboard.press('Enter')
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(command)
    }

    expect(
      (await getGtagEvents(page)).filter(
        (event) => event[0] === 'event' && event[1] === 'copy_install_command',
      ),
    ).toHaveLength(0)
    expect(
      (await getPostHogEvents(page)).filter(({ event }) => event === 'copy_install_command'),
    ).toHaveLength(0)

    const installButton = page.getByRole('button', {
      name: 'Copy the hero-basic install command',
    })
    await installButton.focus()
    await expect(installButton).toBeFocused()
    await page.keyboard.press('Enter')
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe('npx payload-components add hero-basic')
    expect(await getGtagEvents(page)).toContainEqual([
      'event',
      'copy_install_command',
      {
        command: 'npx payload-components add hero-basic',
        component: 'hero-basic',
        source_path: '/blog/anatomy-of-an-install',
      },
    ])
  })

  test('copies the types repair and install commands with distinct attribution', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`${baseURL}/docs/payload-types-errors`)
    await waitForCopyController(page)
    await stubGtagEvents(page)

    const repairButton = page.getByRole('button', {
      name: 'Copy the generate types command',
    })
    await repairButton.click()
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe('pnpm payload generate:types')

    expect(
      (await getPostHogEvents(page)).filter(({ event }) => event === 'copy_install_command'),
    ).toHaveLength(0)

    const installButton = page.getByRole('button', {
      name: 'Copy the hero-basic install command',
    })
    await installButton.click()
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe('npx payload-components add hero-basic')

    expect(await getGtagEvents(page)).toContainEqual([
      'event',
      'copy_install_command',
      {
        command: 'npx payload-components add hero-basic',
        component: 'hero-basic',
        source_path: '/docs/payload-types-errors',
      },
    ])
    expect(await getPostHogEvents(page)).toEqual(
      expect.arrayContaining([
        {
          event: 'copy_install_command',
          properties: {
            command: 'npx payload-components add hero-basic',
            component: 'hero-basic',
            source_path: '/docs/payload-types-errors',
          },
        },
      ]),
    )
  })

  test('shows an alert after copying page markdown', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`${baseURL}/docs/installation`)
    await waitForCopyController(page)

    await page.getByRole('button', { name: /Copy Markdown/ }).click()

    await expectCopiedAlert(page)
  })

  test('tracks the primary installation command with installation attribution', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`${baseURL}/docs/installation`)
    await waitForCopyController(page)
    await stubGtagEvents(page)

    const installButton = page.getByRole('button', {
      name: 'Copy the hero-basic install command',
    })
    await installButton.click()

    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe('npx payload-components add hero-basic')
    expect(await getGtagEvents(page)).toContainEqual([
      'event',
      'copy_install_command',
      {
        command: 'npx payload-components add hero-basic',
        component: 'hero-basic',
        source_path: '/docs/installation',
      },
    ])
    expect(await getPostHogEvents(page)).toEqual(
      expect.arrayContaining([
        {
          event: 'copy_install_command',
          properties: {
            command: 'npx payload-components add hero-basic',
            component: 'hero-basic',
            source_path: '/docs/installation',
          },
        },
      ]),
    )
  })

  test('keeps the Payload blocks install primary while offering a non-installing dry run', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`${baseURL}/docs/payload-blocks`)
    await waitForCopyController(page)
    await stubGtagEvents(page)

    await expect(page).toHaveTitle(
      'Payload CMS blocks: create, register, type, and render | Payload Components',
    )
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Payload CMS blocks: create, register, type, and render in v3',
      }),
    ).toBeVisible()
    await expect(
      page.getByText(
        'Build Payload CMS blocks in v3 from Block config through collection registration, generated types, rendering, the admin import map, and a live page.',
        { exact: true },
      ),
    ).toBeVisible()
    await expect(
      page.getByText('Payload CMS blocks in v3 become live through one chain:', {
        exact: false,
      }),
    ).toBeVisible()

    const installButton = page.getByRole('button', {
      name: 'Copy the hero-basic install command',
    })
    const dryRunButton = page.getByRole('button', {
      name: 'Copy the hero-basic dry-run command',
    })

    await expect(installButton).toHaveAttribute('data-cta-level', 'primary')
    await expect(dryRunButton).toHaveAttribute('data-cta-level', 'secondary')

    await dryRunButton.click()
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe('npx payload-components add hero-basic --dry-run')
    expect(
      (await getGtagEvents(page)).filter(
        (event) => event[0] === 'event' && event[1] === 'copy_install_command',
      ),
    ).toHaveLength(0)
    expect(
      (await getPostHogEvents(page)).filter(({ event }) => event === 'copy_install_command'),
    ).toHaveLength(0)

    await installButton.click()
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe('npx payload-components add hero-basic')
    expect(await getGtagEvents(page)).toContainEqual([
      'event',
      'copy_install_command',
      {
        command: 'npx payload-components add hero-basic',
        component: 'hero-basic',
        source_path: '/docs/payload-blocks',
      },
    ])
    expect(await getPostHogEvents(page)).toEqual(
      expect.arrayContaining([
        {
          event: 'copy_install_command',
          properties: {
            command: 'npx payload-components add hero-basic',
            component: 'hero-basic',
            source_path: '/docs/payload-blocks',
          },
        },
      ]),
    )
  })
})

test.describe('Reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } })

  test('landing page keeps its desktop and mobile visual contract', async ({ page }) => {
    test.skip(process.platform !== 'linux', 'Visual baselines use the Linux CI renderer.')
    await page.goto(baseURL)
    await expect(page.getByRole('heading', { level: 1, name: heroHeadline })).toBeVisible()
    await page.evaluate(() => document.fonts.ready)

    await expect(page).toHaveScreenshot('landing-home-desktop.png', {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.015,
      timeout: 15_000,
    })

    await page.setViewportSize({ height: 900, width: 390 })
    await page.goto(baseURL)
    await expect(page.getByRole('heading', { level: 1, name: heroHeadline })).toBeVisible()
    await page.evaluate(() => document.fonts.ready)

    await expect(page).toHaveScreenshot('landing-home-mobile.png', {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.015,
      timeout: 15_000,
    })
  })

  test('the bench lays out every step, fully wired, without motion', async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 })
    await page.goto(baseURL)

    /* Reduced motion never pins the scene: every step is in the open and the
       part is drawn wired from the first paint. */
    const bench = page.locator('#bench')
    expect(
      await bench.locator('.bench-stage').evaluate((stage) => getComputedStyle(stage).position),
    ).not.toBe('sticky')

    for (const step of benchSteps) {
      await expect(
        bench.getByRole('heading', { level: 2, name: step.title.join('') }),
      ).toBeVisible()
    }

    const offsets = await bench
      .locator('.bench-board [data-active] svg.pinout-desktop .pinout-wire')
      .evaluateAll((wires) => wires.map((wire) => getComputedStyle(wire).strokeDashoffset))
    expect(offsets).toHaveLength(5)
    expect(offsets.every((offset) => Number.parseFloat(offset) === 0)).toBe(true)

    const benchOverflow = await expectNoHorizontalOverflow(page, 'the bench, stacked')
    expect(benchOverflow.offenders, benchOverflow.message).toEqual([])
  })

  test('opens the Fumadocs search dialog from the docs shell', async ({ page }) => {
    await page.goto(`${baseURL}/docs`)
    await waitForCopyController(page)

    const searchTrigger = page.getByRole('button', { name: /Search/ }).first()
    await searchTrigger.click()

    await expect(page.getByRole('dialog')).toBeVisible()
    // fumadocs-ui 16.15.18 exposes the search input as a combobox
    // (aria-autocomplete=list, aria-controls the result list).
    await expect(page.getByRole('dialog').getByRole('combobox', { name: 'Search' })).toBeFocused()

    await page.keyboard.press('Escape')

    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(searchTrigger).toBeFocused()
  })
})
