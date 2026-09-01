import { createFromSource } from 'fumadocs-core/search/server'

import { source } from '@/lib/source'

export const { GET } = createFromSource(source, {
  // Fumadocs selects the appropriate tokenizer per localized request.
  // Leaving this in multilingual mode supports both English and Chinese.
})
