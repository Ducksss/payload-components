declare module 'collections/server' {
  import type { ResolvedInput } from 'fumadocs-core/source'

  export const docs: {
    toFumadocsSource: () => ResolvedInput
  }
}
