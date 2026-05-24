'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight } from 'react-icons/fi'

type Priority = 'this_sprint' | 'next_sprint' | 'backlog' | 'wont_fix'

interface BugItem {
  id: string
  title: string
  description: string
  reporter: string
}

interface SeniorDecision {
  bug_id: string
  priority: Priority
  reason: string
}

interface TriagePayload {
  bugs: BugItem[]
  senior_decisions: SeniorDecision[]
  senior_comment: string
}

interface TaskProps {
  lessonId: string
  payload: TriagePayload
  nextHref?: string
  isLast?: boolean
}

const priorityLabels: Record<Priority, string> = {
  this_sprint: 'Ten sprint',
  next_sprint: 'Nast. sprint',
  backlog: 'Backlog',
  wont_fix: 'Nie naprawiamy',
}

const priorityColors: Record<Priority, string> = {
  this_sprint: 'border-rose-500 text-rose-500 bg-rose-500/10',
  next_sprint: 'border-orange-400 text-orange-400 bg-orange-400/10',
  backlog: 'border-primary text-primary bg-primary/10',
  wont_fix: 'border-foreground/30 text-foreground/50 bg-foreground/5',
}

export default function TriageTask({ lessonId, payload, nextHref, isLast }: TaskProps) {
  const [decisions, setDecisions] = useState<Record<string, Priority>>({})
  const [submitted, setSubmitted] = useState(false)

  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const allAssigned = payload.bugs.every((b) => decisions[b.id])

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
        body: JSON.stringify({ answer: decisions, locale }),
      })
    } catch {}
  }

  useEffect(() => {
    if (submitted && feedbackRef.current)
      gsap.fromTo(feedbackRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' })
    if (submitted && ctaRef.current)
      gsap.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.35, ease: 'power3.out' })
  }, [submitted])

  const setPriority = (bugId: string, priority: Priority) => {
    if (submitted) return
    setDecisions((prev) => ({ ...prev, [bugId]: priority }))
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <span className="text-primary font-sans text-[9px] tracking-[0.3em] uppercase">
        Triage // nadaj priorytety
      </span>

      {/* Bug list */}
      <div className="flex flex-col gap-4">
        {payload.bugs.map((bug) => {
          const userPriority = decisions[bug.id]
          const seniorDecision = payload.senior_decisions.find((d) => d.bug_id === bug.id)
          const correct = submitted && userPriority === seniorDecision?.priority

          return (
            <div
              key={bug.id}
              className={`border p-5 transition-colors ${
                submitted
                  ? correct
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-rose-500/30 bg-rose-500/5'
                  : 'border-foreground/10'
              }`}
            >
              <div className="mb-3">
                <p className="font-serif text-base font-bold uppercase leading-snug">{bug.title}</p>
                <p className="text-foreground/50 mt-1 font-sans text-xs leading-relaxed">
                  {bug.description}
                </p>
                <p className="text-foreground/25 mt-1 font-sans text-[9px] uppercase tracking-widest">
                  Zgłoszone przez: {bug.reporter}
                </p>
              </div>

              {/* Priority buttons */}
              <div className="flex flex-wrap gap-2">
                {(Object.keys(priorityLabels) as Priority[]).map((p) => (
                  <button
                    key={p}
                    disabled={submitted}
                    onClick={() => setPriority(bug.id, p)}
                    className={`border px-3 py-1.5 font-sans text-[9px] tracking-widest uppercase transition-colors ${
                      userPriority === p ? priorityColors[p] : 'border-foreground/15 text-foreground/30 hover:border-foreground/40'
                    }`}
                  >
                    {priorityLabels[p]}
                  </button>
                ))}
              </div>

              {/* After submit: senior decision */}
              {submitted && seniorDecision && (
                <div className="border-foreground/10 mt-3 border-t pt-3">
                  <p className="text-foreground/30 mb-1 font-sans text-[9px] uppercase tracking-widest">
                    Senior:{' '}
                    <span className={`font-bold ${correct ? 'text-emerald-500' : 'text-rose-400'}`}>
                      {priorityLabels[seniorDecision.priority]}
                    </span>
                  </p>
                  <p className="text-foreground/50 font-sans text-xs italic">{seniorDecision.reason}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allAssigned}
          className="bg-primary hover:bg-primary/90 disabled:bg-foreground/10 disabled:text-foreground/25 p-4 font-sans text-sm font-bold tracking-widest uppercase text-white transition-colors"
        >
          Zatwierdź triage
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
