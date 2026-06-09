'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { FiArrowRight } from 'react-icons/fi'
import { submitLesson } from '@/lib/lessonApi'
import { MarkdownRenderer } from '../../../_components/MarkdownRenderer'

// ── Canonical types ──────────────────────────────────────────────

interface AuditItem {
  text: string
  is_problem: boolean
  reason: string
  category?: string
}

interface AuditPayload {
  intro_label?: string
  material?: string
  material_label?: string
  instruction?: string
  items: AuditItem[]
  verdict?: {
    question: string
    options: { id: string; label: string }[]
    correct: string
  }
  summary?: string
}

// ── Adapters (legacy payload → AuditPayload) ─────────────────────

function adaptBullshitDetector(p: any): AuditPayload {
  return {
    intro_label: 'Bullshit Detector',
    material: p.quote,
    material_label: p.source ? `Źródło: ${p.source}` : undefined,
    items: (p.phrases ?? []).map((ph: any) => ({
      text: ph.phrase,
      is_problem: true,
      reason: ph.reality,
    })),
    summary: p.fuzzi_translation,
  }
}

function adaptSalaryDecoder(p: any): AuditPayload {
  return {
    intro_label: 'Salary Decoder',
    material: p.job_posting,
    material_label: 'Ogłoszenie o pracę',
    items: (p.red_flags ?? []).map((f: any) => ({
      text: f.text,
      is_problem: f.is_red_flag ?? true,
      reason: f.is_red_flag
        ? 'To rzeczywiście red flaga.'
        : 'To nie jest red flaga — standardowy element ogłoszenia.',
    })),
    verdict: {
      question: 'Czy widełki są adekwatne?',
      options: [
        { id: 'fair', label: 'Adekwatne' },
        { id: 'unfair', label: 'Nieadekwatne' },
        { id: 'depends', label: 'Zależy' },
      ],
      correct: p.salary_verdict,
    },
    summary: p.fuzzi_comment,
  }
}

function adaptCvAudit(p: any): AuditPayload {
  return {
    intro_label: 'CV / LinkedIn Audit',
    material: p.cv_fragment,
    material_label: 'Fragment CV',
    items: (p.items ?? []).map((it: any) => ({
      text: it.text,
      is_problem: it.is_problem,
      reason: it.reason,
    })),
    summary: p.fuzzi_audit,
  }
}

function adaptDocInspector(p: any): AuditPayload {
  const variantLabel: Record<string, string> = {
    conflict_finder: 'Znajdź konflikt',
    gap_finder: 'Znajdź lukę',
    ac_writer: 'Napisz Acceptance Criteria',
  }
  const material = (p.documents ?? [])
    .map((d: any) => `${d.label ?? d.title}:\n${d.content}`)
    .join('\n\n---\n\n')
  return {
    intro_label: variantLabel[p.variant] ?? 'Doc Inspector',
    material,
    instruction: p.task_instruction,
    items: (p.checklist ?? []).map((item: string) => ({
      text: item,
      is_problem: false,
      reason: 'Kryterium dobrego rozwiązania.',
    })),
    summary: p.example_answer,
  }
}

function adaptDiffInspector(p: any): AuditPayload {
  const material = [
    p.before_description && `**PRZED:** ${p.before_description}`,
    p.after_description && `**PO:** ${p.after_description}`,
    p.changelog && `**Changelog:**\n${p.changelog}`,
  ]
    .filter(Boolean)
    .join('\n\n')
  return {
    intro_label: 'Diff Inspector',
    material,
    items: (p.changes ?? []).map((c: any) => ({
      text: c.statement ?? c.description ?? '',
      is_problem:
        c.correct_category === 'missing_change' || c.correct_category === 'wrong_change',
      reason: c.explanation ?? '',
      category: c.correct_category,
    })),
    summary: p.summary,
  }
}

function adaptRiskMap(p: any): AuditPayload {
  return {
    intro_label: 'Mapa Ryzyka',
    material: p.profile,
    material_label: 'Profil',
    items: (p.decisions ?? []).map((d: any) => ({
      text: d.decision,
      is_problem: d.correct_risk === 'risky',
      reason: d.explanation ?? '',
      category: d.correct_risk,
    })),
    summary: p.senior_comment,
  }
}

