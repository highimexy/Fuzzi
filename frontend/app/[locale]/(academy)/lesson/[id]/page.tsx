import { notFound } from 'next/navigation'
import LessonClient from './LessonClient'

interface LessonDetail {
  id: string
  track: string
  lesson_group_id: string
  order: number
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

interface SubLesson {
  id: string
  order: number
  title_en: string
  title_pl: string
  lesson_type: string
}

interface GroupInfo {
  id: string
  track: string
  title_en: string
  title_pl: string
  lessons: SubLesson[]
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

async function getGroup(groupId: string): Promise<GroupInfo | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/groups/${groupId}`, {
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

  const group = lesson.lesson_group_id ? await getGroup(lesson.lesson_group_id) : null
  const siblings = group?.lessons ?? []

  return <LessonClient lesson={lesson} locale={locale} siblings={siblings} group={group} />
}
