import { stackBandLede, stackItems } from '@/lib/site'

/* The honest "logo cloud": no customer logos (alpha, open source), just the
 * stack components install into, set as quiet wordmarks. */
export function StackBand() {
  return (
    <section aria-label="Supported stack" className="bg-muted/30">
      <div className="container flex flex-col items-center gap-6 py-9 sm:py-11">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {stackBandLede}
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4 sm:gap-x-10">
          {stackItems.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2.5 rounded-full border border-border/70 bg-background/70 px-4 py-1.5"
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand/70" />
              <span className="text-sm font-semibold tracking-tight text-foreground/85 sm:text-base">
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
