<a id="readme-top"></a>

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<div align="center">
  <h3 align="center">Payload Components</h3>

  <p align="center">
    A Payload CMS v3 + Next.js App Router codebase customized into a marketing site for the Payload Kits product concept.
    <br />
    <br />
    <a href="https://github.com/Ducksss/payload-components"><strong>Explore the repo »</strong></a>
    ·
    <a href="https://github.com/Ducksss/payload-components/issues/new?template=early-access.yml"><strong>Request early access »</strong></a>
    <br />
    <br />
    <a href="./PAYLOAD-PLAN.md">Read the product plan</a>
    ·
    <a href="./marketing/README.md">Open the launch assets</a>
    ·
    <a href="https://github.com/Ducksss/payload-components/issues">Report Bug</a>
    ·
    <a href="https://github.com/Ducksss/payload-components/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
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
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

This repository started from Payload's website template and now serves as a Payload-native marketing site for the Payload Kits idea: curated block kits for Payload v3 + Next.js projects.

Today, the codebase already includes:

- A custom product landing page at `/` (with `/landing` redirecting to `/`)
- Payload CMS collections for pages, posts, media, categories, and users
- Globals for header and footer content
- SEO, redirects, search, form builder, live preview, and scheduled jobs
- A Next.js App Router frontend alongside the Payload admin

The important boundary: the marketing narrative talks about `payload-kit init`, `payload-kit add`, and `payload-kit doctor`, but that CLI and registry workflow are still roadmap items, not implemented in this repo yet. The shipped code is the website and CMS foundation around that concept.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Early Access

This repo now includes a few concrete launch surfaces for the early channel plan:

