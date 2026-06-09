'use client'

import { useTranslations } from 'next-intl'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'
import { OperationsDashboard } from '../_components/OperationsDashboard'

export default function StocksPage() {
  const t = useTranslations('Academy.stocks')

  return (
    <div className="flex h-full w-full flex-col">
      <div className="shrink-0 px-4 py-8 lg:px-8 lg:py-10">
        <h1 className="font-serif text-3xl font-black uppercase tracking-tight lg:text-4xl">
          {t('title')}
        </h1>
        <p className="text-foreground/45 mt-2 font-sans text-sm">{t('subtitle')}</p>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <AcademyBackgroundGrid />
        <OperationsDashboard />
      </div>
    </div>
  )
}
