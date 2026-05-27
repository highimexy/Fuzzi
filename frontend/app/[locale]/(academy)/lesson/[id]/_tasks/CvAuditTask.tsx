'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import { submitLesson } from '@/lib/lessonApi'

type ItemVerdict = 'problem' | 'ok' | null

interface CvItem {
  text: string
  is_problem: boolean
  reason: string
}

interface CvAuditPayload {
  cv_fragment: string
  items: CvItem[]
  fuzzi_audit: string
}

interface TaskProps {
  lessonId: string
  payload: CvAuditPayload
  nextHref?: string
  isLast?: boolean
}

export default function CvAuditTask({ lessonId, payload, nextHref, isLast }: TaskProps) {
  const [verdicts, setVerdicts] = useState<Record<number, ItemVerdict>>({})
  const [submitted, setSubmitted] = useState(false)

  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const allAnswered = payload.items.every((_, i) => verdicts[i] !== undefined && verdicts[i] !== null)

  const handleSubmit = async () => {
    setSubmitted(true)
    const locale = document.documentElement.lang || 'en'
    try {
      await submitLesson(lessonId, { answer: verdicts, locale })
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

  const setVerdict = (i: number, v: ItemVerdict) => {
    if (submitted) return
    setVerdicts((prev) => ({ ...prev, [i]: v }))
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <span className="text-primary font-sans text-[9px] tracking-[0.3em] uppercase">
        CV / LinkedIn Audit
      </span>

      {/* CV fragment */}
      <div className="border-foreground/10 bg-foreground/[0.02] border p-5">
        <p className="text-foreground/30 mb-3 font-sans text-[9px] tracking-widest uppercase">
          Fragment CV
        </p>
        <p className="text-foreground/70 whitespace-pre-wrap font-sans text-sm leading-relaxed">
          {payload.cv_fragment}
        </p>
      </div>

      {/* Items to evaluate */}
      <div className="flex flex-col gap-2">
        <p className="text-foreground/50 font-sans text-xs tracking-widest uppercase">
          Oceń każdy element CV
        </p>
        {payload.items.map((item, i) => {
          const v = verdicts[i]
          const userCorrect =
            submitted &&
            ((v === 'problem' && item.is_problem) || (v === 'ok' && !item.is_problem))

          return (
            <div
              key={i}
              className={`border p-4 transition-colors ${
                submitted
                  ? userCorrect
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-rose-500/30 bg-rose-500/5'
                  : 'border-foreground/10'
              }`}
            >
              <p
                className={`mb-3 font-sans text-sm leading-snug ${submitted && item.is_problem ? 'text-rose-400' : 'text-foreground/75'}`}
              >
                {item.text}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={submitted}
                  onClick={() => setVerdict(i, 'problem')}
                  className={`flex-1 border px-3 py-2 font-sans text-[10px] tracking-widest uppercase transition-colors ${
                    v === 'problem'
                      ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                      : 'border-foreground/15 text-foreground/30 hover:border-foreground/40'
                  }`}
                >
                  Problem
                </button>
                <button
                  disabled={submitted}
                  onClick={() => setVerdict(i, 'ok')}
                  className={`flex-1 border px-3 py-2 font-sans text-[10px] tracking-widest uppercase transition-colors ${
                    v === 'ok'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                      : 'border-foreground/15 text-foreground/30 hover:border-foreground/40'
                  }`}
                >
                  OK
                </button>
              </div>
              {submitted && (
                <p className="text-foreground/45 mt-3 font-sans text-xs italic">{item.reason}</p>
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
            Audyt Fuzzi
          </p>
          <p className="text-foreground/70 font-sans text-sm leading-relaxed">{payload.fuzzi_audit}</p>
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
