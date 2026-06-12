import Link from 'next/link'

import { ArrowUpRight, Quote } from 'lucide-react'

import { testimonials } from '@/lib/site'

/**
 * Social-proof wall. `note` = signed maintainer card, `invite` = open
 * design-partner slot, `quote` = real testimonial (rendered as soon as
 * one is added to site.ts — no layout change needed).
 */
export function SocialProof() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {testimonials.map((item) => {
        if (item.kind === 'note') {
          return (
            <figure
              key={item.name}
              className="flex flex-col justify-between gap-6 rounded-2xl bg-foreground p-7 text-background shadow-frame"
            >
              <blockquote className="text-[15px] leading-7 text-background/85">
                {item.body}
              </blockquote>
              <figcaption className="flex items-center justify-between gap-3 border-t border-background/10 pt-5">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-9 place-items-center rounded-full bg-background/10 text-sm font-semibold text-background"
                  >
                    {item.name.charAt(0).toUpperCase()}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-background">{item.name}</span>
                    {item.role ? (
                      <span className="block text-xs text-background/60">{item.role}</span>
                    ) : null}
                  </span>
                </div>
                {item.href ? (
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${item.name} on GitHub`}
                    className="text-background/60 transition-colors hover:text-background"
                  >
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                ) : null}
              </figcaption>
            </figure>
          )
        }

        if (item.kind === 'invite') {
          return (
            <div
              key={item.name}
              className="flex flex-col justify-between gap-6 rounded-2xl border border-dashed border-border p-7 transition-colors hover:border-foreground/25"
            >
              <div>
                <p className="font-mono text-sm text-muted-foreground">{item.name}</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
              </div>
              {item.href ? (
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand"
                >
                  Open an issue
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          )
        }

        return (
          <figure
            key={item.name}
            className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-7 shadow-card"
          >
            <div>
              <Quote className="size-4 text-brand" aria-hidden="true" />
              <blockquote className="mt-4 text-[15px] leading-7 text-foreground/85">
                {item.body}
              </blockquote>
            </div>
            <figcaption className="border-t border-border pt-5">
              <span className="block text-sm font-semibold text-foreground">{item.name}</span>
              {item.role ? (
                <span className="block text-xs text-muted-foreground">{item.role}</span>
              ) : null}
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}
