# Tansy (restaurant-bistro) — asset provenance

Tansy is a fictional dining room built as a **Concept preview**. It is not a
real restaurant. The room, the people (Etta Voss, Joan Carrow, and the rest of
the grid), the town of Porthmere and every street in it, the suppliers, the
local paper (The Porthmere Courant), the reviews, and every figure on the site
are invented and illustrative.

There are **no currency amounts anywhere** in this concept. A dining room
solves this naturally: set menus are counted in courses ("Three courses",
"Seven courses"), and everything else is "ask when you book".

## Credentials, deliberately generic

No hygiene rating, restaurant guide, star scheme, or awards body is named or
invented anywhere on this concept. The one press voice, The Porthmere Courant,
is an invented local paper attributed as such.

## Phone numbers and email

The booking number `01632 960 447` sits inside the `01632 96xxxx` range
reserved for fictional use, so the `tel:` affordances cannot reach a real
person. Email uses the reserved `.example` top-level domain
(`joan@tansy.example`), and the Long Room enquiry placeholder
(`you@yourhouse.example`) does too.

## Runtime assets

`assets: []` in `src/lib/templates/restaurant-bistro.ts` — this concept ships
and hotlinks **no raster runtime assets at all**.

- Every image surface is **token-derived**: the demo twins render their
  backend-free `bg-muted` placeholders, repainted by
  `src/components/site/templates/restaurant-bistro/theme.css` as candlelit
  stills — a deep umber field, a candle glow pooled at per-section
  coordinates, and a thin amber table-edge line, all mixed with `color-mix`
  from the scoped Tansy tokens. **No likeness, real or synthetic, is depicted
  anywhere**: the team "portraits" are abstract lit plates, and the town's
  faces on the story page are repainted as small lit windows.
- Testimonial avatars are the shared twins' monogram placeholders, restyled as
  raised-cream place cards.
- Typography uses only the fonts the root layout already loads via `next/font`
  (Geist Sans plus the Instrument Serif accent face, which this theme promotes
  to the headline voice).
- Colour is entirely scoped CSS variables under
  `[data-template-theme='restaurant-bistro']`, with every text pairing
  measured against WCAG (the contrast ledger is documented at the top of
  theme.css; the worst text case on the concept is 6.19:1 against a 4.5:1 AA
  floor). The site itself stays forced-light; nothing here touches `:root`,
  `.dark`, or `globals.css`.

## Generated posters

`public/templates/restaurant-bistro/posters/*.jpg` are **build artifacts** —
deterministic screenshots produced by `tools/templates/capture.ts`
(`pnpm templates:capture`) from this repository's own preview routes at the
template's current `revision`. They carry the repository license. Regenerate
them whenever the concept's visual direction changes, and bump `revision` in
the same change.
