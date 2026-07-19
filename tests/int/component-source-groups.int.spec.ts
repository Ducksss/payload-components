import { describe, expect, it } from 'vitest'

import { groupComponentSourceFiles } from '../../src/lib/component-source-groups'

describe('component source groups', () => {
  it('coalesces non-contiguous files from the same directory', () => {
    const files = [
      { title: 'src/blocks/HeroVideo/config.ts' },
      { title: 'src/blocks/shared/heroFields.ts' },
      { title: 'src/blocks/HeroVideo/Video.tsx' },
    ]

    expect(groupComponentSourceFiles(files)).toEqual([
      {
        dir: 'src/blocks/HeroVideo',
        items: [
          { file: files[0], index: 0 },
          { file: files[2], index: 2 },
        ],
      },
      {
        dir: 'src/blocks/shared',
        items: [{ file: files[1], index: 1 }],
      },
    ])
  })
})
