import { readFile } from 'node:fs/promises'

import { describe, expect, it } from 'vitest'

import {
  createSiteCatalog,
  siteCatalogPath,
} from '../../tools/payload-components/build-site-catalog'

describe('generated site component catalog', () => {
  it('is the current client-safe projection of registry manifests', async () => {
    const committed = JSON.parse(await readFile(siteCatalogPath, 'utf8'))

    expect(committed).toEqual(await createSiteCatalog())
  })
})
