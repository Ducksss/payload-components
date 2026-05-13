'use client'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Fragment, type MouseEvent } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const router = useRouter()
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`
  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as Element).closest('a')) {
      return
    }

    router.push(href)
  }

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      onClick={handleCardClick}
    >
      <div className="relative w-full ">
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
      </div>
      <div className="p-4">
        {showCategories && hasCategories && (
          <div className="uppercase text-sm mb-4">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category

                const categoryTitle = titleFromCategory || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <Fragment key={index}>
                    {categoryTitle}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }

              return null
            })}
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  )
}
