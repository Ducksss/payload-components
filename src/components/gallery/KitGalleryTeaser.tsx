import Link from 'next/link'

import { componentsGalleryRoute, kitGalleryEntries } from '@/content/kitGallery'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export const KitGalleryTeaser = () => {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {kitGalleryEntries.map((entry) => (
          <Card key={entry.slug} className="rounded-[1.75rem] border-border/70 bg-background/82 shadow-none">
            <CardHeader className="gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {entry.statusLabel}
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {entry.slug}
                </Badge>
              </div>

              <div className="space-y-2">
                <CardTitle className="text-3xl tracking-[-0.05em]">{entry.title}</CardTitle>
                <CardDescription className="text-base leading-7">{entry.summary}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex h-full flex-col gap-5">
              <code className="block overflow-x-auto rounded-xl border border-border/70 bg-card/50 px-3 py-3 text-sm">
                {entry.installCommand}
              </code>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {entry.preview.label}
                </Badge>
              </div>

              <Button asChild variant="ghost" className="mt-auto justify-start px-0">
                <Link href={`${componentsGalleryRoute}#${entry.slug}`}>
                  Open {entry.title} live preview
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-start">
        <Button asChild size="lg" className="rounded-full px-6">
          <Link href={componentsGalleryRoute}>
            Browse the live components gallery
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
