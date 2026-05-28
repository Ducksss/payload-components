export type PayloadPostCategory = {
  slug?: string | null
  title?: string | null
}

export type PayloadPostMedia = {
  alt?: string | null
  height?: number | null
  url?: string | null
  width?: number | null
}

export type PayloadPostAuthor = {
  avatar?: number | PayloadPostMedia | null
  bio?: string | null
  name?: string | null
  role?: string | null
  url?: string | null
}

export type PayloadPostSummary = {
  id?: number | string | null
  categories?: (number | PayloadPostCategory)[] | null
  createdAt?: string | null
  heroImage?: number | PayloadPostMedia | null
  meta?: {
    description?: string | null
    image?: number | PayloadPostMedia | null
    title?: string | null
  } | null
  populatedAuthors?: PayloadPostAuthor[] | null
  publishedAt?: string | null
  slug?: string | null
  title?: string | null
  updatedAt?: string | null
}

export const getPostHref = (post: PayloadPostSummary, basePath = '/posts') =>
  `${basePath.replace(/\/$/, '')}/${post.slug ?? post.id ?? ''}`

export const getPostDescription = (post: PayloadPostSummary) =>
  post.meta?.description?.replace(/\s/g, ' ') ?? ''

export const getPostImage = (post: PayloadPostSummary) => {
  const image = post.meta?.image ?? post.heroImage

  return typeof image === 'object' && image !== null ? image : undefined
}

export const getPostCategories = (post: PayloadPostSummary) =>
  (post.categories ?? []).filter(
    (category): category is PayloadPostCategory => typeof category === 'object' && category !== null,
  )

export const formatPostDate = (date: string | null | undefined) => {
  if (!date) {
    return undefined
  }

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

export const formatAuthors = (authors: PayloadPostAuthor[] | null | undefined) =>
  (authors ?? [])
    .map((author) => author.name)
    .filter(Boolean)
    .join(', ')

export const getAuthorAvatar = (author: PayloadPostAuthor) => {
  const avatar = author.avatar

  return typeof avatar === 'object' && avatar !== null ? avatar : undefined
}

export const getPrimaryAuthor = (post: PayloadPostSummary) =>
  post.populatedAuthors?.find((author) => author.name) ?? post.populatedAuthors?.[0]
