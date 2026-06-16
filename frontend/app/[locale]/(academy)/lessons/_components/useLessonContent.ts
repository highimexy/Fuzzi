'use client'

import { useState, useEffect } from 'react'

/* ════════════════════════════════════════════════════════════════════════
   useLessonContent — pobiera treść dla otwartego notesu.

   Hierarchia danych (zgodna z faktycznym API, nie z uproszczeniem planu §1):
     TOC (track.lessons[i])  = GRUPA / rozdział  → /api/v1/groups/{id}
        └─ sub-lekcja         = LEKCJA z treścią  → /api/v1/lessons/{id}
             └─ sekcje ##      = „strony" do flipowania

   Hook bierze id GRUPY + indeks sub-lekcji i zwraca:
   • listę sub-lekcji grupy,
   • treść bieżącej sub-lekcji rozbitą na sekcje po nagłówkach `## `,
   • tytuł sub-lekcji, stan loading/error.
   ════════════════════════════════════════════════════════════════════════ */

const API = process.env.NEXT_PUBLIC_API_URL

export interface SubLessonItem {
  id: string
  order: number
  title_en: string
  title_pl: string
  lesson_type: string
}

export interface Section {
  heading: string
  body: string
}

interface GroupResp {
  id: string
  lessons: SubLessonItem[]
}

interface LessonResp {
  id: string
  title_en: string
  title_pl: string
  content_en: string
  content_pl: string
}

// Dzieli markdown na sekcje po nagłówkach `## ` (początek linii).
// Każda sekcja zachowuje swój nagłówek w `body`, by MarkdownRenderer go wyrenderował.
export function splitSections(md: string): Section[] {
  const parts = md.split(/^(?=## )/m).filter((p) => p.trim())
  if (parts.length === 0) return [{ heading: '', body: md }]
  return parts.map((raw) => {
    const m = raw.match(/^##\s+(.+)/)
    return { heading: m?.[1] ?? '', body: raw }
  })
}

interface LessonContent {
  subLessons: SubLessonItem[]
  subLesson: SubLessonItem | undefined
  sections: Section[]
  lessonTitle: string
  loading: boolean
  error: boolean
}

export function useLessonContent(
  groupId: string | null,
  subIdx: number,
  locale: string
): LessonContent {
  const [subLessons, setSubLessons] = useState<SubLessonItem[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [lessonTitle, setLessonTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // 1) Grupa → lista sub-lekcji
  useEffect(() => {
    if (!groupId) {
      setSubLessons([])
      return
    }
    let cancelled = false
    fetch(`${API}/api/v1/groups/${groupId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('group'))))
      .then((g: GroupResp) => {
        if (cancelled) return
        const ls = [...(g.lessons ?? [])].sort((a, b) => a.order - b.order)
        setSubLessons(ls)
      })
      .catch(() => {
        if (!cancelled) setSubLessons([])
      })
    return () => {
      cancelled = true
    }
  }, [groupId])

  const subLesson = subLessons[subIdx]
  const subLessonId = subLesson?.id

  // 2) Sub-lekcja → treść → sekcje (z fallbackiem PL→EN jak w LessonClient)
  useEffect(() => {
    if (!subLessonId) {
      setSections([])
      setLessonTitle('')
      return
    }
    let cancelled = false
    setLoading(true)
    setError(false)
    fetch(`${API}/api/v1/lessons/${subLessonId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('lesson'))))
      .then((l: LessonResp) => {
        if (cancelled) return
        const raw = locale === 'pl' ? l.content_pl : l.content_en
        const content = raw && !raw.startsWith('## Content Pending') ? raw : l.content_en
        setSections(splitSections(content ?? ''))
        setLessonTitle((locale === 'pl' ? l.title_pl : l.title_en) || l.title_en)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
        setLoading(false)
        setSections([])
      })
    return () => {
      cancelled = true
    }
  }, [subLessonId, locale])

  return { subLessons, subLesson, sections, lessonTitle, loading, error }
}
