<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stars][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![npm][npm-shield]][npm-url]

<div align="center">
  <h1>Payload Components</h1>
  <p><strong>Payload CMS blocks, wired - not pasted.</strong></p>
  <p>
    Payload Components is an MIT, community-first registry and CLI for
    installing typed Payload CMS blocks into Payload v3 + Next.js projects.
    It copies the files, wires Payload config, regenerates generated artifacts,
    and leaves the whole install as a reviewable git diff.
  </p>
  <p>
    <a href="https://www.payload-components.xyz/docs"><strong>Explore the docs</strong></a>
    &middot;
    <a href="https://www.payload-components.xyz/components">Browse the catalog</a>
    &middot;
    <a href="./CONTRIBUTING.md">Contribute</a>
    &middot;
    <a href="https://github.com/Ducksss/payload-components/issues/new?template=bug_report.yml">Report a bug</a>
    &middot;
    <a href="https://github.com/Ducksss/payload-components/issues/new?template=feature_request.yml">Request a component</a>
  </p>
  <p>
    <a href="https://www.payload-components.xyz">
      <img
        src="https://www.payload-components.xyz/opengraph-image"
        alt="Payload Components social card: Install Payload blocks wired, not pasted."
        width="960"
      />
    </a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#why-it-exists">Why It Exists</a></li>
        <li><a href="#what-makes-this-different">What Makes This Different</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#what-lives-here">What Lives Here</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#use-a-component">Use A Component</a></li>
        <li><a href="#run-this-repo-locally">Run This Repo Locally</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#package-releases">Package Releases</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#community-examples">Community Examples</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#join-the-community">Join The Community</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

Payload Components installs Payload CMS blocks into supported Payload v3 +
Next.js projects.

A plain `shadcn add` copies files. `payload-components add` goes further:

- copies component source through the shadcn-compatible registry;
- registers the block in the Pages collection;
- maps the frontend renderer;
- regenerates Payload types and the admin import map;
- records install state so reruns converge instead of duplicating wiring.

This repository has two jobs:

- the Fumadocs-powered Next.js site for the landing page, docs, component
  catalog, search, Open Graph images, and AI-readable text surfaces;
- the `payload-components` registry and CLI that install blocks into consumer
  Payload projects.

This repository is not a Payload CMS runtime app. The docs site does not need
Payload admin routes, collections, globals, a database adapter, or
`PAYLOAD_SECRET`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Why It Exists

[Payload blocks][payload-blocks-guide-url] are not live when their files land.
They have to be registered, rendered, typed, and added to the admin import map.
That wiring is repetitive, easy to drift, and usually rediscovered project by
project.

Payload Components packages the block source and the wiring contract together.
The goal is a catalog that grows from real installs and pull requests: MIT,
open source, no pricing tiers, no license keys, no gated component access.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### What Makes This Different

