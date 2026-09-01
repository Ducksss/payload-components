# Full-Site Template Showcases

## Product requirements and execution plan

- **Status:** Proposed
- **Date:** 2026-07-21
- **Immediate release:** Website-only visual showcase
- **Distribution status:** Not installable in this phase

## Executive decision

Build a first-class **Templates** surface in this repository and on the existing
Payload Components website.

The first release is a visual product, not a CLI product:

- `/templates` presents complete site concepts.
- Each concept has an indexable detail page.
- Each concept has five complete, scrollable preview pages with working internal
  navigation.
- The launch set contains one SaaS marketing website and one agency website.
- Every page is composed from existing Payload Components preview twins, with a
  coherent template-owned shell, theme, content, rhythm, and art direction.
- Every public surface labels the work **Concept preview** and says that a
  template installer does not exist yet.
- No registry, manifest, CLI, install state, database, or Payload runtime change
  is part of this release.

Keep this work in the current repository. A second repository is justified only
if a later phase needs a real Payload-backed consumer deployment or an
opinionated cloneable application starter. The canonical gallery remains on this
site either way.

This sequence validates the valuable part first: whether complete, beautiful
outcomes make the block library dramatically easier to understand and want.

## The product idea

Payload Components currently answers:

> Give me a well-built section and wire it into my Payload project.

Templates answer a different, higher-level question:

> Show me a complete website I can imagine launching.

The individual block catalog is useful to developers who already know how to
choose variants, establish a visual system, structure five pages, write coherent
sample content, and assemble the result. Many visitors do not want to do that
work before they can see whether the result is compelling.

A full-site showcase turns the catalog from a box of parts into an outcome. It
also creates a clean demand test for a future installer without prematurely
committing to hard problems such as multi-page database ownership, asset
uploading, global navigation replacement, collision handling, and rollback.

Recommended positioning:

> Complete site concepts composed from open-source Payload blocks. Explore every
> page, inspect the recipe, and help decide whether an installer should come next.

This remains community-first. There is no price, license key, waitlist, gated
download, early-access funnel, or fictitious install count.

## Why this belongs here

The current repository already owns every dependency needed for a convincing
visual proof:

- The public Next.js site, routing, metadata, sitemap, OG, analytics, and
  responsive shell live under `src/`.
- The component catalog already has 65 parameterized, site-safe demo twins in
  `src/components/site/demos/`.
- The twins accept bespoke content from `src/lib/demo-content.ts` and mirror the
  installable components' class literals under test.
- A chrome-free, statically generated iframe preview pattern already exists at
  `src/app/components/preview/[slug]/page.tsx`.
- `src/components/site/ComponentPreviewFrame.tsx` already proves that real iframe
  widths—not CSS-scaled divs—are required for responsive breakpoints to reflow.
- The repository already has Playwright visual, overflow, reduced-motion,
  accessibility, GEO, and release-gate coverage.

The architecture boundary is equally important: installable Payload target code
under `payload-components/source/` must not be imported into this docs site, and
the site must not acquire a database, admin panel, or `PAYLOAD_SECRET`.

External product patterns reinforce the direction:

- Payload's official Website Template already provides a full project foundation
  and layout-builder model; Payload Components does not need to reproduce that
  foundation merely to prove a visual concept:
  <https://payloadcms.com/get-started>
- Payload's live-preview product itself uses responsive iframe previews, which is
  consistent with the proposed detail-page experience:
  <https://payloadcms.com/docs/live-preview>
- shadcn presents blocks with outcome-first, full-screen previews while keeping
  implementation evidence nearby:
  <https://ui.shadcn.com/docs/_blocks>

## Repository decision

### Decision: same repository for the showcase

The catalog, detail pages, visual preview runtime, metadata, screenshots, tests,
and analytics all live here.

Creating another repository now would:

- split discovery from the existing component catalog;
- duplicate theme tokens, preview components, content, SEO, and test machinery;
- make drift between showcased sections and actual components more likely;
- introduce deployment and versioning work before it produces user value; and
- weaken the story that a full site is composed from the open block registry.

### Later split trigger

Create a separate consumer or starter repository only if one of these becomes a
real requirement:

- previews must run a real Payload admin and database;
- visitors must edit content through Payload Live Preview;
- the result becomes a cloneable complete application with its own collections,
  authentication, infrastructure, or deployment lifecycle; or
- an external clean-room project is needed to prove the installer end to end.

Do not turn this Fumadocs site into a Payload runtime. If a live consumer exists
later, this site continues to own `/templates` and embeds or links to that
consumer.

## Product hypothesis

If visitors can browse two distinctive, credible, multi-page websites built from
the existing block language, then:

1. New visitors will understand the end result faster than they do from isolated
   component cards.
2. More visitors will explore multiple components because the template exposes a
   meaningful recipe.
3. Real requests for installation will contain better information: desired
   project shape, pages, assets, globals, and collision expectations.
4. The team can decide whether the next product should augment an existing
   Payload website or scaffold a complete new one.

## Users and jobs to be done

### Indie SaaS builder

**Job:** “Show me a credible SaaS marketing site I could customize instead of
designing from zero.”

They evaluate the outcome first and then look for product, pricing, company, and
contact coverage.

### Agency developer

**Job:** “Give me a proven multi-page composition I can restyle, own, and hand to
editors.”

