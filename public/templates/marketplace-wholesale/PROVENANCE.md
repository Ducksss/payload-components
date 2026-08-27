# Trestle (marketplace-wholesale) — asset provenance

Trestle is a fictional two-sided wholesale marketplace built as a **Concept
preview**. It is not a real business. The marketplace, the founders (Ro
Beckett, Sam Odedra), the support person (Dolly Okonkwo), every maker, studio,
shop, and shopkeeper, the city of Ellsworth, the trade paper (The Shopkeeper's
Almanac), and every figure on the site are invented and illustrative.

There are **no currency amounts anywhere** in this concept. Terms are stated
the way wholesale is actually spoken: sixty days to pay, one flat commission,
your wholesale price is yours, minimums counted in pieces.

## Credentials, deliberately generic

No payments regulator, insurer, trade body, or certification scheme is named
or invented anywhere on this concept. Where the copy touches conduct it stays
in plain commercial English ("terms in writing", "the terms win — that cuts
both ways").

## Phone numbers and email

The one phone number — `01632 960 512` — sits inside the `01632 96xxxx` range
reserved for fictional use. Email addresses use the reserved `.example`
top-level domain (`shops@trestle.example`, `makers@trestle.example`).

## Runtime assets

`assets: []` in `src/lib/templates/marketplace-wholesale.ts` — this concept
ships and hotlinks **no raster runtime assets at all**.

- Every image surface is **token-derived**: the demo twins render their
  backend-free `bg-muted` placeholders, restyled by
  `src/components/site/templates/marketplace-wholesale/theme.css` from the
  concept's own scoped tokens. The art-direction wave documents each repaint
  here as it lands.
- The maker marks in the logo strip come from the shared demo twin
  (`src/components/site/demos/DemoLogos.tsx`) — invented monochrome lockups
  for fictional companies, carrying no third-party trademark. On this concept
  they read as maker marks, not certifying bodies.
- Avatar surfaces are the shared twins' monogram placeholders. **No likeness,
  real or synthetic, is depicted anywhere.**
- Typography uses only the fonts the root layout already loads via `next/font`.
  This concept ships no font files.
- Colour is entirely scoped CSS variables under
  `[data-template-theme='marketplace-wholesale']`. The site itself stays
  forced-light; nothing here touches `:root`, `.dark`, or `globals.css`.

## Generated posters

`public/templates/marketplace-wholesale/posters/*.jpg` are **build
artifacts** — deterministic screenshots produced by `tools/templates/capture.ts`
(`pnpm templates:capture`) from this repository's own preview routes at the
template's current `revision`. They are screenshots of this repository's
rendered output and carry the repository license. Regenerate them whenever the
concept's visual direction changes, and bump `revision` in the same change.
