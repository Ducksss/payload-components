# Community Field Journal Visual System

Status: Approved design

Date: 2026-07-15

Scope: All 32 blog covers and all 35 inline blog figures

## Objective

Replace the abstract technical-clay illustration system with a community-first
editorial system that feels like an ambassador helping other builders learn,
inspect, and contribute.

The finished library should resemble a collected open-source field journal:
designed enough to be recognizable as one publication, factual enough to teach
from, and human enough to invite participation. Every visual must contain useful
evidence from the project rather than functioning as decoration alone.

## Chosen Direction

The canonical direction is **C1: Designed Field Journal**, with restrained
community annotations borrowed from **C2: Contributor Scrapbook**.

C1 supplies the repeatable editorial grid, strong typography, issue numbering,
artifact hierarchy, and disciplined composition. C2 contributes occasional
handwritten questions, contributor notes, tape-like markers, and prompts that
make the invitation to participate explicit. C2 elements are accents, not the
underlying layout, so the 32-post collection stays coherent.

## Design Principles

1. **Show the work.** Use actual previews, source, commands, diffs, manifests,
   tests, file paths, and contribution flows.
2. **Teach one idea per visual.** A cover creates curiosity; its inline figure
   resolves the technical idea.
3. **Invite the next builder.** Community prompts should help readers try,
   question, report, or contribute.
4. **Keep evidence honest.** Never fabricate contributors, testimonials,
   activity counts, GitHub interfaces, terminal results, or project behavior.
5. **Design a collection.** Shared grids, typography, folios, and artifact
   treatments should make every post recognizable without making every post
   identical.
6. **Preserve technical legibility.** Expressive layering must not obscure code,
   commands, diagrams, or UI details.

## Cover System

Every cover remains a 1200×630 WebP at its existing path:
`public/blog/<slug>/cover.webp`.

Each cover uses the following editorial skeleton:

- A series masthead and publication issue number.
- A short editorial thesis, not a duplicate of the article title.
- One primary project artifact.
- One secondary evidence layer that explains or validates the primary artifact.
- A restrained emerald stamp, annotation, registration mark, or path marker.
- One community invitation or first-person field note drawn from the article.
- A consistent folio and underlying paper grid.

The primary artifact may be a real component preview, responsive capture, code
excerpt, terminal report, manifest, scoped diff, test result, or contribution
workflow. The secondary layer should be a different evidence type; for example,
a component preview can pair with its renderer mapping, and a terminal report can
pair with install-state evidence.

All lettering is deterministic and code-authored using the repository's existing
fonts. No generative model creates text, logos, UI, or factual content. The new
covers replace the existing AI-generated abstract artwork completely.

## Series Treatment

The shared system shifts emphasis by series:

| Series                | Primary evidence                                                | Community emphasis                             |
| --------------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| Project notes         | Installer pipeline, source diff, or origin artifact             | Why the project exists and what help is useful |
| Foundations           | Config, generated type, renderer, or real page composition      | A clear first learning step                    |
| Installer internals   | Terminal output, state, manifest, or scoped patch               | Reproducible reports and recovery knowledge    |
| Component design      | Real preview comparison and field model                         | Decisions maintainers can discuss and improve  |
| Production guides     | Page blueprint, responsive capture, and implementation evidence | A practical build readers can adapt            |
| Quality and community | Tests, provenance, contribution workflow, or feedback loop      | Direct participation and stewardship           |

The palette remains white, graphite, muted zinc, and emerald. A warm paper tone
may appear as a quiet supporting surface. It must not introduce another brand
accent. Texture is subtle and deterministic: grid lines, registration marks,
paper edges, and restrained shadow rather than simulated dirt or heavy grain.

## Inline Figure System

All 35 existing figure slots are redesigned under four teaching modes:

### See it

Real component, blog, catalog, or documentation captures. These use the actual
local routes and responsive states. Frames identify the route or component and
may add numbered callouts without altering the captured UI.

### Trace it

Code-authored architecture, state, trust-boundary, lifecycle, or contribution
diagrams. These retain exact relationships while adopting Field Journal labels,
folios, paper grids, and emerald path markings.

### Inspect it

Repository-backed commands, diffs, manifests, tests, and file trees. Every line
must either come from the project or be an explicitly labeled, behaviorally
accurate excerpt.

### Join it

