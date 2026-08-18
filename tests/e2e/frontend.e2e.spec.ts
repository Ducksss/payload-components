import { expect, type Page, test } from '@playwright/test'

import { grantConsent } from './consent'

import {
  blogTitle,
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
  terminalDemoLines,
  upcomingComponents,
} from '../../src/lib/site'

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
   assertions need the scripts mounted, and the landing snapshots are baselined
   without the consent banner over them. The banner has its own spec. */
test.beforeEach(async ({ context }) => grantConsent(context))

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
    const heroStack = page.locator('.hero-shell > .container').first()
    const wall = page.locator('.component-wall')

    await expect(headline).toBeVisible()
    await expect(wall).toBeAttached()

    const headlineSize = await headline.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    )
    const stackPaddingTop = await heroStack.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).paddingTop),
    )

    expect(headlineSize).toBeLessThanOrEqual(88.1)
    expect(stackPaddingTop).toBe(64)

    /* The command has to survive above the fold — the wall is proof, not the
       pitch, so it may never push the CTA row off a 900px-tall viewport. */
    const ctaBottom = await page
      .getByRole('button', { name: 'Copy install command' })
      .first()
      .evaluate((element) => element.getBoundingClientRect().bottom)
    expect(ctaBottom).toBeLessThan(900)

    /* The wall is full-bleed and tilted; it must still never scroll the page
       sideways. */
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(hasHorizontalOverflow).toBe(false)
  })

  test('the hero wall renders real catalog twins and states the catalog size', async ({ page }) => {
    await page.goto(baseURL)

    const wall = page.locator('.component-wall')
    await expect(wall).toBeAttached()

    /* Three bands, each duplicated once so the marquee can loop seamlessly. */
    await expect(page.locator('.component-wall .wall-band')).toHaveCount(3)

    /* The wall is decorative; the count beside it is the accessible statement,
       and it is derived from the registry so it can never drift. */
    await expect(
      page.getByText(`${componentEntries.length} blocks`, { exact: false }).first(),
    ).toBeVisible()

    /* Decorative duplicates must not reach the accessibility tree. */
    await expect(wall).toHaveAttribute('aria-hidden', 'true')
  })

  /* The wall's fit is curated from measured heights, and a curated fit is exactly
     the kind that rots silently. It was first measured only at 1440px, where it
     was correct, while 14 of 18 cards were being guillotined mid-sentence on a
     phone. Any change to a twin's demo content can push a block past its frame
     again, and none of that is visible in a desktop review — so the fit is
     asserted, at the widths that broke. */
  for (const wallViewport of [
    { height: 844, label: 'phone', width: 390 },
    { height: 1024, label: 'tablet', width: 768 },
    { height: 900, label: 'desktop', width: 1440 },
  ]) {
    test(`keeps every wall card inside its frame on ${wallViewport.label}`, async ({ page }) => {
      await page.setViewportSize({ height: wallViewport.height, width: wallViewport.width })
      await page.goto(baseURL)
      await expect(page.locator('.component-wall')).toBeAttached()

      const measured = await page.evaluate(() => {
        /* The wall is tilted and scaled as a whole, and a rotated box reports an
           axis-aligned bounding box larger than itself — by an amount that grows
           with width, so frame and content would inflate by different amounts and
           every reading would be wrong. Neutralised for measurement only. */
        const tilt = document.querySelector('.component-wall > div')
        if (tilt instanceof HTMLElement) {
          tilt.style.rotate = '0deg'
          tilt.style.scale = '1'
        }

        return [...document.querySelectorAll('.wall-card-frame')].map((frame) => {
          const content = frame.firstElementChild
          const label = frame.parentElement?.querySelector('p')?.textContent?.trim() ?? '?'

          /* Both rects are read in the same coordinate space, so the CSS zoom on
             the content child is already reflected in its height. */
          return {
            label,
            overrun: Math.round(
              (content?.getBoundingClientRect().height ?? 0) - frame.getBoundingClientRect().height,
            ),
          }
        })
      })

      expect(measured.length).toBeGreaterThan(0)

      /* Three twins (content-quote, content-feature-media, content-feature-split)
         render their own stacked variant below 1024px however wide the wall lays
         them out — viewport media queries, not container queries — so a residual
         overrun is expected, and the frame's bottom fade dissolves it rather than
         cutting it. Measured worst case: 32px on a phone against a 28px fade,
         44px on a tablet against a 44px one, and nothing at all on desktop.

         The 50px ceiling sits just above that 44px worst case. It was 60px, but
         44-60 was a band where a card could quietly lose a line and still pass,
         and twin content does drift — TestimonialsBentoDemo changed height in the
         very promote that shipped this. 50px still absorbs an ordinary copy edit
         while catching the class of regression this exists for: a block losing a
         paragraph, 88px in the tablet band and 165px on a phone before the
         per-breakpoint zoom. If a legitimate content change trips it, re-measure
         and move the frame, not the ceiling. */
      const worst = measured.reduce((a, b) => (b.overrun > a.overrun ? b : a))
      expect(
        worst.overrun,
        `"${worst.label}" overruns its frame by ${worst.overrun}px`,
      ).toBeLessThanOrEqual(50)
    })
  }

  test('keeps the wall frame fade that dissolves an overrun', async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 390 })
    await page.goto(baseURL)

    const readFadeHeight = () =>
      page
        .locator('.wall-card-frame')
        .first()
        .evaluate((frame) => getComputedStyle(frame, '::after').height)

    /* The other half of the overflow fix, and the half that already went missing
       once: the fade was dropped while the cards were briefly natural-height and
       not restored when they went back to fixed heights, turning every overrun
       back into a hard cut. Without it, the ceiling above is all that stands
       between a content tweak and a guillotined block. */
    expect(Number.parseFloat(await readFadeHeight())).toBeGreaterThan(8)

    /* The tablet band gets its own taller fade, and it needs its own assertion:
       the phone check above runs outside the 640–1023px query, so deleting the
       override would still pass it — and pass the overrun ceiling too, since the
       measured 44px tablet residue sits under that deliberately loose 50px. Left
       unpinned, the one band where residue meets the fade exactly is the one band
       with no coverage. Exact, not a floor: 2.75rem at the default root size, and
       the whole point is that it matches the overrun rather than merely exceeding
       the phone value. */
    await page.setViewportSize({ height: 1024, width: 768 })
    expect(await readFadeHeight()).toBe('44px')
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
        const hasHorizontalOverflow =
          document.documentElement.scrollWidth > document.documentElement.clientWidth + 1

        return {
          brandMark: brandMarkRect ? { width: brandMarkRect.width, x: brandMarkRect.x } : null,
          documentationTitle:
            documentationTitleRect && documentationTitleRect.width > 0
              ? { width: documentationTitleRect.width, x: documentationTitleRect.x }
              : null,
          hasHorizontalOverflow,
          headerPaddingStart,
          headerStart: headerInnerRect?.x ?? null,
        }
      })

      expect(geometry.brandMark, viewport.name).not.toBeNull()
      expect(geometry.brandMark!.width, viewport.name).toBe(24)
      expect(geometry.hasHorizontalOverflow, viewport.name).toBe(false)

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
      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      )
      expect(hasHorizontalOverflow).toBe(false)
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
    const githubLink = navigation.getByRole('link', { name: 'GitHub' })
    await expect(githubLink).toHaveAttribute('target', '_blank')
    await expect(githubLink).toHaveAttribute('rel', 'noreferrer')
    await expect(page.getByRole('button', { name: 'Close navigation' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(navigation).toBeAttached()
    await expect(navigation).toBeHidden()
    await expect(trigger).toBeFocused()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
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
    const wraps = await path.evaluate((el) => {
      const style = getComputedStyle(el)
      const line = Number.parseFloat(style.lineHeight)
      return {
        breakable: style.overflowWrap === 'anywhere' || style.wordBreak === 'break-all',
        multiline: el.getBoundingClientRect().height > line * 1.5,
        fits: el.scrollWidth <= el.clientWidth,
      }
    })
    expect(wraps.breakable).toBe(true)
    expect(wraps.multiline).toBe(true)
    expect(wraps.fits).toBe(true)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(overflow).toBe(false)
    await expect(wiring).toBeVisible()
  })

  test('serves the standalone preview route without site chrome or overflow', async ({ page }) => {
    await page.goto(`${baseURL}/components/preview/hero-basic`)

    await expect(page.locator('main')).toBeVisible()
    // The bare iframe target inherits only the root layout — no header/footer.
    await expect(page.getByRole('contentinfo')).toHaveCount(0)

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(hasHorizontalOverflow).toBe(false)
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
        link: /Browse all 73 installable components/,
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

  test('links upcoming components to prefilled request issues', async ({ page }) => {
    const component = upcomingComponents.find((entry) => entry.slug === 'post-card')!

    await page.goto(`${baseURL}/components?type=posts`)

    const requestLink = page.getByRole('link', { name: 'Request' }).first()
    await expect(requestLink).toBeVisible()
    await expect(requestLink).toHaveAttribute(
      'href',
      new RegExp(
        `/issues/new\\?${[
          'area=New\\+component',
          'proposal=Ship\\+Post\\+Card\\+%28post-card%29\\+as\\+a\\+Payload\\+Components\\+post\\+component\\.',
          'template=feature_request\\.yml',
          'title=%5Bfeature%5D\\+post-card',
        ].join('.*')}`,
      ),
    )
    await expect(page.getByText(component.title).first()).toBeVisible()
  })

  test('exposes every landing section, the catalog teaser, and the footer', async ({ page }) => {
    await page.goto(baseURL)

    for (const section of Object.values(landingSections)) {
      await expect(page.getByRole('heading', { level: 2, name: section.heading })).toBeVisible()
    }

    // The catalog section teases page families with live previews instead of
    // listing every component as a text row; the full index lives at /components.
    await expect(page.getByRole('heading', { name: 'Page blocks' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Browse all \d+ components/ })).toBeVisible()
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
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        ),
      ).toBe(false)
    }
  })

  test('copies a catalog family-card command', async ({ page, context }) => {
    // feature-bento is the Features family's representative card in the landing
    // teaser; its command differs from the hero's primaryInstallCommand.
    const catalogComponent = componentEntries.find((entry) => entry.slug === 'feature-bento')!

    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(baseURL)
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

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      ),
    ).toBe(false)

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

  test('terminal replay renders its final transcript without animation', async ({ page }) => {
    await page.goto(baseURL)

    const lastLine = terminalDemoLines[terminalDemoLines.length - 1]
    await expect(page.getByText(lastLine.text).first()).toBeVisible()

    /* The replay moved out of the hero and into the workflow section, where
       "run the command" is the actual subject. (Its Replay control stays
       motion-reduce:hidden — a replay does nothing visible here, so the
       control hides rather than lying.) */
    const workflow = page.locator(`#${landingSections.workflow.id}`)
    await expect(workflow.locator('.product-frame')).toBeVisible()
    await expect(
      workflow.getByRole('button', { name: 'Replay the install animation' }),
    ).toBeHidden()

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(hasHorizontalOverflow).toBe(false)
  })

  test('opens the Fumadocs search dialog from the docs shell', async ({ page }) => {
    await page.goto(`${baseURL}/docs`)

    await page
      .getByRole('button', { name: /Search/ })
      .first()
      .click()

    await expect(page.getByRole('dialog')).toBeVisible()
  })
})
