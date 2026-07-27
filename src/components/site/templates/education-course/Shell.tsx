import type { TemplateShellProps } from '../shells'

import { NorthfieldColophon } from './NorthfieldColophon'
import { NorthfieldHeader } from './NorthfieldHeader'
import './theme.css'

/* Northfield School (education-course) template shell — the syllabus direction.
 *
 * Contract preserved from the frozen foundation: everything renders under
 * data-template-theme='education-course', internal navigation goes through
 * templatePreviewHref, the active page carries aria-current, the named export
 * stays EducationCourseShell with the TemplateShellProps signature, and every
 * interactive semantic (real links, the keyboard-operable mobile disclosure)
 * lives in the shell — never inside the visual canvas.
 *
 * The composition is a school prospectus, not a product page. theme.css dissolves
 * the catalog's specimen frames and paints three registers with three jobs: plain
 * chalk paper for prose, ruled worksheet paper for everything sequential (the
 * module ladder, the lessons, the prerequisites, the cohort matrix), and one
 * chalkboard band per page for the figures. Section rhythm is owned by theme.css
 * through the [data-template-section] / [data-tone] wrappers the renderer emits;
 * below-hero sections already scroll-reveal through the shared choreography. */

export function EducationCourseShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div
      className="flex min-h-screen flex-col text-foreground antialiased"
      data-template-theme="education-course"
    >
      <NorthfieldHeader activePath={activePath} template={template} />

      <main className="flex-1">{children}</main>

      <NorthfieldColophon activePath={activePath} template={template} />
    </div>
  )
}