- GitHub intake: use the [early access / design partner issue template](https://github.com/Ducksss/payload-components/issues/new?template=early-access.yml)
- Site CTA flow: the homepage waitlist now captures `source`, `intent`, `role`, and `utm_*` context before emailing the signup through Resend
- Owned-content layer: the app includes a `/resources` hub with static Payload-native guides you can use for SEO and community sharing
- Operator assets: see [`marketing/README.md`](./marketing/README.md) for launch playbooks, community post drafts, and outreach templates

This keeps the first push aligned with a waitlist + design-partner motion instead of broad paid acquisition.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [Payload CMS](https://payloadcms.com/)
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel Postgres Adapter for Payload](https://www.npmjs.com/package/@payloadcms/db-vercel-postgres)
- [Playwright](https://playwright.dev/)
- [Vitest](https://vitest.dev/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

This project runs as a standard Payload + Next.js app. The main local goal is to get the CMS, frontend, and homepage resources running against a Postgres database.

> [!IMPORTANT]
> The current app config in [`src/payload.config.ts`](./src/payload.config.ts) uses `POSTGRES_URL`, but the committed [`.env.example`](./.env.example) and [`docker-compose.yml`](./docker-compose.yml) still reflect the older Mongo-based upstream template. Use Postgres for local setup.

### Prerequisites

- Node.js `^18.20.2 || >=20.9.0`
- `pnpm` `^9 || ^10`
- A running Postgres database
- Values for:
  - `POSTGRES_URL`
  - `PAYLOAD_SECRET`
  - `NEXT_PUBLIC_SERVER_URL`
  - `PREVIEW_SECRET`
  - `CRON_SECRET`

### Installation

1. Clone the repo.

   ```sh
   git clone https://github.com/Ducksss/payload-components.git
   cd payload-components
   ```

2. Install dependencies.

   ```sh
   pnpm install
   ```

3. Copy the environment template.

   ```sh
   cp .env.example .env
   ```

4. Update `.env` so it matches the current config. At minimum, make sure it contains:

   ```env
   POSTGRES_URL=postgresql://127.0.0.1:5432/payload_components
   PAYLOAD_SECRET=replace_me
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   PREVIEW_SECRET=replace_me
   CRON_SECRET=replace_me
   RESEND_API_KEY=re_xxxxxxxxx
   WAITLIST_EMAIL_TO=chaipinzheng@gmail.com
   WAITLIST_EMAIL_FROM=onboarding@resend.dev
   ```

   The homepage waitlist CTA sends signup notifications through Resend server-side. Without a
   verified sending domain, `onboarding@resend.dev` is Resend's sandbox sender and can only send to
   the email address on your Resend account. To email any recipient, verify a domain in Resend and
   change `WAITLIST_EMAIL_FROM` to an address from that domain. These entries intentionally bypass
   Payload storage and are not saved in the CMS.

5. Start the development server.

   ```sh
   pnpm dev
   ```

6. Open the app:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Product landing page: [http://localhost:3000](http://localhost:3000)
   - Resources hub: [http://localhost:3000/resources](http://localhost:3000/resources)
   - Payload admin: [http://localhost:3000/admin](http://localhost:3000/admin)

7. Create your first admin user when prompted, then optionally use the dashboard seed flow to populate demo content.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

This repo is most useful in three modes:

1. Marketing site prototype
   - Visit `/` to review the Payload Kits positioning, product proof, GitHub CTA path, and early-access flow.
   - Visit `/resources` to browse the first Payload-native guides for SEO and community distribution.

2. Payload CMS starter
   - Use `/admin` to manage pages, posts, media, categories, header, and footer content.
   - The frontend routes continue to use the underlying Payload website template structure.

3. Component and content workflow sandbox
   - Iterate on blocks, frontend components, and admin-safe content models inside a real Payload v3 project.
   - The homepage waitlist form emails signups through Resend instead of storing them in Payload.
   - The GitHub issue template and `marketing/` docs give you an executable early-channel operating layer inside the repo.

Useful scripts:

```sh
pnpm dev                  # Start local development
pnpm build                # Create a production build
pnpm start                # Run the production build
pnpm generate:types       # Refresh payload-types.ts after schema changes
pnpm generate:importmap   # Refresh the admin import map after component changes
pnpm lint                 # Run ESLint
pnpm test                 # Run integration + E2E tests
pnpm exec tsc --noEmit    # Validate TypeScript correctness
```

If you change collections, globals, or field schemas, regenerate types. If you add or change admin components, regenerate the import map as well.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Rework the stock Payload website template into a Payload Kits marketing experience
- [x] Add a custom `/landing` route and supporting UI components
- [ ] Implement the `payload-kit` CLI workflows described on the landing page
- [ ] Define installable kit manifests and a registry delivery model
- [ ] Align local infrastructure files with the current Postgres adapter setup
- [ ] Add deeper docs and screenshots for real kit installation flows

For the broader direction, see [PAYLOAD-PLAN.md](./PAYLOAD-PLAN.md).

For the current execution assets, see [`marketing/README.md`](./marketing/README.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome, especially if they improve the developer experience, tighten the Payload integration story, or help move the repo from marketing concept toward a real kit platform.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

If you are changing schemas or admin components, please regenerate types and the import map before opening the PR.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

This repo is marked as MIT in [package.json](./package.json). A dedicated `LICENSE` file has not been added yet.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Maintainer: [@Ducksss](https://github.com/Ducksss)

Project Link: [https://github.com/Ducksss/payload-components](https://github.com/Ducksss/payload-components)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Best README Template](https://github.com/othneildrew/Best-README-Template)
- [Payload Website Template](https://github.com/payloadcms/payload/tree/main/templates/website)
- [Payload Docs](https://payloadcms.com/docs)
- [shadcn/ui Registry Docs](https://ui.shadcn.com/docs/registry/introduction)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[forks-shield]: https://img.shields.io/github/forks/Ducksss/payload-components.svg?style=for-the-badge
[forks-url]: https://github.com/Ducksss/payload-components/network/members
[stars-shield]: https://img.shields.io/github/stars/Ducksss/payload-components.svg?style=for-the-badge
[stars-url]: https://github.com/Ducksss/payload-components/stargazers
[issues-shield]: https://img.shields.io/github/issues/Ducksss/payload-components.svg?style=for-the-badge
[issues-url]: https://github.com/Ducksss/payload-components/issues
[license-shield]: https://img.shields.io/badge/license-MIT-2ea44f?style=for-the-badge
[license-url]: ./package.json
