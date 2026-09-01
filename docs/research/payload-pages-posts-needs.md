# Payload Pages / Posts Market Research

Date: 2026-06-16

## Verdict

Payload Kits should not chase generic marketing-section breadth first. The
highest-value catalog is the stuff every Payload website starter eventually needs
in real Pages and Posts authoring:

1. Starter parity: `content`, `media`, `cta`, `archive`, `banner/callout`,
   `code`, `related-posts`.
2. The missing editorial primitive: a safe `embed` / iframe block.
3. Then marketing breadth: FAQ, pricing, testimonials, logos, stats, team,
   forms/newsletter/contact.
4. Then visual variants.

The current repo has two real page blocks (`hero-basic`,
`feature-grid-basic`) and eight planned post presentation components. That is
useful, but it misses the more urgent post need: authoring blocks inside rich
text, not just archive cards around posts.

## Evidence

- Payload's Blocks Field docs position blocks as the core layout-builder
  primitive for quote, CTA, slider, gallery, form-builder, and similar reusable
  structures. They also explicitly recommend separate block config files so the
  same block can be shared between fields and collections:
  https://payloadcms.com/docs/fields/blocks
- The official Payload website template is marketed for websites, blogs, and
  portfolios, and includes layout builder, publication workflow, SEO, search,
  redirects, and live preview. Its public template page says Posts are used for
  blog/news/time-based content and are layout-builder enabled:
  https://vercel.com/templates/cms/payload-website-starter
- The current official Payload template block directory contains:
  `ArchiveBlock`, `Banner`, `CallToAction`, `Code`, `Content`, `Form`,
  `MediaBlock`, and `RelatedPosts`. Its Pages collection wires
  `CallToAction`, `Content`, `MediaBlock`, `Archive`, and `FormBlock`; its Posts
  rich-text editor uses `BlocksFeature` with `Banner`, `Code`, and `MediaBlock`:
  https://github.com/payloadcms/payload/tree/main/templates/website/src/blocks
- User-provided admin screenshots of the current Payload starter match that
  code-level baseline exactly:
  - Pages Add Layout drawer: `Call to Action`, `Content`, `Media Block`,
    `Archive`, `Form Block`.
  - Posts Lexical block menu: `Code`, `Media Block`, `Banner`.
- Payload's live website repo uses a much wider block set: banner, blog content,
  markdown, CTA, callout, card grids, case studies, code, comparison table,
  content grids, download, tabs, form, link grid, logo grid, media, pricing,
  reusable content, slider, statement, steps, and sticky highlights:
  https://github.com/payloadcms/website/tree/main/src/blocks
- Payload's Rich Text docs include upload, relationship, blockquote, horizontal
  rule, toolbar, BlocksFeature, and experimental table support, but no native
  generic embed feature. BlocksFeature is not included by default, so post
  authoring kits must install/wire the exact editor features they rely on:
  https://payloadcms.com/docs/rich-text/official-features
- WordPress Gutenberg's core block list includes media, design, widgets, post
  metadata, `Embed`, `Custom HTML`, `Latest Posts`, `Image`, `Video`, `Table of
  Contents`, `Quote`, and more. That is useful market proof: editors expect
  content primitives and embeds, not only landing-page sections:
  https://developer.wordpress.org/block-editor/reference-guides/core-blocks/
- A Payload community thread asks whether pre-built blocks exist like WordPress
  Gutenberg; an answer says the practical option is boilerplate/copy-paste
  because there is not yet a real pre-built block ecosystem:
  https://www.reddit.com/r/PayloadCMS/comments/1hvwc5y/payload_cms_blocks_are_there_prebuilt_blocks/
- Another Payload community answer describes the exact pain Payload Kits solves:
  create block config/component files, import them into `RenderBlocks.tsx`, and
  register them in the Pages collection:
  https://www.reddit.com/r/PayloadCMS/comments/1hbyf96/has_anyone_built_a_pageblockbuilder/
- Shadcnblocks/Payblocks has already taken the "many shadcn blocks inside
  Payload pages" direction. Their docs frame pages as a hero plus ordered layout
  blocks and tell users that adding a new Payload block means extending
  `Pages/index.ts` and `RenderBlocks.tsx`:
  https://www.shadcnblocks.com/docs/payload/editing-pages
- Tailwind UI and shadcn block marketplaces confirm the common marketing
  categories: hero, features, CTA, pricing, newsletter, stats, testimonials,
  blog, contact, team, content. These are real categories, but they are not the
  whole Payload need:
  https://tailwindcss.com/plus/ui-blocks/marketing
  https://www.shadcn.io/blocks

## What Pages Actually Need

Pages need full-width layout sections with Payload collection wiring:

