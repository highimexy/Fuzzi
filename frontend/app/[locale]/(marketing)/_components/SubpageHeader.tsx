'use client'

import { Container } from '../../wrappers/Container'
import { BackgroundGrid } from '../_components/BackgroundGrid'
import { useTranslations } from 'next-intl'

interface SubpageHeaderProps {
  title: string
  subtitle: string
  accentColor: string
}

export function SubpageHeader({ title, subtitle, accentColor }: SubpageHeaderProps) {
  const t = useTranslations('SubpageHeader')

  return (
    <header className="w-full">
      <Container className="relative overflow-hidden">
        <BackgroundGrid />
        <div className="relative z-10 flex flex-col px-6 py-20 text-center">
          <h1 className="text-fluid-h2 font-serif leading-none tracking-tighter uppercase">
            {t('exploring')} <br />
            <span className={`${accentColor} italic opacity-90`}>{title}</span>
          </h1>

          <div className="mx-auto mt-8 max-w-xl">
            <p className="font-sans text-[10px] leading-relaxed tracking-[0.3em] uppercase opacity-70">
              {subtitle}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 opacity-20">
            <div className="bg-foreground h-px w-12" />
            <span className="font-sans text-[9px] tracking-widest uppercase italic">
              {t('sectionGuide')}
            </span>
            <div className="bg-foreground h-px w-12" />
          </div>
        </div>
      </Container>
    </header>
  )
}
