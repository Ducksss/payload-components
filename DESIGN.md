---
version: alpha
name: 'Payload Components'
description: 'A reviewable-source component registry presented like a precise wiring ledger, with restrained editorial warmth.'
colors:
  background: 'oklch(100% 0 0deg)'
  foreground: 'oklch(14.1% 0.005 285.8deg)'
  muted: 'oklch(96.7% 0.001 286.4deg)'
  muted-foreground: 'oklch(46% 0.014 285.9deg)'
  border: 'oklch(92% 0.004 286.3deg)'
  brand: 'oklch(50.8% 0.118 165.6deg)'
  brand-50: 'oklch(97.6% 0.018 165.6deg)'
  trace: 'oklch(47% 0.094 166.5deg)'
  destructive: 'oklch(57.7% 0.245 27.3deg)'
  terminal: 'oklch(16.5% 0.008 285.8deg)'
typography:
  sans:
    fontFamily: 'Geist Sans, ui-sans-serif, system-ui, sans-serif'
  mono:
    fontFamily: 'Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace'
  accent:
    fontFamily: 'Instrument Serif, ui-serif, Georgia, Times New Roman, serif'
  display:
    fontFamily: 'Archivo, Arial Narrow, Arial, sans-serif'
  spec:
    fontFamily: 'Azeret Mono, ui-monospace, SFMono-Regular, Menlo, monospace'
rounded:
  DEFAULT: '0.625rem'
  inset: '1rem'
  card: '1.25rem'
  panel: '1.5rem'
  frame: '2rem'
spacing:
  page-max: '86rem'
  header-height: '3.5rem'
  section-mobile: '3.5rem'
  section-desktop: '5rem'
components:
  button: {}
  card: {}
  header: {}
  input: {}
  terminal-frame: {}
  translation-notice: {}
---

# Payload Components Design System

## Overview

### Creative North Star

A maintainer's workbench after a careful install: the source diff, terminal transcript, and wiring checklist are all visible, orderly, and easy to verify. Editorial serif accents add a human note, but the product proof remains the code and ledger.

### Product context and register

- **Audience and primary job:** Payload CMS and Next.js developers choosing, installing, and auditing source-distributed blocks.
- **Target market(s) and evidence:** Global developer audience. Supported locales follow observed site traffic; geography never determines language automatically.
- **Locale(s) and language policy:** English is canonical and currently the only published locale (`publishedSiteLocales` in `src/i18n/config.ts`), so the language switcher is hidden; 21 saved draft catalogues stay inactive (see `messages/README.md`). Once another locale is published, the switcher lists autonyms, core catalogues may be machine translated and visibly labelled, long-form untranslated resources show English fallback, and non-English resources remain `noindex` until a native reviewer marks that exact path reviewed in `messages/status.json`.
- **Usage scene:** Desktop-first technical evaluation with frequent mobile reference use; information is dense but must remain scannable and copyable.
- **Register:** Brand-editorial on landing and templates; familiar documentation/product utility in docs, catalog filters, and controls.
- **Memorable signature:** Dark terminal product frames and wiring ledgers that make “wired, not pasted” tangible.
- **Restraint:** Navigation, language selection, search, code, consent, and install actions prioritize convention and accessibility.
- **Anti-references:** No generic gradient SaaS theatre, pricing-funnel language, ornamental dashboards, or flag-based language selection.
- **Token ownership/runtime mapping:** This file mirrors the implemented system. `src/app/globals.css` is canonical for values and Tailwind mappings; visual standards and browser suites are the drift gates.

## Brand layer and preview scope

Two layers share one light page. The **site chrome** — the header and footer on every route, plus the landing, `/about` and `/brand-guide` — wears the _Datasheet_ brand: it is drawn like a component datasheet, in Archivo, Azeret Mono, and one trace green. The **blocks** it shows keep the component tokens below (Geist, emerald `brand`, the base radius), because that is what installs.

- `[data-brand='datasheet']` (globals.css section 4) marks branded chrome. It remaps the tokens the chrome already uses — `--font-sans`, `--font-mono` and the `--brand` ramp — onto the brand faces and `trace`, so existing utilities follow without per-class edits.
- `.preview-scope` restores every token the brand scope remaps. It sits on every surface that renders a demo twin: the preview route, `DemoFitFrame`, `DemoScaleFrame`, the hero wall, and the specimen. A twin inside branded chrome therefore renders exactly as it installs, and exactly as its visual baseline. `tests/int/brand-layer.int.spec.ts` keeps the two scopes mirror images, and the frontend e2e suite checks the landing's twins at runtime.
- Never put `.preview-scope` inside a template shell: template themes set these tokens themselves.
- The mark is two blocks, so it keeps the blocks' emerald (`--mark`) wherever it sits.

