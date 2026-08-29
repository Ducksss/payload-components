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

- Every image surface is **token-derived**, restyled by
  `src/components/site/templates/marketplace-wholesale/theme.css` from the
  concept's own scoped tokens into crate-and-parcel matter:
  - the four shelf cards on the For shops page (`feature-cards-media`) repaint
    as **crate sides** — corrugated kraft board with a ruled shipping label
    under a spruce head band, a double-ring postmark, fragile stripes, and a
    run of twine, with flute pitch, stripe angle, and mark positions varied
    per card so no two crates repeat;
  - the three plates on the For makers page (`content-rows`) repaint as
    **wrapped parcels** — kraft board tied with two crossing runs of twine
    meeting at a knot, the tie point moved per row;
  - the one plate on How it works (`content-quote`) is the concept's single
    literal picture: an **open ledger spread** — two ruled pages, a spruce
    margin line on each, a double head rule, a darkened centre crease.
- The maker marks in the logo strip come from the shared demo twin
  (`src/components/site/demos/DemoLogos.tsx`) — invented monochrome lockups
  for fictional companies, carrying no third-party trademark. On this concept
  they read as maker marks, not certifying bodies.
- Avatar surfaces are the shared twins' monogram placeholders, restyled as
  **postmarks** — a double ring around a mono initial. `feature-steps`'
  numerals join the same postmark family. **No likeness, real or synthetic,
  is depicted anywhere.**
- The Trestle mark in the shell is the same postmark object — a double-ring
  roundel with a mono initial — drawn in plain CSS in the header. No SVG or
  image file ships.
- The `stats-proof` twin renders a static press wordmark (THE SHOPKEEPER'S
  ALMANAC) that belongs to this concept's fictional trade paper; the theme
  restyles it as a tracked mono masthead lockup.
- Typography uses only the fonts the root layout already loads via `next/font`
  (Geist Sans, Geist Mono). This concept ships no font files and uses **no**
  Instrument Serif anywhere — the letterhead serif is the real-estate
  concept's voice; Trestle's marking hand is Geist Mono (eyebrow stamps,
  stamped mono-caps actions, ledger figures, the wordmark).
- The two-sided grammar ships as **geometry, not assets**: the shell stamps
  `data-tr-side` per route and the theme mirrors washes, edge rules, and the
  home page's two feature splits (recto/verso) off it. No second accent
  colour exists.
- Colour is entirely scoped CSS variables under
  `[data-template-theme='marketplace-wholesale']`. The site itself stays
  forced-light; nothing here touches `:root`, `.dark`, or `globals.css`. All
  contrast pairings are measured, not guessed — the figures are recorded at
  the top of `theme.css` (spruce type is 7.2:1 on kraft; on the spruce ink
  bands every accent steps up to sage at 9.3:1 via one indirection).

## Generated posters

`public/templates/marketplace-wholesale/posters/*.jpg` are **build
artifacts** — deterministic screenshots produced by `tools/templates/capture.ts`
(`pnpm templates:capture`) from this repository's own preview routes at the
template's current `revision`. They are screenshots of this repository's
rendered output and carry the repository license. Regenerate them whenever the
concept's visual direction changes, and bump `revision` in the same change.
