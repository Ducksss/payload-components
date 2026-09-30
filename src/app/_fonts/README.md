# OG image fonts

These TrueType files are read at build time by the social share cards —
`src/app/opengraph-image.tsx`, the `src/app/[locale]/templates` cards, and the
`src/app/[locale]/og/{blog,docs}` routes. They are vendored — not fetched — so
the OG images stay deterministic and the CI release gate never depends on a
network font request.

| File                         | Family                      | Use                                                                           |
| ---------------------------- | --------------------------- | ----------------------------------------------------------------------------- |
| `Geist-Regular.ttf`          | Geist 400                   | Card default / body text, docs descriptions                                   |
| `Geist-Bold.ttf`             | Geist 700                   | Wordmark, headlines, docs titles                                              |
| `GeistMono-Regular.ttf`      | Geist Mono 400              | Install commands, domains and URLs                                            |
| `GeistMono-Medium.ttf`       | Geist Mono 500              | Command prompt, docs section eyebrow                                          |
| `InstrumentSerif-Italic.ttf` | Instrument Serif 400 italic | Headline accent word, the docs lockup; mirrors the site `--font-serif` accent |

Note: every glyph a card draws must exist in these fonts. next/og silently tries
to **network-fetch** a font for any missing glyph (e.g. `✓`), which breaks the
deterministic build — so the static cards stick to glyphs Geist ships
(`$ + · —`). The docs card draws each page's frontmatter `title` and
`description`, so the rule covers docs frontmatter too: Geist has Latin
accents, curly quotes, dashes, and arrows, but not `✓`, `✕`, `⌘`, or emoji.

This is a `_`-prefixed private folder, so Next.js excludes it from routing.

## Licenses

- **Geist** — © Vercel, SIL Open Font License 1.1. Full text in `Geist-LICENSE.txt`.
- **Instrument Serif** — © Rodrigo Fuenzalida, SIL Open Font License 1.1
  (https://fonts.google.com/specimen/Instrument+Serif).
