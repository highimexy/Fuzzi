'use client'

import { useState, useEffect, use } from 'react'
import { useLocale } from 'next-intl'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface LessonDetail {
  id: string
  track: string
  difficulty: string
  status: string
  lesson_type: string
  title_en: string
  title_pl: string
  content_en: string
  content_pl: string
  payload_en: any
  payload_pl: any
}

const LESSON_COMPONENTS: Record<string, React.ComponentType<any>> = {
  quiz: dynamic(() => import('./_tasks/QuizTask'), { ssr: false }),
  // bug_hunt: dynamic(() => import('./_tasks/BugHuntTask'), { ssr: false }),
}

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const lessonId = resolvedParams.id

  const locale = useLocale()
  const [activeTab, setActiveTab] = useState<'theory' | 'task'>('theory')
  const [lesson, setLesson] = useState<LessonDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!lessonId || lessonId === 'undefined') return

    fetch(`http://localhost:8080/api/v1/lessons/${lessonId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Lekcja nie istnieje')
        return res.json()
      })
      .then((data) => {
        setLesson(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Fetch Error:', err)
        setLoading(false)
      })
  }, [lessonId])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center font-mono">
        <span className="text-accent animate-pulse">Loading module {lessonId}...</span>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="text-error flex h-screen items-center justify-center font-mono">
        404 - Lesson not found
      </div>
    )
  }

  const title = locale === 'pl' ? lesson.title_pl : lesson.title_en
  const content = locale === 'pl' ? lesson.content_pl : lesson.content_en
  const payload = locale === 'pl' ? lesson.payload_pl : lesson.payload_en

  // Wyciągamy odpowiedni komponent na podstawie typu lekcji
  const TaskComponent = LESSON_COMPONENTS[lesson.lesson_type]

  return (
    <div className="flex h-full w-full flex-col font-sans lg:flex-row">
      {/* LEWA STRONA: TEORIA */}
      <div
        className={`${activeTab === 'theory' ? 'flex' : 'hidden'} border-foreground/10 h-full w-full flex-col overflow-y-auto border-r p-6 pb-24 lg:flex lg:w-1/2 lg:p-12 lg:pb-12`}
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="bg-accent/10 text-accent px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase">
            {lesson.track}
          </span>
          <span className="border-foreground/10 border px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase opacity-50">
            {lesson.difficulty}
          </span>
        </div>

        <h1 className="mb-8 font-serif text-3xl font-bold uppercase md:text-4xl">{title}</h1>

        {/* ZMIANA 3: Użycie ReactMarkdown do renderowania teorii z bazy */}
        <div className="text-foreground/80 prose prose-invert max-w-none space-y-6 leading-relaxed">
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          ) : (
            'Treść w przygotowaniu...'
          )}
        </div>
      </div>

      {/* PRAWA STRONA: ZADANIE / EDYTOR */}
      <div
        className={`${activeTab === 'task' ? 'flex' : 'hidden'} bg-foreground/2 h-full w-full flex-col overflow-y-auto p-6 pb-24 lg:flex lg:w-1/2 lg:p-12 lg:pb-12`}
      >
        <div className="border-foreground/10 mb-6 flex items-center justify-between border-b pb-4">
          <h2 className="text-foreground/40 font-sans text-sm font-bold tracking-widest uppercase">
            Task Explorer // {lesson.lesson_type}
          </h2>
        </div>

        {/* ZMIANA 4: Dynamiczne renderowanie zadania */}
        <div className="flex flex-1 flex-col">
          {TaskComponent ? (
            <TaskComponent lessonId={lesson.id} payload={payload} />
          ) : (
            <div className="border-foreground/10 flex flex-1 items-center justify-center border border-dashed font-mono text-xs opacity-30">
              [SYSTEM ERROR] Brak modułu dla typu: {lesson.lesson_type}
            </div>
          )}
        </div>
      </div>

      {/* MOBILNY SWITCHER ZAKŁADEK */}
      <div className="bg-background border-foreground/10 fixed bottom-0 z-50 flex w-full border-t lg:hidden">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex-1 p-4 font-mono text-xs tracking-widest uppercase ${activeTab === 'theory' ? 'bg-foreground text-background' : 'opacity-50'}`}
        >
          Theory
        </button>
        <button
          onClick={() => setActiveTab('task')}
          className={`flex-1 p-4 font-mono text-xs tracking-widest uppercase ${activeTab === 'task' ? 'bg-foreground text-background' : 'opacity-50'}`}
        >
          Task
        </button>
      </div>
    </div>
  )
}
