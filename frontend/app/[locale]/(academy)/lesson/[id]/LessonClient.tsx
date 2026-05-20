'use client'

import { useState } from 'react'
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
}

export default function LessonClient({ lesson, locale }: { lesson: LessonDetail; locale: string }) {
  const [activeTab, setActiveTab] = useState<'theory' | 'task'>('theory')

  const title = locale === 'pl' ? lesson.title_pl : lesson.title_en
  const content = locale === 'pl' ? lesson.content_pl : lesson.content_en
  const payload = locale === 'pl' ? lesson.payload_pl : lesson.payload_en

  const TaskComponent = LESSON_COMPONENTS[lesson.lesson_type]

  return (
    <div className="flex h-full w-full flex-col font-sans lg:flex-row">
      {/* LEWA STRONA: TEORIA */}
      <div
        className={`${activeTab === 'theory' ? 'flex' : 'hidden'} border-foreground/10 h-full w-full flex-col overflow-y-auto border-r p-6 pb-24 lg:flex lg:w-1/2 lg:p-12 lg:pb-12`}
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="bg-accent/10 text-accent px-2 py-0.5 font-sans text-[10px] tracking-widest uppercase">
            {lesson.track}
          </span>
          <span className="border-foreground/10 border px-2 py-0.5 font-sans text-[10px] tracking-widest uppercase opacity-50">
            {lesson.difficulty}
          </span>
        </div>

        <h1 className="mb-8 font-serif text-3xl font-bold uppercase md:text-4xl">{title}</h1>

        <div className="text-foreground/80 prose prose-invert max-w-none space-y-6 leading-relaxed">
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          ) : (
            'Treść w przygotowaniu...'
          )}
        </div>
      </div>

      {/* PRAWA STRONA: ZADANIE */}
      <div
        className={`${activeTab === 'task' ? 'flex' : 'hidden'} bg-foreground/2 h-full w-full flex-col overflow-y-auto p-6 pb-24 lg:flex lg:w-1/2 lg:p-12 lg:pb-12`}
      >
        <div className="border-foreground/10 mb-6 flex items-center justify-between border-b pb-4">
          <h2 className="text-foreground/40 font-sans text-sm font-bold tracking-widest uppercase">
            Task Explorer // {lesson.lesson_type}
          </h2>
        </div>

        <div className="flex flex-1 flex-col">
          {TaskComponent ? (
            <TaskComponent lessonId={lesson.id} payload={payload} />
          ) : (
            <div className="border-foreground/10 flex flex-1 items-center justify-center border border-dashed font-sans text-xs opacity-30">
              [SYSTEM ERROR] Brak modułu dla typu: {lesson.lesson_type}
            </div>
          )}
        </div>
      </div>

      {/* MOBILNY SWITCHER */}
      <div className="bg-background border-foreground/10 fixed bottom-0 z-50 flex w-full border-t lg:hidden">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex-1 p-4 font-sans text-xs tracking-widest uppercase ${activeTab === 'theory' ? 'bg-foreground text-background' : 'opacity-50'}`}
        >
          Theory
        </button>
        <button
          onClick={() => setActiveTab('task')}
          className={`flex-1 p-4 font-sans text-xs tracking-widest uppercase ${activeTab === 'task' ? 'bg-foreground text-background' : 'opacity-50'}`}
        >
          Task
        </button>
      </div>
    </div>
  )
}
