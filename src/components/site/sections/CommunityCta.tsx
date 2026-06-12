import Link from 'next/link'

import { ArrowUpRight, Bell, Github } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { MaintainerNote } from '@/components/site/MaintainerNote'
import { Eyebrow, HeadingAccent, Section } from '@/components/site/section'
import {
  communityIntro,
  communityInvite,
  communityLinks,
  githubRepoUrl,
  landingSections,
  primaryInstallCommand,
} from '@/lib/site'

/* Open-source close — asymmetric: the pitch beside the one real voice. The
 * honest CTA in place of a waitlist: read it, run it, open an issue. */
export function CommunityCta() {
  return (
    <Section id={landingSections.community.id} className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-dots [mask-image:radial-gradient(38rem_22rem_at_40%_45%,black,transparent)]"
      />
      <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div className="flex flex-col items-start">
          <Eyebrow>Open source</Eyebrow>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-foreground sm:text-[2.6rem]">
            Open source, <HeadingAccent>end to end</HeadingAccent>.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">{communityIntro}</p>

          <div className="mt-7 grid w-full max-w-md grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full border border-border bg-background py-1.5 pl-5 pr-1.5 shadow-card">
            <code className="overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/90 sm:text-[13px]">
              {primaryInstallCommand}
            </code>
            <CommandCopyButton command={primaryInstallCommand} />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={communityLinks[0].href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Github className="size-4" aria-hidden="true" />
              {communityLinks[0].label}
            </Link>
            <Link
              href={communityLinks[1].href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {communityLinks[1].label}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <a
            href={communityInvite.href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {communityInvite.label}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
          <a
            href={`${githubRepoUrl}/releases`}
            target="_blank"
            rel="noreferrer"
            className="mt-2.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="size-3.5" aria-hidden="true" />
            Watch releases to catch new kits as they land
          </a>
        </div>

        <MaintainerNote />
      </div>
    </Section>
  )
}
