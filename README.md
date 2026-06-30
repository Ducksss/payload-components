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

Payload blocks are not live when their files land. They have to be registered,
rendered, typed, and added to the admin import map. That wiring is repetitive,
easy to drift, and usually rediscovered project by project.

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

Good first installs:

| Component            | Use it for                         |
| -------------------- | ---------------------------------- |
| `hero-basic`         | A headline-led page hero           |
| `feature-grid-basic` | A repeatable feature grid          |
| `feature-split`      | A two-column feature section       |
| `content-columns`    | Editorial content columns          |
| `logo-cloud-grid`    | A trust-logo wall                  |
| `integration-grid`   | Integration cards                  |

Browse the full, current set in the [component catalog][catalog-url].

Check a target project without changing files:

```sh
npx payload-components doctor
```

`doctor` validates the supported project shape, required post-install scripts,
and any recorded `.payload-components/state.json` installs.

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

```sh
pnpm lint
pnpm source:build
pnpm exec tsc --noEmit
pnpm test:registry
pnpm run test:int
E2E_PORT=3100 pnpm run test:e2e
pnpm build
```

Run the full local release gate before broad changes:

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

## Contributing

Contributions are welcome. The useful shape is a complete change: source,
manifest, docs, demo twin, and installer coverage together when adding or
changing a component.

[![Good First Issues][good-first-issues-shield]][good-first-issues-url]

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
- [Fumadocs][fumadocs-url] for the documentation site foundation.
- Everyone opening issues, testing installs, and contributing blocks in public.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[best-readme-template-url]: https://github.com/othneildrew/Best-README-Template
[catalog-url]: https://www.payload-components.xyz/components
[code-of-conduct-url]: ./CODE_OF_CONDUCT.md
[contributing-url]: ./CONTRIBUTING.md
[contributors-shield]: https://img.shields.io/github/contributors/Ducksss/payload-components.svg?style=for-the-badge
[contributors-url]: https://github.com/Ducksss/payload-components/graphs/contributors
[good-first-issues-shield]: https://img.shields.io/github/issues/Ducksss/payload-components/good%20first%20issue.svg?style=for-the-badge
[good-first-issues-url]: https://github.com/Ducksss/payload-components/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22
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
[roadmap-url]: ./ROADMAP.md
[security-advisories-url]: https://github.com/Ducksss/payload-components/security/advisories
[security-url]: ./SECURITY.md
[shadcn-url]: https://ui.shadcn.com/docs/registry
[site-url]: https://www.payload-components.xyz
[stars-shield]: https://img.shields.io/github/stars/Ducksss/payload-components.svg?style=for-the-badge
[stars-url]: https://github.com/Ducksss/payload-components/stargazers
[tailwind-url]: https://tailwindcss.com
[typescript-url]: https://www.typescriptlang.org
[vitest-url]: https://vitest.dev