## Colors

The site is forced light: white and zinc-like neutral surfaces carry almost all structure, with thin `border` dividers and AA-safe `muted-foreground` text. Each layer has one expressive green. In the site chrome it is `trace` (#0B6B4F, 6.5:1 on white) for drawings, pads, links, and the primary action, with `wire` for unlit traces and silkscreen. In the blocks it is emerald `brand`, for active state, links, status dots, and soft `brand-50` notices. Destructive red is reserved for actual errors. `terminal` is an intentional permanent dark product surface, not a second theme. Focus rings must remain visible on both white and tinted surfaces.

## Typography

In the site chrome, Archivo sets display and text from one variable file: headings run condensed through its width axis (`.ds-display`, `font-stretch` 68–75%), and text runs at normal width. Azeret Mono carries commands, part numbers, and labels (`.ds-label`). In the blocks, Geist Sans owns prose and controls; Geist Mono owns commands, paths, versions, metadata, and ledger labels. Instrument Serif is limited to one italic Latin accent word in expressive block and unbranded-page headings; inside the brand scope the accent word is set as plain heading type. It must not be applied to Arabic, Hebrew, CJK, Cyrillic, or Thai text; localized headings may omit the accent. Platform sans fallbacks provide script coverage. Keep prose near 60–75 characters, allow balanced headings only where line breaking remains stable, avoid uppercase transformations on non-Latin copy, and let Japanese browser kinsoku rules operate without manual spaces or italics. Ruby is not currently used.

## Layout

Content aligns to the shared container with an 86rem ceiling and responsive padding. Major sections use approximately 3.5rem vertical space on small screens and 5rem on large screens. Breakpoints are 40/48/64/80/86rem. Grids collapse to one column before text or actions become cramped; ledgers and code surfaces scroll internally rather than widening the page. RTL geometry uses logical properties. Localized controls and notices must reserve enough width for long labels and never depend on fixed English line counts.

## Elevation & Depth

Hierarchy comes from tonal bands, borders, and restrained `--shadow-card` / `--shadow-frame` shadows. Blur is limited to sticky navigation and atmospheric hero layers. Documentation and dense reference surfaces stay flat. Translation status is a tinted band, not a floating toast, because it is persistent publication context.

## Shapes

Controls use the base radius; nested panels, cards, and product frames use named `inset`, `card`, `panel`, and `frame` tokens. Pills are reserved for compact status or category metadata. Avoid arbitrary radius values and avoid stacking several outlined rounded boxes without a clear containment hierarchy.

## Components

### Foundational visual states

Interactive elements need default, hover, focus-visible, active, disabled, and busy behavior without shifting geometry. Selected filters combine color with text/state semantics. Errors use destructive color and explanatory text; success is announced in text, not color alone. Skeletons are optional, but loading regions must preserve final dimensions.

### Buttons and actions

Primary actions are solid foreground or brand only when there is one clear next step. Secondary actions use borders or quiet links. Icon-only actions require accessible names; minimum touch targets are 44px where space permits. Busy actions retain their label width.

### Navigation and data display

Header navigation stays compact and familiar. Locale choice uses the native select model plus an actual submit action so it works without hydration. Code, file trees, manifests, and ledgers use mono text and internal overflow. Responsive tables may stack into labelled rows only when header relationships remain explicit.

### Forms and overlays

Inputs use background, border, and ring tokens with persistent labels. Validation appears next to the field. Native browser semantics are preferred for select controls. Dialogs and drawers need labelled titles, focus containment, escape behavior, and restored focus; none are currently required for locale selection.

### Iconography

Lucide is the canonical icon family, using outline strokes at 14–20px for controls and metadata. Icons support labels; they do not replace unfamiliar actions or translation status text.

### Motion

Motion is brief and functional: small hover lifts and reveal transitions around 200–300ms. It must be interruptible and cannot gate disclosure, navigation, or core content. Under reduced motion, final content and the complete terminal transcript remain visible.

### Content and data visualization

Voice is direct, factual, community-first, and specific about what files and commands change. Keep commands, paths, package names, and identifiers unchanged across locales. Use locale-aware plural and date formatting. There are no chart-specific tokens; any future visualization needs a textual equivalent.

## Do's and Don'ts

- **Do:** Make source ownership, install effects, fallback language, and review status explicit.
- **Do:** Reuse canonical tokens, shared navigation, and message keys across every route and locale.
- **Don't:** Claim a route is translated merely because its navigation chrome is localized.
- **Don't:** use flags for languages, hard-code English-sized containers, or introduce arbitrary visual values when a token exists.
