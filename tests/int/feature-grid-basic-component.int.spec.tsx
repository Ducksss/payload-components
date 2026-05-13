import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FeatureGridBasicBlock } from '@/blocks/FeatureGridBasic/Component'

describe('FeatureGridBasicBlock', () => {
  it('renders the feature-grid alpha surface', () => {
    render(
      <FeatureGridBasicBlock
        blockName={null}
        blockType="featureGridBasic"
        description="A reusable feature grid installed through the payload-kit alpha workflow."
        eyebrow="Payload Kits alpha"
        id="feature-grid-basic"
        items={[
          {
            id: 'item-1',
            title: 'Repo-aware install',
            description: 'Registers cleanly with the supported Payload layout surface.',
          },
          {
            id: 'item-2',
            title: 'Text-first schema',
            description: 'Ships useful content fields without extra primitives.',
          },
          {
            id: 'item-3',
            title: 'Multi-kit proof',
            description: 'Exercises the second-kit install path and dedupe behavior.',
          },
        ]}
        links={[
          {
            id: 'primary',
            link: {
              appearance: 'default',
              label: 'Open admin',
              newTab: false,
              type: 'custom',
              url: '/admin',
            },
          },
        ]}
        title="Ship a clean feature grid without manual repo wiring."
      />,
    )

    expect(screen.getByText('Payload Kits alpha')).toBeTruthy()
    expect(screen.getByText('Ship a clean feature grid without manual repo wiring.')).toBeTruthy()
    expect(screen.getByText('Repo-aware install')).toBeTruthy()
    expect(screen.getByText('Multi-kit proof')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Open admin' }).getAttribute('href')).toBe('/admin')
  })
})
