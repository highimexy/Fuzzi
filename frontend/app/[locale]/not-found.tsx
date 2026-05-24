'use client'

import { Container } from './wrappers/Container'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { FiArrowRight } from 'react-icons/fi'

export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <main className="flex h-dvh flex-col justify-center overflow-hidden">
      <Container className="relative py-32 text-center" withBorders={true}>
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[25vw] leading-none tracking-tighter uppercase opacity-[0.03] select-none">
          {t('void')}
        </div>

        <div className="relative z-10 flex flex-col items-center px-6">
          <span className="text-fluid-small text-error font-sans font-bold tracking-[0.4em] uppercase">
            {t('errorLabel')}
          </span>

          <h1 className="text-fluid-h1 mt-8 font-serif leading-[0.8] tracking-tighter uppercase italic">
            {t('title1')} <br />
            <span className="opacity-30">{t('title2')}</span>
          </h1>

          <div className="mx-auto mt-12 max-w-lg">
            <p className="text-fluid-p font-sans leading-relaxed opacity-60">{t('description')}</p>
          </div>

          <div className="mt-16 flex flex-col gap-6 sm:flex-row">
            <Link
              href="/"
              className="border-foreground text-fluid-small bg-foreground text-background px-10 py-5 font-sans font-bold tracking-[0.3em] uppercase transition-all duration-500 hover:opacity-80"
            >
              {t('btnHome')}
            </Link>
            <Link
              href="/reality-check"
              className="border-foreground/20 text-fluid-small hover:border-foreground flex items-center gap-2 border px-10 py-5 font-sans font-bold tracking-[0.3em] uppercase transition-all duration-500"
            >
              {t('btnTruth')} <FiArrowRight className="text-lg" />
            </Link>
          </div>

          <div className="mt-20 flex items-center gap-4 opacity-20">
            <div className="bg-foreground h-px w-12" />
            <span className="font-sans text-[10px] tracking-widest uppercase">
              {t('endOfLine')}
            </span>
            <div className="bg-foreground h-px w-12" />
          </div>
        </div>
      </Container>
    </main>
  )
}
