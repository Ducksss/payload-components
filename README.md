<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stars][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![npm][npm-shield]][npm-url]

<div align="center">
  <h1>Payload Components</h1>
  <p><strong>Install Payload CMS blocks wired, not pasted.</strong></p>
  <p>
    Payload Components is an MIT, community-first registry and CLI for
    installing typed Payload CMS blocks into Payload v3 + Next.js projects.
    It copies the files, wires the Payload config, regenerates types, and
    leaves a reviewable git diff.
  </p>
  <p>
    <a href="https://www.payload-components.xyz/docs"><strong>Explore the docs</strong></a>
    &middot;
    <a href="https://www.payload-components.xyz/components">View demo</a>
    &middot;
    <a href="https://github.com/Ducksss/payload-components/issues/new?template=bug_report.yml">Report a bug</a>
    &middot;
    <a href="https://github.com/Ducksss/payload-components/issues/new?template=feature_request.yml">Request a component</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#what-lives-here">What Lives Here</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#package-releases">Package Releases</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

Payload Components installs Payload CMS blocks into supported Payload v3 +
Next.js projects. A plain `shadcn add` copies files. `payload-components add`
also does the Payload work that makes a block usable:

- copies source through the shadcn-compatible registry;
- registers the block in the Pages collection;
- maps the frontend renderer;
- regenerates Payload types and the admin import map;
- records install state so reruns converge.

This repository has two jobs:

- The Fumadocs-powered Next.js site for the landing page, docs, component
  catalog, search, Open Graph images, and AI-readable text surfaces.
- The `payload-components` registry and CLI that install components into
  consumer Payload projects.

This repository is not a Payload CMS runtime app. The site does not need
Payload admin routes, collections, globals, a database adapter, or
`PAYLOAD_SECRET`.

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

