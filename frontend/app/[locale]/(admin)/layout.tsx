'use client'

import { useState, useEffect } from 'react'
import { useTransitionRouter } from 'next-view-transitions'
import { useTranslations } from 'next-intl'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import AcademyThemeSwitcher from '@/app/[locale]/(academy)/_components/AcademyThemeSwitcher'
import { AcademyLanguageSwitcher } from '@/app/[locale]/(academy)/_components/AcademyLanguageSwitcher'
import {
  RiDashboard2Line,
  RiUserLine,
  RiChat1Line,
  RiSwordLine,
  RiArrowLeftSLine,
  RiMenuLine,
  RiCloseLine,
} from 'react-icons/ri'

const NAV = [
  { key: 'dashboard', href: '/admin', icon: RiDashboard2Line, exact: true },
  { key: 'users', href: '/admin/users', icon: RiUserLine, exact: false },
  { key: 'discuss', href: '/admin/discuss', icon: RiChat1Line, exact: false },
  { key: 'quests', href: '/admin/quests', icon: RiSwordLine, exact: false },
] as const

function NavLinks({ onClose }: { onClose?: () => void }) {
  const t = useTranslations('Admin')
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) => {
    const p = pathname.replace(/^\/[a-z]{2}/, '') || '/'
    return exact ? p === href : p.startsWith(href)
  }

  return (
    <>
      {NAV.map(({ key, href, icon: Icon, exact }) => {
        const active = isActive(href, exact)
        return (
          <Link
            key={key}
            href={href}
            onClick={onClose}
            className={`mb-0.5 flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors ${
              active
                ? 'bg-accent/10 font-medium text-accent'
                : 'text-foreground/55 hover:bg-foreground/5 hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {t(`nav.${key}`)}
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
          </Link>
        )
      })}
    </>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Admin')
  const router = useTransitionRouter()
  const bootstrapped = useUserStore((s) => s.bootstrapped)
  const isLoggedIn = useUserStore((s) => s.isLoggedIn)
  const role = useUserStore((s) => s.user?.role)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!bootstrapped) return
    if (!isLoggedIn || role !== 'admin') {
      router.replace('/lessons')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootstrapped, isLoggedIn, role])

  if (!bootstrapped) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/15 border-t-accent" />
          <span className="text-[10px] uppercase tracking-widest text-foreground/35">
            {t('loading')}
          </span>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || role !== 'admin') return null

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 flex w-56 flex-col border-r border-foreground/10 bg-background
          transition-transform duration-200
          md:static md:translate-x-0 md:transition-none
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-foreground/10 px-5">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
            ⬡ Admin
          </span>
          <button
            onClick={() => setOpen(false)}
            className="text-foreground/35 hover:text-foreground md:hidden"
          >
            <RiCloseLine className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-foreground/25">
            Menu
          </p>
          <NavLinks onClose={() => setOpen(false)} />
        </nav>

        {/* Footer controls */}
        <div className="shrink-0 space-y-3 border-t border-foreground/10 p-4">
          {/* Theme + Language */}
          <div className="flex items-center justify-between">
            <AcademyThemeSwitcher />
            <AcademyLanguageSwitcher />
          </div>
          {/* Back to app */}
          <Link
            href="/lessons"
            className="flex items-center gap-2 text-xs text-foreground/35 transition-colors hover:text-foreground/60"
          >
            <RiArrowLeftSLine className="h-4 w-4" />
            {t('nav.backToApp')}
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-foreground/10 px-4 md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="text-foreground/50 hover:text-foreground"
          >
            <RiMenuLine className="h-5 w-5" />
          </button>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
            ⬡ Admin
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
