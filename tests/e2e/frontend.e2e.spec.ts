import { expect, type Page, test } from '@playwright/test'

import {
  catalogTitle,
  githubRepoUrl,
  heroHeadline,
  heroPrimaryCta,
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
  return page.evaluate(() => (window as Window & { __posthogEvents?: PostHogTestEvent[] }).__posthogEvents ?? [])
}

async function expectCopiedAlert(page: Page) {
  await expect(page.getByRole('alert').filter({ hasText: copiedAlertText })).toBeVisible({
    timeout: 15000,
  })
}

async function waitForCopyController(page: Page) {
  await expect(page.locator('html')).toHaveAttribute('data-copy-controller-ready', 'true')
}

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
    await expect.poll(() => getPostHogEvents(page)).toEqual(
      expect.arrayContaining([
        {
          event: '$pageview',
          properties: {
            page_path: '/',
            source_path: '/',
          },
        },
      ]),
    )
  })

  test('keeps the landing hero action hierarchy focused', async ({ page }) => {
    await page.goto(baseURL)

    const hero = page.locator('.hero-shell')
    await expect(
      hero.getByRole('link', { name: heroPrimaryCta.label, exact: true }),
    ).toBeVisible()
    await expect(hero.locator(`a[href="${githubRepoUrl}"]`)).toHaveAccessibleName(
      'Star on GitHub',
    )
    await expect(
      hero.getByRole('link', { name: heroTertiaryLinks[0].label, exact: true }),
    ).toBeVisible()
    await expect(hero.getByText('Open source', { exact: true })).toHaveCount(0)
    await expect(
      hero.getByRole('link', { name: 'See what add actually wires', exact: true }),
    ).toHaveCount(0)
  })

  test('keeps the desktop hero composition compact', async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 })
    await page.goto(baseURL)

    const headline = page.getByRole('heading', { level: 1, name: heroHeadline })
    const heroStack = page.locator('.hero-shell > .container')
    const proof = page.locator('.product-frame')

    await expect(headline).toBeVisible()
    await expect(proof).toBeVisible()

    const headlineSize = await headline.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    )
    const stackMetrics = await heroStack.evaluate((element) => {
      const styles = getComputedStyle(element)
      return {
        gap: Number.parseFloat(styles.rowGap),
        paddingTop: Number.parseFloat(styles.paddingTop),
      }
    })
    const proofWidth = await proof.evaluate((element) => element.getBoundingClientRect().width)

    expect(headlineSize).toBeLessThanOrEqual(88.1)
    expect(stackMetrics).toEqual({ gap: 48, paddingTop: 64 })
    expect(proofWidth).toBeLessThanOrEqual(1024.1)
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
        const headerPaddingStart = headerStyle ? Number.parseFloat(headerStyle.paddingInlineStart) : null
        const hasHorizontalOverflow =
          document.documentElement.scrollWidth > document.documentElement.clientWidth + 1

        return {
          brandMark: brandMarkRect
            ? { width: brandMarkRect.width, x: brandMarkRect.x }
            : null,
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

  test('exposes docs, catalog, component pages, and no horizontal overflow', async ({ page }) => {
    // Each /docs/components/<slug> page embeds a live-preview iframe that compiles a
    // second route (/components/preview/<slug>). Walking every route while also
    // compiling every preview overwhelms the dev server mid-walk (ERR_CONNECTION_RESET).
    // This smoke check only asserts each page's title/h1/overflow, so block the preview
    // subframe: full route coverage stays and the on-demand compile load roughly halves.
    await page.route('**/components/preview/**', (route) => route.abort())

    const routes = [
      {
        h1: heroHeadline,
        path: '/',
        title: homeMetadataTitle,
      },
      {
        h1: 'Introduction',
        path: '/docs',
        title: /Introduction/,
      },
      {
        h1: 'Architecture',
        path: '/docs/architecture',
        title: /Architecture/,
      },
      {
        h1: catalogTitle,
        path: '/components',
        title: /Payload CMS Block Catalog/,
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
      ...componentEntries.map((component) => ({
        h1: component.title,
        path: component.href,
        title: new RegExp(component.title),
      })),
    ]

    for (const route of routes) {
      await page.goto(`${baseURL}${route.path}`, { waitUntil: 'domcontentloaded' })
      await expect(page).toHaveTitle(route.title)
      await expect(page.getByRole('heading', { level: 1, name: route.h1 })).toBeVisible()

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      )
      expect(hasHorizontalOverflow).toBe(false)
    }
  })

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
    await expect.poll(async () => (await frame.boundingBox())?.height ?? 0).toBeLessThan(mobileHeight - 2)
    await page.getByRole('button', { name: 'Mobile' }).click()
    await expect.poll(async () => (await frame.boundingBox())?.height ?? 0).toBeGreaterThan(mobileHeight - 2)

    await page.goto(`${baseURL}/components/preview/hero-basic`)
    await expect(page.locator('script[src*="googletagmanager"], script[src*="vercel"], script[src*="posthog"]')).toHaveCount(0)
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
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
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
      await expect(page.getByRole('navigation').getByRole('link', { name: route.label })).toHaveClass(
        /bg-secondary/,
      )
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

  test('filters catalog immediately, debounces shareable URL state, and syncs popstate', async ({ page }) => {
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
    await page.getByRole('button', { name: /Page blocks/ }).first().click()
    await expect(search).toHaveValue('hero')
    await expect.poll(() => new URL(page.url()).searchParams.get('q')).toBe('hero')
    await expect.poll(() => new URL(page.url()).searchParams.get('type')).toBe('pages')
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
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Brand Guide' })).toBeVisible()
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

    await page.getByRole('button', { name: 'Copy' }).first().click()

    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible()
    await expectCopiedAlert(page)
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(primaryInstallCommand)
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

  test('copies a catalog family-card command', async ({ page, context }) => {
    // feature-bento is the Features family's representative card in the landing
    // teaser; its command differs from the hero's primaryInstallCommand.
    const catalogComponent = componentEntries.find((entry) => entry.slug === 'feature-bento')!

    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(baseURL)
    await waitForCopyController(page)
    await page.locator(`#${catalogComponent.slug}`).getByRole('button', { name: 'Copy' }).click()

    await expect(page.locator(`#${catalogComponent.slug}`).getByRole('button', { name: 'Copied' })).toBeVisible()
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

    await page
      .locator('a[href="https://github.com/Ducksss/payload-components"]')
      .first()
      .click()

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

  test('shows an alert after copying page markdown', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`${baseURL}/docs/installation`)
    await waitForCopyController(page)

    await page.getByRole('button', { name: /Copy Markdown/ }).click()

    await expectCopiedAlert(page)
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

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(hasHorizontalOverflow).toBe(false)
  })

  test('opens the Fumadocs search dialog from the docs shell', async ({ page }) => {
    await page.goto(`${baseURL}/docs`)

    await page.getByRole('button', { name: /Search/ }).first().click()

    await expect(page.getByRole('dialog')).toBeVisible()
  })
})
