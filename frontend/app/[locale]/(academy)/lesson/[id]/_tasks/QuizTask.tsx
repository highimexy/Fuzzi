'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import { submitLesson } from '@/lib/lessonApi'
import { fireConfetti } from '@/lib/confetti'

type ConfidenceLevel = 'sure' | 'unsure' | null

interface QuizPayload {
  question: string
  options: { id: string; text: string }[]
  correct: string
  explanation: string
  trap_explanation?: string
}

interface TaskProps {
  lessonId: string
  payload: QuizPayload
  nextHref?: string
  isLast?: boolean
}

export default function QuizTask({ lessonId, payload, nextHref, isLast }: TaskProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<ConfidenceLevel>(null)
  const [submitted, setSubmitted] = useState(false)

  const confidenceRef = useRef<HTMLDivElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const isCorrect = selected === payload.correct

  const handleSubmit = async () => {
    setSubmitted(true)

    if (isCorrect) fireConfetti()

    const locale = document.documentElement.lang || 'en'

    try {
      await submitLesson(lessonId, {
        answer: selected,
        confidence,
        needs_review: confidence === 'sure' && !isCorrect,
        locale,
      })
    } catch (err) {
      console.error('Submit network error:', err)
    }
  }

  useEffect(() => {
    if (!submitted && selected && confidenceRef.current) {
      gsap.fromTo(
        confidenceRef.current,
        { opacity: 0, height: 0, overflow: 'hidden' },
        { opacity: 1, height: 'auto', duration: 0.3, ease: 'power2.out' }
      )
    }
  }, [selected, submitted])

  // Animacja GSAP: Pojawienie się feedbacku po odpowiedzi
  useEffect(() => {
    if (submitted && feedbackRef.current) {
      gsap.fromTo(
        feedbackRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' }
      )
    }
    if (submitted && ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.35, ease: 'power3.out' }
      )
    }
  }, [submitted])

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h2 className="font-serif text-xl font-bold uppercase">{payload.question}</h2>

      {/* Wybór odpowiedzi */}
      <div className="flex flex-col gap-3">
        {payload.options.map((opt) => (
          <button
            key={opt.id}
            disabled={submitted}
            onClick={() => {
              setSelected(opt.id)
              setConfidence(null)
            }}
            className={`w-full border p-4 text-left font-sans text-sm transition-all duration-300 ${
              selected === opt.id && !submitted
                ? 'border-primary bg-primary/10'
                : 'border-foreground/20 hover:border-foreground/50'
            } ${
              submitted && opt.id === payload.correct
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                : ''
            } ${
              submitted && selected === opt.id && !isCorrect
                ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                : ''
            }`}
          >
            {opt.text}
          </button>
        ))}
      </div>

      {/* Confidence meter */}
      {!submitted && selected && (
        <div ref={confidenceRef} className="mt-2 flex flex-col gap-3">
          <span className="text-foreground/50 text-xs tracking-widest uppercase">
            Jak bardzo jesteś pewny?
          </span>
          <div className="flex gap-4">
            <button
              onClick={() => setConfidence('sure')}
              className={`flex-1 border p-3 text-xs tracking-widest uppercase transition-colors ${
                confidence === 'sure'
                  ? 'bg-foreground text-background'
                  : 'border-foreground/20 hover:border-foreground/50'
              }`}
            >
              Na 100%
            </button>
            <button
              onClick={() => setConfidence('unsure')}
              className={`flex-1 border p-3 text-xs tracking-widest uppercase transition-colors ${
                confidence === 'unsure'
                  ? 'bg-foreground text-background'
                  : 'border-foreground/20 hover:border-foreground/50'
              }`}
            >
              Strzelam
            </button>
          </div>
        </div>
      )}

      {/* Przycisk akcji */}
      {!submitted && confidence && (
        <button
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/90 mt-4 p-4 text-sm font-bold tracking-widest text-white uppercase transition-colors"
        >
          Zatwierdź Kod
        </button>
      )}

      {/* Feedback po submicie */}
      {submitted && (
        <div
          ref={feedbackRef}
          className={`mt-4 border-l-2 p-6 ${
            isCorrect ? 'border-emerald-500 bg-emerald-500/5' : 'border-rose-500 bg-rose-500/5'
          }`}
        >
          <p
            className={`mb-2 font-sans text-xs font-bold tracking-widest uppercase ${
              isCorrect ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {isCorrect ? 'STATUS: SUCCESS' : 'STATUS: FAILURE'}
          </p>
          <p className="text-foreground/80 text-sm leading-relaxed">{payload.explanation}</p>

          {!isCorrect && payload.trap_explanation && (
            <p className="text-foreground/60 border-foreground/10 mt-4 border-t pt-4 text-xs italic">
              <span className="font-bold text-rose-500">RAPORT BŁĘDU: </span>
              {payload.trap_explanation}
            </p>
          )}
        </div>
      )}

      {/* CTA po ukończeniu */}
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
