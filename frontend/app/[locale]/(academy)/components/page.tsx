'use client'

import { useState, useMemo } from 'react'
import { Link } from 'next-view-transitions'
import { FiGrid, FiSearch } from 'react-icons/fi'
import { useTranslations } from 'next-intl'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'
import { QA_COMPONENTS, type QAComponent } from './_data/components'

function ComponentPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(/[\s/]/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="bg-foreground/[0.03] flex aspect-[4/3] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2 opacity-30">
        <FiGrid className="text-3xl" />
        <span className="font-serif text-lg font-bold tracking-widest uppercase">{initials}</span>
      </div>
    </div>
  )
}

function ComponentCard({ component, locale }: { component: QAComponent; locale: string }) {
  const isPl = locale === 'pl'
  const name = isPl ? component.name_pl : component.name_en
  const aliases = isPl ? component.aliases_pl : component.aliases_en
  const description = isPl ? component.description_pl : component.description_en

  return (
    <Link
      href={`/components/${component.slug}`}
      className="border-foreground/10 bg-background group hover:border-foreground/25 flex flex-col overflow-hidden border transition-all duration-300 ease-out hover:z-20 hover:translate-x-0.5 hover:-translate-y-0.5 hover:rounded-md hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.12)]"
    >
      {/* Obszar podglądu */}
      {component.image ? (
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={component.image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <ComponentPlaceholder name={name} />
      )}

      {/* Treść */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-serif text-sm leading-tight font-bold tracking-wide uppercase">
          {name}
        </h3>
        {aliases && aliases.length > 0 && (
          <p className="text-foreground/35 font-sans text-[10px] italic">{aliases.join(', ')}</p>
        )}
        <p className="text-foreground/55 mt-1 line-clamp-3 font-sans text-xs leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  )
}

export default function ComponentsPage() {
  const t = useTranslations('Academy.components')
  const [query, setQuery] = useState('')

  // Locale from DOM (client component workaround)
  const locale = typeof document !== 'undefined' ? document.documentElement.lang || 'en' : 'en'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return [...QA_COMPONENTS].sort((a, b) => a.name_en.localeCompare(b.name_en))
    return QA_COMPONENTS.filter((c) => {
      const nameMatch = c.name_en.toLowerCase().includes(q) || c.name_pl.toLowerCase().includes(q)
      const aliasMatch =
        (c.aliases_en ?? []).some((a) => a.toLowerCase().includes(q)) ||
        (c.aliases_pl ?? []).some((a) => a.toLowerCase().includes(q))
      return nameMatch || aliasMatch
    }).sort((a, b) => a.name_en.localeCompare(b.name_en))
  }, [query])

  return (
    <div className="relative flex w-full flex-1 flex-col overflow-hidden">
      <AcademyBackgroundGrid />

      <div className="relative z-10 flex w-full flex-1 flex-col px-4 py-8 lg:px-8 lg:py-10">
        {/* Nagłówek */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-black tracking-tight uppercase lg:text-4xl">
            {t('title')}
          </h1>
          <p className="text-foreground/45 mt-2 font-sans text-sm">{t('subtitle')}</p>
        </div>

        {/* Wyszukiwanie */}
        <div className="border-foreground/15 focus-within:border-foreground/40 mb-8 flex items-center gap-3 border bg-transparent px-4 py-3">
          <FiSearch className="text-foreground/30 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="placeholder:text-foreground/30 flex-1 bg-transparent font-sans text-sm outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-foreground/30 hover:text-foreground/60 font-sans text-xs transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-foreground/30 flex flex-1 items-center justify-center font-sans text-sm">
            {t('noResults')}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((component) => (
              <ComponentCard key={component.slug} component={component} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
