import Image from 'next/image'
import { getLocale } from 'next-intl/server'

import Link from '@/i18n/Link'
import { ArrowRight } from 'lucide-react'

import { localizeHref, normalizeSiteLocale } from '@/i18n/config'
import { landingSections } from '@/lib/site'
import { templateDetailHref, templatePosterSrc, templateShowcases } from '@/lib/templates/registry'

/* After the bench: the same parts, assembled into whole sites. One row of real
 * template posters (each brands itself, which is the point — the catalog is
 * neutral and the sites built from it are not), scrolling sideways on its own
 * rather than widening the page. */
export async function TemplatesSection() {
  const locale = normalizeSiteLocale(await getLocale())
  const { heading, id } = landingSections.templates

  return (
    <section aria-labelledby={`${id}-title`} className="border-t border-border" id={id}>
      <div className="container py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="max-w-xl">
            <h2 className="type-heading text-balance text-foreground" id={`${id}-title`}>
              {heading}
            </h2>
            <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground">
              {templateShowcases.length} template concepts, each built only from catalog blocks. One
              command installs every block a template uses.
            </p>
          </div>
          <Link
            className="group inline-flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-brand"
            href={localizeHref('/templates', locale)}
          >
            See the templates
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none rtl:rotate-180"
            />
          </Link>
        </div>

        <ul className="bench-reel mt-10" aria-label="Template concepts">
          {templateShowcases.map((template) => (
            <li key={template.slug}>
              <Link
                className="group block"
                href={localizeHref(templateDetailHref(template.slug), locale)}
              >
                <Image
                  alt={`${template.title}, home page`}
                  className="aspect-[16/10] w-full border border-border object-cover object-top transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  height={1600}
                  sizes="18rem"
                  src={templatePosterSrc(template.slug)}
                  width={2560}
                />
                <span className="ds-label mt-2 flex justify-between gap-3 text-muted-foreground">
                  <span className="text-foreground">{template.slug}</span>
                  <span>add-template</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
