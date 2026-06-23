import { getLLMText, source } from '@/lib/source'
import { faqEntries, githubRepoUrl, componentEntries, siteDescription, siteUrl } from '@/lib/site'

export async function GET() {
  const docs = await Promise.all(source.getPages().map(getLLMText))
  const body = [
    '# Payload Components',
    '',
    siteDescription,
    '',
    `Home: ${siteUrl}/`,
    `Docs: ${siteUrl}/docs`,
    `Catalog: ${siteUrl}/components`,
    `Forms: ${siteUrl}/forms`,
    `Registry: ${siteUrl}/r/registry.json`,
    `GitHub: ${githubRepoUrl}`,
    '',
    '## Components',
    ...componentEntries.map((component) => `- ${component.title} (${component.slug}): ${component.command}`),
    '',
    '## FAQ',
    ...faqEntries.flatMap((entry) => [`### ${entry.question}`, entry.answer, '']),
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