They care about differentiated art direction, repeatable structure, transparent
source, and the absence of opaque generated code.

### Payload evaluator

**Job:** “Show me how Payload page blocks add up to a real site.”

They understand Next.js but may not yet understand what the block registry makes
possible.

### Community designer or contributor

**Job:** “Give me a concrete site and recipe I can improve through a public
contribution.”

They need a documented composition and public feedback path, not a closed
marketplace.

### Content editor

**Job:** “Show me that the page structure is made from ordinary editor-shaped
content rather than one hard-coded screenshot.”

This persona is secondary in the concept phase but becomes central if an
installer ships.

## Goals

1. Make Templates a first-class navigation destination.
2. Ship two visibly different full-site concepts.
3. Ship five complete pages per concept—ten pages total.
4. Let visitors scroll each page at desktop, tablet, and mobile widths.
5. Make internal template navigation work through shareable URLs.
6. Show the exact existing block recipe behind every page.
7. Preserve a serializable composition model that can inform a later installer
   RFC.
8. Instrument genuine template engagement without collecting PII.
9. Keep the site fast by using static poster images in the gallery and loading
   only one live preview on a detail page.
10. Preserve every current site, registry, and CLI contract.

## Non-goals

- No CLI template command.
- No template registry item or template manifest in `payload-components/`.
- No automatic or operator-run database seeding.
- No Payload admin, database, collection, global, preview secret, or environment
  variable in the docs site.
- No downloadable zip, GitHub clone button, or one-click deploy.
- No claim that a concept is production-ready or installable.
- No working SaaS application, dashboard, authentication, billing, or account
  area. “SaaS” means a SaaS **marketing website**.
- No dynamic agency Projects collection. The Work page is a curated marketing
  concept.
- No functioning contact or newsletter submission. Preview forms collect
  nothing.
- No visual site builder, theme customizer, or AI generation flow.
- No search or complex filters while the gallery contains only two items.
- No paid tiers, marketplace commission, license keys, waitlist, or sales funnel.
- No weakening of the existing demo-twin accessibility and class-fidelity
  contract.

## Public status language

Use one status everywhere:

> **Concept preview**

Required availability copy on every template detail page:

> This is a browsable full-site concept, not an installable template yet. Every
> section is composed from blocks in the open registry.

Rules:

- Do not show an install command.
- Do not say “download,” “use this template,” “one click,” or “coming soon.”
- Do not add an email capture.
- Use “Open full preview,” “Explore the pages,” and “Browse the block recipe” as
  actions.
- A public contribution or discussion link is acceptable; it must not masquerade
  as an availability promise.

## Launch inventory

The launch definition of done is two concepts with five routes each. A
three-page vertical slice is useful during implementation, but it is not the
public completion bar.

| Concept | Fictional brand | Direction | Routes |
| --- | --- | --- | --- |
| SaaS Launch | Relay | Precise, optimistic, product-led | Home, Product, Pricing, About, Contact |
| Agency Studio | Northline | Editorial, warm, portfolio-led | Home, Services, Work, About, Contact |

The fictional brands are working names. They may change during art direction,
but the stable public slugs remain `saas-launch` and `agency-studio`.

## Information architecture

```text
/templates
/templates/saas-launch
/templates/agency-studio
/templates/saas-launch/preview
/templates/saas-launch/preview/product
/templates/saas-launch/preview/pricing
/templates/saas-launch/preview/about
/templates/saas-launch/preview/contact
/templates/agency-studio/preview
/templates/agency-studio/preview/services
/templates/agency-studio/preview/work
/templates/agency-studio/preview/about
/templates/agency-studio/preview/contact
```

Routing rules:

- `/templates` and `/templates/[slug]` are indexable and canonical.
- Preview routes are shareable but `noindex, nofollow`.
- The home preview uses the route without an extra `/home` segment.
- Preview routes render no Payload Components `SiteHeader` or `SiteFooter`.
- Preview routes render the fictional template's own header and footer.
- Internal preview navigation changes the nested preview URL and preserves normal
  browser back/forward behavior.
- Unknown template and page slugs return `notFound()`.
- The sitemap and LLM surfaces include the catalog and detail pages and exclude
  raw preview routes.

## Gallery requirements

`/templates` is an editorial gallery, not another dense component browser.

Required content:

1. H1 explaining the difference between blocks and full-site concepts.
2. A concise, explicit concept-preview disclosure.
3. Two large template cards.
4. A community contribution close.

Each card shows:

- a deterministic, local poster image generated from the Home preview;
- title and vertical;
- one-sentence positioning;
- visual-tone tags;
- page count and unique block count;
- the **Concept preview** badge;
- `Explore template` as the primary action; and
- `Open full preview` as the secondary action.

Performance requirements:

- Do not mount live iframes in the gallery.
- Poster images use `next/image`, explicit dimensions, responsive sizes, and
  lazy loading below the fold.
- Every poster is local, reproducible, and covered by an asset invariant test.
- A card poster should target 250 KB or less. Any exception requires an explicit
  visual-quality justification in review.

Filtering is deferred until there are at least six public concepts. The data
model may include filterable metadata now, but no empty filter chrome should be
rendered.

## Template detail requirements

`/templates/[slug]` is the accessible, indexable source of truth for a concept.

Content order:

