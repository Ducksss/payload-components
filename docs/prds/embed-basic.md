# PRD: `embed-basic`

Date: 2026-06-16
Status: Draft for implementation
Owner: Payload Kits

## Summary

`embed-basic` is the controlled iframe/embed kit for Payload v3 + Next.js
website-starter projects. It lets editors paste a supported URL and render a
responsive, accessible embed in both Page layout blocks and Post rich-text
content.

This is not a raw HTML block. v1 ships a safe, reviewable source component with
URL parsing, provider normalization, required iframe titles, lazy loading, and a
small host allowlist that the consuming project can edit in source.

## Problem

Current starter surfaces:

- Pages Add Layout: `Call to Action`, `Content`, `Media Block`, `Archive`,
  `Form Block`.
- Posts Lexical block menu: `Code`, `Media Block`, `Banner`.

That covers core content, but misses a common editor job: embedding third-party
content such as videos, maps, forms, charts, demos, calendars, and widgets.
Editors either cannot do it, ask developers for one-off blocks, or reach for raw
HTML. Raw HTML is the wrong default for this project because it bypasses the
trust boundary Payload Kits is trying to make explicit.

## Goals

- Add one installable kit, `embed-basic`, that works in both Pages and Posts.
- Render YouTube, Vimeo, Google Maps, and explicitly allowlisted iframe hosts.
- Keep the installed code server-first and dependency-light.
- Make unsafe input non-rendering by default instead of trying to sanitize raw
  markup.
- Make the install output obvious in a git diff: source files, Pages wiring,
  RenderBlocks wiring, Posts Lexical wiring, generated types, import map.
- Leave one focused test path for URL normalization and installer idempotency.

## Non-Goals

- No arbitrary HTML paste.
- No `<script>`, `srcdoc`, inline event handlers, or raw iframe attribute paste.
- No automatic oEmbed network fetching.
- No admin UI plugin beyond Payload's normal fields and block drawer.
- No provider-specific analytics SDKs.
- No styling variants in v1.
- No shared `embedFields` abstraction until a second embed variant exists.

## Users

- **Editor:** wants to paste a YouTube video, Vimeo video, Google Map, form, or
  approved widget without asking a developer.
- **Developer:** wants source they can review, edit, and commit, with no hidden
  third-party runtime.
- **Maintainer:** wants a kit that proves Payload Kits can wire both Page layout
  blocks and Post Lexical blocks.

## Core Use Cases

1. Add a YouTube product demo to a landing page.
2. Add a Vimeo recording inside a blog post.
3. Add a Google Map to a location/contact page.
4. Add an approved third-party form or widget using an allowlisted iframe host.
5. Paste an unsupported URL and get a safe fallback, not a broken or unsafe
   iframe.

## Kit Contract

| Item | Value |
| --- | --- |
| Kit slug | `embed-basic` |
| Block folder | `payload-kits/source/blocks/EmbedBasic/` |
| Payload block slug | `embedBasic` |
| Config export | `EmbedBasic` |
| Component export | `EmbedBasicBlock` |
| Generated interface | `EmbedBasicBlock` |
| Install command | `npx payload-kit add embed-basic` |
| Supported target | `payload-website-starter` |
| Install modes | Page layout block + Post Lexical block |

## Field Model

Use the smallest editor surface that covers the need.

| Field | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `url` | `text` | yes | none | The pasted embed or share URL. Must parse as `https:`. |
| `title` | `text` | yes | none | Used as iframe `title`; required for accessibility. |
| `caption` | `textarea` | no | none | Plain text caption below the embed. |
| `aspectRatio` | `select` | yes | `16:9` | Options: `16:9`, `4:3`, `1:1`, `auto`. |
| `allowFullscreen` | `checkbox` | no | `true` | Applied only to iframe output. |

Provider should be derived from `url` at render time. Do not store a provider
field in v1; stored provider data can drift when the URL changes.

## Provider Behavior

