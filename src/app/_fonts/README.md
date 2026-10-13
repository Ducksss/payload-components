# Vendored fonts

Two kinds of font live here, both read from disk — never fetched — so builds stay
deterministic and the CI release gate never waits on a network font request.

## The site's Archivo (web font)

`Archivo-Variable-Latin.woff2` is the Datasheet chrome's display and text face,
loaded by `next/font/local` in `src/app/[locale]/layout.tsx` and preloaded for
the landing headline. It is Archivo 2.001 — the Latin file Google Fonts serves —
trimmed to what the chrome draws:

- **Width axis** limited to `wdth` 62–100 (Google serves 62–125); `wght` keeps
  its full 100–900. The chrome's widths are 68%, 75% and 100%. Cutting the wide
  half drops whole delta regions rather than rescaling them, so in-range
  instances keep Google's metrics: in Chromium every advance width matches at
  every weight and width the chrome uses, and outlines match except for a few
  edge pixels on six glyphs (`©` most, then `™`, `£`, `1`, `”`, `É`). Limiting
  `wght` to 400–800 as well would save another 4 KB, but rescales deltas and
  shifts advance widths by fractions of a pixel, so it was not done.
- **Characters**: ASCII, Latin-1 and the typographic punctuation the English copy
  and frontmatter use (`U+20-7E, A0-FF, 131, 152-153, 2C6, 2DA, 2DC, 2013-2014,
2018-201A, 201C-201E, 2022, 2026, 2039-203A, 20AC, 2122, 2191, 2193, 2212`).
  Everything else falls back per character. If a non-English Latin locale is
  published, add a second file for `latin-ext` with a `unicode-range`.
- All layout features and name records kept; no hinting (the Google file has
  none).

90 KB → 61 KB. Regenerate from the Google variable TTF with fontTools:

```sh
fonttools varLib.instancer Archivo[wdth,wght].ttf wdth=62:100 -o archivo-limited.ttf
pyftsubset archivo-limited.ttf --unicodes='U+20-7E,U+A0-FF,…' --layout-features='*' \
  --name-IDs='*' --flavor=woff2 --output-file=Archivo-Variable-Latin.woff2
```

(This copy was cut with HarfBuzz `hb-subset --variations='wdth=62:100'`
with the same Unicode and feature options, and stored as WOFF2 with the null
transform.)

## OG image fonts

These TrueType files are read at build time by the social share cards — the
shared parts in `src/lib/og/` used by `src/app/opengraph-image.tsx`, the
`src/app/[locale]/templates` cards and the `src/app/[locale]/og/{blog,docs}`
routes. Satori reads TrueType, not variable WOFF2, so the Datasheet faces are
static instances of the same fonts (full Google Latin coverage, not trimmed).

| File                             | Family                      | Use                                                  |
| -------------------------------- | --------------------------- | ---------------------------------------------------- |
| `Archivo-CondensedExtraBold.ttf` | Archivo wght 800, wdth 68   | Card headlines                                       |
| `Archivo-Regular.ttf`            | Archivo 400                 | Descriptions                                         |
| `Archivo-SemiBold.ttf`           | Archivo 600                 | The wordmark                                         |
| `AzeretMono-Regular.ttf`         | Azeret Mono 400             | Pin labels, URLs, document strip                     |
| `AzeretMono-Medium.ttf`          | Azeret Mono 500             | Section labels, the command prompt                   |
| `Geist-Regular.ttf`              | Geist 400                   | Glyph fallback on the cards; blog covers and figures |
| `Geist-Bold.ttf`                 | Geist 700                   | Blog covers and figures (`tools/blog`)               |
| `GeistMono-Regular.ttf`          | Geist Mono 400              | Blog covers and figures (`tools/blog`)               |
| `InstrumentSerif-Italic.ttf`     | Instrument Serif 400 italic | Blog covers (`tools/blog`)                           |

The static instances were cut from the same Google files with
`hb-subset --variations='wght=800 wdth=68'` (and `wght=400`, `wght=600` for
Archivo; `wght=400`, `wght=500` for Azeret Mono). Their `name` tables still
carry the variable font's default-instance names; Satori uses the names given in
`src/lib/og/datasheet-card.tsx`.

Note: every glyph a card draws must exist in one of the loaded fonts. next/og
silently tries to **network-fetch** a font for any glyph none of them has (e.g.
`✓`), which breaks the deterministic build. Satori falls back across every
loaded font by glyph, so Geist (loaded last) covers the arrows and symbols the
Archivo Latin cut lacks; `tests/int/datasheet.int.spec.ts` checks that every
character of the docs and blog frontmatter, the template copy and the card
labels has a glyph. Geist has Latin accents, curly quotes, dashes, and arrows,
but not `✓`, `✕`, `⌘`, or emoji.

This is a `_`-prefixed private folder, so Next.js excludes it from routing.

## Licenses

- **Archivo** — © 2020 The Archivo Project Authors, SIL Open Font License 1.1.
  Full text in `Archivo-LICENSE.txt`.
- **Azeret Mono** — © 2021 The Azeret Project Authors, SIL Open Font License 1.1.
  Full text in `AzeretMono-LICENSE.txt`.
- **Geist** — © Vercel, SIL Open Font License 1.1. Full text in `Geist-LICENSE.txt`.
- **Instrument Serif** — © Rodrigo Fuenzalida, SIL Open Font License 1.1
  (https://fonts.google.com/specimen/Instrument+Serif).
