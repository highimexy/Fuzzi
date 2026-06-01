'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import { submitLesson } from '@/lib/lessonApi'

type RiskLevel = 'risky' | 'safe' | 'depends'

interface CareerDecision {
  id: string
  decision: string
  correct_risk: RiskLevel
  explanation: string
}

interface RiskMapPayload {
  profile: string
  decisions: CareerDecision[]
  senior_comment: string
}

interface TaskProps {
  lessonId: string
  payload: RiskMapPayload
  nextHref?: string
  isLast?: boolean
  onComplete?: (completed: boolean, xp: number) => void
}

const riskLabels: Record<RiskLevel, string> = {
  risky: 'Ryzykowne',
  safe: 'Bezpieczne',
  depends: 'Zależy',
}

const riskColors: Record<RiskLevel, string> = {
  risky: 'border-rose-500 text-rose-500 bg-rose-500/10',
  safe: 'border-emerald-500 text-emerald-500 bg-emerald-500/10',
  depends: 'border-yellow-500 text-yellow-500 bg-yellow-500/10',
}

export default function RiskMapTask({ lessonId, payload, nextHref, isLast, onComplete }: TaskProps) {
  const [answers, setAnswers] = useState<Record<string, RiskLevel>>({})
  const [submitted, setSubmitted] = useState(false)

  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const allAnswered = payload.decisions.every((d) => answers[d.id])

  const handleSubmit = async () => {
    setSubmitted(true)
    const locale = document.documentElement.lang || 'en'
    try {
      const result = await submitLesson(lessonId, { answer: answers, locale })
      onComplete?.(result.progress?.completed ?? false, result.xp_earned)
    } catch (err) {
      console.error('Submit error:', err)
    }
  }

  useEffect(() => {
    if (submitted && feedbackRef.current)
      gsap.fromTo(feedbackRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' })
    if (submitted && ctaRef.current)
      gsap.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.35, ease: 'power3.out' })
  }, [submitted])

  const setAnswer = (id: string, risk: RiskLevel) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [id]: risk }))
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <span className="text-primary font-sans text-[9px] tracking-[0.3em] uppercase">
        Mapa ryzyka
      </span>

      {/* Profile context */}
      <div className="border-foreground/10 bg-foreground/[0.02] inline-block border px-4 py-2">
        <span className="text-foreground/30 font-sans text-[9px] uppercase tracking-widest">
          Profil:{' '}
        </span>
        <span className="text-foreground/70 font-sans text-sm font-medium">{payload.profile}</span>
      </div>

      {/* Decisions */}
      <div className="flex flex-col gap-4">
        {payload.decisions.map((decision) => {
          const userAnswer = answers[decision.id]
          const correct = submitted && userAnswer === decision.correct_risk

          return (
            <div
              key={decision.id}
              className={`border p-5 transition-colors ${
                submitted
                  ? correct
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-rose-500/30 bg-rose-500/5'
                  : 'border-foreground/10'
              }`}
            >
              <p className="text-foreground/80 mb-4 font-sans text-sm leading-relaxed">
                {decision.decision}
              </p>
              <div className="flex gap-2">
                {(Object.keys(riskLabels) as RiskLevel[]).map((r) => (
                  <button
                    key={r}
                    disabled={submitted}
                    onClick={() => setAnswer(decision.id, r)}
                    className={`flex-1 border px-2 py-2.5 font-sans text-[10px] tracking-widest uppercase transition-colors ${
                      userAnswer === r
                        ? riskColors[r]
                        : 'border-foreground/15 text-foreground/30 hover:border-foreground/40'
                    }`}
                  >
                    {riskLabels[r]}
                  </button>
                ))}
              </div>
              {submitted && (
                <div className="border-foreground/10 mt-3 border-t pt-3">
                  <p className="text-foreground/30 mb-1 font-sans text-[9px] uppercase tracking-widest">
                    Odpowiedź:{' '}
                    <span className={correct ? 'text-emerald-500' : 'text-rose-400'}>
                      {riskLabels[decision.correct_risk]}
                    </span>
                  </p>
                  <p className="text-foreground/50 font-sans text-xs italic">
                    {decision.explanation}
                  </p>
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
          <p className="text-primary mb-3 font-sans text-[9px] tracking-[0.3em] uppercase">
            Komentarz seniora
          </p>
          <p className="text-foreground/70 font-sans text-sm leading-relaxed">
            {payload.senior_comment}
          </p>
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
