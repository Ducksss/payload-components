import React from 'react'

import { CMSLink } from '@/components/Link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

/**
 * After copying this scaffold into `src/blocks/<PascalCase>/Component.tsx`,
 * replace `ExampleBasicBlockData` with the generated block type import from
 * `@/payload-types` and keep the optional wrapper props in the `Props` type.
 */
type ExampleBasicBlockData = {
  eyebrow?: null | string
  title?: null | string
  description?: null | string
  links?:
    | Array<{
        link: React.ComponentProps<typeof CMSLink>
      }>
    | null
}

type Props = ExampleBasicBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ExampleBasicBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  links,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-6', {
            'mx-auto max-w-4xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-[0.18em]">
                {eyebrow}
              </Badge>
            ) : null}

            {title ? <h2 className="text-4xl font-medium tracking-[-0.06em] text-balance sm:text-5xl">{title}</h2> : null}

            {description ? (
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          {links && links.length > 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              {links.map(({ link }, index) => (
                <CMSLink key={index} appearance={link.appearance === 'outline' ? 'outline' : 'default'} {...link} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
