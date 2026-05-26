import { useUserStore } from '@/store/userStore'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface LessonSubmitResult {
  correct: boolean
  score: number
  xp_earned: number
  progress: {
    completed: boolean
    score: number
    attempts: number
    xp_earned: number
  }
}

export async function submitLesson(
  lessonId: string,
  body: Record<string, unknown>
): Promise<LessonSubmitResult> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API}/api/v1/lessons/${lessonId}/submit`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error('Submit failed')

  const result: LessonSubmitResult = await res.json()

  if (result.xp_earned > 0) {
    useUserStore.getState().addXP(result.xp_earned)
  }

  return result
}
