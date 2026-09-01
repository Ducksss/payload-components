import { statSync } from 'node:fs'
import path from 'node:path'

import { sortBlogPages } from '@/lib/blog'
import { siteDescription, siteUrl } from '@/lib/site'

function xml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function GET() {
  const posts = sortBlogPages()
  const items = posts.map((post) => {
    const url = `${siteUrl}${post.url}`
    const coverUrl = `${siteUrl}${post.data.cover.src}`
    const coverPath = path.join(process.cwd(), 'public', post.data.cover.src.replace(/^\//, ''))

    return [
      '    <item>',
      `      <title>${xml(post.data.title)}</title>`,
      `      <link>${xml(url)}</link>`,
      `      <guid isPermaLink="true">${xml(url)}</guid>`,
      `      <pubDate>${new Date(post.data.date).toUTCString()}</pubDate>`,
      `      <description>${xml(post.data.description ?? '')}</description>`,
      `      <enclosure url="${xml(coverUrl)}" length="${statSync(coverPath).size}" type="image/webp" />`,
      '    </item>',
    ].join('\n')
  })

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>Payload Components Blog</title>',
    `    <link>${siteUrl}/blog</link>`,
    `    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />`,
    `    <description>${xml(siteDescription)}</description>`,
    '    <language>en-us</language>',
    ...(posts.length
      ? [`    <lastBuildDate>${new Date(posts[0].data.date).toUTCString()}</lastBuildDate>`]
      : []),
    ...items,
    '  </channel>',
    '</rss>',
  ].join('\n')

  return new Response(body, {
    headers: {
      'cache-control': 'public, max-age=3600, s-maxage=3600',
      'content-type': 'application/rss+xml; charset=utf-8',
    },
  })
}
