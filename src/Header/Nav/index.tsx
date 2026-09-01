'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-2 sm:gap-4">
      <div className="hidden items-center gap-4 sm:flex">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="link" />
        })}
      </div>
      <Link className="p-1.5" href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-4.5 text-muted-foreground transition-colors hover:text-foreground" />
      </Link>
      <Button asChild className="rounded-full px-4" size="sm" variant="brand">
        <Link href="/#early-access">Join early access</Link>
      </Button>
    </nav>
  )
}
