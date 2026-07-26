import type { TemplatePage, TemplateShowcase } from './types'

import { agencyStudioTemplate } from './agency-studio'
import { commerceBrandTemplate } from './commerce-brand'
import { eventConferenceTemplate } from './event-conference'
import { fintechTrustTemplate } from './fintech-trust'
import { portfolioSoloTemplate } from './portfolio-solo'
import { saasLaunchTemplate } from './saas-launch'

/* Canonical, curated order for /templates. Definitions stay pure data; React
 * lookups (demo twins, shells) live in src/components/site/templates/. */
export const templateShowcases: readonly TemplateShowcase[] = [
  saasLaunchTemplate,
  agencyStudioTemplate,
  commerceBrandTemplate,
  eventConferenceTemplate,
  fintechTrustTemplate,
  portfolioSoloTemplate,
]

export const templatesBySlug: Record<string, TemplateShowcase> = Object.fromEntries(
  templateShowcases.map((template) => [template.slug, template]),
)

export function getTemplateShowcase(slug: string): TemplateShowcase | undefined {
  return templatesBySlug[slug]
}

export function getTemplatePage(
  template: TemplateShowcase,
  path: string,
): TemplatePage | undefined {
  return template.pages.find((page) => page.path === path)
}

/* Route helpers — the single place URL shapes are derived from data. */
export function templateDetailHref(slug: string) {
  return `/templates/${slug}`
}

export function templatePreviewHref(slug: string, path = '') {
  return path === '' ? `/templates/${slug}/preview` : `/templates/${slug}/preview/${path}`
}

/* Deterministic poster locations written by tools/templates/capture.ts.
 * JPEG like public/showcase/ — photographic page screenshots compress to a
 * few hundred KB as JPEG and the repo has no webp encoder. */
export function templatePosterSrc(slug: string) {
  return `/templates/${slug}/posters/home-desktop.jpg`
}

export function templatePagePosterSrc(slug: string, path: string) {
  return `/templates/${slug}/posters/page-${path === '' ? 'home' : path}.jpg`
}

export function uniqueTemplateBlockSlugs(template: TemplateShowcase) {
  return [
    ...new Set(template.pages.flatMap((page) => page.sections.map((s) => s.componentSlug))),
  ]
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const PAGE_PATH_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/* Structural invariant checks shared by tests/int/template-showcases.int.spec.ts
 * and any future authoring tooling. `knownComponentSlugs` is injected so this
 * module never has to import the React demo-twin registry. Returns a list of
 * human-readable violations; empty means valid. */
export function validateTemplateShowcase(
  template: TemplateShowcase,
  knownComponentSlugs: ReadonlySet<string>,
): string[] {
  const errors: string[] = []
  const label = `template "${template.slug}"`

  if (!SLUG_PATTERN.test(template.slug)) errors.push(`${label}: slug is not URL-safe`)
  if (template.schemaVersion !== 1) errors.push(`${label}: schemaVersion must be 1`)
  if (template.status !== 'concept') errors.push(`${label}: status must be 'concept'`)
  if (!Number.isInteger(template.revision) || template.revision < 1)
    errors.push(`${label}: revision must be a positive integer`)
  if (!template.title.trim()) errors.push(`${label}: title is empty`)
  if (!template.summary.trim()) errors.push(`${label}: summary is empty`)
  if (!template.description.trim()) errors.push(`${label}: description is empty`)
  if (template.visualTone.length === 0) errors.push(`${label}: visualTone is empty`)
  if (!template.theme.id.trim()) errors.push(`${label}: theme.id is empty`)
  if (template.theme.swatches.length === 0) errors.push(`${label}: theme.swatches is empty`)

  const homePages = template.pages.filter((page) => page.path === '')
  if (homePages.length !== 1)
    errors.push(`${label}: expected exactly one home page (path ''), found ${homePages.length}`)

  const pagePaths = new Set<string>()
  for (const page of template.pages) {
    const pageLabel = `${label} page "${page.path || '(home)'}"`

    if (page.path !== '' && !PAGE_PATH_PATTERN.test(page.path))
      errors.push(`${pageLabel}: path is not a URL-safe segment`)
    if (pagePaths.has(page.path)) errors.push(`${pageLabel}: duplicate page path`)
    pagePaths.add(page.path)

    if (!page.label.trim()) errors.push(`${pageLabel}: label is empty`)
    if (!page.title.trim()) errors.push(`${pageLabel}: title is empty`)
    if (!page.description.trim()) errors.push(`${pageLabel}: description is empty`)
    if (page.sections.length === 0) errors.push(`${pageLabel}: sections is empty`)

    const sectionIds = new Set<string>()
    for (const section of page.sections) {
      if (sectionIds.has(section.id))
        errors.push(`${pageLabel}: duplicate section id "${section.id}"`)
      sectionIds.add(section.id)

      if (!knownComponentSlugs.has(section.componentSlug))
        errors.push(
          `${pageLabel}: section "${section.id}" references unknown component slug "${section.componentSlug}"`,
        )
    }
  }

  for (const item of template.navigation) {
    if (!pagePaths.has(item.path))
      errors.push(`${label}: navigation item "${item.label}" targets undeclared path "${item.path}"`)
  }

  const assetRoot = `/templates/${template.slug}/`
  const assetPaths = new Set<string>()
  for (const asset of template.assets) {
    if (!asset.path.startsWith(assetRoot))
      errors.push(`${label}: asset "${asset.path}" is outside ${assetRoot}`)
    if (assetPaths.has(asset.path)) errors.push(`${label}: duplicate asset path "${asset.path}"`)
    assetPaths.add(asset.path)
    if (!asset.alt.trim()) errors.push(`${label}: asset "${asset.path}" is missing alt text`)
    if (!asset.license.trim()) errors.push(`${label}: asset "${asset.path}" is missing a license`)
    if (!asset.provenance.trim())
      errors.push(`${label}: asset "${asset.path}" is missing provenance`)
    if (asset.width < 1 || asset.height < 1)
      errors.push(`${label}: asset "${asset.path}" has invalid dimensions`)
  }

  return errors
}

export function validateTemplateShowcases(
  templates: readonly TemplateShowcase[],
  knownComponentSlugs: ReadonlySet<string>,
): string[] {
  const errors = templates.flatMap((template) =>
    validateTemplateShowcase(template, knownComponentSlugs),
  )

  const slugs = new Set<string>()
  const themeIds = new Set<string>()
  for (const template of templates) {
    if (slugs.has(template.slug)) errors.push(`duplicate template slug "${template.slug}"`)
    slugs.add(template.slug)
    if (themeIds.has(template.theme.id))
      errors.push(`duplicate template theme id "${template.theme.id}"`)
    themeIds.add(template.theme.id)
  }

  return errors
}
