import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { githubRepoUrl } from '@/components/landing/content'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  getMarketingResourceBySlug,
  marketingResources,
} from '@/content/marketingResources'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return marketingResources.map((resource) => ({
    slug: resource.slug,
  }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const resource = getMarketingResourceBySlug(slug)

  if (!resource) {
    return {}
  }

  return {
    title: `${resource.title} | Payload Kits Resources`,
    description: resource.description,
  }
}

export default async function MarketingResourcePage({ params }: Args) {
  const { slug } = await params
  const resource = getMarketingResourceBySlug(slug)

  if (!resource) {
    notFound()
  }

  return (
    <main className="border-t border-border/60">
      <article className="container py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to resources
          </Link>

          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="rounded-full px-3.5 py-1 uppercase tracking-[0.18em]">
                {resource.keyword}
              </Badge>
              <span className="text-sm text-muted-foreground">{resource.readingTime}</span>
            </div>

            <h1 className="text-4xl font-medium tracking-[-0.06em] text-balance sm:text-5xl">
              {resource.title}
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">{resource.description}</p>
          </div>

          <div className="prose prose-slate mt-12 max-w-none">
            <p>{resource.summary}</p>

            {resource.sections.map((section) => (
              <section key={section.title} className="mt-10">
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-[2rem] border border-border/70 bg-card/35 p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <Badge variant="secondary" className="rounded-full px-3 py-1 uppercase tracking-[0.18em]">
                  Early access
                </Badge>
                <h2 className="text-3xl font-medium tracking-[-0.05em]">
                  Want to turn this into a real install conversation?
                </h2>
                <p className="text-base leading-7 text-muted-foreground">
                  Join the waitlist with source tracking attached, or inspect the public proof on
                  GitHub if you want to validate the current alpha shape first.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link href={`/?source=${resource.source}&intent=waitlist#early-access`}>
                    Join early access
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                  <Link href={githubRepoUrl} target="_blank" rel="noreferrer">
                    View the GitHub proof
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
