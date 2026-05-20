import { notFound } from 'next/navigation'
import LessonClient from './LessonClient'

interface LessonDetail {
  id: string
  track: string
  difficulty: string
  status: string
  lesson_type: string
  title_en: string
  title_pl: string
  content_en: string
  content_pl: string
  payload_en: any
  payload_pl: any
}

async function getLesson(id: string): Promise<LessonDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${id}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  const lesson = await getLesson(id)

  if (!lesson) notFound()

  return <LessonClient lesson={lesson} locale={locale} />
}
