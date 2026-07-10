/* Visible caption above each stage panel — the one part of a panel that is
 * real text (the mock bodies underneath are aria-hidden). Step numbers in
 * mono emerald give the triptych its 01 → 02 → 03 reading order. */
export function HeroPanelLabel({
  caption,
  step,
  surface,
}: {
  caption: string
  step: string
  surface: string
}) {
  return (
    <p className="flex items-baseline gap-2 text-[11px] font-medium uppercase tracking-[0.16em]">
      <span className="font-mono text-brand-600">{step}</span>
      <span className="text-foreground">{surface}</span>
      <span aria-hidden="true" className="text-border">
        /
      </span>
      <span className="truncate text-muted-foreground">{caption}</span>
    </p>
  )
}
