# OG image fonts

These TrueType files are read at build time by `src/app/opengraph-image.tsx`
(and only there) to render the social share card. They are vendored — not
fetched — so the OG image stays deterministic and the CI release gate never
depends on a network font request.

| File | Family | Use |
| --- | --- | --- |
| `Geist-Regular.ttf` | Geist 400 | Card default / body text |
| `Geist-Bold.ttf` | Geist 700 | Wordmark, headline primary |
| `GeistMono-Regular.ttf` | Geist Mono 400 | Terminal card body, footer stack line |
| `GeistMono-Medium.ttf` | Geist Mono 500 | Terminal prompt + success line |
| `InstrumentSerif-Italic.ttf` | Instrument Serif 400 italic | Headline accent word, mirrors the site `--font-serif` treatment |

Note: every glyph drawn in `opengraph-image.tsx` must exist in these fonts.
next/og silently tries to **network-fetch** a font for any missing glyph (e.g.
`✓`), which breaks the deterministic build — so the card sticks to glyphs Geist
ships (`$ + · —`).

This is a `_`-prefixed private folder, so Next.js excludes it from routing.

## Licenses

- **Geist** — © Vercel, SIL Open Font License 1.1. Full text in `Geist-LICENSE.txt`.
- **Instrument Serif** — © Rodrigo Fuenzalida, SIL Open Font License 1.1
  (https://fonts.google.com/specimen/Instrument+Serif).
