import { defineConfig } from 'tsup'

// Bundles the CLI to a single plain-ESM file so the published package boots
// under Node without tsx and with only `ajv` + `semver` as runtime deps.
export default defineConfig({
  banner: { js: '#!/usr/bin/env node' },
  bundle: true,
  clean: true,
  entry: { cli: 'tools/payload-components/cli.ts' },
  external: ['ajv', 'semver'],
  format: ['esm'],
  outDir: 'dist',
  platform: 'node',
  target: 'node20',
})