function adaptTriage(p: any): AuditPayload {
  const seniorMap: Record<string, any> = {}
  for (const d of p.senior_decisions ?? []) {
    seniorMap[d.bug_id] = d
  }
  return {
    intro_label: 'Triage',
    items: (p.bugs ?? []).map((bug: any) => {
      const sd = seniorMap[bug.id]
      return {
        text: `${bug.title} — ${bug.description ?? ''}`,
        is_problem:
          sd?.priority === 'this_sprint' || sd?.priority === 'next_sprint',
        reason: sd?.reason ?? '',
        category: sd?.priority,
      }
    }),
    summary: p.senior_comment,
  }
}

function adaptBugHunt(p: any): AuditPayload {
  const specSection = p.spec ? `**Specyfikacja:**\n${p.spec}` : ''
  const htmlSection = p.buggy_html
    ? `**Kod HTML komponentu:**\n\`\`\`html\n${p.buggy_html}\n\`\`\``
    : ''
  const material = [specSection, htmlSection].filter(Boolean).join('\n\n---\n\n')

  const realBug: AuditItem = {
    text: p.model_report?.title ?? 'Rzeczywisty problem z komponentem',
    is_problem: true,
    reason: p.severity_reason ?? '',
  }
  const redHerringItems: AuditItem[] = (p.red_herrings ?? []).map((rh: string) => ({
    text: rh,
    is_problem: false,
    reason: 'To nie jest bug — prawidłowa technika lub decyzja designu.',
  }))

  const stepsRaw = p.model_report?.steps
  const stepsText = Array.isArray(stepsRaw)
    ? stepsRaw.map((s: string) => `- ${s}`).join('\n')
    : typeof stepsRaw === 'string'
    ? stepsRaw
    : ''
  const modelReportMd = p.model_report
    ? [
        `**${p.model_report.title ?? 'Raport buga'}**`,
        stepsText && `**Kroki reprodukcji:**\n${stepsText}`,
        p.model_report.expected && `**Oczekiwane:** ${p.model_report.expected}`,
        p.model_report.actual && `**Rzeczywiste:** ${p.model_report.actual}`,
      ]
        .filter(Boolean)
        .join('\n\n')
    : ''

  const summaryParts = [
    p.severity_reason && `**Uzasadnienie severity:** ${p.severity_reason}`,
    modelReportMd && `---\n\n**Wzorcowy raport:**\n\n${modelReportMd}`,
  ].filter(Boolean)

  return {
    intro_label: 'Bug Hunt',
    material,
    material_label: 'Specyfikacja + HTML komponentu',
    items: [realBug, ...redHerringItems],
    verdict: {
      question: 'Jaka jest waga tego buga?',
      options: [
        { id: 'critical', label: 'Critical' },
        { id: 'high', label: 'High' },
        { id: 'major', label: 'Major' },
        { id: 'minor', label: 'Minor' },
      ],
      correct: p.correct_severity ?? 'major',
    },
    summary: summaryParts.length ? summaryParts.join('\n\n') : undefined,
  }
}

const ADAPTERS: Record<string, (p: any) => AuditPayload> = {
  bullshit_detector: adaptBullshitDetector,
  salary_decoder: adaptSalaryDecoder,
  cv_audit: adaptCvAudit,
  doc_inspector: adaptDocInspector,
  diff_inspector: adaptDiffInspector,
  risk_map: adaptRiskMap,
  triage: adaptTriage,
  bug_hunt: adaptBugHunt,
}

// ── Component ─────────────────────────────────────────────────────

interface TaskProps {
  lessonId: string
  payload: any
  nextHref?: string
  isLast?: boolean
  onComplete?: (completed: boolean, xp: number) => void
}

type ItemVerdict = 'problem' | 'ok' | null