1. Title, one-sentence positioning, vertical, visual-tone tags, page count, and
   **Concept preview** status.
2. A large interactive preview frame initially showing Home.
3. Page switcher for all five routes.
4. Desktop, tablet, and mobile viewport controls.
5. `Open full preview` action.
6. Pages-included grid with a local screenshot and purpose for every page.
7. Ordered block recipe, grouped by page, with every block linked to its existing
   component documentation.
8. Visual-system summary: palette, typography direction, radius, and media style.
9. Required availability disclosure.
10. Public contribution and discussion links.

The preview frame:

- uses a same-origin iframe;
- uses real widths of responsive, 768 px, and 390 px so media queries reflow;
- has a fixed visible height around `min(75vh, 900px)` and lets the document
  inside scroll naturally;
- has an accessible title containing the template and page name;
- loads only the selected page;
- exposes the current viewport with `aria-pressed` controls;
- retains route and viewport state when practical; and
- never CSS-scales a desktop page to pretend it is mobile.

## Full-preview requirements

The nested preview route is the core visual validation surface.

It must provide:

- a complete scroll from template header through page sections to footer;
- a template-owned responsive header, real internal page navigation, active
  state, and keyboard-operable mobile menu;
- direct URLs for every page;
- a small, unobtrusive way back to the template detail page;
- a scoped visual theme that cannot leak into the main website;
- local assets only;
- no autoplay audio;
- reduced-motion behavior for all optional animation;
- no dead `#` links;
- no data submission; and
- no duplicate site analytics initialization inside detail-page iframes.

### Accessibility model for concept previews

The existing component demo twins intentionally stay `aria-hidden`, contain no
headings, and contain no focusable controls. Do not remove that contract just to
make the showcase possible.

For this concept phase:

- the template header, page navigation, preview exit action, and template footer
  are real semantic UI;
- each preview page includes one screen-reader H1 and a concise summary of the
  visual composition;
- the composed visual canvas is described as a visual concept and remains
  presentational;
- the indexable detail page exposes the full page list and block recipe in
  semantic, accessible content; and
- visible CTA and form stand-ins inside twins remain non-interactive, so the
  preview never contains fake focus targets or collects data.

If the product later requires a semantically complete live website, render it in
a real external consumer project or perform a separately scoped shared-view
refactor. Do not create a second hand-maintained copy of every target block in
this phase.

## Art direction

The templates must not look like the same component stack with a different
accent color. They need distinct content, route rhythm, shell, palette,
typographic treatment, media treatment, spacing, and block choices.

### SaaS Launch — Relay

- **Product:** A fictional B2B analytics platform.
- **Tone:** Precise, fast, trustworthy, technically literate.
- **Visual direction:** Cool white and soft blue-gray surfaces, one vivid cobalt
  or electric green accent, dense product illustrations, measured radii, concise
  copy, and proof close to the product claim.
- **Primary conversion:** Start a trial / talk to sales, represented visually
  only.

Page recipes:

| Page | Purpose | Ordered block recipe |
| --- | --- | --- |
| Home | Explain product, proof, platform breadth, and conversion | `hero-product-tilt`, `logo-cloud-marquee`, `feature-bento`, `stats-proof`, `integration-cluster`, `testimonials-spotlight`, `pricing-cards-muted`, `faq-split`, `call-to-action-boxed` |
| Product | Explain core workflows and infrastructure | `hero-basic`, `feature-split`, `feature-cards-media`, `feature-steps`, `integration-grid`, `content-quote`, `call-to-action-centered` |
| Pricing | Make packaging legible and resolve objections | `hero-basic`, `pricing-cards`, `comparator-table`, `testimonials-rating`, `faq-grouped`, `call-to-action-signup` |
| About | Establish mission, scale, team, and community | `hero-basic`, `content-image-lead`, `content-stats`, `team-grid`, `content-community`, `call-to-action-boxed` |
| Contact | Route sales and product questions | `hero-basic`, `contact-routing-form`, `faq-card` |

### Agency Studio — Northline

- **Product:** A fictional brand and digital-product studio.
- **Tone:** Editorial, direct, cultured, confident without agency jargon.
- **Visual direction:** Warm paper surfaces, ink foreground, restrained rust or
  ultramarine accent, larger type, sharper composition, cinematic image crops,
  fewer cards, and more deliberate negative space.
- **Primary conversion:** Start a project, represented visually only.

Page recipes:

| Page | Purpose | Ordered block recipe |
| --- | --- | --- |
| Home | State the point of view, show selected work, proof, and people | `hero-video`, `logo-cloud-inline-wrap`, `content-showcase`, `feature-split`, `stats-proof`, `testimonials-quote`, `team-roster`, `call-to-action-centered` |
| Services | Explain offers, method, deliverables, and common questions | `hero-basic`, `content-columns`, `feature-icon-grid`, `feature-steps`, `feature-cards-media`, `faq-accordion`, `call-to-action-boxed` |
| Work | Present a curated portfolio narrative and client proof | `hero-basic`, `content-image-frame`, `content-rows`, `content-feature-split`, `testimonials-wall`, `call-to-action-centered` |
| About | Explain philosophy, team, history, and community | `hero-basic`, `content-image-lead`, `content-quote`, `content-stats`, `team-roster`, `content-community`, `call-to-action-boxed` |
| Contact | Explain fit and collect no actual data | `hero-basic`, `contact-routing-form`, `faq-split` |

