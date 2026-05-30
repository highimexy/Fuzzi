const API = 'http://localhost:8080/api/v1'

export interface DiscussAuthor {
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
  upvotes: number
  views: number
  created_at: string
  updated_at: string
  author: DiscussAuthor
}

export async function fetchPosts(sort: 'newest' | 'votes' = 'newest', page = 1): Promise<{ posts: DiscussPost[]; total: number }> {
  const res = await fetch(`${API}/discuss/posts?sort=${sort}&page=${page}&limit=20`)
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export async function createPost(
  token: string,
  payload: { title: string; body: string; tags: string[] }
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
