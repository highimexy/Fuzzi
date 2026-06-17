'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import { MarkdownRenderer } from '../../../_components/MarkdownRenderer'
import { submitLesson } from '@/lib/lessonApi'
import { fireConfetti } from '@/lib/confetti'
import { useToast } from '@/app/[locale]/_components/toast/useToast'

type ConfidenceLevel = 'sure' | 'unsure' | null

interface QuizOption {
  id: string
  text: string
  is_correct?: boolean
  explanation?: string
}

interface QuizPayload {
  question: string
  options: QuizOption[]
  correct?: string
  explanation?: string
  trap_explanation?: string
  reflective?: boolean
}

function adaptScenario(p: any): QuizPayload {
  return {
    question: p.situation ?? '',
    options: (p.options ?? []).map((o: any) => ({
      id: o.id,
      text: o.text,
      explanation: [
        o.consequences,
        o.user_percentage !== undefined
          ? `*${o.user_percentage}% uczestników wybrało tę odpowiedź.*`
          : null,
      ]
        .filter(Boolean)
        .join('\n\n'),
    })),
    reflective: true,
  }
}

interface TaskProps {
  lessonId: string
  payload: any
  nextHref?: string
  isLast?: boolean
  onComplete?: (completed: boolean, xp: number) => void
}

export default function QuizTask({ lessonId, payload: rawPayload, nextHref, isLast, onComplete }: TaskProps) {
  const { toast } = useToast()
  const [selected, setSelected] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<ConfidenceLevel>(null)
  const [submitted, setSubmitted] = useState(false)

  const confidenceRef = useRef<HTMLDivElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const payload: QuizPayload =
    rawPayload?.type === 'scenario' ? adaptScenario(rawPayload) : (rawPayload as QuizPayload)

  const isReflective = !!payload.reflective

  // Support both Format 1 (top-level `correct`) and Format 2 (per-option `is_correct`)
  const correctId = isReflective
    ? null
    : payload.correct || payload.options.find((o) => o.is_correct)?.id
  const isCorrect = isReflective ? selected !== null : selected !== null && selected === correctId

  const selectedOption = payload.options.find((o) => o.id === selected)
  const explanation = isReflective
    ? selectedOption?.explanation || ''
    : selectedOption?.explanation ||
      (isCorrect ? payload.explanation : payload.trap_explanation || payload.explanation) ||
      ''

  const handleSubmit = async () => {
    setSubmitted(true)

    if (isCorrect && !isReflective) {
      fireConfetti()
      toast({ variant: 'success', title: 'Poprawna odpowiedź!' })
    }

    const locale = document.documentElement.lang || 'en'

    try {
      const result = await submitLesson(lessonId, {
        answer: selected,
        confidence: isReflective ? null : confidence,
        needs_review: !isReflective && confidence === 'sure' && !isCorrect,
        locale,
      })
      onComplete?.(result.progress?.completed ?? false, result.xp_earned)
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
      <div className="prose prose-invert prose-sm max-w-none font-serif text-xl font-bold uppercase leading-snug">
        <MarkdownRenderer>{payload.question}</MarkdownRenderer>
      </div>

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
              !isReflective && submitted && opt.id === correctId
                ? 'border-correct bg-correct/10 text-correct'
                : ''
            } ${
              !isReflective && submitted && selected === opt.id && !isCorrect
                ? 'border-wrong bg-wrong/10 text-wrong'
                : ''
            } ${
              isReflective && submitted && selected === opt.id
                ? 'border-primary bg-primary/10'
                : ''
            }`}
          >
            {opt.text}
          </button>
        ))}
      </div>

      {/* Confidence meter — tylko dla trybu klasycznego */}
      {!isReflective && !submitted && selected && (
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

      {/* Przycisk akcji — tryb klasyczny wymaga confidence, tryb refleksyjny tylko selekcji */}
      {!submitted && (isReflective ? selected : confidence) && (
        <button
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/90 mt-4 p-4 text-sm font-bold tracking-widest text-white uppercase transition-colors"
        >
          {isReflective ? 'Sprawdź konsekwencje' : 'Zatwierdź'}
        </button>
      )}

      {/* Feedback po submicie */}
      {submitted && (
        <div
          ref={feedbackRef}
          className={`mt-4 border-l-2 p-6 ${
            isReflective
              ? 'border-primary bg-primary/5'
              : isCorrect
              ? 'border-correct bg-correct/5'
              : 'border-wrong bg-wrong/5'
          }`}
        >
          {!isReflective && (
            <p
              className={`mb-3 font-sans text-xs font-bold tracking-widest uppercase ${
                isCorrect ? 'text-correct' : 'text-wrong'
              }`}
            >
              {isCorrect ? 'STATUS: SUCCESS' : 'STATUS: FAILURE'}
            </p>
          )}
          {isReflective && (
            <p className="text-primary mb-3 font-sans text-xs font-bold tracking-widest uppercase">
              Konsekwencje
            </p>
          )}
          {explanation && (
            <div className="prose prose-invert prose-sm max-w-none text-foreground/80 leading-relaxed">
              <MarkdownRenderer>{explanation}</MarkdownRenderer>
            </div>
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
