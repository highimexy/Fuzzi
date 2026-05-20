'use client'

import { FiArrowRight } from 'react-icons/fi'
import { BackgroundGrid } from '../_components/BackgroundGrid'
import { SectionDivider } from '../_components/SectionDivider'
import { SubpageHeader } from '../_components/SubpageHeader'
import { Container } from '../../wrappers/Container'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function RealityCheckPage() {
  const t = useTranslations('Reality')
  const accentColor = 'text-secondary'

  return (
    <main className="min-h-screen">
      <SubpageHeader
        title={t('header.title')}
        subtitle={t('header.subtitle')}
        accentColor="text-secondary"
      />
      <SectionDivider />

      {/* SECTION 01: THE HYPE CYCLE */}
      <section className="border-foreground/10 overflow-hidden border-b">
        <Container>
          <div className="flex flex-col gap-12 px-6 py-20 lg:flex-row lg:items-start lg:justify-between">
            <div className="lg:w-1/3">
              <span
                className={`text-fluid-small font-sans font-bold tracking-[0.4em] uppercase ${accentColor}`}
              >
                {t('hype.label')}
              </span>
              <h2 className="text-fluid-h2 mt-4 font-serif leading-[0.85] tracking-tighter wrap-break-word uppercase">
                {t('hype.title1')} <br />
                <span className={`italic opacity-30 ${accentColor}`}>{t('hype.title2')}</span>
              </h2>
              <p className="text-fluid-p mt-8 font-sans leading-relaxed italic opacity-60">
                {t('hype.tagline')}
              </p>
            </div>
            <div className="w-full flex-1 lg:max-w-2xl xl:max-w-3xl">
              <div className="space-y-8">
                <p className="text-fluid-h4 font-serif leading-snug italic opacity-80">
                  {t('hype.quote')}
                </p>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="border-foreground/10 border-t pt-6">
                    <h3
                      className={`mb-3 font-sans text-[11px] font-bold tracking-widest uppercase ${accentColor}`}
                    >
                      {t('hype.dream.title')}
                    </h3>
                    <p className="text-sm leading-relaxed opacity-60">{t('hype.dream.desc')}</p>
                  </div>
                  <div className="border-foreground/10 border-t pt-6">
                    <h3
                      className={`mb-3 font-sans text-[11px] font-bold tracking-widest uppercase ${accentColor}`}
                    >
                      {t('hype.reality.title')}
                    </h3>
                    <p className="text-sm leading-relaxed opacity-60">{t('hype.reality.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SectionDivider />

      {/* SECTION 02: THE AI IMPACT */}
      <section className="border-foreground/10 overflow-hidden border-b">
        <Container>
          <div className="flex flex-col gap-12 px-6 py-20 lg:flex-row lg:items-start lg:justify-between">
            <div className="lg:w-1/3">
              <span
                className={`text-fluid-small font-sans font-bold tracking-[0.4em] uppercase ${accentColor}`}
              >
                {t('ai.label')}
              </span>
              <h2 className="text-fluid-h2 mt-4 font-serif leading-[0.85] tracking-tighter wrap-break-word uppercase">
                {t('ai.title1')} <br />
                <span className={`italic opacity-30 ${accentColor}`}>{t('ai.title2')}</span>
              </h2>
              <p className="text-fluid-p mt-8 font-sans leading-relaxed italic opacity-60">
                {t('ai.tagline')}
              </p>
            </div>
            <div className="w-full flex-1 lg:max-w-2xl xl:max-w-3xl">
              <div className="grid gap-12">
                <article className="group">
                  <div className="border-foreground/10 flex items-baseline gap-4 border-b pb-4">
                    <span className="font-serif text-2xl opacity-20 transition-opacity group-hover:opacity-100">
                      01
                    </span>
                    <h3 className="font-sans font-bold tracking-widest uppercase">
                      {t('ai.ghosting.title')}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed opacity-60">{t('ai.ghosting.desc')}</p>
                </article>

                <article className="group">
                  <div className="border-foreground/10 flex items-baseline gap-4 border-b pb-4">
                    <span className="font-serif text-2xl opacity-20 transition-opacity group-hover:opacity-100">
                      02
                    </span>
                    <h3 className={`font-sans font-bold tracking-widest uppercase`}>
                      {t('ai.trap.title')}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed opacity-60">{t('ai.trap.desc')}</p>
                </article>

                <article className="group">
                  <div className="border-foreground/10 flex items-baseline gap-4 border-b pb-4">
                    <span className="font-serif text-2xl opacity-20 transition-opacity group-hover:opacity-100">
                      03
                    </span>
                    <h3 className="font-sans font-bold tracking-widest uppercase">
                      {t('ai.vision.title')}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed italic opacity-60">
                    {t('ai.vision.desc')}
                  </p>
                </article>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SectionDivider />

      {/* SECTION 03: ECOSYSTEM COMPARISON */}
      <section className="border-foreground/10 overflow-hidden border-b">
        <Container>
          <div className="flex flex-col gap-12 px-6 py-20 lg:flex-row lg:items-start lg:justify-between">
            <div className="lg:w-1/3">
              <span
                className={`text-fluid-small font-sans font-bold tracking-[0.4em] uppercase ${accentColor}`}
              >
                {t('market.label')}
              </span>
              <h2 className="text-fluid-h2 mt-4 font-serif leading-[0.85] tracking-tighter wrap-break-word uppercase">
                {t('market.title1')} <br />
                <span className={`italic opacity-30 ${accentColor}`}>{t('market.title2')}</span>
              </h2>
              <p className="text-fluid-p mt-8 font-sans leading-relaxed italic opacity-60">
                {t('market.tagline')}
              </p>
            </div>
            <div className="w-full flex-1 lg:max-w-2xl xl:max-w-3xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-[11px] tracking-widest uppercase">
                  <thead>
                    <tr className="border-foreground/20 border-b text-[10px] opacity-40">
                      <th className="pb-4 font-bold">{t('market.table.head1')}</th>
                      <th className="pb-4 font-bold">{t('market.table.head2')}</th>
                      <th className="pb-4 font-bold">{t('market.table.head3')}</th>
                    </tr>
                  </thead>
                  <tbody className="opacity-80">
                    <tr className="border-foreground/10 hover:bg-foreground/2 border-b">
                      <td className="py-6">{t('market.table.cat1')}</td>
                      <td className="py-6 font-bold italic">{t('market.table.row1a')}</td>
                      <td className="py-6">{t('market.table.row1b')}</td>
                    </tr>
                    <tr className="border-foreground/10 hover:bg-foreground/2 border-b">
                      <td className="py-6">{t('market.table.cat2')}</td>
                      <td className="py-6 font-bold italic">{t('market.table.row2a')}</td>
                      <td className="py-6">{t('market.table.row2b')}</td>
                    </tr>
                    <tr className="border-foreground/10 hover:bg-foreground/2 border-b">
                      <td className="py-6">{t('market.table.cat3')}</td>
                      <td className="py-6 font-bold italic">{t('market.table.row3a')}</td>
                      <td className="py-6">{t('market.table.row3b')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SectionDivider />

      {/* SECTION 04: THE SURVIVAL GUIDE */}
      <section className="border-foreground/10 overflow-hidden border-b">
        <Container>
          <div className="flex flex-col gap-12 px-6 py-20 lg:flex-row lg:items-start lg:justify-between">
            <div className="lg:w-1/3">
              <span
                className={`text-fluid-small font-sans font-bold tracking-[0.4em] uppercase ${accentColor}`}
              >
                {t('human.label')}
              </span>
              <h2 className="text-fluid-h2 mt-4 font-serif leading-[0.85] tracking-tighter wrap-break-word uppercase">
                {t('human.title1')} <br />
                <span className={`italic opacity-30 ${accentColor}`}>{t('human.title2')}</span>
              </h2>
              <p className="text-fluid-p mt-8 font-sans leading-relaxed italic opacity-60">
                {t('human.tagline')}
              </p>
            </div>
            <div className="w-full flex-1 lg:max-w-2xl xl:max-w-3xl">
              <div className="flex flex-col gap-12">
                <div className="border-secondary/20 border-l-2 pl-8 opacity-60">
                  <h3 className={`font-sans font-bold tracking-widest uppercase`}>
                    {t('human.comm.title')}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed opacity-60">{t('human.comm.desc')}</p>
                </div>
                <div className="border-secondary/20 border-l-2 pl-8 opacity-60">
                  <h3 className="font-sans font-bold tracking-widest uppercase">
                    {t('human.learn.title')}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed opacity-60">{t('human.learn.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SectionDivider />

      {/* THE ACADEMY / ROADMAP - REALITY CHECK SURVIVAL */}
      <section className="bg-secondary/2 relative overflow-hidden">
        <BackgroundGrid color="rgb(168 85 247 / 0.1)" />
        <Container className="relative z-10">
          <div className="px-3 py-24 text-left md:px-6">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <span className="text-fluid-small text-secondary font-sans font-bold tracking-[0.4em] uppercase">
                  {t('academy.label')}
                </span>
                <h2 className="text-fluid-h2 mt-4 font-serif leading-none tracking-tighter uppercase">
                  {t('academy.title1')} <br />
                  <span className="text-fluid-h1 text-secondary italic opacity-30">
                    {t('academy.title2')}
                  </span>
                </h2>
                <p className="text-fluid-p mt-8 font-sans leading-relaxed italic opacity-60">
                  {t('academy.tagline')}
                </p>
              </div>
              <div className="border-secondary/20 hidden border-l pl-6 lg:block">
                <span className="block font-sans text-[10px] uppercase opacity-40">
                  {t('academy.curriculum')}
                </span>
                <span className="text-secondary mt-1 block font-sans text-[10px] font-bold uppercase">
                  {t('academy.modules')}
                </span>
              </div>
            </div>

            <div className="bg-foreground/10 border-foreground/10 mt-16 grid gap-px border md:mt-20">
              {/* STEP 01 */}
              <Link
                href="/academy"
                className="group bg-background border-foreground/20 relative border p-5 transition-all duration-300 ease-out hover:z-20 hover:-translate-y-1 hover:rounded-md hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] md:p-10 md:hover:translate-x-2 md:hover:-translate-y-2 md:hover:shadow-[-20px_25px_50px_-15px_rgba(0,0,0,0.12)]"
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div className="flex items-start gap-4 md:items-center md:gap-8">
                    <span className="group-hover:text-secondary shrink-0 font-serif text-xl opacity-10 transition-all group-hover:opacity-100 md:text-4xl">
                      01
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="group-hover:text-secondary font-sans text-[13px] leading-tight font-bold tracking-widest text-white uppercase transition-colors md:text-base">
                        {t('academy.step1.title')}
                      </h3>
                      <p className="max-w-60 text-[11px] leading-relaxed italic opacity-50 md:max-w-sm md:text-sm">
                        {t('academy.step1.desc')}
                      </p>
                    </div>
                  </div>
                  <span className="border-foreground/10 group-hover:border-secondary group-hover:bg-secondary flex w-fit items-center gap-2 self-start border px-3 py-2 text-[8px] font-bold tracking-[0.2em] whitespace-nowrap uppercase transition-all group-hover:text-black md:self-auto md:text-[10px]">
                    {t('academy.step1.btn')}{' '}
                    <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>

              {/* STEP 02 */}
              <Link
                href="/academy"
                className="group bg-background border-foreground/20 relative border p-5 transition-all duration-300 ease-out hover:z-20 hover:-translate-y-1 hover:rounded-md hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] md:p-10 md:hover:translate-x-2 md:hover:-translate-y-2 md:hover:shadow-[-20px_25px_50px_-15px_rgba(0,0,0,0.12)]"
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div className="flex items-start gap-4 md:items-center md:gap-8">
                    <span className="group-hover:text-secondary shrink-0 font-serif text-xl opacity-10 transition-all group-hover:opacity-100 md:text-4xl">
                      02
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="group-hover:text-secondary font-sans text-[13px] leading-tight font-bold tracking-widest text-white uppercase transition-colors md:text-base">
                        {t('academy.step2.title')}
                      </h3>
                      <p className="max-w-60 text-[11px] leading-relaxed italic opacity-50 md:max-w-sm md:text-sm">
                        {t('academy.step2.desc')}
                      </p>
                    </div>
                  </div>
                  <span className="border-foreground/10 group-hover:border-secondary group-hover:bg-secondary flex w-fit items-center gap-2 self-start border px-3 py-2 text-[8px] font-bold tracking-[0.2em] whitespace-nowrap uppercase transition-all group-hover:text-black md:self-auto md:text-[10px]">
                    {t('academy.step2.btn')}{' '}
                    <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>

              {/* STEP 03 */}
              <Link
                href="/academy"
                className="group bg-background border-foreground/20 relative border p-5 transition-all duration-300 ease-out hover:z-20 hover:-translate-y-1 hover:rounded-md hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] md:p-10 md:hover:translate-x-2 md:hover:-translate-y-2 md:hover:shadow-[-20px_25px_50px_-15px_rgba(0,0,0,0.12)]"
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div className="flex items-start gap-4 md:items-center md:gap-8">
                    <span className="group-hover:text-secondary shrink-0 font-serif text-xl opacity-10 transition-all group-hover:opacity-100 md:text-4xl">
                      03
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="group-hover:text-secondary font-sans text-[13px] leading-tight font-bold tracking-widest text-white uppercase transition-colors md:text-base">
                        {t('academy.step3.title')}
                      </h3>
                      <p className="max-w-60 text-[11px] leading-relaxed italic opacity-50 md:max-w-sm md:text-sm">
                        {t('academy.step3.desc')}
                      </p>
                    </div>
                  </div>
                  <span className="border-foreground/10 group-hover:border-secondary group-hover:bg-secondary flex w-fit items-center gap-2 self-start border px-3 py-2 text-[8px] font-bold tracking-[0.2em] whitespace-nowrap uppercase transition-all group-hover:text-black md:self-auto md:text-[10px]">
                    {t('academy.step3.btn')}{' '}
                    <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <SectionDivider />

      {/* FINAL CALL TO ACTION */}
      <section className="border-foreground/10 border-b text-center">
        <Container>
          <div className="relative flex flex-col items-center px-6 py-24">
            <div className="pointer-events-none absolute top-10 right-10 hidden font-serif text-[clamp(4rem,15vw,12rem)] leading-none tracking-tighter uppercase opacity-[0.03] select-none lg:block">
              {t('footer.watermark')}
            </div>
            <span className="text-fluid-small font-sans tracking-[0.4em] uppercase opacity-40">
              {t('footer.label')}
            </span>
            <h2 className="text-fluid-h2 mt-6 max-w-2xl font-serif leading-[0.85] tracking-tighter wrap-break-word uppercase">
              {t.rich('footer.title', {
                secondary: (chunks) => <span className={`italic ${accentColor}`}>{chunks}</span>,
                u: (chunks) => (
                  <span className="decoration-secondary/30 hover:decoration-secondary underline underline-offset-8 transition-colors">
                    {chunks}
                  </span>
                ),
                break: () => <br />,
              })}
            </h2>
            <div className="mt-16 flex flex-col gap-6 sm:flex-row">
              <Link
                href="/"
                className="border-foreground/10 text-fluid-small hover:bg-foreground hover:text-background border px-10 py-5 font-sans tracking-[0.3em] uppercase transition-all duration-500"
              >
                {t('footer.btn1')}
              </Link>
              <Link
                href="/lessons"
                className="text-fluid-small bg-accent text-background px-10 py-5 font-sans tracking-[0.3em] uppercase transition-opacity duration-300 hover:opacity-80"
              >
                {t('footer.btn2')}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <SectionDivider />
    </main>
  )
}
