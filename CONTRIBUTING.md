# Contributing to Payload Kits

Thanks for helping improve Payload Kits. This project is a Payload CMS v3 and
Next.js app that also ships a small registry-backed block-kit installer.

## Good First Contributions

Useful contributions usually fit one of these tracks:

- Improve or add installable kit manifests under `payload-kits/`.
- Tighten the `payload-kit` CLI behavior in `tools/payload-kit/`.
- Improve docs, gallery examples, registry checks, or launch assets.
- Fix Payload, Next.js, TypeScript, accessibility, or test issues.

Open an issue before large architectural changes so we can keep the registry,
CLI, and Payload integration direction coherent.

## Local Setup

Use Node.js `^18.20.2 || >=20.9.0` and pnpm `^9 || ^10`.

```sh
pnpm install
cp .env.example .env
pnpm dev
```

The app expects Postgres. Make sure `.env` includes `POSTGRES_URL`,
`PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `PREVIEW_SECRET`, and
`CRON_SECRET`.

## Development Rules

- Keep changes TypeScript-first and follow the existing project patterns.
- For Payload schema changes, run `pnpm generate:types`.
- For admin component changes, run `pnpm generate:importmap`.
- In Payload hooks, pass `req` to nested Local API operations.
- When passing `user` to Payload Local API calls, set `overrideAccess: false`
  unless the operation is intentionally administrative.
- Keep generated registry output out of git. `public/r` is build output.

## Verification

Run the focused checks that match your change, then run the broader suite before
opening a pull request when practical:

```sh
pnpm lint
pnpm exec tsc --noEmit
pnpm registry:check
pnpm run test:int
pnpm run test:e2e
pnpm build
```

For release-sensitive registry work, run:

```sh
pnpm test:release
```

## Pull Requests

Pull requests should include:

- A clear description of what changed and why.
- Screenshots or short notes for visible UI changes.
- The tests/checks you ran.
- Notes about generated types, import maps, or registry output when relevant.

By contributing, you agree that your contributions are licensed under the MIT
license used by this repository.
