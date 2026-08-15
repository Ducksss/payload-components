import React from 'react'

import type { FooterSimpleBlock as FooterSimpleBlockData } from '@/payload-types'

import { getSafeFooterHref } from '@/blocks/shared/footerUrls'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = FooterSimpleBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const FooterSimpleBlock: React.FC<Props> = ({
  brandLabel,
  className,
  copyright,
  disableInnerContainer,
  id,
  links,
  logo,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12">
        <div
          className={cn('flex flex-col gap-8', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {logo ? (
              <Media resource={logo} imgClassName="h-8 w-auto object-contain object-left" />
            ) : (
              <span className="text-lg font-medium tracking-title text-foreground">{brandLabel}</span>
            )}

            <nav aria-label={brandLabel}>
              <ul className="flex flex-wrap gap-x-6 gap-y-3" role="list">
                {links?.map((link, index) => {
                  const href = getSafeFooterHref(link.href)

                  if (!href) return null

                  return (
                    <li key={link.id ?? `${link.label}-${index}`}>
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
          </div>

          <p className="border-t border-border/70 pt-6 text-sm text-muted-foreground">{copyright}</p>
        </div>
      </div>
    </section>
  )
}
