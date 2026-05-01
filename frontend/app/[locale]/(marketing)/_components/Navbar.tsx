'use client'

import Link from 'next/link'
import { FiSearch } from 'react-icons/fi'
import ThemeSwitch from './ThemeSwitch'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Container } from '../../wrappers/Container'

export function Navbar() {
  return (
    <nav className="border-foreground/10 bg-background sticky top-0 z-50 w-full border-b">
      <Container>
        <div className="flex h-16 lg:grid lg:grid-cols-3">
          {/* 1. LOGO */}
          <div className="border-foreground/10 flex flex-1 items-center justify-center border-r px-6 lg:px-10">
            <Link
              href="/lessons"
              className="font-serif text-[clamp(1.1rem,2.3vw,1.8rem)] font-bold uppercase transition-opacity hover:opacity-80"
            >
              Frontline
            </Link>
          </div>

          {/* 2. NARZĘDZIA (Theme, Język, Szukajka) */}
          <div className="border-foreground/10 flex lg:border-r">
            {/* Przełącznik Motywu */}
            <div className="border-foreground/10 flex items-center border-r px-3 lg:px-5">
              <ThemeSwitch />
            </div>

            {/* Języków w swojej własnej komórce */}
            <div className="border-foreground/10 flex items-center border-r px-3 lg:px-5">
              <LanguageSwitcher />
            </div>

            {/* Wyszukiwarka */}
            <div className="flex flex-1 items-center justify-between px-4 lg:px-6">
              <span className="hidden font-sans uppercase lg:block">Search</span>
              <FiSearch className="text-xl" />
            </div>
          </div>

          {/* 3. LINKI (Desktop) */}
          <div className="hidden items-center justify-around px-4 lg:flex">
            <Link href="/qa" className="font-sans uppercase transition-opacity hover:opacity-80">
              QA
            </Link>
            <Link
              href="/reality-check"
              className="font-sans uppercase transition-opacity hover:opacity-80"
            >
              Reality Check
            </Link>
            <Link
              href="/lessons"
              className="font-sans uppercase transition-opacity hover:opacity-80"
            >
              Academy
            </Link>
          </div>
        </div>

        {/* LINKI (Mobile - Pasek dolny) */}
        <div className="border-foreground/10 flex h-12 items-center justify-around border-t px-6 lg:hidden">
          <Link href="/qa" className="font-sans uppercase">
            QA
          </Link>
          <Link href="reality-check" className="font-sans uppercase">
            Reality
          </Link>
          <Link href="/lessons" className="font-sans uppercase">
            Academy
          </Link>
        </div>
      </Container>
    </nav>
  )
}