| Input | Output |
| --- | --- |
| `youtube.com/watch?v=<id>` | `https://www.youtube-nocookie.com/embed/<id>` |
| `youtu.be/<id>` | `https://www.youtube-nocookie.com/embed/<id>` |
| `youtube.com/embed/<id>` | `https://www.youtube-nocookie.com/embed/<id>` |
| `vimeo.com/<id>` | `https://player.vimeo.com/video/<id>` |
| `player.vimeo.com/video/<id>` | same canonical player URL |
| Google Maps embed/share URL | validated maps iframe URL |
| Allowlisted generic iframe host | original normalized `https:` URL |
| Unsupported host or invalid URL | no iframe; render a safe fallback |

The installed source should expose an editable host list for generic embeds:

```ts
const allowedGenericEmbedHosts = [
  'docs.google.com',
  'form.typeform.com',
  'tally.so',
  'airtable.com',
  'calendly.com',
]
```

Known provider hosts do not need to be repeated in that generic list. Developers
can add project-specific hosts in the installed source and review the change.

## Rendering Requirements

- Server component by default.
- No new runtime dependency.
- No `dangerouslySetInnerHTML`.
- No raw iframe HTML parsing.
- Use `new URL()` for parsing and normalization.
- Iframe attributes:
  - `src`
  - `title`
  - `loading="lazy"`
  - `allowFullScreen` when enabled
  - `referrerPolicy="strict-origin-when-cross-origin"`
  - `allow` only for a fixed, conservative list needed by video embeds:
    `accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share`
- Responsive wrapper:
  - `16:9`, `4:3`, `1:1` use CSS aspect-ratio.
  - `auto` uses a stable minimum height so layout does not collapse.
- Caption renders only when present.
- Invalid/unsupported URL renders a small non-iframe fallback that says the embed
  is unavailable and links to the provided URL when the URL is syntactically
  valid.

## Installed Files

Minimum file set:

```text
src/blocks/EmbedBasic/config.ts
src/blocks/EmbedBasic/Component.tsx
src/blocks/EmbedBasic/embed.ts
```

`embed.ts` holds the pure URL normalization helper so it can be tested directly.
Do not add shared field files until another embed variant ships.

## Installer Requirements

`payload-kit add embed-basic` must:

1. Build/use the registry item.
2. Copy the three source files.
3. Register `EmbedBasic` in `src/collections/Pages/index.ts` layout blocks.
4. Register `embedBasic: EmbedBasicBlock` in `src/blocks/RenderBlocks.tsx`.
5. Register `EmbedBasic` in `src/collections/Posts/index.ts` Lexical
   `BlocksFeature`.
6. Run `payload generate:types`.
7. Run `payload generate:importmap`.
8. Record install state in `.payload-kit/state.json`.
9. Converge on repeat runs without duplicate imports, layout entries, render map
   entries, or Lexical block entries.

If the Posts rich-text shape is not recognized, the installer should fail loud
with the exact manual import and `BlocksFeature` entry to add. It should not
pretend the kit is fully installed.

## Registry / Manifest Requirements

The kit must ship the complete bundle:

- Source files under `payload-kits/source/blocks/EmbedBasic/`.
- Manifest at `payload-kits/manifests/embed-basic.json`.
- Registry entry in `payload-kits/registry.json`.
- Docs page at `content/docs/kits/embed-basic.mdx`.
- Catalog entry in `src/lib/site.ts`.
- Demo twin for the site catalog if the component is rendered in previews.
- Installer fixture/sample content covering at least one valid YouTube URL.

Manifest metadata must include:

- `requiresPayloadKitWrapper: true`
- `supportedTargets: ["payload-website-starter"]`
- `postInstall: ["generate:types", "generate:importmap"]`
- patched files:
  - `src/collections/Pages/index.ts`
  - `src/blocks/RenderBlocks.tsx`
  - `src/collections/Posts/index.ts`

## Admin UX

Pages:

