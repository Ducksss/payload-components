import Link from 'next/link'

import type { TemplateShellProps } from '../shells'

import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

import './theme.css'

/* Northfield School (education-course) template shell — FOUNDATION SKELETON.
 *
 * Owned by the Northfield art-direction track: replace with the real chrome
 * (responsive header, keyboard-operable mobile menu, footer, section rhythm).
 * Contract to preserve: render everything under
 * data-template-theme='education-course', navigate internally via
 * templatePreviewHref, mark the active page with aria-current, keep the named
 * export EducationCourseShell and the TemplateShellProps signature, and keep every
 * interactive semantic here — never inside the visual canvas. */
export function EducationCourseShell({ activePath, children, template }: TemplateShellProps) {
  return (
    <div
      data-template-theme="education-course"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <header className="border-b border-border">
        <nav
          aria-label="Northfield School site navigation"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        >
          <Link href={templatePreviewHref(template.slug)} className="text-base font-semibold">
            Northfield School
          </Link>
          <div className="flex items-center gap-1">
            {template.navigation.map((item) => (
              <Link
                key={item.path}
                href={templatePreviewHref(template.slug, item.path)}
                aria-current={activePath === item.path ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  activePath === item.path
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 text-sm text-muted-foreground sm:px-6">
          <span>Northfield School — a fictional concept</span>
          <span>Composed from open-source Payload blocks</span>
        </div>
      </footer>
    </div>
  )
}
