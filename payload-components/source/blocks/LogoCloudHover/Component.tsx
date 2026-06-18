import React from 'react'

import type { LogoCloudHoverBlock as LogoCloudHoverBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = LogoCloudHoverBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const LogoCloudHoverBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  heading,
  id,
  links,
  logos,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-12', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <p className="text-center text-sm font-medium text-muted-foreground">{heading}</p>

          <div className="group relative">
            {links && links.length > 0 ? (
              <div className="pointer-events-none absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 transition duration-500 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:opacity-100">
                {links.map(({ link }, index) => (
                  <CMSLink
                    appearance={link.appearance === 'outline' ? 'outline' : 'default'}
                    key={index}
                    {...link}
                  />
                ))}
              </div>
            ) : null}

            {logos && logos.length > 0 ? (
              <div className="grid grid-cols-3 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-40 group-hover:blur-sm group-focus-within:opacity-40 group-focus-within:blur-sm sm:gap-x-16 sm:gap-y-12 md:grid-cols-4">
                {logos.map((item, index) => {
                  const logo = (
                    <Media resource={item.logo} imgClassName="mx-auto h-6 w-auto object-contain" />
                  )

                  return (
                    <div
                      className="flex items-center justify-center"
                      key={item.id ?? `${item.name}-${index}`}
                    >
                      {item.href ? (
                        <a aria-label={item.name} href={item.href}>
                          {logo}
                        </a>
                      ) : (
                        logo
                      )}
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
