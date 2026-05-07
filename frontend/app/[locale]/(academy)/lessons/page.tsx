'use client'

import Link from 'next/link'
import { FiTerminal, FiTarget, FiStar, FiPercent } from 'react-icons/fi'
import { useTranslations } from 'next-intl'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'

const learningPaths = [
  {
    id: 'qa',
    label: 'QA AUTOMATION',
    title: 'Quality Assurance',
    desc: 'Master E2E testing, Cypress, and robust API mocking strategies.',
    href: '/academy/qa',
    icon: FiTerminal,
    colorClass: 'text-green-500',
    borderHover: 'hover:border-green-500/30',
    bgHover: 'hover:bg-green-500/5',
  },
  {
    id: 'reality',
    label: 'ENGINEERING TRUTHS',
    title: 'Reality Check',
    desc: 'System design, career architecture, and surviving the tech industry.',
    href: '/academy/reality-check',
    icon: FiTarget,
    colorClass: 'text-purple-500',
    borderHover: 'hover:border-purple-500/30',
    bgHover: 'hover:bg-purple-500/5',
  },
]

// Funkcja przypisująca kolory na podstawie poziomu trudności (PL i EN)
const getDifficultyStyles = (diff: string) => {
  const d = diff.toLowerCase()
  if (d.includes('beginner') || d.includes('początkujący')) {
    return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
  }
  if (d.includes('intermediate') || d.includes('średni')) {
    return 'text-blue-500 border-blue-500/30 bg-blue-500/10'
  }
  if (d.includes('advanced') || d.includes('zaawansowany')) {
    return 'text-rose-500 border-rose-500/30 bg-rose-500/10'
  }
  return 'text-foreground/60 border-foreground/10 bg-transparent' // Domyślny
}

function LessonsTable({
  items,
  colorClass,
  basePath,
}: {
  items: Record<string, { title: string; status: string; difficulty?: string; progress?: number }>
  colorClass: string
  basePath: string
}) {
  return (
    <div className="border-foreground/10 relative border">
      {Object.entries(items).map(([key, lesson]) => {
        const difficulty = lesson.difficulty || 'Beginner'
        const progress = lesson.progress || 0
        const difficultyStyles = getDifficultyStyles(difficulty)

        return (
          <Link
            key={key}
            href={`${basePath}/${key}`}
            className="group border-foreground/10 bg-background flex flex-col justify-between gap-4 border p-4 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-zinc-500/30 hover:opacity-100 hover:shadow-[0_10px_20px_-10px_rgba(161,161,170,0.15)] sm:flex-row sm:items-center"
          >
            {/* LEWA STRONA: Tytuł i Tagi */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-widest opacity-30">
                  {key.padStart(2, '0')}
                </span>
                <span className="font-sans text-sm font-bold tracking-wide">{lesson.title}</span>
              </div>

              {/* TAGI WCIĘTE POD TYTUŁ */}
              <div className="flex flex-wrap items-center gap-2 pl-8">
                {/* Status */}
                <span className="bg-yellow-500/10 px-2 py-0.5 font-sans text-[9px] font-bold tracking-widest text-yellow-500 uppercase">
                  {lesson.status}
                </span>

                {/* Trudność (Dynamiczny kolor) */}
                <span
                  className={`border px-2 py-0.5 font-sans text-[9px] font-bold tracking-widest uppercase ${difficultyStyles}`}
                >
                  {difficulty}
                </span>

                {/* Flawless Rate (Wskaźnik z Popoverem) */}
                <div className="group/tooltip relative flex items-center justify-center">
                  <span className="border-foreground/10 text-foreground/60 group-hover/tooltip:text-foreground flex h-5 items-center justify-center gap-0.5 border px-2 font-sans text-[10px] font-bold tracking-widest uppercase transition-colors group-hover/tooltip:border-zinc-500/50">
                    {progress}
                    <FiPercent className="text-[8px]" />
                  </span>

                  {/* Popover */}
                  <div className="bg-foreground text-background pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 px-2 py-1 font-sans text-[10px] font-bold tracking-wider whitespace-nowrap opacity-0 transition-all group-hover/tooltip:opacity-100">
                    Flawless rate
                    {/* Strzałka popovera */}
                    <div className="bg-foreground absolute top-full left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* PRAWA STRONA: Gwiazdka */}
            <div className="flex items-center self-end sm:self-auto">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  console.log('Dodano do ulubionych:', key)
                }}
                className="text-foreground/20 group-hover:text-foreground/50 p-2 transition-all duration-300 hover:scale-110 hover:text-yellow-400"
              >
                <FiStar className="text-xl" />
              </button>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function AcademyDashboard() {
  const t = useTranslations('Lessons')

  return (
    <div className="flex w-full flex-1 items-stretch justify-center font-sans">
      {/* === LEWA SIATKA === */}
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* === ŚRODKOWY KONTENT === */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-stretch lg:flex-row xl:max-w-7xl">
        {/* QA COLUMN */}
        <div className="border-foreground/10 flex w-full flex-col border-b lg:w-1/2 lg:border-r lg:border-b-0">
          {(() => {
            const path = learningPaths[0]!
            const Icon = path.icon
            return (
              <Link
                href={path.href}
                className={`group relative flex flex-col justify-between overflow-hidden p-8 transition-all duration-300 ${path.borderHover} ${path.bgHover}`}
              >
                <Icon
                  className={`absolute top-2 right-2 text-8xl opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.08] ${path.colorClass}`}
                />

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`font-sans font-bold tracking-widest uppercase ${path.colorClass}`}
                    >
                      {path.label}
                    </span>
                  </div>
                  <h3 className="mb-3 font-serif text-2xl font-bold tracking-tight">
                    {path.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed opacity-60">{path.desc}</p>
                </div>
              </Link>
            )
          })()}

          <div className="border-foreground/10 border-t p-8">
            <LessonsTable
              items={t.raw('qaLessons.items')}
              colorClass="text-green-500"
              basePath="/academy/lessons/qa"
            />
          </div>
        </div>

        {/* REALITY CHECK COLUMN */}
        <div className="flex w-full flex-col lg:w-1/2">
          {(() => {
            const path = learningPaths[1]!
            const Icon = path.icon
            return (
              <Link
                href={path.href}
                className={`group relative flex flex-col justify-between overflow-hidden p-8 transition-all duration-300 ${path.borderHover} ${path.bgHover}`}
              >
                <Icon
                  className={`absolute top-3 right-3 text-8xl opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.08] ${path.colorClass}`}
                />

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`font-sans font-bold tracking-widest uppercase ${path.colorClass}`}
                    >
                      {path.label}
                    </span>
                  </div>
                  <h3 className="mb-3 font-serif text-2xl font-bold tracking-tight">
                    {path.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed opacity-60">{path.desc}</p>
                </div>
              </Link>
            )
          })()}

          <div className="border-foreground/10 border-t p-8">
            <LessonsTable
              items={t.raw('realityLessons.items')}
              colorClass="text-purple-500"
              basePath="/academy/lessons/reality"
            />
          </div>
        </div>
      </div>

      {/* === PRAWA SIATKA === */}
      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
