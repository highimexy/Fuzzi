'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiSearch } from 'react-icons/fi'
import { StoreDropdown } from './StoreDropdown'
import { AcademyLanguageSwitcher } from './AcademyLanguageSwitcher'
import AcademyThemeSwitcher from './AcademyThemeSwitcher'

export function AcademyNavbar() {
  const pathname = usePathname()

  const cleanPath = pathname.replace(/^\/[a-zA-Z]{2}(?=\/|$)/, '') || '/'

  const storeItems = [
    { label: 'Merch Shop', href: '/store/merch' },
    { label: 'Redeem', href: '/store/redeem' },
    { label: 'Premium', href: '/premium' },
  ]

  const navLinks = [
    {
      href: '/lessons',
      label: 'Lessons',
      active: cleanPath === '/lessons' || cleanPath.startsWith('/lessons'),
    },
    {
      href: '/ranking',
      label: 'Ranking',
      active: cleanPath.startsWith('/ranking'),
    },
    {
      href: '/discuss',
      label: 'Discuss',
      active: cleanPath.startsWith('/discuss'),
    },
  ]

  return (
    <nav className="border-foreground/10 bg-background sticky top-0 z-50 w-full border-b">
      <div className="flex h-16 lg:grid lg:grid-cols-3">
        {/* 1. LEWA STRONA (Logo + Switchery Desktopowe) */}
        <div className="flex flex-1 lg:flex-none">
          <div className="border-foreground/10 flex flex-1 items-center justify-center border-r px-6 lg:flex-none lg:px-8">
            <Link
              href="/"
              className="font-serif text-[clamp(1.1rem,2.3vw,1.8rem)] font-bold whitespace-nowrap text-yellow-500 uppercase transition-opacity hover:opacity-80"
            >
              Frontline
            </Link>
          </div>

          {/* Switchery DESKTOP - ukryte na mobile */}
          <div className="border-foreground/10 hidden items-center border-r px-3 lg:flex lg:px-4">
            <AcademyThemeSwitcher />
          </div>
          <div className="border-foreground/10 hidden items-center border-r px-3 lg:flex lg:px-4">
            <AcademyLanguageSwitcher />
          </div>
        </div>

        {/* 2. ŚRODEK (Linki Główne - tylko Desktop) */}
        <div className="border-foreground/10 hidden items-center justify-around border-r px-4 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans uppercase transition-all hover:opacity-80 ${
                link.active ? 'font-bold underline decoration-2 underline-offset-[6px]' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
          <StoreDropdown label="Store" items={storeItems} />
        </div>

        {/* 3. PRAWA STRONA (Szukajka + Auth + Switchery Mobile) */}
        <div className="flex shrink-0">
          {/* Switchery MOBILE - ukryte na desktopie */}
          <div className="border-foreground/10 flex items-center border-l px-3 lg:hidden">
            <AcademyThemeSwitcher />
          </div>
          <div className="border-foreground/10 flex items-center border-l px-3 lg:hidden">
            <AcademyLanguageSwitcher />
          </div>

          {/* Komórka: Wyszukiwarka */}
          <div className="border-foreground/10 flex flex-1 items-center justify-between border-l px-4 lg:border-r lg:border-l-0 lg:px-4">
            <input
              type="text"
              placeholder="SEARCH..."
              className="text-foreground placeholder:text-foreground/30 hidden w-full border-none bg-transparent font-sans uppercase outline-none focus:ring-0 lg:block"
            />
            <button aria-label="Search">
              <FiSearch className="shrink-0 text-xl" />
            </button>
          </div>

          {/* Komórka: Auth (Tylko Desktop) */}
          <div className="hidden shrink-0 items-center justify-center gap-4 px-4 lg:flex">
            <Link
              href="/login"
              className="font-sans font-bold uppercase transition-opacity hover:opacity-80"
            >
              Sign In
            </Link>
            <Link
              href="/premium"
              className="border bg-yellow-500/10 px-3 py-1.5 font-sans font-bold text-yellow-500 uppercase transition-colors hover:bg-yellow-500/20"
            >
              Premium
            </Link>
          </div>
        </div>
      </div>

      {/* LINKI (Mobile - Pasek dolny) */}
      <div className="border-foreground/10 flex h-12 items-center justify-around border-t px-6 lg:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-sans uppercase transition-all ${
              link.active ? 'font-bold underline decoration-2 underline-offset-4' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
        <StoreDropdown label="Store" items={storeItems} />
      </div>
    </nav>
  )
}
