const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const v1 = `${API}/api/v1`

export interface ProfileUser {
  id: number
  auth0_id: string
  email: string
  name: string
  bio: string
  avatar_url: string
  location: string
  website: string
  twitter: string
  linkedin: string
  github: string
  karma: number
  created_at: string
}

export interface ProfileStats {
  total_xp: number
  current_streak: number
  longest_streak: number
  total_correct: number
  total_attempts: number
}

export interface MyProfile {
  user: ProfileUser
  stats: ProfileStats
  post_count: number
  rank: number
}

export interface PublicProfileFull {
  id: number
  auth0_id: string
  name: string
  bio: string
  avatar_url: string
  location: string
  website: string
  twitter: string
  linkedin: string
  github: string
  karma: number
  created_at: string
  post_count: number
  total_xp: number
  current_streak: number
  total_correct: number
}

export interface RankingRow {
  auth0_id: string
  user_id: number
  name: string
  avatar_url: string
  total_xp: number
  lessons_solved: number
}

export type ProfilePatch = Partial<
  Pick<ProfileUser, 'name' | 'bio' | 'location' | 'website' | 'twitter' | 'linkedin' | 'github' | 'avatar_url'>
>

export async function fetchMyProfile(token: string): Promise<MyProfile> {
  const res = await fetch(`${v1}/me/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

export async function updateMyProfile(token: string, patch: ProfilePatch): Promise<{ user: ProfileUser }> {
  const res = await fetch(`${v1}/me/profile`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? 'Failed to update profile')
  }
  return res.json()
}

export async function deleteMyAccount(token: string): Promise<void> {
  const res = await fetch(`${v1}/me`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to delete account')
}

export async function fetchPublicProfileFull(id: string | number): Promise<PublicProfileFull> {
  const res = await fetch(`${v1}/users/${id}`)
  if (!res.ok) throw new Error('User not found')
  return res.json()
}

export async function fetchUserPosts(id: string | number): Promise<{ posts: import('./discussApi').DiscussPost[] }> {
  const res = await fetch(`${v1}/users/${id}/posts`)
  if (!res.ok) throw new Error('Failed to fetch user posts')
  return res.json()
}

export async function uploadAvatar(token: string, file: File): Promise<{ avatar_url: string }> {
  const form = new FormData()
  form.append('avatar', file)
  const res = await fetch(`${v1}/me/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? 'Upload failed')
  }
  return res.json()
}

export async function fetchRanking(limit = 10): Promise<RankingRow[]> {
  const res = await fetch(`${v1}/ranking?limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch ranking')
  const data = await res.json()
  return data.ranking ?? []
}