export default function AuditTask({
  lessonId,
  payload: rawPayload,
  nextHref,
  isLast,
  onComplete,
}: TaskProps) {
  const lessonType: string | undefined = rawPayload?.type
  const adapt = lessonType ? ADAPTERS[lessonType] : null
  const payload: AuditPayload = adapt ? adapt(rawPayload) : (rawPayload as AuditPayload)

  const [verdicts, setVerdicts] = useState<Record<number, ItemVerdict>>({})
  const [selectedVerdict, setSelectedVerdict] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const feedbackRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const allItemsAnswered =
    payload.items.length === 0 ||
    payload.items.every((_, i) => verdicts[i] !== undefined && verdicts[i] !== null)
  const verdictRequired = !!payload.verdict
  const canSubmit = allItemsAnswered && (!verdictRequired || selectedVerdict !== null)

  const handleSubmit = async () => {
    setSubmitted(true)
    const locale = document.documentElement.lang || 'en'
    try {
      const result = await submitLesson(lessonId, {
        answer: verdicts,
        verdict: selectedVerdict,
        locale,
      })
      onComplete?.(result.progress?.completed ?? false, result.xp_earned)
    } catch (err) {
      console.error('Submit error:', err)
    }
  }

  useEffect(() => {
    if (submitted && feedbackRef.current)
      gsap.fromTo(
        feedbackRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' },
      )
    if (submitted && ctaRef.current)
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.35, ease: 'power3.out' },
      )
  }, [submitted])

  const setVerdict = (i: number, v: ItemVerdict) => {
    if (submitted) return
    setVerdicts((prev) => ({ ...prev, [i]: v }))
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {payload.intro_label && (
        <span className="text-primary font-sans text-[9px] tracking-[0.3em] uppercase">
          {payload.intro_label}
        </span>
      )}

      {/* Material */}
      {payload.material && (
        <div className="border-foreground/10 bg-foreground/[0.02] border p-5">
          {payload.material_label && (
            <p className="text-foreground/30 mb-3 font-sans text-[9px] tracking-widest uppercase">
              {payload.material_label}
            </p>
          )}
          <div className="prose prose-invert prose-sm max-w-none text-foreground/70 leading-relaxed">
            <MarkdownRenderer>{payload.material}</MarkdownRenderer>
          </div>
        </div>
      )}

      {/* Additional instruction */}
      {payload.instruction && (
        <p className="text-foreground/60 font-sans text-sm">{payload.instruction}</p>
      )}

      {/* Items */}
      {payload.items.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-foreground/50 font-sans text-xs tracking-widest uppercase">
            Oceń każdą pozycję
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
                  className={`mb-3 font-sans text-sm leading-snug ${
                    submitted && item.is_problem ? 'text-rose-400' : 'text-foreground/75'
                  }`}
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
                  <p className="text-foreground/45 mt-3 font-sans text-xs italic">
                    {item.reason}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Verdict */}
      {payload.verdict && (
        <div className="flex flex-col gap-3">
          <span className="text-foreground/50 font-sans text-xs tracking-widest uppercase">
            {payload.verdict.question}
          </span>
          <div className="flex gap-3">
            {payload.verdict.options.map((opt) => (
              <button
                key={opt.id}
                disabled={submitted}
                onClick={() => setSelectedVerdict(opt.id)}
                className={`flex-1 border p-3 font-sans text-xs tracking-widest uppercase transition-colors ${
                  selectedVerdict === opt.id
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-foreground/20 hover:border-foreground/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {submitted && selectedVerdict && (
            <div
              className={`border-l-2 p-4 ${
                selectedVerdict === payload.verdict.correct
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : 'border-rose-500 bg-rose-500/5'
              }`}
            >
              <p
                className={`font-sans text-[9px] font-bold tracking-widest uppercase ${
                  selectedVerdict === payload.verdict.correct
                    ? 'text-emerald-500'
                    : 'text-rose-500'
                }`}
              >
                {selectedVerdict === payload.verdict.correct
                  ? 'Dobra ocena'
                  : `Poprawna: ${payload.verdict.options.find((o) => o.id === payload.verdict!.correct)?.label}`}
              </p>
            </div>
          )}
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="bg-primary hover:bg-primary/90 disabled:bg-foreground/10 disabled:text-foreground/25 p-4 font-sans text-sm font-bold tracking-widest uppercase text-white transition-colors"
        >
          Zatwierdź
        </button>
      )}

      {submitted && (
        <div ref={feedbackRef} className="flex flex-col gap-4">
          {payload.summary && (
            <div className="border-l-2 border-primary bg-primary/5 p-5">
              <p className="text-primary mb-3 font-sans text-[9px] tracking-[0.3em] uppercase">
                Komentarz Fuzzi
              </p>
              <p className="text-foreground/70 font-sans text-sm leading-relaxed">
                {payload.summary}
              </p>
            </div>
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
