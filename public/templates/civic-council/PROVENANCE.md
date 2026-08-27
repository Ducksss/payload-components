# Marleford District Council (civic-council) — asset provenance

Marleford District Council is a fictional local authority built as a **Concept
preview**. It is not a real council. The district of Marleford, the villages
(Netherfield, Combe Ash, Priors Halt, Whitmoor), every street, ward,
councillor, meeting, service, notice, and figure on the site are invented and
illustrative. Nothing on this concept is guidance from any real authority.

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
emergency service or number.

## Phone numbers and email

The one phone number — `01632 960 700` — sits inside the `01632 96xxxx` range
reserved for fictional use. Email addresses use the reserved `.example`
top-level domain (`hello@marleford.example`, `report@marleford.example`,
`clerk@marleford.example`).

## Runtime assets

`assets: []` in `src/lib/templates/civic-council.ts` — this concept ships and
hotlinks **no raster runtime assets at all**.

- Every image surface is **token-derived**: the demo twins render their
  backend-free `bg-muted` placeholders, restyled by
  `src/components/site/templates/civic-council/theme.css` from the concept's
  own scoped tokens. The art-direction wave documents each repaint here as it
  lands.
- Avatar and member surfaces are the shared twins' monogram placeholders.
  **No likeness, real or synthetic, is depicted anywhere.**
- Typography uses only the fonts the root layout already loads via
  `next/font`. This concept ships no font files.
- Colour is entirely scoped CSS variables under
  `[data-template-theme='civic-council']`. The site itself stays forced-light;
  nothing here touches `:root`, `.dark`, or `globals.css`.

## Generated posters

`public/templates/civic-council/posters/*.jpg` are **build artifacts** —
deterministic screenshots produced by `tools/templates/capture.ts`
(`pnpm templates:capture`) from this repository's own preview routes at the
template's current `revision`. They are screenshots of this repository's
rendered output and carry the repository license. Regenerate them whenever the
concept's visual direction changes, and bump `revision` in the same change.
