import { Check } from 'lucide-react'

import type { AdminField, AdminLink } from '@/lib/component-composition'
import { cn } from '@/utilities/ui'

/* A static picture of the Payload block form, built from the manifest's
 * sampleContent (src/lib/component-composition.ts deriveAdminForm). It shows
 * what an editor sees after adding the block: one row per field, the sample
 * value standing in for the input. Nothing here is interactive, so the mock
 * carries no form controls — labels are <dt>, values are <dd>. */

const valueBox = 'rounded-md border border-border bg-background px-3 py-2 text-sm leading-6'

function LinkChip({ link }: { link: AdminLink }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-sm leading-5">
      <span className="truncate text-foreground">{link.label}</span>
      {link.appearance ? (
        <span className="shrink-0 font-mono text-xs text-muted-foreground">{link.appearance}</span>
      ) : null}
    </span>
  )
}

function FieldValue({ field }: { field: AdminField }) {
  switch (field.kind) {
    case 'text':
      return <div className={cn(valueBox, 'truncate text-foreground')}>{field.value}</div>
    case 'textarea':
      return (
        <div className={cn(valueBox, 'min-h-16')}>
          <p className="line-clamp-3 text-foreground">{field.value}</p>
        </div>
      )
    case 'number':
      return (
        <div className={cn(valueBox, 'w-24 font-mono text-[13px] text-foreground')}>
          {field.value}
        </div>
      )
    case 'checkbox':
      return (
        <div className="flex items-center gap-2 text-sm leading-6 text-foreground">
          <span
            aria-hidden="true"
            className={cn(
              'flex size-4 items-center justify-center rounded-sm border',
              field.checked
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-background',
            )}
          >
            {field.checked ? <Check className="size-3" strokeWidth={3} /> : null}
          </span>
          {field.checked ? 'Checked' : 'Unchecked'}
        </div>
      )
    case 'empty':
      return <div className={cn(valueBox, 'text-muted-foreground')}>Not set</div>
    case 'link':
      return (
        <div className="flex flex-wrap gap-2">
          <LinkChip link={field.link} />
        </div>
      )
    case 'links':
      return field.links.length ? (
        <div className="flex flex-wrap gap-2">
          {field.links.map((link, index) => (
            <LinkChip key={`${index}-${link.label}`} link={link} />
          ))}
        </div>
      ) : (
        <div className={cn(valueBox, 'text-muted-foreground')}>No links</div>
      )
    case 'list':
      return field.items.length ? (
        <ul className="flex flex-wrap gap-2">
          {field.items.map((item, index) => (
            <li
              className="rounded-md border border-border bg-background px-2 py-1 text-sm leading-5 text-foreground"
              key={`${index}-${item}`}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className={cn(valueBox, 'text-muted-foreground')}>Empty</div>
      )
    case 'group':
      return (
        <dl className="divide-y divide-border rounded-md border border-border bg-background">
          {field.fields.map((entry) => (
            <div
              className="flex flex-col gap-1 px-3 py-2 sm:flex-row sm:items-baseline sm:gap-3"
              key={entry.label}
            >
              <dt className="shrink-0 font-mono text-xs leading-5 text-muted-foreground sm:w-32">
                {entry.label}
              </dt>
              <dd className="min-w-0 truncate text-sm leading-6 text-foreground">
                {entry.value || <span className="text-muted-foreground">Not set</span>}
              </dd>
            </div>
          ))}
        </dl>
      )
    case 'rows':
      return (
        <ol className="divide-y divide-border rounded-md border border-border bg-background">
          {field.rows.map((row, index) => (
            <li className="flex items-baseline gap-3 px-3 py-2" key={`${index}-${row.primary}`}>
              <span className="w-5 shrink-0 font-mono text-xs leading-6 text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                {row.link ? (
                  <div className="flex flex-wrap gap-2">
                    <LinkChip link={row.link} />
                  </div>
                ) : (
                  <span className="truncate text-sm leading-6 text-foreground">{row.primary}</span>
                )}
                {row.secondary ? (
                  <span className="truncate text-sm leading-5 text-muted-foreground">
                    {row.secondary}
                  </span>
                ) : null}
                {row.counts.length ? (
                  <span className="font-mono text-xs leading-5 text-muted-foreground">
                    {row.counts.join(' · ')}
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      )
  }
}

export function AdminFormMock({
  eyebrow,
  fields,
  title,
}: {
  /* "Block" for page blocks, "Props" for file-only components. */
  eyebrow: string
  fields: AdminField[]
  title: string
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-background px-5 py-3">
        <p className="text-sm font-medium leading-6 text-foreground">{title}</p>
        <span className="shrink-0 font-mono text-xs uppercase tracking-eyebrow text-muted-foreground">
          {eyebrow}
        </span>
      </div>
      {fields.length ? (
        <dl className="flex flex-col gap-4 p-5">
          {fields.map((field) => (
            <div className="flex flex-col gap-1.5" key={field.key}>
              <dt className="font-mono text-xs leading-5 text-muted-foreground">{field.label}</dt>
              <dd className="min-w-0">
                <FieldValue field={field} />
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="p-5 text-sm leading-6 text-muted-foreground">
          This block has no editable fields; everything it shows comes from its own source.
        </p>
      )}
    </div>
  )
}
