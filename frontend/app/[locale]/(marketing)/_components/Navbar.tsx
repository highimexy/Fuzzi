'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeSwitch from './ThemeSwitch'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Container } from '../../wrappers/Container'
import { FuzziMark } from '../../global-components/logo/page'
import Dot from '../../global-components/dot/page'
import { useTranslations } from 'next-intl'

export function Navbar() {
  const t = useTranslations('Navbar')
  const pathname = usePathname()

  const cleanPath = pathname.replace(/^\/[a-zA-Z]{2}(?=\/|$)/, '') || '/'

  const navLinks = [
    {
      href: '/qa',
      label: t('qa'),
      active: cleanPath === '/qa' || cleanPath.startsWith('/qa/'),
    },
    {
      href: '/reality-check',
      label: t('reality'),
      active: cleanPath === '/reality-check' || cleanPath.startsWith('/reality-check/'),
    },
    {
      href: '/lessons',
      label: t('academy'),
      active: cleanPath === '/lessons' || cleanPath.startsWith('/lessons/'),
    },
  ]

  return (
    <>
      <nav className="border-foreground/10 bg-background sticky top-0 z-50 w-full border-b">
        <Container>
          <div className="flex h-16 lg:grid lg:grid-cols-3">
            {/* 1. NARZĘDZIA */}
            <div className="border-foreground/10 flex justify-center lg:border-none">
              <div className="border-foreground/10 flex items-center border-r border-l px-3 lg:border-none lg:px-5">
                <ThemeSwitch />
              </div>
              <div className="border-foreground/10 flex items-center border-r px-3 lg:border-none lg:px-5">
                <LanguageSwitcher />
              </div>
            </div>

            {/* 2. LOGO */}
            <div className="border-foreground/10 flex flex-1 items-center justify-center px-6 lg:border-r lg:border-l lg:px-10">
              <Link
                href="/lessons"
                className="flex items-center gap-3 transition-opacity hover:opacity-80"
              >
                {/* Ikona pająka */}
                <FuzziMark size={40} />

                {/* Nazwa + migająca kropka */}
                <span className="flex items-end gap-1">
                  <span className="text-foreground font-serif text-[clamp(1.1rem,2.3vw,1.8rem)] font-bold uppercase">
                    Fuzzi
                  </span>
                  <div className="relative top-0.5 lg:top-auto lg:bottom-0.5">
                    <Dot />
                  </div>
                </span>
              </Link>
            </div>

            {/* 3. LINKI (Desktop) */}
            <div className="hidden items-center justify-around px-4 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-sans uppercase transition-all hover:opacity-80 ${
                    link.active
                      ? 'text-foreground font-bold underline decoration-2 underline-offset-[6px]'
                      : 'text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* LINKI (Mobile – pasek dolny) */}
          <div className="border-foreground/10 flex h-12 items-center justify-around border-t px-6 lg:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans uppercase transition-all ${
                  link.active
                    ? 'text-accent font-bold underline decoration-2 underline-offset-4'
                    : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </nav>
    </>
  )
}
