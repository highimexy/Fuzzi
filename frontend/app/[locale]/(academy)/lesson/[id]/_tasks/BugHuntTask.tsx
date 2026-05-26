'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import { submitLesson } from '@/lib/lessonApi'

type Severity = 'critical' | 'major' | 'minor'
type Tab = 'page' | 'spec' | 'report'

interface BugHuntPayload {
  buggy_html: string
  spec: string
  correct_severity: Severity
  severity_reason: string
  red_herrings: string[]
  model_report: {
    title: string
    steps: string
    expected: string
    actual: string
  }
}

interface TaskProps {
  lessonId: string
  payload: BugHuntPayload
  nextHref?: string
  isLast?: boolean
}

const severityStyle: Record<Severity, string> = {
  critical: 'border-rose-500 text-rose-500 bg-rose-500/10',
  major: 'border-orange-400 text-orange-400 bg-orange-400/10',
  minor: 'border-yellow-500 text-yellow-500 bg-yellow-500/10',
}

export default function BugHuntTask({ lessonId, payload, nextHref, isLast }: TaskProps) {
  const [tab, setTab] = useState<Tab>('page')
  const [report, setReport] = useState({ title: '', steps: '', expected: '', actual: '' })
  const [severity, setSeverity] = useState<Severity | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const canSubmit = report.title && report.steps && report.expected && report.actual && severity

  const handleSubmit = async () => {
    setSubmitted(true)
    const locale = document.documentElement.lang || 'en'
    try {
      await submitLesson(lessonId, { answer: severity, report, locale })
    } catch {}
  }

  useEffect(() => {
    if (submitted && feedbackRef.current)
      gsap.fromTo(feedbackRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' })
    if (submitted && ctaRef.current)
      gsap.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.35, ease: 'power3.out' })
  }, [submitted])

  const tabLabels: Record<Tab, string> = {
    page: 'Testowana strona',
    spec: 'Specyfikacja',
    report: 'Raport buga',
  }

  const severityCorrect = severity === payload.correct_severity

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {/* Tab bar */}
      <div className="border-foreground/10 flex border-b">
        {(['page', 'spec', 'report'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px px-4 py-2.5 font-sans text-[10px] tracking-widest uppercase transition-colors ${
              tab === t
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-foreground/30 hover:text-foreground/60'
            }`}
          >
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {/* Buggy page (sandboxed iframe — no scripts) */}
      {tab === 'page' && (
        <div className="border-foreground/10 overflow-hidden border">
          <div className="border-foreground/10 bg-foreground/5 flex items-center gap-2 border-b px-3 py-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500/40" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/40" />
            </div>
            <span className="text-foreground/20 font-sans text-[9px] tracking-wide">
              app.example.com
            </span>
          </div>
          <iframe
            sandbox=""
            srcDoc={payload.buggy_html}
            className="h-72 w-full bg-white"
            title="Testowana strona"
          />
        </div>
      )}

      {/* Spec */}
      {tab === 'spec' && (
        <div className="border-foreground/10 bg-foreground/[0.02] border p-5">
          <p className="text-foreground/30 mb-3 font-sans text-[9px] tracking-widest uppercase">
            Specyfikacja / design
          </p>
          <p className="text-foreground/70 whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {payload.spec}
          </p>
        </div>
      )}

      {/* Bug report form */}
      {tab === 'report' && (
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-foreground/30 mb-1.5 block font-sans text-[9px] tracking-widest uppercase">
              Tytuł
            </label>
            <input
              disabled={submitted}
              value={report.title}
              onChange={(e) => setReport({ ...report, title: e.target.value })}
              placeholder="Krótki opis problemu"
              className="border-foreground/20 bg-background placeholder:text-foreground/20 focus:border-foreground/50 w-full border p-3 font-sans text-sm outline-none transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-foreground/30 mb-1.5 block font-sans text-[9px] tracking-widest uppercase">
              Kroki reprodukcji
            </label>
            <textarea
              disabled={submitted}
              value={report.steps}
              onChange={(e) => setReport({ ...report, steps: e.target.value })}
              rows={3}
              placeholder={'1. Otwórz stronę\n2. Kliknij...\n3. Zaobserwuj...'}
              className="border-foreground/20 bg-background placeholder:text-foreground/20 focus:border-foreground/50 w-full resize-none border p-3 font-sans text-sm outline-none transition-colors disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-foreground/30 mb-1.5 block font-sans text-[9px] tracking-widest uppercase">
                Oczekiwane
              </label>
              <textarea
                disabled={submitted}
                value={report.expected}
                onChange={(e) => setReport({ ...report, expected: e.target.value })}
                rows={3}
                placeholder="Co powinno się stać..."
                className="border-foreground/20 bg-background placeholder:text-foreground/20 focus:border-foreground/50 w-full resize-none border p-3 font-sans text-sm outline-none transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-foreground/30 mb-1.5 block font-sans text-[9px] tracking-widest uppercase">
                Aktualne
              </label>
              <textarea
                disabled={submitted}
                value={report.actual}
                onChange={(e) => setReport({ ...report, actual: e.target.value })}
                rows={3}
                placeholder="Co się dzieje..."
                className="border-foreground/20 bg-background placeholder:text-foreground/20 focus:border-foreground/50 w-full resize-none border p-3 font-sans text-sm outline-none transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="text-foreground/30 mb-1.5 block font-sans text-[9px] tracking-widest uppercase">
              Severity
            </label>
            <div className="flex gap-2">
              {(['critical', 'major', 'minor'] as Severity[]).map((s) => (
                <button
                  key={s}
                  disabled={submitted}
                  onClick={() => setSeverity(s)}
                  className={`flex-1 border p-2.5 font-sans text-[10px] tracking-widest uppercase transition-colors ${
                    severity === s ? severityStyle[s] : 'border-foreground/20 text-foreground/40 hover:border-foreground/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bg-primary hover:bg-primary/90 disabled:bg-foreground/10 disabled:text-foreground/25 mt-2 p-4 font-sans text-sm font-bold tracking-widest uppercase text-white transition-colors"
            >
              Zgłoś buga
            </button>
          )}
        </div>
      )}

      {/* Feedback */}
      {submitted && (
        <div ref={feedbackRef} className="mt-2 flex flex-col gap-4">
          <div
            className={`border-l-2 p-5 ${severityCorrect ? 'border-emerald-500 bg-emerald-500/5' : 'border-rose-500 bg-rose-500/5'}`}
          >
            <p
              className={`mb-2 font-sans text-[9px] font-bold tracking-widest uppercase ${severityCorrect ? 'text-emerald-500' : 'text-rose-500'}`}
            >
              {severityCorrect
                ? 'Dobra ocena severity'
                : `Poprawna severity: ${payload.correct_severity.toUpperCase()}`}
            </p>
            <p className="text-foreground/60 font-sans text-sm">{payload.severity_reason}</p>
          </div>

          <div className="border-foreground/10 border p-5">
            <p className="text-primary mb-4 font-sans text-[9px] tracking-[0.3em] uppercase">
              Wzorcowy raport
            </p>
            <div className="flex flex-col gap-2 font-sans text-sm">
              <p>
                <span className="text-foreground/30 text-[9px] uppercase tracking-widest">Tytuł: </span>
                <span className="text-foreground/70">{payload.model_report.title}</span>
              </p>
              <div>
                <span className="text-foreground/30 mb-1 block text-[9px] uppercase tracking-widest">Kroki:</span>
                <span className="text-foreground/70 whitespace-pre-wrap">{payload.model_report.steps}</span>
              </div>
              <p>
                <span className="text-foreground/30 text-[9px] uppercase tracking-widest">Oczekiwane: </span>
                <span className="text-foreground/70">{payload.model_report.expected}</span>
              </p>
              <p>
                <span className="text-foreground/30 text-[9px] uppercase tracking-widest">Aktualne: </span>
                <span className="text-foreground/70">{payload.model_report.actual}</span>
              </p>
            </div>
          </div>

          {payload.red_herrings?.length > 0 && (
            <div className="border-foreground/10 border p-5">
              <p className="text-foreground/30 mb-3 font-sans text-[9px] tracking-[0.3em] uppercase">
                Red herrings (pseudo-bugi)
              </p>
              <ul className="flex flex-col gap-1.5">
                {payload.red_herrings.map((rh, i) => (
                  <li key={i} className="text-foreground/50 flex gap-2 font-sans text-sm">
                    <span className="text-foreground/20 shrink-0">—</span>
                    {rh}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
