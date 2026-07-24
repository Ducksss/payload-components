import { getLLMText, source } from '@/lib/source'
import { getBlogLLMText, getBlogPages } from '@/lib/blog-source'
import {
  blogRoute,
  faqEntries,
  feedRoute,
  githubRepoUrl,
  componentEntries,
  siteDescription,
  siteUrl,
} from '@/lib/site'

export async function GET() {
  const [docs, blog] = await Promise.all([
    Promise.all(source.getPages().map(getLLMText)),
    Promise.all(getBlogPages().map(getBlogLLMText)),
  ])
  const body = [
    '# Payload Components',
    '',
    siteDescription,
    '',
    `Home: ${siteUrl}/`,
    `Docs: ${siteUrl}/docs`,
    `Catalog: ${siteUrl}/components`,
    `Blog: ${siteUrl}${blogRoute}`,
    `Updates feed: ${siteUrl}${feedRoute}`,
    `Registry: ${siteUrl}/r/registry.json`,
    `GitHub: ${githubRepoUrl}`,
    '',
    '## Components',
    ...componentEntries.map((component) => `- ${component.title} (${component.slug}): ${component.command}`),
    '',
    '## FAQ',
    ...faqEntries.flatMap((entry) => [`### ${entry.question}`, entry.answer, '']),
    '## Blog',
    ...blog,
    '',
    '## Documentation',
    ...docs,
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  })
}