Art-direction agents may substitute a variant when it materially improves the
page, but they must preserve the page's job, update the declared recipe, and use
an existing component slug with a registered demo twin.

## Content and asset requirements

Each concept receives one coherent fictional brand brief and route-spanning
narrative.

Content rules:

- No lorem ipsum.
- Do not reuse the catalog's default Acme content as the finished template copy.
- No real customer logos unless permission and provenance are documented.
- No invented endorsement may look like a real customer's statement.
- Fictional testimonials and metrics are clearly identified as illustrative on
  the detail page.
- CTA labels must correspond to an included route or remain a visibly
  non-interactive preview treatment.
- Copy lives in typed content data, not scattered through layout markup.
- Content shapes remain close to the editor-managed fields of the referenced
  blocks so a later installer can reuse the work.

Asset rules:

- All runtime assets are local; no hotlinked images, videos, or fonts.
- Each template has `public/templates/<slug>/PROVENANCE.md`.
- Every asset record includes path, source or generation method, license, creator
  when applicable, and human-readable alt text.
- Generated or original abstract artwork is preferred over questionable stock
  imagery.
- Images have explicit intrinsic dimensions and optimized output formats.
- Posters are regenerated by a deterministic Playwright capture tool.
- Preview assets must not imply real customer relationships.

## Technical architecture

### Proposed file layout

```text
src/app/templates/
  page.tsx
  [slug]/
    page.tsx
    preview/
      [[...page]]/
        page.tsx

src/components/site/templates/
  TemplateCard.tsx
  TemplateCatalog.tsx
  TemplateDetailPreview.tsx
  TemplatePreviewFrame.tsx
  TemplateRecipe.tsx
  TemplateRenderer.tsx
  TemplateVisualCanvas.tsx
  shared/
    TemplatePreviewExit.tsx
    TemplatePreviewViewportControls.tsx
  saas-launch/
    Shell.tsx
    theme.css
  agency-studio/
    Shell.tsx
    theme.css

src/lib/templates/
  types.ts
  registry.ts
  saas-launch.ts
  agency-studio.ts

src/lib/site.ts
  template catalog and detail-page product copy only

public/templates/
  saas-launch/
    PROVENANCE.md
    ...assets and generated posters
  agency-studio/
    PROVENANCE.md
    ...assets and generated posters

tools/templates/
  capture.ts

tests/int/
  template-showcases.int.spec.ts

tests/e2e/
  templates.e2e.spec.ts
  templates-visual.e2e.spec.ts
```

Public product copy and template catalog metadata remain in `src/lib/site.ts`,
consistent with the repository contract. The large body of fictional preview
content may live in `src/lib/templates/<slug>.ts`, analogous to the existing
separation in `src/lib/demo-content.ts`.

### Serializable showcase contract

The concept data must be serializable and independent of React component
instances:

```ts
type TemplateStatus = 'concept'
type TemplateCategory = 'agency' | 'saas'

type TemplateAsset = {
  alt: string
  height: number
  license: string
  path: string
  provenance: string
  width: number
}

type TemplateSection = {
  componentSlug: string
  content: Record<string, unknown>
  id: string
  tone?: 'base' | 'contrast' | 'muted'
}

type TemplatePage = {
  description: string
  label: string
  path: '' | string
  sections: readonly TemplateSection[]
  title: string
}

type TemplateShowcase = {
  assets: readonly TemplateAsset[]
  category: TemplateCategory
  description: string
  navigation: readonly { label: string; path: string }[]
  pages: readonly TemplatePage[]
  revision: number
  schemaVersion: 1
  slug: string
  status: TemplateStatus
  summary: string
  theme: {
    description: string
    id: string
    swatches: readonly string[]
  }
  title: string
  visualTone: readonly string[]
}
```

Implementation may make `TemplateSection` a discriminated union for the exact
block slugs used at launch so each `content` value is checked against its
`src/lib/demo-content.ts` type. Do not leave the final implementation as an
unchecked `Record<string, unknown>` if a safe union is practical.

Required invariants:

- template slugs are unique and URL-safe;
- `schemaVersion` is `1`, `revision` is positive, and status is `concept`;
- every template has exactly one home page with `path: ''`;
- page paths and section IDs are unique within their scopes;
- every navigation path resolves to a declared page;
- every section component exists in `componentEntries` and `demosBySlug`;
- every section content value satisfies its preview twin's supported shape;
- every referenced asset exists beneath the template's public asset root;
- every asset has provenance, license, dimensions, and alt text;
- every gallery poster exists and its revision matches the definition;
- scoped theme IDs are unique; and
- concept status makes rendering install UI impossible by type, not merely by
  convention.

### Rendering model

`TemplateRenderer` receives a template and page definition, maps each exact
component slug to its existing site demo twin, and passes the page's bespoke
content.

Template-owned code is responsible for:

- header, footer, and internal navigation;
- page-level spacing and section rhythm;
- surface sequencing and scoped CSS variables;
- template-specific decorative artwork;
- route-aware active states; and
- the accessible description surrounding the presentational visual canvas.

The renderer must never import from:

- `payload-components/source/`;
- `payload-components/manifests/` at runtime;
- `@/payload-types`;
- Payload itself; or
- consumer-only modules such as `@/components/Media` and `@/components/Link`.

