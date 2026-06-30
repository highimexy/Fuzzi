import { Link } from 'next-view-transitions'
import { notFound } from 'next/navigation'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { SubLessonList } from './SubLessonList'

function plLekcja(n: number): string {
  if (n === 1) return 'lekcja'
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) return 'lekcje'
  return 'lekcji'
}

interface SubLesson {
  id: string
  order: number
  title_en: string
  title_pl: string
  lesson_type: string
  difficulty: string
}

interface LessonGroup {
  id: string
  track: string
  order: number
  difficulty: string
  access_tier: string
  title_en: string
  title_pl: string
  desc_en: string
  desc_pl: string
  lessons: SubLesson[]
}

const lessonTypeLabel: Record<string, string> = {
  quiz: 'Quiz',
  article: 'Artykuł',
  bug_hunt: 'Bug Hunt',
  doc_inspector: 'Doc',
  triage: 'Triage',
  diff_inspector: 'Diff',
  console_detective: 'Console',
  scenario: 'Scenariusz',
  salary_decoder: 'Salary',
  bullshit_detector: 'Bullshit',
  risk_map: 'Ryzyko',
  cv_audit: 'CV',
  audit: 'Audit',
}

function getDifficultyColor(diff: string): string {
  const d = diff.toLowerCase()
  if (d.includes('beginner') || d.includes('początkujący'))
    return 'text-emerald-500 border-emerald-500/25'
  if (d.includes('intermediate') || d.includes('średni')) return 'text-primary border-primary/25'
  if (d.includes('advanced') || d.includes('zaawansowany'))
    return 'text-rose-500 border-rose-500/25'
  return 'text-foreground/30 border-foreground/10'
}

async function getGroup(groupId: string): Promise<LessonGroup | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/groups/${groupId}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ track: string; groupId: string; locale: string }>
}) {
  const { track, groupId, locale } = await params
  const group = await getGroup(groupId)
  if (!group) notFound()

  const title = locale === 'pl' ? group.title_pl : group.title_en
  const desc = locale === 'pl' ? group.desc_pl : group.desc_en
  const subLessons = [...(group.lessons ?? [])].sort((a, b) => a.order - b.order)
  const firstLesson = subLessons[0]
  const diffColor = getDifficultyColor(group.difficulty)
  const trackLabel = track === 'qa' ? 'QA Track' : 'Reality Track'
  const uniqueTypes = [...new Set(subLessons.map((s) => s.lesson_type))]
  const chapterNum = String(group.order).padStart(2, '0')

  return (
    <div className="flex min-h-full flex-col font-sans">
      {/* ── BREADCRUMB ── */}
      <div className="border-foreground/10 shrink-0 border-b px-8 py-2 lg:px-16">
        <Link
          href={`/lessons/${track}`}
          className="text-foreground/25 hover:text-foreground/50 inline-flex items-center gap-2 font-sans tracking-widest uppercase transition-colors"
        >
          <FiArrowLeft />
          {trackLabel}
        </Link>
      </div>

      {/* ── 2-COLUMN LAYOUT ── */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* ── LEFT: chapter info (sticky) ── */}
        <div className="border-foreground/10 relative flex flex-col border-b px-8 py-12 lg:sticky lg:top-0 lg:h-screen lg:w-2/5 lg:overflow-y-auto lg:border-r lg:border-b-0 lg:px-16 lg:py-16">
          {/* Watermark number */}
          <div className="pointer-events-none absolute top-8 left-8 font-serif text-[12rem] leading-none font-bold tracking-tighter opacity-[0.04] select-none lg:left-16">
            {chapterNum}
          </div>

          <div className="relative flex flex-1 flex-col">
            {/* Badges */}
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="text-primary font-sans text-[9px] tracking-[0.3em] uppercase">
                Rozdział {chapterNum}
              </span>
              <span className="text-foreground/15">·</span>
              <span
                className={`border px-2 py-0.5 font-sans text-[9px] font-bold tracking-widest uppercase ${diffColor}`}
              >
                {group.difficulty}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-6 font-serif text-4xl leading-[0.88] font-bold tracking-tighter uppercase lg:text-5xl">
              {title}
            </h1>

            {/* Description */}
            {desc && (
              <p className="text-foreground/50 mb-10 font-sans text-sm leading-relaxed">{desc}</p>
            )}

            {/* Stats */}
            <div className="border-foreground/10 mb-8 flex items-center gap-8 border-t pt-6">
              <div className="flex flex-col gap-1">
                <span className="font-serif text-4xl leading-none font-bold">
                  {subLessons.length}
                </span>
                <span className="text-foreground/25 font-sans text-[9px] tracking-widest uppercase">
                  {plLekcja(subLessons.length)}
                </span>
              </div>
              <div className="bg-foreground/10 h-8 w-px" />
              <div className="flex flex-col gap-1">
                <span className="font-serif text-4xl leading-none font-bold">
                  {uniqueTypes.length}
                </span>
                <span className="text-foreground/25 font-sans text-[9px] tracking-widest uppercase">
                  {uniqueTypes.length === 1 ? 'Format' : 'Formaty'}
                </span>
              </div>
            </div>

            {/* Lesson type tags */}
            {uniqueTypes.length > 0 && (
              <div className="mb-10 flex flex-wrap gap-2">
                {uniqueTypes.map((type) => (
                  <span
                    key={type}
                    className="border-foreground/10 text-foreground/30 border px-2 py-1 font-sans text-[9px] tracking-widest uppercase"
                  >
                    {lessonTypeLabel[type] ?? type}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            {firstLesson && (
              <Link
                href={`/lesson/${firstLesson.id}`}
                className="group bg-foreground text-background mt-auto inline-flex items-center gap-3 px-8 py-4 font-sans text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-200 hover:gap-5"
              >
                Zacznij rozdział
                <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>

        {/* ── RIGHT: sublesson cards ── */}
        <div className="flex-1 px-8 py-10 lg:px-12 lg:py-12">
          <p className="text-foreground/25 mb-6 font-sans text-[9px] tracking-[0.3em] uppercase">
            Lekcje &nbsp;//&nbsp; {subLessons.length}{' '}
            {plLekcja(subLessons.length)}
          </p>

          <SubLessonList subLessons={subLessons} groupId={groupId} locale={locale} />
        </div>
      </div>
    </div>
  )
}
