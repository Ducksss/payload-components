import { ProjectShowcaseCard } from '@/components/site/ProjectShowcaseCard'
import { Section, SectionHeading } from '@/components/site/section'
import {
  clientProjects,
  clientShowcaseEyebrow,
  clientShowcaseHeading,
  clientShowcaseIntro,
} from '@/lib/site'
import { cn } from '@/utilities/ui'

/* The origin story as evidence: real freelance Payload sites the maintainer
 * shipped before payload-components — each one paid the manual setup tax by hand.
 * Honest framing (eyebrow/heading/intro in lib/site): these predate the CLI;
 * they are not installs of it. */

/* Columns by count: 2 stays 2-up; 4 makes a clean 2x2; 3 (or other odd
   counts) goes 3-up at lg so a lone card never strands a half-empty row. */
function gridColsClass(count: number) {
  if (count <= 2) return 'md:grid-cols-2'
  if (count === 4) return 'md:grid-cols-2'
  return 'md:grid-cols-2 lg:grid-cols-3'
}

export function ClientShowcase() {
  return (
    <Section>
      <SectionHeading
        accentWord="tax"
        eyebrow={clientShowcaseEyebrow}
        heading={clientShowcaseHeading}
        intro={clientShowcaseIntro}
      />

      <div
        className={cn(
          'reveal-on-scroll mt-12 grid grid-cols-1 gap-6 sm:gap-8',
          gridColsClass(clientProjects.length),
        )}
      >
        {clientProjects.map((project) => (
          <ProjectShowcaseCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  )
}