- MIT end to end: registry, CLI, components, and docs site.
- No license keys, gated components, or paid component tiers.
- Community-driven requests and pull requests decide what ships next.
- One command installs source files plus the Payload wiring that makes them live.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [Next.js][next-url]
- [React][react-url]
- [Fumadocs][fumadocs-url]
- [Payload CMS][payload-url]
- [shadcn Registry][shadcn-url]
- [TypeScript][typescript-url]
- [Tailwind CSS][tailwind-url]
- [Playwright][playwright-url]
- [Vitest][vitest-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### What Lives Here

| Path                               | Purpose                                                     |
| ---------------------------------- | ----------------------------------------------------------- |
| `src/app`                          | Next.js routes, homepage, catalog, docs, search, and OG     |
| `src/components/site`              | Site UI, landing sections, install replay, cards, and demos |
| `src/lib/site.ts`                  | Shared site copy, component entries, FAQ, and demo data     |
| `content/docs`                     | Fumadocs MDX documentation                                  |
| `payload-components/registry.json` | Source shadcn registry definition                           |
| `payload-components/source`        | Payload target source files shipped into consumer repos     |
| `payload-components/manifests`     | Install metadata, fragments, post-install tasks, recovery   |
| `tools/payload-components`         | CLI implementation for `payload-components add`             |
| `bin/payload-components.mjs`       | CLI executable entrypoint                                   |
| `tests`                            | Playwright E2E and Vitest integration coverage              |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

There are two workflows: installing components into a Payload project, and
working on this repository.

### Use A Component

Run the CLI from the root of a supported Payload v3 + Next.js project:

```sh
npx payload-components add hero-basic
```

Preview the same validation and install plan without changing files, installing
dependencies, running generation commands, or updating install state:

```sh
npx payload-components add hero-basic --dry-run
```

The preview lists the component files, `RenderBlocks.tsx` renderer mapping,
`Pages/index.ts` block registration, package dependencies, and post-install
commands the real install would use.

To also write a prefilled demo script after the install succeeds, opt in with
`--demo`, then run the generated TypeScript through your project's Payload CLI:

```sh
npx payload-components add hero-basic --demo
pnpm exec payload run payload-components/seed-hero-basic.ts
```

For a component that is already installed, the standalone command writes the
same script:

```sh
npx payload-components seed hero-basic
pnpm exec payload run payload-components/seed-hero-basic.ts
```

`seed` requires a healthy installed-state record, compatible dependencies, every
manifest and registry-dependency file, and all Payload wiring fragments. It
writes the reviewable script plus a private ownership record under
`.payload-components/demo-state/`. The generated script requires Pages drafts
before querying or changing content, then creates a component-specific **draft**
Page at `/payload-components-demo-hero-basic`; it never publishes the demo. A
rerun updates only the exact Page ID recorded locally after verifying its
tokenized block marker. Placeholder media is reused only by its recorded ID and
is never deduplicated or deleted automatically. Before each create, the script
atomically journals a unique operation token; after an interruption it can
adopt only the single Page or Media carrying that exact private token and record
its returned ID before continuing. Any collision or missing,
mismatched, or unreadable ownership record stops before unsafe mutation. The CLI
atomically replaces only its version-marked generated script and refuses unowned
files or pre-existing symlinks. The operator-run script deliberately uses
`overrideAccess: true`, with `overrideLock: false` for updates, so review it in
git and run it only against the intended database.

Good first installs:

| Component            | Use it for                   |
| -------------------- | ---------------------------- |
| `hero-basic`         | A headline-led page hero     |
| `feature-grid-basic` | A repeatable feature grid    |
| `feature-split`      | A two-column feature section |
| `content-columns`    | Editorial content columns    |
| `logo-cloud-grid`    | A trust-logo wall            |
| `integration-grid`   | Integration cards            |

Browse the full, current set in the [component catalog][catalog-url].

#### All components

Every installable registry item, in catalog order. This table and the CLI's
`Current components` help output are both verified against
`payload-components/registry.json` by a focused test, so neither can silently
drift from the registry.

<!-- COMPONENT-INVENTORY:START -->

| Component                 | Install command                                      |
| ------------------------- | ---------------------------------------------------- |
| `hero-basic`              | `npx payload-components add hero-basic`              |
| `hero-video`              | `npx payload-components add hero-video`              |
| `hero-product-tilt`       | `npx payload-components add hero-product-tilt`       |
| `hero-aurora`             | `npx payload-components add hero-aurora`             |
| `hero-kinetic`            | `npx payload-components add hero-kinetic`            |
| `feature-grid-basic`      | `npx payload-components add feature-grid-basic`      |
| `feature-split`           | `npx payload-components add feature-split`           |
| `feature-bento`           | `npx payload-components add feature-bento`           |
| `feature-steps`           | `npx payload-components add feature-steps`           |
| `feature-accordion`       | `npx payload-components add feature-accordion`       |
| `feature-cards-media`     | `npx payload-components add feature-cards-media`     |
| `feature-icon-grid`       | `npx payload-components add feature-icon-grid`       |
| `embed-basic`             | `npx payload-components add embed-basic`             |
| `logo-cloud-grid`         | `npx payload-components add logo-cloud-grid`         |
| `logo-cloud-hover`        | `npx payload-components add logo-cloud-hover`        |
| `logo-cloud-marquee`      | `npx payload-components add logo-cloud-marquee`      |
| `logo-cloud-inline`       | `npx payload-components add logo-cloud-inline`       |
| `logo-cloud-inline-wrap`  | `npx payload-components add logo-cloud-inline-wrap`  |
| `content-columns`         | `npx payload-components add content-columns`         |
| `content-image-lead`      | `npx payload-components add content-image-lead`      |
| `content-feature-media`   | `npx payload-components add content-feature-media`   |
| `content-feature-split`   | `npx payload-components add content-feature-split`   |
| `content-showcase`        | `npx payload-components add content-showcase`        |
| `content-quote`           | `npx payload-components add content-quote`           |
| `content-community`       | `npx payload-components add content-community`       |
| `integration-grid`        | `npx payload-components add integration-grid`        |
| `integration-cluster`     | `npx payload-components add integration-cluster`     |
| `integration-split`       | `npx payload-components add integration-split`       |
| `integration-connect`     | `npx payload-components add integration-connect`     |
| `integration-orbit`       | `npx payload-components add integration-orbit`       |
| `integration-list`        | `npx payload-components add integration-list`        |
| `integration-marquee`     | `npx payload-components add integration-marquee`     |
| `integration-testimonial` | `npx payload-components add integration-testimonial` |
| `content-split-rows`      | `npx payload-components add content-split-rows`      |
| `content-rows`            | `npx payload-components add content-rows`            |
| `content-image-frame`     | `npx payload-components add content-image-frame`     |
| `content-stats`           | `npx payload-components add content-stats`           |
| `content-list`            | `npx payload-components add content-list`            |
| `content-list-columns`    | `npx payload-components add content-list-columns`    |
| `content-list-icons`      | `npx payload-components add content-list-icons`      |
| `call-to-action-centered` | `npx payload-components add call-to-action-centered` |
| `call-to-action-boxed`    | `npx payload-components add call-to-action-boxed`    |
| `call-to-action-signup`   | `npx payload-components add call-to-action-signup`   |
| `contact-routing-form`    | `npx payload-components add contact-routing-form`    |
| `team-roster`             | `npx payload-components add team-roster`             |
| `team-grid`               | `npx payload-components add team-grid`               |
| `faq-accordion`           | `npx payload-components add faq-accordion`           |
| `faq-split`               | `npx payload-components add faq-split`               |
| `faq-card`                | `npx payload-components add faq-card`                |
| `faq-icons`               | `npx payload-components add faq-icons`               |
| `faq-grouped`             | `npx payload-components add faq-grouped`             |
| `faq-grid`                | `npx payload-components add faq-grid`                |
| `comparator-table`        | `npx payload-components add comparator-table`        |
| `comparator-grid`         | `npx payload-components add comparator-grid`         |
| `comparator-stack`        | `npx payload-components add comparator-stack`        |
| `testimonials-quote`      | `npx payload-components add testimonials-quote`      |
| `testimonials-spotlight`  | `npx payload-components add testimonials-spotlight`  |
| `testimonials-grid`       | `npx payload-components add testimonials-grid`       |
| `testimonials-rating`     | `npx payload-components add testimonials-rating`     |
| `testimonials-bento`      | `npx payload-components add testimonials-bento`      |
| `testimonials-wall`       | `npx payload-components add testimonials-wall`       |
| `stats-proof`             | `npx payload-components add stats-proof`             |
| `pricing-cards`           | `npx payload-components add pricing-cards`           |
| `pricing-cards-muted`     | `npx payload-components add pricing-cards-muted`     |
| `pricing-cards-cta`       | `npx payload-components add pricing-cards-cta`       |
| `pricing-split`           | `npx payload-components add pricing-split`           |
| `pricing-enterprise`      | `npx payload-components add pricing-enterprise`      |

<!-- COMPONENT-INVENTORY:END -->

Install several blocks in one command — `add` takes any number of names, and the
catalog's composer builds the command for you as you tick components:

```sh
npx payload-components add hero-basic faq-card pricing-cards
```

Install every block a full-site template concept composes, then assemble its
pages in the admin:

```sh
npx payload-components templates
npx payload-components add-template saas-launch
```

`add-template` installs and wires the whole block set and prints which blocks
each page uses. Add `--demo` to also write one seed script per page, each
creating a draft Page from the blocks that page composes. Seeded content is each
block's own sample content, not the curated copy shown on the site.

Mark a block's text fields as localized for Payload localization:

```sh
npx payload-components add hero-basic --localized
```

This also installs `src/blocks/shared/localizeFields.ts` and wraps the block
config's field list in it, so the shared family base is covered too. Enable
`localization` in your Payload config for it to take effect, and migrate existing
data before adopting it on a populated collection.

#### Maintain an install

Recorded installs have a full lifecycle, not just a first run:

```sh
npx payload-components list              # catalog vs what this project recorded
npx payload-components diff              # version, file, and wiring drift
npx payload-components update            # re-install anything behind this CLI
npx payload-components remove hero-basic # delete owned files and unwire the block
```

`diff` exits non-zero when anything has drifted, so CI can gate on it. `update`
never overwrites a file you have edited — it skips that component and exits
non-zero until you pass `--force`. `remove` deletes only the files no other
installed component ships, so a shared family base survives while a sibling
variant is still installed; package dependencies are always left in place.
`list` and `diff` accept `--json`, and `update` and `remove` accept `--dry-run`.

Starting from a bare `create-payload-app` project? Lay down the base an install
needs — the Pages and Media collections, the blocks renderer, and the `cn` /
`CMSLink` / `Media` / `linkGroup` primitives every block imports:

```sh
npx payload-components init --scaffold
```

Nothing is overwritten: files you already have are kept, and a re-run creates
nothing. The result is the official starter's shape, so the project then detects
as `payload-website-starter`.

Check a target project without changing files:

```sh
npx payload-components doctor
```

`doctor` validates the supported project shape, resolves which files carry the
wiring, and checks required post-install scripts and any recorded
`.payload-components/state.json` installs.

#### Use it from a coding agent

`payload-components mcp` runs a Model Context Protocol server over stdio so an
agent can browse the registry, read a component's install contract, and preview
what an install would change:

```jsonc
// .mcp.json / your client's MCP config
{
  "mcpServers": {
    "payload-components": {
      "command": "npx",
      "args": ["-y", "payload-components", "mcp"],
    },
  },
}
```

Every tool is read-only by design. The server answers _which block and what will
it change_; installing stays an explicit `payload-components add` run in your
shell, where the diff is visible and approvable.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Run This Repo Locally

Use these steps to run the docs site and registry tooling.

Prerequisites:

- Node.js `^20.19.0 || >=22.12.0`
- pnpm `^9 || ^10`

Install and start:

```sh
git clone https://github.com/Ducksss/payload-components.git
cd payload-components
pnpm install --frozen-lockfile --ignore-workspace
pnpm source:build
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful local routes:

| Route                         | Purpose                       |
| ----------------------------- | ----------------------------- |
| `/`                           | Product and docs homepage     |
| `/docs`                       | Fumadocs documentation        |
| `/components`                 | Component catalog             |
| `/api/search`                 | Fumadocs search endpoint      |
| `/llms.txt`, `/llms-full.txt` | AI-readable project summaries |
| `/r/registry.json`            | Generated public registry     |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

The installer runs five idempotent stages:

1. Build or resolve the public registry item.
2. Add component files through the shadcn registry.
3. Install required dependencies.
4. Apply Payload fragments for collection registration and renderer mapping.
5. Run post-install scripts for generated types and the admin import map.

Install state is written to `.payload-components/state.json` inside the
consumer project, so partial installs are visible and retries can converge.

Demo scripts are separate and opt-in. `add <component> --demo` writes one only
after those install stages and installed-state recording succeed;
`seed <component>` rejects recorded partial installs and verifies the installed
state, dependencies, manifest and registry-dependency files, and Payload
fragments again. Its separate private demo-state file records the IDs the
operator-run script may update.
Neither command opens a database. The CLI prints the package-manager-specific
`payload run` command that performs the database work in your project.

### Recovering an interrupted install

If a stage fails, the component is recorded as `partial` and `payload-components add`
prints the failed stage, the last error, and the safest retry command. Fix the
reported cause, then rerun the same command from the project root:

```sh
npx payload-components add hero-basic
npx payload-components doctor
```

Review the git diff before editing anything by hand. The CLI distinguishes two
kinds of files: _owned component files_ (listed from the manifest, such as the
files under `src/blocks/HeroBasic/`) are safe to re-create by retrying, while
_patched host files_ are project files the installer edited and may hold your own
work — normally `src/blocks/RenderBlocks.tsx`, `src/collections/Pages/index.ts`,
`package.json`, and the package manager lockfile.

Prefer forward fixes over deletion. Do not delete patched host files to recover.
Use `payload-components doctor` to see the failed stage, missing files, missing
Payload fragments, and the owned/patched file breakdown before and after retrying.

Useful checks while changing this repo:

| Check                             | When to run                                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `pnpm lint`                       | After code changes to catch lint errors.                                                             |
| `pnpm source:build`               | After docs/frontmatter changes, or before type-checking a fresh checkout; compiles Fumadocs content. |
| `pnpm exec tsc --noEmit`          | After TypeScript changes, to type-check without writing build output.                                |
| `pnpm test:registry`              | After registry changes; checks schema validity and generated-output reproducibility.                 |
| `pnpm run test:int`               | After installer, manifest, docs, or source changes; covers those contracts.                          |
| `E2E_PORT=3100 pnpm run test:e2e` | After changes to site or browser behavior.                                                           |
| `pnpm build`                      | Before shipping, to validate the production build.                                                   |

Run the full local release gate before shipping:

```sh
pnpm test:release
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Package Releases

Public installs use the npm package:

```sh
npx payload-components add hero-basic
```

GitHub releases publish `payload-components` to npm and mirror
`@ducksss/payload-components` to GitHub Packages. Prerelease versions publish
under the `next` dist tag; stable versions publish under `latest`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

Payload Components stays open-source and community-first. The roadmap is about
improving the install contract, expanding useful blocks, and making real
contribution paths obvious.

Read [ROADMAP.md][roadmap-url] for the current direction, or use
[open issues][issues-url] for active work and component requests.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Community Examples

Sites and projects built with Payload Components. If you shipped something with
these blocks, add it here: open a [pull request][pull-requests-url] into `dev`
that appends one row to the table.

<!-- COMMUNITY-EXAMPLES:START -->

| Site | Author | Tags | Source |
| ---- | ------ | ---- | ------ |

<!-- COMMUNITY-EXAMPLES:END -->

Nothing listed yet, so the first row is available. Copy this, fill it in, and add
it to the end of the table:

```md
| [example.com](https://example.com) | [@you](https://github.com/you) | agency, marketing | [↗](https://github.com/you/example) |
```

Row guidelines:

- Site: a public, working URL, linked from the bare domain.
- Author: your GitHub handle, linked to your profile.
- Tags: a few words on what the site is, or the component families it leans on.
- Source: `[↗](repository-url)` when the code is public, `-` when it is not.

There is no minimum size and one installed block counts. Real installs are the
clearest signal about what to build next, so say in the pull request which
components you used and what you had to change.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome. The useful shape is a complete change: source,
manifest, docs, demo twin, and installer coverage together when adding or
changing a component.

Community docs:

- [CONTRIBUTING.md][contributing-url] - setup, branches, tests, and PR shape.
- [CODE_OF_CONDUCT.md][code-of-conduct-url] - how we keep discussion useful.
- [SECURITY.md][security-url] - how to report vulnerabilities privately.
- [ROADMAP.md][roadmap-url] - what is planned, and what is not.

Basic flow:

1. Fork the project.
2. Create a feature branch from `dev`.
3. Make the change with focused tests.
4. Run the relevant checks and note them in the pull request.
5. Open a pull request into `dev`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more
information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Join The Community

- Maintainer: [Ducksss](https://github.com/Ducksss)
- Website: [payload-components.xyz][site-url]
- Issues: [github.com/Ducksss/payload-components/issues][issues-url]
- Security: [GitHub Security Advisories][security-advisories-url]
- Project Link: [github.com/Ducksss/payload-components][repo-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Best-README-Template][best-readme-template-url] for the README structure.
- [Payload CMS][payload-url] for the target CMS ecosystem.
- [shadcn][shadcn-url] for the registry model Payload Components builds on.
- [tailark/blocks][tailark-url] (MIT) for marketing block layouts adapted into several component families.
- [Fumadocs][fumadocs-url] for the documentation site foundation.
- Everyone opening issues, testing installs, and contributing blocks in public.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[best-readme-template-url]: https://github.com/othneildrew/Best-README-Template
[catalog-url]: https://www.payload-components.xyz/components
[code-of-conduct-url]: ./CODE_OF_CONDUCT.md
[contributing-url]: ./CONTRIBUTING.md
[contributors-shield]: https://img.shields.io/github/contributors/Ducksss/payload-components.svg?style=for-the-badge
[contributors-url]: https://github.com/Ducksss/payload-components/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Ducksss/payload-components.svg?style=for-the-badge
[forks-url]: https://github.com/Ducksss/payload-components/network/members
[fumadocs-url]: https://fumadocs.dev
[issues-shield]: https://img.shields.io/github/issues/Ducksss/payload-components.svg?style=for-the-badge
[issues-url]: https://github.com/Ducksss/payload-components/issues
[license-shield]: https://img.shields.io/github/license/Ducksss/payload-components.svg?style=for-the-badge
[license-url]: https://github.com/Ducksss/payload-components/blob/main/LICENSE
[next-url]: https://nextjs.org
[npm-shield]: https://img.shields.io/npm/v/payload-components.svg?style=for-the-badge
[npm-url]: https://www.npmjs.com/package/payload-components
[payload-blocks-guide-url]: https://www.payload-components.xyz/docs/payload-blocks
[payload-url]: https://payloadcms.com
[playwright-url]: https://playwright.dev
[pull-requests-url]: https://github.com/Ducksss/payload-components/pulls
[react-url]: https://react.dev
[repo-url]: https://github.com/Ducksss/payload-components
[roadmap-url]: ./ROADMAP.md
[security-advisories-url]: https://github.com/Ducksss/payload-components/security/advisories
[security-url]: ./SECURITY.md
[shadcn-url]: https://ui.shadcn.com/docs/registry
[site-url]: https://www.payload-components.xyz
[stars-shield]: https://img.shields.io/github/stars/Ducksss/payload-components.svg?style=for-the-badge
[stars-url]: https://github.com/Ducksss/payload-components/stargazers
[tailark-url]: https://github.com/tailark/blocks
[tailwind-url]: https://tailwindcss.com
[typescript-url]: https://www.typescriptlang.org
[vitest-url]: https://vitest.dev
