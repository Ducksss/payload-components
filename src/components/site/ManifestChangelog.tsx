import { rcompare } from 'semver'
import { getTranslations } from 'next-intl/server'

import Link from '@/i18n/Link'
import { getAllComponentManifests } from '@/lib/component-manifest'

type Change = {
  breaking: boolean
  component: string
  dataMigration?: string
  href: string
  summary: string
  version: string
}

export async function ManifestChangelog() {
  const [manifests, t] = await Promise.all([
    getAllComponentManifests(),
    getTranslations('Changelog'),
  ])
  const changes = manifests.flatMap<Change>((manifest) =>
    (manifest.changelog ?? []).map((entry) => ({
      breaking: entry.breaking ?? false,
      component: manifest.title,
      dataMigration: entry.dataMigration,
      href: `/docs/components/${manifest.name}`,
      summary: entry.summary,
      version: entry.version,
    })),
  )
  const versions = [...new Set(changes.map((change) => change.version))].sort(rcompare)

  return (
    <div className="not-prose my-8 flex flex-col gap-10">
      <p className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm leading-6 text-muted-foreground">
        {t('generated', { components: manifests.length, entries: changes.length })}
      </p>

      {versions.map((version, versionIndex) => {
        const releaseChanges = changes
          .filter((change) => change.version === version)
          .sort((left, right) => left.component.localeCompare(right.component))

        return (
          <section
            className="grid gap-4 border-t border-border pt-6 md:grid-cols-[9rem_1fr]"
            key={version}
          >
            <div>
              <h2 className="font-mono text-sm font-semibold text-foreground">v{version}</h2>
              {versionIndex === 0 ? (
                <span className="mt-2 inline-flex rounded-full bg-brand-50 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-eyebrow text-brand-600">
                  {t('latest')}
                </span>
              ) : null}
            </div>

            <ul className="divide-y divide-border rounded-lg border border-border bg-background">
              {releaseChanges.map((change) => (
                <li
                  className="grid gap-2 p-4 sm:grid-cols-[12rem_1fr]"
                  key={`${change.component}-${change.version}`}
                >
                  <Link
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                    href={change.href}
                  >
                    {change.component}
                  </Link>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {change.breaking ? (
                      <strong className="me-2 font-mono text-[10px] uppercase tracking-eyebrow text-destructive">
                        {t('breaking')}
                      </strong>
                    ) : null}
                    {change.summary}
                    {change.dataMigration ? (
                      <span className="mt-2 block whitespace-pre-wrap">
                        <strong>{t('migration')}: </strong>
                        {change.dataMigration}
                      </span>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
