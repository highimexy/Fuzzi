'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { apiFetch } from '@/lib/apiFetch'
import { RiAddLine, RiEditLine, RiCloseLine, RiFlashlightLine } from 'react-icons/ri'

interface Quest {
  id: string
  type: string
  track: string
  difficulty: string
  title_en: string
  title_pl: string
  body_en: string
  body_pl: string
  options: unknown
  correct_key: string
  explain_en: string
  explain_pl: string
  xp: number
  active_date: string
  created_at: string
}

const emptyForm = {
  type: '',
  track: '',
  difficulty: '',
  title_en: '',
  title_pl: '',
  body_en: '',
  body_pl: '',
  options: '[]',
  correct_key: '',
  explain_en: '',
  explain_pl: '',
  xp: '10',
  active_date: '',
}

type FormState = typeof emptyForm

const DIFF_COLORS: Record<string, string> = {
  easy: 'text-primary bg-primary/10',
  medium: 'text-accent bg-accent/10',
  hard: 'text-error bg-error/10',
}

export default function AdminQuestsPage() {
  const t = useTranslations('Admin')
  const [quests, setQuests] = useState<Quest[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    apiFetch(`/api/v1/admin/quests?page=${page}&limit=20`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setQuests(d.quests ?? [])
        setTotal(d.total ?? 0)
      })
      .catch(() => setError(t('error')))
      .finally(() => setLoading(false))
  }, [page, t])

  useEffect(() => {
    load()
  }, [load])

  const openNew = () => {
    setForm(emptyForm)
    setEditing('')
    setError('')
  }

  const openEdit = (q: Quest) => {
    setForm({
      type: q.type,
      track: q.track,
      difficulty: q.difficulty,
      title_en: q.title_en,
      title_pl: q.title_pl,
      body_en: q.body_en,
      body_pl: q.body_pl,
      options:
        typeof q.options === 'string' ? q.options : JSON.stringify(q.options, null, 2),
      correct_key: q.correct_key,
      explain_en: q.explain_en,
      explain_pl: q.explain_pl,
      xp: String(q.xp),
      active_date: q.active_date,
    })
    setEditing(q.id)
    setError('')
  }

  const closeForm = () => {
    setEditing(null)
    setError('')
  }

  const f =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const save = async () => {
    let options: unknown
    try {
      options = JSON.parse(form.options)
    } catch {
      setError('Options: nieprawidłowy JSON')
      return
    }

    const payload = { ...form, options, xp: Number(form.xp) || 10 }
    const isNew = editing === ''
    const res = await apiFetch(
      isNew ? '/api/v1/admin/quests' : `/api/v1/admin/quests/${editing}`,
      {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    )
    if (!res.ok) {
      setError(t('error'))
      return
    }
    closeForm()
    load()
  }

  const totalPages = Math.ceil(total / 20)

  const inputCls =
    'w-full border border-foreground/15 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-foreground/40'
  const labelCls = 'mb-1 block text-[10px] font-semibold uppercase tracking-widest text-foreground/40'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/35">
            {total.toLocaleString()} {t('quests.total')}
          </p>
          <h1 className="mt-1 font-serif text-2xl font-bold">{t('quests.title')}</h1>
        </div>
        {editing === null && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 border border-accent/30 bg-accent/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent/10"
          >
            <RiAddLine className="h-4 w-4" />
            {t('quests.new')}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      {/* Form */}
      {editing !== null && (
        <div className="rounded border border-foreground/15 bg-background">
          <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
            <h2 className="font-serif text-lg font-bold">
              {editing === '' ? t('quests.new') : t('quests.edit')}
            </h2>
            <button
              onClick={closeForm}
              className="text-foreground/40 transition-colors hover:text-foreground"
            >
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ['type', 'type'],
                  ['track', 'track'],
                  ['difficulty', 'difficulty'],
                  ['correct_key', 'correctKey'],
                  ['xp', 'xp'],
                  ['active_date', 'activeDate'],
                ] as [keyof FormState, string][]
              ).map(([key, labelKey]) => (
                <div key={key}>
                  <label className={labelCls}>{t(`quests.${labelKey}`)}</label>
                  <input type="text" value={form[key]} onChange={f(key)} className={inputCls} />
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {(
                [
                  ['title_en', 'titleEn'],
                  ['title_pl', 'titlePl'],
                  ['body_en', 'bodyEn'],
                  ['body_pl', 'bodyPl'],
                  ['explain_en', 'explainEn'],
                  ['explain_pl', 'explainPl'],
                ] as [keyof FormState, string][]
              ).map(([key, labelKey]) => (
                <div key={key}>
                  <label className={labelCls}>{t(`quests.${labelKey}`)}</label>
                  <textarea rows={3} value={form[key]} onChange={f(key)} className={inputCls} />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className={labelCls}>{t('quests.options')}</label>
              <textarea
                rows={6}
                value={form.options}
                onChange={f('options')}
                className={`${inputCls} font-mono text-xs`}
              />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={save}
                className="border border-accent/30 bg-accent/10 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent/20"
              >
                {t('quests.save')}
              </button>
              <button
                onClick={closeForm}
                className="border border-foreground/15 px-5 py-2 text-xs uppercase tracking-wide transition-colors hover:bg-foreground/5"
              >
                {t('quests.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded border border-foreground/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/10">
              {[
                'ID',
                t('quests.type'),
                t('quests.track'),
                t('quests.difficulty'),
                t('quests.titleEn'),
                t('quests.xp'),
                t('quests.activeDate'),
                '',
              ].map((h, i) => (
                <th
                  key={i}
                  className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-foreground/35"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-foreground/35">
                  {t('loading')}
                </td>
              </tr>
            )}
            {!loading && quests.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-foreground/35">
                  {t('quests.empty')}
                </td>
              </tr>
            )}
            {quests.map((q) => (
              <tr
                key={q.id}
                className="border-b border-foreground/5 transition-colors last:border-0 hover:bg-foreground/3"
              >
                <td className="px-4 py-3 font-mono text-xs text-foreground/40">{q.id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-xs uppercase text-foreground/60">{q.type}</td>
                <td className="px-4 py-3 text-xs uppercase text-foreground/60">{q.track}</td>
                <td className="px-4 py-3">
                  {q.difficulty && (
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium uppercase ${
                        DIFF_COLORS[q.difficulty] ?? 'bg-foreground/5 text-foreground/50'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  )}
                </td>
                <td className="max-w-xs px-4 py-3">
                  <span className="line-clamp-1">{q.title_en}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 tabular-nums text-foreground/60">
                    <RiFlashlightLine className="h-3.5 w-3.5 text-accent" />
                    {q.xp}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-foreground/40">{q.active_date || '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openEdit(q)}
                    className="rounded border border-foreground/15 p-1.5 text-foreground/50 transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    <RiEditLine className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-xs text-foreground/35">
            {t('pagination.page', { page })} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border border-foreground/15 px-3 py-1.5 text-xs uppercase transition-colors hover:border-foreground/30 disabled:opacity-30"
            >
              {t('pagination.prev')}
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border border-foreground/15 px-3 py-1.5 text-xs uppercase transition-colors hover:border-foreground/30 disabled:opacity-30"
            >
              {t('pagination.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
