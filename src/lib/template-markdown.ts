import { localizeHref, type SiteLocale } from '@/i18n/config'
import { siteUrl } from '@/lib/site'
import {
  templateDetailHref,
  templateInstallCommand,
  uniqueTemplateBlockSlugs,
} from '@/lib/templates/registry'
import { TEMPLATE_CONCEPT_DISCLOSURE, type TemplateShowcase } from '@/lib/templates/types'

/** Serialize the same recipe shown on the template detail and preview pages. */
export function getTemplateLLMText(template: TemplateShowcase, locale: SiteLocale = 'en') {
  return [
    `# ${template.title} (${localizeHref(templateDetailHref(template.slug), locale)})`,
    '',
    template.summary,
    '',
    template.description,
    '',
    `Status: Concept preview · Revision ${template.revision}`,
    TEMPLATE_CONCEPT_DISCLOSURE,
    '',
    '## Installation',
    '',
    '```bash',
    templateInstallCommand(template),
    '```',
    '',
    '## Included blocks',
    '',
    ...uniqueTemplateBlockSlugs(template).map(
      (slug) => `- [${slug}](${siteUrl}${localizeHref(`/docs/components/${slug}`, locale)})`,
    ),
    '',
    '## Page plan',
    ...template.pages.flatMap((page) => [
      '',
      `### ${page.label} (/${page.path})`,
      '',
      page.title,
      page.description,
      '',
      ...page.sections.map(
        (section, index) => `${index + 1}. ${section.componentSlug} — ${section.id}`,
      ),
    ]),
    '',
    '## Visual direction',
    '',
    template.theme.description,
    `Tone: ${template.visualTone.join(', ')}`,
    '',
  ].join('\n')
}
