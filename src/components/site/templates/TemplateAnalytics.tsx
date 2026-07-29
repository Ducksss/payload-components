'use client'

import { useEffect } from 'react'

import { trackTemplateEvent } from '@/lib/analytics'

/* Fire-once surface-view events for the indexable template pages. Only the
 * approved anonymous vocabulary: which surface, which template (if any), and
 * its revision — never page content or free text. */
export function TemplateGalleryView() {
  useEffect(() => {
    trackTemplateEvent('template_gallery_view', { source: 'gallery' })
  }, [])

  return null
}

export function TemplateDetailView({ revision, template }: { revision: number; template: string }) {
  useEffect(() => {
    trackTemplateEvent('template_detail_view', { revision, source: 'detail', template })
  }, [revision, template])

  return null
}
