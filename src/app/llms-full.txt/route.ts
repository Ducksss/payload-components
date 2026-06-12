import { getLLMText, source } from '@/lib/source'
import { githubRepoUrl, kitEntries, siteDescription, siteUrl } from '@/lib/site'

export async function GET() {
  const docs = await Promise.all(source.getPages().map(getLLMText))
  const body = [
    '# Payload Kits',
    '',
    siteDescription,
    '',
    `Home: ${siteUrl}/`,
    `Docs: ${siteUrl}/docs`,
    `Catalog: ${siteUrl}/components`,
    `Registry: ${siteUrl}/r/registry.json`,
    `GitHub: ${githubRepoUrl}`,
    '',
    '## Kits',
    ...kitEntries.map((kit) => `- ${kit.title} (${kit.slug}): ${kit.command}`),
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
