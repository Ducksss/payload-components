# Marleford District Council (civic-council) — asset provenance

Marleford District Council is a fictional local authority built as a **Concept
preview**. It is not a real council. The district of Marleford, the villages
(Netherfield, Combe Ash, Priors Halt, Whitmoor), the river Marle, every
street, ward, councillor, meeting, service, notice, and figure on the site are
invented and illustrative. Nothing on this concept is guidance from any real
authority.

There are **no currency amounts anywhere** in this concept. Money is discussed
the way a council's own letters do: bands set each March and looked up by
street, charges "listed on the booking page", help that is "means checked —
ask us".

## Authorities, deliberately absent

No real statute, regulator, ombudsman, national scheme, or government body is
named or invented anywhere on this concept. Obligations are stated as council
policy ("this is council policy, minuted"). Elected members are listed by ward
only — no political party is named or implied. Emergency guidance stays
generic ("contact your local emergency number") and never names a real
emergency service or number. The design is GOV.UK-adjacent in discipline only;
no real government identity, typeface, crest, or colour is imitated — the
crest is an invented teal shield with a generic river band, and the palette is
this concept's own.

## Phone numbers and email

The one phone number — `01632 960 700` — sits inside the `01632 96xxxx` range
reserved for fictional use. Email addresses use the reserved `.example`
top-level domain (`hello@marleford.example`, `report@marleford.example`,
`clerk@marleford.example`).

## Runtime assets

`assets: []` in `src/lib/templates/civic-council.ts` — this concept ships and
hotlinks **no raster runtime assets at all**.

- Every image surface is **token-derived**. The demo twins render their
  backend-free `bg-muted` placeholders, and
  `src/components/site/templates/civic-council/theme.css` paints each one as
  the working document its section actually needs, entirely from the scoped
  tokens: the notices become **survey-map tiles** (plan paper under a fine
  grid, the river Marle as a soft teal band, a green open space — per-row
  variables move both so no two tiles repeat); the Services bins section
  paints each plate **the colour of the bin it describes** (field, moulded
  lid band, paper label patch — the picture is the sorting instruction); the
  Council meetings become **calendar leaves** (a ruled month grid with the
  meeting day filled solid teal, the filled day walking the committee cycle
  across the three rows); and the plain-words promise sits beside a **ruled
  minutes page** (teal letterhead, margin rule, hairline text rules).
- The council-members roster renders the shared twins' portrait wells,
  squared by the theme and painted as **nameplates** (a wash tile over a
  solid teal base rule). **No likeness, real or synthetic, is depicted
  anywhere.**
- The Marleford crest in the header and footer is a teal shield with a paper
  band for the river, drawn with `clip-path` and gradients in scoped CSS — no
  SVG file, no image file, and no real heraldry.
- The `stats-proof` band's wordmark slot (`logoLabel`) carries the fictional
  "Marleford Residents' Panel", restyled by the theme into a small tracked
  lockup; `content-quote`'s wordmark slot is deliberately left empty (a
  lockup under a named councillor would be nonsense).
- Typography uses only the fonts the root layout already loads via
  `next/font` (Geist Sans and Geist Mono). This concept ships no font files
  and uses no serif anywhere — the register is one plain sans, ranged left.
- Colour is entirely scoped CSS variables under
  `[data-template-theme='civic-council']`. The site itself stays forced-light;
  nothing here touches `:root`, `.dark`, or `globals.css`. The committee
  slate band and the footer are intentional dark surfaces built from the
  scoped tokens, with every custom teal painted through the `--mdc-task`
  indirection so the dark-band contrast step-up is automatic.

## Generated posters

`public/templates/civic-council/posters/*.jpg` are **build artifacts** —
deterministic screenshots produced by `tools/templates/capture.ts`
(`pnpm templates:capture`) from this repository's own preview routes at the
template's current `revision`. They are screenshots of this repository's
rendered output and carry the repository license. Regenerate them whenever the
concept's visual direction changes, and bump `revision` in the same change.
