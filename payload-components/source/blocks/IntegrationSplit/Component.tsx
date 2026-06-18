import React from 'react'

import type { IntegrationSplitBlock as IntegrationSplitBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = IntegrationSplitBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const IntegrationSplitBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  featuredLogo,
  heading,
  id,
  integrations,
  links,
  subtext,
}) => {
  const items = integrations ?? []
  const mid = Math.ceil(items.length / 2)
  const before = items.slice(0, mid)
  const after = items.slice(mid)

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div
          className={cn('grid items-center gap-10 sm:grid-cols-2', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="mx-auto flex max-w-sm flex-wrap items-center justify-center gap-2.5 [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_55%,transparent_100%)]">
            {before.map((item, index) => (
              <div
                className="flex size-16 items-center justify-center rounded-2xl border border-border/70 bg-background"
                key={item.id ?? `${item.name}-${index}`}
              >
                <Media resource={item.logo} imgClassName="size-8 w-auto object-contain" />
              </div>
            ))}

            {featuredLogo ? (
              <div className="flex size-16 items-center justify-center rounded-2xl border border-foreground/25 bg-card shadow-lg">
                <Media resource={featuredLogo} imgClassName="size-9 w-auto object-contain" />
              </div>
            ) : null}

            {after.map((item, index) => (
              <div
                className="flex size-16 items-center justify-center rounded-2xl border border-border/70 bg-background"
                key={item.id ?? `after-${item.name}-${index}`}
              >
                <Media resource={item.logo} imgClassName="size-8 w-auto object-contain" />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-5 text-center sm:text-left">
            <h2 className="text-balance text-2xl font-semibold tracking-heading text-foreground sm:text-3xl">
              {heading}
            </h2>
            {subtext ? (
              <p className="text-pretty text-sm text-muted-foreground sm:text-base">{subtext}</p>
            ) : null}
            {links && links.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                {links.map(({ link }, index) => (
                  <CMSLink
                    appearance={link.appearance === 'outline' ? 'outline' : 'default'}
                    key={index}
                    {...link}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
