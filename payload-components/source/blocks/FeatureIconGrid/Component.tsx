import type { LucideIcon } from 'lucide-react'

import React from 'react'

import type { FeatureIconGridBlock as FeatureIconGridBlockData } from '@/payload-types'
import type { FeatureIconName } from '@/blocks/shared/featureIcons'

import { featureIcons } from '@/blocks/shared/featureIcons'
import { CMSLink } from '@/components/Link'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = FeatureIconGridBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

function IconDecorator({ Icon }: { Icon: LucideIcon }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-32 items-center justify-center overflow-hidden border-b border-border/70"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-60 [mask-image:radial-gradient(circle_at_center,var(--foreground),transparent_70%)]" />
      <span className="relative flex size-14 items-center justify-center rounded-panel border border-border/70 bg-background shadow-sm">
        <Icon className="size-7 text-foreground" strokeWidth={1.5} />
      </span>
    </div>
  )
}

export const FeatureIconGridBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  items,
  links,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-6xl': !disableInnerContainer,
          })}
        >
          <div className="flex max-w-3xl flex-col gap-4">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</h2>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          {items && items.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => {
                const Icon =
                  item.icon && item.icon in featureIcons
                    ? featureIcons[item.icon as FeatureIconName]
                    : featureIcons.shield

                return (
                  <Card
                    key={item.id ?? `${item.title}-${index}`}
                    className="overflow-hidden border-border/70 bg-background/85 py-0 shadow-none"
                  >
                    <IconDecorator Icon={Icon} />
                    <CardHeader className="gap-3 p-6">
                      <CardTitle className="text-xl tracking-title">{item.title}</CardTitle>
                      <CardDescription className="text-sm leading-7 text-muted-foreground">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          ) : null}

          {links && links.length > 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              {links.map(({ link }, index) => (
                <CMSLink
                  key={index}
                  appearance={link.appearance === 'outline' ? 'outline' : 'default'}
                  {...link}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
