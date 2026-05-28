import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PostArchive } from '@/components/posts/PostArchive'
import { AuthorCard } from '@/components/posts/AuthorCard'
import { FeaturedPost } from '@/components/posts/FeaturedPost'
import { PostCard } from '@/components/posts/PostCard'
import { PostHero } from '@/components/posts/PostHero'
import { PostList } from '@/components/posts/PostList'
import { RelatedPosts } from '@/components/posts/RelatedPosts'
import { NewsletterCallout } from '@/components/posts/NewsletterCallout'

afterEach(() => {
  cleanup()
})

const publishedPost = {
  id: 1,
  categories: [{ slug: 'strategy', title: 'Strategy' }],
  meta: {
    description: 'A practical guide to shipping reusable Payload website surfaces.',
    image: {
      alt: 'Payload dashboard preview',
      height: 720,
      url: '/media/payload-dashboard.webp',
      width: 1280,
    },
  },
  populatedAuthors: [{ name: 'Payload Kits Team' }],
  publishedAt: '2026-04-21T10:00:00.000Z',
  slug: 'payload-component-workflow',
  title: 'Build a reusable Payload component workflow',
}

const secondPost = {
  id: 2,
  categories: [{ slug: 'registry', title: 'Registry' }],
  meta: {
    description: 'How shadcn registry delivery and payload-kit wiring split responsibilities.',
  },
  publishedAt: '2026-04-22T10:00:00.000Z',
  slug: 'payload-registry-boundary',
  title: 'Define the Payload registry boundary',
}

const thirdPost = {
  id: 3,
  categories: [{ slug: 'delivery', title: 'Delivery' }],
  meta: {
    description: 'A checklist for keeping direct shadcn installs safe and useful.',
  },
  publishedAt: '2026-04-23T10:00:00.000Z',
  slug: 'direct-shadcn-safe-kits',
  title: 'Keep direct shadcn installs honest',
}

const author = {
  avatar: {
    alt: 'Portrait of Maya Chen',
    height: 320,
    url: '/media/maya-chen.webp',
    width: 320,
  },
  bio: 'Maya helps Payload teams turn reusable CMS patterns into reliable delivery systems.',
  name: 'Maya Chen',
  role: 'Payload architect',
}

describe('post presentation components', () => {
  it('renders a shadcn-native post card with structural Payload post data', () => {
    render(<PostCard post={publishedPost} />)

    expect(screen.getByText('Strategy')).toBeTruthy()
    expect(screen.getByText('Build a reusable Payload component workflow')).toBeTruthy()
    expect(screen.getByText('A practical guide to shipping reusable Payload website surfaces.')).toBeTruthy()
    expect(screen.getByRole('link', { name: /Build a reusable Payload component workflow/ }).getAttribute('href')).toBe(
      '/posts/payload-component-workflow',
    )
    expect(screen.getByAltText('Payload dashboard preview')).toBeTruthy()
  })

  it('renders an archive grid with a heading, description, and all post links', () => {
    render(
      <PostArchive
        description="A shadcn-native archive that only needs post-shaped data."
        eyebrow="Latest posts"
        posts={[publishedPost, secondPost]}
        title="Payload implementation notes"
      />,
    )

    expect(screen.getByText('Latest posts')).toBeTruthy()
    expect(screen.getByText('Payload implementation notes')).toBeTruthy()
    expect(screen.getByRole('link', { name: /Build a reusable Payload component workflow/ })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Define the Payload registry boundary/ })).toBeTruthy()
  })

  it('renders a post hero without depending on generated payload-types', () => {
    render(<PostHero post={publishedPost} />)

    expect(screen.getByText('Build a reusable Payload component workflow')).toBeTruthy()
    expect(screen.getByText('Payload Kits Team')).toBeTruthy()
    expect(screen.getByText('Strategy')).toBeTruthy()
    expect(screen.getByText('A practical guide to shipping reusable Payload website surfaces.')).toBeTruthy()
  })

  it('renders related posts with a compact empty state fallback', () => {
    const { rerender } = render(
      <RelatedPosts
        description="Continue reading about the registry delivery surface."
        posts={[publishedPost, secondPost]}
        title="Related implementation guides"
      />,
    )

    expect(screen.getByText('Related implementation guides')).toBeTruthy()
    expect(screen.getByRole('link', { name: /Payload registry boundary/ })).toBeTruthy()

    rerender(<RelatedPosts posts={[]} />)

    expect(screen.getByText('No related posts available yet.')).toBeTruthy()
  })

  it('renders a featured post surface with a primary article link', () => {
    render(<FeaturedPost label="Featured guide" post={publishedPost} />)

    expect(screen.getByText('Featured guide')).toBeTruthy()
    expect(screen.getByText('Build a reusable Payload component workflow')).toBeTruthy()
    expect(screen.getByRole('link', { name: /Read featured guide/ }).getAttribute('href')).toBe(
      '/posts/payload-component-workflow',
    )
  })

  it('renders a compact post list with dates and an empty state', () => {
    const { rerender } = render(<PostList posts={[publishedPost, secondPost, thirdPost]} title="Recent notes" />)

    expect(screen.getByText('Recent notes')).toBeTruthy()
    expect(screen.getByRole('link', { name: /Build a reusable Payload component workflow/ })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Keep direct shadcn installs honest/ })).toBeTruthy()

    rerender(<PostList posts={[]} />)

    expect(screen.getByText('No posts to list yet.')).toBeTruthy()
  })

  it('renders an author card from structural Payload author data', () => {
    render(<AuthorCard author={author} />)

    expect(screen.getByText('Maya Chen')).toBeTruthy()
    expect(screen.getByText('Payload architect')).toBeTruthy()
    expect(screen.getByText(/reusable CMS patterns/)).toBeTruthy()
    expect(screen.getByAltText('Portrait of Maya Chen')).toBeTruthy()
  })

  it('renders a newsletter callout with configurable action fields', () => {
    render(
      <NewsletterCallout
        action="/api/newsletter"
        buttonLabel="Join list"
        description="Get the next Payload kit release notes before they ship."
        emailName="subscriber"
        title="Follow the kit catalog"
      />,
    )

    expect(screen.getByText('Follow the kit catalog')).toBeTruthy()
    expect(screen.getByText('Get the next Payload kit release notes before they ship.')).toBeTruthy()
    expect(screen.getByPlaceholderText('you@example.com').getAttribute('name')).toBe('subscriber')
    expect(screen.getByRole('button', { name: 'Join list' })).toBeTruthy()
  })
})
