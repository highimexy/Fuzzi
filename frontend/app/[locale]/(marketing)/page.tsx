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

        {/* 00. MISSION SECTION */}
        <section className="border-foreground/10 w-full overflow-hidden border-b">
          <Container className="py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-6 text-center">
              <span className="text-fluid-small font-sans font-bold tracking-[0.4em] text-white/40 uppercase">
                {t('mission.label')}
              </span>
              <h2 className="mt-6 font-serif leading-[0.85] tracking-tighter wrap-break-word uppercase">
                {t('mission.title1')} <br />{' '}
                <span className="text-zinc-100 italic opacity-60">{t('mission.title2')}</span>
              </h2>
              <p className="mx-auto mt-8 max-w-2xl font-sans text-sm leading-relaxed opacity-60">
                {t('mission.description')}
              </p>
            </div>
          </Container>
        </section>
        <SectionDivider />

        {/* 01. QA SECTION - EXPANDED */}
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

            <div className="border-foreground/10 mx-auto mt-16 max-w-5xl pt-12">
              <div className="grid gap-6 px-6 md:grid-cols-3">
                <div className="border-foreground/10 flex flex-col items-center border-t pt-6">
                  <h4 className="mb-3 font-sans text-[11px] font-bold tracking-widest text-green-500 uppercase">
                    {t('qa.preview.mindset.title')}
                  </h4>
                  <p className="text-sm leading-relaxed opacity-60">
                    {t('qa.preview.mindset.desc')}
                  </p>
                </div>
                <div className="border-foreground/10 flex flex-col items-center border-t pt-6">
                  <h4 className="mb-3 font-sans text-[11px] font-bold tracking-widest text-green-500 uppercase">
                    {t('qa.preview.anatomy.title')}
                  </h4>
                  <p className="text-sm leading-relaxed opacity-60">
                    {t('qa.preview.anatomy.desc')}
                  </p>
                </div>
                <div className="border-foreground/10 flex flex-col items-center border-t pt-6">
                  <h4 className="mb-3 font-sans text-[11px] font-bold tracking-widest text-green-500 uppercase">
                    {t('qa.preview.toolkit.title')}
                  </h4>
                  <p className="text-sm leading-relaxed opacity-60">
                    {t('qa.preview.toolkit.desc')}
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
        <SectionDivider />

        {/* 02. FRONTLINE ACADEMY */}
        <section className="border-foreground/10 relative w-full overflow-hidden border-b bg-yellow-500/2">
          <Container className="relative py-16 md:py-24">
            <div className="pointer-events-none absolute top-10 right-10 hidden font-serif text-[clamp(4rem,15vw,12rem)] leading-none tracking-tighter uppercase opacity-[0.03] select-none lg:block">
              Academy
            </div>

            <div className="flex flex-col gap-12 px-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-fit flex-1">
                <span className="text-fluid-small font-sans font-bold tracking-[0.3em] text-yellow-500 uppercase">
                  {t('academy.label')}
                </span>
                <h2 className="mt-4 font-serif leading-[0.85] tracking-tighter wrap-break-word uppercase">
                  {t('academy.title1')} <br />{' '}
                  <span className="italic opacity-30">{t('academy.title2')}</span>
                </h2>
                <p className="mt-8 max-w-lg font-sans text-sm leading-relaxed opacity-60">
                  {t('academy.description')}
                </p>
                <div className="mt-6 flex items-center gap-6 font-mono text-[10px] tracking-widest uppercase opacity-40">
                  <span>
                    <span className="text-yellow-500 opacity-100">03</span>{' '}
                    {t('academy.stats.modules')}
                  </span>
                  <span className="bg-foreground/10 h-3 w-px" />
                  <span>{t('academy.stats.approach')}</span>
                </div>
                <Link
                  href="/academy"
                  className="group text-fluid-small mt-8 inline-flex items-center gap-3 border-b border-yellow-500 pb-1 font-bold tracking-widest uppercase transition-all"
                >
                  <span>{t('academy.link')}</span>
                  <FiArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>

              <div className="w-full space-y-px lg:max-w-md xl:max-w-lg">
                <div className="border-foreground/20 bg-background flex items-start gap-4 border p-5 transition-colors hover:border-yellow-500/30">
                  <span className="font-serif text-2xl text-yellow-500 opacity-30">01</span>
                  <div>
                    <h4 className="font-sans text-[11px] font-bold tracking-widest uppercase">
                      {t('academy.steps.step1.title')}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed opacity-50">
                      {t('academy.steps.step1.desc')}
                    </p>
                  </div>
                </div>
                <div className="border-foreground/20 bg-background flex items-start gap-4 border p-5 transition-colors hover:border-yellow-500/30">
                  <span className="font-serif text-2xl text-yellow-500 opacity-30">02</span>
                  <div>
                    <h4 className="font-sans text-[11px] font-bold tracking-widest uppercase">
                      {t('academy.steps.step2.title')}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed opacity-50">
                      {t('academy.steps.step2.desc')}
                    </p>
                  </div>
                </div>
                <div className="border-foreground/20 bg-background flex items-start gap-4 border p-5 transition-colors hover:border-yellow-500/30">
                  <span className="font-serif text-2xl text-yellow-500 opacity-30">03</span>
                  <div>
                    <h4 className="font-sans text-[11px] font-bold tracking-widest uppercase">
                      {t('academy.steps.step3.title')}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed opacity-50">
                      {t('academy.steps.step3.desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
        <SectionDivider />

        {/* 03. REALITY CHECK - EXPANDED */}
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

              <p className="mx-auto mt-8 max-w-2xl font-sans text-sm leading-relaxed opacity-60">
                {t('reality.description')}
              </p>

              <div className="border-foreground/10 mt-12 grid gap-8 border-t pt-12 text-left md:grid-cols-2 lg:gap-16">
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

              <div className="mx-auto mt-16 w-full max-w-3xl">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="border-foreground/10 border-t pt-6">
                    <h4 className="mb-2 font-sans text-[11px] font-bold tracking-widest text-purple-500 uppercase">
                      {t('reality.preview.hype.title')}
                    </h4>
                    <p className="text-sm leading-relaxed opacity-60">
                      {t('reality.preview.hype.desc')}
                    </p>
                  </div>
                  <div className="border-foreground/10 border-t pt-6">
                    <h4 className="mb-2 font-sans text-[11px] font-bold tracking-widest text-purple-500 uppercase">
                      {t('reality.preview.ai.title')}
                    </h4>
                    <p className="text-sm leading-relaxed opacity-60">
                      {t('reality.preview.ai.desc')}
                    </p>
                  </div>
                  <div className="border-foreground/10 border-t pt-6">
                    <h4 className="mb-2 font-sans text-[11px] font-bold tracking-widest text-purple-500 uppercase">
                      {t('reality.preview.market.title')}
                    </h4>
                    <p className="text-sm leading-relaxed opacity-60">
                      {t('reality.preview.market.desc')}
                    </p>
                  </div>
                  <div className="border-foreground/10 border-t pt-6">
                    <h4 className="mb-2 font-sans text-[11px] font-bold tracking-widest text-purple-500 uppercase">
                      {t('reality.preview.human.title')}
                    </h4>
                    <p className="text-sm leading-relaxed opacity-60">
                      {t('reality.preview.human.desc')}
                    </p>
                  </div>
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

        {/* 04. FINAL CTA */}
        <section className="border-foreground/10 relative w-full overflow-hidden border-b">
          <Container className="relative py-24 md:py-32">
            <div className="pointer-events-none absolute top-10 left-10 hidden font-serif text-[clamp(3rem,10vw,8rem)] leading-none tracking-tighter uppercase opacity-[0.02] select-none lg:block">
              Start
            </div>

            <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
              <span className="text-fluid-small font-sans font-bold tracking-[0.4em] text-white/40 uppercase">
                {t('cta.label')}
              </span>

              <h2 className="mt-6 font-serif leading-[0.85] tracking-tighter wrap-break-word uppercase">
                {t('cta.title1')} <br />{' '}
                <span className="text-zic-500 italic opacity-60">{t('cta.title2')}</span>
              </h2>

              <p className="mx-auto mt-8 max-w-2xl font-sans text-sm leading-relaxed opacity-60">
                {t('cta.description')}
              </p>

              <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
                <Link
                  href="/qa"
                  className="text-fluid-small inline-block border border-green-500/30 px-10 py-5 tracking-[0.2em] uppercase transition-all duration-500 hover:bg-green-500 hover:text-white"
                >
                  {t('cta.qaBtn')}
                </Link>
                <Link
                  href="/reality-check"
                  className="text-fluid-small inline-block border border-purple-500/30 px-10 py-5 tracking-[0.2em] uppercase transition-all duration-500 hover:bg-purple-500 hover:text-white"
                >
                  {t('cta.realityBtn')}
                </Link>
                <Link
                  href="/academy"
                  className="text-fluid-small inline-block border border-yellow-500/30 px-10 py-5 tracking-[0.2em] uppercase transition-all duration-500 hover:bg-yellow-500 hover:text-black"
                >
                  {t('cta.academyBtn')}
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