Contribution loops, open questions, issue-report ingredients, and next-builder
prompts. These should point to a real action described by the article rather
than a vague engagement slogan.

The eight current UI montages remain factual captures but receive stronger
journal framing and clearer annotations. The 27 deterministic diagrams keep
their architecture and meaning while adopting the new visual language.

## Cover and Figure Pairing

Each article's cover and inline figure form one learning pair:

1. The cover frames the tension or practical question.
2. The inline figure supplies the detailed explanation or evidence.
3. The caption states what the reader should notice.
4. The article CTA gives the reader a concrete way to try or contribute.

The pair must not repeat the same composition. If the cover uses a preview, the
figure should trace its data, wiring, or comparison. If the cover uses a diff,
the figure should show the resulting system or recovery path.

## Community Voice and Authenticity

Community language is first-person, practical, and invitational. Suitable
prompts include:

- “What changed in your install?”
- “Leave a map for the next builder.”
- “Try it, inspect the diff, and report the rough edge.”
- “What should this component teach more clearly?”

Prompts should be adapted to the article and may be quoted only when the words
appear in the post. Generic prompts may remain unattributed. Named quotes,
avatars, issue numbers, stars, reactions, merge states, and contributor activity
must never be invented. A real public artifact may be used only when its context
is accurate and its inclusion is appropriate.

## Rendering Architecture

A shared deterministic renderer will consume structured per-post visual data:

- slug and publication order;
- series and cover thesis;
- primary artifact type and source;
- secondary evidence type and source;
- annotation or community prompt;
- figure teaching mode;
- alt text and caption.

The cover renderer uses HTML/CSS with existing vendored fonts, captures the
1200×630 composition through Playwright, and converts the result to optimized
WebP with Sharp. Real UI artifacts are captured from local component, blog,
catalog, and documentation routes before being placed into the cover. Diagram
figures remain code-authored SVG. Repository excerpts are read from their source
files or defined as tested excerpts adjacent to the renderer data.

The generated assets retain their current public paths so article URLs,
frontmatter references, RSS enclosures, social metadata, and structured data do
not change. The existing per-post Open Graph route continues composing the cover
with the real article title and series.

## Accessibility and Performance

- Covers remain exactly 1200×630 WebP and no larger than 250 KiB.
- Screenshot figures remain exactly 1600×900 WebP and no larger than 350 KiB.
- Diagram figures remain SVG with `viewBox="0 0 1200 675"` and no larger than
  150 KiB.
- Text embedded in an image is never the sole source of article information.
- Alt text describes the meaningful artifacts and relationships, not the visual
  style.
- Captions remain visible through `BlogFigure` and explain what to notice.
- Code and terminal text must remain legible at the rendered article width.
- Decorative handwriting, stamps, and texture must meet contrast requirements
  or remain nonessential.

## Validation

The redesigned system is complete only when all of the following pass:

- Exactly 32 covers and 35 inline figures exist and are referenced.
- Every raster and SVG meets its dimension and file-size contract.
- Every cover includes a real primary artifact and a distinct secondary layer.
- Every post retains nonempty, accurate alt text and a visible caption.
- Commands, component names, paths, and registry items resolve to repository
  truth.
- Contact sheets for all covers and figures receive a visual review for repeated
  compositions, illegible text, clipping, weak hierarchy, and accidental fake
  claims.
- Blog index and representative article visual baselines are regenerated and
  reviewed on desktop and mobile.
- Axe coverage, blog integration tests, the complete Playwright suite, and
  `pnpm test:release` pass.

## Acceptance Criteria

The delivery is accepted when:

1. All 67 assets use the Designed Field Journal system.
2. The 32 covers read as one publication while remaining recognizably specific
   to their articles.
3. The visuals contain actual project content and teach a concrete idea.
4. Community participation is visible without fabricated social proof.
5. The existing editorial content, routes, publication order, RSS, structured
   data, and Open Graph contracts remain intact.
6. The complete release gate passes with no new accessibility, overflow,
   performance, or visual-regression failures.

## Out of Scope

- Changing Payload registry, manifest, component, or CLI behavior.
- Rewriting article arguments or publication metadata.
- Adding social profiles, comments, reactions, or other community product
  features.
- Using private contributor information or fabricated public activity.
- Introducing a second accent color or a separate visual identity for the blog.
