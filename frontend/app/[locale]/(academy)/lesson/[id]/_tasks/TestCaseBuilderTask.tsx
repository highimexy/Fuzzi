'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight, FiPlus, FiX } from 'react-icons/fi'
import { submitLesson } from '@/lib/lessonApi'

type TestCategory = 'happy_path' | 'edge_case' | 'negative'

interface UserCase {
  id: number
  title: string
  category: TestCategory
}

interface ExpectedCase {
  title: string
  category: TestCategory
  why_important: string
}

interface TestCaseBuilderPayload {
  feature_description: string
  task_instruction: string
  expected_cases: ExpectedCase[]
}

interface TaskProps {
  lessonId: string
  payload: TestCaseBuilderPayload
  nextHref?: string
  isLast?: boolean
}

const categoryLabels: Record<TestCategory, string> = {
  happy_path: 'Happy path',
  edge_case: 'Edge case',
  negative: 'Negatywny',
}

const categoryColors: Record<TestCategory, string> = {
  happy_path: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5',
  edge_case: 'text-primary border-primary/30 bg-primary/5',
  negative: 'text-rose-400 border-rose-500/30 bg-rose-500/5',
}

export default function TestCaseBuilderTask({ lessonId, payload, nextHref, isLast }: TaskProps) {
  const nextId = useRef(1)
  const [cases, setCases] = useState<UserCase[]>([{ id: 0, title: '', category: 'happy_path' }])
  const [submitted, setSubmitted] = useState(false)

  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const canSubmit = cases.some((c) => c.title.trim().length > 0)

  const addCase = () => {
    setCases((prev) => [...prev, { id: nextId.current++, title: '', category: 'happy_path' }])
  }

  const removeCase = (id: number) => {
    setCases((prev) => prev.filter((c) => c.id !== id))
  }

  const updateCase = (id: number, field: keyof UserCase, value: string) => {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const handleSubmit = async () => {
    setSubmitted(true)
    const locale = document.documentElement.lang || 'en'
    try {
      await submitLesson(lessonId, { answer: cases, locale })
    } catch {}
  }

  useEffect(() => {
    if (submitted && feedbackRef.current)
      gsap.fromTo(feedbackRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' })
    if (submitted && ctaRef.current)
      gsap.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.35, ease: 'power3.out' })
  }, [submitted])

  const grouped = (Object.keys(categoryLabels) as TestCategory[]).map((cat) => ({
    cat,
    cases: payload.expected_cases.filter((c) => c.category === cat),
  }))

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <span className="text-primary font-sans text-[9px] tracking-[0.3em] uppercase">
        Test Case Builder
      </span>

      <p className="text-foreground/60 font-sans text-sm">{payload.task_instruction}</p>

      {/* User's test cases */}
      <div className="flex flex-col gap-2">
        {cases.map((c, i) => (
          <div key={c.id} className="flex items-center gap-2">
            <span className="text-foreground/20 w-5 shrink-0 font-sans text-[10px] tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <input
              disabled={submitted}
              value={c.title}
              onChange={(e) => updateCase(c.id, 'title', e.target.value)}
              placeholder="Tytuł przypadku testowego..."
              className="border-foreground/20 bg-background placeholder:text-foreground/15 focus:border-foreground/50 min-w-0 flex-1 border p-2.5 font-sans text-sm outline-none transition-colors disabled:opacity-50"
            />
            <select
              disabled={submitted}
              value={c.category}
              onChange={(e) => updateCase(c.id, 'category', e.target.value)}
              className="border-foreground/20 bg-background text-foreground/60 shrink-0 border p-2.5 font-sans text-[10px] uppercase tracking-wide outline-none disabled:opacity-50"
            >
              {(Object.keys(categoryLabels) as TestCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat]}
                </option>
              ))}
            </select>
            {!submitted && cases.length > 1 && (
              <button
                onClick={() => removeCase(c.id)}
                className="text-foreground/20 hover:text-foreground/50 shrink-0 p-1 transition-colors"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>
        ))}

        {!submitted && (
          <button
            onClick={addCase}
            className="border-foreground/10 text-foreground/30 hover:text-foreground/60 mt-1 flex items-center gap-2 border border-dashed px-4 py-2.5 font-sans text-[10px] tracking-widest uppercase transition-colors"
          >
            <FiPlus /> Dodaj przypadek
          </button>
        )}
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

      {/* Expected cases reveal */}
      {submitted && (
        <div ref={feedbackRef} className="flex flex-col gap-4">
          <p className="text-foreground/30 font-sans text-[9px] tracking-[0.3em] uppercase">
            Wzorcowe przypadki testowe
          </p>
          {grouped.map(({ cat, cases: catCases }) =>
            catCases.length === 0 ? null : (
              <div key={cat}>
                <p
                  className={`mb-2 border px-2 py-0.5 font-sans text-[9px] font-bold tracking-widest uppercase ${categoryColors[cat]} inline-block`}
                >
                  {categoryLabels[cat]}
                </p>
                <div className="flex flex-col gap-2">
                  {catCases.map((ec, i) => (
                    <div key={i} className="border-foreground/10 border p-4">
                      <p className="text-foreground/80 mb-1 font-sans text-sm font-medium">
                        {ec.title}
                      </p>
                      <p className="text-foreground/40 font-sans text-xs italic">
                        {ec.why_important}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
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
