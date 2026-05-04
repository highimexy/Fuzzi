'use client'

import Link from 'next/link'
import { FiTerminal, FiTarget, FiArrowRight } from 'react-icons/fi'
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

function LessonsTable({
  items,
  colorClass,
  basePath,
}: {
  items: Record<string, { title: string; status: string }>
  colorClass: string
  basePath: string
}) {
  return (
    <div className="space-y-0">
      {Object.entries(items).map(([key, lesson]) => (
        <Link
          key={key}
          href={`${basePath}/${key}`}
          className="group border-foreground/10 flex items-center justify-between border p-4 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-zinc-500/30 hover:opacity-100 hover:shadow-[0_10px_20px_-10px_rgba(161,161,170,0.15)]"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-widest opacity-30">
              {key.padStart(2, '0')}
            </span>
            <span className="font-sans text-sm font-bold tracking-wide">{lesson.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-block bg-yellow-500/10 px-3 py-1 font-sans text-[9px] font-bold tracking-widest text-yellow-500 uppercase">
              {lesson.status}
            </span>
            <FiArrowRight
              className={`text-lg opacity-0 transition-all group-hover:opacity-60 ${colorClass}`}
            />
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function AcademyDashboard() {
  const t = useTranslations('Lessons')

  return (
    // TEN SAM GŁÓWNY WRAPPER
    <div className="flex w-full flex-1 items-stretch justify-center font-sans">
      {/* === LEWA SIATKA === */}
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* === ŚRODKOWY KONTENT === */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-stretch lg:flex-row xl:max-w-5xl">
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
                  className={`absolute -top-6 -right-6 text-9xl opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.08] ${path.colorClass}`}
                />

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`font-sans font-bold tracking-widest uppercase ${path.colorClass}`}
                    >
                      {path.label}
                    </span>
                    <Icon
                      className={`text-2xl opacity-50 transition-opacity group-hover:opacity-100 ${path.colorClass}`}
                    />
                  </div>
                  <h3 className="mb-3 font-serif text-2xl font-bold tracking-tight">
                    {path.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed opacity-60">{path.desc}</p>
                </div>

                <div className="border-foreground/10 mt-10 flex items-center gap-3 border-t pt-4 font-serif text-xs font-bold uppercase opacity-50 transition-opacity group-hover:opacity-100">
                  <span className="mt-2">Enter Path</span>
                  <FiArrowRight className="mt-2 text-lg transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })()}

          <div className="border-foreground/10 border-t p-8">
            <LessonsTable
              items={t.raw('qaLessons.items') as Record<string, { title: string; status: string }>}
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
                  className={`absolute -top-6 -right-6 text-9xl opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.08] ${path.colorClass}`}
                />

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`font-sans font-bold tracking-widest uppercase ${path.colorClass}`}
                    >
                      {path.label}
                    </span>
                    <Icon
                      className={`text-2xl opacity-50 transition-opacity group-hover:opacity-100 ${path.colorClass}`}
                    />
                  </div>
                  <h3 className="mb-3 font-serif text-2xl font-bold tracking-tight">
                    {path.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed opacity-60">{path.desc}</p>
                </div>

                <div className="border-foreground/10 mt-10 flex items-center gap-3 border-t pt-4 font-serif text-xs font-bold uppercase opacity-50 transition-opacity group-hover:opacity-100">
                  <span className="mt-2">Enter Path</span>
                  <FiArrowRight className="mt-2 text-lg transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })()}

          <div className="border-foreground/10 border-t p-8">
            <LessonsTable
              items={
                t.raw('realityLessons.items') as Record<string, { title: string; status: string }>
              }
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