These steps run the docs site and registry tooling locally. To install a
component, run the commands in [Usage](#usage) from a supported Payload project,
not from this repository.

### Prerequisites

- Node.js `^20.19.0 || >=22.12.0`
- pnpm `^9 || ^10`

### Installation

1. Clone the repository.

   ```sh
   git clone https://github.com/Ducksss/payload-components.git
   cd payload-components
   ```

2. Install dependencies.

   ```sh
   pnpm install --frozen-lockfile --ignore-workspace
   ```

3. Build the Fumadocs source cache.

   ```sh
   pnpm source:build
   ```

4. Start the development server.

   ```sh
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Install a component from the root of a supported Payload v3 + Next.js project:

```sh
npx payload-components add hero-basic
npx payload-components add feature-grid-basic
npx payload-components add feature-split
npx payload-components add feature-bento
npx payload-components add feature-steps
npx payload-components add embed-basic
npx payload-components add content-columns
npx payload-components add content-image-lead
npx payload-components add content-feature-media
npx payload-components add content-feature-split
npx payload-components add content-showcase
npx payload-components add content-quote
npx payload-components add content-community
npx payload-components add content-split-rows
npx payload-components add content-rows
npx payload-components add content-image-frame
npx payload-components add content-stats
npx payload-components add content-list
npx payload-components add content-list-columns
npx payload-components add content-list-icons
npx payload-components add logo-cloud-grid
npx payload-components add logo-cloud-hover
npx payload-components add logo-cloud-marquee
npx payload-components add logo-cloud-inline
npx payload-components add logo-cloud-inline-wrap
npx payload-components add integration-grid
npx payload-components add integration-cluster
npx payload-components add integration-split
npx payload-components add integration-connect
npx payload-components add integration-orbit
npx payload-components add integration-list
npx payload-components add integration-marquee
npx payload-components add integration-testimonial
npx payload-components add call-to-action-centered
npx payload-components add call-to-action-boxed
npx payload-components add call-to-action-signup
npx payload-components add team-roster
npx payload-components add team-grid
```

Current installable page blocks:

| Component                 | Target                    |
| ------------------------- | ------------------------- |
| `hero-basic`              | Headline-led hero         |
| `feature-grid-basic`      | Repeatable feature grid   |
| `feature-split`           | Two-column feature list   |
| `feature-bento`           | Asymmetric bento grid     |
| `feature-steps`           | Numbered process steps    |
| `embed-basic`             | Responsive iframe embed   |
| `content-columns`         | Editorial content columns |
| `content-image-lead`      | Image-led content section |
| `content-feature-media`   | Media feature section     |
| `content-feature-split`   | Split content feature     |
| `content-showcase`        | Showcase content section  |
| `content-quote`           | Editorial quote section   |
| `content-community`       | Community content section |
| `content-split-rows`      | Split content row stack   |
| `content-rows`            | Alternating content rows  |
| `content-image-frame`     | Framed image content      |
| `content-stats`           | Content stats panel       |
| `content-list`            | Structured content list   |
| `content-list-columns`    | Columned content list     |
| `content-list-icons`      | Icon-led content list     |
| `logo-cloud-grid`         | Logo wall grid            |
| `logo-cloud-hover`        | Logo wall with hover CTA  |
| `logo-cloud-marquee`      | Scrolling logo marquee    |
| `logo-cloud-inline`       | Inline trust-logo strip   |
| `logo-cloud-inline-wrap`  | Wrapping inline logo row  |
| `integration-grid`        | Integration card grid     |
| `integration-cluster`     | Clustered integration CTA |
| `integration-split`       | Split integration section |
| `integration-connect`     | Connected integration map |
| `integration-orbit`       | Orbiting integration set  |
| `integration-list`        | Integration list rows     |
| `integration-marquee`     | Integration logo marquee  |
| `integration-testimonial` | Integration testimonial   |
| `call-to-action-centered` | Centered CTA section      |
| `call-to-action-boxed`    | Boxed CTA panel           |
| `call-to-action-signup`   | Email capture CTA         |
| `team-roster`             | Grouped team roster       |
| `team-grid`               | Team photo grid           |

Check a target project without changing files:

```sh
npx payload-components doctor
```

`doctor` validates the supported project shape, required post-install scripts,
and any recorded `.payload-components/state.json` installs.

The installer runs five idempotent stages:

1. Build or resolve the public registry item.
2. Add component files through the shadcn registry.
3. Install required dependencies.
4. Apply Payload fragments for collection registration and renderer mapping.
5. Run post-install scripts for generated types and the admin import map.

Generated install state is written to `.payload-components/state.json` inside
the consumer project.

Useful local routes while working on this repo:

- `/` - product and docs homepage
- `/docs` - Fumadocs documentation
- `/components` - component catalog
- `/api/search` - Fumadocs search endpoint
- `/llms.txt` and `/llms-full.txt` - AI-readable project summaries
- `/r/registry.json` - generated public registry

Useful local checks:

```sh
pnpm lint
pnpm source:build
pnpm exec tsc --noEmit
pnpm test:registry
pnpm run test:int
E2E_PORT=3100 pnpm run test:e2e
pnpm build
```

Run the full release gate before broad changes:

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
`@ducksss/payload-components` to GitHub Packages. Add an `NPM_TOKEN`
repository secret with npm publish access before publishing a release.
Prerelease versions publish under the `next` dist tag; stable versions publish
under `latest`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

Payload Components stays open-source and community-first: more components,
stronger install recovery, clearer docs, and better compatibility coverage for
real Payload projects.

See [ROADMAP.md](./ROADMAP.md) for the current direction and use the
[open issues](https://github.com/Ducksss/payload-components/issues) for active
work and component requests.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome. The useful shape is a complete change: source,
manifest, docs, and installer coverage together when adding or changing a
component.

1. Fork the project.
2. Create a feature branch from `dev`.
3. Make the change with focused tests.
4. Run the relevant checks and note them in the pull request.
5. Open a pull request into `dev`.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, project boundaries, and
pull request expectations.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more
information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

- Maintainer: [Ducksss](https://github.com/Ducksss)
- Website: [payload-components.xyz](https://www.payload-components.xyz)
- Issues: [github.com/Ducksss/payload-components/issues][issues-url]
- Security: use GitHub Security Advisories for this repository
- Project Link: [github.com/Ducksss/payload-components][repo-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Best-README-Template][best-readme-template-url] for the README structure.
- [Payload CMS][payload-url] for the target CMS ecosystem.
- [shadcn][shadcn-url] for the registry model Payload Components builds on.
- [Fumadocs][fumadocs-url] for the documentation site foundation.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[best-readme-template-url]: https://github.com/othneildrew/Best-README-Template
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
[payload-url]: https://payloadcms.com
[playwright-url]: https://playwright.dev
[react-url]: https://react.dev
[repo-url]: https://github.com/Ducksss/payload-components
[shadcn-url]: https://ui.shadcn.com/docs/registry
[stars-shield]: https://img.shields.io/github/stars/Ducksss/payload-components.svg?style=for-the-badge
[stars-url]: https://github.com/Ducksss/payload-components/stargazers
[tailwind-url]: https://tailwindcss.com
[typescript-url]: https://www.typescriptlang.org
[vitest-url]: https://vitest.dev
