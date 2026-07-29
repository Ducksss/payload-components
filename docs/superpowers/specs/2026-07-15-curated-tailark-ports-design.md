# Curated Tailark Ports Design

**Date:** 2026-07-15

**Status:** Approved for implementation planning

**Upstream:** `tailark/blocks` at `8eadeb3389ccccc4bfc4a10bca959c1b39e47b71`

## Objective

Add a deliberately small set of Tailark-derived Payload page blocks that materially expands the
registry. The work is not a Tailark catalog mirror. Every new block must introduce either a missing
landing-page job or a structural/interactive mechanic that cannot be reproduced by lightly restyling
an existing Payload Component.

The approved set is:

| Payload Components slug | Tailark source        | New capability                                      |
| ----------------------- | --------------------- | --------------------------------------------------- |
| `hero-video`            | Dusk `hero-section-5` | Full-bleed, editor-managed video hero               |
| `hero-product-tilt`     | Dusk `hero-section-9` | Perspective product-image hero                      |
| `feature-accordion`     | Dusk `features-12`    | Accordion selection synchronized with media         |
| `feature-cards-media`   | Dusk `features-10`    | Multiple feature cards with individual media        |
| `feature-icon-grid`     | Dusk `features-1`     | Icon cards with a distinctive masked-grid decorator |
| `stats-proof`           | Dusk `stats-4`        | Narrative, prominent metrics, and testimonial proof |
| `contact-routing-form`  | Dusk `contact-2`      | Contact channels plus a functional inquiry form     |

The feature implementations at commit `1b7eaf891582e7021865c4574fa295e2524e3637` on local branch
`claude/keen-shamir-211b4e` are reference material, not merge-ready code. They predate the current
token and component contracts. Forward-port the useful structure and field modeling onto current
`main`; do not merge or cherry-pick the stale branch wholesale.

## Selection rule

A future external port must pass at least two of these tests:

1. It introduces a content job the registry does not already serve.
2. It introduces a new structural or interactive mechanic.
3. Reproducing it from an existing component would require more than a small style change.

Theme-only Mist/Veil/Dusk reskins, alternate border treatments, and rearrangements of the same icon
cards remain out of scope. Authentication pages remain out of scope. Footers remain out of scope
until the CLI has an explicit Global or site-shell installation contract.

## Alternatives considered

### Full upstream parity

Rejected. It would add generic authentication flows, near-duplicate kit reskins, and minor visual
variants whose manifest, documentation, demo, and baseline maintenance cost exceeds their value.

### Visual-showcase-only set

This would ship the two heroes and the three selected feature blocks but omit stats and contact.
It is smaller, but leaves two common landing-site jobs unserved and overweights product-showcase
layouts.

### Curated core set

Approved. Seven blocks provide two substantially different heroes, three non-overlapping feature
mechanics, one proof section, and one real contact section. It broadens the catalog without creating
a Tailark mirror.

## Architectural boundaries

All seven components are standard Payload page blocks installed through the existing five-stage
`payload-components add` pipeline. Each gets source, manifest, registry metadata, collection and
renderer fragments, generated-type/import-map post-install steps, catalog metadata, a demo twin,
documentation, integration coverage, and visual coverage.

The Tailark examples include headers, navigation, logo strips, hardcoded brand SVGs, external image
URLs, and app-specific copy. Those are not part of the port:

- Hero blocks contain only the hero section body. They do not install or render a site header.
- Logo strips are omitted because consumers can compose an existing `logo-cloud-*` block directly
  after a hero.
- Images, video, testimonial logos, and other brand assets are Payload Media uploads.
- Links use the consumer starter's `CMSLink` field and component.
- All colors, radii, tracking, spacing, and typography use the existing portable token contract.
- Blocks preserve `id`, `className`, and `disableInnerContainer` wrapper props.
- Blocks begin at `<h2>` because the consuming page owns its `<h1>`.

The implementation must update `payload-components/PROVENANCE.md` with exact upstream item mappings,
place the Tailark MIT attribution comment in each derived component source file, and add the standard
attribution footer to every new component doc page.

## Component designs

### `hero-video`

`hero-video` is a full-bleed visual hero with readable foreground copy and editor-managed video.
It composes the existing `heroFields` base (`eyebrow`, `title`, `description`, and one or two CTA
links) and appends:

- `video`: required upload to `media`.
- `poster`: required upload to `media`, used before playback and for reduced motion.
- `proofItems`: optional short text labels rendered beneath the CTAs.

