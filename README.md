<a id="readme-top"></a>

[![MIT License][license-shield]][license-url]
[![Issues][issues-shield]][issues-url]
[![Stars][stars-shield]][stars-url]

<div align="center">
  <h1>Payload Kits</h1>
  <p>
    Open-source block kits for Payload CMS, installed into Payload v3 + Next.js
    projects with the wiring included.
  </p>
  <p>
    <a href="https://payload-components.xyz/docs"><strong>Explore the docs</strong></a>
    &middot;
    <a href="https://payload-components.xyz/components">Browse kits</a>
    &middot;
    <a href="https://github.com/Ducksss/payload-components/issues/new?template=bug_report.yml">Report a bug</a>
    &middot;
    <a href="https://github.com/Ducksss/payload-components/issues/new?template=feature_request.yml">Request a kit</a>
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
    <li><a href="#development-workflows">Development Workflows</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

Payload Kits is an MIT-licensed catalog and CLI for installing Payload CMS
block kits into supported Payload v3 + Next.js projects.

A plain `shadcn add` copies files. `payload-kit add` also registers the block
in the Payload collection, maps the renderer, regenerates types, regenerates
the admin import map, and records install state so reruns converge.

This repository is both:

- The Fumadocs-powered Next.js website for the landing page, docs, catalog,
  search, Open Graph images, and AI-readable text surfaces.
- The `payload-kit` registry and CLI that distribute installable kits into
  consumer Payload projects.

This repository is not a Payload CMS runtime app. The website does not need
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

| Path                         | Purpose                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| `src/app`                    | Next.js app routes, homepage, catalog, docs, search, LLM text surfaces, and OG images |
| `src/components/site`        | Site UI, landing sections, install replay, kit cards, and demo twins                  |
| `src/lib/site.ts`            | Central copy/data source for landing copy, kit entries, FAQ, and demos                |
| `content/docs`               | Fumadocs MDX documentation                                                            |
| `payload-kits/registry.json` | Source shadcn registry definition                                                     |
| `payload-kits/source`        | Payload target source files shipped into consumer repos                               |
| `payload-kits/manifests`     | Install metadata, fragments, post-install tasks, and recovery contract                |
| `tools/payload-kit`          | CLI implementation for `payload-kit add`                                              |
| `bin/payload-kit.mjs`        | CLI executable entrypoint                                                             |
| `tests`                      | Playwright E2E and Vitest integration coverage                                        |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

Follow these steps to run the docs site and registry tooling locally.

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

Install a kit into a supported Payload v3 + Next.js project:

```sh
npx payload-kit add hero-basic
npx payload-kit add feature-grid-basic
```

The installer runs five idempotent stages:

1. Build the public registry output.
2. Add kit files through the shadcn registry.
3. Install required dependencies.
4. Apply Payload fragments for collection registration and renderer mapping.
5. Run post-install scripts for generated types and the admin import map.

Generated install state is written to `.payload-kit/state.json` inside the
consumer project.

Useful local routes:

- `/` - product and docs homepage
- `/docs` - Fumadocs documentation
- `/components` - kit catalog
- `/api/search` - Fumadocs search endpoint
- `/llms.txt` and `/llms-full.txt` - AI-readable project summaries
- `/r/registry.json` - generated public registry

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Development Workflows

Build the production app. The prebuild step regenerates the Fumadocs source
cache and public registry.

```sh
pnpm build
```

Check that generated registry output is reproducible:

```sh
pnpm test:registry
```

Run the full release gate before shipping broad changes:

```sh
pnpm test:release
```

For focused work, run the smallest useful check first:

```sh
pnpm lint
pnpm source:build
pnpm exec tsc --noEmit
pnpm test:registry
pnpm run test:int
pnpm run test:e2e
pnpm build
```

Use `E2E_PORT=3100 pnpm run test:e2e` when port `3000` is busy.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

The project stays community-first: more kits, stronger install recovery,
clearer docs, and better compatibility coverage for real Payload projects.

See [ROADMAP.md](./ROADMAP.md) and the
[open issues](https://github.com/Ducksss/payload-components/issues) for active
work.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome. The useful shape is a complete change: source,
manifest, docs, and installer coverage together when adding or changing a kit.

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

- Website: [payload-components.xyz](https://payload-components.xyz)
- Issues: [github.com/Ducksss/payload-components/issues][issues-url]
- Repository: [github.com/Ducksss/payload-components][repo-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Best-README-Template][best-readme-template-url] for the README structure.
- [Payload CMS][payload-url] for the target CMS ecosystem.
- [shadcn][shadcn-url] for the registry model Payload Kits builds on.
- [Fumadocs][fumadocs-url] for the documentation site foundation.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[best-readme-template-url]: https://github.com/othneildrew/Best-README-Template
[fumadocs-url]: https://fumadocs.dev
[issues-shield]: https://img.shields.io/github/issues/Ducksss/payload-components.svg?style=for-the-badge
[issues-url]: https://github.com/Ducksss/payload-components/issues
[license-shield]: https://img.shields.io/github/license/Ducksss/payload-components.svg?style=for-the-badge
[license-url]: https://github.com/Ducksss/payload-components/blob/main/LICENSE
[next-url]: https://nextjs.org
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
