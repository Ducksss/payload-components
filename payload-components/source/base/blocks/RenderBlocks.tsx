import React, { Fragment } from 'react'

/**
 * Maps a stored block's `blockType` to the component that renders it.
 *
 * Mirrors the renderer the Payload website starter ships at
 * `src/blocks/RenderBlocks.tsx`. `payload-components add` patches this file: it
 * inserts the block's import above `const blockComponents` and its
 * `blockType: Component` entry inside that object. Keep both anchors intact.
 */
const blockComponents = {
}

type RenderBlocksProps = {
  blocks?: Array<{ blockType?: string; id?: null | string }> | null
}

export const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks }) => {
  if (!blocks?.length) {
    return null
  }

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block

        if (!blockType) {
          return null
        }

        /* The map is heterogeneous by construction — each installed block
           contributes its own props type — and the key is only known at runtime,
           so the lookup is widened to `unknown` and narrowed back by a real
           runtime check. Indexing the literal directly would type this as `never`
           while the map is empty and stop compiling the moment a block is
           installed into it. */
        const Block = (blockComponents as Record<string, unknown>)[blockType]

        if (typeof Block !== 'function') {
          return null
        }

        const BlockComponent = Block as React.ComponentType<Record<string, unknown>>

        return <BlockComponent key={index} {...block} />
      })}
    </Fragment>
  )
}
