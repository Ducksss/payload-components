# Moorhouse & Kent (real-estate-listing) — asset provenance

Moorhouse & Kent is a fictional estate agency built as a **Concept preview**. It
is not a real firm. The office, the people (Iris and Nell Moorhouse, Davey Kent,
and the rest of the grid), the town of Abbotsmoor and the five villages of the
Vale, every listed home and street, every buyer, seller, and review, the local
paper (The Vale Gazette), and every figure on the site are invented and
illustrative.

There are **no currency amounts anywhere** in this concept. It is solved the way
agents actually talk: guides are "on request" or "in writing", offers are "over
the guide", and the fee is "a fixed percentage agreed in writing" — never a
number with a sign on it.

## Credentials, deliberately generic

No ombudsman, redress scheme, professional body, regulator, or licence is named
or invented anywhere on this concept. Where the copy touches conduct it stays
generic and unverifiable on purpose ("in writing", "no sale, no fee"), and the
footer states outright that no regulator or redress scheme is referenced.

## Phone numbers and email

The office number `01632 960 233` sits inside the `01632 96xxxx` range reserved
for fictional use, so the `tel:` affordances cannot reach a real person. Email
uses the reserved `.example` top-level domain
(`office@moorhouseandkent.example`, `book@moorhouseandkent.example`).

## Runtime assets

`assets: []` in `src/lib/templates/real-estate-listing.ts` — this concept ships
and hotlinks **no raster runtime assets at all**.

- Every image surface is **token-derived**, drawn entirely in scoped CSS
  (`src/components/site/templates/real-estate-listing/theme.css`) over the demo
  twins' backend-free placeholders, as surveyor's artefacts rather than missing
  photographs: the property cards' media wells are floor plans (plot-grid
  sheets, hairline walls, directional hatching that varies per card), the
  "just agreed" plates are house elevations with a brick corner sash, the
  buyers'-book plate is a ruled ledger page with a brick margin line, the six
  team plates are the sash windows of 12 Sheep Street, and the About page's
  framed plate is the shopfront window with its spaced grid of window cards.
  **No likeness, real or synthetic, is depicted anywhere**, and no real
  property is pictured or described.
- Avatars are the shared twins' monogram placeholders, restyled as serif
  monogram medallions — initials, never faces.
- Typography uses only the fonts the root layout already loads via `next/font`
  (Geist, Geist Mono, and Instrument Serif italic — the concept's letterhead
  voice for display headlines and ledger figures).
- Colour is entirely scoped CSS variables under
  `[data-template-theme='real-estate-listing']` — warm stone paper, slate ink,
  and one brick-red accent (AA-checked as type on paper; it steps up to a clay
  tint on the slate bands). The site itself stays forced-light; nothing here
  touches `:root`, `.dark`, or `globals.css`.

## Generated posters

`public/templates/real-estate-listing/posters/*.jpg` are **build artifacts** —
deterministic screenshots produced by `tools/templates/capture.ts`
(`pnpm templates:capture`) from this repository's own preview routes at the
template's current `revision`. They carry the repository license. Regenerate
them whenever the concept's visual direction changes, and bump `revision` in
the same change.
