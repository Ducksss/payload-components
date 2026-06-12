# Payload Kits

Payload Kits is an MIT-licensed catalog and CLI for installing Payload CMS block kits into supported Payload v3 + Next.js projects.

The v2 website is a Fumadocs app. It is not a Payload CMS app and does not require Payload admin routes, collections, globals, a database adapter, or `PAYLOAD_SECRET` to render the docs site.

## What Lives Here

- `src/app`: Fumadocs/Next.js app routes, homepage, catalog, docs, search, and LLM text surfaces.
- `content/docs`: MDX documentation compiled by Fumadocs MDX.
- `payload-kits/registry.json`: shadcn-compatible public registry definition.
- `payload-kits/source`: Payload-target kit source files used by registry generation.
- `payload-kits/manifests`: wrapper metadata for install support, fragments, post-install tasks, and recovery.
- `tools/payload-kit`: CLI implementation for `payload-kit add` and `payload-kit doctor`.
- `bin/payload-kit.mjs`: executable entrypoint.

## Local Development

```bash
pnpm install --frozen-lockfile --ignore-workspace
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Core routes:

- `/`: light-first product/docs homepage
- `/docs`: Fumadocs documentation
- `/components`: current kit catalog
- `/api/search`: Fumadocs search endpoint
- `/llms.txt` and `/llms-full.txt`: AI-readable project summaries
- `/llms.mdx/docs/.../content.md`: per-page markdown generated from compiled docs
- `/docs/installation.md`: markdown shortcut rewritten to the matching per-page markdown route
- `/og/docs/.../image.png`: per-page docs Open Graph image
- `/r/registry.json`: generated public registry

The active public registry template is `https://payload-components.xyz/r/{name}.json`.

## Registry Workflow

Build the production app. The prebuild step regenerates the Fumadocs source cache and public registry:

```bash
pnpm build
```

Check that generated output is reproducible:

```bash
pnpm test:registry
```

Install commands documented by the current alpha:

```bash
npx payload-kit add hero-basic
npx payload-kit add feature-grid-basic
npx payload-kit doctor --json
```

Direct shadcn installs can deliver files, but the wrapper CLI owns Payload-specific work: project-shape detection, layout fragments, render-block fragments, post-install scripts, and install state.

`payload-kit doctor` exits `0` for healthy supported targets, `1` for recoverable install drift, and `2` for unsupported or fatal project detection states.

## Validation

```bash
pnpm test:release
```

`pnpm run test:install` runs the fast installer fixture suite against a generated minimal Payload target. `pnpm test:fresh` remains available for slower smoke coverage against a fresh external Payload app.

## Architecture Boundary

Payload is the target ecosystem, not the website runtime.

That means:

- The docs app must build without a Payload secret or database.
- Payload-specific source files stay in `payload-kits/source`.
- Install behavior is validated against target fixtures and fresh Payload projects.
- New kits should add docs, manifest metadata, registry source, and installer tests together.
- Generated outputs such as `.next`, `.source`, `public/r`, Playwright reports, and TypeScript build info stay out of git.

## License

MIT
