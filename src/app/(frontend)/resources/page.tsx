import type { Metadata } from 'next'
import Link from 'next/link'

import { githubRepoUrl, githubEarlyAccessIssueUrl } from '@/components/landing/content'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { marketingResources } from '@/content/marketingResources'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Payload Kits Resources | Payload-native guides for agencies and freelancers',
  description:
    'Browse Payload Kits launch resources focused on Payload CMS blocks, the Payload + Next.js website template, and shadcn-compatible registry workflows.',
}

export default function ResourcesPage() {
  return (
    <main className="border-t border-border/60">
      <section className="container py-16 lg:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <Badge
            variant="outline"
            className="rounded-full px-3.5 py-1 text-[0.72rem] uppercase tracking-[0.18em]"
          >
            Launch resources
          </Badge>
          <h1 className="text-4xl font-medium tracking-[-0.06em] text-balance sm:text-5xl">
            Payload-native guides for teams evaluating installable kits.
          </h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            These guides target the narrow, high-intent questions agencies and freelancers ask when
            they are deciding whether reusable Payload blocks will actually survive inside real
            repos.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {marketingResources.map((resource) => (
            <Card
              key={resource.slug}
              className="rounded-[1.75rem] border-border/70 bg-background/80 shadow-none"
            >
              <CardHeader className="gap-4">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    {resource.keyword}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{resource.readingTime}</span>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl tracking-[-0.05em]">{resource.title}</CardTitle>
                  <CardDescription className="text-base leading-7">
                    {resource.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-5">
                <p className="text-sm leading-7 text-muted-foreground">{resource.summary}</p>
                <Button asChild variant="ghost" className="mt-auto justify-start px-0">
                  <Link href={`/resources/${resource.slug}`}>
                    Read the guide
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-border/70 bg-card/40 p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <Badge variant="outline" className="rounded-full px-3 py-1 uppercase tracking-[0.18em]">
                Next step
              </Badge>
              <h2 className="text-3xl font-medium tracking-[-0.05em]">
                Want the public proof or an early-access path?
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Use the repo if you want to inspect the current product proof, or open the GitHub
                early-access template if you want a lightweight intake path before the full launch.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href={githubRepoUrl} target="_blank" rel="noreferrer">
                  Open the GitHub proof
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                <Link href={githubEarlyAccessIssueUrl} target="_blank" rel="noreferrer">
                  Request early access
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
