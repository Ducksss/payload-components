import { notFound } from 'next/navigation'

import type { KitGalleryEntry } from '@/content/kitGallery'

import { KitPreviewSurface } from '@/components/gallery/KitPreviewSurface'
import { Badge } from '@/components/ui/badge'
import { kitGalleryEntries } from '@/content/kitGallery'

type Props = {
  slug: KitGalleryEntry['slug']
}

export const KitDocPreview = ({ slug }: Props) => {
  const entry = kitGalleryEntries.find((item) => item.slug === slug)

  if (!entry) {
    notFound()
  }

  return (
    <section className="my-8 overflow-hidden rounded-lg border border-border bg-card/35">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">{entry.preview.label}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{entry.preview.description}</p>
        </div>
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
          {entry.statusLabel}
        </Badge>
      </div>
      <div className="bg-background/70 p-4 sm:p-5">
        <KitPreviewSurface entry={entry} />
      </div>
    </section>
  )
}
