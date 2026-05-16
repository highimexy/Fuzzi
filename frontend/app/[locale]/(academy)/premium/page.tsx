'use client'

import { useState } from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'

const FAQS = [
  {
    q: 'What do I get with a premium subscription?',
    a: 'You get full access to all premium features, including exclusive articles, advanced video explanations, and the ability to filter questions by specific companies.',
  },
  {
    q: 'What are premium solutions? Can I see a sample?',
    a: 'Premium solutions are highly detailed, step-by-step guides written by industry experts. They often include multiple approaches, space/time complexity analysis, and interactive code snippets.',
  },
  {
    q: 'How do you group questions by company?',
    a: 'We continuously aggregate and verify interview experiences shared by our community to ensure our company tags remain up-to-date and highly accurate.',
  },
  {
    q: 'I clicked the subscribe button, filled in my credit card information, and clicked "Add Payment Method". I still don\'t have access to any premium features.',
    a: 'Sometimes payment processing can take a few minutes. If your account is still not upgraded after 15 minutes, please try logging out and back in, or contact our support team.',
  },
  {
    q: 'What if I subscribe and want to cancel?',
    a: 'You can cancel your subscription at any time directly from your account settings. You will retain access to premium features until the end of your current billing cycle.',
  },
  {
    q: 'Can I subscribe with my current rates?',
    a: 'Yes, as long as you maintain an active subscription, your pricing is locked in and you will not be affected by future price increases.',
  },
]

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-foreground/10 border-b py-5">
      {/* DODANO: H3 owijające przycisk akordeonu */}
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
  return (
    <div className="flex w-full flex-1 flex-col items-stretch justify-center font-sans lg:flex-row">
      {/* LEWA SIATKA */}
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* ŚRODKOWY KONTENT */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-start px-4 py-16 sm:px-8 xl:max-w-5xl">
        {/* HERO HEADER */}
        <div className="mb-16 flex flex-col items-center justify-center text-center">
          {/* H1 */}
          <h1 className="text-fluid-h1 mb-4 font-serif leading-[0.9] font-bold tracking-tight">
            Premium
          </h1>
          <p className="text-foreground/80 font-sans text-sm md:text-base">
            Get started with a{' '}
            <span className="font-serif font-bold text-accent">Frontier</span> Subscription that
            works for you.
          </p>
        </div>

        {/* PRICING CARDS */}
        <div className="mb-32 flex w-full flex-col gap-6 md:flex-row md:gap-8">
          {/* MONTHLY CARD */}
          <div className="bg-background border-foreground/10 relative flex flex-1 flex-col justify-between overflow-hidden border p-8 shadow-sm">
            <div>
              <div className="mb-6 flex items-baseline gap-3">
                {/* H2 */}
                <h2 className="font-serif text-2xl leading-none font-bold">Monthly</h2>
                <span className="text-foreground/60 font-sans text-sm">billed monthly</span>
              </div>
              <p className="text-foreground/60 font-sans text-sm leading-relaxed">
                Our monthly plan grants access to{' '}
                <strong className="text-foreground">all premium features</strong>, the best plan for
                short-term subscribers.
              </p>
            </div>

            <div className="mt-8">
              <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-foreground/40 font-sans text-2xl font-bold line-through">
                  $39
                </span>
                <span className="font-sans text-4xl font-bold">$35</span>
                <span className="text-foreground/60 font-sans text-sm">/mo</span>
              </div>
              <p className="text-foreground/40 mb-6 font-sans text-[10px] tracking-widest uppercase">
                Prices are marked in USD
              </p>
              <button className="bg-foreground text-background hover:bg-foreground/90 w-full py-3 font-sans font-bold transition-transform hover:scale-[1.02]">
                Subscribe
              </button>
            </div>
          </div>

          {/* YEARLY CARD (POPULAR) */}
          <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-linear-to-br from-[#F0B100] to-[#5a450c] p-8 text-zinc-900 shadow-[0_0_40px_rgba(0,0,0,0.08)]">
            <div>
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  {/* H2 */}
                  <h2 className="font-serif text-2xl leading-none font-bold">Yearly</h2>
                  <span className="font-sans text-sm text-zinc-900/70">billed yearly ($179)</span>
                </div>
                <span className="flex items-center gap-1 bg-white p-2 font-sans text-[10px] font-bold tracking-widest uppercase">
                  🎉 Most popular
                </span>
              </div>
              <p className="font-sans text-sm leading-relaxed text-zinc-900/80">
                Our <strong className="text-zinc-900">most popular</strong> plan previously sold for
                $299 and is now only <strong className="text-zinc-900">$14.92/month</strong>. This
                plan <strong className="text-zinc-900">saves you over 62%</strong> in comparison to
                the monthly plan.
              </p>
            </div>

            <div className="mt-8">
              <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-sans text-4xl font-bold">$14.92</span>
                <span className="font-sans text-sm text-zinc-900/70">/mo</span>
              </div>
              <p className="mb-6 font-sans text-[10px] tracking-widest text-zinc-900/50 uppercase">
                Prices are marked in USD
              </p>
              <button className="w-full bg-zinc-900 py-3 font-sans font-bold text-white transition-transform hover:scale-[1.02] hover:bg-zinc-800">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="flex w-full flex-col-reverse gap-16 md:flex-row">
          {/* Lista pytań */}
          <div className="flex-1">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} q={faq.q} a={faq.a} />
            ))}
          </div>

          {/* Nagłówek */}
          <div className="lg:w-1/3">
            <div className="md:sticky md:top-24">
              {/* H2 - Nagłówek sekcji FAQ */}
              <h2 className="text-fluid-h3 font-serif leading-[0.9] font-bold">
                Frequently <br className="hidden lg:block" />
                asked <br className="hidden lg:block" />
                questions
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* PRAWA SIATKA */}
      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
