'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight, FiChevronDown } from 'react-icons/fi'
import { submitLesson } from '@/lib/lessonApi'

type LogLevel = 'error' | 'warn' | 'info' | 'log'

interface LogEntry {
  level: LogLevel
  message: string
  source?: string
}

interface ConsoleDetectivePayload {
  expected_behavior: string
  logs: LogEntry[]
  hints: string[]
  correct_diagnosis: string
}

interface TaskProps {
  lessonId: string
  payload: ConsoleDetectivePayload
  nextHref?: string
  isLast?: boolean
}

const logStyle: Record<LogLevel, string> = {
  error: 'text-rose-400 bg-rose-500/5',
  warn: 'text-yellow-400 bg-yellow-500/5',
  info: 'text-sky-400',
  log: 'text-foreground/60',
}

const logPrefix: Record<LogLevel, string> = {
  error: '✖ ERROR',
  warn: '⚠ WARN ',
  info: 'ℹ INFO ',
  log: '  LOG  ',
}

export default function ConsoleDetectiveTask({ lessonId, payload, nextHref, isLast }: TaskProps) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hintsRevealed, setHintsRevealed] = useState(0)

  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const handleSubmit = async () => {
    setSubmitted(true)
    const locale = document.documentElement.lang || 'en'
    try {
      await submitLesson(lessonId, { answer, locale })
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
        Console Detective
      </span>

      {/* Console panel */}
      <div className="overflow-hidden rounded-sm border border-foreground/10">
        <div className="bg-foreground/10 flex items-center justify-between px-4 py-2">
          <span className="text-foreground/40 font-mono text-[9px] tracking-widest uppercase">
            DevTools // Console
          </span>
          <span className="text-foreground/20 font-mono text-[9px]">
            {payload.logs.filter((l) => l.level === 'error').length} errors,{' '}
            {payload.logs.filter((l) => l.level === 'warn').length} warnings
          </span>
        </div>
        <div className="bg-foreground/[0.03] flex flex-col divide-y divide-foreground/5 font-mono">
          {payload.logs.map((log, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 px-4 py-2 text-xs ${logStyle[log.level]}`}
            >
              <span className="shrink-0 opacity-60">{logPrefix[log.level]}</span>
              <span className="min-w-0 break-all leading-relaxed">{log.message}</span>
              {log.source && (
                <span className="text-foreground/20 ml-auto shrink-0 text-[9px]">{log.source}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hints */}
      {(payload.hints?.length ?? 0) > 0 && !submitted && (
        <div className="flex flex-col gap-2">
          {(payload.hints ?? []).slice(0, hintsRevealed).map((hint, i) => (
            <div key={i} className="border-foreground/10 bg-foreground/[0.02] border p-3">
              <p className="text-foreground/30 mb-1 font-sans text-[9px] uppercase tracking-widest">
                Podpowiedź {i + 1}
              </p>
              <p className="text-foreground/60 font-sans text-sm">{hint}</p>
            </div>
          ))}
          {hintsRevealed < (payload.hints?.length ?? 0) && (
            <button
              onClick={() => setHintsRevealed((n) => n + 1)}
              className="border-foreground/10 text-foreground/30 hover:text-foreground/60 flex items-center gap-1.5 border px-3 py-2 font-sans text-[9px] tracking-widest uppercase transition-colors"
            >
              <FiChevronDown className="text-sm" />
              Pokaż podpowiedź {hintsRevealed + 1} / {payload.hints?.length ?? 0}
            </button>
          )}
        </div>
      )}

      <p className="text-foreground/60 font-sans text-sm">
        Na podstawie logów — co jest przyczyną problemu? Zdiagnozuj bez klikania w UI.
      </p>

      <textarea
        disabled={submitted}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={5}
        placeholder="Twoja diagnoza..."
        className="border-foreground/20 bg-background placeholder:text-foreground/20 focus:border-foreground/50 w-full resize-none border p-4 font-sans text-sm outline-none transition-colors disabled:opacity-50"
      />

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={answer.trim().length < 10}
          className="bg-primary hover:bg-primary/90 disabled:bg-foreground/10 disabled:text-foreground/25 p-4 font-sans text-sm font-bold tracking-widest uppercase text-white transition-colors"
        >
          Zatwierdź diagnozę
        </button>
      )}

      {submitted && (
        <div ref={feedbackRef} className="border-l-2 border-primary bg-primary/5 p-5">
          <p className="text-primary mb-3 font-sans text-[9px] tracking-[0.3em] uppercase">
            Poprawna diagnoza
          </p>
          <p className="text-foreground/70 font-sans text-sm leading-relaxed">
            {payload.correct_diagnosis}
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
