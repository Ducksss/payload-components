import { githubRepoUrl, kitEntries, siteDescription, siteUrl } from '@/lib/site'

export function GET() {
  const body = [
    '# Payload Kits',
    '',
    siteDescription,
    '',
    '## Primary links',
    `- [Home](${siteUrl}/)`,
    `- [Docs](${siteUrl}/docs)`,
    `- [Kit catalog](${siteUrl}/components)`,
    `- [Public registry](${siteUrl}/r/registry.json)`,
    `- [GitHub repository](${githubRepoUrl})`,
    '',
    '## Installable kits',
    ...kitEntries.map((kit) => `- ${kit.title}: ${kit.command}`),
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  })
}
