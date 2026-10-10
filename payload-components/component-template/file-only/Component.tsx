import React from 'react'

export type ExampleBasicProps = {
  title: string
  description?: string | null
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

/** File-only article component: compose it in your post template and pass public content as props. */
export function ExampleBasic({
  title,
  description,
  id,
  className,
  disableInnerContainer = false,
}: ExampleBasicProps) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={['bg-background py-12 text-foreground', className].filter(Boolean).join(' ')}
    >
      <div className={disableInnerContainer ? undefined : 'container mx-auto px-6'}>
        <div className="mx-auto max-w-3xl">
          <h2 id={id ? `${id}-title` : undefined} className="font-serif text-3xl tracking-tight">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
