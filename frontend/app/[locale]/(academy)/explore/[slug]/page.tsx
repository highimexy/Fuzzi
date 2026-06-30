import { Link } from 'next-view-transitions'
import { notFound } from 'next/navigation'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { AcademyBackgroundGrid } from '../../_components/AcademyBackgroundGrid'
import { EXPLORE_ARTICLES } from '../_data/articles'

export async function generateStaticParams() {
  return EXPLORE_ARTICLES.map((a) => ({ slug: a.slug }))
}

export default async function ExploreArticlePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const article = EXPLORE_ARTICLES.find((a) => a.slug === slug)
  if (!article) notFound()

  const isPl = locale === 'pl'
  const category = isPl ? article.category_pl : article.category
  const tagline = isPl ? article.tagline_pl : article.tagline
  const sections = isPl ? article.sections_pl : article.sections
  const proTips = isPl ? article.proTips_pl : article.proTips

  return (
    <div className="bg-background text-foreground flex w-full flex-1 items-stretch justify-center font-sans">
      {/* LEWA SIATKA */}
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* ŚRODKOWY KONTENT */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col px-4 py-12 sm:px-8">
        {/* BACK BUTTON */}
        <Link
          href="/explore"
          className="text-foreground/25 hover:text-foreground/50 inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase transition-colors"
        >
          <FiArrowLeft />
          <span>Explore</span>
        </Link>

        {/* HEADER */}
        <div className="mb-12 mt-8">
          <span className="text-accent font-sans text-[10px] font-bold tracking-widest uppercase">
            {article.label} — {category}
          </span>
          <h1 className="mt-2 font-serif text-4xl font-black tracking-tighter uppercase">
            {article.title}
          </h1>
          <p className="text-foreground/50 mt-3 font-sans text-sm leading-relaxed">
            {tagline}
          </p>
        </div>

        {/* SECTIONS */}
        {sections.map((section) => (
          <div key={section.heading} className="border-foreground/10 mb-8 border-t pt-8">
            <h2 className="mb-3 font-serif text-xl font-bold">{section.heading}</h2>
            <p className="text-foreground/70 font-sans text-sm leading-relaxed">{section.body}</p>
          </div>
        ))}

        {/* PRO TIPS */}
        <div className="border-foreground/10 bg-foreground/[0.03] mt-4 border p-6">
          <h3 className="text-accent mb-4 font-sans text-[10px] font-bold tracking-widest uppercase">
            Pro Tips
          </h3>
          <ul className="flex flex-col gap-3">
            {proTips.map((tip, i) => (
              <li key={i} className="text-foreground/70 flex gap-3 font-sans text-sm">
                <span className="text-accent shrink-0 font-bold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* EXTERNAL LINKS */}
        {article.externalLinks && article.externalLinks.length > 0 && (
          <div className="mt-8 flex flex-col gap-2">
            <span className="text-foreground/30 font-sans text-[10px] font-bold tracking-widest uppercase">
              {isPl ? 'Zasoby' : 'Resources'}
            </span>
            {article.externalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-foreground/10 hover:border-foreground/30 group flex items-center justify-between border p-3 font-sans text-sm transition-colors"
              >
                <span className="font-bold">{link.label}</span>
                <FiArrowRight className="text-foreground/30 group-hover:text-foreground transition-colors" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* PRAWA SIATKA */}
      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