Do not mutate demo twins to make two stacks look better. If an existing block's
outer frame or spacing makes a page composition awkward, record that as real
evidence for a future structural component variant.

### Theme isolation

Each template root has a stable data attribute, for example:

```html
<div data-template-theme="saas-launch">...</div>
```

Theme CSS is scoped beneath that root and overrides semantic variables consumed
by the twins. It may define template-specific variables but must not alter
`:root`, `.dark`, the docs theme, or another template.

Requirements:

- The site remains forced light; do not add `.dark` variants.
- A template may contain intentionally dark sections using named surface tokens.
- Colors, radii, spacing, tracking, and typography use named tokens rather than
  arbitrary utility values.
- Template theme leakage is covered by a test that renders the template next to
  an ordinary site component.
- Creative agents own only their scoped theme files. They do not edit
  `src/app/globals.css` in parallel.

### Analytics

Use the existing anonymous analytics layer and add:

- `template_gallery_view`
- `template_detail_view`
- `template_preview_open`
- `template_preview_page_change`
- `template_preview_viewport_change`
- `template_recipe_click`
- `template_contribution_click`
- scroll milestones at 25%, 50%, 75%, and 90% for direct full previews

Allowed properties:

- template slug;
- template revision;
- page slug;
- source surface (`gallery`, `detail`, or `preview`); and
- viewport preset.

No page content, free text, form values, email, or other PII is captured.

The analytics shell must recognize raw preview routes so an iframe on a detail
page does not initialize a second general pageview stream. Custom parent/detail
events remain sufficient for embedded previews. Directly opened previews may
emit the explicitly defined preview event without duplicating ordinary site
analytics.

### SEO and discovery

- Add Templates to `SiteHeader`, the mobile navigation, and the appropriate
  footer column.
- Add `/templates` and both detail pages to the sitemap.
- Add catalog and detail content to LLM/GEO surfaces.
- Add CollectionPage-style structured data for the catalog and CreativeWork or
  equivalent factual metadata for each concept.
- Give each detail page canonical metadata and a local OG image.
- Give every raw preview route `robots: { index: false, follow: false }`.
- Do not include raw preview URLs in the sitemap or LLM content.
- Never use “installable” in concept structured data.

## Functional requirements

| ID | Requirement |
| --- | --- |
| FR-1 | A Templates item appears in desktop and mobile site navigation and has a correct active state. |
| FR-2 | `/templates` renders both concepts from canonical metadata. |
| FR-3 | Every gallery card links to a detail page and a direct full preview. |
| FR-4 | Every detail page shows five pages, a working page switcher, and a responsive iframe. |
| FR-5 | Every full-preview URL renders the correct template shell and page composition. |
| FR-6 | Template navigation uses real URLs and browser history. |
| FR-7 | Every detail page lists the exact ordered block recipe with working component-doc links. |
| FR-8 | Concept status and non-installability copy appear on the catalog card and detail page. |
| FR-9 | No concept surface renders an install command, waitlist, price, or lead form. |
| FR-10 | Unknown template and page slugs return 404. |
| FR-11 | Gallery and page posters are deterministic local assets with provenance. |
| FR-12 | Preview contact and signup treatments submit nothing and collect nothing. |
| FR-13 | Preview routes are noindex and excluded from sitemap/LLM surfaces. |
| FR-14 | Every section references a current component slug with a registered demo twin. |
| FR-15 | No site runtime imports Payload target code. |

## Quality requirements

### Responsive and visual

- Every one of the ten preview pages is covered at 1280 px and 390 px.
- Representative detail-frame behavior is also covered at 768 px.
- No catalog, detail, or preview route has horizontal overflow.
- The iframe document itself has no horizontal overflow.
- Header menus, text, cards, posters, and exit controls do not clip or overlap.
- The two concepts are visually recognizable without reading their titles.
- Existing component visual baselines remain unchanged.
- Template baselines live in a separate `templates-visual` suite.

### Accessibility

- Catalog and detail pages pass the existing serious/critical axe gate.
- Template shell navigation and mobile menus are keyboard operable.
- Every indexable page has one visible H1 and a valid heading structure.
- Every full preview has one accessible page name and composition summary.
- Iframes have unique, descriptive titles.
- Viewport buttons expose label and pressed state.
- Focus is never trapped in the iframe or mobile menu.
- Color contrast meets WCAG AA on the scoped themes.
- Reduced-motion mode exposes the final visual state without waiting.

### Performance

- The gallery mounts zero iframes.
- A detail page mounts one iframe.
- Poster assets meet the target budget or document an exception.
- Preview pages use no runtime remote assets.
- Template bundles are route-scoped; visiting `/templates` must not hydrate all
  ten preview page assemblies.
- Animation uses transform/opacity where possible and stops under reduced
  motion.

### Reliability

- Static params cover every template and page.
- Route definitions, navigation, recipe metadata, and posters cannot drift
  silently.
- Intentional visual changes bump the template `revision` and regenerate
  posters/baselines.
- A normal git revert removes the feature cleanly; no consumer, database, or
  install state exists to roll back.

## Test plan

### Integration tests

Add `tests/int/template-showcases.int.spec.ts` with these checks:

