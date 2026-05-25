'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'

interface LessonDetail {
  id: string
  track: string
  lesson_group_id: string
  order: number
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

interface SubLesson {
  id: string
  order: number
  title_en: string
  title_pl: string
  lesson_type: string
}

interface GroupInfo {
  id: string
  track: string
  title_en: string
  title_pl: string
  lessons: SubLesson[]
}

const LESSON_COMPONENTS: Record<string, React.ComponentType<any>> = {
  quiz: dynamic(() => import('./_tasks/QuizTask'), { ssr: false }),
  dev_comm: dynamic(() => import('./_tasks/DevCommTask'), { ssr: false }),
  salary_decoder: dynamic(() => import('./_tasks/SalaryDecoderTask'), { ssr: false }),
  bullshit_detector: dynamic(() => import('./_tasks/BullshitDetectorTask'), { ssr: false }),
  bug_hunt: dynamic(() => import('./_tasks/BugHuntTask'), { ssr: false }),
  doc_inspector: dynamic(() => import('./_tasks/DocInspectorTask'), { ssr: false }),
  triage: dynamic(() => import('./_tasks/TriageTask'), { ssr: false }),
  diff_inspector: dynamic(() => import('./_tasks/DiffInspectorTask'), { ssr: false }),
  console_detective: dynamic(() => import('./_tasks/ConsoleDetectiveTask'), { ssr: false }),
  test_case_builder: dynamic(() => import('./_tasks/TestCaseBuilderTask'), { ssr: false }),
  scenario: dynamic(() => import('./_tasks/ScenarioTask'), { ssr: false }),
  risk_map: dynamic(() => import('./_tasks/RiskMapTask'), { ssr: false }),
  cv_audit: dynamic(() => import('./_tasks/CvAuditTask'), { ssr: false }),
  interview: dynamic(() => import('./_tasks/InterviewTask'), { ssr: false }),
}

export default function LessonClient({
  lesson,
  locale,
  siblings,
  group,
}: {
  lesson: LessonDetail
  locale: string
  siblings: SubLesson[]
  group: GroupInfo | null
}) {
  const [activeTab, setActiveTab] = useState<'theory' | 'task'>('theory')

  const titleRaw = locale === 'pl' ? lesson.title_pl : lesson.title_en
  const title = titleRaw || lesson.title_en
  const contentRaw = locale === 'pl' ? lesson.content_pl : lesson.content_en
  const content = contentRaw?.startsWith('## Content Pending')
    ? lesson.content_en
    : contentRaw || lesson.content_en
  const rawPayload = locale === 'pl' ? lesson.payload_pl : lesson.payload_en
  const payload = rawPayload?.question ? rawPayload : lesson.payload_en
  const groupTitle = group ? (locale === 'pl' ? group.title_pl : group.title_en) : null

  const TaskComponent = LESSON_COMPONENTS[lesson.lesson_type]

  const sortedSiblings = [...siblings].sort((a, b) => a.order - b.order)
  const currentIdx = sortedSiblings.findIndex((s) => s.id === lesson.id)
  const prevLesson = currentIdx > 0 ? sortedSiblings[currentIdx - 1] : null
  const nextLesson = currentIdx < sortedSiblings.length - 1 ? sortedSiblings[currentIdx + 1] : null
  const total = sortedSiblings.length
  const nextHref = nextLesson
    ? `/lesson/${nextLesson.id}`
    : group
      ? `/lessons/${group.track}/${group.id}`
      : '/lessons'
  const isLast = !nextLesson

  return (
    <div className="flex h-full w-full flex-col font-sans">
      {/* ── NAWIGACJA SUB-LEKCJI ── */}
      {total > 0 && (
        <div className="border-foreground/10 flex shrink-0 items-center justify-between border-b px-6 py-2 lg:px-8">
          {/* Lewa: powrót do rozdziału */}
          <Link
            href={group ? `/lessons/${group.track}/${group.id}` : '/lessons'}
            className="text-foreground/30 hover:text-foreground/60 inline-flex items-center gap-1.5 font-sans tracking-widest uppercase transition-colors"
          >
            <FiArrowLeft className="shrink-0" />
            <span className="hidden max-w-40 truncate sm:block">{groupTitle ?? 'Lekcje'}</span>
          </Link>

          {/* Środek: wskaźnik sub-lekcji */}
          <div className="flex items-center gap-3">
            <span className="text-foreground/25 font-sans tracking-widest uppercase">
              Sub-lekcja
            </span>
            <div className="flex items-center gap-1.5">
              {sortedSiblings.map((s) => (
                <Link key={s.id} href={`/lesson/${s.id}`} title={s.title_en}>
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      s.id === lesson.id
                        ? 'bg-foreground h-2 w-2'
                        : 'bg-foreground/20 hover:bg-foreground/40 h-1.5 w-1.5'
                    }`}
                  />
                </Link>
              ))}
            </div>
            <span className="text-foreground/30 font-sans tabular-nums">
              {String(currentIdx + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
            </span>
          </div>

          {/* Prawa: prev / next */}
          <div className="flex items-center gap-1">
            {prevLesson ? (
              <Link
                href={`/lesson/${prevLesson.id}`}
                className="text-foreground/25 hover:text-foreground/60 rounded p-1.5 transition-colors"
                title={prevLesson.title_en}
              >
                <FiArrowLeft className="text-md" />
              </Link>
            ) : (
              <span className="p-1.5 opacity-0">
                <FiArrowLeft className="text-md" />
              </span>
            )}
            {nextLesson ? (
              <Link
                href={`/lesson/${nextLesson.id}`}
                className="text-foreground/25 hover:text-foreground/60 rounded p-1.5 transition-colors"
                title={nextLesson.title_en}
              >
                <FiArrowRight className="text-md" />
              </Link>
            ) : (
              <span className="p-1.5 opacity-0">
                <FiArrowRight className="text-sm" />
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── GŁÓWNA TREŚĆ ── */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
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
              <TaskComponent
                lessonId={lesson.id}
                payload={payload}
                nextHref={nextHref}
                isLast={isLast}
              />
            ) : (
              <div className="border-foreground/10 flex flex-1 items-center justify-center border border-dashed font-sans text-xs opacity-30">
                [SYSTEM ERROR] Brak modułu dla typu: {lesson.lesson_type}
              </div>
            )}
          </div>
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
