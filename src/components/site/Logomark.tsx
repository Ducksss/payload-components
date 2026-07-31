import { cn } from '@/utilities/ui'

/* The brand mark: two blocks keyed together on the diagonal, drawn as geometry
   (not a font glyph) so it renders identically in the header, the favicon, and
   the OG image. Two equal squares overlapping by a quarter of their width —
   they read as separate blocks that have been fitted into one shape, which is
   the whole product: blocks that arrive already wired, not pasted. The union
   is deliberate; there is no seam to lose at 16px, so the silhouette survives
   a browser tab. Emerald square with a `--brand-foreground` glyph via
   currentColor — never recolored or gradiented. Decorative: the wordmark text
   carries the accessible name, so this is aria-hidden. Five copies of this
   geometry must stay in sync: public/favicon.svg, public/favicon.ico (three
   BMP entries, regenerated from the SVG), and the inline MARK_SVG in
   src/app/opengraph-image.tsx, src/app/templates/opengraph-image.tsx, and
   src/app/templates/[slug]/opengraph-image.tsx. */
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
        <rect x="4.8" y="4.8" width="8.4" height="8.4" rx="1.9" fill="currentColor" />
        <rect x="10.8" y="10.8" width="8.4" height="8.4" rx="1.9" fill="currentColor" />
      </svg>
    </span>
  )
}