- definitions validate against the typed contract;
- template and page slugs are unique;
- one home page exists per template;
- navigation targets resolve;
- component slugs exist in `componentEntries` and `demosBySlug`;
- every page contains a deliberate, non-empty recipe;
- every asset and poster exists and has provenance;
- every status is concept-only;
- neither the template runtime nor routes import target code or Payload;
- theme selectors are scoped;
- public status copy contains no install claim; and
- catalog metadata, static params, and detail routes stay synchronized.

### Functional Playwright tests

Add `tests/e2e/templates.e2e.spec.ts` covering:

- gallery metadata, H1, cards, status labels, and links;
- detail metadata, page inventory, recipes, and component links;
- page switching updates iframe source and full-preview action;
- viewport controls create real 390/768/responsive iframe widths;
- full-preview internal navigation and browser back/forward;
- direct page URLs and 404 behavior;
- mobile template menu keyboard behavior;
- concept disclosure and absence of install UI;
- no duplicate preview analytics initialization;
- reduced motion;
- catalog/detail/preview horizontal overflow; and
- serious/critical axe coverage for gallery, detail, and template shell.

### Visual Playwright tests

Add `tests/e2e/templates-visual.e2e.spec.ts`:

- one desktop and one mobile full-page baseline for every template page;
- deterministic font readiness and reduced-motion setup before capture;
- a coverage guard that fails once platform baselines exist and a page is
  missing;
- a focused command in `tools/run-e2e.ts` so the suite can run independently;
  and
- Linux baselines minted through the existing visual-baseline workflow.

Generated gallery posters are marketing assets, not a replacement for regression
baselines. The capture tool and invariant test guarantee poster coverage; the
visual suite protects runtime composition.

### GEO and release coverage

Extend existing GEO assertions so:

- catalog and detail pages appear where public site content is enumerated;
- preview routes stay excluded and noindex; and
- template copy is explicit that concepts are not installable.

Run focused tests while iterating, then the repository release gate:

```bash
pnpm lint
pnpm source:build
pnpm exec tsc --noEmit
pnpm test:registry
pnpm run test:int
pnpm run test:e2e
pnpm build
```

`pnpm test:fresh` does not need new coverage in this website-only phase because
the distribution contract does not change.

## Success metrics and installer decision gate

Primary signals:

- template-gallery to detail-page conversion;
- detail-page to full-preview conversion;
- percentage of preview sessions that visit a second page;
- average pages viewed per preview session;
- 75% and 90% scroll completion;
- block-recipe click-through; and
- substantive public requests for installation or improvements.

Suggested gate for writing the installer RFC, evaluated after at least 100 unique
template detail sessions:

- at least 35% open a full preview;
- at least 25% of preview sessions visit a second page;
- at least 8% click a block recipe or public contribution/install-interest
  action; and
- at least five substantive public requests describe how an installable kit
  would be used.

These are learning thresholds, not marketing targets. If traffic volume is too
small for the percentages to be meaningful, qualitative issue/discussion detail
takes precedence over raw counts.

Quality gates are absolute:

- all ten pages pass desktop and mobile visual coverage;
- all routes pass no-overflow and link checks;
- representative routes pass the axe gate;
- the gallery stays within its poster and iframe budgets; and
- existing site, component, registry, CLI, and release tests stay green.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Visitors assume the concept can be installed | Persistent Concept preview status, explicit disclosure, and no install command or CTA |
| The result looks like unrelated component cards | Template-owned art direction, shell, scoped theme, page rhythm, bespoke content, and design review |
| Both templates look identical | Opposed creative briefs and a review requirement that identity is recognizable without labels |
| Demo twins are mistaken for functioning controls | Keep them presentational; make shell navigation real; disclose that this is a visual concept |
| Preview drifts from the block catalog | Exact component slugs, class-fidelity twins, typed recipes, and invariant tests |
| Theme styles leak into the docs site | Per-template root scope and no parallel global CSS edits |
| Gallery performance collapses | Static local posters on gallery; one iframe only on detail |
| Tall screenshots become flaky | Font readiness, reduced motion, local assets, isolated visual suite, and revisioned captures |
| Fictional proof harms trust | Illustrative disclosure, no real logos, and provenance records |
| Contact or signup UI appears to work | No form submission, no focusable twin controls, and explicit preview-only labeling |
| Shared files become a merge-conflict hotspot | One foundation/integration owner for `site.ts`, registry, header, footer, sitemap, globals, and route wiring |
| Future installability requires destructive global changes | Keep it out of phase one; require a separate ownership RFC before implementation |

## Delivery strategy

The work is divided into one contract wave, parallel isolated creative work, one
integration wave, and one quality gate. Shared files have exactly one owner.

### Wave 0 — freeze the contract

- **Owner:** Lead/foundation agent
- **Parallelism:** None
- **Output:** One small contract PR or commit

Decide and test:

- stable template and page slugs;
- route structure;
- `TemplateShowcase` types;
- exact launch recipes;
- concept status language;
- theme scoping convention;
- analytics event names;
- asset/provenance contract; and
- file-ownership boundaries below.

No art-direction agent starts shared-file work before this contract lands.

### Wave 1 — platform foundation

- **Owner:** Foundation agent
- **Parallelism:** Single shared-files owner

Build:

