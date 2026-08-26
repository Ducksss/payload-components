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

- Every image surface is **token-derived**: the demo twins render their
  backend-free `bg-muted` placeholders, restyled by
  `src/components/site/templates/real-estate-listing/theme.css`. **No likeness,
  real or synthetic, is depicted anywhere**, and no real property is pictured
  or described.
- Avatars are the shared twins' monogram placeholders.
- Typography uses only the fonts the root layout already loads via `next/font`.
- Colour is entirely scoped CSS variables under
  `[data-template-theme='real-estate-listing']`. The site itself stays
  forced-light; nothing here touches `:root`, `.dark`, or `globals.css`.

## Generated posters

`public/templates/real-estate-listing/posters/*.jpg` are **build artifacts** —
deterministic screenshots produced by `tools/templates/capture.ts`
(`pnpm templates:capture`) from this repository's own preview routes at the
template's current `revision`. They carry the repository license. Regenerate
them whenever the concept's visual direction changes, and bump `revision` in
the same change.
