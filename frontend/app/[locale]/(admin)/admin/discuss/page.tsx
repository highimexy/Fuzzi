'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { apiFetch } from '@/lib/apiFetch'
import { RiDeleteBinLine, RiThumbUpLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri'

interface Post {
  id: string
  title: string
  body: string
  category: string
  upvotes: number
  views: number
  comment_count: number
  created_at: string
  author: { email: string; name: string }
}

export default function AdminDiscussPage() {
  const t = useTranslations('Admin')
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    apiFetch(`/api/v1/admin/discuss/posts?page=${page}&limit=20`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setPosts(d.posts ?? [])
        setTotal(d.total ?? 0)
      })
      .catch(() => setError(t('error')))
      .finally(() => setLoading(false))
  }, [page, t])

  useEffect(() => {
    load()
  }, [load])

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const deletePost = async (id: string) => {
    if (!confirm(t('discuss.confirmDelete'))) return
    const res = await apiFetch(`/api/v1/admin/discuss/posts/${id}`, { method: 'DELETE' })
    if (res.ok || res.status === 204) load()
  }

  const totalPages = Math.ceil(total / 20)

  const categoryColor: Record<string, string> = {
    bug: 'text-error bg-error/10',
    question: 'text-accent bg-accent/10',
    idea: 'text-primary bg-primary/10',
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/35">
          {total.toLocaleString()} {t('discuss.total')}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold">{t('discuss.title')}</h1>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="overflow-x-auto rounded border border-foreground/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/10">
              {[
                'ID',
                t('discuss.author'),
                t('discuss.postTitle'),
                t('discuss.category'),
                t('discuss.upvotes'),
                t('discuss.createdAt'),
                '',
              ].map((h, i) => (
                <th
                  key={i}
                  className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-foreground/35"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-foreground/35">
                  {t('loading')}
                </td>
              </tr>
            )}
            {!loading && posts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-foreground/35">
                  {t('discuss.empty')}
                </td>
              </tr>
            )}
            {posts.map((p) => {
              const isOpen = expanded.has(p.id)
              return (
                <>
                  <tr
                    key={p.id}
                    className="border-b border-foreground/5 transition-colors last:border-0 hover:bg-foreground/3"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-foreground/40">{p.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{p.author?.name || '—'}</span>
                        <span className="text-xs text-foreground/40">{p.author?.email}</span>
                      </div>
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <span className="line-clamp-1 font-medium">{p.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-medium uppercase ${
                          categoryColor[p.category] ?? 'bg-foreground/5 text-foreground/50'
                        }`}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 tabular-nums text-foreground/50">
                        <RiThumbUpLine className="h-3.5 w-3.5" />
                        {p.upvotes}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground/40">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => toggleExpand(p.id)}
                          title={isOpen ? t('discuss.hideBody') : t('discuss.showBody')}
                          className="rounded border border-foreground/15 p-1.5 text-foreground/40 transition-colors hover:border-foreground/30 hover:text-foreground"
                        >
                          {isOpen ? (
                            <RiEyeOffLine className="h-3.5 w-3.5" />
                          ) : (
                            <RiEyeLine className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => deletePost(p.id)}
                          className="rounded border border-error/30 p-1.5 text-error/60 transition-colors hover:bg-error/5 hover:text-error"
                        >
                          <RiDeleteBinLine className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={`${p.id}-body`} className="border-b border-foreground/5 bg-foreground/2">
                      <td colSpan={7} className="px-4 pb-4 pt-0">
                        <div className="rounded border border-foreground/8 bg-background p-4">
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-foreground/30">
                            {t('discuss.bodyLabel')}
                          </p>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                            {p.body}
                          </p>
                          <div className="mt-3 flex gap-4 text-[10px] text-foreground/35">
                            <span>{t('discuss.views')}: {p.views}</span>
                            <span>{t('discuss.comments')}: {p.comment_count}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-xs text-foreground/35">
            {t('pagination.page', { page })} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border border-foreground/15 px-3 py-1.5 text-xs uppercase transition-colors hover:border-foreground/30 disabled:opacity-30"
            >
              {t('pagination.prev')}
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border border-foreground/15 px-3 py-1.5 text-xs uppercase transition-colors hover:border-foreground/30 disabled:opacity-30"
            >
              {t('pagination.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