- typed definitions and validation helpers;
- template registry;
- section renderer over existing demo twins;
- gallery/detail/preview route skeletons;
- preview iframe and viewport controls;
- preview noindex behavior;
- accessible visual-canvas wrapper;
- shared template exit control; and
- fixture definition proving the route/render contract.

This agent owns all shared route and registry files. It does not finish either
template's art direction.

### Wave 2 — parallel execution

Start these after Wave 1's types and interfaces are stable.

#### Track A — SaaS visual concept

Own only:

- `src/lib/templates/saas-launch.ts`
- `src/components/site/templates/saas-launch/**`
- `public/templates/saas-launch/**`

Deliver Relay's five complete pages, shell, mobile menu, scoped theme, bespoke
content, local assets, provenance, and recipe metadata. Do not edit shared
registry, `site.ts`, global CSS, header/footer, sitemap, or shared tests.

#### Track B — Agency visual concept

Own only:

- `src/lib/templates/agency-studio.ts`
- `src/components/site/templates/agency-studio/**`
- `public/templates/agency-studio/**`

Deliver Northline's five complete pages with materially different art direction.
The same shared-file restrictions apply.

#### Track C — catalog and detail experience

Own only the shared marketing surface assigned by the lead:

- gallery/detail components under `src/components/site/templates/` that are not
  template-specific;
- `/templates` and `/templates/[slug]` presentation; and
- approved template public copy in `src/lib/site.ts`.

This is the only Wave 2 track allowed to edit `src/lib/site.ts`. It uses fixture
poster paths until the capture wave.

#### Track D — QA scaffold

Own only:

- `tests/int/template-showcases.int.spec.ts`
- `tests/e2e/templates.e2e.spec.ts`
- `tests/e2e/templates-visual.e2e.spec.ts`

Build contract tests against the frozen interfaces and mark no test complete
until it exercises the integrated real routes. Do not regenerate unrelated
baselines.

### Wave 3 — integration

- **Owner:** Lead/integrator
- **Parallelism:** None on shared files

The integrator:

- registers both concept definitions;
- adds Templates to header and footer navigation;
- connects sitemap, metadata, structured data, OG, LLM/GEO, and analytics;
- verifies iframe analytics exclusion;
- resolves public copy;
- runs the capture tool for posters;
- reviews both concepts side by side for genuine visual distinction;
- updates tests for final routes; and
- fixes cross-track issues without weakening contracts.

### Wave 4 — quality and release

- **Owners:** QA agent plus integrator
- **Parallelism:** Functional and visual checks may run in parallel

Complete:

- all integration invariants;
- functional, accessibility, responsive, overflow, reduced-motion, and analytics
  tests;
- ten-page desktop and mobile visual coverage;
- poster generation and coverage checks;
- Linux baseline workflow;
- documentation and public non-installability disclosure; and
- the full release gate.

The feature is not complete when only the two Home pages look good.

## Agent-ready work packets

The following briefs are designed to be copied directly into execution-agent
tasks after their prerequisites land.

### Packet 1 — foundation and contract

> Read `AGENTS.md` and the full-site template PRD first. Implement the website-only
> template showcase foundation. Do not touch `payload-components/`, CLI code,
> manifests, install state, or seed code. Define the typed, serializable
> `TemplateShowcase` contract; registry validation; gallery/detail/preview route
> skeletons; a renderer that uses only site demo twins; a same-origin responsive
> iframe with responsive/768/390 widths; scoped theme hooks; noindex raw preview
> metadata; and accessible visual-canvas semantics. Preserve demo twins as
> aria-hidden, non-interactive, heading-free components. Add focused contract
> tests. Use fixture content only—do not own final SaaS or Agency art direction.
> Run lint, TypeScript, and focused integration tests. Return changed files,
> decisions, and verification evidence.

### Packet 2 — SaaS Launch art direction

> Read `AGENTS.md`, the full-site template PRD, and the landed template contract.
> Build the complete `saas-launch` / Relay concept: Home, Product, Pricing, About,
> and Contact. Own only `src/lib/templates/saas-launch.ts`,
> `src/components/site/templates/saas-launch/**`, and
> `public/templates/saas-launch/**`. Compose existing site demo twins with bespoke,
> editor-shaped content; build a responsive template shell and mobile menu; add a
> fully scoped token theme; use local optimized assets; and document every asset
> in `PROVENANCE.md`. The result must feel like one high-trust product-led SaaS
> marketing website, not catalog specimens. Do not edit shared registry, site.ts,
> globals.css, header/footer, sitemap, CLI, or target code. Verify all five pages
> at 1280/768/390, reduced motion, keyboard navigation, and no overflow. Return
> route screenshots and verification evidence.

### Packet 3 — Agency Studio art direction

> Read `AGENTS.md`, the full-site template PRD, and the landed template contract.
> Build the complete `agency-studio` / Northline concept: Home, Services, Work,
> About, and Contact. Own only `src/lib/templates/agency-studio.ts`,
> `src/components/site/templates/agency-studio/**`, and
> `public/templates/agency-studio/**`. Compose existing site demo twins with
> original editorial copy, a responsive template shell, warm scoped tokens,
> cinematic local media, and complete asset provenance. It must be recognizably
> different from Relay in typography, rhythm, palette, shell, content, imagery,
> and block selection—not merely a recolor. Do not edit shared registry, site.ts,
> globals.css, header/footer, sitemap, CLI, or target code. Verify all five pages
> at 1280/768/390, reduced motion, keyboard navigation, and no overflow. Return
> route screenshots and verification evidence.

