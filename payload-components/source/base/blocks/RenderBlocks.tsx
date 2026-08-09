import React, { Fragment } from 'react'

/**
 * Maps a stored block's `blockType` to the component that renders it.
 *
 * Mirrors the renderer the Payload website starter ships at
 * `src/blocks/RenderBlocks.tsx`. `payload-components add` patches this file: it
 * inserts the block's import above `const blockComponents` and its
 * `blockType: Component` entry inside that object. Keep both anchors intact.
 */
const blockComponents = {}

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

        if (!blockType || !(blockType in blockComponents)) {
          return null
        }

        const Block = blockComponents[blockType as keyof typeof blockComponents] as
          | React.FC<Record<string, unknown>>
          | undefined

        if (!Block) {
          return null
        }

        return <Block key={index} {...block} />
      })}
    </Fragment>
  )
}
