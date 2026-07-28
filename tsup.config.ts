import { readFileSync } from 'node:fs'

import { defineConfig } from 'tsup'

// The shadcn CLI version is single-sourced from the `shadcn` devDependency so a
// version bump only has to land in one place. The published bundle cannot read
// the repo's package.json at runtime, so inline the value at build time.
const { devDependencies } = JSON.parse(readFileSync('package.json', 'utf8')) as {
  devDependencies: Record<string, string>
}

// Bundles the CLI to a single plain-ESM file so the published package boots
// under Node without tsx and with only `ajv` + `semver` as runtime deps.
export default defineConfig({
  banner: { js: '#!/usr/bin/env node' },
  bundle: true,
  clean: true,
  define: { __SHADCN_CLI_VERSION__: JSON.stringify(devDependencies.shadcn) },
  entry: { cli: 'tools/payload-components/cli.ts' },
  external: ['ajv', 'semver'],
  format: ['esm'],
  outDir: 'dist',
  platform: 'node',
  target: 'node20',
})
