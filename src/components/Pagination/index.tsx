import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
}> = (props) => {
  const { className, page, totalPages } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages
  const getPageHref = (pageNumber: number) =>
    pageNumber <= 1 ? '/posts' : `/posts/page/${pageNumber}`

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            {hasPrevPage ? (
              <PaginationLink asChild className="gap-1 pl-2.5" size="default">
                <Link aria-label="Go to previous page" href={getPageHref(page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Link>
              </PaginationLink>
            ) : (
              <PaginationPrevious disabled />
            )}
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink asChild>
                <Link href={getPageHref(page - 1)}>{page - 1}</Link>
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink asChild isActive>
              <Link href={getPageHref(page)}>{page}</Link>
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink asChild>
                <Link href={getPageHref(page + 1)}>{page + 1}</Link>
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            {hasNextPage ? (
              <PaginationLink asChild className="gap-1 pr-2.5" size="default">
                <Link aria-label="Go to next page" href={getPageHref(page + 1)}>
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </PaginationLink>
            ) : (
              <PaginationNext disabled />
            )}
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
