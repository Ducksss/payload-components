import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto bg-black text-white dark:bg-card">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between lg:py-14">
        <div className="flex flex-col gap-3">
          <Link className="flex items-center" href="/">
            <Logo />
          </Link>
          <p className="text-sm text-white/55">
            Production-ready blocks for Payload v3. Open source.
          </p>
        </div>

        <div className="flex flex-col-reverse items-start gap-5 md:flex-row md:items-center md:gap-8">
          <ThemeSelector />
          <nav className="flex flex-col gap-4 md:flex-row md:gap-6">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  className="text-sm text-white/70 transition-colors hover:text-white"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
