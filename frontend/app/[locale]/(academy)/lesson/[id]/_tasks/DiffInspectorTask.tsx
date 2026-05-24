'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight } from 'react-icons/fi'

type ChangeCategory = 'correct_change' | 'missing_change' | 'wrong_change'

interface ChangeItem {
  id: string
  statement: string
  correct_category: ChangeCategory
  explanation: string
}

interface DiffInspectorPayload {
  changelog: string
  before_description: string
  after_description: string
  changes: ChangeItem[]
  summary: string
}

interface TaskProps {
  lessonId: string
  payload: DiffInspectorPayload
  nextHref?: string
  isLast?: boolean
}

const categoryLabels: Record<ChangeCategory, string> = {
  correct_change: '✓ Poprawnie',
  missing_change: '✗ Brakuje',
  wrong_change: '! Zbędne',
}

const categoryColors: Record<ChangeCategory, string> = {
  correct_change: 'border-emerald-500 text-emerald-500 bg-emerald-500/10',
  missing_change: 'border-rose-500 text-rose-500 bg-rose-500/10',
  wrong_change: 'border-orange-400 text-orange-400 bg-orange-400/10',
}

export default function DiffInspectorTask({ lessonId, payload, nextHref, isLast }: TaskProps) {
  const [answers, setAnswers] = useState<Record<string, ChangeCategory>>({})
  const [submitted, setSubmitted] = useState(false)

  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const allAnswered = payload.changes.every((c) => answers[c.id])

  const handleSubmit = async () => {
    setSubmitted(true)
    const token = localStorage.getItem('token')
    const locale = document.documentElement.lang || 'en'
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${lessonId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ answer: answers, locale }),
      })
    } catch {}
  }

  useEffect(() => {
    if (submitted && feedbackRef.current)
      gsap.fromTo(feedbackRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' })
    if (submitted && ctaRef.current)
      gsap.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.35, ease: 'power3.out' })
  }, [submitted])

  const setAnswer = (id: string, category: ChangeCategory) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [id]: category }))
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <span className="text-primary font-sans text-[9px] tracking-[0.3em] uppercase">
        Diff Inspector
      </span>

      {/* Before / After */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border-foreground/10 bg-foreground/[0.02] border p-4">
          <p className="text-foreground/25 mb-2 font-sans text-[9px] tracking-widest uppercase">
            PRZED
          </p>
          <p className="text-foreground/60 whitespace-pre-wrap font-sans text-xs leading-relaxed">
            {payload.before_description}
          </p>
        </div>
        <div className="border-foreground/10 bg-foreground/[0.02] border p-4">
          <p className="text-foreground/25 mb-2 font-sans text-[9px] tracking-widest uppercase">
            PO
          </p>
          <p className="text-foreground/60 whitespace-pre-wrap font-sans text-xs leading-relaxed">
            {payload.after_description}
          </p>
        </div>
      </div>

      {/* Changelog */}
      <div className="border-foreground/10 border p-4">
        <p className="text-foreground/30 mb-2 font-sans text-[9px] tracking-widest uppercase">
          Changelog
        </p>
        <p className="text-foreground/60 whitespace-pre-wrap font-sans text-xs leading-relaxed">
          {payload.changelog}
        </p>
      </div>

      {/* Change items */}
      <div className="flex flex-col gap-3">
        <p className="text-foreground/30 font-sans text-[9px] tracking-widest uppercase">
          Oceń każdą zmianę
        </p>
        {payload.changes.map((change) => {
          const userAnswer = answers[change.id]
          const correct = submitted && userAnswer === change.correct_category

          return (
            <div
              key={change.id}
              className={`border p-4 transition-colors ${
                submitted
                  ? correct
                    ? 'border-emerald-500/30'
                    : 'border-rose-500/30'
                  : 'border-foreground/10'
              }`}
            >
              <p className="text-foreground/75 mb-3 font-sans text-sm">{change.statement}</p>
              <div className="flex gap-2">
                {(Object.keys(categoryLabels) as ChangeCategory[]).map((cat) => (
                  <button
                    key={cat}
                    disabled={submitted}
                    onClick={() => setAnswer(change.id, cat)}
                    className={`flex-1 border px-2 py-2 font-sans text-[9px] tracking-wide uppercase transition-colors ${
                      userAnswer === cat
                        ? categoryColors[cat]
                        : 'border-foreground/15 text-foreground/30 hover:border-foreground/40'
                    }`}
                  >
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>
              {submitted && (
                <div className="border-foreground/10 mt-3 border-t pt-2">
                  <p className="text-foreground/30 mb-1 font-sans text-[9px] uppercase tracking-widest">
                    Poprawnie:{' '}
                    <span className={correct ? 'text-emerald-500' : 'text-rose-400'}>
                      {categoryLabels[change.correct_category]}
                    </span>
                  </p>
                  <p className="text-foreground/50 font-sans text-xs italic">{change.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="bg-primary hover:bg-primary/90 disabled:bg-foreground/10 disabled:text-foreground/25 p-4 font-sans text-sm font-bold tracking-widest uppercase text-white transition-colors"
        >
          Zatwierdź
        </button>
      )}

      {submitted && (
        <div ref={feedbackRef} className="border-l-2 border-primary bg-primary/5 p-5">
          <p className="text-primary mb-2 font-sans text-[9px] tracking-[0.3em] uppercase">
            Podsumowanie
          </p>
          <p className="text-foreground/70 font-sans text-sm leading-relaxed">{payload.summary}</p>
        </div>
      )}

      {submitted && nextHref && (
        <Link
          ref={ctaRef}
          href={nextHref}
          className="group bg-foreground text-background mt-2 flex items-center justify-between px-8 py-5 font-sans text-sm font-bold tracking-[0.2em] uppercase opacity-0 transition-all duration-200 hover:opacity-90"
        >
          <span>{isLast ? 'Wróć do rozdziału' : 'Następna lekcja'}</span>
          <FiArrowRight className="text-lg transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
