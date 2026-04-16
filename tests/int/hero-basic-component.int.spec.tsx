import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HeroBasicBlock } from '@/blocks/HeroBasic/Component'

describe('HeroBasicBlock', () => {
  it('renders the golden kit content surface', () => {
    render(
      <HeroBasicBlock
        blockName={null}
        blockType="heroBasic"
        description="A proof-of-concept hero installed through the payload-kit wrapper."
        eyebrow="Payload Kits"
        id="hero-basic"
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
        proofItems={[
          { id: 'proof-1', label: 'Registry-backed install' },
          { id: 'proof-2', label: 'Payload-aware wiring' },
        ]}
        title="Install one hero block and prove the workflow."
      />,
    )

    expect(screen.getByText('Payload Kits')).toBeTruthy()
    expect(screen.getByText('Install one hero block and prove the workflow.')).toBeTruthy()
    expect(screen.getByText('Registry-backed install')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Open admin' }).getAttribute('href')).toBe('/admin')
  })
})
