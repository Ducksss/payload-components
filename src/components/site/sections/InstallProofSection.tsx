import Link from 'next/link'

import { ArrowRight, CheckCircle2, FileCode2, MonitorCheck, TerminalSquare } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { Section, SectionHeading } from '@/components/site/section'
import {
  frameInstalledFiles,
  installProofIntro,
  installProofItems,
  installProofNoAdoption,
  landingSections,
  primaryInstallCommand,
  type InstallProofItem,
} from '@/lib/site'

const proofIcons = {
  diff: FileCode2,
  result: MonitorCheck,
  terminal: TerminalSquare,
} satisfies Record<InstallProofItem['icon'], typeof TerminalSquare>

/* An honest proof pass: no customer logos or testimonials until they exist.
 * The homepage shows what can be verified now, namely the CLI stages, the repo
 * diff, and the rendered component output. */
export function InstallProofSection() {
  return (
    <Section id={landingSections.proof.id}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.48fr)] lg:items-end">
        <SectionHeading
          accentWord="diff"
          eyebrow="Install proof"
          heading={landingSections.proof.heading}
          intro={installProofIntro}
        />

        <aside className="reveal-on-scroll rounded-xl border border-border bg-muted/40 p-5">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            {installProofNoAdoption.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {installProofNoAdoption.body}
          </p>
        </aside>
      </div>

      <div className="reveal-on-scroll mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {installProofItems.map((item) => {
          const Icon = proofIcons[item.icon]

          return (
            <article
              key={item.title}
              className="flex min-h-full flex-col rounded-xl border border-border bg-background p-5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-secondary text-brand"
                >
                  <Icon className="size-4" />
                </span>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
              </div>
              <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
              <Link
                href={item.href}
                className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand"
              >
                {item.linkLabel}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          )
        })}
      </div>

      <div className="reveal-on-scroll mt-6 grid gap-4 rounded-xl border border-border bg-muted/30 p-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:p-6">
        <div className="flex min-w-0 flex-col justify-between gap-5 rounded-lg border border-border bg-background p-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Run it
            </p>
            <code className="mt-3 block overflow-x-auto whitespace-nowrap font-mono text-sm text-foreground">
              {primaryInstallCommand}
            </code>
          </div>
          <CommandCopyButton command={primaryInstallCommand} />
        </div>

        <div className="rounded-lg border border-border bg-background p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Resulting diff includes
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {frameInstalledFiles.map((filePath) => (
              <li key={filePath} className="flex min-w-0 items-center gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="size-4 shrink-0 text-brand" aria-hidden="true" />
                <code className="truncate font-mono text-[12px]">{filePath}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
