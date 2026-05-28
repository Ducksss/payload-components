import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

import { getAuthorAvatar, type PayloadPostAuthor } from './types'

type Props = {
  author: PayloadPostAuthor
  className?: string
  eyebrow?: string
}

export const AuthorCard = ({ author, className, eyebrow = 'Author' }: Props) => {
  const avatar = getAuthorAvatar(author)
  const name = author.name ?? 'Unknown author'

  return (
    <Card className={cn('border-border/70 bg-background shadow-none', className)}>
      <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        {avatar?.url ? (
          <div className="size-24 overflow-hidden rounded-full border border-border/70 bg-muted">
            <Image
              alt={avatar.alt ?? name}
              className="h-full w-full object-cover"
              height={avatar.height ?? 320}
              src={avatar.url}
              width={avatar.width ?? 320}
            />
          </div>
        ) : (
          <div className="flex size-24 items-center justify-center rounded-full border border-border/70 bg-muted text-2xl font-medium">
            {name.slice(0, 1)}
          </div>
        )}

        <div className="grid gap-3">
          <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
            {eyebrow}
          </Badge>
          <div className="grid gap-1">
            <h2 className="text-2xl font-medium tracking-[-0.04em]">{name}</h2>
            {author.role ? <p className="text-sm font-medium text-muted-foreground">{author.role}</p> : null}
          </div>
          {author.bio ? <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{author.bio}</p> : null}
        </div>
      </CardContent>
    </Card>
  )
}
