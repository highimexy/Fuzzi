'use client'

import { useState } from 'react'
import { FiPlus, FiMinus, FiAward, FiSmartphone, FiBookOpen, FiFilter, FiCode, FiZap } from 'react-icons/fi'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'
import { useTranslations } from 'next-intl'

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-foreground/10 border-b py-5">
      <h3 className="m-0 p-0 font-sans text-sm md:text-base">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex w-full items-start justify-between text-left transition-colors hover:text-accent sm:items-center"
        >
          <span className="pr-8">{q}</span>
          {isOpen ? (
            <FiMinus className="text-foreground/50 mt-1 shrink-0 sm:mt-0" />
          ) : (
            <FiPlus className="text-foreground/50 mt-1 shrink-0 sm:mt-0" />
          )}
        </button>
      </h3>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="text-foreground/60 overflow-hidden font-sans text-sm leading-relaxed">
          {a}
        </div>
      </div>
    </div>
  )
}

export default function PremiumPage() {
  const t = useTranslations('Premium')

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ]

  return (
    <div className="flex w-full flex-1 flex-col items-stretch justify-center font-sans lg:flex-row">
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-start px-4 py-16 sm:px-8 xl:max-w-5xl">
        {/* HERO */}
        <div className="mb-16 flex flex-col items-center justify-center text-center">
          <h1 className="text-fluid-h1 mb-4 font-serif leading-[0.9] font-bold tracking-tight">
            {t('header.title')}
          </h1>
          <p className="text-foreground/80 font-sans text-sm md:text-base">
            {t.rich('header.subtitle', {
              accent: (chunks) => (
                <span className="font-serif font-bold text-accent">{chunks}</span>
              ),
            })}
          </p>
        </div>

        {/* PRICING CARDS */}
        <div className="mb-24 flex w-full flex-col gap-6 md:flex-row md:gap-8">
          {/* MONTHLY CARD */}
          <div className="bg-background border-foreground/10 relative flex flex-1 flex-col justify-between overflow-hidden border p-8 shadow-sm">
            <div>
              <div className="mb-6 flex items-baseline gap-3">
                <h2 className="font-serif text-2xl leading-none font-bold">
                  {t('monthly.period')}
                </h2>
                <span className="text-foreground/60 font-sans text-sm">
                  {t('monthly.billedLabel')}
                </span>
              </div>
              <p className="text-foreground/60 font-sans text-sm leading-relaxed">
                {t.rich('monthly.description', {
                  strong: (chunks) => <strong className="text-foreground">{chunks}</strong>,
                })}
              </p>
            </div>

            <div className="mt-8">
              <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-foreground/40 font-sans text-2xl font-bold line-through">
                  {t('monthly.strikethrough')}
                </span>
                <span className="font-sans text-4xl font-bold">{t('monthly.price')}</span>
                <span className="text-foreground/60 font-sans text-sm">
                  {t('monthly.unit')}
                </span>
              </div>
              <p className="text-foreground/40 mb-6 font-sans text-[10px] tracking-widest uppercase">
                {t('pricesNote')}
              </p>
              <button className="bg-foreground text-background hover:bg-foreground/90 w-full py-3 font-sans font-bold transition-transform hover:scale-[1.02]">
                {t('monthly.cta')}
              </button>
            </div>
          </div>

          {/* YEARLY CARD (POPULAR) */}
          <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-linear-to-br from-[#F0B100] to-[#5a450c] p-8 text-zinc-900 shadow-[0_0_40px_rgba(0,0,0,0.08)]">
            <div>
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <h2 className="font-serif text-2xl leading-none font-bold">
                    {t('yearly.period')}
                  </h2>
                  <span className="font-sans text-sm text-zinc-900/70">
                    {t('yearly.billedLabel')}
                  </span>
                </div>
                <span className="flex items-center gap-1 bg-white p-2 font-sans text-[10px] font-bold tracking-widest uppercase">
                  {t('yearly.badge')}
                </span>
              </div>
              <p className="font-sans text-sm leading-relaxed text-zinc-900/80">
                {t.rich('yearly.description', {
                  strong: (chunks) => <strong className="text-zinc-900">{chunks}</strong>,
                })}
              </p>
            </div>

            <div className="mt-8">
              <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-sans text-4xl font-bold">{t('yearly.price')}</span>
                <span className="font-sans text-sm text-zinc-900/70">
                  {t('yearly.unit')}
                </span>
              </div>
              <p className="mb-6 font-sans text-[10px] tracking-widest text-zinc-900/50 uppercase">
                {t('pricesNote')}
              </p>
              <button className="w-full bg-zinc-900 py-3 font-sans font-bold text-white transition-transform hover:scale-[1.02] hover:bg-zinc-800">
                {t('yearly.cta')}
              </button>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mb-24 w-full">
          <p className="text-foreground/50 mb-10 text-center font-sans text-[10px] font-bold tracking-[0.3em] uppercase">
            {t('features.title')}
          </p>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="border-foreground/10 relative h-48 border">
              <div className="group bg-background border-foreground/10 flex h-full flex-col items-start border p-6 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-foreground/20 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)]">
                <FiAward className="text-accent mb-3 size-6 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="mb-1 font-sans text-sm font-bold">{t('features.badge.title')}</h3>
                <p className="text-foreground/60 font-sans text-sm leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                  {t('features.badge.description')}
                </p>
              </div>
            </div>
            <div className="border-foreground/10 relative h-48 border">
              <div className="group bg-background border-foreground/10 flex h-full flex-col items-start border p-6 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-foreground/20 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)]">
                <FiSmartphone className="text-accent mb-3 size-6 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="mb-1 font-sans text-sm font-bold">{t('features.app.title')}</h3>
                <p className="text-foreground/60 font-sans text-sm leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                  {t.rich('features.app.description', {
                    strong: (chunks) => <strong className="text-foreground">{chunks}</strong>,
                  })}
                </p>
              </div>
            </div>
            <div className="border-foreground/10 relative h-48 border">
              <div className="group bg-background border-foreground/10 flex h-full flex-col items-start border p-6 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-foreground/20 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)]">
                <FiBookOpen className="text-accent mb-3 size-6 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="mb-1 font-sans text-sm font-bold">{t('features.articles.title')}</h3>
                <p className="text-foreground/60 font-sans text-sm leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                  {t('features.articles.description')}
                </p>
              </div>
            </div>
            <div className="border-foreground/10 relative h-48 border">
              <div className="group bg-background border-foreground/10 flex h-full flex-col items-start border p-6 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-foreground/20 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)]">
                <FiFilter className="text-accent mb-3 size-6 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="mb-1 font-sans text-sm font-bold">{t('features.companyQuestions.title')}</h3>
                <p className="text-foreground/60 font-sans text-sm leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                  {t('features.companyQuestions.description')}
                </p>
              </div>
            </div>
            <div className="border-foreground/10 relative h-48 border">
              <div className="group bg-background border-foreground/10 flex h-full flex-col items-start border p-6 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-foreground/20 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)]">
                <FiCode className="text-accent mb-3 size-6 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="mb-1 font-sans text-sm font-bold">{t('features.premiumSolutions.title')}</h3>
                <p className="text-foreground/60 font-sans text-sm leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                  {t('features.premiumSolutions.description')}
                </p>
              </div>
            </div>
            <div className="border-foreground/10 relative h-48 border">
              <div className="group bg-background border-foreground/10 flex h-full flex-col items-start border p-6 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-foreground/20 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)]">
                <FiZap className="text-accent mb-3 size-6 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="mb-1 font-sans text-sm font-bold">{t('features.practiceTests.title')}</h3>
                <p className="text-foreground/60 font-sans text-sm leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                  {t('features.practiceTests.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS - SOCIAL PROOF */}
        <div className="border-foreground/10 mb-24 w-full border-y py-12">
          <p className="text-foreground/50 mb-8 text-center font-sans text-[10px] font-bold tracking-[0.3em] uppercase">
            {t('testimonials.title')}
          </p>
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            <div className="border-foreground/10 bg-background border p-6">
              <p className="text-foreground/40 mb-2 font-sans text-[10px] font-bold tracking-widest uppercase">
                {t('testimonials.log1.id')} — {t('testimonials.log1.role')}
              </p>
              <p className="font-sans text-sm leading-relaxed italic opacity-80">
                &ldquo;{t('testimonials.log1.text')}&rdquo;
              </p>
            </div>
            <div className="border-foreground/10 bg-background border p-6">
              <p className="text-foreground/40 mb-2 font-sans text-[10px] font-bold tracking-widest uppercase">
                {t('testimonials.log2.id')} — {t('testimonials.log2.role')}
              </p>
              <p className="font-sans text-sm leading-relaxed italic opacity-80">
                &ldquo;{t('testimonials.log2.text')}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="flex w-full flex-col-reverse gap-16 md:flex-row">
          <div className="flex-1">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} q={faq.q} a={faq.a} />
            ))}
          </div>
          <div className="lg:w-1/3">
            <div className="md:sticky md:top-24">
              <h2
                className="text-fluid-h3 font-serif leading-[0.9] font-bold"
                dangerouslySetInnerHTML={{ __html: t('faq.title') }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
