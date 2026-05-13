import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'

import { KitGalleryPage } from '@/components/gallery/KitGalleryPage'
import { KitGalleryTeaser } from '@/components/gallery/KitGalleryTeaser'

afterEach(() => {
  cleanup()
})

describe('KitGalleryPage', () => {
  it('renders the shipped kits and their live previews', () => {
    render(<KitGalleryPage />)

    expect(screen.getByText('Hero Basic')).toBeTruthy()
    expect(screen.getByText('Feature Grid Basic')).toBeTruthy()
    expect(screen.getAllByText('npx payload-kit add hero-basic').length).toBeGreaterThan(0)
    expect(screen.getAllByText('npx payload-kit add feature-grid-basic').length).toBeGreaterThan(0)
    expect(screen.getByText('Marketing hero')).toBeTruthy()
    expect(screen.getAllByText('Product features').length).toBeGreaterThan(0)
    expect(screen.getByText('Registry-backed install')).toBeTruthy()
    expect(screen.getByText('Post-install cleanup handled')).toBeTruthy()
  })
})

describe('KitGalleryTeaser', () => {
  it('shows only the shipped alpha kits and links into the live gallery', () => {
    render(<KitGalleryTeaser />)

    expect(screen.getAllByText('Hero Basic').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Feature Grid Basic').length).toBeGreaterThan(0)
    expect(screen.queryByText('Pricing kit')).toBeNull()

    const previewLinks = screen.getAllByRole('link', { name: 'Open live preview' })
    expect(previewLinks).toHaveLength(2)
    expect(previewLinks[0]?.getAttribute('href')).toBe('/components#hero-basic')
    expect(previewLinks[1]?.getAttribute('href')).toBe('/components#feature-grid-basic')
    expect(
      screen.getByRole('link', { name: 'Browse the live components gallery' }).getAttribute('href'),
    ).toBe('/components')
  })
})
