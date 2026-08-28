# RFC 0001 — Installable templates: seeding the curated concept content

- **Status:** Discussion — comment via [GitHub issues](https://github.com/Ducksss/payload-components/issues)
- **Audience:** anyone who has browsed [/templates](https://www.payload-components.xyz/templates) and wondered how much of what they saw they can actually have
- **Decides:** whether the curated copy on the template previews becomes installable, and through which mechanism

## Summary

The fifteen template concepts on `/templates` exist to answer one question with
the community: **should full-site templates become installable?** More of the
answer is already shipped than the question implies — `payload-components
add-template <slug>` installs and wires every block a concept composes, and
`add-template <slug> --demo` writes one operator-run seed script per page that
creates each page as an unpublished draft. What those drafts hold today is each
block's own generic sample content, not the curated concept copy you saw on the
preview.

This RFC proposes closing exactly that gap, and nothing more: carry each
concept's curated, editor-shaped section content into the generated install
contract, and teach the existing template seed scripts to fill blocks with it.
No new verbs, no database access from the CLI, no change to the seed safety
contract, and a deliberately short list of things that will **never** install
(scoped themes, shells, likenesses, media).

## Background — what exists today

Three layers already do most of the work. File pointers are to this repository.

1. **The recipes are already Payload-shaped data.** Every concept in
   `src/lib/templates/<slug>.ts` is pure serializable data. Each section's
   `content` is typed against the demo-content contract
   (`TemplateSectionContentMap` in `src/lib/templates/types.ts`), and those
   types hand-mirror the installed block field contracts. This was a design
   decision made for this RFC's benefit: the curated copy is field data, not
   marketing HTML.

2. **The install contract is generated and drift-gated.**
   `pnpm templates:build` generates `payload-components/templates/<slug>.json`
   from the site-side definitions — today carrying the block set and the page
   plan (which blocks, which pages, in which order), with
   `tests/int/template-install-manifests.int.spec.ts` failing the gate on any
   drift. Curated section content is deliberately **not** in the manifest yet.

3. **Template seeding already exists, with a strong safety contract.**
   `add-template <slug> --demo` (`tools/payload-components/seed/template-seed.ts`)
   writes one version-marked seed script per template page, reusing the same
   machinery as single-component seeds: a private high-entropy ownership record
   per page (`template:<slug>:<pageKey>`, versioned by the template `revision`),
   operation-token journalling before every create, adopt-or-refuse reconcile
   after interruption, drafts only — the scripts never publish — and the CLI
   itself never opens a database; the operator runs the script. Blocks are
   filled from each component manifest's `sampleContent`.

The gap: the drafts a user gets are structurally identical to the preview but
read like the catalog ("Acme gives product teams hosted dashboards…"), not like
Tansy, Halloran & Sons, or Marleford District Council. Users who came from a
concept preview asked for the concept.

## Proposal

### Phase 1 — curated content in the contract, consumed by the existing seeds

1. **Extend the generated manifest.** `templates:build` additionally emits each
   page's per-section curated content into the install contract — either inline
   under `pages[].sections[]` in `payload-components/templates/<slug>.json`, or
   as a sibling `<slug>.content.json` if manifest size becomes a review burden.
   Same generator, same drift gate, same single source of truth
   (`src/lib/templates/<slug>.ts`). Nothing is hand-maintained twice.

2. **Add per-block content adapters.** Recipe content is _editor-shaped_ but
   slightly narrower than the block field contract — the demo twins have no
   URLs and no Media, so, for example, a recipe link is
   `{ appearance, label }` while the block field is
   `{ type, newTab, url, label, appearance }`. Each block that templates may
   compose gets a small adapter that widens recipe content to seed data with
   explicit defaults (`type: 'custom'`, `newTab: false`, `url: '#'`; media
   fields left unset so the block renders its media-less variant). Adapters
   live beside the manifests, are enumerated, and are covered by an int spec
   that runs every shipped template's every section through its adapter and
   validates the result against the block config — the same "the gate compiles
   what ships" philosophy as `payload-components-source-compiles.int.spec.ts`.

3. **Point the template seed scripts at the curated content.** When the
   template manifest carries content for a page, the generated script seeds it;
   when it does not (or a section's adapter reports the block cannot represent
   it), the script falls back to that block's `sampleContent` and says so in
   its output. Everything else about seeding is unchanged: one draft page per
   concept page, ownership records versioned by template `revision`, tokens,
   reconcile, never publish, never delete.

4. **CLI surface.** No new verb. `add-template <slug> --demo` simply starts
   producing the concept's copy instead of the generic copy — that is what the
   flag always promised in spirit. The plan output states per page whether
   curated content or sample content will seed.

### Phase 2 — internal link wiring (deferred until Phase 1 has users)

Recipe CTAs carry labels but no URLs, while the concepts' shells navigate
between the concept's own pages. Phase 2 would let adapters resolve a declared
subset of CTA labels to the sibling seeded drafts (Payload `reference` links to
the pages the other scripts created), making the seeded site navigable the way
the preview is. Deferred because it introduces cross-script ordering and
reference resolution that Phase 1 does not need, and because label→route
mapping is currently implicit in each concept's fiction rather than declared
data. If Phase 1 sees real use, the mapping becomes an explicit field on
`TemplateSection` first.

## What deliberately does NOT install — ever

Setting this expectation is half the point of the concepts page, so the RFC
states it plainly:

- **The scoped theme and the shell.** A concept's look — Tansy's candlelight,
  Trestle's kraft-and-spruce, Marleford's front desk — is site-side art
  direction: a scoped CSS skin over the same twins, plus a bespoke header and
  footer. What installs is the blocks and the copy, rendered on **your**
  project's design tokens. The preview shows what the blocks can carry, not a
  paint job you can download into a different design system.
- **Media and likenesses.** The concepts ship zero raster assets by design
  (every image surface is token-derived), so there is nothing to copy and no
  invented person to import. Seeded blocks render their media-less variants
  until you upload your own.
- **The fiction as your content.** Seeds are drafts, named as demos, owned by
  reversible records. Tansy's menu is a starting point to overwrite, not a
  restaurant you should publish.

## Alternatives considered

- **Full project starters (a repo per template).** Rejected: it abandons the
  composable, wired-into-_your_-repo model that is the product, and fifteen
  starters would rot at fifteen different speeds.
- **CLI-side database import (REST/Local API from the CLI process).** Rejected:
  the CLI never opens a database — the operator-run script model exists so a
  human runs content creation inside their own project, with their own env, and
  can read the script first. Nothing in this RFC weakens that.
- **Copy the curated content into every component's `sampleContent`.** Rejected:
  sample content is per-block and catalog-voiced on purpose; template copy is
  per-concept and would turn 41 manifests into a matrix.

## Open questions for the community

1. Inline `sections[].content` in the template manifest, or a sibling
   `<slug>.content.json`? (Inline keeps one file per template; sibling keeps
   the install-plan manifest small enough to read in a PR.)
2. Should curated seeding be the `--demo` default (proposed) or a separate
   `--concept` flag with `--demo` keeping generic samples?
3. Is Phase 2's internal link wiring worth an explicit
   `TemplateSection.linkTargets` field on the site-side contract, or should
   seeded CTAs simply stay `#` until edited?
4. Which concept would you actually seed? Naming it in an issue is the
   strongest GO signal this RFC can get.

## Decision criteria

This ships when the discussion produces more "I would use this on a real
project" than "the drafts I already get are enough" — measured in issues, not
analytics; the templates surface deliberately captures nothing. Absent
engagement, the honest default is to keep the current behaviour and close this
RFC as _not now_: the concepts remain valuable as proof of the catalog's range
either way.
