'use client'

import { useTranslations } from 'next-intl'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'
import { OperationsDashboard } from '../_components/OperationsDashboard'

export default function StocksPage() {
  const t = useTranslations('Academy.stocks')

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <AcademyBackgroundGrid />
      <div className="relative z-10 shrink-0 px-4 py-8 lg:px-8 lg:py-10">
        <h1 className="font-serif text-3xl font-black tracking-tight uppercase lg:text-4xl">
          {t('title')}
        </h1>
        <p className="text-foreground/45 mt-2 font-sans text-sm">{t('subtitle')}</p>
      </div>
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4 pb-8 lg:px-8 lg:pb-10">
        <div className="w-full">
          <OperationsDashboard />
        </div>
      </div>
    </div>
  )
}
