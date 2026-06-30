'use client'

import { useState, useRef, useEffect } from 'react'
import { Link } from 'next-view-transitions'
import gsap from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import { submitLesson } from '@/lib/lessonApi'

type SalaryVerdict = 'fair' | 'unfair' | 'depends'

interface RedFlag {
  text: string
  is_red_flag: boolean
}

interface SalaryDecoderPayload {
  job_posting: string
  red_flags: RedFlag[]
  salary_verdict: SalaryVerdict
  fuzzi_comment: string
}

interface TaskProps {
  lessonId: string
  payload: SalaryDecoderPayload
  nextHref?: string
  isLast?: boolean
  onComplete?: (completed: boolean, xp: number) => void
}

const verdictLabels: Record<SalaryVerdict, string> = {
  fair: 'Adekwatne',
  unfair: 'Nieadekwatne',
  depends: 'Zależy',
}

export default function SalaryDecoderTask({ lessonId, payload, nextHref, isLast, onComplete }: TaskProps) {
  const [verdict, setVerdict] = useState<SalaryVerdict | null>(null)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const handleSubmit = async () => {
    setSubmitted(true)

    const locale = document.documentElement.lang || 'en'

    try {
      const result = await submitLesson(lessonId, { answer: verdict, selected_flags: [...selected], locale })
      onComplete?.(result.progress?.completed ?? false, result.xp_earned)
    } catch (err) {
      console.error('Submit error:', err)
    }
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

  const toggleFlag = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const verdictCorrect = verdict === payload.salary_verdict

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {/* Job posting */}
      <div className="border-foreground/10 bg-foreground/[0.02] border p-5">
        <p className="text-foreground/30 mb-3 font-sans text-[9px] tracking-widest uppercase">
          Ogłoszenie o pracę
        </p>
        <p className="text-foreground/75 whitespace-pre-wrap font-sans text-sm leading-relaxed">
          {payload.job_posting}
        </p>
      </div>

      {/* Verdict */}
      <div className="flex flex-col gap-3">
        <span className="text-foreground/50 font-sans text-xs tracking-widest uppercase">
          Czy widełki są adekwatne?
        </span>
        <div className="flex gap-3">
          {(['fair', 'unfair', 'depends'] as const).map((v) => (
            <button
              key={v}
              disabled={submitted}
              onClick={() => setVerdict(v)}
              className={`flex-1 border p-3 font-sans text-xs tracking-widest uppercase transition-colors ${
                verdict === v
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-foreground/20 hover:border-foreground/50'
              }`}
            >
              {verdictLabels[v]}
            </button>
          ))}
        </div>
      </div>

      {/* Red flags */}
      <div className="flex flex-col gap-3">
        <span className="text-foreground/50 font-sans text-xs tracking-widest uppercase">
          Zaznacz red flagi
        </span>
        <div className="flex flex-col gap-2">
          {payload.red_flags.map((flag, i) => {
            const isSelected = selected.has(i)
            const isActualRedFlag = flag.is_red_flag

            let cls =
              'border-foreground/20 text-foreground/70 hover:border-foreground/40'
            if (submitted && isActualRedFlag)
              cls = 'border-rose-500 bg-rose-500/10 text-rose-400'
            else if (submitted && isSelected && !isActualRedFlag)
              cls = 'border-emerald-500/30 bg-emerald-500/5 text-foreground/40'
            else if (!submitted && isSelected)
              cls = 'border-rose-500/40 bg-rose-500/5 text-rose-400'

            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => toggleFlag(i)}
                className={`w-full border p-4 text-left font-sans text-sm transition-all duration-200 ${cls}`}
              >
                {flag.text}
              </button>
            )
          })}
        </div>
      </div>

      {!submitted && verdict && (
        <button
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/90 mt-2 p-4 font-sans text-sm font-bold tracking-widest uppercase text-white transition-colors"
        >
          Zatwierdź
        </button>
      )}

      {submitted && (
        <div ref={feedbackRef} className="flex flex-col gap-4">
          <div
            className={`border-l-2 p-5 ${
              verdictCorrect ? 'border-emerald-500 bg-emerald-500/5' : 'border-rose-500 bg-rose-500/5'
            }`}
          >
            <p
              className={`mb-1 font-sans text-[9px] font-bold tracking-widest uppercase ${
                verdictCorrect ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {verdictCorrect
                ? 'Dobra ocena'
                : `Poprawna ocena: ${verdictLabels[payload.salary_verdict]}`}
            </p>
          </div>

          <div className="border-foreground/10 border p-5">
            <p className="text-primary mb-3 font-sans text-[9px] tracking-[0.3em] uppercase">
              Komentarz Fuzzi
            </p>
            <p className="text-foreground/70 font-sans text-sm leading-relaxed">
              {payload.fuzzi_comment}
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
