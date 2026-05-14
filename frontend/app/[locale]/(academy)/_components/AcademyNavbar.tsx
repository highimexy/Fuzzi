'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiMenu, FiSearch, FiX } from 'react-icons/fi'
import gsap from 'gsap'
import { StoreDropdown } from './StoreDropdown'
import { AcademyLanguageSwitcher } from './AcademyLanguageSwitcher'
import AcademyThemeSwitcher from './AcademyThemeSwitcher'
import { AuthNavMenu } from './AuthNavMenu'

export function AcademyNavbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const cleanPath = pathname.replace(/^\/[a-zA-Z]{2}(?=\/|$)/, '') || '/'

  const profileMenu = [
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
    { label: 'Achievements', href: '/achievements' },
    { label: 'Recruit a friend', href: '/recruit-a-friend' },
    { label: 'Bookmarks', href: '/bookmarks' },
  ]

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

  // BLOKADA SCROLLOWANIA GDY MENU JEST OTWARTE
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // GSAP: ANIMACJA WEJŚCIA
  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      gsap.fromTo(menuRef.current, { x: '-100vw' }, { x: 0, duration: 0.5, ease: 'power3.out' })
    }
  }, [isMobileMenuOpen])

  // GSAP: ANIMACJA WYJŚCIA
  const handleCloseMenu = () => {
    gsap.to(menuRef.current, { x: '-100vw', duration: 0.4, ease: 'power3.in' })
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => setIsMobileMenuOpen(false),
    })
  }

  return (
    <>
      {/* GŁÓWNY NAVBAR - Posiada dwa "piętra" na mobile */}
      <nav className="border-foreground/10 bg-background sticky top-0 z-50 flex w-full flex-col border-b shadow-sm">
        {/* PIĘTRO 1: Logo, Auth, Hamburger (h-16) */}
        <div className="flex h-16 w-full lg:grid lg:grid-cols-3">
          {/* LEWA STRONA */}
          <div className="flex flex-1 lg:flex-none">
            <div className="border-foreground/10 flex flex-1 items-center justify-start px-6 lg:justify-center lg:border-r lg:px-8">
              <Link
                href="/"
                onClick={() => isMobileMenuOpen && handleCloseMenu()}
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

          {/* ŚRODEK (Tylko Desktop) */}
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

          {/* PRAWA STRONA */}
          <div className="flex shrink-0">
            {/* Auth - Desktop i Mobile */}
            <div className="border-foreground/10 flex items-center border-l px-3 lg:border-none lg:px-4">
              <AuthNavMenu items={profileMenu} />
            </div>

            {/* Premium Button - Tylko Desktop */}
            <div className="hidden shrink-0 items-center justify-center px-4 lg:flex">
              <Link
                href="/premium"
                className="border bg-yellow-500/10 px-3 py-1.5 font-sans font-bold text-yellow-500 uppercase transition-colors hover:bg-yellow-500/20"
              >
                Premium
              </Link>
            </div>

            {/* HAMBURGER BUTTON - Tylko Mobile */}
            <button
              onClick={() => (isMobileMenuOpen ? handleCloseMenu() : setIsMobileMenuOpen(true))}
              className="border-foreground/10 hover:bg-foreground/5 flex w-16 items-center justify-center border-l text-2xl transition-colors lg:hidden"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* PIĘTRO 2: Linki do podstron (Mobile) */}
        <div className="border-foreground/10 flex h-12 w-full items-center justify-around border-t px-6 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => isMobileMenuOpen && handleCloseMenu()}
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

      {/* ROZWIJANE MENU MOBILNE (Narzędzia) - Centrowane z ciemnym tłem */}
      {isMobileMenuOpen && (
        <div
          ref={overlayRef}
          onClick={handleCloseMenu}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm lg:hidden"
        >
          {/* Pojemnik na menu - animowany z lewej */}
          <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            className="border-foreground/10 bg-background flex w-11/12 max-w-sm flex-col border p-8 shadow-2xl"
          >
            {/* Switchery z podpisami */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-foreground/60 font-sans text-sm font-bold tracking-wider uppercase">
                  Theme
                </span>
                <AcademyThemeSwitcher />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-foreground/60 font-sans text-sm font-bold tracking-wider uppercase">
                  Language
                </span>
                <AcademyLanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
