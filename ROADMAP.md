# Payload Components Roadmap

Payload Components stays MIT, open-source, and community-first. The roadmap is
about improving the install contract, expanding useful blocks, and making real
contribution paths obvious.

Active, scoped work lives in the [GitHub issue queue][issues]; the priorities
below group it rather than replace it. Anything not tracked as an issue is a
direction, not a commitment. New contributors can start with
[`good first issue`][gfi] or [`up-for-grabs`][ufg].

## Current implementation

The registry contains 79 wired Page blocks and four file-only article components.
Work merged into `main` reaches the published CLI with the next npm release.

- `collection-query` provides grid, list, and featured Posts layouts, category
  filters, pagination, manual selection, and an empty state. Its shared Post Card
  is distributed with the block.
- `contact-form-basic` provides an accessible contact form with validation,
  submission feedback, and a consumer-owned endpoint.
- `post-hero`, `author-card`, `newsletter-callout`, and `related-posts` install as
  files for article-template composition; they do not patch Pages or run Payload
  generators.
- The catalog separates installable Page blocks and article components.
- The visual install walkthrough covers discovery, wrapper installation, the
  resulting diff, doctor, and the limits of direct shadcn delivery.
- Blog posts and template detail pages expose markdown twins; the component
  changelog is generated from manifest release and migration records.
- Marquees pause off-screen. Scheduled registry verification uses a clean
  external target and public HTTPS registry URLs.

The existing CLI includes install lifecycle commands, JSON doctor output,
localization, starter scaffolding, templates, optional draft demo scripts, and
read-only MCP discovery. These are existing capabilities rather than future
roadmap items. The registry is listed under `@payload-components` in the official
shadcn directory.

## Editorial backlog reconciliation

[#455] supersedes the blanket plan to ship eight separate file-only post
components. Track outcomes, not duplicate implementations:

| Earlier item                  | Current implementation or remaining scope                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `post-card` ([#123])          | Shared Post Card shipped with Collection Query; no separate registry item is needed.                                  |
| `post-archive` ([#126])       | Collection Query grid layout.                                                                                         |
| `post-list` ([#133])          | Collection Query list layout.                                                                                         |
| `featured-post` ([#132])      | Collection Query featured layout.                                                                                     |
| `post-hero` ([#124])          | File-only article header.                                                                                             |
| `author-card` ([#125])        | File-only article byline/profile.                                                                                     |
| `newsletter-callout` ([#134]) | File-only article signup surface; Page signup stays with `call-to-action-signup`.                                     |
| `related-posts` ([#135])      | File-only end-of-post list: the template passes `currentHref` and the posts it selected; no automatic recommendation. |

Historical tickets can be closed once their replacement scope
has been verified. A merged implementation does not silently satisfy the old
file-only acceptance criteria of a ticket that now maps to a wired Page block.

## Next priorities

1. Validate and release the complete current bundle, including fresh consumer
   compilation and Linux component visual baselines.
2. Let real install feedback decide whether another hero variant ([#137]) or
   additional collection browsing controls are useful. Automatic related-post
   recommendations stay a separate, template-owned query; `related-posts` only
   renders the posts it is given.

## Exploring (not committed)

- Lexical inline block installation needs its own verified editor anchor and
  fixtures; it is separate from both Page blocks and article templates.
- Comments require collection ownership, moderation, and spam handling. They
  need a separate design rather than a presentational-component ticket.
- Extend the clean external shadcn delivery check (proven in [#15]) as new
  registry item types are introduced.

## Not Planned

- No pricing tiers, license keys, waitlist funnel, or gated component access.
- No Payload admin/runtime app inside this docs site.
- No broad repo-shape support without a reproducible fixture.

[issues]: https://github.com/Ducksss/payload-components/issues
[gfi]: https://github.com/Ducksss/payload-components/labels/good%20first%20issue
[ufg]: https://github.com/Ducksss/payload-components/labels/up-for-grabs
[#15]: https://github.com/Ducksss/payload-components/issues/15
[#123]: https://github.com/Ducksss/payload-components/issues/123
[#124]: https://github.com/Ducksss/payload-components/issues/124
[#125]: https://github.com/Ducksss/payload-components/issues/125
[#126]: https://github.com/Ducksss/payload-components/issues/126
[#132]: https://github.com/Ducksss/payload-components/issues/132
[#133]: https://github.com/Ducksss/payload-components/issues/133
[#134]: https://github.com/Ducksss/payload-components/issues/134
[#135]: https://github.com/Ducksss/payload-components/issues/135
[#137]: https://github.com/Ducksss/payload-components/issues/137
[#455]: https://github.com/Ducksss/payload-components/issues/455
