import { cn } from '@/utilities/ui'

/* The brand mark: a terminal prompt `>` followed by a block cursor, drawn as
   geometry (not a font glyph) so it renders identically in the header, the
   favicon, and the OG image. The chevron reads as the CLI prompt; the block
   cursor doubles as the *block* the command installs. Emerald square with a
   `--brand-foreground` glyph via currentColor — never recolored or gradiented.
   Decorative: the wordmark text carries the accessible name, so this is
   aria-hidden. Keep the geometry in sync with public/favicon.svg and the
   inline mark in src/app/opengraph-image.tsx. */
export function Logomark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-md bg-brand text-brand-foreground',
        className,
      )}
    >
      <svg className="size-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polyline
          points="7,7.5 11.5,12 7,16.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="14" y="7.5" width="3.6" height="9" rx="1" fill="currentColor" />
      </svg>
    </span>
  )
}
