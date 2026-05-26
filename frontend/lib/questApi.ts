import type { Quest, QuestSubmitResult, UserQuestStats, QuestResult } from '@/types/quest'

const API = 'http://localhost:8080/api/v1'

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' }
}

export async function fetchDailyQuest(): Promise<Quest[]> {
  const res = await fetch(`${API}/quest/daily`)
  if (!res.ok) throw new Error('Failed to fetch daily quest')
  const data = await res.json()
  return data.quests
}

export async function fetchQuests(params?: {
  type?: string
  track?: string
  difficulty?: string
}): Promise<Quest[]> {
  const url = new URL(`${API}/quests`)
  if (params?.type) url.searchParams.set('type', params.type)
  if (params?.track) url.searchParams.set('track', params.track)
  if (params?.difficulty) url.searchParams.set('difficulty', params.difficulty)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch quests')
  const data = await res.json()
  return data.quests
}

export async function submitQuestAnswer(
  questId: string,
  answerKey: string
): Promise<QuestSubmitResult> {
  const res = await fetch(`${API}/quest/${questId}/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ answer_key: answerKey }),
  })
  if (!res.ok) throw new Error('Failed to submit answer')
  return res.json()
}

export async function fetchUserQuestStats(): Promise<UserQuestStats> {
  const res = await fetch(`${API}/quest/stats`, { headers: getAuthHeaders() })
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

export async function fetchQuestResult(questId: string): Promise<QuestResult> {
  const res = await fetch(`${API}/quest/${questId}/result`, { headers: getAuthHeaders() })
  if (!res.ok) throw new Error('Failed to fetch quest result')
  return res.json()
}
