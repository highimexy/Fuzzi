import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiLock, FiStar, FiCheckCircle, FiArrowRight, FiArrowLeft } from 'react-icons/fi'

interface LessonGroup {
  id: string
  track: string
  order: number
  difficulty: string
  access_tier: 'free' | 'registered' | 'premium'
  title_en: string
  title_pl: string
  desc_en: string
  desc_pl: string
  sub_lesson_count: number
  completed_count: number
}

type LockState = 'open' | 'in_progress' | 'completed' | 'locked' | 'premium'

const trackMeta = {
  qa: {
    label: 'QA TRACK',
    title: 'Quality Assurance',
    subtitle: 'Ultimate QA Compendium',
    desc: 'Od podstaw testowania po performance i security. Kompletna ścieżka dla QA Engineera od A do Z.',
  },
  reality: {
    label: 'REALITY TRACK',
    title: 'Reality Check',
    subtitle: '100 Hard Truths',
    desc: 'To czego nie powiedzą Ci na bootcampie. Rynek pracy, relacje z devami, kariera i wellbeing.',
  },
} as const

function getLockState(group: LessonGroup): LockState {
  if (group.access_tier === 'premium') return 'premium'
  if (group.access_tier === 'registered') return 'locked'
  const { completed_count: done, sub_lesson_count: total } = group
  if (done >= total && total > 0) return 'completed'
  if (done > 0) return 'in_progress'
  return 'open'
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

async function getGroups(track: string): Promise<LessonGroup[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tracks/${track}/groups`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

function ChapterCard({
  group,
  lockState,
  locale,
  total,
}: {
  group: LessonGroup
  lockState: LockState
  locale: string
  total: number
}) {
  const title = locale === 'pl' ? group.title_pl : group.title_en
  const desc = locale === 'pl' ? group.desc_pl : group.desc_en
  const isBlocked = lockState === 'locked' || lockState === 'premium'
  const diffColor = getDifficultyColor(group.difficulty)

  const card = (
    <div
      className={`group bg-background relative flex h-full flex-col gap-5 border p-6 transition-all duration-300 ease-out lg:p-8 ${
        isBlocked
          ? 'border-foreground/10 cursor-not-allowed opacity-30 select-none'
          : lockState === 'completed'
            ? 'border-emerald-500/20 bg-emerald-500/[0.02] cursor-pointer hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-emerald-500/40 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)]'
            : lockState === 'in_progress'
              ? 'border-primary/30 bg-primary/[0.02] cursor-pointer hover:border-primary/50 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)]'
              : 'border-foreground/10 hover:border-foreground/25 cursor-pointer hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)]'
      }`}
    >
      {/* Top row: index + status */}
      <div className="flex items-center justify-between">
        <span className="text-primary font-sans text-[9px] tracking-[0.3em] uppercase">
          {String(group.order).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-2">
          {lockState === 'completed' && <FiCheckCircle className="text-sm text-emerald-500" />}
          {lockState === 'in_progress' && (
            <div className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
          )}
          {lockState === 'locked' && <FiLock className="text-foreground/20 text-sm" />}
          {lockState === 'premium' && <FiStar className="text-accent text-sm" />}
        </div>
      </div>

      {/* Title */}
      <div className="flex-1">
        <h3 className="font-serif text-2xl leading-tight font-bold uppercase lg:text-3xl">
          {title}
        </h3>
        {desc && (
          <p className="text-foreground/40 mt-3 font-sans text-sm leading-relaxed">{desc}</p>
        )}
      </div>

      {/* Footer: difficulty + lesson count + arrow */}
      <div className="flex items-center justify-between border-t border-foreground/8 pt-4">
        <div className="flex items-center gap-3">
          <span
            className={`border px-2 py-0.5 font-sans text-[9px] font-bold tracking-widest uppercase ${isBlocked ? 'border-foreground/10 text-foreground/15' : diffColor}`}
          >
            {group.difficulty}
          </span>
          {group.sub_lesson_count > 0 && (
            <span className="text-foreground/25 font-sans text-[10px] tracking-wider">
              {group.sub_lesson_count}{' '}
              {group.sub_lesson_count === 1 ? 'lekcja' : 'lekcji'}
            </span>
          )}
          {lockState === 'in_progress' && group.sub_lesson_count > 0 && (
            <span className="text-primary/60 font-sans text-[10px]">
              {group.completed_count}/{group.sub_lesson_count}
            </span>
          )}
        </div>
        {!isBlocked && (
          <FiArrowRight className="text-foreground/20 group-hover:text-foreground/50 transition-all duration-200 group-hover:translate-x-0.5" />
        )}
        {lockState === 'premium' && (
          <span className="text-accent font-sans text-[9px] tracking-widest uppercase">
            Premium
          </span>
        )}
      </div>

      {/* Progress bar */}
      {(lockState === 'in_progress' || lockState === 'completed') && group.sub_lesson_count > 0 && (
        <div className="bg-foreground/8 absolute right-0 bottom-0 left-0 h-[2px]">
          <div
            className={`h-full transition-all duration-700 ${lockState === 'completed' ? 'bg-emerald-500/50' : 'bg-primary/50'}`}
            style={{ width: `${(group.completed_count / group.sub_lesson_count) * 100}%` }}
          />
        </div>
      )}
    </div>
  )

  if (isBlocked) return card
  return (
    <Link href={`/lessons/${group.track}/${group.id}`} className="block h-full">
      {card}
    </Link>
  )
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ track: string; locale: string }>
}) {
  const { track, locale } = await params
  const meta = trackMeta[track as keyof typeof trackMeta]
  if (!meta) notFound()

  const groups = await getGroups(track)

  const totalLessons = groups.reduce((sum, g) => sum + g.sub_lesson_count, 0)
  const totalCompleted = groups.filter(
    (g) => g.completed_count >= g.sub_lesson_count && g.sub_lesson_count > 0
  ).length
  const premiumCount = groups.filter((g) => g.access_tier === 'premium').length
  const registeredCount = groups.filter((g) => g.access_tier === 'registered').length

  return (
    <div className="flex min-h-full flex-col font-sans">
      {/* HEADER */}
      <div className="border-foreground/10 border-b px-8 py-10 lg:px-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/lessons"
              className="text-foreground/25 hover:text-foreground/50 mb-5 inline-flex items-center gap-1.5 font-sans text-[10px] tracking-widest uppercase transition-colors"
            >
              <FiArrowLeft />
              <span>Lessons</span>
            </Link>
            <p className="text-primary mb-2 font-sans text-[9px] tracking-[0.3em] uppercase">
              {meta.subtitle}
            </p>
            <h1 className="font-serif text-5xl leading-[0.88] font-bold tracking-tighter uppercase lg:text-6xl">
              {meta.title}
            </h1>
            <p className="text-foreground/35 mt-4 max-w-md font-sans text-sm leading-relaxed">
              {meta.desc}
            </p>
          </div>

          {/* Statystyki */}
          <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex flex-col items-center gap-1">
              <span className="font-serif text-3xl font-bold">{groups.length}</span>
              <span className="text-foreground/25 font-sans text-[9px] tracking-widest uppercase">
                Rozdziałów
              </span>
            </div>
            {totalLessons > 0 && (
              <>
                <div className="bg-foreground/10 h-8 w-px" />
                <div className="flex flex-col items-center gap-1">
                  <span className="font-serif text-3xl font-bold">{totalLessons}</span>
                  <span className="text-foreground/25 font-sans text-[9px] tracking-widest uppercase">
                    Lekcji
                  </span>
                </div>
              </>
            )}
            {totalCompleted > 0 && (
              <>
                <div className="bg-foreground/10 h-8 w-px" />
                <div className="flex flex-col items-center gap-1">
                  <span className="font-serif text-3xl font-bold text-emerald-500">
                    {totalCompleted}
                  </span>
                  <span className="text-foreground/25 font-sans text-[9px] tracking-widest uppercase">
                    Ukończone
                  </span>
                </div>
              </>
            )}
            {registeredCount > 0 && (
              <>
                <div className="bg-foreground/10 h-8 w-px" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-foreground/40 font-serif text-3xl font-bold">
                    {registeredCount}
                  </span>
                  <span className="text-foreground/25 font-sans text-[9px] tracking-widest uppercase">
                    Konto
                  </span>
                </div>
              </>
            )}
            {premiumCount > 0 && (
              <>
                <div className="bg-foreground/10 h-8 w-px" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-accent font-serif text-3xl font-bold">{premiumCount}</span>
                  <span className="text-foreground/25 font-sans text-[9px] tracking-widest uppercase">
                    Premium
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SIATKA ROZDZIAŁÓW */}
      <div className="flex-1 px-8 py-8 lg:px-16">
        {groups.length === 0 ? (
          <div className="text-foreground/20 flex h-40 items-center justify-center font-sans text-sm">
            Ładowanie rozdziałów...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <ChapterCard
                key={group.id}
                group={group}
                lockState={getLockState(group)}
                locale={locale}
                total={groups.length}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
