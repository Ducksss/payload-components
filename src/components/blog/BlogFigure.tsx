import Image from 'next/image'

type BlogFigureProps = {
  alt: string
  caption: string
  height?: number
  src: string
  width?: number
}

export function BlogFigure({ alt, caption, height = 675, src, width = 1200 }: BlogFigureProps) {
  return (
    <figure
      data-blog-figure
      className="my-9 overflow-hidden rounded-panel border border-border bg-muted/30 shadow-[var(--shadow-card)]"
    >
      <div className="relative overflow-hidden bg-background">
        <Image
          alt={alt}
          className="h-auto w-full"
          height={height}
          sizes="(min-width: 768px) 768px, 100vw"
          src={src}
          unoptimized={src.endsWith('.svg')}
          width={width}
        />
      </div>
      <figcaption className="border-t border-border px-4 py-3 text-sm leading-6 text-muted-foreground sm:px-5">
        {caption}
      </figcaption>
    </figure>
  )
}
