import { getBlogPages } from '@/lib/blog-source'
import { blogDescription, blogRoute, blogTitle, feedRoute, siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

export function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function GET() {
  const posts = getBlogPages()
  const lastBuildDate = posts[0] ? new Date(posts[0].data.date).toUTCString() : undefined
  const items = posts.map((post) => {
    const canonicalUrl = `${siteUrl}${post.url}`

    return [
      '    <item>',
      `      <title>${escapeXml(post.data.title)}</title>`,
      `      <link>${canonicalUrl}</link>`,
      `      <guid isPermaLink="true">${canonicalUrl}</guid>`,
      `      <pubDate>${new Date(post.data.date).toUTCString()}</pubDate>`,
      `      <dc:creator>${escapeXml(post.data.author)}</dc:creator>`,
      ...(post.data.description
        ? [`      <description>${escapeXml(post.data.description)}</description>`]
        : []),
      '    </item>',
    ].join('\n')
  })
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    `    <title>${escapeXml(blogTitle)} | Payload Components</title>`,
    `    <link>${siteUrl}${blogRoute}</link>`,
    `    <description>${escapeXml(blogDescription)}</description>`,
    `    <atom:link href="${siteUrl}${feedRoute}" rel="self" type="application/rss+xml" />`,
    '    <language>en</language>',
    ...(lastBuildDate ? [`    <lastBuildDate>${lastBuildDate}</lastBuildDate>`] : []),
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
    },
  })
}