- The Add Layout drawer should show `Embed` or `Embed Basic`.
- Editors fill `URL`, `Title`, optional `Caption`, `Aspect ratio`, and optional
  `Allow fullscreen`.

Posts:

- The Lexical block menu should show `Embed` or `Embed Basic` beside `Code`,
  `Media Block`, and `Banner`.
- The same fields should be used in the rich-text block form.

Field help text:

- `url`: "Paste a supported embed URL. YouTube, Vimeo, Google Maps, and
  allowlisted iframe hosts are supported."
- `title`: "Required iframe title for screen readers."
- `caption`: "Optional caption shown below the embed."

## Accessibility

- `title` is required and passed to the iframe.
- Caption text must be associated visually with the embed.
- Fallback link text must be meaningful: "Open embed source: <title>".
- The block must not introduce keyboard traps.
- The iframe wrapper must not hide focus outlines from embedded content.

## Security

- Only `https:` URLs render as iframes.
- Provider parsing must canonicalize known video URLs.
- Generic iframes render only when hostname is in
  `allowedGenericEmbedHosts`.
- Unsupported URLs produce fallback output, not iframe output.
- Raw HTML is not accepted as input.
- `javascript:`, `data:`, `blob:`, and protocol-relative URLs do not render.
- Query strings are preserved only when needed by provider URLs. Known video
  canonicalization should drop unrelated tracking params.

## Acceptance Criteria

Functional:

- `npx payload-kit add embed-basic` installs into a clean supported starter.
- Pages Add Layout includes the embed block after install.
- Posts Lexical block menu includes the embed block after install.
- YouTube watch, YouTube short, YouTube embed, Vimeo, and allowlisted generic
  URLs render as responsive iframes.
- Invalid, non-HTTPS, and unsupported-host URLs render safe fallback output.
- Repeat install is idempotent.

Code quality:

- No new dependency unless the implementation proves the platform URL API is
  insufficient.
- No raw HTML rendering.
- No shared embed field abstraction in v1.
- Component preserves optional wrapper props used by local kit conventions:
  `id`, `className`, and `disableInnerContainer`.

Docs:

- Kit docs explain supported URL types, the generic host allowlist, and how to
  add a project-specific host.
- Kit docs explicitly say this is not a raw HTML block.
- Research and roadmap link to this PRD.

## Test Plan

Smallest useful checks:

- Unit/integration test for URL normalization:
  - YouTube watch URL.
  - `youtu.be` URL.
  - YouTube embed URL.
  - Vimeo URL.
  - Allowed generic host.
  - Unsupported host.
  - Non-HTTPS URL.
  - Invalid URL.
- Installer fixture test:
  - Pages import/blocks entry is added once.
  - RenderBlocks import/map entry is added once.
  - Posts Lexical `BlocksFeature` entry is added once.
  - Repeat install does not duplicate anything.
- Registry reproducibility test includes `embed-basic`.
- Fresh Payload smoke includes `embed-basic` before release.

Release gate:

```bash
pnpm lint
pnpm source:build
pnpm exec tsc --noEmit
pnpm test:registry
pnpm run test:int
E2E_PORT=3100 pnpm run test:e2e
pnpm build
pnpm test:fresh -- --kits embed-basic
```

## Metrics

- `embed-basic` kit-notify votes before release.
- Copy-install-command clicks for `embed-basic`.
- Successful opt-in install telemetry for `embed-basic`.
- GitHub issues mentioning unsupported providers.
- Ratio of unsupported-provider issues to successful installs.

## Launch Notes

This kit should launch early because it proves two product claims at once:

- Payload Kits can wire real Page layout blocks.
- Payload Kits can also wire Post authoring blocks in Lexical.

The demo should show one install, then both admin surfaces:

1. Page Add Layout contains `Embed`.
2. Post Lexical block menu contains `Embed`.
3. A YouTube URL renders in both contexts.
4. `git diff --stat` shows source files, Pages patch, RenderBlocks patch, Posts
   patch, generated types, and import map.

