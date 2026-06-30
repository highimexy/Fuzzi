'use client'

import { usePathname } from 'next/navigation'
import { Link } from 'next-view-transitions'

export function AcademyLanguageSwitcher() {
  const pathname = usePathname()

  const getLocalizedHref = (newLocale: string) => {
    if (!pathname) return `/${newLocale}`

    const segments = pathname.split('/')
    segments[1] = newLocale

    return segments.join('/')
  }

  return (
    <div className="text-foreground flex items-center gap-2 font-sans tracking-[0.2em]">
      <Link href={getLocalizedHref('en')} className="transition-opacity hover:opacity-70">
        EN
      </Link>
      <span>/</span>
      <Link href={getLocalizedHref('pl')} className="transition-opacity hover:opacity-70">
        PL
      </Link>
    </div>
  )
}
