'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { fetchGroupCompletedLessons } from '@/lib/lessonApi'

interface SubLesson {
  id: string
  order: number
  title_en: string
  title_pl: string
  lesson_type: string
  difficulty: string
}

const lessonTypeLabel: Record<string, string> = {
  quiz: 'Quiz',
  article: 'Artykuł',
  bug_hunt: 'Bug Hunt',
  doc_inspector: 'Doc',
  triage: 'Triage',
  diff_inspector: 'Diff',
  console_detective: 'Console',
  scenario: 'Scenariusz',
  salary_decoder: 'Salary',
  bullshit_detector: 'Bullshit',
  risk_map: 'Ryzyko',
  cv_audit: 'CV',
  audit: 'Audit',
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

interface Props {
  subLessons: SubLesson[]
  groupId: string
  locale: string
}

export function SubLessonList({ subLessons, groupId, locale }: Props) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchGroupCompletedLessons(groupId).then((ids) => {
      setCompletedIds(new Set(ids))
    })
  }, [groupId])

  if (subLessons.length === 0) {
    return (
      <div className="border-foreground/10 text-foreground/20 flex h-40 items-center justify-center border border-dashed font-sans text-xs">
        Brak lekcji
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {subLessons.map((sub, i) => {
        const subTitle = locale === 'pl' ? sub.title_pl : sub.title_en
        const typeLabel = lessonTypeLabel[sub.lesson_type] ?? sub.lesson_type
        const subDiffColor = getDifficultyColor(sub.difficulty)
        const isCompleted = completedIds.has(sub.id)

        return (
          <Link
            key={sub.id}
            href={`/lesson/${sub.id}`}
            className={`group relative flex items-center gap-6 border p-6 transition-all duration-300 ease-out hover:translate-x-0.5 hover:-translate-y-0.5 hover:rounded-md hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)] lg:p-7 ${
              isCompleted
                ? 'border-emerald-500/20 bg-emerald-500/[0.02] hover:border-emerald-500/35'
                : 'border-foreground/10 bg-background hover:border-foreground/25'
            }`}
          >
            {/* Number / Check */}
            <span className="w-6 shrink-0">
              {isCompleted ? (
                <FiCheckCircle className="text-emerald-500 text-base" />
              ) : (
                <span className="text-foreground/20 font-sans text-[10px] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
            </span>

            {/* Title */}
            <span
              className={`flex-1 font-serif text-lg leading-tight font-bold uppercase lg:text-xl ${
                isCompleted ? 'text-foreground/60' : ''
              }`}
            >
              {subTitle}
            </span>

            {/* Badges */}
            <div className="flex shrink-0 items-center gap-3">
              <span
                className={`hidden border px-2 py-0.5 font-sans text-[9px] font-bold tracking-widest uppercase sm:inline ${subDiffColor}`}
              >
                {sub.difficulty}
              </span>
              <span className="border-foreground/10 text-foreground/30 group-hover:border-foreground/25 group-hover:text-foreground/50 border px-2 py-0.5 font-sans text-[9px] tracking-widest uppercase transition-colors">
                {typeLabel}
              </span>
            </div>

            <FiArrowRight className="text-foreground/20 group-hover:text-foreground/50 shrink-0 transition-all duration-200 group-hover:translate-x-0.5" />
          </Link>
        )
      })}
    </div>
  )
}
