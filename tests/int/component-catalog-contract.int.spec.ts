import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()

const readRepoFile = (filePath: string) => readFile(path.join(repoRoot, filePath), 'utf8')
const pageCountWords = new Map([[38, 'Thirty-eight']])
const requiredFreshSmokeComponents = ['team-roster', 'team-grid']

const pageComponentSlugs = async () => {
  const siteSource = await readRepoFile('src/lib/site.ts')
  return [...siteSource.matchAll(/{[\s\S]*?family: 'pages'[\s\S]*?slug: '([^']+)'[\s\S]*?},/g)].map(
    (match) => match[1],
  )
}

describe('component catalog contract', () => {
  it('keeps public page-block counts in sync with component entries', async () => {
    const [siteSource, aboutSource, slugs] = await Promise.all([
      readRepoFile('src/lib/site.ts'),
      readRepoFile('src/app/about/page.tsx'),
      pageComponentSlugs(),
    ])
    const expectedWords = pageCountWords.get(slugs.length) ?? String(slugs.length)

    expect(siteSource).toContain(`countLabel: '${slugs.length} installable'`)
    expect(siteSource).toContain(`${expectedWords} page blocks`)
    expect(aboutSource).toContain(`${expectedWords} page blocks`)
  })

  it('lists every installable page component in CLI help, 404 copy, and fresh smoke defaults', async () => {
    const [cliSource, notFoundSource, smokeSource, slugs] = await Promise.all([
      readRepoFile('tools/payload-components/cli.ts'),
      readRepoFile('src/app/not-found.tsx'),
      readRepoFile('tools/payload-components/smoke/fresh-payload-repo.ts'),
      pageComponentSlugs(),
    ])

    for (const slug of slugs) {
      expect(cliSource, `CLI help missing ${slug}`).toContain(slug)
      expect(notFoundSource, `404 copy missing ${slug}`).toContain(slug)
    }

    for (const slug of requiredFreshSmokeComponents) {
      expect(smokeSource, `fresh smoke missing ${slug}`).toContain(slug)
    }
  })
})
