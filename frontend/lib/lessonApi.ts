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

const EMPTY_RESULT: LessonSubmitResult = {
  correct: false,
  score: 0,
  xp_earned: 0,
  progress: { completed: false, score: 0, attempts: 0, xp_earned: 0 },
}

export async function fetchGroupCompletedLessons(groupId: string): Promise<string[]> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return []
  try {
    const res = await fetch(`${API}/api/v1/groups/${groupId}/completed-lessons`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.completed ?? []
  } catch {
    return []
  }
}

export async function submitLesson(
  lessonId: string,
  body: Record<string, unknown>
): Promise<LessonSubmitResult> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  if (!token) return EMPTY_RESULT

  try {
    const res = await fetch(`${API}/api/v1/lessons/${lessonId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })

    if (!res.ok) return EMPTY_RESULT

    const result: LessonSubmitResult = await res.json()

    if (result.xp_earned > 0) {
      useUserStore.getState().addXP(result.xp_earned)
    }

    return result
  } catch {
    return EMPTY_RESULT
  }
}
