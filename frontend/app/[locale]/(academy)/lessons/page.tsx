'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiTerminal, FiTarget, FiArrowRight } from 'react-icons/fi'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'

interface Lesson {
  id: string
  track: string
  difficulty: string
  status: string
  title_en: string
  title_pl: string
}

const learningPaths = [
  {
    id: 'qa',
    title: 'Quality Assurance',
    desc: 'Master E2E testing, Cypress, and robust API mocking strategies.',
    href: '/academy/qa',
    icon: FiTerminal,
  },
  {
    id: 'reality',
    title: 'Reality Check',
    desc: 'System design, career architecture, and surviving the tech industry.',
    href: '/academy/reality-check',
    icon: FiTarget,
  },
]

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
  return 'text-foreground/60 border-foreground/10 bg-transparent'
}

// 2. Tabela lekcji z obsługą i18n
function LessonsTable({ items, basePath }: { items: Lesson[]; basePath: string }) {
  // Pobieramy aktualny język (np. 'pl' lub 'en')
  const locale = useLocale()

  if (items.length === 0) {
    return (
      <div className="border-foreground/10 flex items-center justify-center border p-8 font-mono text-sm opacity-50">
        Ładowanie modułów...
      </div>
    )
  }

  return (
    <div className="border-foreground/10 relative border">
      {items.map((lesson, index) => {
        const difficultyStyles = getDifficultyStyles(lesson.difficulty)

        // WYBÓR TYTUŁU NA PODSTAWIE JĘZYKA
        const title = locale === 'pl' ? lesson.title_pl : lesson.title_en

        return (
          <Link
            key={lesson.id}
            href={`${basePath}/${lesson.id}`}
            className="group border-foreground/10 bg-background flex flex-col justify-between gap-4 border p-4 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-zinc-500/30 hover:opacity-100 hover:shadow-[0_10px_20px_-10px_rgba(161,161,170,0.15)] sm:flex-row sm:items-center"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-widest opacity-30">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {/* Używamy zmiennej `title`, nie `lesson.title` */}
                <span className="font-sans text-sm font-bold tracking-wide">{title}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pl-8">
                <span className="bg-yellow-500/10 px-2 py-0.5 font-sans text-[9px] font-bold tracking-widest text-yellow-500 uppercase">
                  {lesson.status}
                </span>
                <span
                  className={`border px-2 py-0.5 font-sans text-[9px] font-bold tracking-widest uppercase ${difficultyStyles}`}
                >
                  {lesson.difficulty}
                </span>
              </div>
            </div>

            <div className="flex items-center self-end sm:self-auto">
              <FiArrowRight className="text-xl opacity-20 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </div>
          </Link>
        )
      })}
    </div>
  )
}

// 3. Główny komponent widoku
export default function AcademyDashboard() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash

    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')

      if (accessToken) {
        localStorage.setItem('token', accessToken)

        window.dispatchEvent(new Event('auth-change'))

        window.history.replaceState(null, '', window.location.pathname)

        console.log('Zalogowano pomyślnie przez Google!')
      }
    }
  }, [router])

  const [lessons, setLessons] = useState<Lesson[]>([])

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/lessons')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLessons(data)
        }
      })
      .catch((err) => console.error('Błąd pobierania lekcji:', err))
  }, [])

  const qaLessons = lessons.filter((l) => l.track === 'qa')
  const realityLessons = lessons.filter((l) => l.track === 'reality')

  return (
    <div className="flex w-full flex-1 items-stretch justify-center font-sans">
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-stretch lg:flex-row xl:max-w-7xl">
        <h1 className="sr-only">Academy Curriculum</h1>

        {/* QA COLUMN */}
        <div className="border-foreground/10 flex w-full flex-col border-b lg:w-1/2 lg:border-r lg:border-b-0">
          {(() => {
            const path = learningPaths[0]!
            const Icon = path.icon
            return (
              <div
                className={`group relative flex flex-col justify-between overflow-hidden p-8 transition-all duration-300`}
              >
                <Icon
                  className={`absolute top-2 right-2 text-8xl opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.08]`}
                />
                <div>
                  <div className="mb-4 flex items-center justify-between"></div>
                  <h2 className="mb-3 font-serif text-4xl font-bold tracking-tight">
                    {path.title}
                  </h2>
                  <p className="font-sans text-sm leading-relaxed opacity-60">{path.desc}</p>
                </div>
              </div>
            )
          })()}

          <div className="border-foreground/10 border-t p-8">
            <LessonsTable items={qaLessons} basePath="/lesson" />
          </div>
        </div>

        {/* REALITY CHECK COLUMN */}
        <div className="flex w-full flex-col lg:w-1/2">
          {(() => {
            const path = learningPaths[1]!
            const Icon = path.icon
            return (
              <div
                className={`group relative flex flex-col justify-between overflow-hidden p-8 transition-all duration-300`}
              >
                <Icon
                  className={`absolute top-3 right-3 text-8xl opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.08]`}
                />
                <div>
                  <div className="mb-4 flex items-center justify-between"></div>
                  <h2 className="mb-3 font-serif text-4xl font-bold tracking-tight">
                    {path.title}
                  </h2>
                  <p className="font-sans text-sm leading-relaxed opacity-60">{path.desc}</p>
                </div>
              </div>
            )
          })()}

          <div className="border-foreground/10 border-t p-8">
            <LessonsTable items={realityLessons} basePath="/lesson" />
          </div>
        </div>
      </div>

      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
