import { useUserStore } from '@/store/userStore'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function apiFetch(path: string, opts: RequestInit = {}): Promise<Response> {
  const store = useUserStore.getState()

  const headers = new Headers(opts.headers as HeadersInit | undefined)
  if (store.token) {
    headers.set('Authorization', `Bearer ${store.token}`)
  }

  let res = await fetch(`${API}${path}`, { ...opts, headers, credentials: 'include' })

  if (res.status !== 401) {
    return res
  }

  const refreshRes = await fetch(`${API}/api/v1/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!refreshRes.ok) {
    useUserStore.getState().logout()
    return res
  }

  const { access_token, expires_in } = await refreshRes.json()
  useUserStore.getState().setToken(access_token, expires_in)

  headers.set('Authorization', `Bearer ${access_token}`)
  res = await fetch(`${API}${path}`, { ...opts, headers, credentials: 'include' })

  if (res.status === 401) {
    useUserStore.getState().logout()
  }

  return res
}