### Packet 4 — gallery and detail pages

> Read `AGENTS.md`, the full-site template PRD, and the landed template contract.
> Build the indexable `/templates` gallery and `/templates/[slug]` detail
> experience. Own the assigned shared template marketing components, route pages,
> and the approved template copy area in `src/lib/site.ts`; do not edit either
> template's isolated visual folder. The gallery uses local poster images and no
> iframes. A detail page loads one iframe, supports five route choices and real
> responsive/768/390 widths, lists page purposes and exact ordered recipes, links
> every block to its docs, shows the visual system, and makes Concept preview / not
> installable status impossible to miss. Add no waitlist, install command, price,
> or download CTA. Verify metadata, keyboard behavior, performance constraints,
> and focused tests.

### Packet 5 — integration, SEO, and analytics

> Read `AGENTS.md` and the full-site template PRD. Integrate the two finished
> concept modules without changing their art direction. Register their stable
> definitions; add Templates to desktop/mobile header and footer navigation; add
> catalog/detail sitemap, canonical metadata, structured data, OG, LLM/GEO, and
> anonymous template events; exclude raw template preview iframes from duplicate
> general analytics; and ensure raw preview routes are noindex and absent from
> public indexes. Do not add Payload runtime code or installability claims. Run
> focused GEO, metadata, navigation, analytics, and TypeScript checks and report
> evidence.

### Packet 6 — capture and complete QA

> Read `AGENTS.md` and the full-site template PRD. Treat the integrated template
> feature as untrusted until proved. Add deterministic local poster capture; asset
> and provenance invariants; catalog/detail/full-preview functional tests;
> keyboard and axe checks; iframe-width assertions; direct URL and history tests;
> reduced-motion and nested overflow checks; and an isolated visual suite with
> desktop/mobile coverage for all ten pages. Preserve existing component
> baselines. Mint required Linux baselines through the repository workflow, then
> run the full release gate. Fix in-scope defects rather than weakening tests.
> Report every command and any environment-only limitation.

## Merge and ownership rules

- One agent owns `src/lib/site.ts` at a time.
- One agent owns `src/lib/templates/registry.ts` at a time.
- One agent owns `SiteHeader`, `SiteFooter`, sitemap, structured data, analytics,
  root/global CSS, and route wiring at a time.
- Creative agents never edit another concept's folder.
- QA agents do not update existing component snapshots to make failures disappear.
- Generated `public/r` remains untouched.
- Payload target source, manifests, registry, support matrix, CLI, state, and
  seed logic remain untouched in phase one.
- Integrate the contract before creative branches; rebase creative branches onto
  that contract before final integration.

## Definition of done

This product is complete only when all of the following are true:

- Templates is discoverable from desktop and mobile navigation.
- The gallery contains two polished, accurately labeled concept cards.
- SaaS Launch has five complete, scrollable pages.
- Agency Studio has five complete, scrollable pages.
- Internal navigation works on desktop and mobile with direct URLs and history.
- Detail pages provide real viewport controls, page inventories, recipes, visual
  systems, and non-installability disclosure.
- Every section maps to an existing component slug and site demo twin.
- Both concepts use coherent, original copy and local, provenanced assets.
- The concepts are visibly distinct without their labels.
- No preview submits data, hotlinks assets, or pretends to install.
- Catalog and detail pages are indexable; raw previews are noindex.
- Analytics records only the approved anonymous event properties.
- All ten pages pass desktop/mobile visual coverage, overflow, reduced motion,
  and route checks.
- Catalog/detail/template shell passes the accessibility gate.
- Existing landing, docs, component, registry, installer, and visual contracts
  remain green.
- The full release gate passes.

## Future installer RFC—not part of this implementation

The concept model intentionally preserves component slugs and editor-shaped
content, but it is not an install manifest.

If engagement clears the decision gate, write a separate RFC before changing the
CLI. That RFC must decide whether the product is:

1. **An overlay for an existing Payload Website Template.** Keep versioned
   recipes in this repository/package and install into a detected supported
   target.
2. **A complete opinionated starter.** Create a separate consumer/starter
   repository or scaffold because collections, auth, database, deployment, and
   globals now have an independent lifecycle.

An overlay installer must solve, with tests:

- whole-template preflight before mutation;
- component/dependency deduplication and one post-install generation pass;
- resumable template state in addition to component state;
- multi-page draft ownership with exact IDs and private high-entropy tokens;
- per-page and per-asset operation journaling;
- foreign slug collision refusal;
- local asset packaging and upload ownership;
- safe handling of `/`, `/pricing`, `/about`, and other existing pages;
- Header/Footer/global ownership without overwriting user content;
- theme-token and `globals.css` ownership;
- non-destructive retries and git-visible code rollback;
- `overrideLock: false` on owned Page updates;
- no automatic database access from the CLI;
- a separately generated, explicitly operator-run seed script; and
- no automatic Media deletion.

The current seed generator already accepts multiple component manifests and can
construct a multi-block layout, but current state and ownership models cover one
component and one demo Page/Media record. That is a useful seam, not proof that a
multi-page installer is safe today.

Until that RFC is implemented and verified, the website must continue to say
**Concept preview** and nothing stronger.
