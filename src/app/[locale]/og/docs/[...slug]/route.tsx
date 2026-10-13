import type { Node } from 'fumadocs-core/page-tree'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'

import { normalizeSiteLocale, type SiteLocale } from '@/i18n/config'
import { getComponentDatasheet } from '@/lib/component-datasheet'
import { familyOfSlug } from '@/lib/component-page-tree'
import { ComponentDocsCard, DocsCard } from '@/lib/og/cards'
import { ogFonts, ogSize } from '@/lib/og/datasheet-card'
import { componentEntries } from '@/lib/site'
import { getPageImage, source } from '@/lib/source'

type DocsImageRouteProps = {
  params: Promise<{
    locale: string
    slug: string[]
  }>
}

export const revalidate = false

const containsUrl = (node: Node, url: string): boolean =>
  node.type === 'page'
    ? node.url === url
    : node.type === 'folder' &&
      (node.index?.url === url || node.children.some((child) => containsUrl(child, url)))

/* The sidebar section a page sits under ("Get Started", "Reference", …): the
   nearest separator above its top-level entry in the page tree. */
function sectionOf(url: string, locale: SiteLocale) {
  let section: string | undefined
  for (const node of source.getPageTree(locale).children) {
    if (node.type === 'separator') section = typeof node.name === 'string' ? node.name : undefined
    else if (containsUrl(node, url)) return section
  }
  return undefined
}

/* Docs cards are pages of the same datasheet as the root, blog and template
   cards (src/lib/og/cards.tsx). A component page draws that component's own
   pinout; every other page is a sheet in its sidebar section. */
export async function GET(_request: Request, { params }: DocsImageRouteProps) {
  const { locale: localeParam, slug } = await params
  const locale = normalizeSiteLocale(localeParam)
  const page = source.getPage(slug.slice(0, -1), locale)

  if (!page) {
    notFound()
  }

  const component =
    page.slugs.length === 2 && page.slugs[0] === 'components'
      ? componentEntries.find((entry) => entry.slug === page.slugs[1])
      : undefined
  const datasheet = component ? await getComponentDatasheet(component.slug) : null
  const { description, title } = page.data

  return new ImageResponse(
    component && datasheet ? (
      <ComponentDocsCard
        command={component.command}
        datasheet={datasheet}
        description={description}
        eyebrow={`${component.family === 'pages' ? 'Page block' : 'Post component'} · ${familyOfSlug(component.slug).label} family`}
        title={title}
        url={page.url}
      />
    ) : (
      <DocsCard
        description={description}
        section={sectionOf(page.url, locale)}
        title={title}
        url={page.url}
      />
    ),
    { ...ogSize, fonts: ogFonts },
  )
}

export function generateStaticParams() {
  return source.getPages('en').map((page) => ({
    slug: getPageImage(page).segments,
  }))
}
