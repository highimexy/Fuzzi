import { Link } from 'next-view-transitions'
import { notFound } from 'next/navigation'
import { FiArrowLeft, FiGrid } from 'react-icons/fi'
import { getTranslations } from 'next-intl/server'
import { AcademyBackgroundGrid } from '../../_components/AcademyBackgroundGrid'
import { MarkdownRenderer } from '../../_components/MarkdownRenderer'
import { QA_COMPONENTS } from '../_data/components'

export async function generateStaticParams() {
  return QA_COMPONENTS.map((c) => ({ slug: c.slug }))
}

const severityColor = {
  critical: 'border-rose-500/40 text-rose-400 bg-rose-500/5',
  major: 'border-orange-400/40 text-orange-400 bg-orange-400/5',
  minor: 'border-yellow-500/40 text-yellow-500 bg-yellow-500/5',
}

const severityBadge = {
  critical: 'border-rose-500/60 text-rose-400',
  major: 'border-orange-400/60 text-orange-400',
  minor: 'border-yellow-500/60 text-yellow-500',
}

function ComponentImageArea({ image, name }: { image?: string; name: string }) {
  const initials = name
    .split(/[\s/]/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (image) {
    return (
      <div className="border-foreground/10 overflow-hidden border">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>
    )
  }

  return (
    <div className="border-foreground/10 bg-foreground/[0.03] flex aspect-[4/3] items-center justify-center border">
      <div className="flex flex-col items-center gap-2 opacity-20">
        <FiGrid className="text-4xl" />
        <span className="font-serif text-2xl font-bold tracking-widest uppercase">{initials}</span>
      </div>
    </div>
  )
}

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const component = QA_COMPONENTS.find((c) => c.slug === slug)
  if (!component) notFound()

  const t = await getTranslations({ locale, namespace: 'Academy.components' })
  const isPl = locale === 'pl'

  const name = isPl ? component.name_pl : component.name_en
  const aliases = isPl ? component.aliases_pl : component.aliases_en
  const description = isPl ? component.description_pl : component.description_en
  const whatToTest = isPl ? component.what_to_test_pl : component.what_to_test_en
  const tips = isPl ? component.tips_pl : component.tips_en

  const relatedComponents = (component.related ?? [])
    .map((slug) => QA_COMPONENTS.find((c) => c.slug === slug))
    .filter(Boolean) as (typeof QA_COMPONENTS)[number][]

  return (
    <div className="bg-background text-foreground flex w-full flex-1 items-stretch justify-center font-sans">
      {/* Lewa siatka */}
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* Środkowy kontent */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col px-4 py-12 sm:px-8">
        {/* Back link */}
        <Link
          href="/components"
          className="text-foreground/25 hover:text-foreground/50 inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase transition-colors"
        >
          <FiArrowLeft />
          <span>{t('backLink')}</span>
        </Link>

        {/* Nagłówek */}
        <div className="mt-8 mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex-1">
            <h1 className="font-serif text-4xl font-black uppercase tracking-tight">{name}</h1>

            {aliases && aliases.length > 0 && (
              <p className="text-foreground/40 mt-2 font-sans text-sm italic">
                {t('alsoKnownAs')}: {aliases.join(', ')}
              </p>
            )}

            <p className="text-foreground/60 mt-4 font-sans text-sm leading-relaxed">
              {description}
            </p>
          </div>

          <div className="w-full lg:w-56 lg:shrink-0">
            <ComponentImageArea image={component.image} name={name} />
          </div>
        </div>

        {/* Co testować */}
        <section className="border-foreground/10 mb-10 border-t pt-8">
          <h2 className="mb-5 font-serif text-xl font-bold uppercase tracking-wide">
            {t('whatToTest')}
          </h2>
          <ol className="flex flex-col gap-2.5">
            {whatToTest.map((item, i) => (
              <li key={i} className="flex gap-3 font-sans text-sm">
                <span className="text-primary w-6 shrink-0 font-mono font-bold tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-foreground/70 leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Typowe bugi */}
        <section className="border-foreground/10 mb-10 border-t pt-8">
          <h2 className="mb-5 font-serif text-xl font-bold uppercase tracking-wide">
            {t('commonBugs')}
          </h2>
          <div className="flex flex-col gap-4">
            {component.common_bugs.map((bug, i) => {
              const title = isPl ? bug.title_pl : bug.title_en
              const detail = isPl ? bug.detail_pl : bug.detail_en
              return (
                <div
                  key={i}
                  className={`border p-5 ${severityColor[bug.severity]}`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className={`border px-2 py-0.5 font-sans text-[9px] font-bold tracking-widest uppercase ${severityBadge[bug.severity]}`}
                    >
                      {t(`severity${bug.severity.charAt(0).toUpperCase() + bug.severity.slice(1)}` as any)}
                    </span>
                    <h3 className="font-sans text-sm font-bold leading-tight">{title}</h3>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none text-foreground/65 leading-relaxed">
                    <MarkdownRenderer>{detail}</MarkdownRenderer>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Porady */}
        {tips && tips.length > 0 && (
          <section className="border-foreground/10 bg-foreground/[0.02] mb-10 border p-6">
            <h3 className="text-primary mb-4 font-sans text-[10px] font-bold tracking-widest uppercase">
              {t('tips')}
            </h3>
            <ul className="flex flex-col gap-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex gap-3 font-sans text-sm">
                  <span className="text-primary shrink-0 font-bold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-foreground/65 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Powiązane */}
        {relatedComponents.length > 0 && (
          <section className="border-foreground/10 border-t pt-8">
            <h3 className="text-foreground/30 mb-4 font-sans text-[10px] font-bold tracking-widest uppercase">
              {t('related')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedComponents.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/components/${rel.slug}`}
                  className="border-foreground/15 hover:border-foreground/40 hover:text-foreground text-foreground/50 border px-3 py-1.5 font-sans text-xs tracking-widest uppercase transition-colors"
                >
                  {isPl ? rel.name_pl : rel.name_en}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Prawa siatka */}
      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
