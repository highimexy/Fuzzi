const API = 'http://localhost:8080/api/v1'

export const DISCUSS_CATEGORIES = [
  { slug: 'general', label: 'General' },
  { slug: 'qa', label: 'QA' },
  { slug: 'career', label: 'Career' },
  { slug: 'feedback', label: 'Feedback' },
] as const

export type CategorySlug = (typeof DISCUSS_CATEGORIES)[number]['slug']

export interface DiscussAuthor {
  id: number
  auth0_id: string
  name: string
  email: string
  avatar_url?: string
}

export interface DiscussPost {
  id: string
  user_id: string
  title: string
  body: string
  tags: string[]
  category: string
  upvotes: number
  views: number
  comment_count: number
  has_voted?: boolean
  created_at: string
  updated_at: string
  author: DiscussAuthor
}

export interface DiscussComment {
  id: string
  post_id: string
  user_id: string
  body: string
  created_at: string
  updated_at: string
  author: DiscussAuthor
}

export function getCategoryLabel(slug: string): string {
  return DISCUSS_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug
}

export async function fetchPosts(
  sort: 'newest' | 'votes' = 'newest',
  page = 1,
  category?: string,
  token?: string,
): Promise<{ posts: DiscussPost[]; total: number }> {
  let url = `${API}/discuss/posts?sort=${sort}&page=${page}&limit=20`
  if (category && category !== 'for-you') url += `&category=${encodeURIComponent(category)}`
  const headers: HeadersInit = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export async function fetchPost(
  id: string,
  token?: string,
): Promise<{ post: DiscussPost; comments: DiscussComment[] }> {
  const headers: HeadersInit = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API}/discuss/posts/${id}`, { headers })
  if (!res.ok) throw new Error('Post not found')
  return res.json()
}

export async function createPost(
  token: string,
  payload: { title: string; body: string; tags: string[]; category: string },
): Promise<DiscussPost> {
  const res = await fetch(`${API}/discuss/posts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? 'Failed to create post')
  }
  return res.json()
}

export async function updatePost(
  token: string,
  id: string,
  payload: { title?: string; body?: string; tags?: string[]; category?: string },
): Promise<DiscussPost> {
  const res = await fetch(`${API}/discuss/posts/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? 'Failed to update post')
  }
  return res.json()
}

export async function deletePost(token: string, id: string): Promise<void> {
  const res = await fetch(`${API}/discuss/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? 'Failed to delete post')
  }
}

export async function votePost(
  token: string,
  id: string,
): Promise<{ upvotes: number; has_voted: boolean }> {
  const res = await fetch(`${API}/discuss/posts/${id}/vote`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? 'Failed to vote')
  }
  return res.json()
}

export async function fetchComments(id: string): Promise<{ comments: DiscussComment[] }> {
  const res = await fetch(`${API}/discuss/posts/${id}/comments`)
  if (!res.ok) throw new Error('Failed to fetch comments')
  return res.json()
}

export async function createComment(
  token: string,
  postId: string,
  body: string,
): Promise<DiscussComment> {
  const res = await fetch(`${API}/discuss/posts/${postId}/comments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? 'Failed to create comment')
  }
  return res.json()
}

export async function deleteComment(token: string, commentId: string): Promise<void> {
  const res = await fetch(`${API}/discuss/comments/${commentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? 'Failed to delete comment')
  }
}

export interface PublicProfile {
  id: number
  name: string
  auth0_id: string
  created_at: string
  post_count: number
}

export async function fetchPublicProfile(id: string | number): Promise<PublicProfile> {
  const res = await fetch(`${API}/users/${id}`)
  if (!res.ok) throw new Error('User not found')
  return res.json()
}

export async function fetchMyPosts(token: string): Promise<{ posts: DiscussPost[]; total: number }> {
  const res = await fetch(`${API}/discuss/my-posts`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}
