'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MarkdownRenderer } from '../../_components/MarkdownRenderer'
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiZap } from 'react-icons/fi'
import { useUserStore } from '@/store/userStore'
import { fetchGroupCompletedLessons } from '@/lib/lessonApi'
import { fireConfetti } from '@/lib/confetti'

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

const _auditTask = dynamic(() => import('./_tasks/AuditTask'), { ssr: false })

const LESSON_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // Group C — multiple choice
  quiz: dynamic(() => import('./_tasks/QuizTask'), { ssr: false }),
  console_detective: dynamic(() => import('./_tasks/ConsoleDetectiveTask'), { ssr: false }),
  // Group A — audit/mark → reveal (all via AuditTask with adapters)
  bullshit_detector: _auditTask,
  salary_decoder: _auditTask,
  cv_audit: _auditTask,
  doc_inspector: _auditTask,
  diff_inspector: _auditTask,
  risk_map: _auditTask,
  triage: _auditTask,
  // Migrated types (legacy JSON → adapted via AuditTask / QuizTask)
  bug_hunt: _auditTask,
  scenario: dynamic(() => import('./_tasks/QuizTask'), { ssr: false }),
  // Skeleton
  code_playground: dynamic(() => import('./_tasks/CodePlaygroundTask'), { ssr: false }),
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
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [completionXP, setCompletionXP] = useState<number | null>(null)

  const isLoggedIn = useUserStore((s) => s.isLoggedIn)

  useEffect(() => {
    if (!isLoggedIn || !lesson.lesson_group_id) return
    fetchGroupCompletedLessons(lesson.lesson_group_id).then((ids) => {
      setCompletedIds(new Set(ids))
    })
  }, [isLoggedIn, lesson.lesson_group_id])

  const titleRaw = locale === 'pl' ? lesson.title_pl : lesson.title_en
  const title = titleRaw || lesson.title_en
  const contentRaw = locale === 'pl' ? lesson.content_pl : lesson.content_en
  const content = contentRaw?.startsWith('## Content Pending')
    ? lesson.content_en
    : contentRaw || lesson.content_en
  const rawPayload = locale === 'pl' ? lesson.payload_pl : lesson.payload_en
  const payload =
    rawPayload && typeof rawPayload === 'object' && Object.keys(rawPayload).length > 0
      ? rawPayload
      : lesson.payload_en
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

  const handleComplete = useCallback((completed: boolean, xp: number) => {
    if (!isLoggedIn) return
    if (completed) {
      setCompletedIds((prev) => new Set([...prev, lesson.id]))
    }
    // Modal tylko na pierwszym zaliczeniu ostatniej sublekcji (xp > 0 = pierwsze podejście)
    if (isLast && xp > 0) {
      fireConfetti()
      setTimeout(() => setCompletionXP(xp), 600)
    }
  }, [isLoggedIn, lesson.id, isLast])

  return (
    <div className="flex h-full w-full flex-col font-sans">
      {/* ── NAWIGACJA SUB-LEKCJI ── */}
      {total > 0 && (
        <div className="border-foreground/10 flex shrink-0 items-center justify-between border-b px-6 py-2 lg:px-8">
          <Link
            href={group ? `/lessons/${group.track}/${group.id}` : '/lessons'}
            className="text-foreground/30 hover:text-foreground/60 inline-flex items-center gap-1.5 font-sans tracking-widest uppercase transition-colors"
          >
            <FiArrowLeft className="shrink-0" />
            <span className="hidden max-w-40 truncate sm:block">{groupTitle ?? 'Lekcje'}</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-foreground/25 font-sans tracking-widest uppercase">
              Sub-lekcja
            </span>
            <div className="flex items-center gap-1.5">
              {sortedSiblings.map((s) => (
                <Link
                  key={s.id}
                  href={`/lesson/${s.id}`}
                  title={locale === 'pl' ? s.title_pl || s.title_en : s.title_en}
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      s.id === lesson.id
                        ? 'bg-foreground h-2 w-2'
                        : completedIds.has(s.id)
                          ? 'bg-primary h-1.5 w-1.5'
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
              <span className="p-1.5 opacity-0"><FiArrowLeft className="text-md" /></span>
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
              <span className="p-1.5 opacity-0"><FiArrowRight className="text-sm" /></span>
            )}
          </div>
        </div>
      )}

      {/* ── GŁÓWNA TREŚĆ ── */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* LEWA: TEORIA */}
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
            {completedIds.has(lesson.id) && (
              <span className="flex items-center gap-1 font-sans text-[10px] tracking-widest uppercase text-emerald-500">
                <FiCheckCircle className="shrink-0" />
                Ukończono
              </span>
            )}
          </div>

          <h1 className="mb-8 font-serif text-3xl font-bold uppercase md:text-4xl">{title}</h1>

          <div className="text-foreground/80 prose prose-invert max-w-none space-y-6 leading-relaxed">
            {content ? (
              <MarkdownRenderer>{content}</MarkdownRenderer>
            ) : (
              'Treść w przygotowaniu...'
            )}
          </div>
        </div>

        {/* PRAWA: ZADANIE */}
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
                onComplete={handleComplete}
              />
            ) : (
              <div className="border-foreground/10 flex flex-1 flex-col items-center justify-center gap-3 border border-dashed p-8 text-center">
                <p className="font-sans text-sm font-bold opacity-40">Ten typ zadania nie jest jeszcze dostępny.</p>
                <p className="font-sans text-xs opacity-25">Typ: {lesson.lesson_type}</p>
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

      {/* ── MODAL UKOŃCZENIA ── */}
      {completionXP !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-background border-foreground/10 relative mx-4 w-full max-w-sm border p-8 text-center">
            <button
              onClick={() => setCompletionXP(null)}
              className="text-foreground/25 hover:text-foreground/60 absolute top-3 right-4 font-sans text-lg transition-colors"
              aria-label="Zamknij"
            >
              ×
            </button>

            <div className="mb-4 flex items-center justify-center gap-2">
              <FiCheckCircle className="text-2xl text-emerald-500" />
            </div>

            <h2 className="font-serif text-2xl font-bold uppercase tracking-tight">
              Lekcja ukończona!
            </h2>

            {completionXP > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 border border-accent/30 bg-accent/5 px-4 py-2">
                <FiZap className="text-accent" />
                <span className="font-mono text-xl font-bold text-accent">+{completionXP} XP</span>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={nextHref}
                onClick={() => setCompletionXP(null)}
                className="bg-foreground text-background block px-8 py-4 font-sans text-sm font-bold tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
              >
                {isLast ? 'Wróć do rozdziału' : 'Następna lekcja'}
              </Link>
              <button
                onClick={() => setCompletionXP(null)}
                className="font-sans text-xs text-foreground/30 transition-colors hover:text-foreground/60"
              >
                Zostań na stronie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
