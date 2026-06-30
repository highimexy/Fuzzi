'use client'

import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { FiBook, FiTarget, FiCompass, FiMap, FiUser, FiTrendingUp, FiGrid } from 'react-icons/fi'
import { useTranslations } from 'next-intl'

export function AcademySidebar() {
  const t = useTranslations('Academy')
  const pathname = usePathname()

  const navItems = [
    { href: '/lessons', label: t('sidebar.library'), icon: FiBook },
    { href: '/quest', label: t('sidebar.quest'), icon: FiTarget, badge: t('sidebar.questBadge') },
    { href: '/explore', label: t('sidebar.explore'), icon: FiCompass },
    { href: '/components', label: t('sidebar.components'), icon: FiGrid },
    { href: '/road-map', label: t('sidebar.roadMap'), icon: FiMap },
    { href: '/stocks', label: t('sidebar.stocks'), icon: FiTrendingUp },
  ]

  const cleanPath = pathname.replace(/^\/[a-zA-Z]{2}(?=\/|$)/, '') || '/'

  const allowedPaths = ['/lessons', '/quest', '/explore', '/components', '/road-map', '/stocks']
  if (!allowedPaths.includes(cleanPath) && !cleanPath.startsWith('/components')) return null

  return (
    <aside className="border-foreground/10 bg-background relative z-50 hidden w-40 shrink-0 flex-col border-r lg:flex">
      {/* NAWIGACJA BOCZNA */}
      <nav className="flex flex-1 flex-col">
        {navItems.map((item) => {
          const Icon = item.icon

          const isActive =
            cleanPath === item.href || (cleanPath === '/lessons' && item.href === '/library')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group border-b-foreground/10 relative flex items-center justify-between border border-transparent px-4 py-5 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-foreground/20 hover:opacity-100 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)] ${
                isActive ? 'bg-foreground/5 opacity-100' : 'hover:bg-background opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={`text-base transition-colors ${
                    isActive ? 'text-foreground' : 'group-hover:text-foreground/60'
                  }`}
                />
                <span
                  className={`font-sans text-[10px] font-bold tracking-widest uppercase transition-colors ${
                    isActive ? 'text-foreground' : 'group-hover:text-foreground/60'
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {item.badge && (
                <span className="bg-primary px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-white uppercase shadow-sm">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* KARTA LOGOWANIA / PROFILU */}
      <div className="border-foreground/10 w-full border-t p-5 text-center">
        <p className="mb-4 font-sans text-xs leading-relaxed opacity-60">{t('sidebar.signInPrompt')}</p>
        <button className="bg-foreground text-background flex h-10 w-full items-center justify-center gap-2 rounded-full py-2 text-xs font-bold transition-transform hover:scale-105">
          <FiUser /> {t('sidebar.signIn')}
        </button>
      </div>
    </aside>
  )
}
