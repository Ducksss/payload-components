'use client'

import type { ComponentProps } from 'react'

import { type Framework, FrameworkProvider } from 'fumadocs-core/framework'
import { RootProvider } from 'fumadocs-ui/provider/base'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'

import { publicPathname } from '@/i18n/config'

/* Fumadocs matches its chrome against the framework pathname: the TOC trigger
 * label, prev/next footer, breadcrumb, and sidebar state. Its stock Next
 * provider passes next/navigation's raw value, which is the internal
 * `/en/docs` route while a page is prerendered and `/docs` in the browser, so
 * the static HTML missed the page tree that the client matched and every docs
 * page failed hydration (React #418). The public pathname is the same on both
 * sides. */
function usePublicPathname() {
  return publicPathname(usePathname())
}

/** Fumadocs' RootProvider, wired to Next.js the way `fumadocs-ui/provider/next`
 * does, except for the pathname. */
export function FumadocsRootProvider(props: ComponentProps<typeof RootProvider>) {
  return (
    <FrameworkProvider
      /* Fumadocs types href and src as optional; it always passes both. */
      Image={Image as Framework['Image']}
      Link={Link as Framework['Link']}
      useParams={useParams}
      usePathname={usePublicPathname}
      useRouter={useRouter}
    >
      <RootProvider {...props} />
    </FrameworkProvider>
  )
}
