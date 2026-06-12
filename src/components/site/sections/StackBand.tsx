import { stackBandLede, stackItems } from '@/lib/site'

/* The honest "logo cloud": no customer logos (alpha, open source), just the
 * stack kits install into, set as quiet wordmarks. */
export function StackBand() {
  return (
    <section aria-label="Supported stack" className="bg-muted/30">
      <div className="container flex flex-col items-center gap-6 py-9 sm:py-11">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {stackBandLede}
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
          {stackItems.map((item) => (
            <li key={item.label} className="flex items-baseline gap-2">
              <span className="text-base font-semibold tracking-tight text-foreground/85 sm:text-lg">
                {item.label}
              </span>
              <span className="font-mono text-[11px] text-brand">{item.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