Only a resolved video upload whose MIME type begins with `video/` and whose `url` is present may be
passed to the player. The poster is always rendered as the stable fallback. Playback is muted,
looping, and inline. A small client-only media helper uses `useReducedMotion()` from `motion/react`:
reduced-motion users see the poster and no autoplay occurs. If the upload is absent, unresolved, or
not a video, the poster remains visible and the component does not emit a broken `<video>`.

The registry item includes the existing `heroFields.ts`, config, server component, and a
`Video.tsx` client helper. It declares the existing `motion` dependency explicitly.

### `hero-product-tilt`

`hero-product-tilt` is a centered product hero whose uploaded product image sits in a perspective
frame that recedes below the copy. It composes `heroFields` and appends:

- `productImage`: required upload to `media`.
- `imageCaption`: optional plain text used as a visible `<figcaption>`.
- `proofItems`: optional short text labels beneath the CTA row.

The perspective is CSS-only and static. It must not use scroll effects or automatic motion. The
image renders through `Media`, with upload alt text preserved. The perspective frame becomes a
normal, uncropped image card at narrow widths so content is not lost or horizontally scrolled.

### `feature-accordion`

`feature-accordion` composes `featureFields` and appends:

- `items`: required array, 2–6 rows. Each row has required `title` and `description`, optional
  `icon`, and optional `image` upload.
- `links`: optional `linkGroup`, maximum two rows.

The first row is open initially. Selecting a row changes the media panel to that row's image. The
accordion remains keyboard-operable through the shadcn Accordion primitive. The active media change
does not steal focus and uses no automatic animation. When an active row has no image, the panel
shows its selected icon or a neutral placeholder; it never collapses and shifts the page.

This is a client component because active selection is stateful. The demo twin renders the first
row as a static selected state without buttons or headings, preserving the preview contract.

### `feature-cards-media`

`feature-cards-media` composes `featureFields` and appends:

- `items`: required array, 2–4 rows. Each row has required `title` and `description`, optional
  `icon`, and required `image` upload.
- `links`: optional `linkGroup`, maximum two rows.

Cards render in one column on small screens and two columns from the medium breakpoint. Every card
uses the same media aspect ratio and natural card height. This block is retained because it presents
multiple independent visual feature stories; it is not another text-only feature grid.

### `feature-icon-grid`

`feature-icon-grid` composes `featureFields` and appends:

- `items`: required array, 3–6 rows. Each row has required `title`, `description`, and `icon`.
- `links`: optional `linkGroup`, maximum two rows.

Each icon sits inside the distinctive radial masked-grid decorator from the Tailark layout. The
decorator is CSS-only, `aria-hidden`, tokenized, and visually subordinate to the item title. This is
the only icon-card port in the set; muted-card, divided-card, and compact-card variants are excluded.

Reconstruct the stale branch's curated icon mapping as `shared/featureIcons.ts`. All three selected
feature components ship and reuse that file, so icon choices and fallback behavior have one
family-owned implementation rather than duplicated switches.

### `stats-proof`

`stats-proof` is the first dedicated Stats family component. Its fields are:

- `eyebrow`: optional text.
- `title`: required text.
- `description`: required textarea.
- `body`: optional textarea for the supporting narrative.
- `metrics`: required array, 2–4 rows, each with required `value` and `label`.
- `quote`: required textarea.
- `author`: required text.
- `role`: optional text.
- `logo`: optional upload to `media`.

The layout pairs narrative and large metrics with a semantic `<figure>`/`<blockquote>` proof panel.
This differs from `content-stats`, where values are secondary inline facts beneath editorial content.
Metric values remain strings so editors can enter `56%`, `+1,200`, or `22M` without numeric-formatting
logic. The quote logo renders through `Media` and preserves its editor-authored alt text.

Add a `stats` catalog category and matching docs-navigation family. Place it after Testimonials and
before FAQ because it is primarily a proof section.

### `contact-routing-form`

`contact-routing-form` is the first Contact family component. It combines configurable contact
channels with one fixed, accessible inquiry form. Its fields are:

- `eyebrow`: optional text.
- `title`: required text.
- `description`: optional textarea.
- `channels`: required array, 1–4 rows. Each row has required `label`, a required `type` select
  (`email`, `phone`, or `url`), a required `value`, and an optional short description. Validation of
  `value` follows the selected type.
- `formTitle`: required text.
- `formDescription`: optional textarea.
- `formLabels`: a group with editor-configurable labels for name, email, organization, phone, and
  message; every label has a clear English default.
- `submitLabel`: required text.
- `action`: required same-origin POST path validated by `validateSameOriginFormAction`.

