import { readFile } from 'node:fs/promises'
import { expect, it } from 'vitest'
import { currentInstallBaselines } from '../../tools/payload-components/snapshot-install-baselines'

it('keeps every released component version tied to its exact shipped source, including shared files', async () => {
  const saved = JSON.parse(await readFile('payload-components/install-baselines.json', 'utf8'))
  for (const [name, versions] of Object.entries(await currentInstallBaselines())) {
    for (const [version, files] of Object.entries(versions)) {
      expect(
        saved.components[name]?.[version],
        `${name}@${version}: bump the manifest version and changelog, then run pnpm registry:snapshot`,
      ).toEqual(files)
    }
  }
})
