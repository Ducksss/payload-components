import type { ReactNode } from 'react'

import { getComponentManifest, getComponentRegistryDependencies, getSupportTarget } from '@/lib/component-manifest'

/* Backs <ComponentRequirements slug="…" /> — honest, manifest-driven compatibility:
 * supported target, Payload/Next majors, and the shadcn UI it pulls in. */
export async function ComponentRequirements({ slug }: { slug: string }) {
  const manifest = await getComponentManifest(slug)

  if (!manifest) return null

  const [deps, target] = await Promise.all([
    getComponentRegistryDependencies(slug),
    getSupportTarget(manifest.supportedTargets[0] ?? ''),
  ])

  const rows: { label: string; value: ReactNode }[] = [
    { label: 'Target', value: manifest.supportedTargets.join(', ') },
    { label: 'Payload', value: `v${manifest.supports.payloadMajors.join(' / v')}` },
    { label: 'Next.js', value: manifest.supports.nextMajors.join(' / ') },
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

      {target?.requiredFiles.length ? (
        <p className="text-sm leading-6 text-muted-foreground">
          Your project must already expose{' '}
          {target.requiredFiles.map((file, index) => (
            <span key={file}>
              {index > 0 ? ', ' : ''}
              <code className="font-mono text-[13px] text-foreground/90">{file}</code>
            </span>
          ))}{' '}
          — the surfaces <code className="font-mono text-[13px]">payload-components add</code> patches. The
          CLI verifies this against the support matrix before touching anything.
        </p>
      ) : null}
    </div>
  )
}
