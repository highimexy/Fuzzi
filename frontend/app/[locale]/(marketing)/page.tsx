'use client'

import { FiArrowRight } from 'react-icons/fi'
import { HomeHeader } from './_components/HomeHeader'
import { SectionDivider } from './_components/SectionDivider'
import { Container } from '../wrappers/Container'
import Link from 'next/link'
import { SupportersTicker } from './_components/SupportersTicker'
import { useTranslations } from 'next-intl'
import { OperationsDashboard } from './_components/OperationsDashboard'

export default function Home() {
  const t = useTranslations('Home')

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <main className="flex-1">
        <HomeHeader />
        <SectionDivider />
        <SupportersTicker />
        <SectionDivider />
        <OperationsDashboard />
        <SectionDivider />
        {/* 00. QA SECTION */}
        <section className="border-foreground/10 w-full overflow-hidden border-b">
          <Container className="py-16 md:py-24">
            <div className="flex flex-col gap-12 px-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-fit flex-1">
                <span className="text-fluid-small font-sans font-bold tracking-[0.3em] text-green-500 uppercase">
                  {t('qa.label')}
                </span>
                <h2 className="mt-4 font-serif leading-[0.85] tracking-tighter wrap-break-word uppercase">
                  {t('qa.title1')} <br />{' '}
                  <span className="italic opacity-30">{t('qa.title2')}</span>
                </h2>
              </div>

              <div className="w-full lg:max-w-md xl:max-w-lg">
                <p className="text-fluid-h3 font-serif leading-snug italic">{t('qa.quote')}</p>
                <p className="mt-6 font-sans text-sm leading-relaxed opacity-60">
                  {t('qa.description')}
                </p>
                <Link
                  href="/qa"
                  className="group text-fluid-small mt-8 inline-flex items-center gap-3 border-b border-green-500 pb-1 font-bold tracking-widest uppercase transition-all"
                >
                  <span>{t('qa.link')}</span>
                  <FiArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>
            </div>
          </Container>
        </section>
        <SectionDivider />



        {/* 01. REALITY CHECK */}
        <section className="border-foreground/10 relative w-full overflow-hidden border-b bg-purple-500/3">
          <Container className="relative py-16 md:py-24">
            <div className="pointer-events-none absolute top-10 right-10 hidden font-serif text-[clamp(4rem,15vw,12rem)] leading-none tracking-tighter uppercase opacity-[0.03] select-none lg:block">
              {t('reality.watermark')}
            </div>

            <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
              <span className="text-fluid-small font-sans font-bold tracking-[0.4em] text-purple-500 uppercase">
                {t('reality.label')}
              </span>

              <h2 className="mt-6 font-serif leading-[0.85] tracking-tighter uppercase">
                {t.rich('reality.titleLine1', {
                  light: (chunks) => <span className="italic opacity-30">{chunks}</span>,
                })}
                <br />
                {t.rich('reality.titleLine2', {
                  purple: (chunks) => <span className="text-purple-500 italic">{chunks}</span>,
                })}
              </h2>

              <div className="border-foreground/10 mt-16 grid gap-10 border-t pt-12 text-left md:grid-cols-2 lg:gap-16">
                <div className="space-y-4">
                  <h4 className="text-fluid-small font-sans font-bold tracking-widest text-purple-500 uppercase opacity-60">
                    {t('reality.dreamLabel')}
                  </h4>
                  <p className="text-fluid-h3 font-serif italic">{t('reality.dreamQuote')}</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-fluid-small font-sans font-bold tracking-widest text-purple-500 uppercase opacity-60">
                    {t('reality.realityLabel')}
                  </h4>
                  <p className="text-fluid-h3 font-serif italic">{t('reality.realityQuote')}</p>
                </div>
              </div>

              <div className="mt-16">
                <Link
                  href="/reality-check"
                  className="text-fluid-small inline-block border border-purple-500/30 px-10 py-5 tracking-[0.3em] uppercase transition-all duration-500 hover:bg-purple-500 hover:text-white"
                >
                  {t('reality.link')}
                </Link>
              </div>
            </div>
          </Container>
        </section>
        <SectionDivider />
      </main>
    </div>
  )
}