| Priority | Kit | Why |
| --- | --- | --- |
| P0 | `content-basic` / `content-columns` | Present in starter; every page needs prose, columns, and long-form body sections. |
| P0 | `media-block` / `media-content` | Present in starter; image/video upload, caption, alt/focal-point display. |
| P0 | `cta-basic` | Present in starter and universal marketing need. |
| P0 | `archive-basic` | Present in starter; pages often need post/news/project listing blocks. |
| P0 | `embed-basic` | Missing from starter; fills the obvious iframe gap: YouTube, Vimeo, maps, forms, charts, external widgets. |
| P1 | `form-block` | Present in starter, but heavier because it touches submissions, validation, email/spam behavior. |
| P1 | `banner-callout` | Present in posts, useful on pages too for notices, warnings, promos. |
| P1 | `faq-basic` | Common marketing/content support section. |
| P1 | `pricing-basic` | High-value SaaS/agency section, but not more universal than content/media/embed. |
| P1 | `testimonial-basic`, `logo-cloud`, `stats-band` | Social proof. Good after the core authoring blocks. |
| P2 | hero/feature variants | Variants are cheap after the base exists, but they are less urgent than missing primitives. |

## What Posts Actually Need

Posts need two different things. Keep them separate.

Post authoring blocks, inside Lexical rich text:

| Priority | Kit | Why |
| --- | --- | --- |
| P0 | `code-block` | Present in starter; important for dev/content sites. |
| P0 | `media-block` | Present in starter; posts need image/video with caption. |
| P0 | `banner-callout` | Present in starter; editorial notes, warnings, promos. |
| P0 | `embed-basic` | Missing from starter; editors expect video/maps/forms/social embeds. |
| P1 | `table-basic` / comparison table | Payload table support is experimental; comparison/table blocks are safer. |
| P1 | `download-block` | Common for reports, PDFs, release notes, resources. |
| P1 | `related-posts` | Official template already has this as block/source. |

Post presentation components, around posts:

| Priority | Kit | Why |
| --- | --- | --- |
| P0 | `post-card` | Foundation for every archive/related surface. |
| P0 | `post-archive` | Listing block/page. |
| P1 | `post-hero` | Article header with category, author, date, hero image. |
| P1 | `author-card` | Byline/profile surface. |
| P1 | `related-posts` | Post footer, can reuse `post-card`. |
| P2 | `post-list`, `featured-post`, `share-bar`, `post-toc`, `newsletter-callout` | Useful, but not as fundamental as authoring blocks. |

## Embed / Iframe Block

Build this. Do not build a raw HTML block first.

The fleshed-out product contract lives in
`docs/prds/embed-basic.md`.

`embed-basic` should be a controlled embed block with:

- `url` required.
- `title` required for iframe accessibility.
- `caption` optional.
- `provider` derived or selected: `youtube`, `vimeo`, `googleMaps`, `generic`.
- `aspectRatio`: `16:9`, `4:3`, `1:1`, `auto`.
- `allowFullscreen` default true for video providers.
- `loading="lazy"`.
- URL parsing/normalization for known providers.
- A tiny default allowlist for generic iframe domains, documented as project-owned
  config later.

Skip raw pasted `<iframe>` and arbitrary HTML in the alpha. They create security
and rendering ambiguity, and Payload Kits' promise is "wired source you can
review", not "paste any third-party script into production".

Install modes:

- Page layout mode: block config + component + Pages collection +
  `RenderBlocks.tsx`.
- Post rich-text mode: block config + component + Lexical `BlocksFeature`
  registration for Posts.

That means the installer eventually needs a second target patcher for
`Posts/index.ts` richText features. Build it only when the first rich-text kit
ships; `embed-basic` or `code-block` is the right forcing function.

## Recommended Build Order

Replace the old "pricing/FAQ/testimonial before editor primitives" order with
this:

1. `content-basic`
2. `media-block`
3. `cta-basic`
4. `embed-basic`
5. `banner-callout`
6. `code-block`
7. `archive-basic`
8. `post-card`
9. `post-archive`
10. `post-hero`
11. `author-card`
12. `faq-basic`
13. `pricing-basic`
14. `testimonial-basic`
15. `form-block`

This covers the official starter, the obvious missing embed primitive, the
existing product pitch, and enough post presentation to show the blog story.

## What To Defer

- Raw HTML block: risky and less reviewable than a controlled embed.
- Nav/header/footer chrome: important later, but globals are a different
  installer contract than page/post blocks.
- Lots of hero/feature variants: good demo depth after the primitives land.
- A form-builder wrapper before simpler blocks: forms touch collections,
  submissions, emails, spam, and validation; ship after the installer is trusted.
- One-off fancy animation sections: nice marketplace candy, weak Payload-specific
  value.
