import { stackBandLede, stackItems } from '@/lib/site'

/* The honest "logo cloud": no customer logos, just the stack components
 * install into — set as a quiet support-matrix pill row, version chips in
 * emerald. */
export function StackBand() {
  return (
    <section aria-label="Supported stack" className="bg-muted/30">
      <div className="container flex flex-col items-center gap-6 py-9 sm:py-11">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {stackBandLede}
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {stackItems.map((item) => (
            <li key={item.label}>
              <span className="inline-flex items-baseline gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 shadow-card">
                <span className="text-sm font-semibold tracking-tight text-foreground/85">
                  {item.label}
                </span>
                <span className="font-mono text-[11px] text-brand">{item.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
