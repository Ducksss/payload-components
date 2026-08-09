import React from 'react'

import type { FooterCenteredBlock as FooterCenteredBlockData } from '@/payload-types'

import { getSafeFooterHref } from '@/blocks/shared/footerUrls'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = FooterCenteredBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const FooterCenteredBlock: React.FC<Props> = ({
  brandLabel,
  className,
  copyright,
  disableInnerContainer,
  id,
  legalLinks,
  links,
  logo,
  tagline,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-3xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            {logo ? (
              <Media resource={logo} imgClassName="h-8 w-auto object-contain" />
            ) : (
              <span className="text-lg font-medium tracking-title text-foreground">{brandLabel}</span>
            )}

            {tagline ? (
              <p className="max-w-md text-sm leading-6 text-muted-foreground">{tagline}</p>
            ) : null}
          </div>

          <nav aria-label={brandLabel}>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3" role="list">
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

          <div className="flex flex-col-reverse items-center gap-4 border-t border-border/70 pt-8 sm:flex-row sm:justify-between">
            <p className="text-sm text-muted-foreground">{copyright}</p>

            {legalLinks && legalLinks.length > 0 ? (
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3" role="list">
                {legalLinks.map((link, index) => {
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
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
