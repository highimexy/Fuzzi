'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight, FiChevronDown, FiCheck } from 'react-icons/fi'

interface StarHints {
  s: string
  t: string
  a: string
  r: string
}

interface EvalCriterion {
  criterion: string
}

interface InterviewPayload {
  question: string
  context?: string
  star_hints: StarHints
  evaluation_criteria: EvalCriterion[]
  example_answer: string
}

interface TaskProps {
  lessonId: string
  payload: InterviewPayload
  nextHref?: string
  isLast?: boolean
}

export default function InterviewTask({ lessonId, payload, nextHref, isLast }: TaskProps) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [starOpen, setStarOpen] = useState(false)
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

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
        body: JSON.stringify({ answer, locale }),
      })
    } catch {}
  }

  useEffect(() => {
    if (submitted && feedbackRef.current)
      gsap.fromTo(feedbackRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' })
    if (submitted && ctaRef.current)
      gsap.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.35, ease: 'power3.out' })
  }, [submitted])

  const toggleCheck = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const starEntries: [string, string][] = [
    ['S — Sytuacja', payload.star_hints.s],
    ['T — Zadanie', payload.star_hints.t],
    ['A — Działanie', payload.star_hints.a],
    ['R — Rezultat', payload.star_hints.r],
  ]

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <span className="text-primary font-sans text-[9px] tracking-[0.3em] uppercase">
        Rozmowa kwalifikacyjna // odpowiedź na gorąco
      </span>

      {/* Question */}
      <div className="border-foreground/10 border p-6">
        {payload.context && (
          <p className="text-foreground/30 mb-3 font-sans text-xs italic">{payload.context}</p>
        )}
        <p className="font-serif text-xl font-bold uppercase leading-snug">{payload.question}</p>
      </div>

      {/* STAR hints (collapsible) */}
      <div className="border-foreground/10 border">
        <button
          onClick={() => setStarOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-3"
        >
          <span className="text-foreground/40 font-sans text-[9px] tracking-widest uppercase">
            Struktura STAR // wskazówki
          </span>
          <FiChevronDown
            className={`text-foreground/30 text-sm transition-transform duration-200 ${starOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {starOpen && (
          <div className="border-foreground/10 flex flex-col gap-0 border-t">
            {starEntries.map(([label, hint]) => (
              <div key={label} className="border-foreground/5 flex gap-4 border-b px-4 py-3 last:border-b-0">
                <span className="text-primary w-28 shrink-0 font-sans text-[9px] font-bold uppercase tracking-widest">
                  {label}
                </span>
                <span className="text-foreground/55 font-sans text-xs leading-relaxed">{hint}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <textarea
        disabled={submitted}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={8}
        placeholder="Twoja odpowiedź..."
        className="border-foreground/20 bg-background placeholder:text-foreground/20 focus:border-foreground/50 w-full resize-none border p-4 font-sans text-sm outline-none transition-colors disabled:opacity-50"
      />

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={answer.trim().length < 20}
          className="bg-primary hover:bg-primary/90 disabled:bg-foreground/10 disabled:text-foreground/25 p-4 font-sans text-sm font-bold tracking-widest uppercase text-white transition-colors"
        >
          Zatwierdź odpowiedź
        </button>
      )}

      {submitted && (
        <div ref={feedbackRef} className="flex flex-col gap-5">
          {/* Self-eval checklist */}
          <div className="border-foreground/10 border p-5">
            <p className="text-foreground/30 mb-4 font-sans text-[9px] tracking-[0.3em] uppercase">
              Self-check // oceń swoją odpowiedź
            </p>
            <div className="flex flex-col gap-3">
              {payload.evaluation_criteria.map((ec, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className="flex items-start gap-3 text-left"
                >
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
                      checked.has(i) ? 'border-emerald-500 bg-emerald-500' : 'border-foreground/20'
                    }`}
                  >
                    {checked.has(i) && <FiCheck className="text-background h-2.5 w-2.5" />}
                  </div>
                  <span
                    className={`font-sans text-sm leading-snug transition-colors ${
                      checked.has(i) ? 'text-foreground/70' : 'text-foreground/35'
                    }`}
                  >
                    {ec.criterion}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Model answer */}
          <div className="border-l-2 border-primary bg-primary/5 p-5">
            <p className="text-primary mb-3 font-sans text-[9px] tracking-[0.3em] uppercase">
              Wzorcowa odpowiedź
            </p>
            <p className="text-foreground/70 whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {payload.example_answer}
            </p>
          </div>
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
