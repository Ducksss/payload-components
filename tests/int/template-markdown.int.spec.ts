import { describe, expect, it } from 'vitest'

import { getTemplateLLMText } from '../../src/lib/template-markdown'
import { templateShowcases } from '../../src/lib/templates/registry'

describe('template markdown', () => {
  it('includes every page and ordered section without losing the install boundary', () => {
    for (const template of templateShowcases) {
      const text = getTemplateLLMText(template)
      expect(text).toContain(`npx payload-components add-template ${template.slug}`)
      expect(text).toContain('curated copy shown here is not seeded')
      for (const page of template.pages) {
        expect(text).toContain(`### ${page.label} (/${page.path})`)
        const recipe = page.sections
          .map((section, index) => `${index + 1}. ${section.componentSlug} — ${section.id}`)
          .join('\n')
        expect(text).toContain(recipe)
      }
    }
  })

  it('uses localized page links while preserving canonical registry slugs', () => {
    const template = templateShowcases[0]
    const text = getTemplateLLMText(template, 'zh')
    expect(text).toContain(`/zh/templates/${template.slug}`)
    expect(text).toContain('/zh/docs/components/')
    expect(text).toContain(`npx payload-components add-template ${template.slug}`)
  })
})
