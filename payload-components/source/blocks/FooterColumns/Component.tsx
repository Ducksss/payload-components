import React from 'react'

import type { FooterColumnsBlock as FooterColumnsBlockData } from '@/payload-types'

import { getSafeFooterHref } from '@/blocks/shared/footerUrls'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = FooterColumnsBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const FooterColumnsBlock: React.FC<Props> = ({
  brandLabel,
  className,
  copyright,
  disableInnerContainer,
  groups,
  id,
  logo,
  tagline,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-12', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-4">
              {logo ? (
                <Media resource={logo} imgClassName="h-8 w-auto object-contain object-left" />
              ) : (
                <span className="text-lg font-medium tracking-title text-foreground">
                  {brandLabel}
                </span>
              )}

              {tagline ? (
                <p className="max-w-xs text-sm leading-6 text-muted-foreground">{tagline}</p>
              ) : null}
            </div>

            {groups && groups.length > 0
              ? groups.map((group, index) => (
                  <nav
                    aria-label={group.name}
                    className="flex flex-col gap-4"
                    key={group.id ?? `${group.name}-${index}`}
                  >
                    <span className="text-sm font-medium text-foreground">{group.name}</span>

                    <ul className="flex flex-col gap-3" role="list">
                      {group.links?.map((link, linkIndex) => {
                        const href = getSafeFooterHref(link.href)

                        if (!href) return null

                        return (
                          <li key={link.id ?? `${link.label}-${linkIndex}`}>
                            <a
                              className="text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground"
                              href={href}
                            >
                              {link.label}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </nav>
                ))
              : null}
          </div>

          <p className="border-t border-border/70 pt-8 text-sm text-muted-foreground">{copyright}</p>
        </div>
      </div>
    </section>
  )
}
