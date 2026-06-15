import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/site'

/* Generative-engine crawlers, named explicitly. An `allow: '/'` default
   already permits them, but listing them documents intent (Payload Kits
   *wants* to be cited in AI answers) and survives any future tightening of
   the wildcard rule. Update as new assistants publish their user agents. */
const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'Meta-ExternalAgent',
  'cohere-ai',
  'DuckAssistBot',
  'YouBot',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteUrl,
    rules: [
      { allow: '/', disallow: '/api/', userAgent: '*' },
      { allow: '/', disallow: '/api/', userAgent: aiCrawlers },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
