'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import { submitLesson } from '@/lib/lessonApi'

interface ScenarioOption {
  id: string
  text: string
  user_percentage: number
  consequences: string
}

interface ScenarioPayload {
  situation: string
  options: ScenarioOption[]
}

interface TaskProps {
  lessonId: string
  payload: ScenarioPayload
  nextHref?: string
  isLast?: boolean
}

export default function ScenarioTask({ lessonId, payload, nextHref, isLast }: TaskProps) {
  const [justification, setJustification] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const canSubmit = selected && justification.trim().length > 0

  const handleSubmit = async () => {
    setSubmitted(true)
    const locale = document.documentElement.lang || 'en'
    try {
      await submitLesson(lessonId, { answer: selected, justification, locale })
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

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <span className="text-primary font-sans text-[9px] tracking-[0.3em] uppercase">
        Scenariusz decyzyjny
      </span>

      {/* Situation */}
      <div className="border-foreground/10 bg-foreground/[0.02] border p-5">
        <p className="text-foreground/30 mb-3 font-sans text-[9px] tracking-widest uppercase">
          Sytuacja
        </p>
        <p className="text-foreground/80 font-sans text-sm leading-relaxed">{payload.situation}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        <span className="text-foreground/50 font-sans text-xs tracking-widest uppercase">
          Co robisz?
        </span>
        {payload.options.map((opt) => (
          <button
            key={opt.id}
            disabled={submitted}
            onClick={() => setSelected(opt.id)}
            className={`w-full border p-4 text-left font-sans text-sm transition-all duration-200 ${
              selected === opt.id
                ? 'border-primary bg-primary/10'
                : submitted
                  ? 'border-foreground/20'
                  : 'border-foreground/20 hover:border-foreground/50'
            }`}
          >
            {opt.text}
          </button>
        ))}
      </div>

      {/* Justification */}
      <div>
        <p className="text-foreground/50 mb-2 font-sans text-xs tracking-widest uppercase">
          Uzasadnij swój wybór (1–2 zdania)
        </p>
        <textarea
          disabled={submitted}
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          rows={3}
          placeholder="Dlaczego wybrałeś tę opcję..."
          className="border-foreground/20 bg-background placeholder:text-foreground/20 focus:border-foreground/50 w-full resize-none border p-4 font-sans text-sm outline-none transition-colors disabled:opacity-50"
        />
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="bg-primary hover:bg-primary/90 disabled:bg-foreground/10 disabled:text-foreground/25 p-4 font-sans text-sm font-bold tracking-widest uppercase text-white transition-colors"
        >
          Zatwierdź
        </button>
      )}

      {/* Reveal: % + consequences */}
      {submitted && (
        <div ref={feedbackRef} className="flex flex-col gap-3">
          <p className="text-foreground/30 font-sans text-[9px] tracking-[0.3em] uppercase">
            Jak odpowiedzieli inni użytkownicy Fuzzi
          </p>
          {payload.options.map((opt) => {
            const isChosen = opt.id === selected
            return (
              <div
                key={opt.id}
                className={`border p-4 ${isChosen ? 'border-primary' : 'border-foreground/10'}`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p
                    className={`font-sans text-sm ${isChosen ? 'text-foreground/80 font-medium' : 'text-foreground/50'}`}
                  >
                    {opt.text}
                  </p>
                  <span className={`shrink-0 font-serif text-xl font-bold ${isChosen ? 'text-primary' : 'text-foreground/25'}`}>
                    {opt.user_percentage}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="bg-foreground/10 mb-3 h-1 w-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${isChosen ? 'bg-primary' : 'bg-foreground/20'}`}
                    style={{ width: `${opt.user_percentage}%` }}
                  />
                </div>
                <p className="text-foreground/45 font-sans text-xs italic">{opt.consequences}</p>
              </div>
            )
          })}
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
