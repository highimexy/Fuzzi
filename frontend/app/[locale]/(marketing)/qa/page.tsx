'use client'

import { BackgroundGrid } from '../_components/BackgroundGrid'
import { SectionDivider } from '../_components/SectionDivider'
import { SubpageHeader } from '../_components/SubpageHeader'
import { Container } from '../../wrappers/Container'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { useTranslations } from 'next-intl'

export default function QaPage() {
  const t = useTranslations('QA')
  const accentColor = 'text-primary'

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <main className="flex-1 pb-1">
        <SubpageHeader
          title={t('header.title')}
          subtitle={t('header.subtitle')}
          accentColor="text-primary"
        />
        <SectionDivider />

        {/* SECTION 01: THE MINDSET */}
        <section className="border-foreground/10 overflow-hidden border-b">
          <Container>
            <div className="flex flex-col gap-12 px-6 py-20 lg:flex-row lg:items-start lg:justify-between">
              <div className="lg:w-1/3">
                <span
                  className={`text-fluid-small font-sans font-bold tracking-[0.4em] uppercase ${accentColor}`}
                >
                  {t('mindset.label')}
                </span>
                <h2 className="text-fluid-h2 mt-4 font-serif leading-[0.85] tracking-tighter wrap-break-word uppercase">
                  {t('mindset.title1')} <br />
                  <span className={`italic opacity-30 ${accentColor}`}>{t('mindset.title2')}</span>
                </h2>
                <p className="text-fluid-p mt-8 font-sans leading-relaxed italic opacity-60">
                  {t('mindset.tagline')}
                </p>
              </div>
              <div className="w-full flex-1 lg:max-w-2xl xl:max-w-3xl">
                <div className="space-y-8">
                  <p className="text-fluid-h4 font-serif leading-snug italic opacity-80">
                    {t('mindset.quote')}
                  </p>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="border-foreground/10 border-t pt-6">
                      <h3
                        className={`mb-3 font-sans text-[11px] font-bold tracking-widest uppercase ${accentColor}`}
                      >
                        {t('mindset.edgeCases.title')}
                      </h3>
                      <p className="text-sm leading-relaxed opacity-60">
                        {t('mindset.edgeCases.desc')}
                      </p>
                    </div>
                    <div className="border-foreground/10 border-t pt-6">
                      <h3
                        className={`mb-3 font-sans text-[11px] font-bold tracking-widest uppercase ${accentColor}`}
                      >
                        {t('mindset.criticalThinking.title')}
                      </h3>
                      <p className="text-sm leading-relaxed opacity-60">
                        {t('mindset.criticalThinking.desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <SectionDivider />

        {/* SECTION 02: UI ANATOMY */}
        <section className="border-foreground/10 overflow-hidden border-b">
          <Container>
            <div className="flex flex-col gap-12 px-6 py-20 lg:flex-row lg:items-start lg:justify-between">
              <div className="lg:w-1/3">
                <span
                  className={`text-fluid-small font-sans font-bold tracking-[0.4em] uppercase ${accentColor}`}
                >
                  {t('anatomy.label')}
                </span>
                <h2 className="text-fluid-h2 mt-4 font-serif leading-[0.85] tracking-tighter wrap-break-word uppercase">
                  {t('anatomy.title1')} <br />
                  <span className={`italic opacity-30 ${accentColor}`}>{t('anatomy.title2')}</span>
                </h2>
                <p className="text-fluid-p mt-8 font-sans leading-relaxed italic opacity-60">
                  {t('anatomy.tagline')}
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
                        {t('anatomy.item1.title')}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed opacity-60">
                      {t('anatomy.item1.desc')}
                    </p>
                  </article>
                  <article className="group">
                    <div className="border-foreground/10 flex items-baseline gap-4 border-b pb-4">
                      <span className="font-serif text-2xl opacity-20 transition-opacity group-hover:opacity-100">
                        02
                      </span>
                      <h3 className="font-sans font-bold tracking-widest uppercase">
                        {t('anatomy.item2.title')}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed opacity-60">
                      {t('anatomy.item2.desc')}
                    </p>
                  </article>
                  <article className="group">
                    <div className="border-foreground/10 flex items-baseline gap-4 border-b pb-4">
                      <span className="font-serif text-2xl opacity-20 transition-opacity group-hover:opacity-100">
                        03
                      </span>
                      <h3 className="font-sans font-bold tracking-widest uppercase">
                        {t('anatomy.item3.title')}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed opacity-60">
                      {t('anatomy.item3.desc')}
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <SectionDivider />

        {/* SECTION 03: THE TOOLKIT */}
        <section className="border-foreground/10 overflow-hidden border-b">
          <Container>
            <div className="flex flex-col gap-12 px-6 py-20 lg:flex-row lg:items-start lg:justify-between">
              <div className="lg:w-1/3">
                <span
                  className={`text-fluid-small font-sans font-bold tracking-[0.4em] uppercase ${accentColor}`}
                >
                  {t('toolkit.label')}
                </span>
                <h2 className="text-fluid-h2 mt-4 font-serif leading-[0.85] tracking-tighter wrap-break-word uppercase">
                  {t('toolkit.title1')} <br />
                  <span className={`italic opacity-30 ${accentColor}`}>{t('toolkit.title2')}</span>
                </h2>
                <p className="text-fluid-p mt-8 font-sans leading-relaxed italic opacity-60">
                  {t('toolkit.tagline')}
                </p>
              </div>
              <div className="w-full flex-1 lg:max-w-2xl xl:max-w-3xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-[11px] tracking-widest uppercase">
                    <thead>
                      <tr className="border-foreground/20 border-b text-[10px] opacity-40">
                        <th className="pb-4 font-bold">{t('toolkit.table.head1')}</th>
                        <th className="pb-4 font-bold">{t('toolkit.table.head2')}</th>
                        <th className="pb-4 font-bold">{t('toolkit.table.head3')}</th>
                      </tr>
                    </thead>
                    <tbody className="opacity-80">
                      <tr className="border-foreground/10 hover:bg-foreground/2 border-b">
                        <td className="py-6">{t('toolkit.table.doc')}</td>
                        <td className="decoration-primary/30 py-6 font-bold italic underline">
                          Figma
                        </td>
                        <td className="py-6">{t('toolkit.table.row1')}</td>
                      </tr>
                      <tr className="border-foreground/10 hover:bg-foreground/2 border-b">
                        <td className="py-6">{t('toolkit.table.track')}</td>
                        <td className="decoration-primary/30 py-6 font-bold italic underline">
                          Jira
                        </td>
                        <td className="py-6">{t('toolkit.table.row2')}</td>
                      </tr>
                      <tr className="border-foreground/10 hover:bg-foreground/2 border-b">
                        <td className="py-6">{t('toolkit.table.debug')}</td>
                        <td className="decoration-primary/30 py-6 font-bold italic underline">
                          DevTools
                        </td>
                        <td className="py-6">{t('toolkit.table.row3')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <SectionDivider />

        {/* SECTION 04: ECOSYSTEM */}
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
                  <div className="border-primary/20 border-l-2 pl-8 opacity-60">
                    <h3 className="font-sans font-bold tracking-widest uppercase">
                      {t('human.designers.title')}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed opacity-60">
                      {t('human.designers.desc')}
                    </p>
                  </div>
                  <div className="border-primary/20 border-l-2 pl-8 opacity-60">
                    <h3 className="font-sans font-bold tracking-widest uppercase">
                      {t('human.developers.title')}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed opacity-60">
                      {t('human.developers.desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <SectionDivider />

        {/* THE ACADEMY / ROADMAP */}
        <section className="bg-primary/2 relative overflow-hidden">
          <BackgroundGrid color="rgb(34 197 94 / 0.1)" />
          <Container className="relative z-10">
            <div className="px-3 py-24 md:px-6">
              <div className="flex flex-col gap-8 text-left lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <span className="text-fluid-small text-primary font-sans font-bold tracking-[0.4em] uppercase">
                    {t('academy.label')}
                  </span>
                  <h2 className="text-fluid-h2 mt-4 font-serif leading-none tracking-tighter uppercase">
                    {t('academy.title1')} <br />
                    <span className="text-fluid-h1 text-primary italic opacity-30">
                      {t('academy.title2')}
                    </span>
                  </h2>
                  <p className="text-fluid-p mt-8 font-sans leading-relaxed italic opacity-60">
                    {t('academy.tagline')}
                  </p>
                </div>
                <div className="border-primary/20 hidden border-l pl-6 lg:block">
                  <span className="block font-sans text-[10px] uppercase opacity-40">
                    {t('academy.curriculum')}
                  </span>
                  <span className="text-primary mt-1 block font-sans text-[10px] font-bold uppercase">
                    {t('academy.modules')}
                  </span>
                </div>
              </div>

              <div className="bg-foreground/10 border-foreground/10 mt-16 grid gap-px border text-left md:mt-20">
                {/* STEP 01 */}
                <Link
                  href="/academy"
                  className="group bg-background border-foreground/20 relative border p-5 transition-all duration-300 ease-out hover:z-20 hover:-translate-y-1 hover:rounded-md hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] md:p-10 md:hover:translate-x-2 md:hover:-translate-y-2 md:hover:shadow-[-20px_25px_50px_-15px_rgba(0,0,0,0.12)]"
                >
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div className="flex items-start gap-4 md:gap-8">
                      <span className="group-hover:text-primary shrink-0 font-serif text-xl opacity-10 transition-all group-hover:opacity-100 md:text-4xl">
                        01
                      </span>
                      <div className="flex flex-col gap-1">
                        <h3 className="group-hover:text-primary font-sans text-[13px] leading-tight font-bold tracking-widest text-white uppercase transition-colors md:text-base">
                          {t('academy.step1.title')}
                        </h3>
                        <p className="max-w-60 text-[11px] leading-relaxed italic opacity-50 md:max-w-sm md:text-sm">
                          {t('academy.step1.desc')}
                        </p>
                      </div>
                    </div>
                    <span className="border-foreground/10 group-hover:border-primary group-hover:bg-primary flex w-fit items-center gap-2 self-start border px-3 py-2 text-[8px] font-bold tracking-[0.2em] whitespace-nowrap uppercase transition-all group-hover:text-black md:self-auto md:text-[10px]">
                      {t('academy.step1.btn')} <FiArrowRight className="text-sm" />
                    </span>
                  </div>
                </Link>
                {/* STEP 02 */}
                <Link
                  href="/academy"
                  className="group bg-background border-foreground/20 relative border p-5 transition-all duration-300 ease-out hover:z-20 hover:-translate-y-1 hover:rounded-md hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] md:p-10 md:hover:translate-x-2 md:hover:-translate-y-2 md:hover:shadow-[-20px_25px_50px_-15px_rgba(0,0,0,0.12)]"
                >
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div className="flex items-start gap-4 md:gap-8">
                      <span className="group-hover:text-primary shrink-0 font-serif text-xl opacity-10 transition-all group-hover:opacity-100 md:text-4xl">
                        02
                      </span>
                      <div className="flex flex-col gap-1">
                        <h3 className="group-hover:text-primary font-sans text-[13px] leading-tight font-bold tracking-widest text-white uppercase transition-colors md:text-base">
                          {t('academy.step2.title')}
                        </h3>
                        <p className="max-w-60 text-[11px] leading-relaxed italic opacity-50 md:max-w-sm md:text-sm">
                          {t('academy.step2.desc')}
                        </p>
                      </div>
                    </div>
                    <span className="border-foreground/10 group-hover:border-primary group-hover:bg-primary flex w-fit items-center gap-2 self-start border px-3 py-2 text-[8px] font-bold tracking-[0.2em] whitespace-nowrap uppercase transition-all group-hover:text-black md:self-auto md:text-[10px]">
                      {t('academy.step2.btn')} <FiArrowRight className="text-sm" />
                    </span>
                  </div>
                </Link>
                {/* STEP 03 */}
                <Link
                  href="/academy"
                  className="group bg-background border-foreground/20 relative border p-5 transition-all duration-300 ease-out hover:z-20 hover:-translate-y-1 hover:rounded-md hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] md:p-10 md:hover:translate-x-2 md:hover:-translate-y-2 md:hover:shadow-[-20px_25px_50px_-15px_rgba(0,0,0,0.12)]"
                >
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div className="flex items-start gap-4 md:gap-8">
                      <span className="group-hover:text-primary shrink-0 font-serif text-xl opacity-10 transition-all group-hover:opacity-100 md:text-4xl">
                        03
                      </span>
                      <div className="flex flex-col gap-1">
                        <h3 className="group-hover:text-primary font-sans text-[13px] leading-tight font-bold tracking-widest text-white uppercase transition-colors md:text-base">
                          {t('academy.step3.title')}
                        </h3>
                        <p className="max-w-60 text-[11px] leading-relaxed italic opacity-50 md:max-w-sm md:text-sm">
                          {t('academy.step3.desc')}
                        </p>
                      </div>
                    </div>
                    <span className="border-foreground/10 group-hover:border-primary group-hover:bg-primary flex w-fit items-center gap-2 self-start border px-3 py-2 text-[8px] font-bold tracking-[0.2em] whitespace-nowrap uppercase transition-all group-hover:text-black md:self-auto md:text-[10px]">
                      {t('academy.step3.btn')} <FiArrowRight className="text-sm" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <SectionDivider />

        {/* FINAL ROADMAP LINK */}
        <section className="border-foreground/10 relative border-b text-center">
          <Container>
            <div className="relative flex flex-col items-center px-6 py-24">
              <div className="pointer-events-none absolute top-10 right-10 hidden font-serif text-[clamp(4rem,15vw,12rem)] leading-none tracking-tighter uppercase opacity-[0.03] select-none lg:block">
                {t('footer.watermark')}
              </div>
              <span className="text-fluid-small font-sans tracking-[0.4em] uppercase opacity-40">
                {t('footer.label')}
              </span>
              <h2 className="text-fluid-h2 mt-6 font-serif tracking-tighter uppercase">
                {t.rich('footer.title', {
                  primary: (chunks) => <span className="text-primary italic">{chunks}</span>,
                })}
              </h2>
              <Link
                href="/reality-check"
                className="text-fluid-small border-primary/30 hover:bg-primary mt-12 border px-10 py-5 font-sans tracking-[0.3em] uppercase transition-all duration-500 hover:text-white"
              >
                {t('footer.btn')}
              </Link>
            </div>
          </Container>
        </section>
        <SectionDivider />
      </main>
    </div>
  )
}
