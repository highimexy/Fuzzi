'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight, FiCheck } from 'react-icons/fi'

type Variant = 'conflict_finder' | 'gap_finder' | 'ac_writer'

interface DocDocument {
  label: string
  content: string
}

interface DocInspectorPayload {
  variant: Variant
  documents: DocDocument[]
  task_instruction: string
  checklist?: string[]
  example_answer: string
}

interface TaskProps {
  lessonId: string
  payload: DocInspectorPayload
  nextHref?: string
  isLast?: boolean
}

const variantLabel: Record<Variant, string> = {
  conflict_finder: 'Znajdź konflikt',
  gap_finder: 'Znajdź lukę',
  ac_writer: 'Napisz Acceptance Criteria',
}

export default function DocInspectorTask({ lessonId, payload, nextHref, isLast }: TaskProps) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
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

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <span className="text-primary font-sans text-[9px] tracking-[0.3em] uppercase">
        {variantLabel[payload.variant]}
      </span>

      {/* Documents */}
      <div className="flex flex-col gap-3">
        {payload.documents.map((doc, i) => (
          <div key={i} className="border-foreground/10 bg-foreground/[0.02] border p-5">
            <p className="text-foreground/30 mb-3 font-sans text-[9px] tracking-widest uppercase">
              {doc.label}
            </p>
            <p className="text-foreground/70 whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {doc.content}
            </p>
          </div>
        ))}
      </div>

      <p className="text-foreground/60 font-sans text-sm">{payload.task_instruction}</p>

      <textarea
        disabled={submitted}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={7}
        placeholder="Twoja odpowiedź..."
        className="border-foreground/20 bg-background placeholder:text-foreground/20 focus:border-foreground/50 w-full resize-none border p-4 font-sans text-sm outline-none transition-colors disabled:opacity-50"
      />

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={answer.trim().length < 10}
          className="bg-primary hover:bg-primary/90 disabled:bg-foreground/10 disabled:text-foreground/25 p-4 font-sans text-sm font-bold tracking-widest uppercase text-white transition-colors"
        >
          Zatwierdź
        </button>
      )}

      {submitted && (
        <div ref={feedbackRef} className="flex flex-col gap-5">
          {/* Self-check for AC writer */}
          {payload.checklist && payload.checklist.length > 0 && (
            <div className="border-foreground/10 border p-5">
              <p className="text-foreground/30 mb-4 font-sans text-[9px] tracking-[0.3em] uppercase">
                Self-check // oceń swoje AC
              </p>
              <div className="flex flex-col gap-3">
                {payload.checklist.map((item, i) => (
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
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
          className="group bg-foreground text-background mt-6 flex items-center justify-between px-8 py-5 font-sans text-sm font-bold tracking-[0.2em] uppercase opacity-0 transition-all duration-200 hover:opacity-90"
        >
          <span>{isLast ? 'Wróć do rozdziału' : 'Następna lekcja'}</span>
          <FiArrowRight className="text-lg transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
