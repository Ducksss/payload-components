import type { ReactNode } from 'react'

import {
  describeExperimentalSupport,
  formatPairedNext,
  formatPayloadMajor,
  getComponentManifest,
  getComponentRegistryDependencies,
  getPayloadCompatibility,
  getSupportTarget,
} from '@/lib/component-manifest'

/* Backs <ComponentRequirements slug="…" /> — honest, manifest-driven compatibility:
 * supported target, Payload/Next majors, and the shadcn UI it pulls in. Next.js
 * majors are listed per Payload major, because the pairing is not a cross
 * product: Payload v4 runs on Next.js 16 only. */
export async function ComponentRequirements({ slug }: { slug: string }) {
  const manifest = await getComponentManifest(slug)

  if (!manifest) return null

  const [deps, target, compatibility] = await Promise.all([
    getComponentRegistryDependencies(slug),
    getSupportTarget(manifest.supportedTargets[0] ?? ''),
    getPayloadCompatibility(manifest),
  ])
  const experimental = compatibility.filter((entry) => entry.experimental)
  const stable = compatibility.filter((entry) => !entry.experimental)
  /* One line when every Payload major pairs the same way, as before Payload v4. */
  const nextValues = [...new Set(compatibility.map(formatPairedNext))]

  /* A target may accept a file at more than one path (src/ vs repo root); show
   * every accepted path rather than only the first. */
  const requiredFiles = (target?.requiredFiles ?? []).map((requirement) =>
    Array.isArray(requirement) ? requirement.join(' or ') : requirement,
  )

  const fileOnly = manifest.payloadFragments.length === 0

  const rows: { label: string; value: ReactNode }[] = [
    { label: 'Target', value: manifest.supportedTargets.join(', ') },
    { label: 'Payload', value: compatibility.map(formatPayloadMajor).join(' / ') },
    {
      label: 'Next.js',
      value:
        nextValues.length === 1
          ? nextValues[0]
          : compatibility.map((entry) => (
              <span className="block" key={entry.payloadMajor}>
                {`${formatPairedNext(entry)} with v${entry.payloadMajor}`}
              </span>
            )),
    },
    { label: 'shadcn UI', value: deps.length ? deps.join(', ') : 'none' },
  ]

  return (
    <div className="not-prose my-6 flex flex-col gap-4">
      <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1 bg-background p-4">
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {row.label}
            </dt>
            <dd className="font-mono text-sm text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>

      {experimental.length ? (
        <p className="text-sm leading-6 text-muted-foreground">
          {experimental.map(describeExperimentalSupport).join(' ')}
          {stable.length
            ? ` Payload ${stable.map(formatPayloadMajor).join(' and ')} stays fully supported.`
            : ''}
        </p>
      ) : null}

      {fileOnly ? (
        <p className="text-sm leading-6 text-muted-foreground">
          Direct shadcn installation needs React 19 and Tailwind with your theme tokens; this
          component has no Payload runtime imports. The targets above apply to CLI install tracking.
        </p>
      ) : null}

      {requiredFiles.length ? (
        <p className="text-sm leading-6 text-muted-foreground">
          Your project must already expose{' '}
          {requiredFiles.map((file, index) => (
            <span key={file}>
              {index > 0 ? ', ' : ''}
              <code className="font-mono text-[13px] text-foreground/90">{file}</code>
            </span>
          ))}{' '}
          — {fileOnly ? 'the host shape checked by' : 'the surfaces patched by'}{' '}
          <code className="font-mono text-[13px]">payload-components add</code>. The CLI verifies
          this against the support matrix before touching anything.
        </p>
      ) : null}

      {manifest.requires?.projectFiles.map((requirement) => (
        <p className="text-sm leading-6 text-muted-foreground" key={requirement.label}>
          <strong className="font-medium text-foreground">{requirement.label}:</strong>{' '}
          <code className="font-mono text-[13px] text-foreground/90">
            {requirement.paths.join(' or ')}
          </code>{' '}
          must match the expected starter contract.{' '}
          {requirement.collectionIdentifiers?.length ? (
            <>
              The config must register {requirement.collectionIdentifiers.join(' and ')} directly in
              its collections array.{' '}
            </>
          ) : null}
          {requirement.help}
        </p>
      ))}
    </div>
  )
}
