# Pale Meridian (music-artist) — asset provenance

Pale Meridian is a fictional band built as a **Concept preview**. It is not a
real act. The four members, the manager, the label (Laundrette Tapes), the
records and their titles, the venues, the support act (Old Casino), the zines
and radio shows quoted (The Night Bus, Corrugated, The Small Hours, Margin
Notes, Flyover, The Kettle Pages), and every figure on the site are invented
and illustrative. City names in the tour table are invented; no real venue is
named.

There are **no currency amounts anywhere** in this concept, and it sells
nothing: tickets are always "from each venue's own box office", records are "at
the shows" or "wherever you listen", and the word "download" never appears on a
concept surface.

## Credentials, deliberately generic

No charting body, awards show, streaming platform, performing-rights society, or
real publication is named or invented as an authority anywhere on this concept.
The press quotes are attributed to explicitly invented zines, and the copy says
so on the surface ("every publication here is as invented as the band").

## Email

All addresses use the reserved `.example` top-level domain
(`hello@palemeridian.example`, `mabel@laundrettetapes.example`). No phone number
appears on this concept.

## Runtime assets

`assets: []` in `src/lib/templates/music-artist.ts` — this concept ships and
hotlinks **no raster runtime assets at all**.

- Every image surface is **token-derived**: the demo twins render their
  backend-free `bg-muted` placeholders, restyled by
  `src/components/site/templates/music-artist/theme.css`. **No likeness, real
  or synthetic, is depicted anywhere**, and no album art from any real record
  is reproduced or imitated.
- The marks in the "Played this year at" strip come from the shared demo twin
  (`src/components/site/demos/DemoLogos.tsx`) — invented monochrome lockups
  carrying no third-party trademark; on this concept they read as invented
  festivals.
- Avatars are the shared twins' monogram placeholders.
- Typography uses only the fonts the root layout already loads via `next/font`.
- Colour is entirely scoped CSS variables under
  `[data-template-theme='music-artist']`. The site itself stays forced-light;
  this concept's night-time base is its own named palette, not a dark mode, and
  nothing here touches `:root`, `.dark`, or `globals.css`.

## Generated posters

`public/templates/music-artist/posters/*.jpg` are **build artifacts** —
deterministic screenshots produced by `tools/templates/capture.ts`
(`pnpm templates:capture`) from this repository's own preview routes at the
template's current `revision`. They carry the repository license. Regenerate
them whenever the concept's visual direction changes, and bump `revision` in
the same change.
