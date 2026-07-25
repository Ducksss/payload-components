# Ledgerline (fintech-trust) — asset provenance

Ledgerline is a fictional money-movement infrastructure platform built as a
**Concept preview**. It is not a real company. Its name, copy, customers,
people, figures, and compliance posture are invented and illustrative; the
compliance language names industry programmes only (never a named auditor,
certificate, regulator, or bank partner) and the footer states plainly that the
posture is not certified. Contact addresses use the reserved
`ledgerline.example` domain, and the newsletter placeholder uses
`treasury.example`.

## Runtime assets

`assets: []` in `src/lib/templates/fintech-trust.ts` — this concept ships **no
raster or hotlinked runtime assets at all**. Every visual is produced live by
this repository's own code:

- **Sections** are the site's demo twins (`src/components/site/demos/`), rendered
  from the recipe in the template definition. Their media slots stay
  presentational: `bg-muted` placeholders, monogram avatar tiles, and the
  invented monochrome logo marks in `DemoLogos.tsx` (no third-party
  trademarks).
- **The hero atmosphere** is the `hero-aurora` block's own CSS composition
  (gradients and masks mixed from `--brand` / `--brand-100` / `--brand-200` /
  `--primary`), retuned to a cool instrument glow by the scoped
  `[data-aurora-root]` block in `theme.css`. No image is involved.
- **The ledger plate** behind the Product-page quote is token-derived art: the
  `bg-muted` upload placeholder is repainted in `theme.css` with layered
  `repeating-linear-gradient` rules and a teal pool, so it reads as a ruled
  ledger sheet without an asset to attribute.
- **The Ledgerline mark** (header and footer) is an inline SVG authored for this
  concept in `src/components/site/templates/fintech-trust/LedgerlineMark.tsx`.
- **All colour, geometry, and type** come from
  `src/components/site/templates/fintech-trust/theme.css`, scoped beneath
  `[data-template-theme='fintech-trust']`. Fonts are the site's existing
  `next/font` families (Geist Sans, Geist Mono, Instrument Serif) — nothing new
  is loaded.

Nothing in this concept is derived from another site's markup, imagery, or
design files.

## Generated posters

`public/templates/fintech-trust/posters/*.jpg` are deterministic screenshots
produced by `tools/templates/capture.ts` (`pnpm templates:capture`) against the
running preview at the template's current `revision`. They are screenshots of
this repository's own rendering and introduce no third-party material.
Regenerate them whenever the concept's visual direction changes, and bump
`revision` in `src/lib/templates/fintech-trust.ts` in the same change.
