'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import { submitLesson } from '@/lib/lessonApi'

interface Phrase {
  phrase: string
  reality: string
}

interface BullshitDetectorPayload {
  quote: string
  source: string
  phrases: Phrase[]
  fuzzi_translation: string
}

interface TaskProps {
  lessonId: string
  payload: BullshitDetectorPayload
  nextHref?: string
  isLast?: boolean
}

export default function BullshitDetectorTask({ lessonId, payload, nextHref, isLast }: TaskProps) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const handleSubmit = async () => {
    setSubmitted(true)

    const locale = document.documentElement.lang || 'en'

    try {
      await submitLesson(lessonId, { answer, locale })
    } catch {}
  }

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
      <span className="text-primary font-sans text-[9px] tracking-[0.3em] uppercase">
        Bullshit Detector
      </span>

      {/* Quote */}
      <div className="border-foreground/10 border p-6">
        <p className="text-foreground/25 mb-4 font-sans text-[9px] tracking-widest uppercase">
          Źródło: {payload.source}
        </p>
        <blockquote className="font-serif text-xl font-bold uppercase leading-snug">
          &ldquo;{payload.quote}&rdquo;
        </blockquote>
      </div>

      <p className="text-foreground/60 font-sans text-sm">
        Co to naprawdę znaczy? Przetłumacz ten żargon na ludzki język.
      </p>

      <textarea
        disabled={submitted}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={5}
        placeholder="Twoje tłumaczenie..."
        className="border-foreground/20 bg-background placeholder:text-foreground/20 focus:border-foreground/50 w-full resize-none border p-4 font-sans text-sm outline-none transition-colors disabled:opacity-50"
      />

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={answer.trim().length < 10}
          className="bg-primary hover:bg-primary/90 disabled:bg-foreground/10 disabled:text-foreground/25 mt-2 p-4 font-sans text-sm font-bold tracking-widest uppercase text-white transition-colors"
        >
          Zatwierdź
        </button>
      )}

      {submitted && (
        <div ref={feedbackRef} className="flex flex-col gap-4">
          {/* Phrase breakdown */}
          <div className="flex flex-col gap-1">
            <p className="text-foreground/25 mb-2 font-sans text-[9px] tracking-[0.3em] uppercase">
              Słownik korporacyjny
            </p>
            {payload.phrases.map((p, i) => (
              <div key={i} className="border-foreground/10 border p-4">
                <p className="text-rose-400 mb-1 font-sans text-[10px] font-bold tracking-wide">
                  &ldquo;{p.phrase}&rdquo;
                </p>
                <p className="text-foreground/60 font-sans text-sm">{p.reality}</p>
              </div>
            ))}
          </div>

          {/* Fuzzi translation */}
          <div className="border-l-2 border-primary bg-primary/5 p-5">
            <p className="text-primary mb-3 font-sans text-[9px] tracking-[0.3em] uppercase">
              Tłumaczenie Fuzzi
            </p>
            <p className="text-foreground/70 font-sans text-sm leading-relaxed">
              {payload.fuzzi_translation}
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
