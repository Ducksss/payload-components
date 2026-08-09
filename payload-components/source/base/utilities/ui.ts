import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes, letting later classes win over earlier conflicting
 * ones. Every installed block calls this on its root element.
 *
 * This is the same helper the Payload website starter ships at
 * `src/utilities/ui.ts`. If your project already has one — including shadcn's
 * default at `src/lib/utils.ts` — keep yours and point the `utils` alias in
 * components.json at it instead; `payload-components init --scaffold` will not
 * overwrite a file you already have.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