The form has a fixed semantic payload: `name`, `email`, `organization`, `phone`, and `message`, plus
an off-screen honeypot. Name, email, and message are required; organization and phone are optional.
Labels are visible and correctly associated. Controls use appropriate input types, input modes, and
autocomplete tokens. The form submits with `method="post"` to the sanitized same-origin action.

At runtime, if `action` cannot be sanitized, the controls remain visible but the submit button is
disabled and a visible configuration message replaces any implication that the form works. This is
defense in depth for legacy or malformed data; the Payload field is required and prevents new invalid
entries. No client-side submission, success fiction, third-party service, or Payload Form Builder
dependency is introduced.

Channels use safe semantic output: `mailto:` for validated email, `tel:` for phone, and HTTPS or
same-origin paths for URLs. Put the channel parsing and validation in a new
`shared/contactUrls.ts` file rather than extending `safeUrls.ts`; consumers that previously installed
the signup CTA may already own an older, intentionally non-overwritten `safeUrls.ts`. Unsafe legacy
values render as text rather than clickable links.

Add a `contact` catalog category and matching docs-navigation family. Place it after Call to action
because it is a conversion endpoint, while leaving the component itself near the end of a composed
page.

## Shared code and dependencies

- Both heroes ship `shared/heroFields.ts`.
- All three features ship `shared/featureFields.ts` and `shared/featureIcons.ts`.
- `hero-video` ships a family-local client helper and depends on `motion` for reduced-motion
  detection.
- `contact-routing-form` ships `shared/safeUrls.ts` for the existing same-origin form-action contract
  and a separate `shared/contactUrls.ts` for channel links.
- Internal shared modules are ordinary registry files, never `registryDependencies`.
- Public shadcn registry dependencies are derived from actual imports and kept to the minimum set.

Installing several variants remains idempotent: a shared file already present in the consumer is not
overwritten, every block gets its own layout and render fragments, and install state records the full
file set for recovery.

## Catalog, documentation, and previews

Each block is added to `componentEntries` in the approved family order and to the flat MDX metadata
list in matching order. `componentCategories`, docs `FAMILIES`, about/catalog counts, CLI known-slug
surfaces, and not-found output remain derived or are synchronized where still hand-maintained.

Every block receives the fixed component doc-page shape:

1. Preview and installed source tabs.
2. Command and manual installation.
3. Data-driven wiring ledger.
4. Complete content-model tables.
5. Data-driven usage.
6. Data-driven requirements.
7. Family siblings when the family contains multiple variants.

Demo twins are `aria-hidden`, contain no headings or interactive controls, and mirror every literal
component class. The video demo is a still poster. The accordion demo fixes the first item open. The
contact demo uses non-interactive visual stand-ins for controls while retaining the same class
literals.

## Error handling and safety

- Missing arrays render no empty wrappers.
- Missing optional media uses a stable neutral placeholder where layout geometry matters.
- Required media that is unresolved at runtime degrades to the fallback described per component.
- External source URLs and hardcoded Tailark assets never ship.
- Form actions are same-origin and sanitized both in Payload validation and at render time.
- Video MIME and URL are checked before playback.
- All automatic media behavior respects reduced motion.
- Link-only images and channel links have accessible names independent of upload alt text.
- Blocks remain safe when generated Payload data contains `null`, unresolved relationship IDs, or
  partially migrated legacy values.

## Verification contract

Implementation is complete only when all seven components satisfy the existing add-a-component
contract and the repository release gate.

Required focused coverage:

- Manifest/registry agreement for every slug and every installed shared/helper file.
- Install, reinstall, state recovery, and fragment verification for every slug.
- Registry dependency derivation for Accordion, Card, Input, Textarea, Button, Media helpers, and
  `motion` where imported.
- Demo/source class-literal parity for all seven blocks.
- Visual-standard tests: semantic colors and named radius/tracking/spacing tokens only.
- Unit-level safety cases for invalid video relationships, reduced motion, unsafe form actions,
  safe channel values, empty arrays, and missing optional media.
- End-to-end component docs, previews, no horizontal overflow, and per-component visual baselines.
- Fresh-consumer installation shards for Payload 3 with supported Next.js 15 and 16 targets.

Final verification commands follow the repository gate documented in `AGENTS.md` and the component
template, including registry build/check, lint, source build, TypeScript, integration tests, full e2e,
production build, and all four clean-room fresh-consumer shards.

## Definition of done

The work is done when all seven slugs install independently and together into a clean supported
consumer, render from editor-managed data, appear in the site catalog and docs with live previews,
carry accurate Tailark provenance, pass the complete local release gate, and have intended visual
baselines. No selected component may ship as a dead form, hardcoded demo, site-header replacement,
theme-only reskin, or undocumented registry item.
