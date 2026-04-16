# Payload Kits POC

This directory holds the viability-first proof of concept for `payload-kit`.

## Goal

Prove that a real shadcn-compatible registry item can be wrapped by `payload-kit add hero-basic`, then wired into Payload and regenerated successfully.

## Viability Gate

The POC passes only if all of the following are true:

- `payload-kit add hero-basic` installs the kit through a real shadcn-compatible registry flow.
- The install adds the block source files to the target project.
- The install wires the block into `src/blocks/RenderBlocks.tsx`.
- The install wires the block into `src/collections/Pages/index.ts`.
- The install runs `generate:types` and `generate:importmap` successfully.
- A second install is idempotent.

If any of those fail because of brittle repo patching or unreliable generation, we should stop and reconsider the product shape before building private registries, auth, or a larger kit catalog.

## POC Contract

The POC manifest only covers the minimum surface needed for one golden kit:

- kit identity and version
- supported Payload and Next.js majors
- files to install
- Payload-specific fragments to register
- post-install tasks
- preview metadata and sample content

## Files

- `registry.json`: shadcn-compatible local registry definition
- `manifests/hero-basic.json`: golden kit manifest
- `schema/poc-manifest.schema.json`: manifest validation schema
- `support-matrix.json`: supported repo-shape contract for the POC

## Manual Smoke Test

```bash
pnpm payload-kit add hero-basic
pnpm payload-kit doctor
```
