import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  FiLock,
  FiStar,
  FiCheckCircle,
  FiTerminal,
  FiTarget,
  FiArrowRight,
  FiArrowLeft,
} from 'react-icons/fi'

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
    Icon: FiTerminal,
  },
  reality: {
    label: 'REALITY TRACK',
    title: 'Reality Check',
    subtitle: '100 Hard Truths',
    Icon: FiTarget,
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

function LessonCard({
  group,
  lockState,
  locale,
}: {
  group: LessonGroup
  lockState: LockState
  locale: string
}) {
  const title = locale === 'pl' ? group.title_pl : group.title_en
  const isBlocked = lockState === 'locked' || lockState === 'premium'
  const diffColor = getDifficultyColor(group.difficulty)

  const card = (
    <div
      className={`group bg-background relative flex h-full flex-col gap-3 border p-4 transition-all duration-300 ease-out ${
        isBlocked
          ? 'border-foreground/10 cursor-not-allowed opacity-30 select-none'
          : lockState === 'completed'
            ? 'cursor-pointer border-emerald-500/20 bg-emerald-500/3 hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-emerald-500/40 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)]'
            : lockState === 'in_progress'
              ? 'border-primary/30 bg-primary/3 hover:border-primary/50 cursor-pointer hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)]'
              : 'border-foreground/10 hover:border-foreground/30 cursor-pointer hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)]'
      } `}
    >
      {/* Top — numer + ikona stanu */}
      <div className="flex items-center justify-between">
        <span className="text-foreground/20 font-sans text-[10px] tracking-widest">
          {String(group.order).padStart(2, '0')}
        </span>
        {lockState === 'completed' && <FiCheckCircle className="text-xs text-emerald-500" />}
        {lockState === 'in_progress' && (
          <div className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
        )}
        {lockState === 'locked' && <FiLock className="text-foreground/20 text-xs" />}
        {lockState === 'premium' && <FiStar className="text-accent text-xs" />}
      </div>

      {/* Tytuł */}
      <h3
        className={`flex-1 font-serif text-sm leading-tight font-bold uppercase ${isBlocked ? 'text-foreground/25' : 'text-foreground'}`}
      >
        {title}
      </h3>

      {/* Bottom — difficulty */}
      <div className="mt-auto flex items-center justify-between">
        <span
          className={`border px-1.5 py-0.5 font-sans text-[8px] font-bold tracking-widest uppercase ${isBlocked ? 'text-foreground/12 border-foreground/10' : diffColor}`}
        >
          {group.difficulty}
        </span>
        {lockState === 'premium' && (
          <span className="text-accent font-sans text-[8px] tracking-widest uppercase">
            Premium
          </span>
        )}
        {lockState === 'in_progress' && group.sub_lesson_count > 1 && (
          <span className="text-primary/60 font-sans text-[8px]">
            {group.completed_count}/{group.sub_lesson_count}
          </span>
        )}
        {!isBlocked && lockState === 'open' && (
          <FiArrowRight className="text-foreground/15 group-hover:text-foreground/40 text-xs transition-all duration-200 group-hover:translate-x-0.5" />
        )}
      </div>

      {/* Progress bar — absolutna linia na dole */}
      {(lockState === 'in_progress' || lockState === 'completed') && group.sub_lesson_count > 1 && (
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

  const totalCompleted = groups.filter(
    (g) => g.completed_count >= g.sub_lesson_count && g.sub_lesson_count > 0
  ).length

  const freeCount = groups.filter((g) => g.access_tier === 'free').length
  const registeredCount = groups.filter((g) => g.access_tier === 'registered').length
  const premiumCount = groups.filter((g) => g.access_tier === 'premium').length

  return (
    <div className="flex min-h-full flex-col font-sans">
      {/* HEADER */}
      <div className="border-foreground/10 border-b px-8 py-10 lg:px-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* Lewa */}
          <div>
            <Link
              href="/lessons"
              className="text-foreground/25 hover:text-foreground/50 mb-5 inline-flex items-center gap-1.5 font-sans text-[10px] tracking-widest uppercase transition-colors"
            >
              <FiArrowLeft className="text-fluid-small" />
              <span>Lessons</span>
            </Link>
            <p className="text-primary mb-2 font-sans text-[9px] tracking-[0.3em] uppercase">
              {meta.subtitle}
            </p>
            <h1 className="font-serif text-5xl leading-[0.88] font-bold tracking-tighter uppercase lg:text-6xl">
              {meta.title}
            </h1>
          </div>

          {/* Prawa — statystyki */}
          <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex flex-col items-center gap-1">
              <span className="font-serif text-3xl font-bold text-emerald-500">{freeCount}</span>
              <span className="text-foreground/25 font-sans tracking-widest uppercase">
                Darmowe
              </span>
            </div>
            <div className="bg-foreground/10 h-8 w-px" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-foreground/40 font-serif text-3xl font-bold">
                {registeredCount}
              </span>
              <span className="text-foreground/25 font-sans tracking-widest uppercase">Konto</span>
            </div>
            <div className="bg-foreground/10 h-8 w-px" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-accent font-serif text-3xl font-bold">{premiumCount}</span>
              <span className="text-foreground/25 font-sans tracking-widest uppercase">
                Premium
              </span>
            </div>
            {totalCompleted > 0 && (
              <>
                <div className="bg-foreground/10 h-8 w-px" />
                <div className="flex flex-col items-center gap-1">
                  <span className="font-serif text-3xl font-bold">{totalCompleted}</span>
                  <span className="text-foreground/25 font-sans text-[8px] tracking-widest uppercase">
                    Ukończone
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* LEGENDA */}
      <div className="border-foreground/10 flex flex-wrap items-center gap-6 border-b px-8 py-3 lg:px-16">
        <div className="flex items-center gap-1.5">
          <FiCheckCircle className="text-md text-emerald-500" />
          <span className="text-foreground/25 font-sans tracking-widest uppercase">Ukończona</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="bg-primary h-3 w-3 rounded-full" />
          <span className="text-foreground/25 font-sans tracking-widest uppercase">W trakcie</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiLock className="text-foreground/20 text-md" />
          <span className="text-foreground/25 font-sans tracking-widest uppercase">
            Wymaga konta
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiStar className="text-accent text-md" />
          <span className="text-foreground/25 font-sans tracking-widest uppercase">Premium</span>
        </div>
      </div>

      {/* SIATKA */}
      <div className="flex-1 px-8 py-8 lg:px-16">
        {groups.length === 0 ? (
          <div className="text-foreground/20 text-md flex h-40 items-center justify-center font-sans">
            Ładowanie modułów...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
            {groups.map((group) => (
              <div className="border-foreground/10 border">
                <LessonCard
                  key={group.id}
                  group={group}
                  lockState={getLockState(group)}
                  locale={locale}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
