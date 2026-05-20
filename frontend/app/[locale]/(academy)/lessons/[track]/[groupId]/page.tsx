import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiArrowRight, FiCircle, FiPlayCircle, FiArrowLeft } from 'react-icons/fi'

// ─────────────────────────────────────────────
// Typy
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const lessonTypeLabel: Record<string, string> = {
  quiz: 'Quiz',
  article: 'Teoria',
  bug_hunt: 'Bug Hunt',
  doc_inspector: 'Doc',
  triage: 'Triage',
  diff_inspector: 'Diff',
  console_detective: 'Console',
  test_case_builder: 'Test Cases',
  dev_comm: 'Komunikacja',
  scenario: 'Scenariusz',
  salary_decoder: 'Salary',
  bullshit_detector: 'Bullshit',
  risk_map: 'Ryzyko',
  cv_audit: 'CV',
  interview: 'Rozmowa',
}

function getDifficultyColor(diff: string): string {
  const d = diff.toLowerCase()
  if (d.includes('beginner') || d.includes('początkujący'))
    return 'text-emerald-500 border-emerald-500/30'
  if (d.includes('intermediate') || d.includes('średni')) return 'text-primary border-primary/30'
  if (d.includes('advanced') || d.includes('zaawansowany'))
    return 'text-rose-500 border-rose-500/30'
  return 'text-foreground/30 border-foreground/15'
}

// ─────────────────────────────────────────────
// Fetch
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Strona grupy
// ─────────────────────────────────────────────

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
  const subLessons = group.lessons ?? []
  const firstLesson = subLessons[0]
  const diffColor = getDifficultyColor(group.difficulty)

  return (
    <div className="flex h-full w-full flex-col font-sans lg:flex-row">
      {/* ── LEWA — info o lekcji ── */}
      <div className="border-foreground/10 flex flex-col border-b lg:w-[42%] lg:border-r lg:border-b-0">
        {/* Breadcrumb */}
        <div className="border-foreground/10 border-b px-8 py-4 lg:px-10">
          <Link
            href={`/lessons/${track}`}
            className="text-foreground/25 hover:text-foreground/50 inline-flex items-center gap-2 font-sans text-[10px] tracking-widest uppercase transition-colors"
          >
            <FiArrowLeft className="text-fluid-small" />
            {track === 'qa' ? 'QA Track' : 'Reality Track'}
          </Link>
        </div>

        {/* Główna treść */}
        <div className="flex flex-1 flex-col justify-between p-8 lg:p-10 lg:pb-12">
          <div>
            {/* Numer + difficulty */}
            <div className="mb-6 flex items-center gap-3">
              <span className="text-primary font-sans text-[10px] tracking-[0.25em] uppercase">
                Lekcja {String(group.order).padStart(2, '0')}
              </span>
              <span className="text-foreground/10">·</span>
              <span
                className={`border px-1.5 py-0.5 font-sans text-[9px] font-bold tracking-widest uppercase ${diffColor}`}
              >
                {group.difficulty}
              </span>
            </div>

            {/* Tytuł */}
            <h1 className="mb-6 font-serif text-4xl leading-[0.88] font-bold tracking-tighter uppercase lg:text-5xl">
              {title}
            </h1>

            {/* Opis */}
            {desc && (
              <p className="text-foreground/40 max-w-xs font-sans text-sm leading-relaxed">
                {desc}
              </p>
            )}

            {/* Stats */}
            <div className="mt-8 flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-foreground/20 font-sans text-[9px] tracking-widest uppercase">
                  Sub-lekcji
                </span>
                <span className="font-serif text-2xl font-bold">{subLessons.length}</span>
              </div>
              <div className="bg-foreground/10 h-8 w-px" />
              <div className="flex flex-col gap-1">
                <span className="text-foreground/20 font-sans text-[9px] tracking-widest uppercase">
                  Typ dostępu
                </span>
                <span
                  className={`font-sans text-xs uppercase ${
                    group.access_tier === 'free'
                      ? 'text-emerald-500'
                      : group.access_tier === 'premium'
                        ? 'text-accent'
                        : 'text-foreground/40'
                  }`}
                >
                  {group.access_tier === 'free'
                    ? 'Darmowa'
                    : group.access_tier === 'premium'
                      ? 'Premium'
                      : 'Zalogowany'}
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          {firstLesson && (
            <div className="mt-10">
              <Link
                href={`/lessons/${track}/${groupId}/${firstLesson.id}`}
                className="group bg-foreground text-background inline-flex items-center gap-3 px-7 py-4 font-sans text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-200 hover:gap-4"
              >
                Zacznij lekcję
                <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── PRAWA — lista sub-lekcji ── */}
      <div className="flex flex-1 flex-col">
        {/* Header prawej kolumny */}
        <div className="border-foreground/10 border-b px-8 py-4 lg:px-10">
          <span className="text-foreground/25 font-sans text-[10px] tracking-widest uppercase">
            Moduły &nbsp;// &nbsp;{subLessons.length}{' '}
            {subLessons.length === 1 ? 'sub-lekcja' : 'sub-lekcji'}
          </span>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          {subLessons.length === 0 ? (
            <div className="border-foreground/10 text-foreground/20 flex h-40 items-center justify-center border border-dashed font-sans text-xs">
              Brak sub-lekcji
            </div>
          ) : (
            <div className="flex flex-col">
              {subLessons.map((sub, i) => {
                const subTitle = locale === 'pl' ? sub.title_pl : sub.title_en
                const typeLabel = lessonTypeLabel[sub.lesson_type] ?? sub.lesson_type
                const isFirst = i === 0

                return (
                  <Link
                    key={sub.id}
                    href={`/lessons/${track}/${groupId}/${sub.id}`}
                    className="group border-foreground/8 first:border-t-foreground/8 flex items-center gap-4 border-b py-4 transition-all duration-200 first:border-t hover:pl-1"
                  >
                    {/* Status ikona */}
                    <div className="flex w-5 shrink-0 justify-center">
                      {isFirst ? (
                        <FiPlayCircle className="text-primary text-base" />
                      ) : (
                        <FiCircle className="text-foreground/12 text-base" />
                      )}
                    </div>

                    {/* Numer */}
                    <span className="text-foreground/20 w-4 shrink-0 font-sans text-[10px]">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Tytuł */}
                    <span className="group-hover:text-foreground/80 flex-1 truncate font-sans text-sm font-bold transition-colors">
                      {subTitle}
                    </span>

                    {/* Type badge */}
                    <span className="border-foreground/10 text-foreground/25 group-hover:border-foreground/30 group-hover:text-foreground/40 shrink-0 border px-2 py-0.5 font-sans text-[9px] tracking-widest uppercase transition-colors">
                      {typeLabel}
                    </span>

                    <FiArrowRight className="text-foreground/12 group-hover:text-foreground/35 shrink-0 transition-all duration-200 group-hover:translate-x-0.5" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Progress dots na dole */}
        {subLessons.length > 1 && (
          <div className="border-foreground/10 border-t px-8 py-4 lg:px-10">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {subLessons.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === 0 ? 'bg-primary h-1.5 w-4' : 'bg-foreground/12 h-1 w-1'
                    }`}
                  />
                ))}
              </div>
              <span className="text-foreground/20 ml-1 font-sans text-[9px] tracking-widest uppercase">
                0 / {subLessons.length} ukończone
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
