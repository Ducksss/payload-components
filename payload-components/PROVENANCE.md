# Component provenance & tailark/blocks drift

Some component **layouts** in this repo were re-implemented from open-source
marketing blocks — chiefly **[tailark/blocks](https://github.com/tailark/blocks)**
(MIT). tailark is an actively developed, partly externally/bot-authored catalog,
so this file records what we adapted, from which upstream item, and at which
upstream commit — so a future drift check is a mechanical diff rather than a
re-investigation.

We **re-implement**, we do not copy: markup is retokenized onto this repo's
design system and rewired onto Payload fields. The differences from upstream are
therefore mostly *intentional* (see "Intentional divergences" below), not
regressions.

## Upstream baseline

| Field | Value |
| --- | --- |
| Repo | `tailark/blocks` (https://github.com/tailark/blocks) |
| License | MIT |
| Verified against commit | `8eadeb3389ccccc4bfc4a10bca959c1b39e47b71` |
| Commit date | 2026-05-14 |
| Last audited | 2026-07-15 |
| Registry item URL | `https://raw.githubusercontent.com/tailark/blocks/<sha>/apps/www/public/r/<item>.json` (full source in `files[].content`) |

At the audited commit, **nothing we derived from had been removed or renamed**
upstream — there was no upstream change to follow.

### Upstream layout moved (noted 2026-08-09)

As of `8139698115c1341bfd2e3e286c04bb4d8146f472` (2026-07-29) the generated
registry directory `apps/www/public/r/` **no longer exists** upstream. Sources now
live at `registry/bases/<base>/<kit>/blocks/<family>/<variant>.tsx`, where `<base>`
is `base` or `radix` (two renderings of the same catalog — `base` is canonical for
our purposes) and `<kit>` is `dusk`, `mist`, or `veil`. Numbered item names such as
`stats-4` are gone; variants are now spelled `one`, `two`, `three`, ….

Rows added before this note keep their original `<item>` names and must be
re-pointed by hand at the next full audit. Rows added after it use the new
`<kit>/<family>/<variant>` form and resolve at:

```
https://raw.githubusercontent.com/tailark/blocks/<sha>/registry/bases/base/<kit>/blocks/<family>/<variant>.tsx
```

## Derived components (attributed)

Each carries a `// Layout adapted from tailark/blocks (MIT) …` source comment and
a docs-footer credit. Upstream matches for the re-implemented families are
approximate (layout intent, not line-for-line).

| Our component | Upstream item(s) | Note |
| --- | --- | --- |
| `hero-video` | `hero-section-5` | full-bleed video hero; adds a reduced-motion-safe poster fallback |
| `hero-product-tilt` | `hero-section-9` | product screenshot hero with a static large-screen perspective treatment |
| `feature-accordion` | `features-12` | keyboard-native accordion synchronized with editor-managed media |
| `feature-cards-media` | `features-10` | paired feature stories with independent media panels |
| `feature-icon-grid` | `features-1` | decorated icon grid retokenized onto semantic design-system colours |
| `stats-proof` | `stats-4` | proof section combining semantic stats and a customer quote |
| `contact-routing-form` | `contact-2` | contact-channel rail plus a safe same-origin POST form |
| `testimonials-grid` | `testimonials-1` / `testimonials-2` | 3-column quote-card grid |
| `testimonials-wall` | `testimonials-5` / `testimonials-6` | masonry wall-of-love (CSS `columns`, not upstream JS `chunkArray`) |
| `testimonials-spotlight` | `testimonials-4` | single centered quote |
| `testimonials-quote` | `testimonials-3` / `mist-testimonials-1` | single quote with left accent bar |
| `testimonials-bento` | `testimonials-5` / `testimonials-6` | extended into an asymmetric bento; adds `featured` + `logo` |
| `testimonials-rating` | — (via `testimonials-grid` → `testimonials-1` / `testimonials-2`) | our star-rating variant; no direct upstream item, audit through the parent row |
| `pricing-cards` | `pricing-1` / `pricing-3` | 3-column plan cards |
| `pricing-cards-muted` | `pricing-2` | muted-surface plan cards |
| `pricing-cards-cta` | `pricing-3` | CTA moved into the card header |
| `pricing-split` | `pricing-4` | two-column entry/featured split |
| `pricing-enterprise` | `pricing-5` / `mist-pricing-1` | single enterprise card; adds editable `logos[]` |
| `call-to-action-boxed` | `call-to-action-2` | nested boxed-in-box CTA |
| `comparator-grid` | `veil-comparator-1` | CSS-grid comparator with a highlighted column |
| `comparator-table` | `mist-comparator-1` | semantic `<table>` comparator with grouped rows |
| `team-roster` | `team-1` | grouped department sections, small circular avatars |
| `stats-grid` | `mist/stats/two` (also `mist/stats/four`) | heading over a bare metric grid; ours is a semantic `<dl>` on rule-topped columns |
| `stats-card` | `mist/stats/one` | divided metric panel; ours drops the shadcn `Card` for the house panel tokens and derives its columns from the row count |
| `stats-inline` | `veil/stats/one` | value-leads-the-sentence rows; ours is a real `<ul>` and omits the upstream decorative image/bar-chart layers |
| `footer-columns` | `dusk/footer/one` (also `mist/footer/one`) | brand block plus labelled link columns; ours drops the newsletter form and labels each column as its own `<nav>` |
| `footer-simple` | `mist/footer/four` | compact brand-left / links-right row |
| `footer-centered` | `veil/footer/two` + `veil/footer/three` | centred brand and nav from `two`, legal-links rule from `three`; social icons omitted (lucide v1 removed brand marks) |

## Considered but NOT attributed (independent / too generic)

Verified against the nearest upstream item and judged to be an independent take on
a generic pattern — **do not** credit these to tailark:

| Our component | Nearest upstream | Why declined |
| --- | --- | --- |
| `faq-accordion` | `mist-faqs-1` | generic centered accordion; no distinctive shared mechanic |
| `call-to-action-centered` | `call-to-action-1` | generic centered CTA (heading + two buttons) |

Everything else in the catalog (`hero-basic`, `feature-bento`, `feature-grid-basic`,
`feature-split`, `feature-steps`, `comparator-stack`, `team-grid`, all
`integration-*`, all `logo-cloud-*`, all `content-*`, and `embed-basic`) was
verified as **ORIGINAL** — no upstream basis, no attribution required.
`embed-basic` has no upstream namesake at all.

## Intentional divergences (house style — not drift to "fix")

- **Media uploads instead of shadcn `<Avatar>` / hardcoded logo SVGs** — avatars
  and logos are editor-managed content, not code.
- **Fixed Tailwind breakpoints instead of `@container` queries.**
- **Reduced-motion-safe video** — `hero-video` waits for the client preference
  before enabling autoplay and otherwise keeps its poster visible.
- **Static product perspective** — `hero-product-tilt` is flat on small screens
  and uses CSS-only perspective at the large breakpoint.
- **Conservative contact routing** — `contact-routing-form` validates channel
  values and only submits to a same-origin path instead of owning a backend.
- **CSS `columns` / grid instead of upstream JS `chunkArray`** for masonry walls.
- **Semantic design tokens only** (light monochrome + emerald); no raw palette or
  arbitrary colour/radius values (enforced by `tests/int/visual-standards.int.spec.ts`).
- **Editorial extensions with no upstream basis**: `testimonials-rating` (stars),
  `testimonials-bento` `featured`/`logo` cells, `pricing-enterprise` `logos[]` as data.

## Coverage decisions (declined)

- We do **not** mirror upstream kit reskins (`mist-*`, `veil-*`, `dusk`) as
  separate variants — they are re-themes of layouts we already cover.
- We do **not** ship `@container`-based responsive variants (e.g. `mist-pricing-2`).

Rationale: each new variant is a heavy contract change (manifest + `src/lib/site.ts`
counts pinned in ~4 places + demo twin + visual baseline) for cosmetic upstream
variance.

## Re-auditing for drift

1. Pick the current upstream `main` SHA and set it as `<sha>` in the item URL above.
2. For each row in "Derived components", fetch the upstream item and compare its
   layout skeleton against our `payload-components/source/blocks/<Component>/Component.tsx`.
   Only the *structural* skeleton matters — the intentional divergences above are expected.
3. If upstream changed a layout in a way worth following, update the component and
   bump "Verified against commit" + "Last audited" here.

An automated `drift:check` (fetch pinned items, diff/hash against a recorded
snapshot, warn in CI) is a deferred follow-up; this ledger is its prerequisite.
