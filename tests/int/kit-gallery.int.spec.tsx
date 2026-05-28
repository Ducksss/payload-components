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
    expect(screen.getByText('Post Card')).toBeTruthy()
    expect(screen.getByText('Post Archive')).toBeTruthy()
    expect(screen.getByText('Post Hero')).toBeTruthy()
    expect(screen.getByText('Featured Post')).toBeTruthy()
    expect(screen.getByText('Post List')).toBeTruthy()
    expect(screen.getByText('Author Card')).toBeTruthy()
    expect(screen.getByText('Newsletter Callout')).toBeTruthy()
    expect(screen.getByText('Related Posts')).toBeTruthy()
    expect(screen.getAllByText('npx payload-kit add hero-basic').length).toBeGreaterThan(0)
    expect(screen.getAllByText('npx payload-kit add feature-grid-basic').length).toBeGreaterThan(0)
    expect(
      screen.getAllByText('npx shadcn add @payload-kits/post-card').length,
    ).toBeGreaterThan(0)
    expect(screen.getByText('Marketing hero')).toBeTruthy()
    expect(screen.getAllByText('Product features').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Post card').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Featured post').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Post list').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Author card').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Newsletter callout').length).toBeGreaterThan(0)
    expect(screen.getByText('Registry-backed install')).toBeTruthy()
    expect(screen.getByText('Post-install cleanup handled')).toBeTruthy()
    expect(screen.getByText(/No Payload file patching/)).toBeTruthy()
  })
})

describe('KitGalleryTeaser', () => {
  it('shows only the shipped alpha kits and links into the live gallery', () => {
    render(<KitGalleryTeaser />)

    expect(screen.getAllByText('Hero Basic').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Feature Grid Basic').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Post Card').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Post Archive').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Post Hero').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Featured Post').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Post List').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Author Card').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Newsletter Callout').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Related Posts').length).toBeGreaterThan(0)
    expect(screen.queryByText('Pricing kit')).toBeNull()

    expect(
      screen.getByRole('link', { name: 'Open Hero Basic live preview' }).getAttribute('href'),
    ).toBe('/components#hero-basic')
    expect(
      screen
        .getByRole('link', { name: 'Open Feature Grid Basic live preview' })
        .getAttribute('href'),
    ).toBe('/components#feature-grid-basic')
    expect(
      screen.getByRole('link', { name: 'Open Post Card live preview' }).getAttribute('href'),
    ).toBe('/components#post-card')
    expect(
      screen.getByRole('link', { name: 'Browse the live components gallery' }).getAttribute('href'),
    ).toBe('/components')
  })
})
