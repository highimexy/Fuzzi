'use client'

import { SectionDivider } from '../_components/SectionDivider'
import { SimpleHeader } from '../_components/SimpleHeader'
import { Container } from '../../wrappers/Container'
import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations('About')

  const sections = [
    { id: 'manifesto', label: t('nav.manifesto') },
    { id: 'architecture', label: t('nav.architecture') },
    { id: 'faq', label: t('nav.faq') },
    { id: 'resources', label: t('nav.resources') },
  ]

  return (
    <main className="min-h-screen">
      <SimpleHeader title={t('header.title')} accentColor="text-zinc-400" />
      <SectionDivider />

      <section className="border-foreground/10 border-b">
        <Container className="">
          <div className="flex flex-col items-start lg:flex-row">
            {/* STICKY SIDEBAR (Oparta na tym z Changelogu) */}
            <aside className="border-foreground/10 bg-foreground/2 sticky top-14 hidden w-64 shrink-0 flex-col border-b lg:flex lg:border-b">
              <div className="border-foreground/10 bg-foreground/5 border-b px-6 py-5">
                <span className="font-sans text-[11px] font-bold tracking-widest uppercase opacity-50">
                  Wykaz Sekcji
                </span>
              </div>
              <nav className="flex flex-col">
                {sections.map((sec, index) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className={`group hover:bg-background relative flex items-center justify-between border border-transparent px-6 py-5 opacity-60 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-zinc-500/30 hover:opacity-100 hover:shadow-[0_10px_20px_-10px_rgba(161,161,170,0.15)] ${
                      index !== sections.length - 1
                        ? 'border-b-foreground/10 hover:border-b-zinc-500/30'
                        : ''
                    }`}
                  >
                    <span className="text-foreground font-sans text-xs font-bold tracking-widest uppercase transition-colors group-hover:text-zinc-400">
                      {sec.label}
                    </span>
                  </a>
                ))}
              </nav>
            </aside>

            {/* MAIN CONTENT */}
            <div className="bg-foreground/10 border-foreground/10 flex w-full flex-1 flex-col border-l">
              {/* 01: MANIFESTO */}
              <div
                id="manifesto"
                className="bg-background border-foreground/10 scroll-mt-32 border-b p-8 md:p-12 lg:p-16"
              >
                <h2 className="font-serif text-3xl tracking-tighter text-zinc-400 uppercase italic opacity-80">
                  {t('manifesto.title')}
                </h2>
                <div className="mt-8 max-w-3xl space-y-8 font-sans text-base leading-relaxed opacity-60">
                  <p>
                    {t.rich('manifesto.p1', {
                      bold: (chunks) => (
                        <span className="text-foreground font-bold opacity-100">{chunks}</span>
                      ),
                    })}
                  </p>
                  <p>
                    {t.rich('manifesto.p2', {
                      bold: (chunks) => (
                        <span className="text-foreground font-bold opacity-100">{chunks}</span>
                      ),
                    })}
                  </p>
                </div>
                <div className="border-foreground/20 mt-12 border-l-2 py-2 pl-8">
                  <p className="font-serif text-xl leading-snug italic opacity-80 md:text-2xl">
                    {t('manifesto.quote')}
                  </p>
                </div>
              </div>

              {/* 02: ARCHITECTURE */}
              <div
                id="architecture"
                className="bg-background border-foreground/10 scroll-mt-32 border-b p-8 md:p-12 lg:p-16"
              >
                <h2 className="font-serif text-3xl tracking-tighter text-zinc-400 uppercase italic opacity-80">
                  {t('architecture.title')}
                </h2>
                <div className="mt-8 max-w-3xl space-y-8 font-sans text-base leading-relaxed opacity-60">
                  <p>
                    {t.rich('architecture.p1', {
                      italic: (chunks) => <span className="italic">{chunks}</span>,
                    })}
                  </p>
                  <p>
                    {t.rich('architecture.p2', {
                      bold: (chunks) => (
                        <span className="text-foreground font-bold opacity-100">{chunks}</span>
                      ),
                    })}
                  </p>
                </div>
              </div>

              {/* 03: FAQ */}
              <div
                id="faq"
                className="bg-background border-foreground/10 scroll-mt-32 border-b p-8 md:p-12 lg:p-16"
              >
                <h2 className="mb-12 font-serif text-3xl tracking-tighter text-zinc-400 uppercase italic opacity-80">
                  {t('faq.title')}
                </h2>
                <div className="grid max-w-3xl gap-12">
                  {[1, 2, 3].map((num) => (
                    <div key={`q${num}`} className="group">
                      {/* ZMIENIONO H4 NA H3 */}
                      <h3 className="text-foreground mb-4 font-sans text-sm font-bold tracking-widest uppercase">
                        <span className="mr-2 text-zinc-500 opacity-50">Q:</span>
                        {t(`faq.q${num}`)}
                      </h3>
                      <p className="ml-1 border-l border-zinc-500/30 pl-4 font-sans text-base leading-relaxed opacity-60">
                        {t(`faq.a${num}`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 04: RESOURCES */}
              <div id="resources" className="bg-background scroll-mt-32 p-8 md:p-12 lg:p-16">
                <h2 className="font-serif text-3xl tracking-tighter text-zinc-400 uppercase italic opacity-80">
                  {t('resources.title')}
                </h2>
                <p className="mt-8 mb-12 max-w-3xl font-sans text-base leading-relaxed opacity-60">
                  {t('resources.p1')}
                </p>
                <div className="grid max-w-4xl gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((num) => (
                    <div
                      key={`book${num}`}
                      className="border-foreground/10 hover:bg-foreground/5 flex items-start gap-4 border p-6 transition-colors"
                    >
                      <span className="mt-1 font-mono text-xs opacity-30">0{num}</span>
                      <span className="font-sans text-sm font-bold opacity-80">
                        {t(`resources.book${num}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <SectionDivider />
    </main>
  )
}
