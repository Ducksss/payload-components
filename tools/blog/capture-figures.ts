import { mkdir } from 'node:fs/promises'
import path from 'node:path'

import { chromium } from '@playwright/test'

type Panel = { label: string; path: string; viewport?: 'mobile' }
type Capture = { file: string; panels: Panel[]; title: string }

const baseURL = process.env.BLOG_CAPTURE_BASE_URL ?? 'http://127.0.0.1:3100'
const outputRoot = path.resolve(import.meta.dirname, '../../output/blog-captures')

const captures: Capture[] = [
  {
    file: 'build-first-payload-v3-landing-page--figure-01-page-composition.png',
    title: 'A landing page assembled from real catalog components',
    panels: [
      { label: 'Hero Basic', path: '/components/preview/hero-basic' },
      { label: 'Feature Bento', path: '/components/preview/feature-bento' },
      { label: 'Testimonials Grid', path: '/components/preview/testimonials-grid' },
      { label: 'Call To Action Centered', path: '/components/preview/call-to-action-centered' },
    ],
  },
  {
    file: 'choosing-payload-hero--figure-01-hero-preview.png',
    title: 'Hero Basic at real responsive preview widths',
    panels: [
      { label: 'Desktop structure', path: '/components/preview/hero-basic' },
      { label: 'Mobile structure', path: '/components/preview/hero-basic', viewport: 'mobile' },
      { label: 'Catalog context', path: '/components?q=hero-basic' },
      { label: 'Documentation context', path: '/docs/components/hero-basic' },
    ],
  },
  {
    file: 'editor-friendly-feature-sections--figure-01-feature-comparison.png',
    title: 'Feature structures in the current registry',
    panels: [
      { label: 'Feature Bento', path: '/components/preview/feature-bento' },
      { label: 'Feature Split', path: '/components/preview/feature-split' },
      { label: 'Feature Steps', path: '/components/preview/feature-steps' },
      { label: 'Feature Grid Basic', path: '/components/preview/feature-grid-basic' },
    ],
  },
  {
    file: 'modeling-pricing-pages--figure-01-pricing-montage.png',
    title: 'Pricing structures in the current registry',
    panels: [
      { label: 'Pricing Cards', path: '/components/preview/pricing-cards' },
      { label: 'Pricing Cards Muted', path: '/components/preview/pricing-cards-muted' },
      { label: 'Pricing Split', path: '/components/preview/pricing-split' },
      { label: 'Pricing Enterprise', path: '/components/preview/pricing-enterprise' },
    ],
  },
  {
    file: 'social-proof-sections--figure-01-social-proof-montage.png',
    title: 'Proof structures in the current registry',
    panels: [
      { label: 'Logo Cloud Grid', path: '/components/preview/logo-cloud-grid' },
      { label: 'Testimonials Grid', path: '/components/preview/testimonials-grid' },
      { label: 'Testimonials Rating', path: '/components/preview/testimonials-rating' },
      { label: 'Testimonials Quote', path: '/components/preview/testimonials-quote' },
    ],
  },
  {
    file: 'build-saas-homepage--figure-02-component-montage.png',
    title: 'A real component inventory for a SaaS homepage',
    panels: [
      { label: 'Promise · Hero Basic', path: '/components/preview/hero-basic' },
      { label: 'Proof · Logo Cloud Grid', path: '/components/preview/logo-cloud-grid' },
      { label: 'Explain · Feature Bento', path: '/components/preview/feature-bento' },
      { label: 'Commitment · Pricing Cards', path: '/components/preview/pricing-cards' },
    ],
  },
  {
    file: 'build-payload-blog-frontend--figure-02-post-component-montage.png',
    title: 'The real editorial index and article surfaces',
    panels: [
      { label: 'Blog index projection', path: '/blog' },
      { label: 'Article projection', path: '/blog/what-is-a-payload-cms-block' },
    ],
  },
  {
    file: 'demo-twins--figure-02-source-preview.png',
    title: 'One twin across its preview and documentation surfaces',
    panels: [
      { label: 'Chrome-free demo twin', path: '/components/preview/hero-basic' },
      { label: 'Component documentation', path: '/docs/components/hero-basic' },
    ],
  },
]

const escapeHtml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')

function panelMarkup(panel: Panel) {
  const source = `${baseURL}${panel.path}`
  const mobileClass = panel.viewport === 'mobile' ? ' mobile' : ''
  return `<section class="panel${mobileClass}">
    <div class="label">${escapeHtml(panel.label)}</div>
    <div class="frame-shell">
      <iframe title="${escapeHtml(panel.label)}" src="${source}" onload="window.__framesLoaded += 1"></iframe>
    </div>
  </section>`
}

await mkdir(outputRoot, { recursive: true })
const browser = await chromium.launch({ headless: true })

try {
  for (const capture of captures) {
    const page = await browser.newPage({ deviceScaleFactor: 1, viewport: { height: 900, width: 1600 } })
    const twoPanel = capture.panels.length === 2
    await page.setContent(`<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            * { box-sizing: border-box; }
            html, body { background-color: #f4f4f5 !important; color: #18181b !important; height: 100%; margin: 0; }
            body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; overflow: hidden; }
            header { align-items: baseline; background: #f4f4f5; color: #18181b; display: flex; height: 92px; justify-content: space-between; padding: 30px 42px 20px; }
            h1 { color: #18181b; font-size: 28px; letter-spacing: -0.03em; margin: 0; }
            .brand { color: #059669; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 14px; font-weight: 700; letter-spacing: 0.12em; }
            main { background: #f4f4f5; display: grid; gap: 18px; grid-template-columns: repeat(2, minmax(0, 1fr)); height: 808px; padding: 0 28px 28px; }
            main.two { grid-template-rows: 1fr; }
            .panel { background: #fff; border: 1px solid #d4d4d8; border-radius: 18px; box-shadow: 0 12px 32px rgb(24 24 27 / 8%); min-height: 0; overflow: hidden; position: relative; }
            .label { background: rgb(255 255 255 / 94%); border-bottom: 1px solid #e4e4e7; font-size: 14px; font-weight: 650; height: 40px; padding: 11px 16px; position: relative; z-index: 2; }
            .frame-shell { height: calc(100% - 40px); overflow: hidden; position: relative; }
            iframe { background: #fff; border: 0; height: 100%; width: 100%; }
            .mobile .frame-shell { align-items: flex-start; background: #e4e4e7; display: flex; justify-content: center; }
            .mobile iframe { height: 640px; transform: scale(1.1); transform-origin: top center; width: 500px; }
          </style>
        </head>
        <body>
          <script>window.__framesLoaded = 0</script>
          <header><h1>${escapeHtml(capture.title)}</h1><div class="brand">PAYLOAD COMPONENTS · REAL PREVIEWS</div></header>
          <main class="${twoPanel ? 'two' : ''}">${capture.panels.map(panelMarkup).join('')}</main>
        </body>
      </html>`)
    await page.waitForFunction((expected) => window.__framesLoaded === expected, capture.panels.length, { timeout: 30_000 })
    await page.waitForTimeout(750)
    await page.screenshot({ path: path.join(outputRoot, capture.file), type: 'png' })
    await page.close()
    console.log(`Captured ${capture.file}`)
  }
} finally {
  await browser.close()
}

declare global {
  interface Window { __framesLoaded: number }
}
